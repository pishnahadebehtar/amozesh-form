// src/components/formBuilder/components/SchemaDisplay.tsx (Fixed unused useState import)
"use client";

import React from "react"; // FIXED: Removed unused { useState }
import { useFormTypes } from "../hooks/useFormTypes";
import { Box, TextField, FormControlLabel, Switch } from "@mui/material";
import type { SchemaDisplayProps } from "../types";
import FieldsList from "./FieldsList";
import CustomAccordion from "./CustomAccordion";

export default function SchemaDisplay({
  formName,
  onFormNameChange,
  hasItems,
  onHasItemsChange,
  headerFields,
  itemFields,
  onDeleteField,
}: SchemaDisplayProps) {
  const { formTypes } = useFormTypes();

  return (
    <Box
      sx={{
        p: 0.5,
        width: "100%",
        mx: "auto",
      }}
    >
      <TextField
        label="نام نوع فرم (الزامی)"
        value={formName}
        onChange={(e) => onFormNameChange(e.target.value)}
        fullWidth
        required
        sx={{ mb: 1, width: "100%" }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={hasItems}
            onChange={(e) => onHasItemsChange(e.target.checked)}
          />
        }
        label="دارای جدول اقلام؟"
        sx={{ mb: 1, justifyContent: "flex-start", width: "100%" }}
      />

      {/* Header Fields - Custom Collapsible */}
      <CustomAccordion
        title="فیلدهای سربرگ"
        defaultExpanded={true}
        sx={{ mb: 1 }}
      >
        <FieldsList
          fields={headerFields}
          isHeader={true}
          onDeleteField={onDeleteField}
          formTypes={formTypes}
        />
      </CustomAccordion>

      {/* Items Fields - Conditional and Custom Collapsible */}
      {hasItems && (
        <CustomAccordion title="فیلدهای اقلام" defaultExpanded={true}>
          <FieldsList
            fields={itemFields}
            isHeader={false}
            onDeleteField={onDeleteField}
            formTypes={formTypes}
          />
        </CustomAccordion>
      )}
    </Box>
  );
}
