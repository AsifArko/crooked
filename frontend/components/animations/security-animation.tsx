"use client";

import { useEffect, useRef } from "react";

interface SecurityAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  theme?: "protection" | "encryption" | "monitoring" | "firewall";
}

export function SecurityAnimation({
  className = "",
  size = "md",
  theme = "protection",
}: SecurityAnimationProps) {
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

    // Security-themed color palette
    const primaryColor = "#1e40af"; // blue-800
    const secondaryColor = "#7c3aed"; // violet-600
    const accentColor = "#059669"; // emerald-600
    const warningColor = "#dc2626"; // red-600
    const neutralColor = "#374151"; // gray-700
    const lightColor = "#f8fafc"; // slate-50

    // DNA-like protection structure
    const drawDNAProtection = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const dnaWidth = canvasSize * 0.4;
      const dnaHeight = canvasSize * 0.6;

      // DNA backbone
      const backboneCount = 20;
      const spacing = dnaHeight / backboneCount;

      for (let i = 0; i < backboneCount; i++) {
        const y = centerY - dnaHeight / 2 + i * spacing;
        const wave = Math.sin(time * 0.02 + i * 0.3) * 10;

        // Left backbone
        ctx.fillStyle = primaryColor;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(centerX - dnaWidth / 2 + wave, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Right backbone
        ctx.beginPath();
        ctx.arc(centerX + dnaWidth / 2 - wave, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Connection lines
        if (i % 2 === 0) {
          ctx.strokeStyle = secondaryColor;
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.moveTo(centerX - dnaWidth / 2 + wave, y);
          ctx.lineTo(centerX + dnaWidth / 2 - wave, y);
          ctx.stroke();
        }

        // Security nodes
        if (i % 3 === 0) {
          const pulse = Math.sin(time * 0.05 + i) * 0.3 + 0.7;
          ctx.fillStyle = accentColor;
          ctx.globalAlpha = 0.8 * pulse;
          ctx.beginPath();
          ctx.arc(centerX, y, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Floating security particles
      const particleCount = 8;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + time * 0.01;
        const radius = canvasSize * 0.35;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const size = 3 + Math.sin(time * 0.1 + i) * 2;

        ctx.fillStyle = secondaryColor;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Neural network encryption
    const drawNeuralEncryption = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;

      // Neural nodes
      const nodes = [
        {
          x: centerX - canvasSize * 0.3,
          y: centerY - canvasSize * 0.2,
          layer: 0,
        },
        { x: centerX - canvasSize * 0.3, y: centerY, layer: 0 },
        {
          x: centerX - canvasSize * 0.3,
          y: centerY + canvasSize * 0.2,
          layer: 0,
        },
        { x: centerX, y: centerY - canvasSize * 0.15, layer: 1 },
        { x: centerX, y: centerY + canvasSize * 0.15, layer: 1 },
        {
          x: centerX + canvasSize * 0.3,
          y: centerY - canvasSize * 0.1,
          layer: 2,
        },
        {
          x: centerX + canvasSize * 0.3,
          y: centerY + canvasSize * 0.1,
          layer: 2,
        },
      ];

      // Draw connections
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;

      // Layer 0 to Layer 1 connections
      for (let i = 0; i < 3; i++) {
        for (let j = 3; j < 5; j++) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      // Layer 1 to Layer 2 connections
      for (let i = 3; i < 5; i++) {
        for (let j = 5; j < 7; j++) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      // Draw nodes
      nodes.forEach((node, i) => {
        const pulse = Math.sin(time * 0.05 + i) * 0.3 + 0.7;
        const size = node.layer === 1 ? 8 : 6;

        // Node background
        ctx.fillStyle = node.layer === 1 ? accentColor : primaryColor;
        ctx.globalAlpha = 0.8 * pulse;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Node border
        ctx.strokeStyle = lightColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.9;
        ctx.stroke();

        // Data flow animation
        if (node.layer === 0) {
          const flowX = node.x + Math.sin(time * 0.03 + i) * 20;
          const flowY = node.y + Math.cos(time * 0.03 + i) * 10;

          ctx.fillStyle = accentColor;
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.arc(flowX, flowY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    // Quantum monitoring grid
    const drawQuantumMonitoring = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;

      // Quantum grid
      const gridSize = canvasSize * 0.5;
      const gridX = centerX - gridSize / 2;
      const gridY = centerY - gridSize / 2;

      // Draw quantum cells
      const cellSize = gridSize / 6;
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
          const x = gridX + col * cellSize;
          const y = gridY + row * cellSize;
          const quantumState = Math.sin(time * 0.02 + row + col) * 0.5 + 0.5;

          // Cell background
          ctx.fillStyle = `${primaryColor}${Math.floor(quantumState * 30)
            .toString(16)
            .padStart(2, "0")}`;
          ctx.globalAlpha = 0.3;
          ctx.fillRect(x, y, cellSize, cellSize);

          // Cell border
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.2;
          ctx.strokeRect(x, y, cellSize, cellSize);

          // Quantum particles
          if (Math.random() > 0.7) {
            const particleX =
              x + cellSize / 2 + Math.sin(time * 0.05 + row * col) * 5;
            const particleY =
              y + cellSize / 2 + Math.cos(time * 0.05 + row * col) * 5;

            ctx.fillStyle = accentColor;
            ctx.globalAlpha = 0.8 * quantumState;
            ctx.beginPath();
            ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Scanning wave
      const scanY = centerY + Math.sin(time * 0.03) * gridSize * 0.3;
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.6;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(gridX, scanY);
      ctx.lineTo(gridX + gridSize, scanY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Threat detection
      const threats = [
        { x: gridX + gridSize * 0.2, y: gridY + gridSize * 0.3, active: true },
        { x: gridX + gridSize * 0.7, y: gridY + gridSize * 0.6, active: false },
      ];

      threats.forEach((threat, i) => {
        const pulse = Math.sin(time * 0.1 + i) * 0.5 + 0.5;
        const size = threat.active ? 8 : 4;
        const color = threat.active ? warningColor : neutralColor;

        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8 * pulse;
        ctx.beginPath();
        ctx.arc(threat.x, threat.y, size, 0, Math.PI * 2);
        ctx.fill();

        if (threat.active) {
          // Alert ring
          ctx.strokeStyle = warningColor;
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.6 * pulse;
          ctx.beginPath();
          ctx.arc(threat.x, threat.y, size + 8, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    };

    // Holographic firewall
    const drawHolographicFirewall = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;

      // Holographic barrier
      const barrierWidth = canvasSize * 0.7;
      const barrierHeight = canvasSize * 0.1;
      const barrierX = centerX - barrierWidth / 2;
      const barrierY = centerY;

      // Holographic effect
      for (let i = 0; i < 5; i++) {
        const offset = i * 2;
        const alpha = 0.3 - i * 0.05;

        ctx.fillStyle = `${primaryColor}${Math.floor(alpha * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.globalAlpha = alpha;
        ctx.fillRect(
          barrierX - offset,
          barrierY - barrierHeight / 2 - offset,
          barrierWidth + offset * 2,
          barrierHeight + offset * 2
        );
      }

      // Main barrier
      ctx.fillStyle = `${primaryColor}40`;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(
        barrierX,
        barrierY - barrierHeight / 2,
        barrierWidth,
        barrierHeight
      );

      // Barrier border with glow
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.9;
      ctx.strokeRect(
        barrierX,
        barrierY - barrierHeight / 2,
        barrierWidth,
        barrierHeight
      );

      // Data streams
      const streamCount = 8;
      for (let i = 0; i < streamCount; i++) {
        const x = barrierX + (barrierWidth / streamCount) * i;
        const y = barrierY + Math.sin(time * 0.02 + i) * 20;

        // Stream particles
        for (let j = 0; j < 5; j++) {
          const particleY = y + j * 8;
          const pulse = Math.sin(time * 0.05 + i + j) * 0.3 + 0.7;

          ctx.fillStyle = secondaryColor;
          ctx.globalAlpha = 0.7 * pulse;
          ctx.beginPath();
          ctx.arc(x, particleY, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Threat simulation
      const threats = [
        {
          x: centerX - canvasSize * 0.3,
          y: centerY - canvasSize * 0.15,
          blocked: false,
        },
        {
          x: centerX - canvasSize * 0.2,
          y: centerY + canvasSize * 0.1,
          blocked: true,
        },
        {
          x: centerX - canvasSize * 0.1,
          y: centerY - canvasSize * 0.05,
          blocked: false,
        },
      ];

      threats.forEach((threat, i) => {
        const pulse = Math.sin(time * 0.1 + i) * 0.5 + 0.5;
        const size = 6;
        const color = threat.blocked ? neutralColor : warningColor;

        // Threat particle
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8 * pulse;
        ctx.beginPath();
        ctx.arc(threat.x, threat.y, size, 0, Math.PI * 2);
        ctx.fill();

        if (threat.blocked) {
          // Blocked indicator
          ctx.strokeStyle = warningColor;
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.moveTo(threat.x - size, threat.y - size);
          ctx.lineTo(threat.x + size, threat.y + size);
          ctx.moveTo(threat.x + size, threat.y - size);
          ctx.lineTo(threat.x - size, threat.y + size);
          ctx.stroke();
        } else {
          // Movement trail
          ctx.strokeStyle = warningColor;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.4;
          ctx.beginPath();
          ctx.moveTo(threat.x, threat.y);
          ctx.lineTo(threat.x + 20, threat.y);
          ctx.stroke();
        }
      });

      // Status hologram
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = 0.9;
      ctx.font = `${canvasSize / 18}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "QUANTUM SHIELD ACTIVE",
        centerX,
        centerY + canvasSize * 0.25
      );
    };

    // Floating security particles
    const drawSecurityParticles = () => {
      const particleCount = 12;
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = 0.3;

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + time * 0.005;
        const radius = canvasSize * 0.45;
        const x = canvasSize / 2 + Math.cos(angle) * radius;
        const y = canvasSize / 2 + Math.sin(angle) * radius;

        const size = 2 + Math.sin(time * 0.1 + i) * 1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Main animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // Draw background gradient
      const gradient = ctx.createRadialGradient(
        canvasSize / 2,
        canvasSize / 2,
        0,
        canvasSize / 2,
        canvasSize / 2,
        canvasSize / 2
      );
      gradient.addColorStop(0, `${primaryColor}05`);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // Draw components based on theme
      switch (theme) {
        case "protection":
          drawDNAProtection();
          drawSecurityParticles();
          break;
        case "encryption":
          drawNeuralEncryption();
          drawSecurityParticles();
          break;
        case "monitoring":
          drawQuantumMonitoring();
          drawSecurityParticles();
          break;
        case "firewall":
          drawHolographicFirewall();
          drawSecurityParticles();
          break;
        default:
          drawDNAProtection();
          drawSecurityParticles();
      }

      time += 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [size, theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`${className}`}
      style={{
        display: "block",
        maxWidth: "100%",
        height: "auto",
      }}
    />
  );
}
