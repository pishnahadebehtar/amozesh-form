// features/listViewer/hooks/useFormTypes.ts
import { useState, useEffect } from "react";
import { FormType } from "../types";
import { getFormTypes } from "@/lib/appwrite";

export function useFormTypes() {
  const [formTypes, setFormTypes] = useState<FormType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFormTypes = async () => {
    try {
      setLoading(true);
      const types = await getFormTypes();
      setFormTypes(types as FormType[]);
      setError(null);
    } catch (err) {
      setError("Failed to fetch form types");
      console.error("Error fetching form types:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormTypes();
  }, []);

  const refetch = fetchFormTypes;

  return { formTypes, loading, error, refetch };
}
