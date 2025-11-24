import { useState } from "react";
import { AlertColor } from "@mui/material";
import type { SnackbarState } from "../types/index";

export function useSnackbar(
  initialState: SnackbarState = {
    open: false,
    message: "",
    severity: "success",
  }
) {
  const [snackbar, setSnackbar] = useState<SnackbarState>(initialState);

  const show = (message: string, severity: AlertColor = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const close = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return { snackbar, show, close };
}
