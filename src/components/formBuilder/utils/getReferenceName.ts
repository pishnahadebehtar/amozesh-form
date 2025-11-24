// src/components/formbuilder/utils/getReferenceName.ts
import type { FormType } from "../types";

export function getReferenceName(
  formTypes: FormType[],
  targetId: string
): string {
  const target = formTypes.find((type) => type.$id === targetId);
  return target ? target.name : "نامشخص";
}
