// src/components/listViewer/hooks/useListData.ts
import { useMemo, useCallback } from "react";
import { ListType, TableData, FormType } from "../types";
import { useFormTypes } from "./useFormTypes";
import { useRecords } from "./useRecords";

export function useListData(listType: ListType, selectedFormType: string) {
  const { formTypes, refetch: refetchFormTypes } = useFormTypes();
  const { records, refetch: refetchRecords } = useRecords(
    selectedFormType || null,
    formTypes
  );

  const data = useMemo(() => {
    if (listType === "formTypes") {
      return formTypes.map((type: FormType) => ({
        $id: type.$id,
        name: type.name,
        schema: type.schema,
        data: null,
      })) as TableData[];
    }
    return records;
  }, [listType, formTypes, records]);

  const refetch = useCallback(() => {
    if (listType === "formTypes") {
      refetchFormTypes();
    } else {
      refetchRecords();
    }
  }, [listType, refetchFormTypes, refetchRecords]);

  return { data, formTypes, refetch };
}
