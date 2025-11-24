import { Client, Account, Databases, ID, Query } from "appwrite";
// Fix 1: Import Models as a type explicitly
import type { Models } from "appwrite";
import { getUserId } from "../utils/userId";

// 1. Initialize Client (Client-Side)
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

// 2. Constants
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const FORM_TYPES_COLLECTION = import.meta.env.VITE_COLLECTION_FORM_TYPES;
export const RECORDS_COLLECTION = import.meta.env.VITE_COLLECTION_RECORDS;
export const CHAT_COLLECTION = import.meta.env.VITE_COLLECTION_CHAT;

export const generateId = () => ID.unique();

// 3. Interfaces
export interface FormTypeDoc extends Models.Document {
  name: string;
  form_types: string;
  userId: string;
}

export interface RecordDoc extends Models.Document {
  formTypeId: string;
  data: string;
  userId: string;
}

export interface ChatDocument extends Models.Document {
  role: "user" | "assistant";
  messages: string[];
  userId: string;
}

// --- FORM TYPES LOGIC ---

export async function getFormTypes() {
  const userId = getUserId();
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      FORM_TYPES_COLLECTION,
      [Query.equal("userId", userId)]
    );

    return response.documents.map((doc) => {
      // Fix 2: Double cast (doc -> unknown -> FormTypeDoc) to satisfy TypeScript
      const typedDoc = doc as unknown as FormTypeDoc;
      let parsedSchema = {};
      try {
        parsedSchema = JSON.parse(typedDoc.form_types);
      } catch (e) {
        console.error("Schema parse error", e);
      }
      return {
        $id: typedDoc.$id,
        name: typedDoc.name,
        schema: parsedSchema,
      };
    });
  } catch (error) {
    console.error("Get Form Types Error:", error);
    return [];
  }
}

export async function createFormType(name: string, schema: object) {
  const userId = getUserId();
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      FORM_TYPES_COLLECTION,
      ID.unique(),
      {
        name,
        form_types: JSON.stringify(schema),
        userId,
      }
    );
    return { $id: response.$id, success: true };
  } catch (error) {
    console.error("Create Form Type Error:", error);
    return { success: false, error };
  }
}

export async function updateFormType(id: string, name: string, schema: object) {
  const userId = getUserId();
  try {
    await databases.updateDocument(DATABASE_ID, FORM_TYPES_COLLECTION, id, {
      name,
      form_types: JSON.stringify(schema),
      userId,
    });
    return { success: true };
  } catch (error) {
    console.error("Update Form Type Error:", error);
    return { success: false, error };
  }
}

export async function deleteFormType(id: string) {
  try {
    await databases.deleteDocument(DATABASE_ID, FORM_TYPES_COLLECTION, id);
    return { success: true };
  } catch (error) {
    console.error("Delete Form Type Error:", error);
    return { success: false, error };
  }
}

// --- RECORDS LOGIC ---

export async function getRecordsByFormType(formTypeId: string) {
  const userId = getUserId();
  if (!formTypeId) return [];

  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      RECORDS_COLLECTION,
      [Query.equal("formTypeId", formTypeId), Query.equal("userId", userId)]
    );

    return response.documents.map((doc) => {
      // Fix 2: Double cast here as well
      const typedDoc = doc as unknown as RecordDoc;
      let parsedData = null;
      try {
        parsedData = JSON.parse(typedDoc.data);
      } catch (e) {
        console.error("Data parse error", e);
      }
      return {
        $id: typedDoc.$id,
        formTypeId: typedDoc.formTypeId,
        data: parsedData,
      };
    });
  } catch (error) {
    console.error("Get Records Error:", error);
    return [];
  }
}

export async function createRecord(formTypeId: string, data: object) {
  const userId = getUserId();
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      RECORDS_COLLECTION,
      ID.unique(),
      {
        formTypeId,
        data: JSON.stringify(data),
        userId,
      }
    );
    return { $id: response.$id, success: true };
  } catch (error) {
    console.error("Create Record Error:", error);
    return { success: false, error };
  }
}

export async function updateRecord(id: string, data: object) {
  try {
    await databases.updateDocument(DATABASE_ID, RECORDS_COLLECTION, id, {
      data: JSON.stringify(data),
    });
    return { success: true };
  } catch (error) {
    console.error("Update Record Error:", error);
    return { success: false, error };
  }
}

export async function deleteRecord(id: string) {
  try {
    await databases.deleteDocument(DATABASE_ID, RECORDS_COLLECTION, id);
    return { success: true };
  } catch (error) {
    console.error("Delete Record Error:", error);
    return { success: false, error };
  }
}

export async function getRecordsForReference(targetFormTypeId: string) {
  return await getRecordsByFormType(targetFormTypeId);
}

// --- CHAT LOGIC ---

export async function getChatMessages() {
  const userId = getUserId();
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      CHAT_COLLECTION,
      [Query.orderAsc("$createdAt"), Query.equal("userId", userId)]
    );

    // Fix 2: Double cast for ChatDocument
    const docs = response.documents as unknown as ChatDocument[];
    return docs.flatMap((doc) =>
      doc.messages.map((msg) => ({ role: doc.role, text: msg }))
    );
  } catch (error) {
    console.error("Chat fetch error:", error);
    return [];
  }
}

export async function saveChatMessage(
  role: "user" | "assistant",
  message: string
) {
  const userId = getUserId();
  try {
    await databases.createDocument(DATABASE_ID, CHAT_COLLECTION, ID.unique(), {
      role,
      messages: [message],
      userId,
    });
    return { success: true };
  } catch (error) {
    console.error("Chat save error:", error);
    return { success: false, error };
  }
}
