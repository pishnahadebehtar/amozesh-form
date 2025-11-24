// src/components/formBuilder/components/FieldsList.tsx (Reduced border radius for less convexity)
import React from "react";
import { List, ListItem, Box, Typography, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import type { FieldsListProps } from "../types";
import { getFieldDisplayLabel } from "../utils/getFieldDisplayLabel";
import FieldChips from "./FieldChips";

export default function FieldsList({
  fields,
  isHeader,
  onDeleteField,
  formTypes,
}: FieldsListProps) {
  const getReferenceName = (targetId: string) => {
    const target = formTypes.find((type) => type.$id === targetId);
    return target ? target.name : "نامشخص";
  };

  return (
    <List sx={{ p: 0, width: "100%" }}>
      {fields.map((field) => (
        <ListItem
          key={field.id}
          sx={{
            py: 2,
            flexDirection: "row",
            alignItems: "flex-start",
            width: "100%",
            borderRadius: 4, // FIXED: Reduced to 4px for less convexity
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
            mb: 1,
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                mb: 1,
                fontWeight: "bold",
                fontSize: "1.1rem",
                flexShrink: 0,
                width: "100%",
              }}
            >
              {getFieldDisplayLabel(field)}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              <FieldChips field={field} getReferenceName={getReferenceName} />
            </Box>
          </Box>
          <IconButton
            onClick={() => onDeleteField(field.id, isHeader)}
            size="small"
            sx={{ ml: 1, mt: 0.5 }}
          >
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
}
