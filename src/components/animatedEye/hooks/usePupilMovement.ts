import { useCallback, useRef } from "react";
import type { UsePupilMovementProps, EyeCenter } from "../types";
import {
  calculateEyeCenter,
  calculatePupilPosition,
} from "../utils/positionUtils";
export function usePupilMovement({
  size,
  eyeRef,
  isFocused,
}: UsePupilMovementProps) {
  const pupilRef = useRef<HTMLDivElement | null>(null);
  // Helper to get center
  const getEyeCenter = useCallback((): EyeCenter => {
    if (eyeRef.current) {
      const rect = eyeRef.current.getBoundingClientRect();
      return calculateEyeCenter(rect);
    }
    return { x: 0, y: 0 };
  }, [eyeRef]);
  // Move pupil towards a specific target (e.g. Mouse coordinates)
  const updatePupilPosition = useCallback(
    (targetX: number, targetY: number) => {
      if (!pupilRef.current) return;
      const eyeCenter = getEyeCenter();
      const { x: pupilX, y: pupilY } = calculatePupilPosition(
        eyeCenter,
        targetX,
        targetY,
        size
      );
      pupilRef.current.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
      pupilRef.current.style.transition = "transform 0.1s linear"; // Fast follow
    },
    [getEyeCenter, size]
  );
  // Force pupil to specific offset (used for random synchronized movement)
  const setPupilOffset = useCallback(
    (x: number, y: number, transitionDuration: string = "2s") => {
      if (!pupilRef.current) return;
      pupilRef.current.style.transition = `transform ${transitionDuration} ease-in-out`;
      pupilRef.current.style.transform = `translate(${x}px, ${y}px)`;
    },
    []
  );
  // Handle standard mouse movement
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isFocused || !eyeRef.current || !pupilRef.current) return;
      updatePupilPosition(event.clientX, event.clientY);
    },
    [isFocused, updatePupilPosition, eyeRef]
  );
  return {
    pupilRef,
    updatePupilPosition,
    setPupilOffset,
    handleMouseMove,
  };
}
