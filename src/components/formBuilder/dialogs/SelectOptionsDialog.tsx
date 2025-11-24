// src/components/formBuilder/dialogs/SelectOptionsDialog.tsx (Updated to forward sx)
"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  List,
  ListItem,
  IconButton,
  Button,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import type { SelectOptionsDialogProps } from "../types";
import { useSelectOptionsDialog } from "../hooks/useSelectOptionsDialog";

export default function SelectOptionsDialog({
  open,
  onClose,
  onConfirm,
  initialOptions = [],
  sx, // FIXED: Accept sx prop
}: SelectOptionsDialogProps) {
  const {
    options,
    newOption,
    addOption,
    removeOption,
    handleConfirm,
    handleNewOptionChange,
    handleKeyDown,
  } = useSelectOptionsDialog({
    open,
    onClose,
    onConfirm,
    initialOptions,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={sx}>
      {" "}
      {/* FIXED: Forward sx to Dialog */}
      <DialogTitle>مدیریت گزینه‌های انتخاب</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          گزینه‌ها را یکی یکی وارد کنید (مثال: &quot;گزینه ۱&quot;، &quot;گزینه
          ۲&quot;).
        </Typography>
        <TextField
          label="گزینه جدید"
          value={newOption}
          onChange={(e) => handleNewOptionChange(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          variant="outlined"
          onClick={addOption}
          disabled={!newOption.trim()}
          size="small"
          sx={{ mb: 2 }}
        >
          افزودن گزینه
        </Button>
        <List sx={{ maxHeight: 200, overflow: "auto" }}>
          {options.map((option, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => removeOption(index)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <Typography variant="body2">{option}</Typography>
            </ListItem>
          ))}
        </List>
        {options.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            هنوز گزینه‌ای اضافه نشده است.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>لغو</Button>
        <Button onClick={handleConfirm} disabled={options.length === 0}>
          تأیید
        </Button>
      </DialogActions>
    </Dialog>
  );
}
