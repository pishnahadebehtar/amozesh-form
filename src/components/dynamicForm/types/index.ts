// src/components/dynamicForm/types/index.ts
// Shared types and constants for form builder schema and UI labels.
// This centralizes definitions to avoid duplication and improve type safety.
import { AlertColor } from "@mui/material";
import type {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  Control,
  FieldErrors,
} from "react-hook-form";

export type FieldType = // Match main.js exactly

    | "text"
    | "textarea"
    | "number"
    | "integer"
    | "decimal"
    | "email"
    | "password"
    | "url"
    | "date"
    | "datetime"
    | "time"
    | "select"
    | "multiselect"
    | "checkbox"
    | "radio"
    | "file"
    | "image"
    | "hidden"
    | "reference"
    | "boolean";

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  options?: string[];
  targetFormType?: string; // For 'reference'
  displayField?: string; // For 'reference'
  multiple?: boolean; // For 'multiselect'
}

export interface FormSchema {
  name: string;
  hasItems: boolean;
  headerFields: Field[];
  itemFields: Field[];
}

// Export Schema as alias for FormSchema for backward compatibility
export type Schema = Omit<FormSchema, "name">; // FIXED: Explicitly omit 'name' for listViewer compatibility

// FIXED: Define FormValues for RHF generics
export type FormValues = Record<string, unknown>;

// FIXED: Define AnyObject to avoid 'any' usage
export type AnyObject = Record<string, unknown>;

// FIXED: Re-export FieldErrors from react-hook-form
export type { FieldErrors };

// Full form type from DB (extends schema for storage)
export interface FormType {
  $id: string;
  name: string;
  schema: FormSchema;
}

// Persian labels for field types (used in selects and chips)
export const FIELD_TYPES: { [key in FieldType]: string } = {
  text: "فیلد متنی",
  textarea: "فیلد متنی چندخطی",
  number: "فیلد عددی",
  integer: "عدد صحیح",
  decimal: "عدد اعشاری",
  email: "ایمیل",
  password: "رمز عبور",
  url: "آدرس وب",
  date: "تاریخ",
  datetime: "تاریخ و زمان",
  time: "زمان",
  select: "لیست کشویی",
  multiselect: "چند انتخابی",
  checkbox: "چک‌باکس",
  radio: "دکمه رادیویی",
  file: "فایل",
  image: "تصویر",
  hidden: "مخفی",
  reference: "مرجع موجودیت",
  boolean: "بولی",
};

// Short Persian chips for field types
export const TYPE_TO_PERSIAN: { [key in FieldType]: string } = {
  text: "متنی",
  textarea: "متنی چندخطی",
  number: "عددی",
  integer: "عدد صحیح",
  decimal: "اعشاری",
  email: "ایمیل",
  password: "رمز",
  url: "وب",
  date: "تاریخ",
  datetime: "تاریخ/زمان",
  time: "زمان",
  select: "انتخابی",
  multiselect: "چندانتخابی",
  checkbox: "چک‌باکس",
  radio: "رادیویی",
  file: "فایل",
  image: "تصویر",
  hidden: "مخفی",
  reference: "مرجع",
  boolean: "بولی",
};

export interface FormTypeManagerProps {
  onNewSave: (schema: FormSchema) => Promise<void>;
  onCancel: () => void;
}

export interface FormTypeBuilderProps {
  initialSchema: FormSchema;
  isEditing?: boolean;
  onSave: (schema: FormSchema) => Promise<void>;
  onDelete?: () => void;
  onCancel?: () => void;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export interface SelectOptionsDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (options: string[]) => void;
  initialOptions?: string[];
}

export interface FieldLabelDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (label: string, required: boolean) => void;
  fieldType: string;
}

export interface EntityRefDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (target: string) => void;
}

export interface DisplayFieldDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (displayField: string) => void;
  targetFormType?: string;
}

export interface SchemaDisplayProps {
  formName: string;
  onFormNameChange: (name: string) => void;
  hasItems: boolean;
  onHasItemsChange: (hasItems: boolean) => void;
  headerFields: Field[];
  itemFields: Field[];
  onDeleteField: (id: string, isHeader: boolean) => void;
}

