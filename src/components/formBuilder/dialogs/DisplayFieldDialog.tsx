// src/components/formBuilder/dialogs/DisplayFieldDialog.tsx (Updated to forward sx)
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Checkbox,
  Button,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { getFormTypes } from "@/lib/appwrite";
import type { Field, FormSchema, DisplayFieldDialogProps } from "../types";

export default function DisplayFieldDialog({
  open,
  onClose,
  onConfirm,
  targetFormType,
  sx, // FIXED: Accept sx prop
}: DisplayFieldDialogProps) {
  const [selectedDisplayField, setSelectedDisplayField] = useState<string>("");
  const [targetFields, setTargetFields] = useState<Field[]>([]);

  useEffect(() => {
    if (!open || !targetFormType) return;

    getFormTypes()
      .then((types) => {
        const targetType = types.find((t) => t.$id === targetFormType);
        if (!targetType || !targetType.schema) {
          console.warn(
            "Target form not found or schema missing:",
            targetFormType
          );
          return;
        }

        const schema = targetType.schema as FormSchema;
        const headerFields = schema.headerFields || [];

        // Preferred: text, select, number, date
        let displayCandidates = headerFields.filter((f: Field) =>
          ["text", "select", "number", "date"].includes(f.type)
        );

        // Fallback: If none, use first field (even checkbox)
        if (displayCandidates.length === 0 && headerFields.length > 0) {
          displayCandidates = [headerFields[0]];
        }

        setTargetFields(displayCandidates);

        // Auto-select first
        if (displayCandidates.length > 0) {
          setSelectedDisplayField(displayCandidates[0].label);
        }
      })
      .catch((err) => {
        console.error("Failed to load form types:", err);
      });
  }, [open, targetFormType]);

  const handleConfirm = () => {
    if (selectedDisplayField) {
      onConfirm(selectedDisplayField);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={sx}>
      {" "}
      {/* FIXED: Forward sx to Dialog */}
      <DialogTitle>انتخاب فیلد نمایش برای مرجع</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          {targetFields.length > 0 ? (
            <List>
              {targetFields.map((fld) => (
                <ListItem key={fld.id} disablePadding>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedDisplayField === fld.label}
                        onChange={() => setSelectedDisplayField(fld.label)}
                      />
                    }
                    label={fld.label}
                    sx={{ width: "100%" }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="error" sx={{ mt: 2 }}>
              هیچ فیلدی در فرم هدف یافت نشد.
            </Typography>
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>لغو</Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedDisplayField}
          variant="contained"
        >
          تأیید
        </Button>
      </DialogActions>
    </Dialog>
  );
}
