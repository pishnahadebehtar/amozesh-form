// src/components/formBuilder/types/index.ts (Updated with sx props for dialogs)
import { AlertColor, SxProps, Theme } from "@mui/material";

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
  sx?: SxProps<Theme>; // FIXED: Added sx for glassy styling
}

export interface FieldLabelDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (label: string, required: boolean) => void;
  fieldType: string;
  sx?: SxProps<Theme>; // FIXED: Added sx for glassy styling
}

export interface EntityRefDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (target: string) => void;
  sx?: SxProps<Theme>; // FIXED: Added sx for glassy styling
}

export interface DisplayFieldDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (displayField: string) => void;
  targetFormType?: string;
  sx?: SxProps<Theme>; // FIXED: Added sx for glassy styling
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
