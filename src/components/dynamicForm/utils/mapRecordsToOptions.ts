import type { EntityOption } from "../types";

interface AppwriteRecord {
  $id: string;
  data: {
    header?: Record<string, unknown>;
    items?: Array<Record<string, unknown>>;
  };
}

export function mapRecordsToOptions(
  records: AppwriteRecord[],
  displayKey?: string // CHANGED: Now raw label with spaces
): EntityOption[] {
  return records.map((r) => {
    const header = r.data?.header || {};

    // CHANGED: Use raw displayKey (with spaces) for header access
    const displayName = displayKey
      ? header[displayKey] ?? header.name ?? r.$id // Chain ?? for safe fallback
      : header.name ?? r.$id;

    return {
      $id: r.$id,
      name: String(displayName), // FIXED: Always string; no undefined
      data: {
        header: header,
        ...(r.data.items && { items: r.data.items }), // Preserve items if they exist
      },
    };
  });
}
