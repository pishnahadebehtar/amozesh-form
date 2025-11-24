import { useCallback, useState } from "react";

export function useBlink() {
  const [topTransform, setTopTransform] = useState("translateY(-100%)");
  const [bottomTransform, setBottomTransform] = useState("translateY(100%)");

  const closeEyes = useCallback(() => {
    setTopTransform("translateY(0%)");
    setBottomTransform("translateY(0%)");
  }, []);

  const openEyes = useCallback(() => {
    setTopTransform("translateY(-100%)");
    setBottomTransform("translateY(100%)");
  }, []);

  const squintEyes = useCallback(() => {
    setTopTransform("translateY(-35%)");
    setBottomTransform("translateY(85%)");
  }, []);

  const performBlink = useCallback(() => {
    closeEyes();
    // Increased from 150ms to 350ms to allow full closure (animation takes 300ms)
    setTimeout(() => openEyes(), 200);
  }, [closeEyes, openEyes]);

  // Blinks twice (timing adjusted for slower blinks)
  const doubleBlink = useCallback(() => {
    performBlink();
    setTimeout(() => performBlink(), 600);
  }, [performBlink]);

  return {
    topTransform,
    bottomTransform,
    performBlink,
    doubleBlink,
    openEyes,
    squintEyes,
    closeEyes,
  };
}
