"use client";

import { useEffect, useRef } from "react";

interface CrookedAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CrookedAnimation({
  className = "",
  size = "md",
}: CrookedAnimationProps) {
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

    // Colors - Scientific theme with black and darker grays
    const primaryColor = "#000000"; // Pure black
    const secondaryColor = "#1a1a1a"; // Very dark gray
    const accentColor = "#333333"; // Dark gray
    const highlightColor = "#4a4a4a"; // Medium dark gray
    const subtleColor = "#666666"; // Medium gray

    // DNA helix pattern
    const drawDNAHelix = () => {
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;

      const centerX = canvasSize / 2;
      const amplitude = canvasSize * 0.15;
      const frequency = 0.02;
      const phaseShift = Math.PI;

      // Left strand
      ctx.beginPath();
      for (let y = 0; y < canvasSize; y += 2) {
        const x = centerX - amplitude * Math.sin(frequency * y + time * 0.01);
        if (y === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Right strand
      ctx.beginPath();
      for (let y = 0; y < canvasSize; y += 2) {
        const x =
          centerX +
          amplitude * Math.sin(frequency * y + time * 0.01 + phaseShift);
        if (y === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Base pairs
      ctx.fillStyle = highlightColor;
      ctx.globalAlpha = 0.6;
      for (let y = 0; y < canvasSize; y += 20) {
        const leftX =
          centerX - amplitude * Math.sin(frequency * y + time * 0.01);
        const rightX =
          centerX +
          amplitude * Math.sin(frequency * y + time * 0.01 + phaseShift);

        ctx.beginPath();
        ctx.moveTo(leftX, y);
        ctx.lineTo(rightX, y);
        ctx.stroke();

        // Base pair indicators
        ctx.beginPath();
        ctx.arc(leftX, y, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(rightX, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Quantum particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      type: "electron" | "photon" | "neutron";
    }> = [];

    const createParticle = () => {
      const types: Array<"electron" | "photon" | "neutron"> = [
        "electron",
        "photon",
        "neutron",
      ];
      const type = types[Math.floor(Math.random() * types.length)];

      let size, color;
      switch (type) {
        case "electron":
          size = 1;
          color = subtleColor;
          break;
        case "photon":
          size = 2;
          color = highlightColor;
          break;
        case "neutron":
          size = 3;
          color = accentColor;
          break;
      }

      const side = Math.floor(Math.random() * 4);
      let x, y, vx, vy;

      switch (side) {
        case 0: // top
          x = Math.random() * canvasSize;
          y = 0;
          vx = (Math.random() - 0.5) * 1.5;
          vy = Math.random() * 1.5 + 0.5;
          break;
        case 1: // right
          x = canvasSize;
          y = Math.random() * canvasSize;
          vx = -(Math.random() * 1.5 + 0.5);
          vy = (Math.random() - 0.5) * 1.5;
          break;
        case 2: // bottom
          x = Math.random() * canvasSize;
          y = canvasSize;
          vx = (Math.random() - 0.5) * 1.5;
          vy = -(Math.random() * 1.5 + 0.5);
          break;
        case 3: // left
          x = 0;
          y = Math.random() * canvasSize;
          vx = Math.random() * 1.5 + 0.5;
          vy = (Math.random() - 0.5) * 1.5;
          break;
        default:
          x = Math.random() * canvasSize;
          y = Math.random() * canvasSize;
          vx = (Math.random() - 0.5) * 1.5;
          vy = (Math.random() - 0.5) * 1.5;
          break;
      }

      particles.push({
        x,
        y,
        vx,
        vy,
        life: 1,
        maxLife: 80 + Math.random() * 80,
        size,
        type,
      });
    };

    const updateParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Add some quantum uncertainty
        particle.vx += (Math.random() - 0.5) * 0.1;
        particle.vy += (Math.random() - 0.5) * 0.1;

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
      particles.forEach((particle) => {
        const alpha = 1 - particle.life / particle.maxLife;
        ctx.globalAlpha = alpha * 0.9;

        let color;
        switch (particle.type) {
          case "electron":
            color = subtleColor;
            break;
          case "photon":
            color = highlightColor;
            break;
          case "neutron":
            color = accentColor;
            break;
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Scientific notation and formulas
    const drawScientificNotation = () => {
      ctx.fillStyle = highlightColor;
      ctx.globalAlpha = 0.3;
      ctx.font = `${canvasSize / 40}px monospace`;

      const formulas = [
        "E=mc²",
        "hν",
        "λ=h/p",
        "ΔxΔp≥ℏ/2",
        "ψ(x,t)",
        "∫ψ*ψdx=1",
      ];

      for (let i = 0; i < formulas.length; i++) {
        const x =
          Math.sin(time * 0.015 + i) * canvasSize * 0.25 + canvasSize / 2;
        const y = (time * 0.3 + i * 30) % canvasSize;
        ctx.fillText(formulas[i], x, y);
      }
    };

    // Central nucleus representation
    const drawNucleus = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const nucleusSize = canvasSize / 10;

      // Nucleus core
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, nucleusSize, 0, Math.PI * 2);
      ctx.fill();

      // Nucleus border
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(centerX, centerY, nucleusSize, 0, Math.PI * 2);
      ctx.stroke();

      // Orbital rings
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.3;
      for (let i = 1; i <= 3; i++) {
        const radius = nucleusSize * (1.5 + i * 0.8);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Quantum state indicator
      const pulse = Math.sin(time * 0.08) * 0.4 + 0.6;
      ctx.fillStyle = highlightColor;
      ctx.globalAlpha = pulse * 0.7;
      ctx.beginPath();
      ctx.arc(centerX, centerY, nucleusSize * 0.4, 0, Math.PI * 2);
      ctx.fill();
    };

    // Energy field lines
    const drawEnergyField = () => {
      ctx.strokeStyle = subtleColor;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.2;

      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;

      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8 + time * 0.005;
        const startX = centerX + Math.cos(angle) * (canvasSize / 8);
        const startY = centerY + Math.sin(angle) * (canvasSize / 8);
        const endX = centerX + Math.cos(angle) * (canvasSize / 2);
        const endY = centerY + Math.sin(angle) * (canvasSize / 2);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    };

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // Draw energy field
      drawEnergyField();

      // Draw DNA helix
      drawDNAHelix();

      // Update and draw particles
      updateParticles();
      drawParticles();

      // Create new particles occasionally
      if (Math.random() < 0.08) {
        createParticle();
      }

      // Draw scientific notation
      drawScientificNotation();

      // Draw nucleus
      drawNucleus();

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
