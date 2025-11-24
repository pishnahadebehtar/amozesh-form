// utils/formHandlers.ts
import type { FormSchema } from "@/types";
import type { AlertColor } from "@mui/material";
export const handleNewFormType = async (
  schema: FormSchema,
  showSnackbar: (message: string, severity?: AlertColor) => void,
  setActiveSection: (
    section: "formTypes" | "createRecord" | "list" | null
  ) => void
): Promise<void> => {
  // Now calls API internally in component, but keep for compatibility
  if (schema.name) {
    const res = await fetch("/api/form-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: schema.name, schema }),
    });
    if (res.ok) {
      showSnackbar("نوع فرم با موفقیت ذخیره شد!");
      setActiveSection(null);
    } else {
      showSnackbar("خطا در ذخیره نوع فرم", "error");
    }
  } else {
    showSnackbar("نام فرم الزامی است!", "error");
  }
};
