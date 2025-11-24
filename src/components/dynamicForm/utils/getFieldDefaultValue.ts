// src/components/DynamicForm/utils/getFieldDefaultValue.ts
import type { Field } from "../types";

export const getFieldDefaultValue = (field: Field): unknown => {
  switch (field.type) {
    case "number":
      return 0;
    case "checkbox":
      return false;
    case "date":
      return "";
    default:
      return "";
  }
};
