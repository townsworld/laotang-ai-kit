"use client";

import React, { useState, useEffect, useRef } from 'react';
import { DrawnCard } from '../types';
import { ALL_TAROT_CARDS } from '../constants/tarotData';
import { CARD_VISUAL_THEMES } from '../constants/cardThemes';
import { Sparkles } from 'lucide-react';

interface TarotCardProps {
  drawnCard: DrawnCard;
  index: number;
  isRevealed: boolean;
  isHighlighted?: boolean;
  phase?: 'drawing' | 'result';
  onReveal?: () => void;
  onClick?: () => void;
  isSingleCard?: boolean;
}

export default function TarotCard({
  drawnCard,
  index,
  isRevealed,
  isHighlighted = false,
  phase = 'result',
  onReveal,
  onClick,
  isSingleCard = false,
}: TarotCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [showWhisper, setShowWhisper] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();

  const card = drawnCard.card;
  const isReversed = drawnCard.isReversed;
  const theme = CARD_VISUAL_THEMES[card.id] || CARD_VISUAL_THEMES['major-0'];

  // Show ripple effect on reveal
  useEffect(() => {
    if (isRevealed) {
      setShowRipple(true);
      const timer = setTimeout(() => setShowRipple(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isRevealed]);

  const handleClick = () => {
    if (!isLongPress) {
      if (!isRevealed && onReveal) {
        onReveal();
      } else if (onClick) {
        onClick();
      }
    }
    setIsLongPress(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isRevealed && card.whisper) {
      const timer = setTimeout(() => setShowWhisper(true), 500);
      return () => clearTimeout(timer);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowWhisper(false);
  };

  const handleMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      if (onClick) {
        onClick();
      }
    }, 500);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  return (
    <>
      <style jsx>{`
        .card-flip-container {
          perspective: 1000px;
        }
        .card-flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.7s;
          transform-style: preserve-3d;
        }
        .card-flip-inner.flipped {
          transform: rotateY(0deg);
        }
        .card-flip-inner.not-flipped {
          transform: rotateY(180deg);
        }
        .card-flip-inner.reversed {
          transform: rotateY(0deg) rotateZ(180deg);
        }
        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .card-back {
          transform: rotateY(180deg);
        }
      `}</style>
      
      <div
        className={`
          relative cursor-pointer transition-all duration-300
          ${phase === 'drawing' ? 'animate-fly-in' : ''}
          ${phase === 'result' && !isRevealed ? 'animate-bounce-subtle' : ''}
        `}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        {/* Highlight ring for energy connection */}
        {isHighlighted && (
          <div className="absolute inset-0 rounded-xl border-4 border-amber-400 animate-pulse -z-10 scale-110"></div>
        )}
        
        {/* Energy Ripple on reveal */}
        {showRipple && (
          <>
            <div className="absolute inset-0 rounded-xl border-4 border-amber-400 animate-ping opacity-75" style={{ animationDuration: '1s' }}></div>
            <div className="absolute inset-0 rounded-xl border-4 border-purple-400 animate-ping opacity-50" style={{ animationDuration: '1s', animationDelay: '0.2s' }}></div>
          </>
        )}
        
        {/* Hover ripple effect */}
        {!isRevealed && isHovered && (
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-amber-400/20 animate-pulse"></div>
          </div>
        )}
      
        <div
          className={`
            card-flip-container ${isSingleCard ? 'w-64 h-96 md:w-80 md:h-[480px]' : 'w-32 h-48 md:w-40 md:h-60'}
            ${!isRevealed && isHovered ? 'scale-105' : ''}
            transition-all duration-300
          `}
        >
          <div
            className={`
              card-flip-inner
              ${isRevealed ? (isReversed ? 'reversed' : 'flipped') : 'not-flipped'}
            `}
          >
            {/* Card Back */}
            <div className="card-face card-back rounded-xl border-4 border-amber-400 bg-[#1a0b2e] flex items-center justify-center shadow-2xl overflow-hidden">
              {/* Mystical Background Pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900"></div>
                {/* Decorative corners */}
                <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/60"></div>
                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/60"></div>
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/60"></div>
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400/60"></div>
              </div>
              
              {/* Center Content */}
              <div className="relative text-center z-10">
                <div className="mb-3">
                  <Sparkles className="w-10 h-10 text-amber-300 mx-auto animate-pulse" />
                </div>
                
                {/* Mystical Symbol */}
                <div className="text-4xl mb-3 animate-pulse" style={{ animationDuration: '2s' }}>
                  🔮
                </div>
                
                <p className="text-amber-200/80 text-xs font-medium tracking-wider">
                  {isHovered ? '点击翻牌' : '等待翻开'}
                </p>
              </div>
              
              {/* Decorative Frame */}
              <div className="absolute inset-3 rounded-lg border border-amber-400/30"></div>
              <div className="absolute inset-5 rounded-md border border-amber-400/20"></div>
              
              {/* Corner Stars */}
              <div className="absolute top-4 left-4 text-amber-400/40 text-xs">✦</div>
              <div className="absolute top-4 right-4 text-amber-400/40 text-xs">✦</div>
              <div className="absolute bottom-4 left-4 text-amber-400/40 text-xs">✦</div>
              <div className="absolute bottom-4 right-4 text-amber-400/40 text-xs">✦</div>
            </div>

            {/* Card Front */}
            <div className={`card-face rounded-xl border-4 border-amber-400 ${(drawnCard.generatedImage || card.image) ? 'bg-black p-0' : `bg-gradient-to-br ${theme.gradient} p-3`} shadow-2xl flex flex-col items-center justify-between overflow-hidden ${theme.borderGlow}`}>
              {(drawnCard.generatedImage || card.image) ? (
                // AI Generated or Pre-generated Image
                <div className="relative w-full h-full">
                  <img
                    src={drawnCard.generatedImage || card.image}
                    alt={`${card.nameCn} - ${card.name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to default card design if image fails to load
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="absolute inset-0 bg-gradient-to-br ${theme.gradient} p-3 flex flex-col items-center justify-center">
                            <div class="text-6xl mb-4">${theme.symbol}</div>
                            <div class="text-center">
                              <h3 class="text-xl font-bold text-white mb-1">${card.nameCn}</h3>
                              <p class="text-sm text-white/80">${card.name}</p>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                  {/* Card info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-white drop-shadow-lg mb-1">
                        {card.nameCn}
                      </h3>
                      <p className="text-xs text-white/80 drop-shadow">{card.name}</p>
                      <div className="inline-block px-3 py-1 mt-2 bg-black/40 rounded-full border border-white/30 backdrop-blur-sm">
                        <p className="text-xs font-bold">
                          {isReversed ? (
                            <span className="text-red-200">⇅ 逆位</span>
                          ) : (
                            <span className="text-emerald-200">⇵ 正位</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Default Card Design
                <>
              {/* Background Texture */}
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              
              {/* Decorative Corners */}
              <div className="absolute top-1 left-1 w-6 h-6 border-t border-l border-amber-300/50"></div>
              <div className="absolute top-1 right-1 w-6 h-6 border-t border-r border-amber-300/50"></div>
              <div className="absolute bottom-1 left-1 w-6 h-6 border-b border-l border-amber-300/50"></div>
              <div className="absolute bottom-1 right-1 w-6 h-6 border-b border-r border-amber-300/50"></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-between h-full py-2">
                {/* Top: Number */}
                <div className="text-center">
                  <div className="inline-block px-3 py-1 bg-black/20 rounded-full border border-white/30 backdrop-blur-sm">
                    <p className="text-lg font-bold text-white drop-shadow-lg">
                      {card.number === 0 ? '0' : card.number}
                    </p>
                  </div>
                </div>
                
                {/* Middle: Symbol */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl md:text-6xl mb-2 drop-shadow-2xl animate-float">
                      {theme.symbol}
                    </div>
                    <div className="px-3 py-1 bg-black/20 rounded-lg border border-white/30 backdrop-blur-sm">
                      <h3 className="text-base md:text-lg font-bold text-white drop-shadow-lg mb-0.5">
                        {card.nameCn}
                      </h3>
                      <p className="text-[10px] text-white/80 drop-shadow">{card.name}</p>
                    </div>
                  </div>
                </div>
                
                {/* Bottom: Keywords & Orientation */}
                <div className="text-center w-full">
                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1 justify-center mb-2">
                    {card.keywordsCn.slice(0, 2).map((keyword, i) => (
                      <span
                        key={i}
                        className="text-[9px] px-2 py-0.5 bg-black/30 text-white border border-white/30 rounded-full backdrop-blur-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>

                  {/* Orientation */}
                  <div className="inline-block px-3 py-1 bg-black/20 rounded-full border border-white/30 backdrop-blur-sm">
                    <p className="text-xs font-bold">
                      {isReversed ? (
                        <span className="text-red-200">⇅ 逆位</span>
                      ) : (
                        <span className="text-emerald-200">⇵ 正位</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Whisper tooltip */}
        {showWhisper && isRevealed && card.whisper && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20 animate-float-up pointer-events-none">
            <div className="bg-black/90 backdrop-blur-md px-4 py-2 rounded-lg border border-amber-400/50 shadow-2xl whitespace-nowrap">
              <p className="text-amber-300 text-sm font-medium">✨ {card.whisper}</p>
            </div>
          </div>
        )}

        {/* Long press hint */}
        {isRevealed && isHovered && !showWhisper && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
            <p className="text-purple-300/60 text-xs whitespace-nowrap">长按查看详情</p>
          </div>
        )}

        {/* Hover Glow */}
        {isHovered && !isRevealed && (
          <div className="absolute inset-0 rounded-xl bg-amber-400/30 blur-xl -z-10 animate-pulse"></div>
        )}
        
        {/* Revealed Glow */}
        {isRevealed && (
          <div className={`absolute inset-0 rounded-xl blur-2xl -z-10 opacity-50 ${theme.borderGlow}`}></div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float-up {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-float-up {
          animation: float-up 0.3s ease-out forwards;
        }
        @keyframes fly-in {
          from {
            opacity: 0;
            transform: translateY(-100px) scale(0.5);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fly-in {
          animation: fly-in 0.6s ease-out forwards;
          animation-delay: ${index * 0.1}s;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
