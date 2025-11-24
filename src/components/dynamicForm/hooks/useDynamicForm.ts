import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import type { Schema, FormData, ItemData } from "../types"; // FIXED: Import FormSchema instead of Schema
import { useDynamicSchema } from "./useDynamicSchema";
import { getItemDefaults } from "../utils/getItemDefaults";

export const useDynamicForm = (
  schema: Schema, // FIXED: Use Schema
  initialData?: Partial<FormData>
) => {
  const { fullSchema, headerDefaults } = useDynamicSchema(schema);

  // SIMPLIFIED: Always include items as [] or initial; schema allows it
  const defaultValues = useMemo(
    () => ({
      ...headerDefaults,
      ...(initialData?.header ?? {}),
      items: initialData?.items || [],
    }),
    [headerDefaults, initialData]
  );

  const form = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    defaultValues,
  });

  // Unconditional hook; dynamic path OK with @ts-expect-error
  const {
    fields: rawItemFields,
    append: rawAppend,
    remove: rawRemove,
  } = useFieldArray({
    control: form.control,
    // @ts-expect-error Dynamic FormData causes ArrayPath<'never'>; "items" exists at runtime via schema
    name: "items" as const,
  });

  // Type explicitly
  const itemFields: { id: string }[] = useMemo(
    () => (schema.hasItems ? rawItemFields : []),
    [rawItemFields, schema.hasItems]
  );

  const itemDefaults = useMemo(() => getItemDefaults(schema), [schema]);

  const appendItem = () => {
    if (schema.hasItems) {
      rawAppend(itemDefaults as ItemData);
    }
  };

  const removeItem = (index: number) => {
    if (schema.hasItems) {
      rawRemove(index);
    }
  };

  return {
    form,
    itemFields,
    append: appendItem,
    remove: removeItem,
    headerDefaults,
  };
};
