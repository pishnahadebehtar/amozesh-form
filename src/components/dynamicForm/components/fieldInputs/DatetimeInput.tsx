// src/components/dynamicForm/components/fieldInputs/DatetimeInput.tsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import type { CommonFieldProps } from "../../types";

const DatetimeInput: React.FC<CommonFieldProps> = ({
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
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          required={required}
          fullWidth
          error={!!error || !!errors?.[name]}
          helperText={
            error?.message || (errors?.[name] as { message?: string })?.message
          }
        />
      )}
    />
  );
};

export default DatetimeInput;
