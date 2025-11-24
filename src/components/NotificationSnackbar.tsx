import React from "react";
import { Snackbar, Alert } from "@mui/material";
import type { AlertColor } from "@mui/material"; // Fixed import

interface NotificationSnackbarProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
}

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({
  open,
  message,
  severity,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      sx={{
        "& .MuiSnackbarContent-root": {
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.24)",
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          direction: "rtl",
          color: "white",
          fontWeight: 600,
          alignItems: "center",
          px: 2,
          "& .MuiAlert-icon": {
            alignSelf: "center",
            mr: 2,
          },
          "& .MuiAlert-message": {
            ml: 0.5,
            py: 0.75,
            flex: 1,
            fontSize: "1.1rem",
          },
          ...(severity === "success" && { bgcolor: "#2e7d32" }),
          ...(severity === "error" && { bgcolor: "#c62828" }),
          ...(severity === "warning" && { bgcolor: "#ef6c00" }),
          ...(severity === "info" && { bgcolor: "#1565c0" }),
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
