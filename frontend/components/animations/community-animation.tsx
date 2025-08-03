"use client";

import { useEffect, useRef } from "react";

interface CommunityAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CommunityAnimation({
  className = "",
  size = "md",
}: CommunityAnimationProps) {
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

    // Grey color scheme
    const primaryColor = "#6b7280"; // gray-500
    const secondaryColor = "#9ca3af"; // gray-400
    const accentColor = "#374151"; // gray-700
    const lightColor = "#d1d5db"; // gray-300

    // Draw floating community elements
    const drawFloatingElements = () => {
      const elements = [
        {
          x: canvasSize * 0.25,
          y: canvasSize * 0.25 + Math.sin(time * 0.02) * 8,
          size: canvasSize * 0.06,
          type: "person",
          color: primaryColor,
        },
        {
          x: canvasSize * 0.75,
          y: canvasSize * 0.3 + Math.cos(time * 0.025) * 6,
          size: canvasSize * 0.05,
          type: "person",
          color: accentColor,
        },
        {
          x: canvasSize * 0.2,
          y: canvasSize * 0.7 + Math.sin(time * 0.03) * 10,
          size: canvasSize * 0.04,
          type: "person",
          color: secondaryColor,
        },
        {
          x: canvasSize * 0.8,
          y: canvasSize * 0.65 + Math.cos(time * 0.028) * 7,
          size: canvasSize * 0.05,
          type: "person",
          color: primaryColor,
        },
        {
          x: canvasSize * 0.45,
          y: canvasSize * 0.2 + Math.sin(time * 0.035) * 5,
          size: canvasSize * 0.04,
          type: "person",
          color: accentColor,
        },
        {
          x: canvasSize * 0.55,
          y: canvasSize * 0.8 + Math.cos(time * 0.022) * 9,
          size: canvasSize * 0.06,
          type: "person",
          color: secondaryColor,
        },
      ];

      elements.forEach((element, index) => {
        ctx.save();
        ctx.globalAlpha = 0.8 + Math.sin(time * 0.05 + index) * 0.2;

        // Draw person-like element
        const headSize = element.size * 0.4;
        const bodyHeight = element.size * 0.6;

        // Body
        ctx.fillStyle = element.color;
        ctx.beginPath();
        ctx.ellipse(
          element.x,
          element.y + bodyHeight * 0.3,
          headSize * 0.6,
          bodyHeight * 0.4,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Head
        ctx.fillStyle = lightColor;
        ctx.beginPath();
        ctx.arc(element.x, element.y, headSize, 0, Math.PI * 2);
        ctx.fill();

        // Head border
        ctx.strokeStyle = element.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(element.x, element.y, headSize, 0, Math.PI * 2);
        ctx.stroke();

        // Glow effect
        ctx.strokeStyle = element.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(element.x, element.y, headSize * 1.3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      });
    };

    // Draw connections between elements
    const drawConnections = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;

      // Connect all elements to center
      const elements = [
        { x: canvasSize * 0.25, y: canvasSize * 0.25 },
        { x: canvasSize * 0.75, y: canvasSize * 0.3 },
        { x: canvasSize * 0.2, y: canvasSize * 0.7 },
        { x: canvasSize * 0.8, y: canvasSize * 0.65 },
        { x: canvasSize * 0.45, y: canvasSize * 0.2 },
        { x: canvasSize * 0.55, y: canvasSize * 0.8 },
      ];

      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;

      elements.forEach((element, index) => {
        const pulse = Math.sin(time * 0.03 + index * 0.5) * 0.2 + 0.8;
        ctx.globalAlpha = 0.4 * pulse;

        ctx.beginPath();
        ctx.moveTo(element.x, element.y);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();
      });
    };

    // Draw central gathering point
    const drawCentralGathering = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const hubSize = canvasSize / 12;
      const pulse = Math.sin(time * 0.04) * 0.3 + 0.7;

      // Outer rings
      for (let i = 0; i < 3; i++) {
        const ringSize = hubSize * (2 + i * 0.8);
        const ringPulse = Math.sin(time * 0.03 + i * 0.5) * 0.2 + 0.8;

        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3 * ringPulse;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringSize, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Central circle
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = 0.9 * pulse;
      ctx.beginPath();
      ctx.arc(centerX, centerY, hubSize, 0, Math.PI * 2);
      ctx.fill();

      // Center border
      ctx.strokeStyle = lightColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, hubSize, 0, Math.PI * 2);
      ctx.stroke();

      // Inner glow
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5 * pulse;
      ctx.beginPath();
      ctx.arc(centerX, centerY, hubSize * 0.6, 0, Math.PI * 2);
      ctx.stroke();
    };

    // Draw background
    const drawBackground = () => {
      const gradient = ctx.createRadialGradient(
        canvasSize / 2,
        canvasSize / 2,
        0,
        canvasSize / 2,
        canvasSize / 2,
        canvasSize / 1.5
      );
      gradient.addColorStop(0, "rgba(245, 245, 245, 0.8)");
      gradient.addColorStop(0.5, "rgba(229, 231, 235, 0.4)");
      gradient.addColorStop(1, "rgba(209, 213, 219, 0.1)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasSize, canvasSize);
    };

    // Draw subtle grid
    const drawGrid = () => {
      ctx.strokeStyle = lightColor;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.1;

      const gridSize = canvasSize / 12;
      for (let i = 0; i <= 12; i++) {
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
      drawCentralGathering();

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
      ref={el => {
        canvasRef.current = el;
      }}
      className={`block ${className}`}
      style={{
        imageRendering: "pixelated",
      }}
    />
  );
}
