import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import type { CommonFieldProps } from "../../types";

const DateInput: React.FC<CommonFieldProps> = ({
  name,
  label,
  required,
  errors,
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          value={value ?? ""}
          onChange={onChange}
          label={label}
          type="date"
          InputLabelProps={{ shrink: true }}
          required={required}
          fullWidth
          error={!!error || !!errors?.[name]} // Fallback to prop if needed
          helperText={error?.message || (errors?.[name]?.message as string)}
        />
      )}
    />
  );
};

export default DateInput;
