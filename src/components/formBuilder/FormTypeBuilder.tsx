"use client";

import React, { useState, useCallback } from "react";
import { Box } from "@mui/material";
import type { FormTypeBuilderProps, FIELD_TYPES } from "./types";
import { useFormSchema } from "./hooks/useFormSchema";
import { useFieldAddition } from "./hooks/useFieldAddition";
import { useSnackbar } from "./hooks/useSnackbar";
import FieldTypeSelector from "./components/FieldTypeSelector";
import SchemaDisplay from "./components/SchemaDisplay";
import BuilderActions from "./components/BuilderActions";
import FieldLabelDialog from "./dialogs/FieldLabelDialog";
import SelectOptionsDialog from "./dialogs/SelectOptionsDialog";
import EntityRefDialog from "./dialogs/EntityRefDialog";
import DisplayFieldDialog from "./dialogs/DisplayFieldDialog";
import { validateFormName } from "./utils/validateFormName";
// FIXED: Remove unused CustomAccordion import

export default function FormTypeBuilder({
  initialSchema = {
    name: "",
    hasItems: false,
    headerFields: [],
    itemFields: [],
  },
  isEditing = false,
  onSave,
  onDelete,
  onCancel,
}: FormTypeBuilderProps) {
  const {
    formName,
    setFormName,
    hasItems,
    setHasItems,
    headerFields,
    itemFields,
    addField,
    deleteField,
    getSchema,
  } = useFormSchema({ initialSchema });

  const [selectedType, setSelectedType] =
    useState<keyof typeof FIELD_TYPES>("text");

  const {
    handleTypeChange,
    labelDialogOpen,
    setLabelDialogOpen,
    optionsDialogOpen,
    setOptionsDialogOpen,
    entityDialogOpen,
    setEntityDialogOpen,
    displayDialogOpen,
    setDisplayDialogOpen,
    handleAddField,
    handleLabelConfirm,
    handleOptionsConfirm,
    handleEntitySelect,
    handleDisplayConfirm,
    pendingTargetId,
  } = useFieldAddition({ selectedType, setSelectedType, addField });

  const { show } = useSnackbar();

  const handleSave = useCallback(async () => {
    const schema = getSchema();
    if (!validateFormName(schema.name)) {
      show("نام فرم الزامی است!", "error");
      return;
    }
    await onSave(schema);
  }, [getSchema, onSave, show]);

  const dialogSx = {
    "& .MuiDialog-paper": {
      borderRadius: 8,
      background: "rgba(0, 0, 0, 0.6)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      width: "80vw",
      minHeight: "80vh",
      maxWidth: "none",
      p: 3,
    },
    "& .MuiDialogContent-root": {
      p: 3,
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 0,
        width: "100%",
        mx: "auto",
        alignItems: "stretch",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <FieldTypeSelector
          selectedType={String(selectedType)}
          onTypeChange={(type: string) =>
            handleTypeChange(type as keyof typeof FIELD_TYPES)
          }
          onAddToHeader={() => handleAddField("header")}
          onAddToItems={() => handleAddField("items")}
          hasItems={hasItems}
        />
        <SchemaDisplay
          formName={formName}
          onFormNameChange={setFormName}
          hasItems={hasItems}
          onHasItemsChange={setHasItems}
          headerFields={headerFields}
          itemFields={itemFields}
          onDeleteField={deleteField}
        />
      </Box>

      <Box
        sx={{
          mt: 0.5,
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <BuilderActions
          formName={formName}
          hasItems={hasItems}
          headerFields={headerFields}
          itemFields={itemFields}
          isEditing={isEditing}
          onSave={handleSave}
          onDelete={onDelete}
          onCancel={onCancel}
        />
      </Box>

      {/* Dialogs with adjusted glassy styles */}
      <FieldLabelDialog
        open={labelDialogOpen}
        onClose={() => setLabelDialogOpen(false)}
        onConfirm={handleLabelConfirm}
        fieldType={String(selectedType)}
        sx={dialogSx}
      />

      <SelectOptionsDialog
        open={optionsDialogOpen}
        onClose={() => setOptionsDialogOpen(false)}
        onConfirm={handleOptionsConfirm}
        sx={dialogSx}
      />

      <EntityRefDialog
        open={entityDialogOpen}
        onClose={() => setEntityDialogOpen(false)}
        onSelect={handleEntitySelect}
        sx={dialogSx}
      />

      <DisplayFieldDialog
        open={displayDialogOpen}
        onClose={() => setDisplayDialogOpen(false)}
        onConfirm={handleDisplayConfirm}
        targetFormType={pendingTargetId}
        sx={dialogSx}
      />
    </Box>
  );
}
