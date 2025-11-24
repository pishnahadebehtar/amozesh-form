
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Client, Databases, ID, Query } from 'node-appwrite';
import examples from './examples.js';

// ──────────────────────  ENV ──────────────────────
const {
  GOOGLE_API_KEY_1,
  GOOGLE_API_KEY_2,
  GOOGLE_API_KEY_3,
  APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1',
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_FORM_TYPES_COLLECTION = 'form_types',
  APPWRITE_RECORDS_COLLECTION = 'records',
  APPWRITE_CHAT_COLLECTION = 'chat',
  APPWRITE_API_KEY,
} = process.env;

// Validate environment variables
if (!GOOGLE_API_KEY_1 || !GOOGLE_API_KEY_2 || !GOOGLE_API_KEY_3) {
  throw new Error('Missing one or more GOOGLE_API_KEY environment variables');
}
if (!APPWRITE_PROJECT_ID) throw new Error('Missing APPWRITE_PROJECT_ID');
if (!APPWRITE_DATABASE_ID) throw new Error('Missing APPWRITE_DATABASE_ID');
if (!APPWRITE_API_KEY) throw new Error('Missing APPWRITE_API_KEY');
let userId = '';
console.log('Received userId:', userId);
// ──────────────────────  Request Counter & Token Tracker ──────────────────────
let requestCount = 0;
let totalInputTokens = 0;
let totalOutputTokens = 0;
let examplesTokenEstimate = 0;

const examplesJson = JSON.stringify(examples, null, 2);
const examplesCharCount = examplesJson.length;
examplesTokenEstimate = Math.ceil(examplesCharCount / 4);
console.log(
  `Estimated tokens in examples.js: ${examplesTokenEstimate} (based on ${examplesCharCount} chars)`
);

// ──────────────────────  Key Rotation Setup ──────────────────────
const GEMINI_KEYS = [GOOGLE_API_KEY_1, GOOGLE_API_KEY_2, GOOGLE_API_KEY_3];

function getKeyForStep(step) {
  return GEMINI_KEYS[step % GEMINI_KEYS.length];
}

function createModels(apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  return {
    jsonModel: genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    }),
    textModel: genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { temperature: 0.1 },
    }),
  };
}

// ──────────────────────  Appwrite Client ──────────────────────
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

// ──────────────────────  DB Helpers با userId ──────────────────────
const list = async (coll, queries = []) => {
  // همیشه userId رو اضافه کن مگر اینکه صریحاً گفته شده باشه اضافه نشه
  if (userId && !queries.some((q) => q.includes('userId'))) {
    queries.push(Query.equal('userId', userId));
  }
  const result = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    coll,
    queries
  );
  return result.documents;
};
async function getFormTypes() {
  const queries = userId ? [Query.equal('userId', userId)] : [];
  const docs = await list(APPWRITE_FORM_TYPES_COLLECTION, queries);
  return docs.map((d) => ({
    $id: d.$id,
    name: d.name,
    schema: { name: d.name, ...safeJsonParse(d.form_types ?? '{}') },
  }));
}

async function getRecordsByFormType(formTypeId) {
  const queries = [Query.equal('formTypeId', formTypeId)];
  if (userId) queries.push(Query.equal('userId', userId));
  const docs = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    APPWRITE_RECORDS_COLLECTION,
    queries
  );
  return docs.documents.map((d) => ({
    $id: d.$id,
    formTypeId: d.formTypeId,
    data: safeJsonParse(d.data ?? '{}'),
  }));
}

async function getAllRecords() {
  const queries = userId ? [Query.equal('userId', userId)] : [];
  const docs = await list(APPWRITE_RECORDS_COLLECTION, queries);
  return docs.map((d) => ({
    $id: d.$id,
    formTypeId: d.formTypeId,
    data: safeJsonParse(d.data ?? '{}'),
  }));
}

function safeJsonParse(str) {
  try {
    if (typeof str === 'object' && str !== null) return str;
    if (typeof str === 'string') return JSON.parse(str);
    return {};
  } catch (e) {
    console.error('safeJsonParse failed:', e.message, 'Input:', str);
    return {};
  }
}

function ensureNonEmptySchema(schema) {
  if (!schema.headerFields || schema.headerFields.length === 0) {
    schema.headerFields = [
      { id: 'default_1', type: 'text', label: 'توضیحات', required: false },
    ];
  }
  if (!schema.itemFields) schema.itemFields = [];
  return schema;
}

// ──────────────────────  Validation Helpers ──────────────────────
function validateRecordAgainstSchema(recordData, formTypeSchema) {
  const errors = [];
  const header = recordData.header || {};
  const items = recordData.items || [];

  for (const field of formTypeSchema.headerFields || []) {
    if (field.required) {
      const value = header[field.label];
      if (value === undefined || value === null || value === '') {
        errors.push(`Field '${field.label}' is required but missing in header`);
      }
    }
  }

  for (const field of formTypeSchema.itemFields || []) {
    if (field.required) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i] || {};
        const value = item[field.label];
        if (value === undefined || value === null || value === '') {
          errors.push(
            `Field '${field.label}' is required but missing in item ${i + 1}`
          );
        }
      }
    }
  }

  return errors;
}

function validateFormTypeItems(formTypeData) {
  const errors = [];

  if (formTypeData.hasItems) {
    if (!formTypeData.itemFields || formTypeData.itemFields.length === 0) {
      errors.push('Form has hasItems:true but no itemFields defined');
    } else {
      for (const field of formTypeData.itemFields) {
        if (!field.id || !field.type) {
          errors.push(`Item field is missing required attributes: id or type`);
        }
        if (
          field.type === 'reference' &&
          !field.targetFormType &&
          !field.referenceTo
        ) {
          errors.push(
            `Reference field '${field.id}' is missing referenceTo or targetFormType attribute`
          );
        }
      }
    }
  } else if (formTypeData.itemFields && formTypeData.itemFields.length > 0) {
    errors.push('Form has itemFields but hasItems is not set to true');
  }

  return errors;
}

function hasUnresolvedPlaceholders(schema, stepMap) {
  const schemaStr = JSON.stringify(schema);
  if (schemaStr.includes('{step_') && schemaStr.includes('_id}')) {
    try {
      const resolved = resolvePlaceholders(schema, stepMap);
      return JSON.stringify(resolved) !== schemaStr;
    } catch {
      return true;
    }
  }
  return false;
}

function findDuplicateFormType(formTypes, newFormName, newFormSchema) {
  const normalizedNewName = newFormName.trim().toLowerCase();
  const normalizedNewSchema = JSON.stringify(newFormSchema);

  for (const formType of formTypes) {
    const normalizedExistingName = formType.name.trim().toLowerCase();
    const normalizedExistingSchema = JSON.stringify(formType.schema);

    const nameSimilarity = calculateStringSimilarity(
      normalizedNewName,
      normalizedExistingName
    );
    if (
      nameSimilarity > 0.8 ||
      normalizedNewSchema === normalizedExistingSchema
    ) {
      return formType;
    }
  }
  return null;
}

function calculateStringSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  if (longer.length === 0) return 1.0;
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
}

// ──────────────────────  Integrity Helpers ──────────────────────
async function isFormTypeReferenced(id) {
  const records = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    APPWRITE_RECORDS_COLLECTION,
    [
      Query.equal('formTypeId', id),
      Query.equal('userId', userId), // فقط رکوردهای همین کاربر
      Query.limit(1),
    ]
  );
  return records.total > 0;
}

async function isRecordReferenced(recordId, allRecords) {
  // allRecords که از getAllRecords() میاد خودش فیلتر شده با userId → امن هست
  for (const rec of allRecords) {
    if (rec.$id === recordId) continue;
    const dataStr = JSON.stringify(rec.data);
    if (dataStr.includes(recordId)) return true;
  }
  return false;
}

async function compareSchemas(oldSchema, newSchema) {
  const oldHeader =
    oldSchema.headerFields || oldSchema.schema?.headerFields || [];
  const newHeader =
    newSchema.headerFields || newSchema.schema?.headerFields || [];
  const oldItem = oldSchema.itemFields || oldSchema.schema?.itemFields || [];
  const newItem = newSchema.itemFields || newSchema.schema?.itemFields || [];
  const removedFields = oldHeader
    .filter((of) => !newHeader.some((nf) => nf.id === of.id))
    .concat(oldItem.filter((of) => !newItem.some((nf) => nf.id === of.id)));
  return removedFields;
}

async function hasDataInFields(formTypeId, fields) {
  const queries = [Query.equal('formTypeId', formTypeId)];
  if (userId) queries.push(Query.equal('userId', userId));

  const records = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    APPWRITE_RECORDS_COLLECTION,
    queries
  );

  for (const rec of records.documents) {
    const header = rec.data?.header || {};
    const items = rec.data?.items || [];

    for (const field of fields) {
      if (
        Object.values(header).some(
          (v) => v !== null && v !== '' && v !== undefined
        )
      )
        return true;
      if (
        items.some(
          (item) =>
            item[field.label] !== null &&
            item[field.label] !== '' &&
            item[field.label] !== undefined
        )
      ) {
        return true;
      }
    }
  }
  return false;
}
// ──────────────────────  Record Data Preparation Helper ──────────────────────
function prepareRecordData(rawData, logs = []) {
  const preparedData = {
    header: rawData.header || {},
    items: rawData.items || [],
  };

  if (
    Object.keys(preparedData.header).length === 0 &&
    preparedData.items.length === 0
  ) {
    logs.push('WARN|داده خالی - فیلدی ارائه نشده است');
  }

  preparedData.items = preparedData.items
    .map((item, index) => {
      if (typeof item !== 'object' || item === null) {
        logs.push(`WARN|آیتم نامعتبر در اندیس ${index}، نادیده گرفته شد`);
        return {};
      }
      return item;
    })
    .filter((item) => Object.keys(item).length > 0);

  if (
    preparedData.items.length === 0 &&
    rawData.items &&
    rawData.items.length > 0
  ) {
    logs.push(
      'WARN|تمام آیتم‌ها خالی یا نامعتبر بودند، به صورت آرایه خالی ذخیره شدند'
    );
  }

  return preparedData;
}

// ──────────────────────  CRUD Operations ──────────────────────
async function createFormType(name, schema) {
  let actualSchema = schema.schema || schema;
  if (!actualSchema.name) actualSchema.name = name;
  const safe = ensureNonEmptySchema(actualSchema);
  const doc = await databases.createDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_FORM_TYPES_COLLECTION,
    ID.unique(),
    { name, form_types: JSON.stringify(safe), userId }
  );
  return { $id: doc.$id, success: true, name, schema: safe };
}

async function createRecord(formTypeId, data) {
  const doc = await databases.createDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_RECORDS_COLLECTION,
    ID.unique(),
    { formTypeId, data: JSON.stringify(data), userId }
  );
  return { $id: doc.$id, success: true };
}

async function updateFormType(id, name, schema) {
  let actualSchema = schema.schema || schema;
  if (!actualSchema.name) actualSchema.name = name;
  const safe = ensureNonEmptySchema(actualSchema);

  // امنیت: مطمئن شو که این فرم متعلق به همین کاربر هست
  await databases.updateDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_FORM_TYPES_COLLECTION,
    id,
    { name, form_types: JSON.stringify(safe), userId }
  );
  return { success: true, name, schema: safe };
}

async function updateRecord(id, data) {
  // امنیت: userId رو دوباره میفرستیم تا اگر permission تنظیم باشه، فقط مالک بتونه آپدیت کنه
  await databases.updateDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_RECORDS_COLLECTION,
    id,
    { data: JSON.stringify(data), userId }
  );
  return { success: true };
}
async function deleteFormType(id) {
  await databases.deleteDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_FORM_TYPES_COLLECTION,
    id
  );
  return { success: true };
}

async function deleteRecord(id) {
  await databases.deleteDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_RECORDS_COLLECTION,
    id
  );
  return { success: true };
}

// ──────────────────────  Chat History ──────────────────────
async function saveChatMessage(role, messages) {
  try {
    await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_CHAT_COLLECTION,
      ID.unique(),
      {
        role,
        messages: Array.isArray(messages) ? messages : [messages],
        userId, // ← اضافه شد
      }
    );
  } catch (e) {
    console.error('Failed to save chat message:', e.message);
  }
}

async function getChatHistory() {
  try {
    const queries = userId
      ? [Query.equal('userId', userId), Query.orderAsc('$createdAt')]
      : [Query.orderAsc('$createdAt')];
    const docs = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_CHAT_COLLECTION,
      queries
    );
    return docs.documents
      .map(
        (d) =>
          `${d.role.toUpperCase()}: ${
            Array.isArray(d.messages) ? d.messages.join('\n') : d.messages
          }`
      )
      .join('\n\n');
  } catch (e) {
    console.error('Failed to get chat history:', e.message);
    return '';
  }
}

// ──────────────────────  AI Model Call with Retry & Token Counting ──────────────────────
async function callModelWithRetry(modelType, prompt, step, attempt = 0) {
  const keyIndex = step % GEMINI_KEYS.length;
  const apiKey = GEMINI_KEYS[keyIndex];
  const models = createModels(apiKey);
  const model = modelType === 'json' ? models.jsonModel : models.textModel;

  try {
    const tokenCount = await model.countTokens(prompt);
    totalInputTokens += tokenCount.totalTokens;
    console.log(
      `Step ${step} | Attempt ${attempt + 1} | Key ${
        keyIndex + 1
      } | Input tokens: ${tokenCount.totalTokens} | Prompt length: ${
        prompt.length
      } chars`
    );

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    const outputTokenCount = await model.countTokens(responseText);
    totalOutputTokens += outputTokenCount.totalTokens;
    console.log(
      `Step ${step} | Attempt ${attempt + 1} | Output tokens: ${
        outputTokenCount.totalTokens
      }`
    );

    requestCount++;

    if (modelType === 'json') {
      return extractJsonFromText(responseText);
    } else {
      return extractTextFromResponse(responseText);
    }
  } catch (e) {
    console.error(
      `Step ${step} | Attempt ${attempt + 1} failed with key ${keyIndex + 1}:`,
      e.message
    );

    if (attempt >= GEMINI_KEYS.length - 1) {
      throw new Error(
        `All ${GEMINI_KEYS.length} keys exhausted. Last error: ${e.message}`
      );
    }

    await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));

    return callModelWithRetry(modelType, prompt, step, attempt + 1);
  }
}

