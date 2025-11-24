// FILE: src/components/dynamicForm/components/fieldInputs/MultiselectInput.tsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Chip,
} from "@mui/material";
import type { SelectFieldProps } from "../../types";

const MultiselectInput: React.FC<SelectFieldProps> = ({
  name,
  label,
  required,
  options,
  errors,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        // FIXED: Ensure value is always an array (handles undefined/null)
        const safeValue = Array.isArray(value) ? value : [];

        return (
          <FormControl
            fullWidth
            required={required}
            error={!!error || !!errors?.[name]}
          >
            <InputLabel>{label}</InputLabel>
            <Select
              multiple
              value={safeValue} // ← Now guaranteed array
              label={label}
              onChange={(e) => {
                // FIXED: Extract unique values as array
                const selected = Array.isArray(e.target.value)
                  ? e.target.value
                  : [];
                onChange(selected);
              }}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {options?.map((opt: string, index: number) => (
                <MenuItem key={`${opt}-${index}`} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
            {(error || errors?.[name]) && (
              <FormHelperText>
                {error?.message ||
                  (errors?.[name] as { message?: string })?.message}
              </FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
};

export default MultiselectInput;
