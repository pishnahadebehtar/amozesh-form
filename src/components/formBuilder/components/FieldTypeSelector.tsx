// src/components/formBuilder/components/FieldTypeSelector.tsx (Increased top/bottom spacing for buttons)
import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { FIELD_TYPES, FieldTypeSelectorProps } from "../types/index";

export default function FieldTypeSelector({
  selectedType,
  onTypeChange,
  onAddToHeader,
  onAddToItems,
  hasItems,
}: FieldTypeSelectorProps) {
  return (
    <Box
      sx={{
        width: "100%",
        p: 0.5,
        mx: "auto",
      }}
    >
      <Typography variant="h6" sx={{ textAlign: "center", width: "100%" }}>
        افزودن فیلد
      </Typography>
      <Divider sx={{ my: 0.5, width: "100%" }} />
      <FormControl fullWidth sx={{ mb: 2, width: "100%" }}>
        {" "}
        {/* FIXED: Increased mb from 1 to 2 for more top space before buttons */}
        <InputLabel>نوع فیلد</InputLabel>
        <Select
          value={selectedType}
          label="نوع فیلد"
          onChange={(e) =>
            onTypeChange(e.target.value as keyof typeof FIELD_TYPES)
          }
          fullWidth
        >
          {Object.entries(FIELD_TYPES).map(([key, label]) => (
            <MenuItem key={key} value={key}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          width: "100%",
          mb: 2,
        }}
      >
        {" "}
        {/* FIXED: Added mb: 2 for more bottom space after buttons */}
        <Button
          variant="outlined"
          onClick={onAddToHeader}
          fullWidth
          sx={{ width: "100%" }}
        >
          افزودن به سربرگ
        </Button>
        <Button
          variant="outlined"
          onClick={onAddToItems}
          disabled={!hasItems}
          fullWidth
          sx={{ width: "100%" }}
        >
          افزودن به اقلام
        </Button>
      </Box>
    </Box>
  );
}
