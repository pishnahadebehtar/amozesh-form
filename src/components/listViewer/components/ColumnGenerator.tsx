import { useMemo } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Field, Schema, TableData, ListType } from "../types";

export function useColumnGenerator(listType: ListType, data: TableData[]) {
  return useMemo(() => {
    if (listType === "formTypes") {
      return [
        { field: "$id", headerName: "شناسه", width: 90 },
        { field: "name", headerName: "نام", width: 150 },
      ] as GridColDef[];
    }

    if (data.length > 0 && data[0].schema) {
      const schema = data[0].schema as Schema;
      const columns: GridColDef[] = [
        { field: "$id", headerName: "شناسه", width: 90 },
      ];

      schema.headerFields.forEach((field: Field) => {
        // CHANGED: Use raw field.label as key (with spaces); no replace
        const key = field.label;
        columns.push({
          field: `h_${key}`, // Prefix to avoid conflicts, but use raw key in valueGetter
          headerName: field.label,
          width: 150,
          valueGetter: (value, row: TableData) => {
            const rowData = row.data;
            if (!rowData?.header) return "";

            // CHANGED: Access with raw key (spaces)
            const val = rowData.header[key];
            if (val == null) return "";

            // Enhanced: Format based on type
            const fieldType = field.type as string;
            switch (fieldType) {
              case "datetime":
              case "date":
                return val instanceof Date
                  ? val.toLocaleDateString("fa-IR")
                  : String(val);
              case "time":
                return val instanceof Date
                  ? val.toLocaleTimeString("fa-IR")
                  : String(val);
              case "boolean":
              case "checkbox":
                return val ? "بله" : "خیر";
              case "file":
              case "image":
                return typeof val === "string"
                  ? val.split("/").pop() || val
                  : String(val); // Filename
              default:
                return typeof val === "boolean"
                  ? val
                    ? "بله"
                    : "خیر"
                  : String(val);
            }
          },
        });
      });

      if (schema.hasItems) {
        columns.push({
          field: "items_count",
          headerName: "تعداد اقلام",
          width: 120,
          valueGetter: (value, row: TableData) => {
            const rowData = row.data;
            return rowData?.items?.length || 0;
          },
        });
      }

      return columns;
    }

    return [
      { field: "$id", headerName: "شناسه", width: 90 },
      {
        field: "data",
        headerName: "داده",
        width: 300,
        valueGetter: (value, row: TableData) => {
          return row.data ? JSON.stringify(row.data, null, 2) : "بدون داده";
        },
      },
    ] as GridColDef[];
  }, [listType, data]);
}
