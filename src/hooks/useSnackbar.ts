import { useState, useCallback } from "react";
import type { AlertColor } from "@mui/material"; // Fixed import
import type { SnackbarState } from "../types";

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = useCallback(
    (message: string, severity: AlertColor = "success") => {
      setSnackbar({ open: true, message, severity });
    },
    []
  );

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    snackbar,
    showSnackbar,
    handleCloseSnackbar,
    show: showSnackbar,
    close: handleCloseSnackbar,
  };
};
