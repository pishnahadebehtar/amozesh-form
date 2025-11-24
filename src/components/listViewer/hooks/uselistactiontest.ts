import { useCallback } from "react";
import { updateEntity } from "../utils/updateEntity";
import { deleteEntity } from "../utils/deleteEntity";
import { getEntityDeleteMessage } from "../utils/getEntityDeleteMessage";

interface UseListActionsProps {
  type: string;
  onRefetch?: () => void;
  onSuccess?: (message: string) => void; // Success callback
  onError?: (message: string) => void; // NEW: Error callback
}

export const useListActions = ({
  type,
  onRefetch,
  onSuccess,
  onError, // NEW
}: UseListActionsProps) => {
  const handleSaveEdit = useCallback(
    async (id: string, updatedData: object): Promise<void> => {
      const result = await updateEntity(id, updatedData, type);
      if (result?.success) {
        onRefetch?.();
        onSuccess?.("به‌روزرسانی با موفقیت انجام شد!");
      } else {
        onError?.("خطا در به‌روزرسانی رکورد"); // NEW: Error message
      }
    },
    [type, onRefetch, onSuccess, onError]
  );

  const handleDelete = useCallback(
    async (id: string): Promise<void> => {
      const message = getEntityDeleteMessage(type);
      if (confirm(message)) {
        const result = await deleteEntity(id, type);
        if (result.success) {
          onRefetch?.();
          onSuccess?.("حذف با موفقیت انجام شد!");
        } else {
          onError?.("خطا در حذف رکورد"); // NEW: Error message
        }
      }
    },
    [type, onRefetch, onSuccess, onError]
  );

  return { handleSaveEdit, handleDelete };
};
