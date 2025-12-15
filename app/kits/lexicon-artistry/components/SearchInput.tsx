"use client";

import React, { useState } from 'react';
import { ImageStyle, Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface SearchInputProps {
  onSearch: (word: string, style: ImageStyle) => void;
  onQuickExplore?: (word: string) => void; // 新增：快速探索星系
  isLoading: boolean;
  lang: Language;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, onQuickExplore, isLoading, lang }) => {
  const [value, setValue] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>('artistic');
  const t = TRANSLATIONS[lang];

  const STYLES: { id: ImageStyle; label: string }[] = [
    { id: 'artistic', label: t.search.styles.artistic },
    { id: 'healing', label: t.search.styles.healing },
    { id: 'anime', label: t.search.styles.anime },
    { id: 'scifi', label: t.search.styles.scifi },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim(), selectedStyle);
    }
  };

  const handleQuickExplore = (e: React.MouseEvent) => {
    e.preventDefault();
    if (value.trim() && onQuickExplore) {
      onQuickExplore(value.trim());
    }
  };

  return (
    <div className="w-full flex flex-col items-center my-4 md:my-6 lg:my-12 relative z-20 px-2 md:px-4">
      <form 
        onSubmit={handleSubmit} 
        className="relative w-full max-w-2xl transition-all duration-500 ease-out group"
      >
        <div className="relative flex items-center rounded-full bg-white/70 backdrop-blur-xl border border-white/50 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(168,162,158,0.12)] hover:shadow-[0_20px_60px_-10px_rgba(168,162,158,0.2)] ring-1 ring-stone-100/50 group-hover:ring-stone-200/70">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t.search.placeholder}
            disabled={isLoading}
            className="flex-1 bg-transparent py-3 md:py-4 lg:py-5 pl-32 md:pl-40 pr-32 md:pr-40 font-serif italic text-base md:text-lg lg:text-xl text-stone-800 placeholder-stone-400/60 text-center focus:outline-none rounded-full caret-stone-600"
            autoFocus
          />
          
          <div className="absolute right-1.5 md:right-2 top-1.5 md:top-2 bottom-1.5 md:bottom-2 flex gap-1.5 md:gap-2">
            {/* 词汇联想按钮 */}
            {onQuickExplore && (
              <button
                type="button"
                onClick={handleQuickExplore}
                disabled={isLoading || !value.trim()}
                className="h-full px-3 md:px-4 lg:px-5 rounded-full bg-stone-700 text-white font-sans text-[9px] md:text-[10px] lg:text-xs tracking-[0.12em] md:tracking-[0.15em] uppercase font-medium hover:bg-stone-600 disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 shadow-md hover:shadow-lg transform active:scale-95 flex items-center gap-2"
                title="快速生成词汇联想"
              >
                词汇联想
              </button>
            )}
            
            {/* 解析按钮 */}
            <button
                type="submit"
                disabled={isLoading || !value.trim()}
                className="h-full px-4 md:px-5 lg:px-7 rounded-full bg-stone-900 text-stone-50 font-sans text-[9px] md:text-[10px] lg:text-xs tracking-[0.12em] md:tracking-[0.15em] uppercase font-medium hover:bg-stone-800 disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 shadow-md hover:shadow-lg transform active:scale-95"
            >
                {isLoading ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-stone-50 rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-stone-50 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></span>
                    <span className="w-1 h-1 bg-stone-50 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
                  </span>
                ) : (
                  t.search.analyze
                )}
            </button>
          </div>
        </div>
      </form>

      {/* Style Selector */}
      <div className="mt-4 md:mt-6 flex flex-wrap justify-center gap-2 md:gap-3 animate-fade-in">
        {STYLES.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => setSelectedStyle(style.id)}
            disabled={isLoading}
            className={`
              px-3 md:px-4 py-1.5 md:py-2 text-[9px] md:text-[10px] uppercase tracking-[0.18em] md:tracking-[0.2em] transition-all duration-300 border backdrop-blur-sm rounded-md font-medium
              ${selectedStyle === style.id 
                ? 'bg-stone-900 text-stone-50 border-stone-900 shadow-md' 
                : 'bg-white/50 text-stone-500 border-stone-200/60 hover:border-stone-300 hover:bg-white/70 hover:text-stone-700'
              }
            `}
          >
            {style.label}
          </button>
        ))}
      </div>
    </div>
  );
};

