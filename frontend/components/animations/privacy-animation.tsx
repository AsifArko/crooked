"use client";

import { useEffect, useRef } from "react";

interface PrivacyAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  theme?: "protection" | "encryption" | "compliance" | "security";
}

export function PrivacyAnimation({
  className = "",
  size = "md",
  theme = "protection",
}: PrivacyAnimationProps) {
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

    // Grey-offwhite color palette
    const primaryColor = "#6b7280"; // gray-500 - main elements
    const secondaryColor = "#9ca3af"; // gray-400 - secondary elements
    const accentColor = "#d1d5db"; // gray-300 - accents
    const warningColor = "#ef4444"; // red-500 - alerts and threats
    const neutralColor = "#374151"; // gray-700 - text and borders
    const lightColor = "#f9fafb"; // gray-50 - backgrounds

    // Shield protection system
    const drawShieldProtection = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const shieldRadius = canvasSize * 0.25;

      // Shield background
      ctx.fillStyle = lightColor;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(centerX, centerY, shieldRadius, 0, Math.PI * 2);
      ctx.fill();

      // Shield border
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.8;
      ctx.stroke();

      // Shield inner glow
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        shieldRadius
      );
      gradient.addColorStop(0, `${primaryColor}20`);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.6;
      ctx.fill();

      // Protection rings
      const ringCount = 3;
      for (let i = 0; i < ringCount; i++) {
        const ringRadius = shieldRadius + (i + 1) * 15;
        const pulse = Math.sin(time * 0.02 + i * 0.5) * 0.3 + 0.7;

        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3 * pulse;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    // Data encryption visualization
    const drawDataEncryption = () => {
      const dataPoints = [];
      const pointCount = 12;

      for (let i = 0; i < pointCount; i++) {
        const angle = (i / pointCount) * Math.PI * 2;
        const radius = canvasSize * 0.3;
        const x = canvasSize / 2 + Math.cos(angle) * radius;
        const y = canvasSize / 2 + Math.sin(angle) * radius;
        dataPoints.push({ x, y, angle, encrypted: i % 2 === 0 });
      }

      // Draw data connections
      ctx.strokeStyle = neutralColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;
      for (let i = 0; i < dataPoints.length; i++) {
        const current = dataPoints[i];
        const next = dataPoints[(i + 1) % dataPoints.length];
        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }

      // Draw data points
      dataPoints.forEach((point, i) => {
        const pulse = Math.sin(time * 0.03 + i) * 0.3 + 0.7;
        const color = point.encrypted ? accentColor : warningColor;
        const size = point.encrypted ? 6 : 4;

        ctx.fillStyle = color;
        ctx.globalAlpha = pulse;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Encryption lock icon for encrypted points
        if (point.encrypted) {
          ctx.fillStyle = lightColor;
          ctx.globalAlpha = 0.9;
          ctx.font = `${canvasSize / 40}px system-ui, -apple-system, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("🔒", point.x, point.y);
        }
      });

      // Central encryption hub
      const hubX = canvasSize / 2;
      const hubY = canvasSize / 2;
      const hubRadius = canvasSize * 0.08;

      ctx.fillStyle = secondaryColor;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(hubX, hubY, hubRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = lightColor;
      ctx.globalAlpha = 0.9;
      ctx.font = `${canvasSize / 20}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🔐", hubX, hubY);
    };

    // Privacy compliance checklist
    const drawComplianceChecklist = () => {
      const checklistItems = [
        {
          text: "GDPR",
          x: canvasSize * 0.2,
          y: canvasSize * 0.3,
          status: "compliant",
        },
        {
          text: "CCPA",
          x: canvasSize * 0.8,
          y: canvasSize * 0.4,
          status: "compliant",
        },
        {
          text: "HIPAA",
          x: canvasSize * 0.3,
          y: canvasSize * 0.7,
          status: "compliant",
        },
        {
          text: "SOC 2",
          x: canvasSize * 0.7,
          y: canvasSize * 0.8,
          status: "compliant",
        },
      ];

      checklistItems.forEach((item, i) => {
        const pulse = Math.sin(time * 0.02 + i) * 0.2 + 0.8;
        const boxSize = canvasSize / 20;

        // Checkbox background
        ctx.fillStyle = lightColor;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(
          item.x - boxSize,
          item.y - boxSize,
          boxSize * 2,
          boxSize * 2
        );

        // Checkbox border
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = pulse;
        ctx.strokeRect(
          item.x - boxSize,
          item.y - boxSize,
          boxSize * 2,
          boxSize * 2
        );

        // Checkmark
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(item.x - boxSize * 0.5, item.y);
        ctx.lineTo(item.x, item.y + boxSize * 0.5);
        ctx.lineTo(item.x + boxSize * 0.5, item.y - boxSize * 0.5);
        ctx.stroke();

        // Text label
        ctx.fillStyle = neutralColor;
        ctx.globalAlpha = 0.8;
        ctx.font = `${canvasSize / 35}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.text, item.x, item.y + boxSize * 2);
      });
    };

    // Security monitoring system
    const drawSecurityMonitoring = () => {
      // Security camera
      const cameraX = canvasSize * 0.2;
      const cameraY = canvasSize * 0.2;
      const cameraSize = canvasSize / 15;

      ctx.fillStyle = neutralColor;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(cameraX, cameraY, cameraSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = warningColor;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(cameraX, cameraY, cameraSize * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Monitoring waves
      const waveCount = 3;
      for (let i = 0; i < waveCount; i++) {
        const waveRadius = cameraSize + (i + 1) * 20;
        const pulse = Math.sin(time * 0.03 + i * 0.3) * 0.2 + 0.8;

        ctx.strokeStyle = warningColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.2 * pulse;
        ctx.beginPath();
        ctx.arc(cameraX, cameraY, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Security alerts
      const alerts = [
        { x: canvasSize * 0.8, y: canvasSize * 0.3, type: "threat" },
        { x: canvasSize * 0.7, y: canvasSize * 0.7, type: "warning" },
        { x: canvasSize * 0.3, y: canvasSize * 0.8, type: "info" },
      ];

      alerts.forEach((alert, i) => {
        const pulse = Math.sin(time * 0.05 + i) * 0.4 + 0.6;
        const color =
          alert.type === "threat"
            ? warningColor
            : alert.type === "warning"
              ? "#f59e0b"
              : accentColor;

        ctx.fillStyle = color;
        ctx.globalAlpha = pulse;
        ctx.beginPath();
        ctx.arc(alert.x, alert.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Alert glow
        ctx.globalAlpha = pulse * 0.3;
        ctx.beginPath();
        ctx.arc(alert.x, alert.y, 12, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Data protection layers
    const drawDataProtectionLayers = () => {
      const layers = [
        { radius: canvasSize * 0.4, color: primaryColor, label: "Firewall" },
        {
          radius: canvasSize * 0.3,
          color: secondaryColor,
          label: "Encryption",
        },
        {
          radius: canvasSize * 0.2,
          color: accentColor,
          label: "Access Control",
        },
        { radius: canvasSize * 0.1, color: neutralColor, label: "Data" },
      ];

      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;

      layers.forEach((layer, i) => {
        const pulse = Math.sin(time * 0.02 + i * 0.5) * 0.2 + 0.8;

        // Layer ring
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.6 * pulse;
        ctx.beginPath();
        ctx.arc(centerX, centerY, layer.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Layer label
        ctx.fillStyle = layer.color;
        ctx.globalAlpha = 0.8;
        ctx.font = `${canvasSize / 40}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(layer.label, centerX, centerY - layer.radius - 10);
      });
    };

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // Draw background grid
      ctx.strokeStyle = "rgba(55, 65, 81, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvasSize; i += 30) {
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
        case "protection":
          drawShieldProtection();
          drawDataProtectionLayers();
          break;
        case "encryption":
          drawDataEncryption();
          drawShieldProtection();
          break;
        case "compliance":
          drawComplianceChecklist();
          drawDataProtectionLayers();
          break;
        case "security":
          drawSecurityMonitoring();
          drawShieldProtection();
          drawDataEncryption();
          break;
        default:
          drawShieldProtection();
          drawDataProtectionLayers();
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
