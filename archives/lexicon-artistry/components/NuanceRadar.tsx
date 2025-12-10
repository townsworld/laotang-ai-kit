
import React from 'react';
import { ComparisonAnalysis, Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface NuanceRadarProps {
  data: ComparisonAnalysis;
  isLoading: boolean;
  onClose: () => void;
  lang: Language;
}

export const NuanceRadar: React.FC<NuanceRadarProps> = ({ data, isLoading, onClose, lang }) => {
  const t = TRANSLATIONS[lang];

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[60] animate-fade-in">
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
                 <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
                 <div className="absolute inset-0 border-4 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <span className="text-cyan-300 font-mono text-xs uppercase tracking-widest animate-pulse">{t.radar.calculating}</span>
        </div>
      </div>
    );
  }

  // SVG Radar Logic
  const dimensions = data.dimensions;
  const numAxes = dimensions.length;
  const radius = 100;
  const center = 150;
  
  // Helper to get coordinates
  const getCoordinates = (value: number, index: number) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    // Map score 0-10 to radius 0-100
    const r = (value / 10) * radius;
    const x = center + Math.cos(angle) * r;
    const y = center + Math.sin(angle) * r;
    return { x, y };
  };

  // Generate paths
  const pathA = dimensions.map((d, i) => {
    const { x, y } = getCoordinates(d.scoreA, i);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ') + ' Z';

  const pathB = dimensions.map((d, i) => {
    const { x, y } = getCoordinates(d.scoreB, i);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ') + ' Z';

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-[60] animate-fade-in p-4">
        
        {/* Close */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white p-2 z-50"
        >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="flex flex-col items-center w-full max-w-2xl h-full md:h-auto overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between w-full max-w-md mb-6 font-display uppercase tracking-widest text-sm flex-shrink-0 pt-8 md:pt-0">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                    <span className="text-cyan-100">{data.wordA}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-fuchsia-100">{data.wordB}</span>
                    <div className="w-3 h-3 rounded-full bg-fuchsia-400 shadow-[0_0_10px_rgba(232,121,249,0.8)]"></div>
                </div>
            </div>

            {/* Radar Chart */}
            <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] flex-shrink-0 mb-6">
                <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
                    {/* Grid Webs */}
                    {[2, 4, 6, 8, 10].map((level) => (
                        <path 
                            key={level}
                            d={dimensions.map((_, i) => {
                                const { x, y } = getCoordinates(level, i);
                                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                            }).join(' ') + ' Z'}
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Axes */}
                    {dimensions.map((d, i) => {
                        const { x, y } = getCoordinates(10, i);
                        // Dynamic label from AI
                        const label = d.label;

                        return (
                            <g key={i}>
                                <line x1={center} y1={center} x2={x} y2={y} stroke="rgba(255,255,255,0.1)" />
                                {/* Label */}
                                <text 
                                    x={x + (x - center) * 0.25} 
                                    y={y + (y - center) * 0.25} 
                                    textAnchor="middle" 
                                    dominantBaseline="middle"
                                    className="fill-white/80 text-[10px] uppercase font-bold font-sans tracking-widest"
                                >
                                    {label}
                                </text>
                            </g>
                        );
                    })}

                    {/* Shape A (Cyan) */}
                    <path d={pathA} fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="2" className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                    
                    {/* Shape B (Fuchsia) */}
                    <path d={pathB} fill="rgba(232,121,249,0.15)" stroke="#e879f9" strokeWidth="2" className="drop-shadow-[0_0_8px_rgba(232,121,249,0.5)]" />
                </svg>
            </div>

            {/* Insight & Examples */}
            <div className="w-full space-y-4">
                {/* Main Insight */}
                <div className="bg-white/5 backdrop-blur-md p-5 rounded-xl border border-white/10 text-center shadow-lg">
                    <p className="text-white/90 font-serif text-sm md:text-base leading-relaxed">
                        {data.insight}
                    </p>
                </div>

                {/* Example Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-cyan-950/30 backdrop-blur-md p-4 rounded-xl border border-cyan-500/20">
                         <div className="text-[10px] uppercase tracking-widest text-cyan-400 mb-2">{data.wordA}</div>
                         <p className="text-cyan-50/90 font-serif italic text-sm">"{data.sentenceA}"</p>
                    </div>
                    <div className="bg-fuchsia-950/30 backdrop-blur-md p-4 rounded-xl border border-fuchsia-500/20">
                         <div className="text-[10px] uppercase tracking-widest text-fuchsia-400 mb-2">{data.wordB}</div>
                         <p className="text-fuchsia-50/90 font-serif italic text-sm">"{data.sentenceB}"</p>
                    </div>
                </div>
            </div>
            
            <div className="h-8 w-full md:hidden"></div>
        </div>
    </div>
  );
};
