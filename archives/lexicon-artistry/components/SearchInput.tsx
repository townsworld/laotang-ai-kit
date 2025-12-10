import React, { useState } from 'react';
import { ImageStyle, Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface SearchInputProps {
  onSearch: (word: string, style: ImageStyle) => void;
  isLoading: boolean;
  lang: Language;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading, lang }) => {
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

  return (
    <div className="w-full flex flex-col items-center my-6 md:my-16 relative z-20 px-4">
      <form 
        onSubmit={handleSubmit} 
        className="relative w-full max-w-xl transition-all duration-500 ease-out group"
      >
        <div className="relative flex items-center rounded-full bg-white/70 backdrop-blur-xl border border-white/50 transition-all duration-500 shadow-[0_10px_40px_-10px_rgba(168,162,158,0.15)] hover:shadow-[0_20px_60px_-10px_rgba(168,162,158,0.25)] ring-1 ring-stone-100 group-hover:ring-stone-200">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t.search.placeholder}
            disabled={isLoading}
            className="flex-1 bg-transparent py-4 md:py-5 px-8 md:px-10 font-serif italic text-lg md:text-xl text-stone-800 placeholder-stone-400/70 text-center focus:outline-none rounded-full caret-stone-500"
            autoFocus
          />
          
          <div className="absolute right-2 md:right-2 top-2 bottom-2">
            <button
                type="submit"
                disabled={isLoading || !value.trim()}
                className="h-full px-5 md:px-7 rounded-full bg-stone-900 text-stone-50 font-sans text-[10px] md:text-xs tracking-widest uppercase font-medium hover:bg-stone-700 disabled:opacity-0 disabled:pointer-events-none transition-all duration-500 shadow-lg transform active:scale-95"
            >
                {isLoading ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-stone-50 rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-stone-50 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1 h-1 bg-stone-50 rounded-full animate-bounce delay-200"></span>
                  </span>
                ) : (
                  t.search.analyze
                )}
            </button>
          </div>
        </div>
      </form>

      {/* Style Selector */}
      <div className="mt-8 flex flex-wrap justify-center gap-3 md:gap-4 animate-fade-in opacity-90">
        {STYLES.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => setSelectedStyle(style.id)}
            disabled={isLoading}
            className={`
              px-4 py-1.5 text-[9px] md:text-[10px] uppercase tracking-[0.15em] transition-all duration-300 border backdrop-blur-sm
              ${selectedStyle === style.id 
                ? 'bg-stone-800 text-stone-50 border-stone-800 shadow-lg transform -translate-y-0.5' 
                : 'bg-white/40 text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-800'
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