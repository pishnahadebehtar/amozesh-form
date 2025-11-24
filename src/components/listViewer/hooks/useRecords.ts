import { useState, useEffect, useCallback } from "react";
import { TableData, FormType, RecordData } from "../types";
import { getRecordsByFormType } from "@/lib/appwrite";

export function useRecords(formTypeId: string | null, formTypes: FormType[]) {
  const [records, setRecords] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(
    async (id: string) => {
      if (!id) {
        setRecords([]);
        return;
      }

      try {
        setLoading(true);
        // REPLACED: fetch -> getRecordsByFormType
        const fetchedRecords = await getRecordsByFormType(id);

        const formType = formTypes.find((t) => t.$id === id);

        if (formType) {
          const processedData = fetchedRecords.map((record) => ({
            $id: record.$id,
            data: record.data as RecordData | null,
            schema: formType.schema,
          }));
          setRecords(processedData);
          setError(null);
        }
      } catch (err) {
        setError("Failed to fetch records");
        console.error("Error fetching records:", err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    },
    [formTypes]
  );

  useEffect(() => {
    fetchRecords(formTypeId ?? "");
  }, [formTypeId, fetchRecords]);

  const refetch = useCallback(
    () => fetchRecords(formTypeId ?? ""),
    [formTypeId, fetchRecords]
  );

  return { records, loading, error, refetch };
}
