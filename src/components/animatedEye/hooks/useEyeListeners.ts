// Updated src/components/animatedEye/hooks/useEyeListeners.ts
import { useRef, useCallback, useEffect } from "react";
import type { UseEyeListenersProps } from "../types";
import { handleMouseLeave, handleMouseEnter } from "../utils/mouseUtils";
import { handleVisibilityChange } from "../utils/visibilityUtils";

export function useEyeListeners({
  isFocused,
  inputRef,
  doubleBlink,
  startRandomPupilMovement,
  stopRandomPupilMovement,
  handleFocus,
  handleBlur,
  handleMouseMove,
  pupilRef,
}: UseEyeListenersProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMouseOutsideRef = useRef(false);

  const handleVisibilityChangeCallback = useCallback(() => {
    handleVisibilityChange({
      isFocused,
      pupilRef,
      startRandomPupilMovement,
      stopRandomPupilMovement,
      doubleBlink,
      intervalRef,
      isMouseOutsideRef,
    });
  }, [
    isFocused,
    doubleBlink,
    startRandomPupilMovement,
    stopRandomPupilMovement,
    pupilRef,
    intervalRef, // Note: refs don't cause re-renders, but included for completeness
    isMouseOutsideRef,
  ]);

  const handleMouseLeaveDocumentCallback = useCallback(() => {
    handleMouseLeave({
      isFocused,
      pupilRef,
      startRandomPupilMovement,
      doubleBlink,
      intervalRef,
      isMouseOutsideRef,
    });
  }, [
    isFocused,
    doubleBlink,
    startRandomPupilMovement,
    pupilRef,
    intervalRef,
    isMouseOutsideRef,
  ]);

  const handleMouseEnterDocumentCallback = useCallback(() => {
    handleMouseEnter({
      stopRandomPupilMovement,
      intervalRef,
      isMouseOutsideRef,
    });
  }, [stopRandomPupilMovement, intervalRef, isMouseOutsideRef]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeaveDocumentCallback);
    document.addEventListener("mouseenter", handleMouseEnterDocumentCallback);
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChangeCallback
    );

    const input = inputRef.current;
    if (input) {
      input.addEventListener("focus", handleFocus);
      input.addEventListener("blur", handleBlur);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener(
        "mouseleave",
        handleMouseLeaveDocumentCallback
      );
      document.removeEventListener(
        "mouseenter",
        handleMouseEnterDocumentCallback
      );
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChangeCallback
      );

      if (input) {
        input.removeEventListener("focus", handleFocus);
        input.removeEventListener("blur", handleBlur);
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      stopRandomPupilMovement();
    };
  }, [
    handleMouseMove,
    handleMouseLeaveDocumentCallback,
    handleMouseEnterDocumentCallback,
    handleVisibilityChangeCallback,
    inputRef,
    handleFocus,
    handleBlur,
    stopRandomPupilMovement,
  ]);
}
