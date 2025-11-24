// src/components/formBuilder/dialogs/FieldLabelDialog.tsx (Updated to forward sx)
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { FIELD_TYPES, FieldLabelDialogProps } from "../types/index"; // Import for dynamic label

export default function FieldLabelDialog({
  open,
  onClose,
  onConfirm,
  fieldType,
  sx, // FIXED: Accept sx prop
}: FieldLabelDialogProps) {
  const [label, setLabel] = useState("");
  const [required, setRequired] = useState(false);

  // Reset label and required when dialog opens
  useEffect(() => {
    if (open) {
      setLabel("");
      setRequired(false);
    }
  }, [open]);

  const handleConfirm = () => {
    if (label.trim()) {
      onConfirm(label.trim(), required);
      onClose();
    }
  };

  const typeLabel =
    FIELD_TYPES[fieldType as keyof typeof FIELD_TYPES] || fieldType;

  return (
    <Dialog open={open} onClose={onClose} sx={sx}>
      {" "}
      {/* FIXED: Forward sx to Dialog; removed maxWidth for consistency */}
      <DialogTitle>وارد کردن برچسب فیلد</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={`برچسب برای "${typeLabel}" (مثال: نام، سن)`}
          fullWidth
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleConfirm();
            }
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
          }
          label="الزامی"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>لغو</Button>
        <Button onClick={handleConfirm} disabled={!label.trim()}>
          افزودن فیلد
        </Button>
      </DialogActions>
    </Dialog>
  );
}