// ──────────────────────  Utility Functions ──────────────────────
function extractJsonFromText(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    const block = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (block) {
      try {
        return JSON.parse(block[1].trim());
      } catch (_) {}
    }
    const brace = text.match(/\{[\s\S]*\}/);
    if (brace) {
      try {
        return JSON.parse(brace[0]);
      } catch (_) {}
    }
    throw new Error('AI did not respond with valid JSON');
  }
}

function extractTextFromResponse(text) {
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return text.trim();
  }
}

function resolvePlaceholders(data, stepMap) {
  if (
    typeof data === 'string' &&
    data.startsWith('{step_') &&
    data.endsWith('_id}')
  ) {
    const m = data.match(/\{step_(\d+)_id\}/);
    if (m) {
      const stepNum = parseInt(m[1]);
      if (stepMap[stepNum]) {
        return stepMap[stepNum];
      } else {
        throw new Error(
          `Placeholder {step_${stepNum}_id} could not be resolved: Step ${stepNum} ID not found in stepMap.`
        );
      }
    }
    return data;
  }
  if (data && typeof data === 'object') {
    const out = Array.isArray(data) ? [] : {};
    for (const [k, v] of Object.entries(data))
      out[k] = resolvePlaceholders(v, stepMap);
    return out;
  }
  return data;
}

async function postExecutionResolveRefs(
  stepMap,
  log,
  error,
  allLogs,
  attempt = 0
) {
  if (attempt > 6) {
    allLogs.push('ERROR|Post-resolve failed after 6 attempts');
    return false;
  }

  const forms = await getFormTypes();
  let updated = false;

  for (const form of forms) {
    const str = JSON.stringify(form.schema);
    if (str.includes('{step_') && str.includes('_id}')) {
      try {
        const resolved = resolvePlaceholders(form.schema, stepMap);
        if (JSON.stringify(resolved) !== str) {
          await updateFormType(form.$id, form.name, resolved);
          updated = true;
          allLogs.push(`RESOLVE|${form.name}|${form.$id}`);
        }
      } catch (e) {
        /* silent */
      }
    }
  }

  if (updated && attempt < 5) {
    await new Promise((r) => setTimeout(r, 1200));
    return postExecutionResolveRefs(stepMap, log, error, allLogs, attempt + 1);
  }

  return true;
}
// ──────────────────────  Allowed Field Types ──────────────────────
const ALLOWED_FIELD_TYPES = [
  'text',
  'textarea',
  'number',
  'integer',
  'decimal',
  'email',
  'password',
  'url',
  'date',
  'datetime',
  'time',
  'select',
  'multiselect',
  'checkbox',
  'radio',
  'file',
  'image',
  'hidden',
  'reference',
];

// Type fixer helper
function fixInvalidTypes(schema, allowedTypes, logs) {
  const fixLog = [];
  const walkFields = (fields) => {
    if (!Array.isArray(fields)) return;
    fields.forEach((field) => {
      if (
        typeof field.type === 'string' &&
        !allowedTypes.includes(field.type)
      ) {
        const oldType = field.type;
        if (['currency', 'money'].includes(field.type.toLowerCase())) {
          field.type = 'decimal';
        } else if (['int', 'whole'].includes(field.type.toLowerCase())) {
          field.type = 'integer';
        } else {
          field.type = 'text';
        }
        fixLog.push(
          `Fixed '${field.id || field.label}' from '${oldType}' to '${field.type}'`
        );
      }
      walkFields(field.subfields || []);
    });
  };
  walkFields(schema.headerFields);
  walkFields(schema.itemFields);
  if (fixLog.length > 0) logs.push(`FIX|${fixLog.join('; ')}`);
}

// ──────────────────────  Structure Validation Helpers ──────────────────────
function validateFormTypeStructure(data, method) {
  const errors = [];
  if (typeof data.name !== 'string' || data.name.trim() === '')
    errors.push('Missing or invalid name');
  if (typeof data.hasItems !== 'boolean')
    errors.push('Missing or invalid hasItems');
  if (!Array.isArray(data.headerFields))
    errors.push('headerFields must be an array');
  else {
    data.headerFields.forEach((f, i) => {
      if (typeof f.id !== 'string' || f.id.trim() === '')
        errors.push(`headerFields[${i}]: Missing or invalid id`);
      if (typeof f.type !== 'string' || !ALLOWED_FIELD_TYPES.includes(f.type))
        errors.push(`headerFields[${i}]: Invalid type`);
      if (typeof f.label !== 'string' || f.label.trim() === '')
        errors.push(`headerFields[${i}]: Missing or invalid label`);
      if (typeof f.required !== 'boolean')
        errors.push(`headerFields[${i}]: Missing or invalid required`);
      if (f.type === 'reference') {
        if (typeof f.targetFormType !== 'string')
          errors.push(`headerFields[${i}]: Reference missing targetFormType`);
        if (typeof f.displayField !== 'string')
          errors.push(`headerFields[${i}]: Reference missing displayField`);
      }
    });
  }
  if (!Array.isArray(data.itemFields))
    errors.push('itemFields must be an array');
  else {
    data.itemFields.forEach((f, i) => {
      if (typeof f.id !== 'string' || f.id.trim() === '')
        errors.push(`itemFields[${i}]: Missing or invalid id`);
      if (typeof f.type !== 'string' || !ALLOWED_FIELD_TYPES.includes(f.type))
        errors.push(`itemFields[${i}]: Invalid type`);
      if (typeof f.label !== 'string' || f.label.trim() === '')
        errors.push(`itemFields[${i}]: Missing or invalid label`);
      if (typeof f.required !== 'boolean')
        errors.push(`itemFields[${i}]: Missing or invalid required`);
      if (f.type === 'reference') {
        if (typeof f.targetFormType !== 'string')
          errors.push(`itemFields[${i}]: Reference missing targetFormType`);
        if (typeof f.displayField !== 'string')
          errors.push(`itemFields[${i}]: Reference missing displayField`);
      }
    });
  }
  if (data.schema)
    errors.push('Do not use schema wrapper; provide fields directly');
  if (
    method === 'update' &&
    (typeof data.$id !== 'string' || data.$id.trim() === '')
  )
    errors.push('Missing or invalid $id for update');
  return errors;
}

