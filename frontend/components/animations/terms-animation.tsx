"use client";

import { useEffect, useRef } from "react";

interface TermsAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  theme?: "legal" | "agreement" | "contract" | "policy";
}

export function TermsAnimation({
  className = "",
  size = "md",
  theme = "legal",
}: TermsAnimationProps) {
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

    // Legal-themed color palette - Gray and Off-White
    const primaryColor = "#4b5563"; // gray-600 - trust and authority
    const secondaryColor = "#6b7280"; // gray-500 - legal and formal
    const accentColor = "#9ca3af"; // gray-400 - agreement and acceptance
    const neutralColor = "#374151"; // gray-700 - professional and serious
    const lightColor = "#fafafa"; // gray-50 - clean and minimal off-white

    // Legal document system
    const drawLegalDocument = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const docWidth = canvasSize * 0.4;
      const docHeight = canvasSize * 0.5;

      // Document background
      ctx.fillStyle = lightColor;
      ctx.globalAlpha = 0.95;
      ctx.fillRect(
        centerX - docWidth / 2,
        centerY - docHeight / 2,
        docWidth,
        docHeight
      );

      // Document border
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      ctx.strokeRect(
        centerX - docWidth / 2,
        centerY - docHeight / 2,
        docWidth,
        docHeight
      );

      // Document lines (text simulation)
      const lineCount = 8;
      const lineSpacing = docHeight / (lineCount + 2);
      const startY = centerY - docHeight / 2 + lineSpacing;

      ctx.strokeStyle = neutralColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.6;

      for (let i = 0; i < lineCount; i++) {
        const y = startY + i * lineSpacing;
        const lineLength = docWidth * (0.7 + Math.sin(time * 0.01 + i) * 0.1);
        ctx.beginPath();
        ctx.moveTo(centerX - lineLength / 2, y);
        ctx.lineTo(centerX + lineLength / 2, y);
        ctx.stroke();
      }

      // Signature area
      const signatureY = centerY + docHeight / 2 - lineSpacing;
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.moveTo(centerX - docWidth / 3, signatureY);
      ctx.quadraticCurveTo(
        centerX,
        signatureY - 10,
        centerX + docWidth / 3,
        signatureY
      );
      ctx.stroke();
    };

    // Contract binding
    const drawContractBinding = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const bindingRadius = canvasSize * 0.12;

      // Binding rings
      const ringCount = 3;
      for (let i = 0; i < ringCount; i++) {
        const ringRadius = bindingRadius + i * 8;
        const pulse = Math.sin(time * 0.03 + i * 0.3) * 0.3 + 0.7;

        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.4 * pulse;
        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY - canvasSize * 0.3,
          ringRadius,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // Binding clips
      for (let i = 0; i < 2; i++) {
        const x = centerX + (i - 0.5) * bindingRadius * 1.5;
        const y = centerY - canvasSize * 0.3;

        ctx.fillStyle = neutralColor;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(x - 3, y - bindingRadius - 5, 6, 10);
      }
    };

    // Policy compliance
    const drawPolicyCompliance = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const shieldRadius = canvasSize * 0.15;

      // Compliance shield
      ctx.fillStyle = `${accentColor}20`;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(
        centerX + canvasSize * 0.3,
        centerY - canvasSize * 0.2,
        shieldRadius,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      ctx.stroke();

      // Checkmark inside shield
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(
        centerX + canvasSize * 0.3 - shieldRadius / 3,
        centerY - canvasSize * 0.2
      );
      ctx.lineTo(
        centerX + canvasSize * 0.3,
        centerY - canvasSize * 0.2 + shieldRadius / 3
      );
      ctx.lineTo(
        centerX + canvasSize * 0.3 + shieldRadius / 3,
        centerY - canvasSize * 0.2 - shieldRadius / 3
      );
      ctx.stroke();
    };

    // Legal text particles
    const drawLegalTextParticles = () => {
      const particleCount = 12;
      ctx.fillStyle = neutralColor;
      ctx.globalAlpha = 0.3;

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + time * 0.01;
        const radius = canvasSize * 0.35;
        const x = canvasSize / 2 + Math.cos(angle) * radius;
        const y = canvasSize / 2 + Math.sin(angle) * radius;

        ctx.font = `${canvasSize / 20}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const texts = ["§", "¶", "©", "®", "™"];
        const text = texts[i % texts.length];
        ctx.fillText(text, x, y);
      }
    };

    // Floating legal icons
    const drawFloatingLegalIcons = () => {
      const iconCount = 6;
      ctx.fillStyle = secondaryColor;
      ctx.globalAlpha = 0.4;

      for (let i = 0; i < iconCount; i++) {
        const angle = (i / iconCount) * Math.PI * 2 + time * 0.005;
        const radius = canvasSize * 0.25;
        const x = canvasSize / 2 + Math.cos(angle) * radius;
        const y = canvasSize / 2 + Math.sin(angle) * radius;

        const iconSize = canvasSize / 25;
        ctx.fillRect(x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
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
          drawLegalDocument();
          drawLegalTextParticles();
          break;
        case "agreement":
          drawContractBinding();
          drawFloatingLegalIcons();
          break;
        case "contract":
          drawLegalDocument();
          drawContractBinding();
          drawPolicyCompliance();
          break;
        case "policy":
          drawPolicyCompliance();
          drawLegalTextParticles();
          drawFloatingLegalIcons();
          break;
        default:
          drawLegalDocument();
          drawLegalTextParticles();
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
