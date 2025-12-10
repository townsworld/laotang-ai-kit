import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface LayoutProps {
  children: React.ReactNode;
  currentView?: 'home' | 'gallery';
  onNavigate?: (view: 'home' | 'gallery') => void;
  lang: Language;
  onToggleLanguage: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, lang, onToggleLanguage }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen w-full bg-cream relative overflow-hidden text-stone-800 font-sans selection:bg-stone-200 selection:text-stone-900 flex flex-col items-center">
      
      {/* Background Elements */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
         {/* Subtle Noise Texture */}
         <div className="absolute inset-0 bg-noise noise-overlay mix-blend-multiply pointer-events-none"></div>
         
         {/* Gradient Orbs - Warm Ambient Light - Slowed down and softened */}
         <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#F5EFE6] mix-blend-multiply filter blur-[120px] opacity-60 animate-float-slow"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#EBE5DE] mix-blend-multiply filter blur-[140px] opacity-50 animate-float-slower"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full flex flex-col items-center flex-1">
        <header className="w-full py-8 md:py-12 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto z-50">
          <button 
            onClick={() => onNavigate?.('home')} 
            className="text-left group relative"
          >
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl tracking-[0.2em] text-stone-800 uppercase font-medium relative z-10">
              Lexicon Artistry
            </h1>
            <div className="absolute -bottom-2 left-0 w-0 h-px bg-stone-800 transition-all duration-700 group-hover:w-full opacity-50"></div>
          </button>

          {/* Right Side: Nav & Lang */}
          <div className="flex items-center gap-6 md:gap-12">
            {onNavigate && (
                <nav className="flex gap-6 md:gap-10">
                    <button 
                      onClick={() => onNavigate('home')}
                      className={`text-[10px] md:text-xs uppercase tracking-[0.2em] py-1 border-b transition-all duration-500 ${currentView === 'home' ? 'text-stone-900 border-stone-800' : 'text-stone-400 border-transparent hover:text-stone-600'}`}
                    >
                        {t.nav.analysis}
                    </button>
                    <button 
                      onClick={() => onNavigate('gallery')}
                      className={`text-[10px] md:text-xs uppercase tracking-[0.2em] py-1 border-b transition-all duration-500 ${currentView === 'gallery' ? 'text-stone-900 border-stone-800' : 'text-stone-400 border-transparent hover:text-stone-600'}`}
                    >
                        {t.nav.gallery}
                    </button>
                </nav>
            )}

            <button
                onClick={onToggleLanguage}
                className="text-[10px] md:text-xs font-sans tracking-widest text-stone-500 hover:text-stone-900 transition-colors border border-stone-200 hover:border-stone-400 px-3 py-1.5 rounded-sm bg-white/50 backdrop-blur-sm"
            >
                {lang === 'en' ? 'EN / 中' : '中 / EN'}
            </button>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className={`flex-1 w-full px-4 md:px-8 py-4 md:py-8 flex flex-col items-center transition-all duration-700 ${currentView === 'gallery' ? 'max-w-7xl' : 'max-w-6xl'}`}>
          {children}
        </main>
        
        <footer className="w-full py-8 md:py-12 text-center text-stone-400/80 text-[9px] md:text-[10px] tracking-[0.3em] uppercase mt-auto">
          Powered by 程序员老唐AI
        </footer>
      </div>
    </div>
  );
};