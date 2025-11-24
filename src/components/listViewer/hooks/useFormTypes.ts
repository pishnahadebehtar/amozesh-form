import { useState, useEffect, useCallback } from "react";
import { FormType } from "../types";
import { getFormTypes } from "@/lib/appwrite";

export function useFormTypes() {
  const [formTypes, setFormTypes] = useState<FormType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFormTypes = useCallback(async () => {
    try {
      setLoading(true);
      // REPLACED: fetch -> getFormTypes
      const types = await getFormTypes();
      setFormTypes(types as FormType[]);
      setError(null);
    } catch (err) {
      setError("Failed to fetch form types");
      console.error("Error fetching form types:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFormTypes();
  }, [fetchFormTypes]);

  return { formTypes, loading, error, refetch: fetchFormTypes };
}
