// src/components/animatedEye/utils/cursorUtils.ts
export function calculateCursorPosition(
  input: HTMLInputElement,
  cursorPos: number,
  canvas: HTMLCanvasElement
): { x: number; y: number } | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const style = window.getComputedStyle(input);
  ctx.font = style.font;
  ctx.direction = "rtl";

  const textBefore = input.value.substring(0, cursorPos);
  const textWidth = ctx.measureText(textBefore).width;

  const inputRect = input.getBoundingClientRect();
  const paddingRight = parseFloat(style.paddingRight) || 0;
  const cursorX = inputRect.right - paddingRight - textWidth;
  const cursorY = inputRect.top + inputRect.height / 2;

  return { x: cursorX, y: cursorY };
}
