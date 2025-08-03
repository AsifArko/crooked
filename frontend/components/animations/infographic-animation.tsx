"use client";

import { useEffect, useRef } from "react";

interface InfographicAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  theme?: "data" | "analytics" | "research" | "education";
}

export function InfographicAnimation({
  className = "",
  size = "md",
  theme = "data",
}: InfographicAnimationProps) {
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

    // Colors - Grayscale
    const primaryColor = "#6b7280"; // gray-500
    const secondaryColor = "#9ca3af"; // gray-400
    const accentColor = "#d1d5db"; // gray-300
    const warningColor = "#f3f4f6"; // gray-100

    // Data Visualization Components
    const drawBarChart = () => {
      const chartX = canvasSize * 0.1;
      const chartY = canvasSize * 0.7;
      const chartWidth = canvasSize * 0.3;
      const chartHeight = canvasSize * 0.2;

      // Chart background
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(chartX, chartY, chartWidth, chartHeight);

      // Chart border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.strokeRect(chartX, chartY, chartWidth, chartHeight);

      // Bars
      const barCount = 5;
      const barWidth = (chartWidth / barCount) * 0.6;
      const barSpacing = (chartWidth / barCount) * 0.4;

      for (let i = 0; i < barCount; i++) {
        const barX = chartX + i * (barWidth + barSpacing) + barSpacing / 2;
        const barHeight =
          (Math.sin(time * 0.02 + i) * 0.3 + 0.7) * chartHeight * 0.8;
        const barY = chartY + chartHeight - barHeight;

        // Bar gradient
        const gradient = ctx.createLinearGradient(
          barX,
          barY,
          barX,
          barY + barHeight
        );
        gradient.addColorStop(0, primaryColor);
        gradient.addColorStop(1, secondaryColor);

        ctx.fillStyle = gradient;
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Bar border
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
      }
    };

    const drawPieChart = () => {
      const centerX = canvasSize * 0.8;
      const centerY = canvasSize * 0.3;
      const radius = canvasSize * 0.15;

      const segments = [
        { value: 0.4, color: primaryColor },
        { value: 0.25, color: secondaryColor },
        { value: 0.2, color: accentColor },
        { value: 0.15, color: secondaryColor },
      ];

      let currentAngle = 0;
      segments.forEach((segment, i) => {
        const segmentAngle = segment.value * Math.PI * 2;
        const pulse = Math.sin(time * 0.03 + i) * 0.1 + 0.9;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(currentAngle);

        ctx.fillStyle = segment.color;
        ctx.globalAlpha = 0.8 * pulse;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, 0, segmentAngle);
        ctx.closePath();
        ctx.fill();

        // Segment border
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
        currentAngle += segmentAngle;
      });

      // Center circle
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawLineChart = () => {
      const chartX = canvasSize * 0.1;
      const chartY = canvasSize * 0.2;
      const chartWidth = canvasSize * 0.4;
      const chartHeight = canvasSize * 0.25;

      // Chart background
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.fillRect(chartX, chartY, chartWidth, chartHeight);

      // Grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = chartY + (i / 4) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(chartX, y);
        ctx.lineTo(chartX + chartWidth, y);
        ctx.stroke();
      }

      // Data points and line
      const points = [];
      const pointCount = 8;
      for (let i = 0; i < pointCount; i++) {
        const x = chartX + (i / (pointCount - 1)) * chartWidth;
        const baseY = chartY + chartHeight * 0.5;
        const variation =
          Math.sin(time * 0.01 + i * 0.5) * 0.3 +
          Math.sin(time * 0.02 + i * 0.3) * 0.2;
        const y = baseY - variation * chartHeight * 0.4;
        points.push({ x, y });
      }

      // Draw line
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      // Draw data points
      points.forEach((point, i) => {
        const pulse = Math.sin(time * 0.05 + i) * 0.3 + 0.7;
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = pulse;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.globalAlpha = pulse * 0.3;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawDataFlow = () => {
      // Central hub
      const hubX = canvasSize / 2;
      const hubY = canvasSize / 2;
      const hubRadius = canvasSize * 0.08;

      // Hub pulse
      const hubPulse = Math.sin(time * 0.03) * 0.2 + 0.8;
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = hubPulse;
      ctx.beginPath();
      ctx.arc(hubX, hubY, hubRadius, 0, Math.PI * 2);
      ctx.fill();

      // Hub border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      ctx.stroke();

      // Data nodes
      const nodes = [
        { x: canvasSize * 0.2, y: canvasSize * 0.2, color: secondaryColor },
        { x: canvasSize * 0.8, y: canvasSize * 0.2, color: accentColor },
        { x: canvasSize * 0.2, y: canvasSize * 0.8, color: secondaryColor },
        { x: canvasSize * 0.8, y: canvasSize * 0.8, color: warningColor },
      ];

      // Draw connections
      ctx.strokeStyle = "rgba(156, 163, 175, 0.3)";
      ctx.lineWidth = 2;
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.moveTo(hubX, hubY);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        const pulse = Math.sin(time * 0.04 + i) * 0.3 + 0.7;
        ctx.fillStyle = node.color;
        ctx.globalAlpha = pulse;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Node glow
        ctx.globalAlpha = pulse * 0.4;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 12, 0, Math.PI * 2);
        ctx.fill();
      });

      // Data packets flowing
      const dataPackets = [];
      for (let i = 0; i < 8; i++) {
        const startNode = nodes[Math.floor(Math.random() * nodes.length)];
        const progress = (time * 0.02 + i * 0.5) % 1;

        dataPackets.push({
          x: startNode.x + (hubX - startNode.x) * progress,
          y: startNode.y + (hubY - startNode.y) * progress,
          color: startNode.color,
          life: 1 - progress,
        });
      }

      dataPackets.forEach(packet => {
        if (packet.life > 0) {
          ctx.fillStyle = packet.color;
          ctx.globalAlpha = packet.life;
          ctx.beginPath();
          ctx.arc(packet.x, packet.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const drawAnalyticsDashboard = () => {
      // Dashboard background
      ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
      ctx.fillRect(
        canvasSize * 0.05,
        canvasSize * 0.05,
        canvasSize * 0.9,
        canvasSize * 0.9
      );

      // Dashboard border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        canvasSize * 0.05,
        canvasSize * 0.05,
        canvasSize * 0.9,
        canvasSize * 0.9
      );

      // KPI cards
      const kpis = [
        {
          x: canvasSize * 0.15,
          y: canvasSize * 0.15,
          value: "2.4K",
          label: "Users",
          color: primaryColor,
        },
        {
          x: canvasSize * 0.45,
          y: canvasSize * 0.15,
          value: "89%",
          label: "Uptime",
          color: secondaryColor,
        },
        {
          x: canvasSize * 0.75,
          y: canvasSize * 0.15,
          value: "156",
          label: "Courses",
          color: accentColor,
        },
      ];

      kpis.forEach((kpi, i) => {
        const pulse = Math.sin(time * 0.02 + i) * 0.1 + 0.9;

        // Card background
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.fillRect(kpi.x - 30, kpi.y - 20, 60, 40);

        // Card border
        ctx.strokeStyle = kpi.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        ctx.strokeRect(kpi.x - 30, kpi.y - 20, 60, 40);

        // Value
        ctx.fillStyle = kpi.color;
        ctx.globalAlpha = pulse;
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(kpi.value, kpi.x, kpi.y - 5);

        // Label
        ctx.globalAlpha = 0.7;
        ctx.font = "10px Arial";
        ctx.fillText(kpi.label, kpi.x, kpi.y + 10);
      });
    };

    const drawResearchVisualization = () => {
      // Molecular structure
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;

      // Atoms
      const atoms = [
        { x: centerX, y: centerY, connections: [1, 2, 3] },
        { x: centerX + 40, y: centerY - 20, connections: [0, 2] },
        { x: centerX - 20, y: centerY + 35, connections: [0, 1, 3] },
        { x: centerX + 20, y: centerY + 35, connections: [0, 2] },
      ];

      // Draw bonds
      ctx.strokeStyle = "rgba(156, 163, 175, 0.4)";
      ctx.lineWidth = 2;
      atoms.forEach((atom, i) => {
        atom.connections.forEach(targetIndex => {
          if (targetIndex > i) {
            const target = atoms[targetIndex];
            ctx.beginPath();
            ctx.moveTo(atom.x, atom.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
          }
        });
      });

      // Draw atoms
      atoms.forEach((atom, i) => {
        const pulse = Math.sin(time * 0.03 + i) * 0.3 + 0.7;
        ctx.fillStyle = i % 2 === 0 ? primaryColor : secondaryColor;
        ctx.globalAlpha = pulse;
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Atom glow
        ctx.globalAlpha = pulse * 0.4;
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, 16, 0, Math.PI * 2);
        ctx.fill();
      });

      // Research data points
      const dataPoints = [];
      for (let i = 0; i < 15; i++) {
        dataPoints.push({
          x: centerX + (Math.random() - 0.5) * canvasSize * 0.6,
          y: centerY + (Math.random() - 0.5) * canvasSize * 0.6,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random(),
          maxLife: 1,
        });
      }

      dataPoints.forEach(point => {
        point.x += point.vx;
        point.y += point.vy;
        point.life -= 0.005;

        if (point.life > 0) {
          const alpha = point.life / point.maxLife;
          ctx.fillStyle = `rgba(209, 213, 219, ${alpha})`;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const drawEducationModules = () => {
      // Module grid
      const moduleSize = canvasSize * 0.15;
      const modules = [
        { x: canvasSize * 0.2, y: canvasSize * 0.2, status: "completed" },
        { x: canvasSize * 0.4, y: canvasSize * 0.2, status: "in-progress" },
        { x: canvasSize * 0.6, y: canvasSize * 0.2, status: "locked" },
        { x: canvasSize * 0.2, y: canvasSize * 0.4, status: "completed" },
        { x: canvasSize * 0.4, y: canvasSize * 0.4, status: "completed" },
        { x: canvasSize * 0.6, y: canvasSize * 0.4, status: "in-progress" },
        { x: canvasSize * 0.2, y: canvasSize * 0.6, status: "locked" },
        { x: canvasSize * 0.4, y: canvasSize * 0.6, status: "locked" },
        { x: canvasSize * 0.6, y: canvasSize * 0.6, status: "locked" },
      ];

      modules.forEach((module, i) => {
        const pulse = Math.sin(time * 0.02 + i) * 0.2 + 0.8;

        // Module background
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.fillRect(
          module.x - moduleSize / 2,
          module.y - moduleSize / 2,
          moduleSize,
          moduleSize
        );

        // Module border
        let borderColor: string;
        switch (module.status) {
          case "completed":
            borderColor = secondaryColor;
            break;
          case "in-progress":
            borderColor = warningColor;
            break;
          case "locked":
            borderColor = "rgba(255, 255, 255, 0.2)";
            break;
          default:
            borderColor = "rgba(255, 255, 255, 0.2)";
            break;
        }

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = module.status === "in-progress" ? pulse : 0.6;
        ctx.strokeRect(
          module.x - moduleSize / 2,
          module.y - moduleSize / 2,
          moduleSize,
          moduleSize
        );

        // Module icon
        ctx.fillStyle = borderColor;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(module.x, module.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Progress indicator
      const progress = 0.44; // 4/9 modules completed
      const progressBarX = canvasSize * 0.1;
      const progressBarY = canvasSize * 0.85;
      const progressBarWidth = canvasSize * 0.8;
      const progressBarHeight = 6;

      // Progress background
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(
        progressBarX,
        progressBarY,
        progressBarWidth,
        progressBarHeight
      );

      // Progress fill
      const gradient = ctx.createLinearGradient(
        progressBarX,
        progressBarY,
        progressBarX + progressBarWidth,
        progressBarY
      );
      gradient.addColorStop(0, secondaryColor);
      gradient.addColorStop(1, accentColor);

      ctx.fillStyle = gradient;
      ctx.fillRect(
        progressBarX,
        progressBarY,
        progressBarWidth * progress,
        progressBarHeight
      );

      // Progress text
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        `${Math.round(progress * 100)}% Complete`,
        canvasSize / 2,
        progressBarY - 10
      );
    };

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // Draw background grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
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
        case "data":
          drawBarChart();
          drawPieChart();
          drawLineChart();
          drawDataFlow();
          break;
        case "analytics":
          drawAnalyticsDashboard();
          drawBarChart();
          drawPieChart();
          break;
        case "research":
          drawResearchVisualization();
          drawLineChart();
          drawDataFlow();
          break;
        case "education":
          drawEducationModules();
          drawPieChart();
          drawDataFlow();
          break;
        default:
          drawBarChart();
          drawPieChart();
          drawLineChart();
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
