// FILE: src/components/formBuilder/components/ManagerTypeSelector.tsx
"use client";

import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { FormType, ManagerTypeSelectorProps } from "../types";

interface ExtendedProps extends ManagerTypeSelectorProps {
  formTypes: FormType[];
}

export default function ManagerTypeSelector({
  selectedType,
  onTypeChange,
  formTypes,
}: ExtendedProps) {
  return (
    <Box
      sx={{
        p: 0.5,
        width: "100%",
        mx: "auto",
      }}
    >
      <FormControl fullWidth sx={{ mb: 0.5, width: "100%" }}>
        <InputLabel>نوع فرم</InputLabel>
        <Select
          value={selectedType}
          label="نوع فرم"
          onChange={(e) => onTypeChange(e.target.value as string)}
          fullWidth
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
