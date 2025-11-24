import { z } from "zod";

export function buildFullZodSchema(
  headerShape: Record<string, z.ZodType<unknown>>,
  itemShape: Record<string, z.ZodType<unknown>>
) {
  // FIXED: Always optional array (allows [] or undefined); no strict undefined
  // Use hasItems for UI only; validation flexible to match form state
  const itemsSchema = z.array(z.object(itemShape)).optional();

  return z.object({
    ...headerShape,
    items: itemsSchema,
  });
}
