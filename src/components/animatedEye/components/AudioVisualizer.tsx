import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isActive: boolean;
}

interface WindowWithWebkit extends Window {
  webkitAudioContext: typeof AudioContext;
}
// Helper for rounded rectangles
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  if (height < radius * 2) radius = height / 2;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
}

export default function AudioVisualizer({
  audioElement,
  isActive,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!isActive || !audioElement || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Init Audio Context
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as WindowWithWebkit).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    const audioCtx = audioCtxRef.current;

    // 2. Connect Source
    // 2. Connect Source with Gain (Volume Boost)
    if (!sourceRef.current) {
      try {
        analyserRef.current = audioCtx.createAnalyser();

        // Create Gain Node (Amplifier)
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 10; // <--- 1.5x Volume (150%)

        sourceRef.current = audioCtx.createMediaElementSource(audioElement);

        // Connect Chain: Source -> Gain -> Analyser -> Speakers
        sourceRef.current.connect(gainNode);
        gainNode.connect(analyserRef.current);
        analyserRef.current.connect(audioCtx.destination);
      } catch (err) {
        console.error("Visualizer connection error:", err);
        return;
      }
    }

    if (!analyserRef.current) return;

    // Use fewer bins for wider, cleaner bars
    analyserRef.current.fftSize = 64;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isActive) return;

      animationRef.current = requestAnimationFrame(draw);

      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
      }

      // Clear Canvas (Plain Black)
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Bar Width
      const barWidth = 8;
      const gap = 4;

      // Draw mirrored from center
      ctx.fillStyle = "white";

      for (let i = 0; i < bufferLength; i++) {
        // Scale height
        const value = dataArray[i];
        const barHeight = (value / 255) * canvas.height * 0.8; // Max 80% height

        // Don't draw if too small (noise floor)
        if (barHeight < 2) continue;

        // Calculate positions (Mirrored)
        const xRight = centerX + i * (barWidth + gap);
        const xLeft = centerX - (i + 1) * (barWidth + gap);
        const y = centerY - barHeight / 2;

        // Draw Right Bar (Round Tips)
        drawRoundedRect(ctx, xRight, y, barWidth, barHeight, barWidth / 2);

        // Draw Left Bar (Round Tips)
        drawRoundedRect(ctx, xLeft, y, barWidth, barHeight, barWidth / 2);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, audioElement]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        height: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "black", // Plain black
        borderRadius: 4,
        overflow: "hidden",
        // No shadow, no border
      }}
    >
      <canvas
        ref={canvasRef}
        width={600}
        height={100}
        style={{ width: "100%", height: "100%" }}
      />
    </Box>
  );
}
