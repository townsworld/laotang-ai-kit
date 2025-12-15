"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import ApiKeyButton from '@/components/ApiKeyButton';

interface LayoutProps {
  children: React.ReactNode;
  currentView?: 'home' | 'gallery';
  onNavigate?: (view: 'home' | 'gallery') => void;
  lang: Language;
  onToggleLanguage: () => void;
  onApiKeyChange?: (apiKey: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, lang, onToggleLanguage, onApiKeyChange }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="lexicon-artistry min-h-screen w-full bg-cream relative overflow-hidden text-stone-800 font-sans selection:bg-stone-200 selection:text-stone-900 flex flex-col items-center">
      
      {/* Background Elements */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
         {/* Subtle Noise Texture */}
         <div className="absolute inset-0 bg-noise noise-overlay mix-blend-multiply pointer-events-none"></div>
         
         {/* Gradient Orbs - Warm Ambient Light - Slowed down and softened */}
         <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#F5EFE6] mix-blend-multiply filter blur-[120px] opacity-60 animate-float-slow"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#EBE5DE] mix-blend-multiply filter blur-[140px] opacity-50 animate-float-slower"></div>
      </div>

      {/* Back to Home Button - Icon Only */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-30">
        <Link
          href="/"
          className="inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-white/60 hover:bg-white/90 backdrop-blur-sm border border-stone-200/60 hover:border-stone-300 rounded-full text-stone-500 hover:text-stone-800 transition-all shadow-sm hover:shadow-md group"
          title="返回装备库"
        >
          <ArrowLeft className="w-4 h-4 md:w-4.5 md:h-4.5 group-hover:-translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full flex flex-col items-center flex-1">
        <header className="w-full py-4 md:py-8 lg:py-12 px-4 md:px-6 lg:px-12 flex justify-between items-center max-w-7xl mx-auto z-50">
          <button 
            onClick={() => onNavigate?.('home')} 
            className="text-left group relative ml-12 md:ml-16 lg:ml-0"
          >
            <h1 className="font-display text-lg md:text-2xl lg:text-3xl xl:text-4xl tracking-[0.15em] md:tracking-[0.2em] text-stone-800 uppercase font-medium relative z-10">
              Lexicon Artistry
            </h1>
            <div className="absolute -bottom-2 left-0 w-0 h-px bg-stone-800 transition-all duration-700 group-hover:w-full opacity-50"></div>
          </button>

          {/* Right Side: Nav & Lang & API Key */}
          <div className="flex items-center gap-2 md:gap-4 lg:gap-8">
            {onNavigate && (
                <nav className="hidden md:flex gap-6 md:gap-10">
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
                className="text-[9px] md:text-[10px] font-sans tracking-widest text-stone-500 hover:text-stone-900 transition-colors border border-stone-200 hover:border-stone-400 px-2 py-1 md:px-3 md:py-1.5 rounded-sm bg-white/50 backdrop-blur-sm"
            >
                {lang === 'en' ? 'EN / 中' : '中 / EN'}
            </button>

            {/* API Key Button */}
            <div className="scale-90 md:scale-100">
              <ApiKeyButton 
                variant="floating" 
                autoPrompt={true}
                onApiKeyChange={onApiKeyChange}
              />
            </div>
          </div>
        </header>

        {/* Mobile Navigation */}
        {onNavigate && (
          <nav className="md:hidden flex gap-6 mb-6 pb-4 border-b border-stone-200/50 w-full justify-center">
            <button 
              onClick={() => onNavigate('home')}
              className={`text-[10px] uppercase tracking-[0.2em] py-1 px-4 border-b-2 transition-all duration-500 ${currentView === 'home' ? 'text-stone-900 border-stone-800' : 'text-stone-400 border-transparent'}`}
            >
                {t.nav.analysis}
            </button>
            <button 
              onClick={() => onNavigate('gallery')}
              className={`text-[10px] uppercase tracking-[0.2em] py-1 px-4 border-b-2 transition-all duration-500 ${currentView === 'gallery' ? 'text-stone-900 border-stone-800' : 'text-stone-400 border-transparent'}`}
            >
                {t.nav.gallery}
            </button>
          </nav>
        )}
        
        {/* Main Content Area */}
        <main className={`flex-1 w-full px-3 md:px-4 lg:px-8 py-2 md:py-4 lg:py-8 flex flex-col items-center transition-all duration-700 ${currentView === 'gallery' ? 'max-w-7xl' : 'max-w-6xl'}`}>
          {children}
        </main>
        
        <footer className="w-full py-6 md:py-8 lg:py-12 text-center text-stone-400/80 text-[9px] md:text-[10px] tracking-[0.3em] uppercase mt-auto">
          Powered by 程序员老唐AI
        </footer>
      </div>
    </div>
  );
};

