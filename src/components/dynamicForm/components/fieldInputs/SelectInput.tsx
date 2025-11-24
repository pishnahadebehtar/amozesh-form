import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import type { SelectFieldProps } from "../../types";

const SelectInput: React.FC<SelectFieldProps> = ({
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
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl
          fullWidth
          required={required}
          error={!!error || !!errors?.[name]}
        >
          <InputLabel>{label}</InputLabel>
          <Select value={value ?? ""} label={label} onChange={onChange}>
            {options.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
          {(error || errors?.[name]) && (
            <FormHelperText>
              {error?.message || (errors?.[name]?.message as string)}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default SelectInput;
