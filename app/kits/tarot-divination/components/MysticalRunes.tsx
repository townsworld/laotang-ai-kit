"use client";

import React, { useEffect, useState } from 'react';

const MYSTICAL_SYMBOLS = [
  '☽', '☾', '☼', '✦', '✧', '✨', '☆', '★',
  '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓',
  '⚹', '⚶', '⚷', '⚸', '⚺'
];

interface Rune {
  id: number;
  symbol: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  animationDelay: number;
}

export default function MysticalRunes() {
  const [runes, setRunes] = useState<Rune[]>([]);

  useEffect(() => {
    const newRunes: Rune[] = [];
    const runeCount = 15;

    for (let i = 0; i < runeCount; i++) {
      newRunes.push({
        id: i,
        symbol: MYSTICAL_SYMBOLS[Math.floor(Math.random() * MYSTICAL_SYMBOLS.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 40,
        opacity: 0.05 + Math.random() * 0.1,
        rotation: Math.random() * 360,
        animationDelay: Math.random() * 5,
      });
    }

    setRunes(newRunes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {runes.map((rune) => (
        <div
          key={rune.id}
          className="absolute text-purple-300"
          style={{
            left: `${rune.x}%`,
            top: `${rune.y}%`,
            fontSize: `${rune.size}px`,
            opacity: rune.opacity,
            transform: `rotate(${rune.rotation}deg)`,
            animation: `breathe 8s ease-in-out infinite`,
            animationDelay: `${rune.animationDelay}s`,
          }}
        >
          {rune.symbol}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.05; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.15; transform: scale(1.1) rotate(10deg); }
        }
      `}</style>
    </div>
  );
}

