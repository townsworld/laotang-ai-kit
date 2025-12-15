"use client";

import React from 'react';
import { DIVINATION_THEMES, DivinationType } from '../constants/personalization';

interface ThemeSelectorProps {
  selectedTheme: DivinationType;
  onSelectTheme: (theme: DivinationType) => void;
}

export default function ThemeSelector({ selectedTheme, onSelectTheme }: ThemeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-purple-200 mb-2">选择占卜主题</h3>
        <p className="text-sm text-purple-300/70">让塔罗牌为你指引专属领域</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {DIVINATION_THEMES.map((theme) => {
          const IconComponent = theme.icon;
          return (
            <button
              key={theme.type}
              onClick={() => onSelectTheme(theme.type)}
              className={`
                group relative p-5 rounded-2xl border-2 transition-all duration-300 text-center overflow-hidden
                ${
                  selectedTheme === theme.type
                    ? 'border-amber-400 shadow-2xl scale-105'
                    : 'border-purple-500/30 bg-black/40 hover:border-amber-400/50 hover:shadow-lg hover:scale-102'
                }
              `}
            >
              {/* Animated background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  selectedTheme === theme.type ? 'opacity-100' : ''
                }`}
              />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon container */}
                <div className={`
                  w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${theme.bgGradient}
                  border border-white/10 flex items-center justify-center
                  group-hover:scale-110 group-hover:rotate-6 transition-all duration-300
                  ${selectedTheme === theme.type ? 'scale-110 shadow-lg' : ''}
                `}>
                  <IconComponent className={`w-7 h-7 ${theme.color}`} strokeWidth={2} />
                </div>
                
                <h4 className={`font-bold mb-1 transition-colors ${theme.color}`}>
                  {theme.name}
                </h4>
                <p className="text-xs text-purple-300/70">{theme.description}</p>
              </div>
              
              {/* Selection indicator */}
              {selectedTheme === theme.type && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
                  <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

