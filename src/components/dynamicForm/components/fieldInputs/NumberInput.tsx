import React from "react";
import { TextField } from "@mui/material";
import type { CommonFieldProps } from "../../types";

const NumberInput: React.FC<CommonFieldProps> = ({
  register,
  name,
  label,
  required,
  errors,
}) => (
  <TextField
    {...(register && register(name, { valueAsNumber: true }))}
    type="number"
    label={label}
    required={required}
    fullWidth
    error={!!errors?.[name]}
    helperText={errors?.[name]?.message as string}
  />
);

export default NumberInput;
