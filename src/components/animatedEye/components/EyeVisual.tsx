import React from "react";
import { Box } from "@mui/material";
import { EyeVisualProps } from "../types";

// REMOVED: Imports of sky/inferno images from here.
// We will receive them as props now.

interface ExtendedEyeVisualProps extends EyeVisualProps {
  isAngry?: boolean;
  isResetting?: boolean;
  showSky?: boolean;
  showInferno?: boolean;
  glintState?: "normal" | "flash" | "growing";
  isLeft?: boolean;
  onClick?: () => void;
  isMobile?: boolean;
  // NEW PROPS for preloaded assets
  skyImageSrc?: string;
  infernoImageSrc?: string;
}

export function EyeVisual({
  size,
  eyeRef,
  pupilRef,
  topTransform,
  bottomTransform,
  isAngry = false,
  isResetting = false,
  showSky = false,
  showInferno = false,
  glintState = "normal",
  isLeft = false,
  onClick,
  isMobile = false,
  skyImageSrc, // <--- Receive here
  infernoImageSrc, // <--- Receive here
}: ExtendedEyeVisualProps) {
  const scleraMargin = size * 0.025;
  const lidTransitionDuration = isResetting ? "3s" : isAngry ? "1s" : "0.3s";

  let topLidTransform = topTransform;

  if (isAngry && !isResetting) {
    if (isMobile) {
      topLidTransform = `${topTransform} scale(1.2)`;
    } else {
      const rotation = isLeft ? "20deg" : "-20deg";
      topLidTransform = `${topTransform} rotate(${rotation}) scale(1.2)`;
    }
  }

  return (
    <Box
      ref={eyeRef}
      onClick={onClick}
      sx={{
        width: size,
        height: size,
        background: "black",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        isolation: "isolate",
        filter: "none",
      }}
    >
      {/* Sclera */}
      <Box
        sx={{
          position: "absolute",
          top: scleraMargin,
          left: scleraMargin,
          width: size - 2 * scleraMargin,
          height: size - 2 * scleraMargin,
          background: "#FFFFFF",
          borderRadius: "50%",
          zIndex: 0,
          overflow: "hidden",
          filter: "brightness(100%) contrast(100%)",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
        }}
      >
        {/* Sky Image - Only render if source is available */}
        {skyImageSrc && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${skyImageSrc})`, // Use Prop
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: showSky ? 1 : 0,
              transition: "opacity 1s ease-in-out",
              zIndex: 1,
              mixBlendMode: "normal",
            }}
          />
        )}
        {/* Inferno Image - Only render if source is available */}
        {infernoImageSrc && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${infernoImageSrc})`, // Use Prop
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: showInferno ? 1 : 0,
              transition: "opacity 1s ease-in-out",
              zIndex: 2,
              mixBlendMode: "normal",
            }}
          />
        )}
      </Box>

      {/* Top lid */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "50%",
          background: "black",
          transform: topLidTransform,
          transformOrigin: "bottom center",
          transition: `transform ${lidTransitionDuration} ease-in-out`,
          zIndex: 3,
          pointerEvents: "none",
        }}
      />
      {/* Pupil */}
      <Pupil
        size={size}
        pupilRef={pupilRef}
        glintState={glintState}
        isAngry={isAngry}
        isResetting={isResetting}
      />
      {/* Bottom lid */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "50%",
          background: "black",
          transform: bottomTransform,
          transition: `transform ${lidTransitionDuration} ease-in-out`,
          zIndex: 3,
          pointerEvents: "none",
        }}
      />
    </Box>
  );
}

function Pupil({
  size,
  pupilRef,
  glintState,
  isAngry,
  isResetting,
}: {
  size: number;
  pupilRef: React.RefObject<HTMLDivElement | null>;
  glintState: "normal" | "flash" | "growing";
  isAngry: boolean;
  isResetting: boolean;
}) {
  let glintColor = "white";
  let scale = 1.2;

  if (isAngry) {
    glintColor = "#FFD700";
  }

  if (glintState === "flash") {
    scale = 1.5;
    glintColor = "#8b0000";
  } else if (glintState === "growing") {
    scale = 2.2;
    glintColor = "#8b0000";
  }

  const isCentered = isAngry;
  const topPos = isCentered ? "50%" : "33%";
  const leftPos = isCentered ? "50%" : "33%";

  const transition = isResetting
    ? "all 3s ease-in-out 2s"
    : glintState === "growing"
    ? "all 12s ease-in"
    : "all 0.5s ease-out";

  return (
    <Box
      ref={pupilRef}
      sx={{
        width: size * 0.4,
        height: size * 0.4,
        background: "black",
        borderRadius: "50%",
        position: "absolute",
        zIndex: 2,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* The Glint */}
      <Box
        sx={{
          width: size * 0.16,
          height: size * 0.16,
          background: glintColor,
          borderRadius: "50%",
          position: "absolute",
          top: topPos,
          left: leftPos,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transition: transition,
          boxShadow:
            glintState !== "normal" && isAngry ? "0 0 10px #8b0000" : "none",
          transformOrigin: "center center",
        }}
      />
    </Box>
  );
}
