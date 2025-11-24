// src/components/DynamicForm/utils/getResetFormData.ts
export function getResetFormData(
  headerDefaults: Record<string, unknown>
): Record<string, unknown> {
  return { ...headerDefaults, items: [] };
}
