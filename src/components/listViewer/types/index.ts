// src/components/listViewer/types/index.ts
import { GridColDef } from "@mui/x-data-grid";
import { AlertColor } from "@mui/material";
import type { FieldType, Field, FormSchema, Schema, FormType } from "@/types";

export { FieldType, Field, FormSchema, Schema, FormType };

export interface RecordData {
  header: Record<string, unknown>;
  items: Array<Record<string, unknown>>;
}

export interface TableData {
  $id: string;
  name?: string;
  data?: RecordData | null;
  schema?: FormSchema | Schema;
}

export type ListType = "formTypes" | "records";

export interface ListTableProps<T extends BaseRowData = TableData> {
  data: T[];
  columns: GridColDef[];
  type: ListType;
  onEditSave?: (id: string, data: object) => void;
}

export interface BaseRowData {
  $id: string;
  name?: string;
  data?: object | null;
  schema?: object;
}

export interface EditFormProps<T extends BaseRowData = BaseRowData> {
  row: T;
  type: ListType;
  onSave: (id: string, data: object) => Promise<void>;
  onCancel: () => void;
  onDelete: (id: string) => Promise<void>;
}

export interface ListViewerProps {
  onCancel: () => void;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export interface ListSelectorProps {
  listType: ListType;
  onListTypeChange: (type: ListType) => void;
  selectedFormType: string;
  onFormTypeChange: (id: string) => void;
  formTypes: FormType[];
}
