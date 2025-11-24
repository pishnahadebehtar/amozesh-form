import { deleteFormType, deleteRecord } from "@/lib/appwrite";

export async function deleteEntity(id: string, type: string) {
  const result =
    type === "formTypes" ? await deleteFormType(id) : await deleteRecord(id);
  return result;
}
