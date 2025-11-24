// src/hooks/utils/getItemDefaults.ts
import { buildDefaults } from "./buildDefaults"; // Adjust path if needed based on your structure
import type { Schema } from "../types";

export function getItemDefaults(schema: Schema) {
  return buildDefaults(schema.itemFields);
}
