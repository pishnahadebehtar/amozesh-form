import { useState, useEffect, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import FormTypeBuilder from "./FormTypeBuilder";
import ManagerTypeSelector from "./components/ManagerTypeSelector";
import NotificationSnackbar from "./components/NotificationSnackbar";
import { getDefaultSchema } from "./utils/getDefaultSchema";
import { getFormTypes } from "@/lib/appwrite";
import type {
  FormTypeManagerProps,
  FormSchema,
  FormType,
  RawFormType,
  Field,
} from "./types";
import { useFormTypeActions } from "./hooks/useFormTypeActions";

const parseFormType = (raw: RawFormType): FormType | null => {
  if (!raw.$id || !raw.name) return null;
  const defaultSchema = getDefaultSchema();
  if (!raw.schema || typeof raw.schema !== "object") {
    return { $id: raw.$id, name: raw.name, schema: defaultSchema };
  }
  const s = raw.schema as Record<string, unknown>;
  const isValidField = (f: unknown): f is Field => {
    return (
      !!f &&
      typeof f === "object" &&
      typeof (f as Record<string, unknown>).id === "string"
    );
  };
  const headerFields = Array.isArray(s.headerFields)
    ? (s.headerFields as unknown[]).filter(isValidField)
    : [];
  const itemFields = Array.isArray(s.itemFields)
    ? (s.itemFields as unknown[]).filter(isValidField)
    : [];
  const parsedSchema: FormSchema = {
    name: typeof s.name === "string" ? s.name : defaultSchema.name,
    hasItems:
      typeof s.hasItems === "boolean" ? s.hasItems : defaultSchema.hasItems,
    headerFields: headerFields as Field[],
    itemFields: itemFields as Field[],
  };
  return { $id: raw.$id, name: raw.name, schema: parsedSchema };
};

export default function FormTypeManager({
  onNewSave,
  onCancel,
}: FormTypeManagerProps) {
  const [selectedType, setSelectedType] = useState<string>("new");
  const [rawFormTypes, setRawFormTypes] = useState<RawFormType[]>([]);

  const currentSchema = useMemo(() => {
    if (selectedType === "new") return getDefaultSchema();
    const type = rawFormTypes
      .map(parseFormType)
      .filter((t): t is FormType => t !== null)
      .find((t) => t.$id === selectedType);
    return type?.schema || getDefaultSchema();
  }, [selectedType, rawFormTypes]);

  const formTypes = useMemo(
    () =>
      rawFormTypes.map(parseFormType).filter((t): t is FormType => t !== null),
    [rawFormTypes]
  );

  useEffect(() => {
    getFormTypes()
      // Explicitly type the response data
      .then((data: { $id: string; name: string; schema: object }[]) => {
        // Cast to RawFormType[] to satisfy state type
        setRawFormTypes(data as unknown as RawFormType[]);
      })
      .catch((err: unknown) =>
        console.error("Failed to load form types:", err)
      );
  }, []);

  const { handleSave, handleDelete } = useFormTypeActions({
    selectedType,
    setCurrentSchema: () => {},
    setSelectedType,
    onNewSave,
  });

  const handleTypeChange = useCallback((value: string) => {
    setSelectedType(value);
  }, []);

  const handleBuilderSave = useCallback(
    async (schema: FormSchema) => {
      await handleSave(schema);
      if (selectedType === "new") {
        onCancel();
      } else {
        setSelectedType("new");
      }
    },
    [handleSave, selectedType, onCancel]
  );

  const handleBuilderDelete = useCallback(async () => {
    await handleDelete();
    onCancel();
  }, [handleDelete, onCancel]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 0.5,
        width: "100%",
        mx: "auto",
        alignItems: "stretch",
      }}
    >
      <ManagerTypeSelector
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        formTypes={formTypes}
      />
      <FormTypeBuilder
        initialSchema={currentSchema}
        isEditing={selectedType !== "new"}
        onSave={handleBuilderSave}
        onDelete={handleBuilderDelete}
        onCancel={onCancel}
      />
      <NotificationSnackbar />
    </Box>
  );
}
