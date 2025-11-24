// src/components/dynamicForm/components/fieldInputs/PasswordInput.tsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import type { CommonFieldProps } from "../../types";

const PasswordInput: React.FC<CommonFieldProps> = ({
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
          type="password"
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

export default PasswordInput;
