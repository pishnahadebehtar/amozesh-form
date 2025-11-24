// src/components/animatedEye/utils/intervalUtils.ts
export interface RandomMoveOptions {
  randomMoveIntervalRef: { current: NodeJS.Timeout | null };
  pupilRef: { current: HTMLElement | null };
  generateRandomPupilPosition: (size: number) => { x: number; y: number };
  size: number;
  isFocused: boolean;
}

export function startRandomPupilMovement({
  randomMoveIntervalRef,
  pupilRef,
  generateRandomPupilPosition,
  size,
  isFocused,
}: RandomMoveOptions): void {
  if (randomMoveIntervalRef.current) {
    clearInterval(randomMoveIntervalRef.current);
  }

  randomMoveIntervalRef.current = setInterval(() => {
    if (!pupilRef.current || isFocused) return;

    const randomPos = generateRandomPupilPosition(size);
    pupilRef.current.style.transition = "all 2s ease-in-out";
    pupilRef.current.style.transform = `translate(${randomPos.x}px, ${randomPos.y}px)`;
  }, 2000);
}

export function stopRandomPupilMovement({
  randomMoveIntervalRef,
  pupilRef,
}: Pick<RandomMoveOptions, "randomMoveIntervalRef" | "pupilRef">): void {
  if (randomMoveIntervalRef.current) {
    clearInterval(randomMoveIntervalRef.current);
    randomMoveIntervalRef.current = null;
  }
  if (pupilRef.current) {
    pupilRef.current.style.transition = "all 0.1s linear";
  }
}
