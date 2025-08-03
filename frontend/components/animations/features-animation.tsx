"use client";

import { useEffect, useRef } from "react";

interface FeaturesAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FeaturesAnimation({
  className = "",
  size = "md",
}: FeaturesAnimationProps) {
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

    // Colors - off-white and grey scheme
    const primaryColor = "#f8f9fa"; // off-white
    const secondaryColor = "#6c757d"; // grey
    const accentColor = "#495057"; // darker grey

    // Feature grid background
    const drawFeatureGrid = () => {
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.2;

      // Draw grid lines
      for (let i = 0; i < 6; i++) {
        const pos = (canvasSize / 6) * i;
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, canvasSize);
        ctx.stroke();
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(canvasSize, pos);
        ctx.stroke();
      }
    };

    // Feature icons/boxes
    const features = [
      { x: canvasSize * 0.2, y: canvasSize * 0.2, type: "tool" },
      { x: canvasSize * 0.8, y: canvasSize * 0.3, type: "shield" },
      { x: canvasSize * 0.3, y: canvasSize * 0.7, type: "code" },
      { x: canvasSize * 0.7, y: canvasSize * 0.8, type: "book" },
    ];

    const drawFeature = (feature: { x: number; y: number; type: string }) => {
      const pulse = Math.sin(time * 0.05 + feature.x * 0.01) * 0.3 + 0.7;
      const size = canvasSize / 12;

      // Feature box
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = 0.8 * pulse;
      ctx.fillRect(feature.x - size, feature.y - size, size * 2, size * 2);

      // Border
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.9;
      ctx.strokeRect(feature.x - size, feature.y - size, size * 2, size * 2);

      // Simple geometric shapes instead of icons
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = 0.9;

      const shapeSize = canvasSize / 24;

      switch (feature.type) {
        case "tool":
          // Triangle
          ctx.beginPath();
          ctx.moveTo(feature.x, feature.y - shapeSize);
          ctx.lineTo(feature.x - shapeSize, feature.y + shapeSize);
          ctx.lineTo(feature.x + shapeSize, feature.y + shapeSize);
          ctx.closePath();
          ctx.fill();
          break;
        case "shield":
          // Square
          ctx.fillRect(
            feature.x - shapeSize,
            feature.y - shapeSize,
            shapeSize * 2,
            shapeSize * 2
          );
          break;
        case "code":
          // Circle
          ctx.beginPath();
          ctx.arc(feature.x, feature.y, shapeSize, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "book":
          // Diamond
          ctx.beginPath();
          ctx.moveTo(feature.x, feature.y - shapeSize);
          ctx.lineTo(feature.x + shapeSize, feature.y);
          ctx.lineTo(feature.x, feature.y + shapeSize);
          ctx.lineTo(feature.x - shapeSize, feature.y);
          ctx.closePath();
          ctx.fill();
          break;
      }
    };

    // Connection lines between features
    const drawConnections = () => {
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;

      for (let i = 0; i < features.length; i++) {
        for (let j = i + 1; j < features.length; j++) {
          const distance =
            Math.sqrt(
              Math.pow(features[i].x - features[j].x, 2) +
                Math.pow(features[i].y - features[j].y, 2)
            ) / canvasSize;

          if (distance < 0.8) {
            const pulse = Math.sin(time * 0.03 + i * 0.5) * 0.2 + 0.3;
            ctx.globalAlpha = pulse;
            ctx.beginPath();
            ctx.moveTo(features[i].x, features[i].y);
            ctx.lineTo(features[j].x, features[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
    }> = [];

    const createParticle = () => {
      particles.push({
        x: Math.random() * canvasSize,
        y: Math.random() * canvasSize,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
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

        // Remove dead particles
        if (particle.life > particle.maxLife) {
          particles.splice(i, 1);
        }
      }
    };

    const drawParticles = () => {
      ctx.fillStyle = accentColor;
      particles.forEach(particle => {
        const alpha = 1 - particle.life / particle.maxLife;
        ctx.globalAlpha = alpha * 0.6;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Central feature hub
    const drawFeatureHub = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const hubSize = canvasSize / 8;

      // Hexagonal hub
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      const hexSize = hubSize;
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = centerX + Math.cos(angle) * hexSize;
        const y = centerY + Math.sin(angle) * hexSize;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();

      // Rotating rings
      const ringCount = 3;
      for (let i = 0; i < ringCount; i++) {
        const ringRadius = hubSize + (i + 1) * 8;
        const rotation = (time * 0.02 + (i * Math.PI) / 3) % (Math.PI * 2);

        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Orbiting dots
        const dotX = centerX + Math.cos(rotation) * ringRadius;
        const dotY = centerY + Math.sin(rotation) * ringRadius;
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Feature badges/labels
    const drawFeatureLabels = () => {
      ctx.fillStyle = secondaryColor;
      ctx.globalAlpha = 0.7;
      ctx.font = `${canvasSize / 24}px monospace`;
      ctx.textAlign = "center";

      const labels = ["Tool", "Secure", "Code", "Learn"];
      features.forEach((feature, index) => {
        if (index < labels.length) {
          ctx.fillText(labels[index], feature.x, feature.y + canvasSize / 8);
        }
      });
    };

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // Draw background
      drawFeatureGrid();

      // Draw connections
      drawConnections();

      // Update and draw particles
      updateParticles();
      drawParticles();

      // Create new particles occasionally
      if (Math.random() < 0.05) {
        createParticle();
      }

      // Draw features
      features.forEach(drawFeature);

      // Draw feature hub
      drawFeatureHub();

      // Draw labels
      drawFeatureLabels();

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
