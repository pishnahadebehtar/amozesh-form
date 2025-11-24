// src/components/formBuilder/components/FieldChips.tsx (Reduced height for less tall chips)
import React from "react";
import { Box, Chip } from "@mui/material";
import type { Field } from "../types";
import { TYPE_TO_PERSIAN } from "../types";

interface FieldChipsProps {
  field: Field;
  getReferenceName: (targetId: string) => string;
}

export default function FieldChips({
  field,
  getReferenceName,
}: FieldChipsProps) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
      <Chip
        label={TYPE_TO_PERSIAN[field.type]}
        sx={{
          fontSize: { xs: "0.65rem", sm: "0.875rem" },
          height: { xs: 20, sm: 26 }, // FIXED: Reduced height from 24/32 to 20/26 for less tall
          "& .MuiChip-label": { px: { xs: 0.5, sm: 1 } },
          minWidth: "70px",
        }}
        color="primary"
      />
      {field.required && (
        <Chip
          label="الزامی"
          sx={{
            fontSize: { xs: "0.65rem", sm: "0.875rem" },
            height: { xs: 20, sm: 26 }, // FIXED: Reduced height
            "& .MuiChip-label": { px: { xs: 0.5, sm: 1 } },
            minWidth: "70px",
          }}
          color="error"
        />
      )}
      {field.options && field.options.length > 0 && (
        <Chip
          label={`${field.options.length} گزینه`}
          sx={{
            fontSize: { xs: "0.65rem", sm: "0.875rem" },
            height: { xs: 20, sm: 26 }, // FIXED: Reduced height
            "& .MuiChip-label": { px: { xs: 0.5, sm: 1 } },
            minWidth: "70px",
          }}
          color="secondary"
        />
      )}
      {field.targetFormType && (
        <Chip
          label={`مرجع: ${getReferenceName(field.targetFormType)}`}
          sx={{
            fontSize: { xs: "0.65rem", sm: "0.875rem" },
            height: { xs: 20, sm: 26 }, // FIXED: Reduced height
            "& .MuiChip-label": { px: { xs: 0.5, sm: 1 } },
            minWidth: "120px",
          }}
          color="info"
        />
      )}
    </Box>
  );
}
