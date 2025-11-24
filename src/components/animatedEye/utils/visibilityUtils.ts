// src/components/animatedEye/utils/visibilityUtils.ts

import type { VisibilityOptions } from "../types";
import { centerPupil } from "./pupilUtils";
import { startBlinkingInterval, stopBlinkingInterval } from "./blinkingUtils";

export function handleVisibilityChange({
  isFocused,
  pupilRef,
  startRandomPupilMovement,
  stopRandomPupilMovement,
  doubleBlink,
  intervalRef,
  isMouseOutsideRef,
}: VisibilityOptions): void {
  if (document.visibilityState === "hidden" && !isFocused) {
    isMouseOutsideRef.current = true;
    centerPupil({ pupilRef, startRandomPupilMovement });
    startBlinkingInterval({ intervalRef, doubleBlink, isMouseOutsideRef });
  } else if (document.visibilityState === "visible") {
    isMouseOutsideRef.current = false;
    stopRandomPupilMovement();
    stopBlinkingInterval(intervalRef);
  }
}
