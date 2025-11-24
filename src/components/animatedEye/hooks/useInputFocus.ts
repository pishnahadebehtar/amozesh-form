// FILE: src\components\animatedEye\hooks\useInputFocus.ts
// Reverted: Remove debounce entirely (immediate updates, no delay)
import { useCallback, useState } from "react";
import type { UseInputFocusProps } from "../types";
import { calculateCursorPosition } from "../utils/cursorUtils";

export function useInputFocus({
  updatePupilPosition,
  inputRef,
  canvasRef,
  isFocused,
}: UseInputFocusProps) {
  const [inputValue, setInputValue] = useState("");

  const updatePupilToInput = useCallback(() => {
    if (!isFocused || !inputRef.current || !canvasRef.current) return;
    const input = inputRef.current;
    const cursorPos = input.selectionStart || 0;
    if (cursorPos < 0) return;

    const canvas = canvasRef.current;
    const pos = calculateCursorPosition(input, cursorPos, canvas);
    if (pos) {
      updatePupilPosition(pos.x, pos.y);
    }
  }, [isFocused, updatePupilPosition, inputRef, canvasRef]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      // REVERTED: Immediate call (no debounce/delay)
      updatePupilToInput();
    },
    [updatePupilToInput]
  );

  return {
    inputValue,
    handleInput,
    updatePupilToInput,
  };
}
