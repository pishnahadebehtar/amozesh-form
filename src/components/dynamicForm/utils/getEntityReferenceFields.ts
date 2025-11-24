// src/components/dynamicForm/utils/getEntityReferenceFields.ts
import type { Field } from "../types";

export function getEntityReferenceFields(fields: Field[]): Field[] {
  console.log(
    "[DEBUG] getEntityReferenceFields: Raw fields:",
    fields.map((f) => ({ id: f.id, type: f.type, target: f.targetFormType }))
  ); // Log raw for debug

  const references = fields.filter((field) => {
    const isRef = field.type === "reference" && !!field.targetFormType; // FIXED: "reference" not "entity_reference"
    console.log(
      "[DEBUG] getEntityReferenceFields: Field check:",
      field.id,
      field.type,
      "isRef:",
      isRef
    ); // Per-field log
    return isRef;
  });

  console.log(
    "[DEBUG] getEntityReferenceFields: Filtered references:",
    references
  ); // Final log
  return references;
}
