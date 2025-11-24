import  { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import ListTable from "./components/ListTable";
import { ListSelector } from "./components/ListSelector";
import { useListData } from "./hooks/useListData";
import { useColumnGenerator } from "./components/ColumnGenerator";
import { getFormTypes } from "@/lib/appwrite"; // Changed Import
import type { FormType } from "@/types";
import type { AlertColor } from "@mui/material";

interface ListViewerProps {
  onCancel: () => void;
  showSnackbar: (message: string, severity?: AlertColor) => void;
  onRefetch?: () => void;
}

export default function ListViewer({
  onCancel,
  showSnackbar,
  onRefetch,
}: ListViewerProps) {
  const [listType, setListType] = useState<"formTypes" | "records">(
    "formTypes"
  );
  const [selectedFormType, setSelectedFormType] = useState<string>("");
  const [formTypes, setFormTypes] = useState<FormType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const { data, refetch: listRefetch } = useListData(
    listType,
    selectedFormType
  );
  const columns = useColumnGenerator(listType, data);

  useEffect(() => {
    const fetchTypes = async () => {
      setLoadingTypes(true);
      try {
        // REPLACED: fetch -> getFormTypes
        const types = await getFormTypes();
        setFormTypes(types as FormType[]);
      } catch {
        showSnackbar("خطا در بارگذاری انواع فرم", "error");
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchTypes();
  }, [showSnackbar]);

  const handleRefetch = () => {
    listRefetch();
    onRefetch?.();
  };

  const noDataMessage = !data.length
    ? listType === "formTypes" || selectedFormType
      ? "بدون داده"
      : "برای مشاهده لیست، گزینه‌ها را انتخاب کنید."
    : "";

  return (
    <Box sx={{ p: 2 }}>
      {loadingTypes ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <ListSelector
          listType={listType}
          onListTypeChange={setListType}
          selectedFormType={selectedFormType}
          onFormTypeChange={setSelectedFormType}
          formTypes={formTypes}
        />
      )}

      {data.length > 0 ? (
        <ListTable
          data={data}
          columns={columns}
          type={listType}
          onRefetch={handleRefetch}
          onSuccess={(msg) => showSnackbar(msg, "success")}
          onError={(msg) => showSnackbar(msg, "error")}
        />
      ) : (
        <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
          {noDataMessage}
        </Typography>
      )}

      <Button onClick={onCancel} sx={{ mt: 2 }}>
        بازگشت
      </Button>
    </Box>
  );
}
