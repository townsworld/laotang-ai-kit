"use client";

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function ShufflingDeck() {
  return (
    <div className="text-center py-20 animate-fade-in">
      {/* Card Deck Animation */}
      <div className="relative w-48 h-64 mx-auto mb-12">
        {/* Multiple stacked cards */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-xl border-4 border-amber-400 bg-[#1a0b2e] overflow-hidden shadow-2xl"
            style={{
              transform: `translateX(${i * 2}px) translateY(${i * 2}px) rotate(${(i - 2) * 2}deg)`,
              animation: `shuffle 2s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
              zIndex: 5 - i,
            }}
          >
            {/* Mystical Background Pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900"></div>
            </div>
            
            {/* Center Symbol */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles 
                className="w-12 h-12 text-amber-300 animate-pulse" 
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            </div>
            
            {/* Decorative Frame */}
            <div className="absolute inset-3 rounded-lg border border-amber-400/30"></div>
            
            {/* Shine Effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
              style={{
                animation: 'shine 3s ease-in-out infinite',
                animationDelay: `${i * 0.3}s`,
              }}
            />
          </div>
        ))}
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-amber-500/20 rounded-xl blur-3xl animate-pulse"></div>
      </div>

      {/* Text */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-amber-300 animate-pulse">正在洗牌...</h2>
        <p className="text-purple-200">请在心中默念你的问题三次</p>
      </div>

      <style jsx>{`
        @keyframes shuffle {
          0%, 100% {
            transform: translateX(0px) translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateX(-20px) translateY(-10px) rotate(-5deg);
          }
          75% {
            transform: translateX(20px) translateY(-10px) rotate(5deg);
          }
        }
        
        @keyframes shine {
          0%, 100% {
            opacity: 0;
            transform: translateX(-100%) rotate(45deg);
          }
          50% {
            opacity: 1;
            transform: translateX(100%) rotate(45deg);
          }
        }
      `}</style>
    </div>
  );
}

