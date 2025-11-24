// src/components/dynamicForm/utils/formUtils.ts
// utils/formUtils.ts
import { z } from "zod";
import type { Field } from "../types"; // Adjust path as needed

// Utility: Standardize field keys (e.g., "Customer Name" -> "customer_name")
export const buildFieldKey = (label: string): string =>
  label.toLowerCase().replace(/\s+/g, "_");

// Utility: Get default value for a field based on type
export const getFieldDefaultValue = (field: Field): unknown => {
  switch (field.type) {
    case "number":
      return 0;
    case "checkbox":
      return false;
    case "date":
      return "";
    default:
      return "";
  }
};

// Utility: Build Zod schema shape from fields
export const buildZodShape = (
  fields: Field[]
): { [key: string]: z.ZodTypeAny } => {
  const shape: { [key: string]: z.ZodTypeAny } = {};
  fields.forEach((field) => {
    const key = buildFieldKey(field.label);
    let schema: z.ZodTypeAny;
    switch (field.type) {
      case "text":
      case "select":
      case "reference":
        schema = field.required ? z.string().min(1) : z.string().optional();
        break;
      case "number":
        schema = field.required ? z.number().min(0) : z.number().optional();
        break;
      case "date":
        schema = field.required
          ? z.string().pipe(z.coerce.date())
          : z.string().optional();
        break;
      case "checkbox":
        schema = field.required ? z.boolean() : z.boolean().optional();
        break;
      default:
        schema = z.any();
    }
    shape[key] = schema;
  });
  return shape;
};

// Utility: Build defaults object from fields
export const buildDefaults = (fields: Field[]): Record<string, unknown> =>
  Object.fromEntries(
    fields.map((field) => [
      buildFieldKey(field.label),
      getFieldDefaultValue(field),
    ])
  );
