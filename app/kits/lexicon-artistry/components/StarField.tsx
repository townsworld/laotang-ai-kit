"use client";

import React, { useEffect, useState } from 'react';
import { RelatedConcept, ComparisonAnalysis, Language } from '../types';
import { NuanceRadar } from './NuanceRadar';
import { TRANSLATIONS } from '../constants/translations';

interface StarFieldProps {
  centerWord: string;
  relatedConcepts: RelatedConcept[];
  onSelectWord: (word: string) => void;
  onCompare: (wordA: string, wordB: string) => void;
  onClose: () => void;
  comparisonStatus: 'idle' | 'analyzing' | 'success' | 'error';
  comparisonData: ComparisonAnalysis | null;
  resetComparison: () => void;
  lang: Language;
}

export const StarField: React.FC<StarFieldProps> = ({ 
    centerWord, 
    relatedConcepts, 
    onSelectWord, 
    onCompare, 
    onClose,
    comparisonStatus,
    comparisonData,
    resetComparison,
    lang
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    setMounted(true);
  }, []);

  const getNodeColor = (type?: string) => {
    switch (type) {
        case 'synonym': return 'bg-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.6)]'; // Cyan
        case 'antonym': return 'bg-rose-100 shadow-[0_0_20px_rgba(251,113,133,0.6)]'; // Red/Rose
        default: return 'bg-amber-100 shadow-[0_0_20px_rgba(251,191,36,0.6)]'; // Amber (Association)
    }
  };

  const getNodeTextColor = (type?: string) => {
    switch (type) {
        case 'synonym': return 'text-cyan-100 group-hover:text-cyan-50';
        case 'antonym': return 'text-rose-100 group-hover:text-rose-50';
        default: return 'text-amber-100 group-hover:text-amber-50';
    }
  };

  const getLabelText = (type?: string) => {
    switch (type) {
        case 'synonym': return t.starField.labels.synonym;
        case 'antonym': return t.starField.labels.antonym;
        default: return t.starField.labels.association;
    }
  };

  const getLabelStyle = (type?: string) => {
      switch (type) {
          case 'synonym': return 'text-cyan-300 border-cyan-500/50 bg-cyan-950/40';
          case 'antonym': return 'text-rose-300 border-rose-500/50 bg-rose-950/40';
          default: return 'text-amber-300 border-amber-500/50 bg-amber-950/40';
      }
  };

  const handleNodeClick = (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    if (activeNode === word) {
        setActiveNode(null); // Deselect
    } else {
        setActiveNode(word); // Select
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050810] text-white flex items-center justify-center overflow-hidden animate-fade-in perspective-[1000px]">
      
      {/* Dynamic Background Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
         {[...Array(50)].map((_, i) => (
            <div 
                key={i}
                className="absolute bg-white rounded-full opacity-0 animate-pulse"
                style={{
                    width: Math.random() * 3 + 'px',
                    height: Math.random() * 3 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    animationDuration: Math.random() * 3 + 2 + 's',
                    animationDelay: Math.random() * 2 + 's',
                    opacity: Math.random() * 0.7 + 0.1
                }}
            />
         ))}
      </div>

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 z-50 text-white/50 hover:text-white transition-colors duration-300 font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase"
      >
        {t.starField.exit}
      </button>

      {/* Radar Overlay */}
      {(comparisonStatus === 'analyzing' || comparisonStatus === 'success') && (
          <NuanceRadar 
            isLoading={comparisonStatus === 'analyzing'}
            data={comparisonData!}
            onClose={resetComparison}
            lang={lang}
          />
      )}

      {/* 3D Scene Container */}
      <div className={`relative w-full max-w-4xl h-[500px] md:h-[600px] flex items-center justify-center transform-style-3d transition-all duration-1000 ease-out ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        
        {/* Central Sun (Current Word) */}
        <div className="absolute z-20 flex flex-col items-center justify-center text-center animate-float-slow group" onClick={() => setActiveNode(null)}>
            <div className="absolute inset-0 bg-orange-500/20 blur-[40px] md:blur-[60px] rounded-full scale-150 animate-pulse-slow"></div>
            <div className="absolute inset-0 bg-amber-200/10 blur-[20px] md:blur-[30px] rounded-full scale-110"></div>
            <div className="relative w-32 h-32 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-amber-100/10 via-orange-900/40 to-black backdrop-blur-sm border border-white/10 shadow-[inset_0_0_40px_rgba(251,191,36,0.1)] flex items-center justify-center overflow-hidden">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-b from-white/10 to-transparent rotate-45 pointer-events-none"></div>
                <h1 className="relative z-10 font-display text-2xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-amber-50 to-amber-200 tracking-wider capitalize drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                    {centerWord}
                </h1>
            </div>
            {/* Removed Nexus Label */}
        </div>

        {/* Orbit Rings */}
        <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] border border-white/5 rounded-full rotate-x-60 animate-spin-slow pointer-events-none"></div>
        <div className="absolute w-[220px] h-[220px] md:w-[450px] md:h-[450px] border border-white/5 rounded-full rotate-x-60 animate-spin-slower pointer-events-none"></div>

        {/* Orbiting Concepts Container */}
        <div className={`absolute inset-0 animate-spin-slow-reverse hover:pause-animation ${activeNode ? 'pause-animation' : ''}`}>
           {relatedConcepts.map((concept, index) => {
               const angle = (index / relatedConcepts.length) * 2 * Math.PI;
               const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
               const radius = isMobile ? 150 : 300; 
               const x = Math.cos(angle) * radius;
               const y = Math.sin(angle) * radius;
               
               const isActive = activeNode === concept.word;

               return (
                   <div 
                        key={concept.word}
                        className="absolute top-1/2 left-1/2 cursor-pointer z-30"
                        style={{
                            transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                        }}
                        onClick={(e) => handleNodeClick(e, concept.word)}
                   >
                       {/* Planet Node */}
                       <div className="relative flex flex-col items-center transition-all duration-300 transform animate-spin-slow group">
                           
                           {/* Active Focus Menu (Popping out) */}
                           {isActive && (
                               <div className="absolute bottom-full mb-6 flex flex-row gap-4 animate-fade-in-up z-50 whitespace-nowrap">
                                   <button 
                                      onClick={(e) => { e.stopPropagation(); onSelectWord(concept.word); }}
                                      className="px-5 py-2 min-w-[70px] bg-white/10 hover:bg-white/20 backdrop-blur-md rounded border border-white/20 text-[10px] uppercase tracking-wider text-white text-center transition-all"
                                   >
                                       {t.starField.navigate}
                                   </button>
                                   <button 
                                      onClick={(e) => { e.stopPropagation(); onCompare(centerWord, concept.word); }}
                                      className="px-5 py-2 min-w-[70px] bg-cyan-500/20 hover:bg-cyan-500/30 backdrop-blur-md rounded border border-cyan-500/40 text-[10px] uppercase tracking-wider text-cyan-200 text-center transition-all"
                                   >
                                       {t.starField.radar}
                                   </button>
                               </div>
                           )}

                           {/* Relation Type Label (New) */}
                           <span className={`mb-1.5 px-1.5 py-0.5 rounded text-[8px] font-sans font-bold tracking-widest uppercase border backdrop-blur-md transition-all duration-300 ${getLabelStyle(concept.relationType)} ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
                                {getLabelText(concept.relationType)}
                           </span>

                           {/* Node Body */}
                           <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full mb-1 relative overflow-hidden transition-all duration-300 ${getNodeColor(concept.relationType)} ${isActive ? 'scale-150 ring-2 ring-white' : ''}`}>
                           </div>
                           
                           {/* Word Label */}
                           <span className={`font-serif text-sm md:text-lg tracking-wide capitalize transition-colors drop-shadow-md whitespace-nowrap ${getNodeTextColor(concept.relationType)}`}>
                                {concept.word}
                           </span>
                           
                           {/* Tooltip (Only show if not active and on desktop) */}
                           {!isActive && (
                               <div className="absolute top-full pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center pointer-events-none hidden md:flex">
                                   <div className="h-4 w-px bg-white/20 mb-1"></div>
                                   <span className="text-xs text-white/70 font-sans font-light tracking-wider w-40 text-center bg-black/40 backdrop-blur-md p-2 rounded border border-white/10">
                                        {concept.translation} · {concept.reason}
                                   </span>
                               </div>
                           )}
                       </div>
                   </div>
               );
           })}
        </div>
      </div>
      
      <style jsx>{`
        .transform-style-3d { transform-style: preserve-3d; }
        .pause-animation { animation-play-state: paused; }
        .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-slow-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .animate-spin-slow { animation: spin-slow 80s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 80s linear infinite; }
        .animate-spin-slower { animation: spin-slow 100s linear infinite reverse; }
      `}</style>
    </div>
  );
};

