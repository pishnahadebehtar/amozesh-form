import type { AlertColor } from "@mui/material"; // Fixed import

export type FieldType =
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
  targetFormType?: string;
  displayField?: string;
  multiple?: boolean;
}

export interface FormSchema {
  name: string;
  hasItems: boolean;
  headerFields: Field[];
  itemFields: Field[];
}

export interface Schema {
  hasItems: boolean;
  headerFields: Field[];
  itemFields: Field[];
}

export interface FormType {
  $id: string;
  name: string;
  schema: FormSchema;
}

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

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}
