import React from "react";
// import { buildFieldKey } from "../../utils/formUtils"; // REMOVED: No longer needed (raw labels now)
import type { FieldInputProps } from "../../types";
import TextInput from "./TextInput";
import NumberInput from "./NumberInput";
import DateInput from "./DateInput";
import CheckboxInput from "./CheckboxInput";
import SelectInput from "./SelectInput";
import EntityReferenceInput from "./EntityReferenceInput"; // Now for 'reference'
import TextareaInput from "./TextareaInput";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import UrlInput from "./UrlInput";
import DatetimeInput from "./DatetimeInput";
import TimeInput from "./TimeInput";
import MultiselectInput from "./MultiselectInput";
import RadioInput from "./RadioInput";
import FileInput from "./FileInput";
import ImageInput from "./ImageInput";
import HiddenInput from "./HiddenInput";

const FieldInput: React.FC<FieldInputProps> = ({
  field,
  baseName,
  isItem = false,
  entityOptions,
  errors,
  ...commonProps
}) => {
  // CHANGED: Use raw field.label as key (with spaces) instead of buildFieldKey
  const fieldKey = field.label; // Raw label with spaces
  const fullName = isItem ? `${baseName}.${fieldKey}` : fieldKey;
  const fieldProps = {
    ...commonProps,
    name: fullName,
    label: field.label,
    required: field.required ?? false,
    errors,
  };

  switch (field.type) {
    case "text":
      return <TextInput {...fieldProps} />;
    case "textarea":
      return <TextareaInput {...fieldProps} />;
    case "number":
    case "integer":
    case "decimal": // Alias to number
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
    case "reference": // Aligned from 'entity_reference'
      return (
        <EntityReferenceInput
          options={entityOptions[field.id] || []}
          {...fieldProps}
          field={field}
        />
      );
    default:
      return <div>Unsupported field type: {field.type}</div>;
  }
};

export default FieldInput;
