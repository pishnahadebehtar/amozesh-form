// src/components/animatedEye/utils/positionUtils.ts
import type { EyeCenter } from "../types";

export function calculateEyeCenter(eyeRect: DOMRect): EyeCenter {
  return {
    x: eyeRect.left + eyeRect.width / 2,
    y: eyeRect.top + eyeRect.height / 2,
  };
}

export function calculatePupilPosition(
  eyeCenter: EyeCenter,
  targetX: number,
  targetY: number,
  size: number
): { x: number; y: number } {
  const dx = targetX - eyeCenter.x;
  const dy = targetY - eyeCenter.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  const moveDistance = Math.min(distance / 5, size * 0.2);
  const pupilX = Math.cos(angle) * moveDistance;
  const pupilY = Math.sin(angle) * moveDistance;
  return { x: pupilX, y: pupilY };
}

export function generateRandomPupilPosition(size: number): {
  x: number;
  y: number;
} {
  const maxMove = size * 0.08;
  const randomX = (Math.random() - 0.5) * 2 * maxMove;
  const randomY = (Math.random() - 0.5) * 2 * maxMove;
  return { x: randomX, y: randomY };
}
