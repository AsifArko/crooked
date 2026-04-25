"use client";

import { useEffect, useRef } from "react";

interface CrookedExperienceTimeLineAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CrookedExperienceTimeLineAnimation({
  className = "",
  size = "md",
}: CrookedExperienceTimeLineAnimationProps) {
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

    // Colors - Scientific theme with black and darker grays
    const primaryColor = "#000000"; // Pure black
    const secondaryColor = "#1a1a1a"; // Very dark gray
    const accentColor = "#333333"; // Dark gray
    const highlightColor = "#4a4a4a"; // Medium dark gray
    const subtleColor = "#666666"; // Medium gray

    // Timeline nodes
    const timelineNodes = [
      { x: 0.2, y: 0.5, phase: 0 },
      { x: 0.4, y: 0.5, phase: 1 },
      { x: 0.6, y: 0.5, phase: 2 },
      { x: 0.8, y: 0.5, phase: 3 },
    ];

    // Draw scientific timeline line
    const drawTimeline = () => {
      const centerX = canvasSize / 2;
      const timelineWidth = canvasSize * 0.9;
      const startX = centerX - timelineWidth / 2;
      const endX = centerX + timelineWidth / 2;
      const timelineY = canvasSize * 0.5;

      // Main timeline with scientific styling
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.9;

      // Draw segmented timeline
      const segmentCount = 8;
      const segmentWidth = timelineWidth / segmentCount;

      for (let i = 0; i < segmentCount; i++) {
        const x = startX + i * segmentWidth;
        ctx.beginPath();
        ctx.moveTo(x, timelineY);
        ctx.lineTo(x + segmentWidth * 0.8, timelineY);
        ctx.stroke();
      }

      // Timeline arrow
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(endX, timelineY);
      ctx.lineTo(endX - 12, timelineY - 6);
      ctx.lineTo(endX - 12, timelineY + 6);
      ctx.closePath();
      ctx.fill();
    };

    // Draw scientific nodes
    const drawNodes = () => {
      const centerX = canvasSize / 2;
      const timelineWidth = canvasSize * 0.9;
      const startX = centerX - timelineWidth / 2;
      const timelineY = canvasSize * 0.5;

      timelineNodes.forEach((node, index) => {
        const nodeX = startX + timelineWidth * node.x;
        const nodeY = timelineY;
        const nodeRadius = 12;

        // Node core
        ctx.fillStyle = primaryColor;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, nodeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Scientific pulse effect
        const pulseRadius =
          nodeRadius + Math.sin(time * 0.002 + node.phase) * 6;
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner scientific detail
        const innerRadius = nodeRadius * 0.5;
        ctx.fillStyle = highlightColor;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, innerRadius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Draw DNA-like connections
    const drawDNAConnections = () => {
      const centerX = canvasSize / 2;
      const timelineWidth = canvasSize * 0.9;
      const startX = centerX - timelineWidth / 2;
      const timelineY = canvasSize * 0.5;

      ctx.strokeStyle = subtleColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;

      // Draw DNA-like double helix connections
      for (let i = 0; i < timelineNodes.length - 1; i++) {
        const progress1 = i / (timelineNodes.length - 1);
        const progress2 = (i + 1) / (timelineNodes.length - 1);
        const x1 = startX + timelineWidth * timelineNodes[i].x;
        const x2 = startX + timelineWidth * timelineNodes[i + 1].x;
        const y1 = timelineY;
        const y2 = timelineY;

        // Left strand
        const leftOffset = 20;
        ctx.beginPath();
        ctx.moveTo(x1, y1 - leftOffset);
        ctx.lineTo(x2, y2 - leftOffset);
        ctx.stroke();

        // Right strand
        const rightOffset = 20;
        ctx.beginPath();
        ctx.moveTo(x1, y1 + rightOffset);
        ctx.lineTo(x2, y2 + rightOffset);
        ctx.stroke();

        // Cross connections (base pairs)
        const crossCount = 3;
        for (let j = 1; j < crossCount; j++) {
          const crossX = x1 + (x2 - x1) * (j / crossCount);
          const crossY = y1;

          ctx.beginPath();
          ctx.moveTo(crossX, y1 - leftOffset);
          ctx.lineTo(crossX, y1 + rightOffset);
          ctx.stroke();
        }
      }
    };

    // Draw molecular particles
    const drawParticles = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;

      // Floating particles around timeline
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + time * 0.001;
        const radius = canvasSize * 0.3 + Math.sin(time * 0.002 + i) * 10;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.fillStyle = highlightColor;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Draw scientific grid
    const drawScientificGrid = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;

      ctx.strokeStyle = subtleColor;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.08;

      // Radial grid
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + time * 0.0002;
        const startX = centerX + Math.cos(angle) * (canvasSize / 16);
        const startY = centerY + Math.sin(angle) * (canvasSize / 16);
        const endX = centerX + Math.cos(angle) * (canvasSize / 2.5);
        const endY = centerY + Math.sin(angle) * (canvasSize / 2.5);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      // Concentric circles
      for (let i = 1; i <= 3; i++) {
        const radius = (canvasSize / 8) * i;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    // Draw energy field
    const drawEnergyField = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.1;

      // Energy waves
      for (let i = 0; i < 4; i++) {
        const waveRadius =
          (canvasSize / 6) * (i + 1) + Math.sin(time * 0.001 + i) * 5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    // Main animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // Draw all components
      drawScientificGrid();
      drawEnergyField();
      drawTimeline();
      drawDNAConnections();
      drawNodes();
      drawParticles();

      time++;
      animationId = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        imageRendering: "pixelated",
      }}
    />
  );
}
