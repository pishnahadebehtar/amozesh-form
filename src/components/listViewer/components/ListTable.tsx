import  { useState } from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import type { ListTableProps, BaseRowData } from "../types";
import { EditAccordion } from "./EditAccordion";
import { useListActions } from "../hooks/useListActions";

// REMOVED: next/dynamic imports. Standard import works fine in Vite SPAs.

interface ExtendedListTableProps<T extends BaseRowData>
  extends ListTableProps<T> {
  onRefetch?: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export default function ListTable<T extends BaseRowData>({
  data,
  columns,
  type,
  onRefetch,
  onSuccess,
  onError,
}: ExtendedListTableProps<T>) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { handleSaveEdit, handleDelete } = useListActions({
    type,
    onRefetch,
    onSuccess,
    onError,
  });

  const handleRowClick = (params: GridRowParams) => {
    setExpandedRow((prev) =>
      prev === params.id ? null : params.id.toString()
    );
  };

  const selectedRow = data.find((r) => r.$id === expandedRow);

  return (
    <Box sx={{ height: "auto", minHeight: 400, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns as GridColDef[]}
        onRowClick={handleRowClick}
        getRowId={(row) => row.$id}
        disableRowSelectionOnClick
        slots={{ noRowsOverlay: () => <span>بدون داده</span> }}
        sx={{ mb: 2 }}
      />
      {expandedRow && selectedRow && (
        <EditAccordion
          row={selectedRow}
          type={type}
          onSave={handleSaveEdit}
          onCancel={() => setExpandedRow(null)}
          onDelete={handleDelete}
        />
      )}
    </Box>
  );
}
