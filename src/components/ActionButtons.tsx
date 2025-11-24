import React from "react";
import { Button, Box } from "@mui/material";

interface ActionButtonsProps {
  onFormTypes: () => void;
  onCreateRecord: () => void;
  onList: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onFormTypes,
  onCreateRecord,
  onList,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" }, // Column on mobile
        justifyContent: "center",
        alignItems: "center",
        mb: 4,
        p: 2,
        gap: 3, // Smaller gap on mobile
        width: "100%",
        maxWidth: "100%", // Force full width matching InputSection
        boxSizing: "border-box",
      }}
    >
      {[
        { label: "مدیریت انواع فرم", onClick: onFormTypes },
        { label: "ایجاد رکورد", onClick: onCreateRecord },
        { label: "مشاهده لیست", onClick: onList },
      ].map((btn, index) => (
        <Button
          key={index}
          variant="contained"
          onClick={btn.onClick}
          sx={{
            borderRadius: 50,
            fontWeight: 700,
            textTransform: "none",
            px: 3,
            py: 1.5,
            width: { xs: "100%", sm: "auto" }, // Full width on mobile
            // Force visibility colors
            backgroundColor: "#FFC400 !important",
            color: "#000000 !important",
            filter: "brightness(100%) contrast(100%)",
            isolation: "isolate",
            "&:hover": {
              backgroundColor: "#E6B800 !important",
            },
          }}
        >
          {btn.label}
        </Button>
      ))}
    </Box>
  );
};

export default ActionButtons;
