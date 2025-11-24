// src/components/formbuilder/utils/getDefaultSchema.ts
import type { FormSchema } from "../types";

export function getDefaultSchema(): FormSchema {
  return {
    name: "",
    hasItems: false,
    headerFields: [],
    itemFields: [],
  };
}
