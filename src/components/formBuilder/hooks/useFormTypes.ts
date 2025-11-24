import { useState, useEffect } from "react";
import { getFormTypes } from "@/lib/appwrite";
import { FormType, FormSchema, RawFormType } from "../types/index"; // Import FormSchema for casting

export function useFormTypes() {
  const [formTypes, setFormTypes] = useState<FormType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setLoading(true);
        const types: RawFormType[] = await getFormTypes();
        // Map to typed FormType
        const typedTypes: FormType[] = types.map((type) => ({
          $id: type.$id,
          name: type.name,
          schema: type.schema as FormSchema, // Safe cast now that we have the interface
        }));
        setFormTypes(typedTypes);
        setError(null);
      } catch (err) {
        setError("خطا در بارگذاری انواع فرم");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, []);

  return {
    formTypes,
    loading,
    error,
    refetch: () => {
      /* optional refetch logic */
    },
  };
}
