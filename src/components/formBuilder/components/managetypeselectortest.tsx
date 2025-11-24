// src/components/formBuilder/components/ManagerTypeSelector.tsx (Uniform full widths)
"use client";

import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { FormType, ManagerTypeSelectorProps } from "../types/index";
import { useFormTypes } from "../hooks/useFormTypes";

export default function ManagerTypeSelector({
  selectedType,
  onTypeChange,
}: ManagerTypeSelectorProps) {
  const { formTypes, loading } = useFormTypes();

  return (
    <Box
      sx={{
        p: 0.5,
        width: "100%", // FIXED: Uniform full width
        mx: "auto",
      }}
    >
      <FormControl fullWidth sx={{ mb: 0.5, width: "100%" }}>
        {" "}
        {/* FIXED: Explicit full width */}
        <InputLabel>نوع فرم</InputLabel>
        <Select
          value={selectedType}
          label="نوع فرم"
          onChange={(e) => onTypeChange(e.target.value as string)}
          disabled={loading}
          fullWidth // FIXED: Ensure select is full width
        >
          <MenuItem value="new">نوع فرم جدید</MenuItem>
          {formTypes.map((type: FormType) => (
            <MenuItem key={type.$id} value={type.$id}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
