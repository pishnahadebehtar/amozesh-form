// Utility functions for form builder operations.
// These are pure or side-effect-free helpers to keep components lean.

import { Field, FormSchema, FIELD_TYPES } from "../types";

/**
 * Generates a unique ID for a new field.
 * Uses timestamp + random string for collision resistance.
 */
export function generateFieldId(): string {
  return `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generic function to delete a field from an array by ID and update state.
 * @param fields - Current array of fields
 * @param id - ID of field to remove
 * @param setter - State setter to update the array (e.g., setHeaderFields)
 */
export function deleteField(
  fields: Field[],
  id: string,
  setter: React.Dispatch<React.SetStateAction<Field[]>>
): void {
  setter((prev) => prev.filter((f) => f.id !== id));
}

/**
 * Builds a display label for a field, with fallback if label is empty.
 * @param field - The field object
 * @returns Formatted label string
 */
export function getFieldDisplayLabel(field: Field): string {
  return (
    field.label ||
    `بدون عنوان ${FIELD_TYPES[field.type as keyof typeof FIELD_TYPES]}`
  );
}

/**
 * Assembles the full FormSchema from component state.
 * Ensures itemFields is empty if !hasItems.
 * @param formName - Form name string
 * @param hasItems - Boolean for items support
 * @param headerFields - Header fields array
 * @param itemFields - Item fields array
 * @returns Complete FormSchema
 */
export function buildSchema(
  formName: string,
  hasItems: boolean,
  headerFields: Field[],
  itemFields: Field[]
): FormSchema {
  return {
    name: formName,
    hasItems,
    headerFields,
    itemFields: hasItems ? itemFields : [],
  };
}
