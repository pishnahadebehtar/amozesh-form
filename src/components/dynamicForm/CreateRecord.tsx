import { useState, useEffect } from "react";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Typography,
  type AlertColor,
} from "@mui/material";
import DynamicForm from "./DynamicForm";
import { getFormTypes, createRecord } from "@/lib/appwrite"; // Changed Import
import type { FormSchema, FormType } from "@/types";

interface CreateRecordProps {
  onCancel: () => void;
  onSuccess?: () => void;
  showSnackbar: (message: string, severity?: AlertColor) => void;
}

export default function CreateRecord({
  onCancel,
  onSuccess,
  showSnackbar,
}: CreateRecordProps) {
  const [formTypes, setFormTypes] = useState<FormType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedSchema, setSelectedSchema] = useState<FormSchema>({
    name: "",
    hasItems: false,
    headerFields: [],
    itemFields: [],
  });

  useEffect(() => {
    const fetchTypes = async () => {
      setLoading(true);
      try {
        // REPLACED: fetch("/api/form-types") -> getFormTypes()
        const types = await getFormTypes();
        setFormTypes(types as FormType[]);
      } catch {
        showSnackbar("خطا در بارگذاری انواع فرم", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, [showSnackbar]);

  useEffect(() => {
    if (selectedType) {
      const type = formTypes.find((t) => t.$id === selectedType);
      setSelectedSchema(
        type?.schema ?? {
          name: "",
          hasItems: false,
          headerFields: [],
          itemFields: [],
        }
      );
    } else {
      setSelectedSchema({
        name: "",
        hasItems: false,
        headerFields: [],
        itemFields: [],
      });
    }
  }, [selectedType, formTypes]);

  const handleSubmit = async (data: object) => {
    if (!selectedType) return;

    // REPLACED: fetch("/api/records") -> createRecord()
    const result = await createRecord(selectedType, data);

    if (result.success) {
      showSnackbar("رکورد با موفقیت ایجاد شد!", "success");
      onSuccess?.();
      setSelectedType("");
    } else {
      showSnackbar("خطا در ایجاد رکورد", "error");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: "100%" }}>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>انتخاب نوع فرم</InputLabel>
        <Select
          value={selectedType}
          label="انتخاب نوع فرم"
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <MenuItem value="">یک نوع انتخاب کنید</MenuItem>
          {formTypes.map((type) => (
            <MenuItem key={type.$id} value={type.$id}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedType ? (
        <DynamicForm
          schema={selectedSchema}
          initialData={{ header: {}, items: [] }}
          onSubmit={handleSubmit}
          onCancel={onCancel}
        />
      ) : (
        <Typography align="center" color="text.secondary">
          برای ایجاد رکورد، یک نوع فرم انتخاب کنید.
        </Typography>
      )}
    </Box>
  );
}
