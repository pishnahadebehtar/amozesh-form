import { useState, useCallback } from "react";
import { Box, Fade } from "@mui/material";
import FormTypeManager from "@/components/formBuilder/FormTypeManager";
import CreateRecord from "@/components/dynamicForm/CreateRecord";
import ListViewer from "@/components/listViewer/ListViewer";
import AnimatedEye from "@/components/animatedEye/AnimatedEye";
import ActionButtons from "@/components/ActionButtons";
import NotificationSnackbar from "@/components/NotificationSnackbar";
import { handleNewFormType } from "@/utils/formHandlers";
import { useSnackbar } from "@/hooks/useSnackbar";
import type { FormSchema } from "@/types";

export default function Home() {
  const [activeSection, setActiveSection] = useState<
    "formTypes" | "createRecord" | "list" | null
  >(null);

  // Angry Mode State
  const [isEyeAngry, setIsEyeAngry] = useState(false);

  const { snackbar, showSnackbar, handleCloseSnackbar } = useSnackbar();
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefetch = useCallback(() => {
    setActiveSection(null);
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleRecordSuccess = useCallback(() => {
    setActiveSection(null);
    triggerRefetch();
  }, [triggerRefetch]);

  const handleFormTypeSave = useCallback(
    async (schema: FormSchema) => {
      await handleNewFormType(schema, showSnackbar, setActiveSection);
      triggerRefetch();
    },
    [showSnackbar, triggerRefetch]
  );

  const toggleSection = useCallback(
    (section: "formTypes" | "createRecord" | "list") => {
      setActiveSection((prev) => (prev === section ? null : section));
    },
    []
  );

  const handleChatRefresh = useCallback(() => {
    triggerRefetch();
  }, [triggerRefetch]);

  return (
    <Box className="main-section">
      <AnimatedEye
        showSnackbar={showSnackbar}
        onChatRefresh={handleChatRefresh}
        onAngryStateChange={setIsEyeAngry}
      />

      {/* Hide Buttons when Angry */}
      <Fade in={!isEyeAngry} timeout={500}>
        <Box>
          <ActionButtons
            onFormTypes={() => toggleSection("formTypes")}
            onCreateRecord={() => toggleSection("createRecord")}
            onList={() => toggleSection("list")}
          />
        </Box>
      </Fade>

      {activeSection === "formTypes" && (
        <FormTypeManager
          key={`form-types-${refreshKey}`}
          onNewSave={handleFormTypeSave}
          onCancel={() => setActiveSection(null)}
        />
      )}

      {activeSection === "createRecord" && (
        <CreateRecord
          key={`create-record-${refreshKey}`}
          onSuccess={handleRecordSuccess}
          onCancel={() => setActiveSection(null)}
          showSnackbar={showSnackbar}
        />
      )}

      {activeSection === "list" && (
        <ListViewer
          key={`list-${refreshKey}`}
          onCancel={() => setActiveSection(null)}
          showSnackbar={showSnackbar}
          onRefetch={triggerRefetch}
        />
      )}

      <NotificationSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
}
