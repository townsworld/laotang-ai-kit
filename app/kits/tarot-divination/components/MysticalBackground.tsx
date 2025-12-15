"use client";

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  layer: number;
}

export default function MysticalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create stars
    const stars: Star[] = [];
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
      const layer = Math.random() < 0.5 ? 1 : Math.random() < 0.7 ? 2 : 3;
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: layer === 1 ? 1 : layer === 2 ? 1.5 : 2,
        speedX: (Math.random() - 0.5) * (layer * 0.1),
        speedY: (Math.random() - 0.5) * (layer * 0.1),
        opacity: Math.random() * 0.5 + 0.3,
        layer,
      });
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 5, 25, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach((star) => {
        // Update position
        star.x += star.speedX;
        star.y += star.speedY;

        // Wrap around
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Twinkle effect
        star.opacity = Math.sin(Date.now() * 0.001 * star.layer) * 0.3 + 0.6;

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        
        // Color based on layer
        const colors = [
          `rgba(147, 197, 253, ${star.opacity})`, // Blue for layer 1
          `rgba(196, 181, 253, ${star.opacity})`, // Purple for layer 2
          `rgba(251, 207, 232, ${star.opacity})`, // Pink for layer 3
        ];
        ctx.fillStyle = colors[star.layer - 1];
        ctx.fill();

        // Add glow for larger stars
        if (star.layer === 3) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = colors[star.layer - 1];
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