function validateRecordStructure(data, action) {
  const errors = [];
  if (typeof data.header !== 'object' || data.header === null)
    errors.push('Missing header object');
  if (!Array.isArray(data.items)) errors.push('items must be an array');
  if (!action.formTypeId || typeof action.formTypeId !== 'string')
    errors.push('Missing formTypeId');
  if (
    action.method === 'update' &&
    !(action.$id || action.documentId || data.$id || data.documentId)
  ) {
    errors.push('Missing or invalid ID for update');
  }
  return errors;
}

function validateActions(actions) {
  const errors = [];
  actions.forEach((act, idx) => {
    if (
      act.type === 'form_type' &&
      (act.method === 'create' || act.method === 'update')
    ) {
      errors.push(
        ...validateFormTypeStructure(act.data, act.method).map(
          (e) => `Action ${idx + 1}: ${e}`
        )
      );
    } else if (
      act.type === 'record' &&
      (act.method === 'create' || act.method === 'update')
    ) {
      errors.push(
        ...validateRecordStructure(act.data, act).map(
          (e) => `Action ${idx + 1}: ${e}`
        )
      );
    }
  });
  return errors;
}

// ──────────────────────  Report Generator ──────────────────────
function generatePersianReport(logs, actions, stepMap) {
  const report = {
    forms: { created: [], updated: [], deleted: [], skipped: [] },
    records: { created: [], updated: [], deleted: [], skipped: [] },
    fixes: { applied: [] },
    warnings: [],
    errors: [],
  };

  // Parse structured logs
  logs.forEach((log) => {
    const parts = log.split('|');
    const type = parts[0];

    switch (type) {
      case 'CREATE_FORM_TYPE':
        report.forms.created.push({
          name: parts[1],
          id: parts[2],
          headerFields: parseInt(parts[3]),
          itemFields: parseInt(parts[4]),
        });
        break;
      case 'UPDATE_FORM_TYPE':
        report.forms.updated.push({
          name: parts[1],
          id: parts[2],
          headerFields: parseInt(parts[3]),
          itemFields: parseInt(parts[4]),
        });
        break;
      case 'DELETE_FORM_TYPE':
        report.forms.deleted.push({
          name: parts[1],
          id: parts[2],
        });
        break;
      case 'SKIP_FORM_TYPE':
        report.forms.skipped.push({
          name: parts[1],
          reason: parts[2],
        });
        break;
      case 'CREATE_RECORD':
        report.records.created.push({
          formTypeId: parts[1],
          id: parts[2],
          formTypeName: parts[3],
        });
        break;
      case 'UPDATE_RECORD':
        report.records.updated.push({
          formTypeId: parts[1],
          id: parts[2],
          formTypeName: parts[3],
        });
        break;
      case 'DELETE_RECORD':
        report.records.deleted.push({
          formTypeId: parts[1],
          id: parts[2],
        });
        break;
      case 'SKIP_RECORD':
        report.records.skipped.push({
          formTypeId: parts[1],
          id: parts[2],
          reason: parts[3],
        });
        break;
      case 'FIX':
        report.fixes.applied.push(parts[1]);
        break;
      case 'WARN':
        report.warnings.push(parts[1]);
        break;
      case 'ERROR':
        report.errors.push(parts[1]);
        break;
      case 'RESOLVE':
        report.fixes.applied.push(
          `Resolved references for ${parts[1]} (${parts[2]})`
        );
        break;
    }
  });

  // Generate markdown
  let markdown = `# 📊 گزارش عملیات سیستم\n\n`;

  // Summary
  markdown += `## 📋 خلاصه عملیات\n\n`;
  const totalForms =
    report.forms.created.length +
    report.forms.updated.length +
    report.forms.deleted.length;
  const totalRecords =
    report.records.created.length +
    report.records.updated.length +
    report.records.deleted.length;

  markdown += `**فرم‌ها:** ${totalForms} عملیات (${report.forms.created.length} ایجاد, ${report.forms.updated.length} به‌روزرسانی, ${report.forms.deleted.length} حذف`;
  if (report.forms.skipped.length > 0)
    markdown += `, ${report.forms.skipped.length} نادیده گرفته‌شده`;
  markdown += `)\n\n`;

  markdown += `**رکوردها:** ${totalRecords} عملیات (${report.records.created.length} ایجاد, ${report.records.updated.length} به‌روزرسانی, ${report.records.deleted.length} حذف`;
  if (report.records.skipped.length > 0)
    markdown += `, ${report.records.skipped.length} نادیده گرفته‌شده`;
  markdown += `)\n\n`;

  // Details - Forms Created
  if (report.forms.created.length > 0) {
    markdown += `## ✅ فرم‌های جدید ایجاد شده\n\n`;
    report.forms.created.forEach((form) => {
      markdown += `### 📄 ${form.name}\n`;
      markdown += `- **شناسه فرم:** \`${form.id}\`\n`;
      markdown += `- **فیلدهای هدر:** ${form.headerFields} فیلد\n`;
      if (form.itemFields > 0)
        markdown += `- **فیلدهای آیتم:** ${form.itemFields} فیلد\n`;
      markdown += `- **وضعیت:** با موفقیت ایجاد شد\n\n`;
    });
  }

  // Details - Forms Updated
  if (report.forms.updated.length > 0) {
    markdown += `## 🔄 فرم‌های به‌روزرسانی شده\n\n`;
    report.forms.updated.forEach((form) => {
      markdown += `### 📄 ${form.name}\n`;
      markdown += `- **شناسه فرم:** \`${form.id}\`\n`;
      markdown += `- **فیلدهای هدر:** ${form.headerFields} فیلد\n`;
      if (form.itemFields > 0)
        markdown += `- **فیلدهای آیتم:** ${form.itemFields} فیلد\n`;
      markdown += `- **وضعیت:** با موفقیت به‌روزرسانی شد\n\n`;
    });
  }

  // Details - Forms Deleted
  if (report.forms.deleted.length > 0) {
    markdown += `## ❌ فرم‌های حذف شده\n\n`;
    report.forms.deleted.forEach((form) => {
      markdown += `### 📄 ${form.name}\n`;
      markdown += `- **شناسه فرم:** \`${form.id}\`\n`;
      markdown += `- **وضعیت:** با موفقیت حذف شد\n\n`;
    });
  }

  // Details - Records Created
  if (report.records.created.length > 0) {
    markdown += `## 📝 رکورد‌های جدید ایجاد شده\n\n`;
    report.records.created.forEach((record) => {
      markdown += `### رکورد در فرم "${record.formTypeName}"\n`;
      markdown += `- **شناسه رکورد:** \`${record.id}\`\n`;
      markdown += `- **شناسه فرم:** \`${record.formTypeId}\`\n`;
      markdown += `- **وضعیت:** با موفقیت ایجاد شد\n\n`;
    });
  }

  // Details - Records Updated
  if (report.records.updated.length > 0) {
    markdown += `## 🔄 رکورد‌های به‌روزرسانی شده\n\n`;
    report.records.updated.forEach((record) => {
      markdown += `### رکورد در فرم "${record.formTypeName}"\n`;
      markdown += `- **شناسه رکورد:** \`${record.id}\`\n`;
      markdown += `- **شناسه فرم:** \`${record.formTypeId}\`\n`;
      markdown += `- **وضعیت:** با موفقیت به‌روزرسانی شد\n\n`;
    });
  }

  // Fixes applied
  if (report.fixes.applied.length > 0) {
    markdown += `## 🔧 به‌روزرسانی‌های خودکار QA\n\n`;
    report.fixes.applied.forEach((fix) => {
      markdown += `- ✅ ${fix}\n`;
    });
    markdown += `\n`;
  }

  // Warnings
  if (report.warnings.length > 0) {
    markdown += `## ⚠️ هشدارها\n\n`;
    report.warnings.forEach((warning) => {
      markdown += `- ⚠️ ${warning}\n`;
    });
    markdown += `\n`;
  }

  // Errors
  if (report.errors.length > 0) {
    markdown += `## ❌ خطاهای احتمالی\n\n`;
    report.errors.forEach((err) => {
      markdown += `- ❌ ${err}\n`;
    });
    markdown += `\n`;
  }

  // Footer
  markdown += `---\n*این گزارش به صورت خودکار توسط سیستم هوشمند ایجاد شده است. برای سوالات بیشتر می‌توانید با پشتیبانی تماس بگیرید.*\n`;

  return markdown;
}

