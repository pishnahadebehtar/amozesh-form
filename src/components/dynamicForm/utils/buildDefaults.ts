import type { Field } from "../types";
// import { buildFieldKey } from "./buildFieldKey"; // REMOVED: No longer needed
import { getFieldDefaultValue } from "./getFieldDefaultValue";

export const buildDefaults = (fields: Field[]): Record<string, unknown> =>
  Object.fromEntries(
    fields.map((field) => [
      // CHANGED: Use raw field.label as key (with spaces)
      field.label,
      getFieldDefaultValue(field),
    ])
  );
