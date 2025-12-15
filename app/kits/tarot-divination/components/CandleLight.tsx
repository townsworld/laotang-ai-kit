"use client";

import React, { useEffect, useState } from 'react';

interface Candle {
  id: number;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  phase: number;
}

export default function CandleLight() {
  const [candles, setCandles] = useState<Candle[]>([]);

  useEffect(() => {
    // Create candles at corners and sides
    const positions = [
      { x: 5, y: 10 }, // Top left
      { x: 95, y: 10 }, // Top right
      { x: 5, y: 90 }, // Bottom left
      { x: 95, y: 90 }, // Bottom right
      { x: 50, y: 5 }, // Top center
      { x: 50, y: 95 }, // Bottom center
    ];

    const newCandles: Candle[] = positions.map((pos, i) => ({
      id: i,
      x: pos.x,
      y: pos.y,
      baseX: pos.x,
      baseY: pos.y,
      size: 60 + Math.random() * 40,
      phase: Math.random() * Math.PI * 2,
    }));

    setCandles(newCandles);

    // Animate candles
    const interval = setInterval(() => {
      setCandles((prev) =>
        prev.map((candle) => {
          const time = Date.now() * 0.001;
          const flickerX = Math.sin(time * 2 + candle.phase) * 2;
          const flickerY = Math.cos(time * 3 + candle.phase) * 3;
          const flickerSize = Math.sin(time * 4 + candle.phase) * 10;

          return {
            ...candle,
            x: candle.baseX + flickerX,
            y: candle.baseY + flickerY,
            size: 60 + flickerSize + Math.random() * 20,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>
      {candles.map((candle) => (
        <div
          key={candle.id}
          className="absolute rounded-full"
          style={{
            left: `${candle.x}%`,
            top: `${candle.y}%`,
            width: `${candle.size}px`,
            height: `${candle.size}px`,
            background: `radial-gradient(circle, 
              rgba(251, 191, 36, 0.3) 0%, 
              rgba(251, 146, 60, 0.2) 30%, 
              rgba(251, 113, 133, 0.1) 60%, 
              transparent 100%)`,
            filter: 'blur(20px)',
            transform: 'translate(-50%, -50%)',
            animation: `flicker ${2 + Math.random()}s ease-in-out infinite`,
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes flicker {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}

