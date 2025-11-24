// src/components/dynamicForm/components/fieldInputs/RadioInput.tsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormHelperText,
} from "@mui/material";
import type { SelectFieldProps } from "../../types";

const RadioInput: React.FC<SelectFieldProps> = ({
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
          <FormLabel>{label}</FormLabel>
          <RadioGroup
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          >
            {options?.map((opt: string) => (
              <FormControlLabel
                key={opt}
                value={opt}
                control={<Radio />}
                label={opt}
              />
            ))}
          </RadioGroup>
          {(error || errors?.[name]) && (
            <FormHelperText>
              {error?.message ||
                (errors?.[name] as { message?: string })?.message}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default RadioInput;
