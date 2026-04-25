"use client";

import { useEffect, useRef } from "react";

interface EngineeringAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  theme?: "mechanical" | "electrical" | "data" | "scientific";
}

export function EngineeringAnimation({
  className = "",
  size = "md",
  theme = "mechanical",
}: EngineeringAnimationProps) {
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

    // Colors
    const primaryColor = "#3b82f6"; // blue-500
    const secondaryColor = "#8b5cf6"; // violet-500
    const accentColor = "#06b6d4"; // cyan-500
    const warningColor = "#f59e0b"; // amber-500
    const dangerColor = "#ef4444"; // red-500

    // Mechanical Engineering Components
    const drawGears = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const gearRadius = canvasSize / 8;
      const teethCount = 12;
      const teethHeight = gearRadius * 0.3;

      // Main gear
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.02);

      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3;
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = 0.8;

      // Draw gear teeth
      ctx.beginPath();
      for (let i = 0; i < teethCount; i++) {
        const angle = (i / teethCount) * Math.PI * 2;
        const x1 = Math.cos(angle) * gearRadius;
        const y1 = Math.sin(angle) * gearRadius;
        const x2 = Math.cos(angle) * (gearRadius + teethHeight);
        const y2 = Math.sin(angle) * (gearRadius + teethHeight);

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();

      // Draw gear body
      ctx.beginPath();
      ctx.arc(0, 0, gearRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw center hole
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.beginPath();
      ctx.arc(0, 0, gearRadius * 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Secondary gears
      const secondaryGears = [
        {
          x: centerX + gearRadius * 2.5,
          y: centerY - gearRadius * 1.5,
          rotation: -time * 0.03,
        },
        {
          x: centerX - gearRadius * 2.5,
          y: centerY + gearRadius * 1.5,
          rotation: time * 0.025,
        },
        {
          x: centerX + gearRadius * 1.5,
          y: centerY + gearRadius * 2.5,
          rotation: -time * 0.035,
        },
      ];

      secondaryGears.forEach((gear) => {
        ctx.save();
        ctx.translate(gear.x, gear.y);
        ctx.rotate(gear.rotation);

        ctx.strokeStyle = secondaryColor;
        ctx.fillStyle = secondaryColor;
        ctx.globalAlpha = 0.6;

        const smallGearRadius = gearRadius * 0.7;

        // Draw smaller gear teeth
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const x1 = Math.cos(angle) * smallGearRadius;
          const y1 = Math.sin(angle) * smallGearRadius;
          const x2 = Math.cos(angle) * (smallGearRadius + teethHeight * 0.7);
          const y2 = Math.sin(angle) * (smallGearRadius + teethHeight * 0.7);

          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, smallGearRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });
    };

    // Electrical Engineering Components
    const drawCircuitBoard = () => {
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.4;

      // Main circuit paths
      const paths = [
        {
          start: { x: 0, y: canvasSize * 0.3 },
          end: { x: canvasSize * 0.7, y: canvasSize * 0.3 },
        },
        {
          start: { x: canvasSize * 0.7, y: canvasSize * 0.3 },
          end: { x: canvasSize * 0.7, y: canvasSize * 0.7 },
        },
        {
          start: { x: canvasSize * 0.7, y: canvasSize * 0.7 },
          end: { x: canvasSize, y: canvasSize * 0.7 },
        },
        {
          start: { x: canvasSize * 0.3, y: 0 },
          end: { x: canvasSize * 0.3, y: canvasSize * 0.7 },
        },
      ];

      paths.forEach((path) => {
        ctx.beginPath();
        ctx.moveTo(path.start.x, path.start.y);
        ctx.lineTo(path.end.x, path.end.y);
        ctx.stroke();
      });

      // Circuit components
      const components = [
        { x: canvasSize * 0.2, y: canvasSize * 0.2, type: "resistor" },
        { x: canvasSize * 0.5, y: canvasSize * 0.5, type: "capacitor" },
        { x: canvasSize * 0.8, y: canvasSize * 0.4, type: "transistor" },
        { x: canvasSize * 0.4, y: canvasSize * 0.8, type: "led" },
      ];

      components.forEach((comp) => {
        ctx.save();
        ctx.translate(comp.x, comp.y);

        switch (comp.type) {
          case "resistor":
            ctx.strokeStyle = warningColor;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(-5, 0);
            ctx.lineTo(-2, -5);
            ctx.lineTo(2, 5);
            ctx.lineTo(5, 0);
            ctx.lineTo(10, 0);
            ctx.stroke();
            break;

          case "capacitor":
            ctx.strokeStyle = dangerColor;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(-3, 0);
            ctx.moveTo(3, 0);
            ctx.lineTo(10, 0);
            ctx.moveTo(-3, -8);
            ctx.lineTo(-3, 8);
            ctx.moveTo(3, -8);
            ctx.lineTo(3, 8);
            ctx.stroke();
            break;

          case "transistor":
            ctx.strokeStyle = secondaryColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, -8);
            ctx.lineTo(0, 8);
            ctx.moveTo(-8, 0);
            ctx.lineTo(8, 0);
            ctx.stroke();
            break;

          case "led":
            ctx.fillStyle = secondaryColor;
            ctx.globalAlpha = 0.8 + Math.sin(time * 0.1) * 0.2;
            ctx.beginPath();
            ctx.arc(0, 0, 6, 0, Math.PI * 2);
            ctx.fill();
            break;
        }

        ctx.restore();
      });
    };

    // Data Flow and Network Visualization
    const drawDataFlow = () => {
      const nodes = [
        { x: canvasSize * 0.2, y: canvasSize * 0.2, connections: [1, 2] },
        { x: canvasSize * 0.8, y: canvasSize * 0.2, connections: [0, 3] },
        { x: canvasSize * 0.2, y: canvasSize * 0.8, connections: [0, 3] },
        { x: canvasSize * 0.8, y: canvasSize * 0.8, connections: [1, 2] },
      ];

      // Draw connections
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;

      nodes.forEach((node, i) => {
        node.connections.forEach((targetIndex) => {
          if (targetIndex > i) {
            const target = nodes[targetIndex];
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        ctx.fillStyle = i % 2 === 0 ? primaryColor : secondaryColor;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing effect
        const pulse = Math.sin(time * 0.05 + i) * 0.3 + 0.7;
        ctx.globalAlpha = pulse * 0.4;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
        ctx.fill();
      });

      // Data packets flowing
      const dataPackets = [];
      for (let i = 0; i < 5; i++) {
        dataPackets.push({
          x: Math.random() * canvasSize,
          y: Math.random() * canvasSize,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1,
        });
      }

      dataPackets.forEach((packet) => {
        packet.x += packet.vx;
        packet.y += packet.vy;
        packet.life -= 0.005;

        if (packet.life > 0) {
          ctx.fillStyle = `rgba(6, 182, 212, ${packet.life})`;
          ctx.beginPath();
          ctx.arc(packet.x, packet.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    // Scientific Visualization
    const drawScientificViz = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;

      // DNA Helix
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;

      for (let i = 0; i < 100; i++) {
        const angle = (i / 100) * Math.PI * 4 + time * 0.02;
        const radius = canvasSize / 6;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + (i - 50) * 2;
        const x2 = centerX + Math.cos(angle + Math.PI) * radius;
        const y2 = centerY + (i - 50) * 2;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Base pairs
        if (i % 10 === 0) {
          ctx.fillStyle = secondaryColor;
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.arc(x1, y1, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x2, y2, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Particle system
      const particles = [];
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: centerX + (Math.random() - 0.5) * canvasSize * 0.8,
          y: centerY + (Math.random() - 0.5) * canvasSize * 0.8,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          life: Math.random(),
          maxLife: 1,
        });
      }

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.01;

        if (particle.life > 0) {
          const alpha = particle.life / particle.maxLife;
          ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    // Mechanical Systems
    const drawMechanicalSystems = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;

      // Piston system
      const pistonX = centerX - canvasSize / 4;
      const pistonY = centerY;
      const pistonStroke = Math.sin(time * 0.03) * 30;

      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.8;

      // Cylinder
      ctx.beginPath();
      ctx.rect(pistonX - 15, pistonY - 40, 30, 80);
      ctx.stroke();

      // Piston
      ctx.fillStyle = secondaryColor;
      ctx.beginPath();
      ctx.rect(pistonX - 12, pistonY - 35 + pistonStroke, 24, 20);
      ctx.fill();

      // Connecting rod
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pistonX, pistonY - 25 + pistonStroke);
      ctx.lineTo(centerX, centerY);
      ctx.stroke();

      // Flywheel
      ctx.strokeStyle = warningColor;
      ctx.lineWidth = 2;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.05);
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0, Math.PI * 2);
      ctx.stroke();

      // Flywheel spokes
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * 40, Math.sin(angle) * 40);
        ctx.stroke();
      }
      ctx.restore();
    };

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // Draw background grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvasSize; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvasSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvasSize, i);
        ctx.stroke();
      }

      // Draw theme-specific animations
      switch (theme) {
        case "mechanical":
          drawGears();
          drawMechanicalSystems();
          break;
        case "electrical":
          drawCircuitBoard();
          break;
        case "data":
          drawDataFlow();
          break;
        case "scientific":
          drawScientificViz();
          break;
        default:
          drawGears();
          drawCircuitBoard();
          drawDataFlow();
          break;
      }

      time++;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [size, theme]);

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
