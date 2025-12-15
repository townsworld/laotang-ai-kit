"use client";

import React from 'react';
import { Spread, SpreadType } from '../types';
import { SPREADS } from '../constants/tarotData';

interface SpreadSelectorProps {
  selectedSpread: SpreadType;
  onSelectSpread: (spread: SpreadType) => void;
}

export default function SpreadSelector({ selectedSpread, onSelectSpread }: SpreadSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-purple-200 text-center">选择牌阵</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SPREADS.map((spread) => {
          const IconComponent = spread.icon;
          return (
            <button
              key={spread.id}
              onClick={() => onSelectSpread(spread.id)}
              className={`
                group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left backdrop-blur-md overflow-hidden
                ${
                  selectedSpread === spread.id
                    ? 'border-amber-400 shadow-2xl shadow-amber-500/30 scale-105'
                    : 'border-purple-500/30 bg-black/40 hover:border-amber-400/50 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-102'
                }
              `}
            >
              {/* Animated background */}
              <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                selectedSpread === spread.id ? 'opacity-100' : ''
              }`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  {/* Icon with gradient background */}
                  <div className={`
                    w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-indigo-500/30 
                    border border-purple-400/30 flex items-center justify-center
                    group-hover:scale-110 group-hover:rotate-6 transition-all duration-300
                    ${selectedSpread === spread.id ? 'scale-110 shadow-lg shadow-purple-500/30' : ''}
                  `}>
                    <IconComponent className="w-6 h-6 text-purple-300" strokeWidth={2} />
                  </div>
                  <h4 className="font-bold text-white text-lg">{spread.nameCn}</h4>
                </div>
                <p className="text-sm text-purple-200 mb-3 leading-relaxed">{spread.descriptionCn}</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs text-purple-300">
                    {spread.positions.length} 张牌
                  </span>
                  {selectedSpread === spread.id && (
                    <span className="px-2 py-1 bg-amber-500/30 border border-amber-400/50 rounded-full text-xs text-amber-300 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      已选择
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

