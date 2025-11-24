import { z } from "zod";
import type { Field } from "../types";
// import { buildFieldKey } from "./buildFieldKey"; // REMOVED

export const buildZodShape = (
  fields: Field[]
): { [key: string]: z.ZodTypeAny } => {
  const shape: { [key: string]: z.ZodTypeAny } = {};
  fields.forEach((field) => {
    // CHANGED: Use raw field.label as key (with spaces); Zod supports string keys with spaces
    const key = field.label;
    if (!key || key === "") {
      console.warn(`Skipping field with empty label: ${field.id}`);
      return;
    }
    let schema: z.ZodTypeAny;
    switch (field.type) {
      case "text":
      case "textarea":
      case "select":
      case "reference":
        schema = field.required
          ? z.string().min(1, `${field.label} الزامی است.`)
          : z.string().optional();
        break;
      case "number":
      case "integer":
      case "decimal":
        schema = field.required
          ? z.number().min(0, `${field.label} باید عددی معتبر باشد.`)
          : z.number().optional();
        break;
      case "email":
        schema = field.required
          ? z.string().email(`${field.label} ایمیل معتبر نیست.`).min(1)
          : z.string().email().optional();
        break;
      case "url":
        schema = field.required
          ? z.string().url(`${field.label} URL معتبر نیست.`).min(1)
          : z.string().url().optional();
        break;
      case "password":
        schema = field.required
          ? z.string().min(1, `${field.label} الزامی است.`)
          : z.string().optional();
        break;
      case "date":
        schema = field.required
          ? z
              .string()
              .pipe(z.coerce.date())
              .refine((d) => !isNaN(d.getTime()), {
                message: `${field.label} تاریخ معتبری نیست.`,
              })
          : z.string().optional();
        break;
      case "datetime":
        schema = field.required
          ? z
              .string()
              .pipe(z.coerce.date())
              .refine((d) => !isNaN(d.getTime()), {
                message: `${field.label} تاریخ/زمان معتبر نیست.`,
              })
          : z.string().optional();
        break;
      case "time":
        schema = field.required
          ? z.string().min(1, `${field.label} زمان معتبری است.`)
          : z.string().optional();
        break;
      case "multiselect":
        schema = field.required
          ? z.array(z.string()).min(1, `${field.label} حداقل یکی انتخاب کنید.`)
          : z.array(z.string()).optional();
        break;
      case "checkbox":
      case "radio":
        schema = field.required ? z.boolean() : z.boolean().optional();
        break;
      case "file":
      case "image":
        schema = field.required
          ? z.string().min(1, `${field.label} فایل الزامی است.`)
          : z.string().optional();
        break;
      case "hidden":
        schema = z.any().optional(); // No validation
        break;
      default:
        schema = z.any();
    }
    shape[key] = schema;
  });
  return shape;
};
