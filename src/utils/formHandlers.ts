import { createFormType } from "@/lib/appwrite";
import { AlertColor } from "@mui/material";
import type { FormSchema } from "@/types";

export const handleNewFormType = async (
  schema: FormSchema,
  showSnackbar: (message: string, severity?: AlertColor) => void,
  setActiveSection: (
    section: "formTypes" | "createRecord" | "list" | null
  ) => void
): Promise<void> => {
  // Logic updated to use createFormType directly instead of fetch
  if (schema.name) {
    const result = await createFormType(schema.name, schema);
    if (result.success && result.$id) {
      showSnackbar("نوع فرم با موفقیت ذخیره شد!");
      setActiveSection(null);
    } else {
      showSnackbar("خطا در ذخیره نوع فرم", "error");
    }
  } else {
    showSnackbar("نام فرم الزامی است!", "error");
  }
};
