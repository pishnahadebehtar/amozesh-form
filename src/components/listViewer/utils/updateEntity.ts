import { updateFormType, updateRecord } from "@/lib/appwrite";
import type { FormSchema } from "../types";

export async function updateEntity(
  id: string,
  updatedData: object,
  type: string
) {
  let result;
  if (type === "formTypes") {
    const schema = updatedData as FormSchema;
    result = await updateFormType(id, schema.name, schema);
  } else {
    result = await updateRecord(id, updatedData);
  }
  return result;
}
