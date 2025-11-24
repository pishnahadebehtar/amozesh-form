// src/components/formBuilder/dialogs/EntityRefDialog.tsx (Updated to forward sx)
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { getFormTypes } from "@/lib/appwrite";
import type { EntityRefDialogProps } from "../types/index";

export default function EntityRefDialog({
  open,
  onClose,
  onSelect,
  sx, // FIXED: Accept sx prop
}: EntityRefDialogProps) {
  const [formTypes, setFormTypes] = useState<{ $id: string; name: string }[]>(
    []
  );
  const [selected, setSelected] = useState("");

  // Reset selected state and fetch form types when dialog opens
  useEffect(() => {
    if (open) {
      setSelected(""); // Clear previous selection
      getFormTypes().then((types) => {
        setFormTypes(types);
      });
    }
  }, [open]);

  const handleSelect = () => {
    if (selected) {
      onSelect(selected);
      onClose(); // Close after selection
    }
  };

  return (
    <Dialog open={open} onClose={onClose} sx={sx}>
      {" "}
      {/* FIXED: Forward sx to Dialog; removed maxWidth for consistency */}
      <DialogTitle>انتخاب نوع فرم هدف برای مرجع</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>نوع هدف</InputLabel>
          <Select
            value={selected}
            label="نوع هدف"
            onChange={(e) => setSelected(e.target.value as string)}
          >
            {formTypes.map((type) => (
              <MenuItem key={type.$id} value={type.$id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>لغو</Button>
        <Button onClick={handleSelect} disabled={!selected}>
          انتخاب
        </Button>
      </DialogActions>
    </Dialog>
  );
}
