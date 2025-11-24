// src/components/listViewer/components/TableLoading.tsx
import React from "react";
import { Box, CircularProgress } from "@mui/material";

export default function TableLoading() {
  return (
    <Box
      sx={{
        height: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );
}
