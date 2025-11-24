import { useCallback } from "react";
import { updateEntity } from "../utils/updateEntity";
import { deleteEntity } from "../utils/deleteEntity";
import { getEntityDeleteMessage } from "../utils/getEntityDeleteMessage";

interface UseListActionsProps {
  type: string;
  onRefetch?: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export const useListActions = ({
  type,
  onRefetch,
  onSuccess,
  onError,
}: UseListActionsProps) => {
  const handleSaveEdit = useCallback(
    async (id: string, updatedData: object): Promise<void> => {
      // Uses our updated utils instead of fetch
      const result = await updateEntity(id, updatedData, type);
      if (result?.success) {
        onRefetch?.();
        onSuccess?.("به‌روزرسانی با موفقیت انجام شد!");
      } else {
        onError?.("خطا در به‌روزرسانی رکورد");
      }
    },
    [type, onRefetch, onSuccess, onError]
  );

  const handleDelete = useCallback(
    async (id: string): Promise<void> => {
      const message = getEntityDeleteMessage(type);
      if (confirm(message)) {
        // Uses our updated utils
        const result = await deleteEntity(id, type);
        if (result.success) {
          onRefetch?.();
          onSuccess?.("حذف با موفقیت انجام شد!");
        } else {
          onError?.("خطا در حذف رکورد");
        }
      }
    },
    [type, onRefetch, onSuccess, onError]
  );

  return { handleSaveEdit, handleDelete };
};
