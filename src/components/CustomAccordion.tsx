"use client";

import React, { useState } from "react";
import { Box, Typography, IconButton, Collapse } from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

interface CustomAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  sx?: object;
}

export default function CustomAccordion({
  title,
  children,
  defaultExpanded = true,
  sx,
}: CustomAccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 4,
        overflow: "hidden",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        ...sx,
      }}
    >
      {/* Summary */}
      <Box
        onClick={handleToggle}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          cursor: "pointer",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            flexGrow: 1,
          }}
        >
          {title}
        </Typography>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Details - Collapsible */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2 }}>{children}</Box>
      </Collapse>
    </Box>
  );
}
