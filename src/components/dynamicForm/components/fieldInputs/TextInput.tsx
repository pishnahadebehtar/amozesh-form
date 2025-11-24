import React from "react";
import { TextField } from "@mui/material";
import type { CommonFieldProps } from "../../types";

const TextInput: React.FC<CommonFieldProps> = ({
  register,
  name,
  label,
  required,
  errors,
}) => (
  <TextField
    {...(register && register(name))}
    label={label}
    required={required}
    fullWidth
    error={!!errors?.[name]}
    helperText={errors?.[name]?.message as string}
  />
);

export default TextInput;
