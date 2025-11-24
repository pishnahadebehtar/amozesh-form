import React from "react";
import { Box, Typography, Alert } from "@mui/material";
import FieldInput from "./fieldInputs/FieldInput";
import type { HeaderSectionProps } from "../types"; // FIXED: Removed unused imports

const HeaderSection: React.FC<HeaderSectionProps> = ({
  fields,
  baseName = "",
  entityOptions,
  register,
  watch,
  setValue,
  control,
  errors,
}) => {
  // FIXED: Updated logic to handle FieldErrors<FormValues> and avoid 'any'
  const hasHeaderErrors =
    errors &&
    Object.entries(errors)
      .filter(
        ([key]) => key !== "items" && key !== "" && typeof key === "string"
      ) // Skip items & empty; ensure string key
      .some(([, err]) => {
        if (err && typeof err === "object" && err !== null) {
          return Object.keys(err).length > 0;
        }
        return !!err;
      });

  return (
    <Box sx={{ mb: { xs: 2, md: 4 } }}>
      {" "}
      {/* Responsive margin */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        سربرگ
      </Typography>
      {hasHeaderErrors && (
        <Alert severity="error" sx={{ mb: 2 }}>
          لطفاً فیلدهای الزامی سربرگ را پر کنید.
        </Alert>
      )}
      {fields.map((field) => (
        <Box key={field.id} sx={{ mb: 2 }}>
          <FieldInput
            field={field}
            baseName={baseName}
            entityOptions={entityOptions}
            register={register}
            watch={watch}
            setValue={setValue}
            control={control}
            errors={errors}
            name="" // Overridden in FieldInput
            label={field.label}
            required={field.required ?? false}
          />
        </Box>
      ))}
    </Box>
  );
};

export default HeaderSection;
