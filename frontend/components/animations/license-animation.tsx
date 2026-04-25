"use client";

import { useEffect, useRef } from "react";

interface LicenseAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  theme?: "legal" | "terms" | "agreement" | "compliance";
}

export function LicenseAnimation({
  className = "",
  size = "md",
  theme = "legal",
}: LicenseAnimationProps) {
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

    // Greyscale color palette
    const primaryColor = "#4b5563"; // gray-600 - main elements
    const secondaryColor = "#6b7280"; // gray-500 - secondary elements
    const accentColor = "#9ca3af"; // gray-400 - accent elements
    const neutralColor = "#374151"; // gray-700 - text and details
    const lightColor = "#f9fafb"; // gray-50 - off-white background

    // Scales of justice
    const drawScalesOfJustice = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const scaleRadius = canvasSize * 0.12;
      const armLength = canvasSize * 0.15;

      // Central pillar
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - scaleRadius);
      ctx.lineTo(centerX, centerY + scaleRadius);
      ctx.stroke();

      // Horizontal arm
      ctx.beginPath();
      ctx.moveTo(centerX - armLength, centerY);
      ctx.lineTo(centerX + armLength, centerY);
      ctx.stroke();

      // Left scale
      const leftScaleX = centerX - armLength;
      const leftScaleY = centerY + 10;
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.moveTo(leftScaleX, centerY);
      ctx.lineTo(leftScaleX, leftScaleY);
      ctx.stroke();

      // Left scale bowl
      ctx.fillStyle = secondaryColor;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(
        leftScaleX,
        leftScaleY + scaleRadius * 0.3,
        scaleRadius * 0.4,
        0,
        Math.PI
      );
      ctx.fill();

      // Right scale
      const rightScaleX = centerX + armLength;
      const rightScaleY = centerY + 10;
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.moveTo(rightScaleX, centerY);
      ctx.lineTo(rightScaleX, rightScaleY);
      ctx.stroke();

      // Right scale bowl
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(
        rightScaleX,
        rightScaleY + scaleRadius * 0.3,
        scaleRadius * 0.4,
        0,
        Math.PI
      );
      ctx.fill();

      // Balance animation
      const balance = Math.sin(time * 0.02) * 0.3;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(balance);
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(-armLength, 0);
      ctx.lineTo(armLength, 0);
      ctx.stroke();
      ctx.restore();
    };

    // Terms and conditions
    const drawTermsAndConditions = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const termsWidth = canvasSize * 0.45;
      const termsHeight = canvasSize * 0.55;

      // Terms background
      ctx.fillStyle = lightColor;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(
        centerX - termsWidth / 2,
        centerY - termsHeight / 2,
        termsWidth,
        termsHeight
      );

      // Terms border
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      ctx.strokeRect(
        centerX - termsWidth / 2,
        centerY - termsHeight / 2,
        termsWidth,
        termsHeight
      );

      // Terms title removed for cleaner look

      // Terms items
      const items = [
        "Acceptable Use",
        "Intellectual Property",
        "Liability Limits",
        "Termination Rights",
        "Governing Law",
      ];

      const itemHeight = (termsHeight - 50) / items.length;
      const startY = centerY - termsHeight / 2 + 40;

      items.forEach((item, i) => {
        const y = startY + i * itemHeight;
        const bulletSize = canvasSize * 0.02;
        const bulletX = centerX - termsWidth / 2 + 15;
        const bulletY = y;

        // Bullet point
        ctx.fillStyle = secondaryColor;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(bulletX, bulletY, bulletSize, 0, Math.PI * 2);
        ctx.fill();

        // Item text
        ctx.fillStyle = neutralColor;
        ctx.globalAlpha = 0.8;
        ctx.font = `${canvasSize / 25}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(item, bulletX + bulletSize + 10, bulletY);

        // Highlight animation
        const highlight = Math.sin(time * 0.03 + i * 0.5) * 0.5 + 0.5;
        if (highlight > 0.7) {
          ctx.fillStyle = accentColor;
          ctx.globalAlpha = 0.2;
          ctx.fillRect(
            bulletX + bulletSize + 5,
            bulletY - 8,
            termsWidth - 30,
            16
          );
        }
      });
    };

    // Legal compliance check
    const drawComplianceCheck = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const checkSize = canvasSize * 0.15;

      // Check circle
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, checkSize, 0, Math.PI * 2);
      ctx.fill();

      // Check border
      ctx.strokeStyle = lightColor;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.9;
      ctx.stroke();

      // Checkmark
      ctx.strokeStyle = lightColor;
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(centerX - checkSize * 0.3, centerY);
      ctx.lineTo(centerX, centerY + checkSize * 0.3);
      ctx.lineTo(centerX + checkSize * 0.4, centerY - checkSize * 0.2);
      ctx.stroke();

      // Pulse animation
      const pulse = Math.sin(time * 0.05) * 0.2 + 0.8;
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3 * pulse;
      ctx.beginPath();
      ctx.arc(centerX, centerY, checkSize + 8, 0, Math.PI * 2);
      ctx.stroke();
    };

    // Legal particles
    const drawLegalParticles = () => {
      const particleCount = 8;
      ctx.fillStyle = secondaryColor;
      ctx.globalAlpha = 0.4;

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + time * 0.003;
        const radius = canvasSize * 0.4;
        const x = canvasSize / 2 + Math.cos(angle) * radius;
        const y = canvasSize / 2 + Math.sin(angle) * radius;

        const size = 2 + Math.sin(time * 0.08 + i) * 1;
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
      gradient.addColorStop(0, `${primaryColor}10`);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // Draw components based on theme
      switch (theme) {
        case "legal":
          drawScalesOfJustice();
          drawLegalParticles();
          break;
        case "terms":
          drawTermsAndConditions();
          drawComplianceCheck();
          drawLegalParticles();
          break;
        case "agreement":
          drawComplianceCheck();
          drawLegalParticles();
          break;
        case "compliance":
          drawTermsAndConditions();
          drawScalesOfJustice();
          drawLegalParticles();
          break;
        default:
          drawScalesOfJustice();
          drawLegalParticles();
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
