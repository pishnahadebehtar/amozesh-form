import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import type { CommonFieldProps } from "../../types";

const CheckboxInput: React.FC<CommonFieldProps> = ({ name, label }) => {
  // Removed unused errors
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!value}
                onChange={(e) => onChange(e.target.checked)}
              />
            }
            label={label}
          />
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </>
      )}
    />
  );
};

export default CheckboxInput;
