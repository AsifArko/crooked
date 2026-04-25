"use client";

import { useEffect, useRef } from "react";

interface CSAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CSAnimation({ className = "", size = "md" }: CSAnimationProps) {
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

    // Colors
    const primaryColor = "#6b7280"; // gray-500
    const secondaryColor = "#9ca3af"; // gray-400
    const accentColor = "#f3f4f6"; // gray-100 (off-white)

    // Circuit board pattern
    const drawCircuitBoard = () => {
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;

      // Horizontal lines
      for (let i = 0; i < 8; i++) {
        const y = (canvasSize / 8) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasSize, y);
        ctx.stroke();
      }

      // Vertical lines
      for (let i = 0; i < 8; i++) {
        const x = (canvasSize / 8) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasSize);
        ctx.stroke();
      }

      // Connection nodes
      ctx.fillStyle = secondaryColor;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if ((i + j) % 2 === 0) {
            const x = (canvasSize / 8) * i;
            const y = (canvasSize / 8) * j;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    // Data flow particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
    }> = [];

    const createParticle = () => {
      const side = Math.floor(Math.random() * 4);
      let x, y, vx, vy;

      switch (side) {
        case 0: // top
          x = Math.random() * canvasSize;
          y = 0;
          vx = (Math.random() - 0.5) * 2;
          vy = Math.random() * 2 + 1;
          break;
        case 1: // right
          x = canvasSize;
          y = Math.random() * canvasSize;
          vx = -(Math.random() * 2 + 1);
          vy = (Math.random() - 0.5) * 2;
          break;
        case 2: // bottom
          x = Math.random() * canvasSize;
          y = canvasSize;
          vx = (Math.random() - 0.5) * 2;
          vy = -(Math.random() * 2 + 1);
          break;
        case 3: // left
          x = 0;
          y = Math.random() * canvasSize;
          vx = Math.random() * 2 + 1;
          vy = (Math.random() - 0.5) * 2;
          break;
        default:
          x = Math.random() * canvasSize;
          y = Math.random() * canvasSize;
          vx = (Math.random() - 0.5) * 2;
          vy = (Math.random() - 0.5) * 2;
          break;
      }

      particles.push({
        x,
        y,
        vx,
        vy,
        life: 1,
        maxLife: 60 + Math.random() * 60,
      });
    };

    const updateParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Remove particles that are off-screen or expired
        if (
          particle.x < -10 ||
          particle.x > canvasSize + 10 ||
          particle.y < -10 ||
          particle.y > canvasSize + 10 ||
          particle.life > particle.maxLife
        ) {
          particles.splice(i, 1);
        }
      }
    };

    const drawParticles = () => {
      ctx.fillStyle = accentColor;
      particles.forEach((particle) => {
        const alpha = 1 - particle.life / particle.maxLife;
        ctx.globalAlpha = alpha * 0.8;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Binary rain effect
    const drawBinaryRain = () => {
      ctx.fillStyle = secondaryColor;
      ctx.globalAlpha = 0.3;
      ctx.font = `${canvasSize / 32}px monospace`;

      for (let i = 0; i < 10; i++) {
        const x = Math.sin(time * 0.02 + i) * canvasSize * 0.3 + canvasSize / 2;
        const y = (time * 0.5 + i * 20) % canvasSize;
        ctx.fillText(Math.random() > 0.5 ? "1" : "0", x, y);
      }
    };

    // Central CPU representation
    const drawCPU = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const cpuSize = canvasSize / 8; // Medium size - between original and smaller

      // CPU core
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(
        centerX - cpuSize,
        centerY - cpuSize,
        cpuSize * 2,
        cpuSize * 2
      );

      // CPU border - removed for cleaner look
      // ctx.strokeStyle = secondaryColor;
      // ctx.lineWidth = 2;
      // ctx.globalAlpha = 1;
      // ctx.strokeRect(
      //   centerX - cpuSize,
      //   centerY - cpuSize,
      //   cpuSize * 2,
      //   cpuSize * 2
      // );

      // CPU pins
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = 0.8;
      const pinCount = 8;
      for (let i = 0; i < pinCount; i++) {
        const angle = (i * Math.PI * 2) / pinCount;
        const pinRadius = cpuSize * 2; // Adjusted for smaller CPU
        const pinX = centerX + Math.cos(angle) * pinRadius;
        const pinY = centerY + Math.sin(angle) * pinRadius;
        ctx.beginPath();
        ctx.arc(pinX, pinY, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Processing indicator
      const pulse = Math.sin(time * 0.1) * 0.3 + 0.7;
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = pulse * 0.6;
      ctx.beginPath();
      ctx.arc(centerX, centerY, cpuSize * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Data flow lines to CPU
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;
      particles.forEach((particle) => {
        const distance = Math.sqrt(
          Math.pow(particle.x - centerX, 2) + Math.pow(particle.y - centerY, 2)
        );
        if (distance < canvasSize * 0.4) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(centerX, centerY);
          ctx.stroke();
        }
      });
    };

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // Draw circuit board
      drawCircuitBoard();

      // Update and draw particles
      updateParticles();
      drawParticles();

      // Create new particles occasionally
      if (Math.random() < 0.1) {
        createParticle();
      }

      // Draw binary rain
      drawBinaryRain();

      // Draw CPU
      drawCPU();

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
