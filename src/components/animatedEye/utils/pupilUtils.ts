// src/components/animatedEye/utils/pupilUtils.ts

import type { PupilHomeOptions } from "../types";

export function centerPupil({
  pupilRef,
  startRandomPupilMovement,
}: PupilHomeOptions): void {
  if (pupilRef.current) {
    pupilRef.current.style.transition = "all 0.5s ease-in-out";
    pupilRef.current.style.transform = "translate(0px, 0px)";
    setTimeout(() => {
      if (pupilRef.current) {
        pupilRef.current.style.transition = "all 0.1s linear";
      }
      startRandomPupilMovement();
    }, 500);
  }
}
