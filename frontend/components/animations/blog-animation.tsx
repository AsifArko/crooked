"use client";

import { useEffect, useRef } from "react";

interface BlogAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BlogAnimation({
  className = "",
  size = "md",
}: BlogAnimationProps) {
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

    // Colors - grey/off-white scheme
    const primaryColor = "#6b7280"; // grey-500
    const secondaryColor = "#9ca3af"; // grey-400

    // Blog post elements
    const blogPosts = [
      {
        x: canvasSize * 0.25,
        y: canvasSize * 0.3,
        type: "article",
        title: "CI/CD",
      },
      {
        x: canvasSize * 0.75,
        y: canvasSize * 0.4,
        type: "tool",
        title: "Tools",
      },
      {
        x: canvasSize * 0.4,
        y: canvasSize * 0.7,
        type: "integration",
        title: "Sandbox",
      },
      {
        x: canvasSize * 0.8,
        y: canvasSize * 0.75,
        type: "security",
        title: "OSINT",
      },
    ];

    const drawBlogPost = (post: {
      x: number;
      y: number;
      type: string;
      title: string;
    }) => {
      const pulse = Math.sin(time * 0.03 + post.x * 0.01) * 0.3 + 0.7;
      const size = canvasSize / 16;

      // Blog post card
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = 0.8 * pulse;
      ctx.fillRect(post.x - size * 1.5, post.y - size, size * 3, size * 2);

      // Card border
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.9;
      ctx.strokeRect(post.x - size * 1.5, post.y - size, size * 3, size * 2);
    };

    // Connection lines between posts
    const drawConnections = () => {
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;

      for (let i = 0; i < blogPosts.length; i++) {
        for (let j = i + 1; j < blogPosts.length; j++) {
          const post1 = blogPosts[i];
          const post2 = blogPosts[j];
          const distance = Math.sqrt(
            Math.pow(post1.x - post2.x, 2) + Math.pow(post1.y - post2.y, 2)
          );

          if (distance < canvasSize * 0.6) {
            const pulse = Math.sin(time * 0.02 + i * 0.5) * 0.2 + 0.3;
            ctx.globalAlpha = pulse;
            ctx.beginPath();
            ctx.moveTo(post1.x, post1.y);
            ctx.lineTo(post2.x, post2.y);
            ctx.stroke();
          }
        }
      }
    };

    // Particle system for blog content
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
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
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

        if (particle.life > particle.maxLife) {
          particles.splice(i, 1);
        }
      }
    };

    const drawParticles = () => {
      ctx.fillStyle = secondaryColor;
      particles.forEach(particle => {
        const alpha = 1 - particle.life / particle.maxLife;
        ctx.globalAlpha = alpha * 0.6;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Blog hub/central content
    const drawBlogHub = () => {
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const hubSize = canvasSize / 8;

      // Hub background
      ctx.fillStyle = secondaryColor;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(centerX, centerY, hubSize, 0, Math.PI * 2);
      ctx.fill();

      // Hub border
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 1;
      ctx.stroke();

      // Content indicator
      const pulse = Math.sin(time * 0.05) * 0.3 + 0.7;
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = pulse * 0.8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, hubSize * 0.5, 0, Math.PI * 2);
      ctx.fill();
    };

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // Draw connections
      drawConnections();

      // Update and draw particles
      updateParticles();
      drawParticles();

      // Create new particles occasionally
      if (Math.random() < 0.03) {
        createParticle();
      }

      // Draw blog posts
      blogPosts.forEach(drawBlogPost);

      // Draw blog hub
      drawBlogHub();

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
