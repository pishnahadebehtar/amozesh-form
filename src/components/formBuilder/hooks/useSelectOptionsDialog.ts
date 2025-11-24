// src/components/formbuilder/hooks/useSelectOptionsDialog.ts
import { useState, useEffect, useRef, useCallback } from "react";
import type { SelectOptionsDialogProps } from "../types";

export const useSelectOptionsDialog = ({
  open,
  onClose,
  onConfirm,
  initialOptions = [],
}: SelectOptionsDialogProps) => {
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");
  const prevOpenRef = useRef(false);

  // Reset only when dialog opens (from closed to open), avoiding loops from unstable initialOptions
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      setOptions([...initialOptions]); // Shallow copy to avoid mutation issues
      setNewOption("");
    }
    prevOpenRef.current = open;
  }, [open, initialOptions]); // Safe: initialOptions only used on open transition

  const addOption = useCallback(() => {
    if (newOption.trim()) {
      setOptions((prev) => [...prev, newOption.trim()]);
      setNewOption("");
    }
  }, [newOption]);

  const removeOption = useCallback((index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm(options);
    onClose();
  }, [options, onConfirm, onClose]);

  const handleNewOptionChange = useCallback((value: string) => {
    setNewOption(value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addOption();
      }
    },
    [addOption]
  );

  return {
    options,
    newOption,
    addOption,
    removeOption,
    handleConfirm,
    handleNewOptionChange,
    handleKeyDown,
  };
};