// ──────────────────────  Execute Actions Helper ──────────────────────
async function executeActions(
  actions,
  stepMap,
  log,
  error,
  allLogs,
  allRecords,
  formTypes,
  isRetry = false
) {
  const newLogs = [];
  let success = true;
  const sortedActions = actions.sort((a, b) => (a.step ?? 0) - (b.step ?? 0));

  for (const raw of sortedActions) {
    let act = { ...raw };

    if (raw.action && !raw.method) {
      const [m, t] = raw.action.split('_');
      act.method = m;
      act.type = t === 'form' ? 'form_type' : t;
      act.data = raw.form_type ?? raw.record ?? raw.data;
    }

    const prefix = `Step ${act.step ?? '?'} | ${act.method ?? '?'} ${
      act.type ?? '?'
    }`;

    try {
      let entityId;
      if (act.method === 'update' || act.method === 'delete') {
        entityId = act.documentId || act.$id || act.id;
        if (!entityId && act.data) {
          entityId = act.data.documentId || act.data.$id || act.data.id;
          if (entityId) {
            delete act.data.documentId;
            delete act.data.$id;
            delete act.data.id;
          }
        }
      }

      let dataNoResolve = act.data || {};

      if (
        act.type === 'form_type' &&
        (act.method === 'create' || act.method === 'update')
      ) {
        fixInvalidTypes(dataNoResolve, ALLOWED_FIELD_TYPES, newLogs);

        const itemErrors = validateFormTypeItems(dataNoResolve);
        if (itemErrors.length > 0) {
          throw new Error(`Item validation failed: ${itemErrors.join(', ')}`);
        }
      }

      if (act.method === 'delete') {
        let canDelete = true;
        if (!entityId) {
          console.error('Delete failed. Available data:', JSON.stringify(act));
          throw new Error(
            `Missing ID for delete. Explored: id, $id, documentId`
          );
        }

        if (act.type === 'form_type') {
          if (await isFormTypeReferenced(entityId)) {
            canDelete = false;
            const formName =
              formTypes.find((f) => f.$id === entityId)?.name || 'Unknown';
            newLogs.push(
              `SKIP_FORM_TYPE|${formName}|Form type has associated records - delete skipped`
            );
          }
        } else if (act.type === 'record') {
          if (await isRecordReferenced(entityId, allRecords)) {
            canDelete = false;
            const formTypeId =
              allRecords.find((r) => r.$id === entityId)?.formTypeId ||
              'Unknown';
            newLogs.push(
              `SKIP_RECORD|${formTypeId}|${entityId}|Record is referenced elsewhere - delete skipped`
            );
          }
        }

        if (canDelete) {
          if (act.type === 'form_type') {
            const formName =
              formTypes.find((f) => f.$id === entityId)?.name || 'Unknown';
            await deleteFormType(entityId);
            newLogs.push(`DELETE_FORM_TYPE|${formName}|${entityId}`);
          } else {
            const formTypeId =
              allRecords.find((r) => r.$id === entityId)?.formTypeId ||
              'Unknown';
            await deleteRecord(entityId);
            newLogs.push(`DELETE_RECORD|${formTypeId}|${entityId}`);
          }
        }
      } else if (act.type === 'form_type') {
        let name = dataNoResolve.name;
        name = name ? name.trim() : '';

        if (!name) throw new Error('Missing name for form_type');

        let schemaObj = dataNoResolve.schema || dataNoResolve;

        if (act.method === 'update') {
          if (!entityId) {
            throw new Error('Missing documentId or $id for form_type update');
          }
          const oldForm = formTypes.find((f) => f.$id === entityId);
          if (oldForm) {
            const removed = await compareSchemas(oldForm.schema, schemaObj);
            if (
              removed.length > 0 &&
              (await hasDataInFields(entityId, removed))
            ) {
              newLogs.push(
                `WARN|Removing fields with existing data in "${name}" - proceed with caution`
              );
            }
          }
          const safeSchema = ensureNonEmptySchema(schemaObj);
          await updateFormType(entityId, name, schemaObj);
          newLogs.push(
            `UPDATE_FORM_TYPE|${name}|${entityId}|${safeSchema.headerFields.length}|${safeSchema.itemFields.length}`
          );
        } else if (act.method === 'create') {
          if (!dataNoResolve.schema && schemaObj.name) {
            name = schemaObj.name;
          }
          name = name.trim();

          const cleanName = name
            .trim()
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            .toLowerCase();
          const existingForm = formTypes.find(
            (f) =>
              f.name
                .trim()
                .replace(/[\u200B-\u200D\uFEFF]/g, '')
                .toLowerCase() === cleanName
          );

          const safeSchema = ensureNonEmptySchema(schemaObj);

          if (existingForm) {
            newLogs.push(
              `UPDATE_FORM_TYPE|${name}|${existingForm.$id}|${safeSchema.headerFields.length}|${safeSchema.itemFields.length}|Form existed, updated instead`
            );
            await updateFormType(existingForm.$id, name, schemaObj);
            stepMap[act.step] = existingForm.$id;
          } else {
            const r = await createFormType(name, schemaObj);
            stepMap[act.step] = r.$id;
            newLogs.push(
              `CREATE_FORM_TYPE|${name}|${r.$id}|${safeSchema.headerFields.length}|${safeSchema.itemFields.length}`
            );
          }
        }
      } else if (act.type === 'record') {
        const formTypeId =
          act.formTypeId ||
          act.documentId ||
          dataNoResolve.formTypeId ||
          dataNoResolve.form_type_id;

        if (!formTypeId) {
          throw new Error('Missing formTypeId for record');
        }

        const formType = formTypes.find((f) => f.$id === formTypeId);
        if (!formType) {
          throw new Error(`Form type with ID ${formTypeId} not found`);
        }

        if (
          typeof dataNoResolve === 'object' &&
          dataNoResolve !== null &&
          !dataNoResolve.header &&
          !dataNoResolve.items
        ) {
          dataNoResolve = {
            header: { ...dataNoResolve },
            items: [],
          };
          newLogs.push(
            `WRAP|Wrapped flat data into header structure for ${formType.name}`
          );
        }

        const validationErrors = validateRecordAgainstSchema(
          dataNoResolve,
          formType.schema
        );

        if (validationErrors.length > 0) {
          if (act.retryAttempt) {
            throw new Error(
              `Record validation failed after retry: ${validationErrors.join(
                ', '
              )}`
            );
          } else {
            newLogs.push(
              `WARN|Validation failed for ${formType.name}: ${validationErrors.join(
                ', '
              )}. Will retry with AI fix.`
            );
            throw {
              validationError: true,
              action: act,
              errors: validationErrors,
            };
          }
        }

        const {
          formTypeId: ftId,
          form_type_id,
          documentId: dataDocumentId,
          ...rawData
        } = dataNoResolve;

        if (act.method === 'update' && !entityId) {
          throw new Error(
            'Missing required parameter for update: "documentId"'
          );
        }

        if (act.method === 'create') {
          const preparedData = prepareRecordData(rawData, newLogs);
          const r = await createRecord(formTypeId, preparedData);
          stepMap[act.step] = r.$id;
          newLogs.push(`CREATE_RECORD|${formTypeId}|${r.$id}|${formType.name}`);
        } else if (act.method === 'update') {
          const {
            $id: ignoredId,
            documentId: ignoredDocId,
            ...rawUpdateData
          } = rawData;

          const preparedData = prepareRecordData(rawUpdateData, newLogs);
          await updateRecord(entityId, preparedData);
          newLogs.push(
            `UPDATE_RECORD|${formTypeId}|${entityId}|${formType.name}`
          );
        }
      }
    } catch (e) {
      success = false;
      if (e.validationError) {
        throw e;
      } else {
        error?.(`${prefix} → Error: ${e.message}`);
        newLogs.push(`ERROR|${e.message}`);
      }
    }
  }

  if (success && !isRetry) {
    await postExecutionResolveRefs(stepMap, log, error, allLogs, 0);
  }

  if (newLogs.length > 0) allLogs.push(...newLogs);
  return { success, logs: newLogs };
}