export interface ManagerTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void; // Explicitly string (no union)
}

export interface FieldTypeSelectorProps {
  selectedType: string; // Keeps as string (union of literals assignable)
  onTypeChange: (type: string) => void;
  onAddToHeader: () => void;
  onAddToItems: () => void;
  hasItems: boolean;
}

export interface BuilderActionsProps {
  formName: string;
  hasItems: boolean;
  headerFields: Field[];
  itemFields: Field[];
  isEditing: boolean;
  onSave: (schema: FormSchema) => Promise<void>;
  onDelete?: () => void;
  onCancel?: () => void;
}

export interface RawFormType {
  $id: string;
  name: string;
  schema: unknown; // Start loose, cast later
}

export interface UseFormTypeActionsProps {
  selectedType: string;
  setCurrentSchema: (schema: FormSchema) => void;
  setSelectedType: (type: string) => void;
  onNewSave: (schema: FormSchema) => Promise<void>;
}

export interface UseFormSchemaProps {
  initialSchema: FormSchema;
}

export interface UseFieldAdditionProps {
  selectedType: keyof typeof FIELD_TYPES;
  setSelectedType: (type: keyof typeof FIELD_TYPES) => void;
  addField: (
    zone: "header" | "items",
    type: Field["type"],
    label: string,
    options?: string[],
    targetId?: string,
    required?: boolean,
    displayField?: string // NEW
  ) => void;
}

export interface FieldsListProps {
  fields: Field[];
  isHeader: boolean;
  onDeleteField: (id: string, isHeader: boolean) => void;
  formTypes: FormType[];
}

export interface FieldChipsProps {
  field: Field;
  getReferenceName: (targetId: string) => string;
}

// In UseFieldAdditionProps

// FIXED: Updated CommonFieldProps to include register for input components
export interface CommonFieldProps {
  register?: UseFormRegister<FormValues>;
  name: string;
  label: string;
  required?: boolean;
  errors?: FieldErrors<FormValues>;
}

export interface SelectFieldProps extends CommonFieldProps {
  options: string[];
}

export interface EntityFieldProps extends CommonFieldProps {
  options: EntityOption[];
  field: Field;
}

export interface EntityOption {
  $id: string;
  name: string;
  data: object;
}

export interface FieldInputProps {
  field: Field;
  baseName?: string;
  isItem?: boolean;
  entityOptions: { [key: string]: EntityOption[] };
  register?: UseFormRegister<FormValues>;
  watch?: UseFormWatch<FormValues>;
  setValue?: UseFormSetValue<FormValues>;
  control?: Control<FormValues>;
  errors?: FieldErrors<FormValues>;
  name: string;
  label: string;
  required: boolean;
}

export interface HeaderSectionProps {
  fields: Field[];
  baseName?: string;
  entityOptions: { [key: string]: EntityOption[] };
  register?: UseFormRegister<FormValues>;
  watch?: UseFormWatch<FormValues>;
  setValue?: UseFormSetValue<FormValues>;
  control?: Control<FormValues>;
  errors?: FieldErrors<FormValues>;
}

export interface ItemsSectionProps {
  fields: Field[];
  itemFields: { id: string }[];
  onAppend: () => void;
  onRemove: (index: number) => void;
  entityOptions: { [key: string]: EntityOption[] };
  register?: UseFormRegister<FormValues>;
  watch?: UseFormWatch<FormValues>;
  setValue?: UseFormSetValue<FormValues>;
  control?: Control<FormValues>;
  errors?: FieldErrors<FormValues>;
}

export interface DynamicFormProps {
  schema: Schema; // FIXED: Use Schema (omits 'name') instead of FormSchema
  initialData?: {
    header: Record<string, unknown>;
    items: Array<Record<string, unknown>>;
  };
  onSubmit: (data: object) => void;
  onCancel: () => void;
}
export interface FormData {
  [key: string]: unknown;
  items?: Array<Record<string, unknown>>;
}

export interface ItemData {
  [key: string]: unknown;
}

export interface CreateRecordProps {
  onCancel: () => void;
  onSuccess?: () => void; // New: Callback for parent on successful save
  showSnackbar: (message: string, severity?: AlertColor) => void; // NEW: From parent
}
