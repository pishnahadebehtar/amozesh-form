// src/components/listViewer/utils/getEntityDeleteMessage.ts
export function getEntityDeleteMessage(type: string): string {
  return type === "formTypes" ? "حذف نوع فرم؟" : "حذف رکورد؟";
}
