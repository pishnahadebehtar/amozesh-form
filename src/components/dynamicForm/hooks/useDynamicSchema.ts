import { useMemo } from "react";

import type { Schema } from "../types";
import { buildZodShape } from "../utils/buildZodShape"; // Now supports all types
import { buildDefaults } from "../utils/buildDefaults";
import { buildFullZodSchema } from "../utils/buildFullZodSchema";

export const useDynamicSchema = (schema: Schema) => {
  // CHANGED: Pass fields directly; buildZodShape now uses raw labels
  const headerShape = useMemo(
    () => buildZodShape(schema.headerFields),
    [schema.headerFields]
  );

  const itemShape = useMemo(
    () => (schema.hasItems ? buildZodShape(schema.itemFields) : {}),
    [schema.hasItems, schema.itemFields]
  );

  const fullSchema = useMemo(
    () => buildFullZodSchema(headerShape, itemShape),
    [headerShape, itemShape]
  );

  // CHANGED: buildDefaults now uses raw labels
  const headerDefaults = useMemo(
    () => buildDefaults(schema.headerFields),
    [schema.headerFields]
  );

  return { fullSchema, headerDefaults };
};
