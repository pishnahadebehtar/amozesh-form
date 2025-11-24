// features/listViewer/components/ListSelector.tsx
import React from "react";
import { Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { ListType, ListSelectorProps } from "../types";

export function ListSelector({
  listType,
  onListTypeChange,
  selectedFormType,
  onFormTypeChange,
  formTypes,
}: ListSelectorProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <FormControl fullWidth>
        <InputLabel>نوع لیست</InputLabel>
        <Select
          value={listType}
          label="نوع لیست"
          onChange={(e) => onListTypeChange(e.target.value as ListType)}
        >
          <MenuItem value="formTypes">انواع فرم</MenuItem>
          <MenuItem value="records">رکوردها</MenuItem>
        </Select>
      </FormControl>

      {listType === "records" && (
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>نوع فرم</InputLabel>
          <Select
            value={selectedFormType}
            label="نوع فرم"
            onChange={(e) => onFormTypeChange(e.target.value as string)}
          >
            <MenuItem value="">یک نوع انتخاب کنید</MenuItem>
            {formTypes.map((type) => (
              <MenuItem key={type.$id} value={type.$id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
}
