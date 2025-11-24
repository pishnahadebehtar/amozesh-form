import { useCallback } from "react";
import type { FormSchema } from "../types";
import { useSnackbar } from "./useSnackbar";
import { validateFormName } from "../utils/validateFormName";
import { updateFormType, deleteFormType } from "@/lib/appwrite"; // Changed Import

export interface UseFormTypeActionsProps {
  selectedType: string;
  setCurrentSchema: React.Dispatch<React.SetStateAction<FormSchema>>;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  onNewSave: (schema: FormSchema) => Promise<void>;
}

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
        show("نوع فرم با موفقیت ایجاد شد!");
        return;
      }

      if (!validateFormName(schema.name)) {
        show("نام فرم الزامی است!", "error");
        return;
      }

      // REPLACED: fetch(PUT) -> updateFormType()
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
      // REPLACED: fetch(DELETE) -> deleteFormType()
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
