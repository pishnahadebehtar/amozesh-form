// src/components/animatedEye/utils/mouseUtils.ts

import type { MouseOutsideOptions, MouseEnterOptions } from "../types";
import { centerPupil } from "./pupilUtils";
import { startBlinkingInterval, stopBlinkingInterval } from "./blinkingUtils";

export function handleMouseLeave({
  isFocused,
  pupilRef,
  startRandomPupilMovement,
  doubleBlink,
  intervalRef,
  isMouseOutsideRef,
}: MouseOutsideOptions): void {
  if (isFocused) return;
  isMouseOutsideRef.current = true;
  centerPupil({ pupilRef, startRandomPupilMovement });
  startBlinkingInterval({ intervalRef, doubleBlink, isMouseOutsideRef });
}

export function handleMouseEnter({
  stopRandomPupilMovement,
  intervalRef,
  isMouseOutsideRef,
}: MouseEnterOptions): void {
  isMouseOutsideRef.current = false;
  stopRandomPupilMovement();
  stopBlinkingInterval(intervalRef);
}
