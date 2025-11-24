// FILE: src/components/formBuilder/hooks/useFormSchema.ts
import { useState, useEffect, useCallback, useRef } from "react";
import type { Field, UseFormSchemaProps } from "../types";
import { generateFieldId, buildSchema } from "../utils/utils";

export function useFormSchema({ initialSchema }: UseFormSchemaProps) {
  // Use refs to store previous values for comparison
  const prevSchemaRef = useRef(initialSchema);

  const [formName, setFormName] = useState(initialSchema.name);
  const [hasItems, setHasItems] = useState(initialSchema.hasItems);
  const [headerFields, setHeaderFields] = useState<Field[]>(
    initialSchema.headerFields
  );
  const [itemFields, setItemFields] = useState<Field[]>(
    initialSchema.itemFields
  );

  // FIXED: Only update if initialSchema actually changed (deep comparison)
  useEffect(() => {
    // Skip if same reference or shallow equal
    if (prevSchemaRef.current === initialSchema) return;

    // Shallow check for changes
    const hasChanged =
      prevSchemaRef.current.name !== initialSchema.name ||
      prevSchemaRef.current.hasItems !== initialSchema.hasItems ||
      prevSchemaRef.current.headerFields !== initialSchema.headerFields ||
      prevSchemaRef.current.itemFields !== initialSchema.itemFields;

    if (hasChanged) {
      setFormName(initialSchema.name);
      setHasItems(initialSchema.hasItems);
      setHeaderFields(initialSchema.headerFields);
      setItemFields(initialSchema.itemFields);
    }

    // Update ref
    prevSchemaRef.current = initialSchema;
  }, [initialSchema]); // Only re-run when initialSchema reference changes

  const addField = useCallback(
    (
      zone: "header" | "items",
      type: Field["type"],
      label: string,
      options?: string[],
      targetFormType?: string,
      required: boolean = false,
      displayField?: string
    ) => {
      const newField: Field = {
        id: generateFieldId(),
        type,
        label,
        required,
        options,
        ...(targetFormType && { targetFormType }),
        ...(displayField && { displayField }),
      };

      if (zone === "header") {
        setHeaderFields((prev) => [...prev, newField]);
      } else if (hasItems) {
        setItemFields((prev) => [...prev, newField]);
      }
    },
    [hasItems]
  );

  const deleteField = useCallback((id: string, isHeader: boolean) => {
    if (isHeader) {
      setHeaderFields((prev) => prev.filter((f) => f.id !== id));
    } else {
      setItemFields((prev) => prev.filter((f) => f.id !== id));
    }
  }, []);

  const getSchema = useCallback(() => {
    return buildSchema(formName, hasItems, headerFields, itemFields);
  }, [formName, hasItems, headerFields, itemFields]);

  return {
    formName,
    setFormName,
    hasItems,
    setHasItems,
    headerFields,
    itemFields,
    addField,
    deleteField,
    getSchema,
  };
}
