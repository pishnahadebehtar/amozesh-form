// FILE: src/components/dynamicForm/components/ItemsSection.tsx
import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import FieldInput from "./fieldInputs/FieldInput";
import type { ItemsSectionProps, FieldErrors, FormValues } from "../types";

const ItemsSection: React.FC<ItemsSectionProps> = ({
  fields,
  itemFields,
  onAppend,
  onRemove,
  entityOptions,
  register,
  watch,
  setValue,
  control,
  errors,
}) => {
  const hasItemsErrors =
    errors?.items &&
    Array.isArray(errors.items) &&
    errors.items.some((itemError) => {
      if (itemError && typeof itemError === "object" && itemError !== null) {
        return Object.keys(itemError).length > 0;
      }
      return false;
    });

  return (
    <Box sx={{ mb: { xs: 2, md: 4 } }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        اقلام
      </Typography>
      {hasItemsErrors && (
        <Alert severity="error" sx={{ mb: 2 }}>
          لطفاً فیلدهای الزامی اقلام را پر کنید.
        </Alert>
      )}
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table stickyHeader sx={{ minWidth: "max-content" }}>
          <TableHead>
            <TableRow>
              {fields.map((field) => (
                <TableCell key={field.id}>{field.label}</TableCell>
              ))}
              <TableCell>عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itemFields.map((itemField, index) => (
              <TableRow key={itemField.id}>
                {fields.map((field) => {
                  const itemErrors =
                    (errors?.items as FieldErrors<FormValues>[] | undefined)?.[
                      index
                    ] ?? {};
                  return (
                    <TableCell key={field.id}>
                      <FieldInput
                        field={field}
                        baseName={`items.${index}`}
                        isItem
                        entityOptions={entityOptions}
                        register={register}
                        watch={watch}
                        setValue={setValue}
                        control={control}
                        errors={itemErrors}
                        name=""
                        label={field.label}
                        required={field.required ?? false}
                      />
                    </TableCell>
                  );
                })}
                <TableCell>
                  <IconButton onClick={() => onRemove(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        startIcon={<AddIcon />}
        type="button"
        onClick={onAppend}
        fullWidth
        sx={{ mt: 2 }}
      >
        افزودن اقلام
      </Button>
    </Box>
  );
};

export default ItemsSection;
