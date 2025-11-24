"use client";

import React from "react";
import { Box, Button, Typography, Alert, Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FormProvider } from "react-hook-form";
import { useDynamicForm } from "./hooks/useDynamicForm";
import { useEntityOptions } from "./hooks/useEntityOptions";
import { processFormData } from "./utils/processFormData";
import { getResetFormData } from "./utils/getResetFormData";
import HeaderSection from "./components/HeaderSection";
import ItemsSection from "./components/ItemsSection";
import type { DynamicFormProps, FormData } from "./types";

export default function DynamicForm({
  schema,
  initialData = { header: {}, items: [] },
  onSubmit,
  onCancel,
}: DynamicFormProps) {
  const { form, itemFields, append, remove, headerDefaults } = useDynamicForm(
    schema,
    initialData
  );

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = form;

  const { entityOptions: headerEntityOptions } = useEntityOptions(
    schema.headerFields
  );
  const { entityOptions: itemEntityOptions } = useEntityOptions(
    schema.itemFields
  );

  const handleSubmit = (data: FormData) => {
    try {
      console.log("Form data before save:", data);
      const { header, items } = processFormData(data);
      onSubmit({ header, items });
      form.reset(getResetFormData(headerDefaults));
    } catch (err) {
      console.error("Form processing error:", err);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          p: { xs: 1, sm: 2, md: 3 },
          maxWidth: "100%",
          width: "100%",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          فرم پویا
        </Typography>
        {hasErrors && (
          <Alert severity="error" sx={{ mb: 2 }}>
            لطفاً فیلدهای الزامی را پر کنید. خطاها در زیر نمایش داده شده‌اند.
          </Alert>
        )}
        <FormProvider {...form}>
          <form onSubmit={rhfHandleSubmit(handleSubmit)}>
            <HeaderSection
              fields={schema.headerFields}
              baseName=""
              entityOptions={headerEntityOptions}
              register={register}
              watch={watch}
              setValue={setValue}
              control={control}
              errors={errors}
            />
            {schema.hasItems && (
              <ItemsSection
                fields={schema.itemFields}
                itemFields={itemFields}
                onAppend={append}
                onRemove={remove}
                entityOptions={itemEntityOptions}
                register={register}
                watch={watch}
                setValue={setValue}
                control={control}
                errors={errors}
              />
            )}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 3, justifyContent: "flex-end" }}
            >
              <Button type="button" onClick={onCancel}>
                لغو
              </Button>
              <Button variant="contained" type="submit">
                ارسال
              </Button>
            </Stack>
          </form>
        </FormProvider>
      </Box>
    </LocalizationProvider>
  );
}
