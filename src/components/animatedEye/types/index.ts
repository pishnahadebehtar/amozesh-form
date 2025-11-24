// src/components/animatedEye/types/index.ts
export interface AnimatedEyeProps {
  size?: number;
}

export interface EyeCenter {
  x: number;
  y: number;
}

export interface BlinkState {
  topTransform: string;
  bottomTransform: string;
  isSquinting: boolean;
}

export interface InputSectionProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  onNewMessage: (msg: { role: "user" | "assistant"; text: string }) => void; // NEW
  isLoading: boolean; // NEW
  setIsLoading: (loading: boolean) => void; // NEW
  // REMOVED: showSnackbar – no frontend saves
}

export interface PupilProps {
  size: number;
  pupilRef: React.RefObject<HTMLDivElement | null>;
}

export interface EyeVisualProps {
  size: number;
  eyeRef: React.RefObject<HTMLDivElement | null>;
  pupilRef: React.RefObject<HTMLDivElement | null>;
  topTransform: string;
  bottomTransform: string;
}

export interface UsePupilMovementProps {
  size: number;
  eyeRef: React.RefObject<HTMLDivElement | null>;
  isFocused: boolean;
}

export interface UseInputFocusProps {
  updatePupilPosition: (x: number, y: number) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isFocused: boolean;
}

export interface UseEyeListenersProps {
  isFocused: boolean;
  eyeRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  doubleBlink: () => void;
  startRandomPupilMovement: () => void;
  stopRandomPupilMovement: () => void;
  handleFocus: () => void;
  handleBlur: () => void;
  handleMouseMove: (event: MouseEvent) => void;
  pupilRef: React.RefObject<HTMLDivElement | null>;
}

import type { RefObject } from "react";
export interface PupilHomeOptions {
  pupilRef: RefObject<HTMLElement | null>;
  startRandomPupilMovement: () => void;
}

export interface BlinkingOptions {
  intervalRef: { current: NodeJS.Timeout | null };
  doubleBlink: () => void;
  isMouseOutsideRef: { current: boolean };
}
export interface MouseOutsideOptions {
  isFocused: boolean;
  pupilRef: RefObject<HTMLElement | null>;
  startRandomPupilMovement: () => void;
  doubleBlink: () => void;
  intervalRef: { current: NodeJS.Timeout | null };
  isMouseOutsideRef: { current: boolean };
}

export interface VisibilityOptions {
  isFocused: boolean;
  pupilRef: RefObject<HTMLElement | null>;
  startRandomPupilMovement: () => void;
  stopRandomPupilMovement: () => void;
  doubleBlink: () => void;
  intervalRef: { current: NodeJS.Timeout | null };
  isMouseOutsideRef: { current: boolean };
}
export interface MouseEnterOptions {
  stopRandomPupilMovement: () => void;
  intervalRef: { current: NodeJS.Timeout | null };
  isMouseOutsideRef: { current: boolean };
}
