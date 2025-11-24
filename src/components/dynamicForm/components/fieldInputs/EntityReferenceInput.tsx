import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import type { EntityFieldProps, EntityOption, Field } from "../../types";

const EntityReferenceInput: React.FC<
  EntityFieldProps & { field: Field; loading?: boolean }
> = ({ name, label, required, options, errors, field, loading = false }) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedOption =
          options.find((opt: EntityOption) => opt.$id === value) || null;

        const getOptionLabel = (option: EntityOption) => {
          if (field.type !== "reference" || !field.displayField) {
            return option.name || option.$id;
          }
          return option.name || option.$id;
        };

        return (
          <Autocomplete
            options={options as EntityOption[]}
            getOptionLabel={getOptionLabel}
            renderOption={(props, option) => {
              const { key: _, ...safeProps } = props; // FIXED: Use _ for unused
              return (
                <li key={option.$id} {...safeProps}>
                  {getOptionLabel(option)}
                </li>
              );
            }}
            isOptionEqualToValue={(option, value) => option.$id === value.$id}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                required={required}
                error={!!error || !!errors?.[name]}
                helperText={
                  error?.message || (errors?.[name]?.message as string)
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            onChange={(_, selected: EntityOption | null) =>
              onChange(selected?.$id || "")
            }
            value={selectedOption}
            fullWidth
            loading={loading}
          />
        );
      }}
    />
  );
};

export default EntityReferenceInput;
