"use client";

import { useEffect, useRef } from "react";

interface ContactAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ContactAnimation({
  className = "",
  size = "md",
}: ContactAnimationProps) {
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

    // Sophisticated grayscale palette
    const primaryColor = "#1f2937"; // gray-800
    const secondaryColor = "#374151"; // gray-700
    const accentColor = "#6b7280"; // gray-500
    const lightColor = "#9ca3af"; // gray-400
    const highlightColor = "#f3f4f6"; // gray-100
    const whiteColor = "#ffffff"; // white

    // Communication devices
    const devices = [
      { x: canvasSize * 0.25, y: canvasSize * 0.3, type: "phone", pulse: 0 },
      {
        x: canvasSize * 0.75,
        y: canvasSize * 0.25,
        type: "laptop",
        pulse: 0.3,
      },
      { x: canvasSize * 0.2, y: canvasSize * 0.7, type: "tablet", pulse: 0.6 },
      {
        x: canvasSize * 0.8,
        y: canvasSize * 0.75,
        type: "desktop",
        pulse: 0.9,
      },
    ];

    // Draw communication device
    const drawDevice = (device: {
      x: number;
      y: number;
      type: string;
      pulse: number;
    }) => {
      const pulse = Math.sin(time * 0.04 + device.pulse * Math.PI) * 0.2 + 0.8;
      const size = canvasSize / 16;

      // Device background
      ctx.fillStyle = highlightColor;
      ctx.globalAlpha = 0.9 * pulse;
      ctx.fillRect(device.x - size, device.y - size, size * 2, size * 2);

      // Device border
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.7;
      ctx.strokeRect(device.x - size, device.y - size, size * 2, size * 2);

      // Device icon
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = 0.9;
      ctx.font = `${canvasSize / 28}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      switch (device.type) {
        case "phone":
          ctx.fillText("📱", device.x, device.y);
          break;
        case "laptop":
          ctx.fillText("💻", device.x, device.y);
          break;
        case "tablet":
          ctx.fillText("📱", device.x, device.y);
          break;
        case "desktop":
          ctx.fillText("🖥", device.x, device.y);
          break;
      }
    };

    // Message bubbles with conversation flow
    const messages = [
      {
        x: canvasSize * 0.35,
        y: canvasSize * 0.4,
        text: "Hi",
        sender: "user",
        delay: 0,
      },
      {
        x: canvasSize * 0.65,
        y: canvasSize * 0.45,
        text: "Hello!",
        sender: "agent",
        delay: 20,
      },
      {
        x: canvasSize * 0.4,
        y: canvasSize * 0.55,
        text: "Need help",
        sender: "user",
        delay: 40,
      },
      {
        x: canvasSize * 0.6,
        y: canvasSize * 0.6,
        text: "Sure!",
        sender: "agent",
        delay: 60,
      },
    ];

    const drawMessageBubble = (message: {
      x: number;
      y: number;
      text: string;
      sender: string;
      delay: number;
    }) => {
      const pulse = Math.sin((time - message.delay) * 0.05) * 0.15 + 0.85;
      const isUser = message.sender === "user";
      const bubbleWidth = canvasSize / 6;
      const bubbleHeight = canvasSize / 12;

      // Message bubble
      ctx.fillStyle = isUser ? secondaryColor : highlightColor;
      ctx.globalAlpha = 0.8 * pulse;
      ctx.beginPath();
      ctx.roundRect(
        message.x - bubbleWidth / 2,
        message.y - bubbleHeight / 2,
        bubbleWidth,
        bubbleHeight,
        bubbleHeight / 3
      );
      ctx.fill();

      // Message border
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.roundRect(
        message.x - bubbleWidth / 2,
        message.y - bubbleHeight / 2,
        bubbleWidth,
        bubbleHeight,
        bubbleHeight / 3
      );
      ctx.stroke();

      // Message text
      ctx.fillStyle = isUser ? whiteColor : primaryColor;
      ctx.globalAlpha = 0.9;
      ctx.font = `${canvasSize / 32}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(message.text, message.x, message.y);
    };

    // Signal waves emanating from devices
    const drawSignalWaves = () => {
      devices.forEach(device => {
        const waveCount = 2;
        for (let i = 0; i < waveCount; i++) {
          const waveRadius =
            canvasSize / 8 +
            i * 8 +
            Math.sin(time * 0.03 + device.pulse * Math.PI) * 3;
          const pulse = Math.sin(time * 0.04 + i * 0.5) * 0.2 + 0.8;

          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 0.8;
          ctx.globalAlpha = 0.3 * pulse;
          ctx.beginPath();
          ctx.arc(device.x, device.y, waveRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    };

    // Connection lines between devices
    const drawDeviceConnections = () => {
      ctx.strokeStyle = lightColor;
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = 0.4;

      for (let i = 0; i < devices.length; i++) {
        for (let j = i + 1; j < devices.length; j++) {
          const distance = Math.sqrt(
            Math.pow(devices[i].x - devices[j].x, 2) +
              Math.pow(devices[i].y - devices[j].y, 2)
          );

          if (distance < canvasSize * 0.7) {
            const pulse = Math.sin(time * 0.02 + i + j) * 0.2 + 0.8;
            ctx.globalAlpha = 0.4 * pulse;
            ctx.beginPath();
            ctx.moveTo(devices[i].x, devices[i].y);
            ctx.lineTo(devices[j].x, devices[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Central communication hub
    const drawCommunicationHub = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const hubSize = canvasSize / 20;

      // Hub background
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(centerX, centerY, hubSize, 0, Math.PI * 2);
      ctx.fill();

      // Hub border
      ctx.strokeStyle = whiteColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, hubSize, 0, Math.PI * 2);
      ctx.stroke();

      // Hub icon
      ctx.fillStyle = whiteColor;
      ctx.globalAlpha = 0.9;
      ctx.font = `${canvasSize / 24}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("●", centerX, centerY);

      // Pulsing rings around hub
      const ringCount = 3;
      for (let i = 0; i < ringCount; i++) {
        const ringRadius = hubSize + (i + 1) * 6;
        const pulse = Math.sin(time * 0.04 + i * 0.3) * 0.2 + 0.8;

        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = 0.25 * pulse;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    // Data packets flowing between devices
    const dataPackets: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      targetX: number;
      targetY: number;
    }> = [];

    const createDataPacket = () => {
      const sourceDevice = devices[Math.floor(Math.random() * devices.length)];
      const targetDevice = devices[Math.floor(Math.random() * devices.length)];

      if (sourceDevice !== targetDevice) {
        const dx = targetDevice.x - sourceDevice.x;
        const dy = targetDevice.y - sourceDevice.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        dataPackets.push({
          x: sourceDevice.x,
          y: sourceDevice.y,
          vx: (dx / distance) * 0.8,
          vy: (dy / distance) * 0.8,
          life: 1,
          maxLife: 1,
          targetX: targetDevice.x,
          targetY: targetDevice.y,
        });
      }
    };

    const updateDataPackets = () => {
      for (let i = dataPackets.length - 1; i >= 0; i--) {
        const packet = dataPackets[i];
        packet.x += packet.vx;
        packet.y += packet.vy;
        packet.life -= 0.01;

        // Remove packets that reach target or expire
        const distanceToTarget = Math.sqrt(
          Math.pow(packet.x - packet.targetX, 2) +
            Math.pow(packet.y - packet.targetY, 2)
        );

        if (packet.life <= 0 || distanceToTarget < 5) {
          dataPackets.splice(i, 1);
        }
      }
    };

    const drawDataPackets = () => {
      dataPackets.forEach(packet => {
        const pulse = Math.sin(time * 0.1) * 0.2 + 0.8;

        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.8 * packet.life * pulse;
        ctx.beginPath();
        ctx.arc(packet.x, packet.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Packet trail
        ctx.globalAlpha = 0.3 * packet.life;
        ctx.beginPath();
        ctx.arc(
          packet.x - packet.vx * 3,
          packet.y - packet.vy * 3,
          1,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
    };

    // Contact form representation
    const drawContactForm = () => {
      const formX = canvasSize * 0.5;
      const formY = canvasSize * 0.85;
      const formWidth = canvasSize / 6;
      const formHeight = canvasSize / 10;

      // Form background
      ctx.fillStyle = highlightColor;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(
        formX - formWidth,
        formY - formHeight,
        formWidth * 2,
        formHeight * 2
      );

      // Form border
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.6;
      ctx.strokeRect(
        formX - formWidth,
        formY - formHeight,
        formWidth * 2,
        formHeight * 2
      );

      // Form icon
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = 0.8;
      ctx.font = `${canvasSize / 28}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✉", formX, formY);
    };

    // Background grid pattern
    const drawBackgroundGrid = () => {
      ctx.strokeStyle = lightColor;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.1;

      const gridSize = canvasSize / 8;
      for (let i = 0; i <= 8; i++) {
        const pos = i * gridSize;
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

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // Draw background
      drawBackgroundGrid();

      // Draw signal waves
      drawSignalWaves();

      // Draw device connections
      drawDeviceConnections();

      // Update and draw data packets
      updateDataPackets();
      drawDataPackets();

      // Create new data packets occasionally
      if (Math.random() < 0.03) {
        createDataPacket();
      }

      // Draw devices
      devices.forEach(drawDevice);

      // Draw message bubbles
      messages.forEach(drawMessageBubble);

      // Draw communication hub
      drawCommunicationHub();

      // Draw contact form
      drawContactForm();

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
