"use client";

import { useEffect, useRef } from "react";

interface CrookedEmailAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CrookedEmailAnimation({
  className = "",
  size = "md",
}: CrookedEmailAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const sizeMap = {
      sm: 64,
      md: 128,
      lg: 256,
    };
    const canvasSize = sizeMap[size];
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Animation variables
    let animationId: number;
    let time = 0;

    // Sophisticated color palette
    const primaryColor = "#000000";
    const secondaryColor = "#1a1a1a";
    const accentColor = "#333333";
    const highlightColor = "#4a4a4a";
    const subtleColor = "#666666";
    const elegantColor = "#888888";

    // Flowing lines system
    const flowingLines: Array<{
      points: Array<{ x: number; y: number }>;
      opacity: number;
      width: number;
      speed: number;
      angle: number;
    }> = [];

    const createFlowingLine = () => {
      const startAngle = Math.random() * Math.PI * 2;
      const points = [];
      const numPoints = 8 + Math.floor(Math.random() * 4);

      for (let i = 0; i < numPoints; i++) {
        const angle = startAngle + i * 0.3 + Math.sin(i * 0.5) * 0.2;
        const radius = canvasSize * (0.2 + i * 0.05);
        const x = canvasSize / 2 + Math.cos(angle) * radius;
        const y = canvasSize / 2 + Math.sin(angle) * radius;
        points.push({ x, y });
      }

      flowingLines.push({
        points,
        opacity: 0.1 + Math.random() * 0.2,
        width: 0.5 + Math.random() * 1,
        speed: 0.5 + Math.random() * 1,
        angle: startAngle,
      });
    };

    const updateFlowingLines = () => {
      flowingLines.forEach((line, index) => {
        line.angle += line.speed * 0.002;
        line.opacity = 0.1 + Math.sin(time * 0.01 + index) * 0.15;

        // Update points with flowing motion
        line.points.forEach((point, i) => {
          const angle =
            line.angle + i * 0.3 + Math.sin(i * 0.5 + time * 0.005) * 0.2;
          const radius = canvasSize * (0.2 + i * 0.05);
          point.x = canvasSize / 2 + Math.cos(angle) * radius;
          point.y = canvasSize / 2 + Math.sin(angle) * radius;
        });
      });
    };

    const drawFlowingLines = () => {
      flowingLines.forEach((line) => {
        ctx.strokeStyle = elegantColor;
        ctx.lineWidth = line.width;
        ctx.globalAlpha = line.opacity;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(line.points[0].x, line.points[0].y);

        for (let i = 1; i < line.points.length; i++) {
          const point = line.points[i];
          const prevPoint = line.points[i - 1];

          // Create smooth curves
          const cpx = (prevPoint.x + point.x) / 2;
          const cpy = (prevPoint.y + point.y) / 2;
          ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cpx, cpy);
        }

        ctx.stroke();
      });
    };

    // Geometric envelope with sophisticated details
    const drawEnvelope = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const envelopeSize = canvasSize * 0.22;

      ctx.save();

      // Main envelope body with rounded corners effect
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.9;

      // Create rounded rectangle effect
      const radius = envelopeSize * 0.1;
      ctx.beginPath();
      ctx.moveTo(centerX - envelopeSize + radius, centerY - envelopeSize * 0.6);
      ctx.lineTo(centerX + envelopeSize - radius, centerY - envelopeSize * 0.6);
      ctx.quadraticCurveTo(
        centerX + envelopeSize,
        centerY - envelopeSize * 0.6,
        centerX + envelopeSize,
        centerY - envelopeSize * 0.6 + radius
      );
      ctx.lineTo(centerX + envelopeSize, centerY + envelopeSize * 0.6 - radius);
      ctx.quadraticCurveTo(
        centerX + envelopeSize,
        centerY + envelopeSize * 0.6,
        centerX + envelopeSize - radius,
        centerY + envelopeSize * 0.6
      );
      ctx.lineTo(centerX - envelopeSize + radius, centerY + envelopeSize * 0.6);
      ctx.quadraticCurveTo(
        centerX - envelopeSize,
        centerY + envelopeSize * 0.6,
        centerX - envelopeSize,
        centerY + envelopeSize * 0.6 - radius
      );
      ctx.lineTo(centerX - envelopeSize, centerY - envelopeSize * 0.6 + radius);
      ctx.quadraticCurveTo(
        centerX - envelopeSize,
        centerY - envelopeSize * 0.6,
        centerX - envelopeSize + radius,
        centerY - envelopeSize * 0.6
      );
      ctx.closePath();
      ctx.stroke();

      // Sophisticated envelope flap with curve
      ctx.beginPath();
      ctx.moveTo(centerX - envelopeSize, centerY - envelopeSize * 0.6);
      ctx.quadraticCurveTo(
        centerX,
        centerY - envelopeSize * 1.2,
        centerX + envelopeSize,
        centerY - envelopeSize * 0.6
      );
      ctx.stroke();

      // Elegant content lines with varying opacity
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.2;

      for (let i = 1; i <= 4; i++) {
        const y = centerY - envelopeSize * 0.3 + i * envelopeSize * 0.12;
        const opacity = 0.3 + i * 0.1;
        ctx.globalAlpha = opacity;

        ctx.beginPath();
        ctx.moveTo(centerX - envelopeSize * 0.65, y);
        ctx.lineTo(centerX + envelopeSize * 0.65, y);
        ctx.stroke();
      }

      // Add subtle inner shadow effect
      ctx.strokeStyle = highlightColor;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.2;

      ctx.beginPath();
      ctx.moveTo(centerX - envelopeSize * 0.8, centerY - envelopeSize * 0.5);
      ctx.lineTo(centerX + envelopeSize * 0.8, centerY - envelopeSize * 0.5);
      ctx.stroke();

      ctx.restore();
    };

    // Orbiting elements with sophisticated motion
    const orbitingElements: Array<{
      x: number;
      y: number;
      size: number;
      type: "circle" | "square" | "diamond";
      angle: number;
      speed: number;
      radius: number;
      opacity: number;
    }> = [];

    const createOrbitingElement = () => {
      const types: Array<"circle" | "square" | "diamond"> = [
        "circle",
        "square",
        "diamond",
      ];
      const type = types[Math.floor(Math.random() * types.length)];

      orbitingElements.push({
        x: 0,
        y: 0,
        size: 3 + Math.random() * 4,
        type,
        angle: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 1.2,
        radius: canvasSize * (0.35 + Math.random() * 0.15),
        opacity: 0.4 + Math.random() * 0.4,
      });
    };

    const updateOrbitingElements = () => {
      orbitingElements.forEach((element, index) => {
        element.angle += element.speed * 0.005;
        element.opacity = 0.4 + Math.sin(time * 0.015 + index) * 0.2;

        element.x = canvasSize / 2 + Math.cos(element.angle) * element.radius;
        element.y = canvasSize / 2 + Math.sin(element.angle) * element.radius;
      });
    };

    const drawOrbitingElements = () => {
      orbitingElements.forEach((element) => {
        ctx.save();
        ctx.translate(element.x, element.y);
        ctx.rotate(element.angle * 0.5);

        ctx.fillStyle = primaryColor;
        ctx.globalAlpha = element.opacity;

        switch (element.type) {
          case "circle":
            ctx.beginPath();
            ctx.arc(0, 0, element.size, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "square":
            ctx.fillRect(
              -element.size,
              -element.size,
              element.size * 2,
              element.size * 2
            );
            break;
          case "diamond":
            ctx.beginPath();
            ctx.moveTo(0, -element.size);
            ctx.lineTo(element.size, 0);
            ctx.lineTo(0, element.size);
            ctx.lineTo(-element.size, 0);
            ctx.closePath();
            ctx.fill();
            break;
        }

        ctx.restore();
      });
    };

    // Sophisticated grid pattern
    const drawGridPattern = () => {
      ctx.strokeStyle = subtleColor;
      ctx.lineWidth = 0.3;
      ctx.globalAlpha = 0.15;

      const gridSize = canvasSize / 8;
      const offset = (time * 0.2) % gridSize;

      // Vertical lines
      for (let x = offset; x < canvasSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasSize);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = offset; y < canvasSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasSize, y);
        ctx.stroke();
      }
    };

    // Central connection hub
    const drawConnectionHub = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const hubSize = canvasSize / 20;

      ctx.save();

      // Hub core with gradient effect
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, hubSize, 0, Math.PI * 2);
      ctx.fill();

      // Multiple concentric rings
      for (let i = 1; i <= 3; i++) {
        const ringRadius = hubSize * (1 + i * 0.8);
        const opacity = 0.1 - i * 0.02;

        ctx.strokeStyle = elegantColor;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = opacity;

        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Pulsing center
      const pulse = Math.sin(time * 0.05) * 0.4 + 0.6;
      ctx.fillStyle = highlightColor;
      ctx.globalAlpha = pulse * 0.6;
      ctx.beginPath();
      ctx.arc(centerX, centerY, hubSize * 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Initialize elements
    for (let i = 0; i < 5; i++) {
      createFlowingLine();
    }

    for (let i = 0; i < 8; i++) {
      createOrbitingElement();
    }

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // Draw background elements
      drawGridPattern();
      drawFlowingLines();

      // Update and draw orbiting elements
      updateOrbitingElements();
      drawOrbitingElements();

      // Update flowing lines
      updateFlowingLines();

      // Draw main elements
      drawConnectionHub();
      drawEnvelope();

      time++;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [size]);

  return <canvas ref={canvasRef} className={`block ${className}`} />;
}
