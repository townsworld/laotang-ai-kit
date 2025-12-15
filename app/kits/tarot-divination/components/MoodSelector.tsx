"use client";

import React from 'react';
import { MOODS, MoodType } from '../constants/personalization';

interface MoodSelectorProps {
  selectedMood: MoodType;
  onSelectMood: (mood: MoodType) => void;
}

export default function MoodSelector({ selectedMood, onSelectMood }: MoodSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-purple-200 mb-2">此刻，你的心情是？</h3>
        <p className="text-sm text-purple-300/70">选择最贴近你当下的情绪状态</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {MOODS.map((mood) => {
          const IconComponent = mood.icon;
          return (
            <button
              key={mood.type}
              onClick={() => onSelectMood(mood.type)}
              className={`
                group relative p-5 rounded-2xl border-2 transition-all duration-300 text-center overflow-hidden
                ${
                  selectedMood === mood.type
                    ? 'border-amber-400 shadow-2xl shadow-amber-500/20 scale-105'
                    : 'border-purple-500/30 bg-black/40 hover:border-amber-400/50 hover:shadow-lg hover:scale-102'
                }
              `}
            >
              {/* Animated background gradient */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${mood.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  selectedMood === mood.type ? 'opacity-100' : ''
                }`}
              />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon container with glow effect */}
                <div className={`
                  w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${mood.bgGradient} 
                  border border-white/10 flex items-center justify-center
                  group-hover:scale-110 transition-transform duration-300
                  ${selectedMood === mood.type ? 'scale-110 shadow-lg' : ''}
                `}>
                  <IconComponent className={`w-8 h-8 ${mood.color}`} strokeWidth={2} />
                </div>
                
                <h4 className={`font-bold mb-1 transition-colors ${mood.color}`}>
                  {mood.name}
                </h4>
                <p className="text-xs text-purple-300/70 leading-relaxed">{mood.description}</p>
              </div>
              
              {/* Selection indicator */}
              {selectedMood === mood.type && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

