import React from "react";
import type { FieldInputProps } from "../types";
import TextInput from "./fieldInputs/TextInput";
import NumberInput from "./fieldInputs/NumberInput";
import DateInput from "./fieldInputs/DateInput";
import CheckboxInput from "./fieldInputs/CheckboxInput";
import SelectInput from "./fieldInputs/SelectInput";
import EntityReferenceInput from "./fieldInputs/EntityReferenceInput";
import TextareaInput from "./fieldInputs/TextareaInput";
import EmailInput from "./fieldInputs/EmailInput";
import PasswordInput from "./fieldInputs/PasswordInput";
import UrlInput from "./fieldInputs/UrlInput";
import DatetimeInput from "./fieldInputs/DatetimeInput";
import TimeInput from "./fieldInputs/TimeInput";
import MultiselectInput from "./fieldInputs/MultiselectInput";
import RadioInput from "./fieldInputs/RadioInput";
import FileInput from "./fieldInputs/FileInput";
import ImageInput from "./fieldInputs/ImageInput";
import HiddenInput from "./fieldInputs/HiddenInput";

const FieldInput: React.FC<FieldInputProps> = ({
  field,
  baseName,
  isItem = false,
  entityOptions,
  errors,
  ...commonProps
}) => {
  const fieldKey = field.label;
  const fullName = isItem ? `${baseName}.${fieldKey}` : fieldKey;
  const fieldProps = {
    ...commonProps,
    name: fullName,
    label: field.label,
    required: field.required ?? false,
    errors,
  };

  // FIXED: Use false for loading since it's not per-field; propagate from parent if needed
  const entityLoading = false;

  switch (field.type) {
    case "text":
      return <TextInput {...fieldProps} />;
    case "textarea":
      return <TextareaInput {...fieldProps} />;
    case "number":
    case "integer":
    case "decimal":
      return <NumberInput {...fieldProps} />;
    case "email":
      return <EmailInput {...fieldProps} />;
    case "password":
      return <PasswordInput {...fieldProps} />;
    case "url":
      return <UrlInput {...fieldProps} />;
    case "date":
      return <DateInput {...fieldProps} />;
    case "datetime":
      return <DatetimeInput {...fieldProps} />;
    case "time":
      return <TimeInput {...fieldProps} />;
    case "select":
      return <SelectInput options={field.options || []} {...fieldProps} />;
    case "multiselect":
      return <MultiselectInput options={field.options || []} {...fieldProps} />;
    case "checkbox":
      return <CheckboxInput {...fieldProps} />;
    case "radio":
      return <RadioInput options={field.options || []} {...fieldProps} />;
    case "file":
      return <FileInput {...fieldProps} />;
    case "image":
      return <ImageInput {...fieldProps} />;
    case "hidden":
      return <HiddenInput {...fieldProps} />;
    case "reference":
      return (
        <EntityReferenceInput
          options={entityOptions[field.id] || []}
          loading={entityLoading}
          {...fieldProps}
          field={field}
        />
      );
    default:
      return <div>Unsupported field type: {field.type}</div>;
  }
};

export default FieldInput;
