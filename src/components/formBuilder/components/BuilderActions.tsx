// src/components/formBuilder/components/BuilderActions.tsx (Uniform full widths for button container)
"use client";

import React from "react";
import { Box, Button } from "@mui/material";
import { BuilderActionsProps } from "../types/index";
import { buildSchema } from "../utils/utils";

export default function BuilderActions({
  formName,
  hasItems,
  headerFields,
  itemFields,
  isEditing,
  onSave,
  onDelete,
  onCancel,
}: BuilderActionsProps) {
  const handleSave = async () => {
    if (!formName.trim()) {
      alert("نام فرم الزامی است!");
      return;
    }
    const schema = buildSchema(formName, hasItems, headerFields, itemFields);
    await onSave(schema);
  };

  return (
    <Box
      sx={{
        mt: 0.5,
        display: "flex",
        justifyContent: "center",
        gap: 0.5,
        width: "100%", // FIXED: Uniform full width for container
      }}
    >
      <Button
        onClick={onCancel}
        sx={{
          minWidth: { xs: 60, sm: 80 },
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          flex: 1, // FIXED: Equal flex to make uniform width
          maxWidth: "150px", // FIXED: Cap max width for uniformity
        }}
      >
        لغو
      </Button>
      {isEditing && onDelete && (
        <Button
          onClick={onDelete}
          color="error"
          sx={{
            minWidth: { xs: 60, sm: 80 },
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            flex: 1, // FIXED: Equal flex
            maxWidth: "150px",
          }}
        >
          حذف
        </Button>
      )}
      <Button
        variant="contained"
        onClick={handleSave}
        disabled={!formName.trim()}
        sx={{
          minWidth: { xs: 100, sm: 120 },
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          flex: 1, // FIXED: Equal flex
          maxWidth: "150px",
        }}
      >
        {isEditing ? "ذخیره تغییرات" : "ذخیره نوع فرم"}
      </Button>
    </Box>
  );
}
