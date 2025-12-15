"use client";

import React from 'react';
import { Derivative, Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface DerivativesPanelProps {
  word: string;
  derivatives: Derivative[];
  onClose: () => void;
  onSelectWord: (word: string) => void;
  isLoading: boolean;
  lang: Language;
}

export const DerivativesModal: React.FC<DerivativesPanelProps> = ({ word, derivatives, onClose, onSelectWord, isLoading, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="relative w-full animate-fade-in">
      <div className="w-full max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6 lg:py-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 md:gap-4 mb-6 md:mb-8 lg:mb-10">
          <div>
            <p className="text-[8px] md:text-[9px] lg:text-[10px] tracking-[0.25em] md:tracking-[0.3em] uppercase text-stone-400 mb-1">Word Derivatives</p>
            <h2 className="font-serif text-xl md:text-2xl lg:text-3xl text-stone-900 tracking-tight">
              {t.derivatives.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/80 hover:bg-white border border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-900 transition-all duration-200 shadow-sm hover:shadow-md text-xs md:text-sm font-medium flex-shrink-0"
          >
            {lang === 'cn' ? '返回' : 'Back'}
          </button>
        </div>

        {/* Core card - Source Word */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] p-6 md:p-8 lg:p-12 mb-6 md:mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent pointer-events-none" />
          <div className="flex flex-col items-center relative z-10 space-y-2 md:space-y-3 text-center">
            <p className="text-[8px] md:text-[9px] tracking-[0.25em] md:tracking-[0.3em] uppercase text-stone-400">{t.derivatives.subtitle}</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-stone-900 leading-none tracking-tight">{word}</h1>
          </div>
        </div>

        {/* Derivatives Grid */}
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 border-2 md:border-3 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
            <span className="font-serif italic text-stone-400 text-sm md:text-base tracking-wide">{t.derivatives.loading}</span>
          </div>
        ) : derivatives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5">
            {derivatives.map((item, index) => (
              <button 
                key={index} 
                onClick={() => {
                  onSelectWord(item.word);
                  onClose();
                }}
                className="group relative flex flex-col items-start p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl border border-white/70 bg-white/70 backdrop-blur-xl hover:bg-white hover:border-stone-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 text-left overflow-hidden"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 w-full">
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-wider group-hover:bg-stone-800 group-hover:text-stone-50 transition-colors duration-300">
                      {item.part_of_speech}
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="14" 
                      height="14" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="text-stone-300 group-hover:text-stone-800 opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300"
                    >
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>

                  <span className="font-serif text-xl md:text-2xl lg:text-3xl text-stone-800 group-hover:text-stone-900 tracking-tight block mb-3">
                    {item.word}
                  </span>
                  
                  <div className="h-px w-8 bg-stone-200 group-hover:w-full group-hover:bg-stone-300 transition-all duration-500 mb-3"></div>
                  
                  <span className="font-sans text-xs md:text-sm text-stone-500 font-light tracking-wide opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    {item.translation}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/70 bg-white/50 backdrop-blur-xl p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-2">
              <span className="font-serif italic text-lg md:text-xl text-stone-400">{t.derivatives.empty}</span>
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-stone-400/60">{t.derivatives.emptySub}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

