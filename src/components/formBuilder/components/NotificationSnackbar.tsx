"use client";

import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { useSnackbar } from "../hooks/useSnackbar";

export default function NotificationSnackbar() {
  const { snackbar, close } = useSnackbar();

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={close}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Alert
        onClose={close}
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}
