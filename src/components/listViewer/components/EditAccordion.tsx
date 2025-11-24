"use client";

import React from "react";
import { Box, Button } from "@mui/material";
import type { EditFormProps, BaseRowData, Schema, FormSchema } from "../types";
import FormTypeBuilder from "@/components/formBuilder/FormTypeBuilder";
import DynamicForm from "@/components/dynamicForm/DynamicForm";
import CustomAccordion from "@/components/CustomAccordion";

export function EditAccordion<T extends BaseRowData>({
  row,
  type,
  onSave,
  onCancel,
  onDelete,
}: EditFormProps<T>) {
  const defaultInitialData = { header: {}, items: [] };
  const safeInitialData = row.data
    ? (row.data as typeof defaultInitialData)
    : defaultInitialData;

  const handleDeleteClick = async () => {
    if (confirm(type === "formTypes" ? "حذف نوع فرم؟" : "حذف رکورد؟")) {
      await onDelete(row.$id);
    }
  };

  // FIXED: For records, add dummy name to make Schema -> FormSchema
  const schemaForForm: FormSchema =
    type === "formTypes"
      ? (row.schema as FormSchema)
      : {
          name: "رکورد موقت",
          ...(row.schema as Schema),
        };

  return (
    <CustomAccordion
      title={`ویرایش ${type === "formTypes" ? "نوع فرم" : "رکورد"}`}
      defaultExpanded={true}
      sx={{ mt: 2 }}
    >
      <Box sx={{ p: 2, maxHeight: 600, overflow: "auto" }}>
        {type === "formTypes" ? (
          <FormTypeBuilder
            initialSchema={schemaForForm}
            onSave={async (updatedSchema) => {
              await onSave(row.$id, updatedSchema);
              onCancel();
            }}
            onCancel={onCancel}
          />
        ) : (
          <DynamicForm
            schema={schemaForForm} // FIXED: Now FormSchema with name
            initialData={safeInitialData}
            onSubmit={async (data) => {
              await onSave(row.$id, data);
              onCancel();
            }}
            onCancel={onCancel}
          />
        )}
        <Button onClick={handleDeleteClick} color="error" sx={{ mt: 2 }}>
          حذف
        </Button>
      </Box>
    </CustomAccordion>
  );
}
