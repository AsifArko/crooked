"use client";

import { useEffect, useRef } from "react";

interface SupportAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SupportAnimation({
  className = "",
  size = "md",
}: SupportAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const sizeMap = {
      sm: 128,
      md: 256,
      lg: 512,
    };
    const canvasSize = sizeMap[size];
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Animation variables
    let animationId: number;
    let time = 0;

    // Colors using off white and grey scheme
    const primaryColor = "oklch(0.3 0 0)"; // Dark grey
    const secondaryColor = "oklch(0.95 0.01 0)"; // Off white
    const accentColor = "oklch(0.6 0.02 0)"; // Medium grey
    const mutedColor = "oklch(0.7 0.01 0)"; // Light grey

    // Helper function to convert oklch to rgba
    const oklchToRgba = (oklch: string, alpha = 1) => {
      // For simplicity, using a mapping approach
      const colorMap: { [key: string]: string } = {
        "oklch(0.3 0 0)": "rgba(77, 77, 77, " + alpha + ")",
        "oklch(0.95 0.01 0)": "rgba(245, 245, 245, " + alpha + ")",
        "oklch(0.6 0.02 0)": "rgba(153, 153, 153, " + alpha + ")",
        "oklch(0.7 0.01 0)": "rgba(179, 179, 179, " + alpha + ")",
      };
      return colorMap[oklch] || "rgba(0, 0, 0, " + alpha + ")";
    };

    // Draw floating support elements
    const drawFloatingElements = () => {
      const elements = [
        {
          x: canvasSize * 0.3,
          y: canvasSize * 0.3 + Math.sin(time * 0.02) * 8,
          size: canvasSize * 0.08,
          type: "circle",
          color: primaryColor,
        },
        {
          x: canvasSize * 0.7,
          y: canvasSize * 0.4 + Math.cos(time * 0.025) * 6,
          size: canvasSize * 0.06,
          type: "square",
          color: accentColor,
        },
        {
          x: canvasSize * 0.5,
          y: canvasSize * 0.7 + Math.sin(time * 0.03) * 10,
          size: canvasSize * 0.05,
          type: "triangle",
          color: secondaryColor,
        },
      ];

      elements.forEach((element, index) => {
        ctx.save();
        ctx.globalAlpha = 0.8 + Math.sin(time * 0.05 + index) * 0.2;

        switch (element.type) {
          case "circle":
            ctx.fillStyle = oklchToRgba(element.color);
            ctx.beginPath();
            ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
            ctx.fill();
            break;

          case "square":
            ctx.fillStyle = oklchToRgba(element.color);
            ctx.fillRect(
              element.x - element.size,
              element.y - element.size,
              element.size * 2,
              element.size * 2
            );
            break;

          case "triangle":
            ctx.fillStyle = oklchToRgba(element.color);
            ctx.beginPath();
            ctx.moveTo(element.x, element.y - element.size);
            ctx.lineTo(element.x - element.size, element.y + element.size);
            ctx.lineTo(element.x + element.size, element.y + element.size);
            ctx.closePath();
            ctx.fill();
            break;
        }

        ctx.restore();
      });
    };

    // Draw connecting lines
    const drawConnections = () => {
      ctx.strokeStyle = oklchToRgba(mutedColor, 0.3);
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.4;

      const points = [
        { x: canvasSize * 0.3, y: canvasSize * 0.3 },
        { x: canvasSize * 0.7, y: canvasSize * 0.4 },
        { x: canvasSize * 0.5, y: canvasSize * 0.7 },
      ];

      // Draw connections between points
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const distance = Math.sqrt(
            Math.pow(points[i].x - points[j].x, 2) +
              Math.pow(points[i].y - points[j].y, 2)
          );
          if (distance < canvasSize * 0.6) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Draw pulsing center
    const drawPulsingCenter = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const pulse = Math.sin(time * 0.04) * 0.3 + 0.7;

      // Outer pulse ring
      ctx.strokeStyle = oklchToRgba(primaryColor, pulse * 0.6);
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, canvasSize * 0.15, 0, Math.PI * 2);
      ctx.stroke();

      // Inner circle
      ctx.fillStyle = oklchToRgba(primaryColor, 0.9);
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, canvasSize * 0.08, 0, Math.PI * 2);
      ctx.fill();

      // Center dot
      ctx.fillStyle = oklchToRgba(secondaryColor, 1);
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, canvasSize * 0.03, 0, Math.PI * 2);
      ctx.fill();
    };

    // Draw gradient background
    const drawBackground = () => {
      const gradient = ctx.createRadialGradient(
        canvasSize / 2,
        canvasSize / 2,
        0,
        canvasSize / 2,
        canvasSize / 2,
        canvasSize / 2
      );
      gradient.addColorStop(0, oklchToRgba(primaryColor, 0.05));
      gradient.addColorStop(0.5, oklchToRgba(secondaryColor, 0.03));
      gradient.addColorStop(1, oklchToRgba(primaryColor, 0.01));

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasSize, canvasSize);
    };

    // Draw subtle grid pattern
    const drawGrid = () => {
      ctx.strokeStyle = oklchToRgba(mutedColor, 0.1);
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;

      const gridSize = canvasSize / 8;
      for (let i = 0; i <= 8; i++) {
        const pos = i * gridSize;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, canvasSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(canvasSize, pos);
        ctx.stroke();
      }
    };

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      drawBackground();
      drawGrid();
      drawConnections();
      drawFloatingElements();
      drawPulsingCenter();

      time++;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      className={`block ${className}`}
      style={{
        imageRendering: "pixelated",
      }}
    />
  );
}
