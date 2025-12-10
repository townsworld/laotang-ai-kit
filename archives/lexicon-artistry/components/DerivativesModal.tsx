import React, { useEffect } from 'react';
import { Derivative, Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface DerivativesModalProps {
  word: string;
  derivatives: Derivative[];
  onClose: () => void;
  onSelectWord: (word: string) => void;
  isLoading: boolean;
  lang: Language;
}

export const DerivativesModal: React.FC<DerivativesModalProps> = ({ word, derivatives, onClose, onSelectWord, isLoading, lang }) => {
  const t = TRANSLATIONS[lang];

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0c0a09]/60 backdrop-blur-sm transition-opacity duration-500"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-[#F9F8F4] w-full max-w-2xl max-h-[85vh] md:max-h-[90vh] flex flex-col rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] animate-fade-in-up border border-stone-200 overflow-hidden">
        
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none mix-blend-multiply z-0"></div>

        {/* Header - Fixed at top */}
        <div className="relative z-10 p-5 md:p-8 pb-4 md:pb-6 text-center border-b border-stone-200/60 flex flex-col items-center flex-shrink-0 bg-[#F9F8F4]">
            <h2 className="font-display text-xl md:text-2xl tracking-[0.2em] text-stone-800 uppercase font-semibold">
                {t.derivatives.title}
            </h2>
            <div className="flex items-center gap-2 mt-2 text-stone-500 font-serif italic text-xs md:text-sm">
                <span>{t.derivatives.subtitle}</span>
                <span className="font-semibold text-stone-700 not-italic border-b border-stone-300 pb-0.5">{word}</span>
            </div>
            
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-stone-400 hover:text-stone-800 hover:rotate-90 transition-all duration-300 rounded-full hover:bg-stone-200/50 active:bg-stone-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>

        {/* Content Area - Scrollable */}
        <div className="relative z-10 p-5 md:p-8 overflow-y-auto bg-stone-50/50 flex-1 overscroll-contain">
            {isLoading ? (
                <div className="h-full min-h-[200px] flex flex-col items-center justify-center gap-4">
                     <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin"></div>
                     <span className="font-serif italic text-stone-400 text-sm tracking-wide">{t.derivatives.loading}</span>
                </div>
            ) : derivatives.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {derivatives.map((item, index) => (
                        <button 
                            key={index} 
                            onClick={() => {
                                onSelectWord(item.word);
                                onClose();
                            }}
                            className="group relative flex flex-col items-start p-4 md:p-5 rounded-xl border border-stone-200 bg-white hover:border-stone-400 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 text-left overflow-hidden"
                        >
                            {/* Hover Highlight */}
                            <div className="absolute inset-0 bg-stone-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                            
                            <div className="w-full flex justify-between items-start mb-2">
                                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 text-[10px] font-sans font-bold uppercase tracking-wider group-hover:bg-stone-800 group-hover:text-stone-50 transition-colors duration-300">
                                    {item.part_of_speech}
                                </span>
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="16" 
                                    height="16" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                    className="text-stone-300 group-hover:text-stone-800 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300"
                                >
                                    <line x1="7" y1="17" x2="17" y2="7"></line>
                                    <polyline points="7 7 17 7 17 17"></polyline>
                                </svg>
                            </div>

                            <span className="font-serif text-xl md:text-2xl text-stone-800 group-hover:text-stone-900 tracking-tight">
                                {item.word}
                            </span>
                            
                            <div className="mt-2 h-px w-8 bg-stone-200 group-hover:w-full group-hover:bg-stone-300 transition-all duration-500"></div>
                            
                            <span className="mt-3 font-sans text-xs md:text-sm text-stone-500 font-light tracking-wide opacity-80 group-hover:opacity-100">
                                {item.translation}
                            </span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center text-stone-400 space-y-2">
                    <span className="font-serif italic text-lg">{t.derivatives.empty}</span>
                    <span className="text-xs uppercase tracking-widest opacity-60">{t.derivatives.emptySub}</span>
                </div>
            )}
        </div>
        
        {/* Footer decoration - Fixed at bottom */}
        <div className="relative z-10 h-3 w-full bg-[#E5E0D8] border-t border-stone-200 flex-shrink-0"></div>
      </div>
    </div>
  );
};