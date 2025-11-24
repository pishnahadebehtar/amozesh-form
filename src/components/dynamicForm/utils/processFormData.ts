import type { ItemData } from "../types";

export function processFormData(data: Record<string, unknown>): {
  header: Record<string, unknown>;
  items: ItemData[];
} {
  const headerData = { ...data };

  // FIXED: Extract items if present (even empty []); default to [] if missing/undefined
  const items =
    "items" in headerData ? (headerData.items as ItemData[]) || [] : [];
  delete headerData.items;

  return {
    header: headerData,
    items,
  };
}
