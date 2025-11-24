// src/components/dynamicForm/components/fieldInputs/ImageInput.tsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import type { CommonFieldProps } from "../../types";
import type { ChangeEvent } from "react";

const ImageInput: React.FC<CommonFieldProps> = ({
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
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.files?.[0]?.name || "")
          }
          label={label}
          type="file"
          required={required}
          fullWidth
          error={!!error || !!errors?.[name]}
          helperText={
            error?.message || (errors?.[name] as { message?: string })?.message
          }
          InputLabelProps={{ shrink: true }}
          inputProps={{ accept: "image/*" }}
        />
      )}
    />
  );
};

export default ImageInput;
