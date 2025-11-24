import { useState, useEffect } from "react";
import type { Field, EntityOption } from "../types";
import { getRecordsForReference } from "@/lib/appwrite";
import { mapRecordsToOptions } from "../utils/mapRecordsToOptions";
import { getEntityReferenceFields } from "../utils/getEntityReferenceFields";
import { getFormTypes } from "@/lib/appwrite";
// import { buildFieldKey } from "../utils/buildFieldKey"; // REMOVED

interface FormType {
  $id: string;
  name: string;
  schema: {
    hasItems: boolean;
    headerFields: Field[];
    itemFields: Field[];
  };
}

type Schema = FormType["schema"];

export const useEntityOptions = (fields: Field[]) => {
  const [entityOptions, setEntityOptions] = useState<{
    [key: string]: EntityOption[];
  }>({});
  const [loading, setLoading] = useState<boolean>(false); // NEW: Loading state

  useEffect(() => {
    console.log(
      "[DEBUG] useEntityOptions: Fields changed, starting fetch:",
      fields
    );

    const fetchEntities = async () => {
      if (fields.length === 0) {
        setEntityOptions({});
        setLoading(false);
        return;
      }

      setLoading(true); // NEW: Set loading

      const newOptions: { [key: string]: EntityOption[] } = {};

      let targetTypes: FormType[] = [];
      try {
        const rawTypes = await getFormTypes();
        console.log(
          "[DEBUG] useEntityOptions: Raw form types fetched:",
          rawTypes
        );
        targetTypes = rawTypes.map(
          (t: { $id: string; name: string; schema: unknown }) => ({
            $id: t.$id,
            name: t.name,
            schema: t.schema as Schema,
          })
        );
        console.log(
          "[DEBUG] useEntityOptions: Processed target types:",
          targetTypes
        );
      } catch (error) {
        console.error("Failed to fetch form types for entity options:", error);
      }

      const referenceFields = getEntityReferenceFields(fields); // Now fixed; will log inside
      console.log(
        "[DEBUG] useEntityOptions: Reference fields found:",
        referenceFields
      );

      for (const field of referenceFields) {
        try {
          console.log(
            `[DEBUG] useEntityOptions: Processing field ${field.id} (label: ${field.label}, target: ${field.targetFormType}, displayField: "${field.displayField}")`
          );

          let displayKey: string | undefined;

          if (field.displayField && field.targetFormType) {
            const targetType = targetTypes.find(
              (t) => t.$id === field.targetFormType
            );
            console.log(
              `[DEBUG] useEntityOptions: Target type for ${field.id}:`,
              targetType
            );
            if (targetType && targetType.schema) {
              const schema = targetType.schema;
              const displayFieldObj: Field | undefined =
                schema.headerFields.find(
                  (f: Field) => f.label === field.displayField
                );
              console.log(
                `[DEBUG] useEntityOptions: Display field match for "${field.displayField}":`,
                displayFieldObj
              );
              if (displayFieldObj) {
                // CHANGED: Use raw label as displayKey (with spaces)
                displayKey = displayFieldObj.label;
                console.log(
                  `[DEBUG] useEntityOptions: Computed displayKey for ${field.id}: "${displayKey}"`
                );
              } else {
                console.warn(
                  `Display field "${field.displayField}" not found in target schema for ${field.id}. Available labels:`,
                  schema.headerFields.map((f) => f.label)
                );
              }
            }
          }

          const records = await getRecordsForReference(field.targetFormType!);
          console.log(
            `[DEBUG] useEntityOptions: Records fetched for ${field.id}:`,
            records
          );

          const options = mapRecordsToOptions(records, displayKey);
          console.log(
            `[DEBUG] useEntityOptions: Mapped options for ${field.id}:`,
            options
          );

          newOptions[field.id] = options;
        } catch (error) {
          console.error(
            `Failed to fetch entities for field ${field.id}:`,
            error
          );
          newOptions[field.id] = [];
        }
      }
      console.log("[DEBUG] useEntityOptions: Final newOptions:", newOptions);
      setEntityOptions(newOptions);
    };

    fetchEntities();
    setLoading(false); // NEW: Reset loading after fetch
  }, [fields]);

  console.log(
    "[DEBUG] useEntityOptions: Returning entityOptions:",
    entityOptions
  );
  return { entityOptions, loading }; // NEW: Return loading
};
