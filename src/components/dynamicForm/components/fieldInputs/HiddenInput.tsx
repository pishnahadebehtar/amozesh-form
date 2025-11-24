// src/components/dynamicForm/components/fieldInputs/HiddenInput.tsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { CommonFieldProps } from "../../types";

const HiddenInput: React.FC<CommonFieldProps> = ({ name }) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <input type="hidden" {...field} />} // Invisible
    />
  );
};

export default HiddenInput;
