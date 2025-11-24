// src/components/formbuilder/utils/getSchemaById.ts
import type { FormType, FormSchema } from "../types";

export function getSchemaById(
  formTypes: FormType[],
  id: string
): FormSchema | null {
  const type = formTypes.find((t) => t.$id === id);
  return type ? type.schema : null;
}