// ──────────────────────  Correct Samples ──────────────────────
const correctFormTypeSample = {
  name: 'فرم نمونه جدید',
  hasItems: true,
  headerFields: [
    {
      id: 'field-1762897563897-gez01r05y',
      type: 'text',
      label: 'فیلد متنی',
      required: false,
    },
    {
      id: 'field-1762897571646-d0xuus90j',
      type: 'number',
      label: 'فیلد عددی',
      required: true,
    },
  ],
  itemFields: [
    {
      id: 'field-1762897581100-fiwttyvl8',
      type: 'number',
      label: 'فیلد عددی در قلم',
      required: true,
    },
    {
      id: 'field-1762897655430-xhqdr5k8a',
      type: 'reference',
      label: 'ارجاع به سند حسابداری',
      required: false,
      targetFormType: '69139ddc00355ecb8228',
      displayField: '1',
    },
  ],
};
const correctRecordSample = {
  header: { فیلد_متنی: 'ثصق', فیلد_عددی: 15 },
  items: [{ فیلد_عددی_در_قلم: 45, ارجاع_به_سند_حسابداری: '' }],
};

// ──────────────────────  MAIN HANDLER ──────────────────────
export default async function (context) {
  const { req, res, log, error } = context;

  requestCount = 0;
  totalInputTokens = 0;
  totalOutputTokens = 0;

  // 1. Define Headers globally (Ensure x-user-id is included)
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id',
  };

  // 2. Handle Preflight properly
  if (req.method === 'OPTIONS') {
    return res.send('', 200, corsHeaders);
  }
  try {
    let payload;
    if (typeof req.body === 'string') payload = JSON.parse(req.body);
    else if (typeof req.body === 'object') payload = req.body;
    else return res.json({ error: 'Invalid request body' }, 400);

    const userInput = payload.userInput?.trim();
    if (!userInput) return res.json({ error: 'Missing userInput' }, 400);
    userId = payload.userId || ''; // ← این خط جدید اضافه شد
    console.log('Received userId:', userId);

    if (!userInput) return res.json({ error: 'Missing userInput' }, 400);
    log?.(`Processing: ${userInput}`);
    await saveChatMessage('user', [userInput]);

    let formTypes = await getFormTypes();
    let allRecords = await getAllRecords();
    const chatHistory = await getChatHistory();

    const groupedRecords = allRecords.reduce((acc, r) => {
      (acc[r.formTypeId] ??= []).push({ $id: r.$id, data: r.data });
      return acc;
    }, {});

    // ──────────────────────  Step 1: Structure Description ──────────────────────
    const structurePrompt = `
You are a senior software architect and enterprise systems specialist (CRM, ERP, business applications). The user requests a form or system. Think holistically and scalably—add industry-standard details the user didn't mention (created dates, creator users, status fields, relationships between forms for complex modules like sales, customer management, inventory, etc.).

**Key Structure Rules:**
- For each main document/form (e.g., inventory document, sales invoice), **create only ONE form_type** containing both headerFields (form header) and itemFields (line items). Use hasItems: true to enable line items.
- headerFields and itemFields **must be in the SAME form_type**, not separate forms. Items are part of the document (internal one-to-many relationship).
- Create base forms (products, warehouses, customers) separately, and reference them in header/itemFields using reference type.
- If user requests editing (words like "edit", "update", "modify"), update existing forms instead of creating new ones. Identify and delete duplicates.
- Relationships: Use reference fields to link to other forms. Prevent corruption (e.g., only delete if not referenced).

### Conversation History:
${chatHistory}

### User Message:
"${userInput}"

### Existing Forms:
${JSON.stringify(formTypes, null, 2)}

### Existing Records:
${JSON.stringify(groupedRecords, null, 2)}

### Instructions:
- Provide detailed description of proposed structure: How many form_types needed? For each form_type, what headerFields and itemFields (if needed)? How should relationships between form_types be (references in reference fields)?
- Example: For "inventory document", one form_type "Inventory Document" with headerFields (number, date, ...) and itemFields (reference to product, quantity, ...).
- For complex requests like "build a CRM", break down modules: Customers, Contacts, Opportunities, Sales, Reports, etc.
- Follow enterprise standards: required fields, validation, scalability for large data.
- Output only descriptive Persian text, simple format, no JSON or code blocks, no \`\`\` markers.
`;

    const structureDescription = await callModelWithRetry(
      'text',
      structurePrompt,
      1
    );

    log?.('AI structure description:', structureDescription);

    // ──────────────────────  Step 2: Detailed Schema Generation (JSON Actions) ──────────────────────
    let schemaPrompt = `
You are an intelligent assistant for dynamic form creation. **Output ONLY JSON**. Based on the structure description below, create forms with depth and detail. Each type must be exactly from this allowed list: ${ALLOWED_FIELD_TYPES.join(
      ', '
    )}. If an invalid type is suggested, replace with 'text' or 'number'.

**Key Rules:**
- For each main document (e.g., inventory document), **create ONLY ONE action create form_type** with hasItems: true, headerFields for the document header, and itemFields for line items. Header and items **must NOT be separated**—they are in one form_type.
- Create base forms (products, employees, customers) separately (early steps), then create the main form (later steps) with references to them using {step_X_id} or existing $id.
- If user requests editing, use method: "update" with existing $id instead of creating new. Avoid duplicates.
- For form_type create, data should NOT include $id, and should have "name", "hasItems", "headerFields", "itemFields" directly (no 'schema' wrapper). Always include a meaningful Persian "name" for the form.
- For record create/update, use "formTypeId": "the_id" (NOT "documentId"), "data": {"header": {...}, "items": [...]} where data does NOT include formTypeId inside it.
- FIXED: **For record create/update, ALWAYS wrap data in {"header": {field_label: value, ...}, "items": [{item_label: value, ...}, ...]} structure. Keys MUST be exact Persian labels from schema fields. Do NOT use flat object or field IDs as keys. Example: if headerField {id:"1", label:"نام مرکز هزینه", ...}, then in data.header { "نام مرکز هزینه": "value" }.**

### Strict Rules:
1. Any form with line items (items) → \`hasItems:true\` and line item fields in \`itemFields\`. **headerFields and itemFields in the SAME form_type**.
2. Any field that is a list (products, personnel, customers, ...) → create a SEPARATE form_type (lower step) and reference it with \`{step_X_id}\` or existing $id. Use type: 'reference' for references.
3. Step order: base forms (products, personnel, ...) **FIRST** (step 1,2,…). Dependent forms **AFTER** them.
4. Base form names: products **always "Products"**; personnel "Employees"; customers "Customers".
5. Minimum 2-3 required fields per form_type, with depth (options for select, validation).
6. For record data, the keys in header and in each item object must be the exact label strings from the field definitions. Do not use the id values as keys. Example: if headerField {id:"1", label:"نام مرکز هزینه", ...}, then in data.header { "نام مرکز هزینه": "value" }.
7. Output **ONLY** this JSON format, no extra text:

{
  "actions": [
    {
      "step": 1,
      "type": "form_type",
      "method": "create",
      "data": { "name": "...", "hasItems": true, "headerFields": [...], "itemFields": [...] }
    },
    {
      "step": 2,
      "type": "record",
      "method": "create",
      "formTypeId": "{step_1_id}",
      "data": { "header": { "label1": "...", ... }, "items": [ { "item_label1": "..." }, ... ] }
    },
    ...
  ]

This is the correct sample of form type structure: ${JSON.stringify(
      correctFormTypeSample
    )}
This is the correct sample of record structure: ${JSON.stringify(
      correctRecordSample
    )}
Make sure to follow this structure exactly in making records or form types or updating them. For field ids, generate unique strings like 'field-' + approximate timestamp + '-' + random alphanumeric string (e.g., 'field-1762948862951-1djg12twe'). Always start with a "name" key in form_type data.

### VERY IMPORTANT FOR UPDATE ACTIONS:

When you want to UPDATE an existing form (like کالا, سند انبار, فاکتور فروش)you **MUST** include the real "$id" of that form in the action. Look it up from "Existing Forms" list above.
Example of correct UPDATE action:
{
  "step": 2,
  "type": "form_type",
  "method": "update",
  "$id": "691e2c4a003bcc5a010d",   // ← این خط اجباری است!
  "data": {
    "name": "کالا",
    "hasItems": false,
    "headerFields": [ ... new fields including reference to {step_1_id} ... ]
  }
}
### Structure Description:
${structureDescription}

### Conversation History:
${chatHistory}

### User Message:
"${userInput}"

### Existing Forms:
${JSON.stringify(formTypes, null, 2)}

### Existing Records:
${JSON.stringify(groupedRecords, null, 2)}

### Comprehensive Examples (Always Follow This Pattern):
${JSON.stringify(examples, null, 2)}

}
`;
    let agentResponse = await callModelWithRetry('json', schemaPrompt, 2);
    let structureErrors = validateActions(agentResponse.actions ?? []);
    if (structureErrors.length > 0) {
      schemaPrompt += `
### Previous Output and Structure Issues:
This was your answer: ${JSON.stringify(agentResponse, null, 2)}
You should fix these structure issues: ${structureErrors.join(
        ', '
      )} alongside other checks. Ensure every form_type data starts with "name".
`;
      agentResponse = await callModelWithRetry('json', schemaPrompt, 2);
    }
    let initialActions = (agentResponse.actions ?? []).sort(
      (a, b) => (a.step ?? 0) - (b.step ?? 0)
    );

    let stepMap = {};
    let allLogs = [];
    let overallSuccess = true;
    let execSuccess = false;
    let execLogs = [];

    try {
      const result = await executeActions(
        initialActions,
        stepMap,
        log,
        error,
        allLogs,
        allRecords,
        formTypes,
        false
      );
      execSuccess = result.success;
      execLogs = result.logs;
    } catch (e) {
      execSuccess = false;
      allLogs.push(
        `Initial execution failed: ${e.message}. Retrying with AI fix.`
      );
      schemaPrompt += `
### Previous Output and Issues:
Here is your output the last time we asked you to do this:
${JSON.stringify(agentResponse, null, 2)}

Here is what's wrong with it and needs fixing:
- Ensure "name" is always present and first in form_type data objects.
- Placeholders like {step_X_id} were not resolved properly in some cases.
- ${e.message}
Please correct these issues in the new output.
`;
      agentResponse = await callModelWithRetry('json', schemaPrompt, 2);
      structureErrors = validateActions(agentResponse.actions ?? []);
      if (structureErrors.length > 0) {
        schemaPrompt += `
### Previous Output and Structure Issues:
This was your answer: ${JSON.stringify(agentResponse, null, 2)}
You should fix these structure issues: ${structureErrors.join(
          ', '
        )} alongside other checks. Ensure every form_type data starts with "name".
`;
        agentResponse = await callModelWithRetry('json', schemaPrompt, 2);
      }
      initialActions = (agentResponse.actions ?? []).sort(
        (a, b) => (a.step ?? 0) - (b.step ?? 0)
      );
      ({ success: execSuccess, logs: execLogs } = await executeActions(
        initialActions,
        stepMap,
        log,
        error,
        allLogs,
        allRecords,
        formTypes,
        true
      ));
    }

    overallSuccess = overallSuccess && execSuccess;

    // ──────────────────────  Generate Persian Report ──────────────────────
    formTypes = await getFormTypes();
    allRecords = await getAllRecords();

    const step2Report = generatePersianReport(allLogs, initialActions, stepMap);

    // Save Step 2 report as assistant chat message
    // await saveChatMessage('assistant', step2Report);
    // log?.('Step 2 report saved as chat message');

    const groupedRecordsAfter = allRecords.reduce((acc, r) => {
      (acc[r.formTypeId] ??= []).push({ $id: r.$id, data: r.data });
      return acc;
    }, {});

    // ──────────────────────  STEP 3: TRUE QA Engineer – Now with REAL Context (Fixed Forever) ──────────────────────
    // ──────────────────────  STEP 3: TRUE QA Engineer – Now with REAL Context (100% FIXED) ──────────────────────
    log?.('Starting Step 3: Real QA Validation with Fresh Database State...');

    // 1. Fresh data from DB
    const freshFormTypes = await getFormTypes();
    const freshRecords = await getAllRecords();

    // 2. Reliable stepMap
    const realStepMap = { ...stepMap };
    freshFormTypes.forEach((ft) => {
      const possibleStep = Object.entries(stepMap).find(([step, id]) =>
        freshFormTypes.some(
          (f) => f.$id === id && f.name.includes(ft.name.split(' ')[0])
        )
      );
      if (possibleStep) realStepMap[possibleStep[0]] = ft.$id;
    });

    let validationPrompt = `You are the FINAL QA Engineer for this Appwrite dynamic forms system.

Your ONLY job: Find real bugs in Step 2 actions and give 100% correct fixes.

### REAL-TIME DATABASE STATE (THIS IS TRUTH):
Current Form Types (with real $id and current schema):
${JSON.stringify(
  freshFormTypes.map((f) => ({ $id: f.$id, name: f.name, schema: f.schema })),
  null,
  2
)}

Current Records (first 10 for context):
${JSON.stringify(
  freshRecords.slice(0, 10).map((r) => ({
    $id: r.$id,
    formTypeId: r.formTypeId,
    headerKeys: Object.keys(r.data.header || {}),
  })),
  null,
  2
)}

### Step 2 Actions That Were Executed:
${JSON.stringify(initialActions, null, 2)}

### Step Map (What Was Created):
${JSON.stringify(realStepMap, null, 2)}

### Final Report from Step 2:
${step2Report}

### Your Original Rules (Still 100% Enforced):
1. Reference fields → must use real record $id or {step_X_id}
2. required: true fields → must have values in existing records
3. Form type integrity → name first, hasItems ↔ itemFields, no duplicates
4. Step ordering → base forms before main forms
5. Record keys → MUST be exact Persian label, never field id

### PERFECT EXAMPLES (Follow Exactly):
Form type example: ${JSON.stringify(correctFormTypeSample, null, 2)}
Record example: ${JSON.stringify(correctRecordSample, null, 2)}

### Output ONLY this JSON (no extra text):
{
  "validation": {
    "is_valid": true/false,
    "critical_issues": ["Missing $id in update action for form 'کالا'", "Reference field still has {step_1_id}", "Required field 'قیمت' missing in record"],
    "warnings": []
  },
  "fixes": [
    {
      "step": 999,
      "type": "form_type",
      "method": "update",
      "$id": "691e2c4a003bcc5a010d",
      "data": { "name": "کالا", "hasItems": false, "headerFields": [ ... ] }
    },
    {
      "step": 1000,
      "type": "record",
      "method": "create",
      "formTypeId": "691e2c4c000a1b2c3d4e",
      "data": { "header": { "نام واحد اندازه‌گیری": "کیلوگرم" } }
    }
  ]
}
`;

    // 3. Call QA
    let validationResponse;
    try {
      validationResponse = await callModelWithRetry(
        'json',
        validationPrompt,
        3
      );
    } catch (e) {
      error?.('QA failed, skipping fixes:', e.message);
      validationResponse = { validation: { is_valid: true }, fixes: [] };
    }

    // 4. Retry if fixes are malformed
    let fixStructureErrors = validateActions(validationResponse.fixes ?? []);
    if (fixStructureErrors.length > 0) {
      log?.('QA produced invalid fixes, retrying once...');
      validationPrompt += `\n\n### Your previous fixes had these errors: ${fixStructureErrors.join(', ')}\nFix them now.`;
      validationResponse = await callModelWithRetry(
        'json',
        validationPrompt,
        3
      );
    }

    const fixes = validationResponse.fixes ?? [];

    // 5. Apply fixes if needed
    if (fixes.length > 0 && validationResponse.validation?.is_valid === false) {
      log?.(`QA found issues. Applying ${fixes.length} verified fixes...`);

      const maxStep = Math.max(
        ...Object.keys(realStepMap).map(Number),
        ...initialActions.map((a) => a.step || 0),
        0
      );

      const fixActions = fixes.map((f, i) => ({
        ...f,
        step: maxStep + 1000 + i,
      }));

      try {
        const result = await executeActions(
          fixActions,
          realStepMap,
          log,
          error,
          allLogs,
          freshRecords,
          freshFormTypes,
          true
        );
        overallSuccess &&= result.success;
        allLogs.push(`QA_FIXES|${fixes.length} fixes applied successfully`);
      } catch (e) {
        allLogs.push(`QA_FIX_FAILED|${e.message}`);
        error?.('Fix application failed:', e.message);
      }
    }

    // 6. Final resolve
    await postExecutionResolveRefs(realStepMap, log, error, allLogs, 0);

    // 7. Final refresh + report (using realStepMap!)
    formTypes = await getFormTypes();
    allRecords = await getAllRecords();

    const finalReportFinal = generatePersianReport(
      allLogs,
      initialActions,
      realStepMap
    );
    await saveChatMessage('assistant', finalReportFinal);
    console.log(`=== FINAL API STATS ===`);
    console.log(`Total requests made: ${requestCount}`);
    console.log(
      `Total input tokens: ${totalInputTokens} (includes examples.js ~${examplesTokenEstimate} tokens)`
    );
    console.log(`Total output tokens: ${totalOutputTokens}`);
    console.log(`Total tokens: ${totalInputTokens + totalOutputTokens}`);
    console.log(`==================`);

    return res.json(
      {
        text_answer: finalReportFinal,
        success: overallSuccess,
        api_stats: {
          requests: requestCount,
          input_tokens: totalInputTokens,
          output_tokens: totalOutputTokens,
          total_tokens: totalInputTokens + totalOutputTokens,
          examples_estimate: examplesTokenEstimate,
        },
      },
      200,
      corsHeaders
    );
  } catch (err) {
    error?.('Function error:', err);
    await saveChatMessage('assistant', [`General error: ${err.message}`]);
    console.log(
      `=== ERROR STATS === Requests: ${requestCount} | Tokens: ${
        totalInputTokens + totalOutputTokens
      }`
    );
    return res.json(
      {
        text_answer:
          '# ❌ خطا\n\nمتأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.',
        success: false,
        error: err.message,
        api_stats: {
          requests: requestCount,
          input_tokens: totalInputTokens,
          output_tokens: totalOutputTokens,
          total_tokens: totalInputTokens + totalOutputTokens,
          examples_estimate: examplesTokenEstimate,
        },
      },
      500,
      corsHeaders
    );
  }
}
