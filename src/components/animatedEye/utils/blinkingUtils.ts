import type {BlinkingOptions} from "../types"
export function startBlinkingInterval({
  intervalRef,
  doubleBlink,
  isMouseOutsideRef,
}: BlinkingOptions): void {
  if (intervalRef.current) clearInterval(intervalRef.current);
  intervalRef.current = setInterval(() => {
    if (isMouseOutsideRef.current) {
      doubleBlink();
    }
  }, 4000);
  doubleBlink();
}

export function stopBlinkingInterval(intervalRef: {
  current: NodeJS.Timeout | null;
}): void {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
}
