// src/components/formbuilder/hooks/useFormTypeActions.ts
import { useCallback } from "react";
import type { FormSchema, UseFormTypeActionsProps } from "../types";
import { updateFormType, deleteFormType } from "@/lib/appwrite";
import { useSnackbar } from "./useSnackbar";
import { validateFormName } from "../utils/validateFormName";

export const useFormTypeActions = ({
  selectedType,
  setCurrentSchema,
  setSelectedType,
  onNewSave,
}: UseFormTypeActionsProps) => {
  const { show } = useSnackbar();

  const handleSave = useCallback(
    async (schema: FormSchema) => {
      if (selectedType === "new") {
        await onNewSave(schema);
        return;
      }

      if (!validateFormName(schema.name)) {
        show("نام فرم الزامی است!", "error");
        return;
      }

      const result = await updateFormType(selectedType, schema.name, schema);
      if (result.success) {
        setCurrentSchema(schema);
        show("نوع فرم با موفقیت به‌روزرسانی شد!");
      } else {
        show("خطا در ذخیره نوع فرم", "error");
      }
    },
    [selectedType, setCurrentSchema, onNewSave, show]
  );

  const handleDelete = useCallback(async () => {
    if (selectedType === "new") return;

    if (
      window.confirm("آیا مطمئن هستید که می‌خواهید این نوع فرم را حذف کنید؟")
    ) {
      const result = await deleteFormType(selectedType);
      if (result.success) {
        show("نوع فرم با موفقیت حذف شد!");
        setSelectedType("new");
      } else {
        show("خطا در حذف نوع فرم", "error");
      }
    }
  }, [selectedType, setSelectedType, show]);

  return { handleSave, handleDelete };
};
