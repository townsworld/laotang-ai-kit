"use client";

import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { TarotCard } from '../types';
import { getCardTheme } from '../constants/cardThemes';

interface CardDetailModalProps {
  card: TarotCard;
  isReversed: boolean;
  onClose: () => void;
}

export default function CardDetailModal({ card, isReversed, onClose }: CardDetailModalProps) {
  const theme = getCardTheme(card.id);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 rounded-3xl border-2 border-amber-400/50 shadow-2xl shadow-purple-500/30 backdrop-blur-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`relative p-6 bg-gradient-to-br ${theme.gradient} border-b border-white/10`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-center gap-4">
              <div className="text-6xl">{theme.symbol}</div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">{card.nameCn}</h2>
                <p className="text-white/80 text-lg">{card.name}</p>
                <div className="mt-2">
                  <span className={`text-sm font-bold ${isReversed ? 'text-red-300' : 'text-emerald-300'}`}>
                    {isReversed ? '⇅ 逆位' : '⇵ 正位'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Whisper */}
            {card.whisper && (
              <div className="bg-black/30 rounded-2xl p-4 border border-amber-400/30">
                <p className="text-amber-300 text-center text-lg italic">
                  「 {card.whisper} 」
                </p>
              </div>
            )}

            {/* Keywords */}
            <div>
              <h3 className="text-amber-300 font-bold mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                关键词
              </h3>
              <div className="flex flex-wrap gap-2">
                {card.keywordsCn.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-800/50 text-purple-200 rounded-full text-sm border border-purple-500/30"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Meanings */}
            <div className="space-y-4">
              {/* Upright */}
              <div className="bg-emerald-900/30 rounded-2xl p-4 border border-emerald-500/30">
                <h4 className="text-emerald-300 font-bold mb-2 flex items-center gap-2">
                  <span>⇵</span> 正位含义
                </h4>
                <p className="text-emerald-100 leading-relaxed">{card.upright}</p>
              </div>

              {/* Reversed */}
              <div className="bg-red-900/30 rounded-2xl p-4 border border-red-500/30">
                <h4 className="text-red-300 font-bold mb-2 flex items-center gap-2">
                  <span>⇅</span> 逆位含义
                </h4>
                <p className="text-red-100 leading-relaxed">{card.reversed}</p>
              </div>
            </div>

            {/* Current Meaning */}
            <div className={`rounded-2xl p-5 border-2 ${
              isReversed 
                ? 'bg-red-900/40 border-red-400/50' 
                : 'bg-emerald-900/40 border-emerald-400/50'
            }`}>
              <h4 className={`font-bold mb-2 ${isReversed ? 'text-red-200' : 'text-emerald-200'}`}>
                当前为你呈现的含义：
              </h4>
              <p className={`leading-relaxed ${isReversed ? 'text-red-100' : 'text-emerald-100'}`}>
                {isReversed ? card.reversed : card.upright}
              </p>
            </div>

            {/* Card Number */}
            <div className="text-center text-purple-300/60 text-sm">
              大阿卡纳 · 编号 {card.number}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

