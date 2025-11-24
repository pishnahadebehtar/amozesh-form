import { useState, useCallback } from "react";
import type { Field, FIELD_TYPES, UseFieldAdditionProps } from "../types";

export const useFieldAddition = ({
  selectedType,
  setSelectedType,
  addField,
}: UseFieldAdditionProps) => {
  const [labelDialogOpen, setLabelDialogOpen] = useState(false);
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);
  const [entityDialogOpen, setEntityDialogOpen] = useState(false);
  const [displayDialogOpen, setDisplayDialogOpen] = useState(false);

  const [pendingZone, setPendingZone] = useState<"header" | "items" | null>(
    null
  );
  const [pendingType, setPendingType] = useState<
    keyof typeof FIELD_TYPES | null
  >(null);
  const [pendingLabel, setPendingLabel] = useState("");
  const [pendingRequired, setPendingRequired] = useState(false);
  const [pendingTargetId, setPendingTargetId] = useState<string>(""); // Target form $id

  const handleTypeChange = useCallback(
    (value: keyof typeof FIELD_TYPES) => setSelectedType(value),
    [setSelectedType]
  );

  const handleAddField = useCallback(
    (zone: "header" | "items") => {
      setPendingZone(zone);
      setPendingType(selectedType);
      setPendingRequired(false);
      setLabelDialogOpen(true);
    },
    [selectedType]
  );

  const handleLabelConfirm = useCallback(
    (label: string, required: boolean) => {
      if (!pendingZone || !pendingType) return;
      setPendingLabel(label);
      setPendingRequired(required);

      if (pendingType === "reference") {
        setEntityDialogOpen(true);
        return;
      }
      if (["select", "multiselect", "radio"].includes(pendingType)) {
        setOptionsDialogOpen(true);
        return;
      }

      addField(
        pendingZone,
        pendingType as Field["type"],
        label,
        undefined,
        undefined,
        required
      );
      setPendingZone(null);
      setPendingType(null);
      setLabelDialogOpen(false);
    },
    [pendingZone, pendingType, addField]
  );

  const handleOptionsConfirm = useCallback(
    (options: string[]) => {
      if (!pendingLabel || !pendingZone || !pendingType) return;
      addField(
        pendingZone,
        pendingType as Field["type"],
        pendingLabel,
        options,
        undefined,
        pendingRequired
      );
      setOptionsDialogOpen(false);
      setPendingLabel("");
      setPendingZone(null);
      setPendingType(null);
      setPendingRequired(false);
    },
    [pendingLabel, pendingZone, pendingType, pendingRequired, addField]
  );

  const handleEntitySelect = useCallback(
    (targetId: string) => {
      if (!pendingLabel || !pendingZone || !pendingType) return;
      setPendingTargetId(targetId);
      setDisplayDialogOpen(true);
    },
    [pendingLabel, pendingZone, pendingType]
  );

  const handleDisplayConfirm = useCallback(
    (displayField: string) => {
      if (!pendingLabel || !pendingZone || !pendingType || !pendingTargetId)
        return;

      addField(
        pendingZone,
        "reference" as Field["type"],
        pendingLabel,
        undefined,
        pendingTargetId,
        pendingRequired,
        displayField
      );

      setDisplayDialogOpen(false);
      setPendingLabel("");
      setPendingZone(null);
      setPendingType(null);
      setPendingTargetId("");
      setPendingRequired(false);
    },
    [
      pendingLabel,
      pendingZone,
      pendingType,
      pendingTargetId,
      pendingRequired,
      addField,
    ]
  );

  return {
    selectedType,
    handleTypeChange,
    labelDialogOpen,
    setLabelDialogOpen,
    optionsDialogOpen,
    setOptionsDialogOpen,
    entityDialogOpen,
    setEntityDialogOpen,
    displayDialogOpen,
    setDisplayDialogOpen,
    handleAddField,
    handleLabelConfirm,
    handleOptionsConfirm,
    handleEntitySelect,
    handleDisplayConfirm,
    pendingTargetId, // FIXED: Expose it
  };
};
