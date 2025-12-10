"use client";

import React, { useRef, useState } from 'react';
import { EtymologyStage, Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface EtymologyTimelineProps {
  timeline: EtymologyStage[];
  lang: Language;
}

export const EtymologyTimeline: React.FC<EtymologyTimelineProps> = ({ timeline, lang }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const t = TRANSLATIONS[lang];

  // Mouse Drag Logic for Desktop Horizontal Scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full animate-fade-in relative">
        <div className="flex items-center justify-center md:justify-start gap-3 mb-8 md:mb-10">
            <div className="w-8 h-px bg-stone-300"></div>
            <h3 className="text-[0.65rem] md:text-xs uppercase tracking-[0.2em] text-stone-400 font-medium">{t.wordCard.timeline}</h3>
        </div>

        {/* Desktop View: Horizontal Draggable Timeline */}
        <div className="hidden md:block relative w-full group">
            
            {/* Fade Gradients for visual cue */}
            <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
            <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>

            <div 
                className="relative w-full overflow-x-auto pb-12 pt-8 cursor-grab active:cursor-grabbing scrollbar-hide select-none px-8"
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {/* Connecting Line */}
                <div className="absolute top-[51px] left-0 w-full h-px bg-stone-200 z-0"></div>

                <div className="flex gap-24 px-4 min-w-max">
                    {timeline.map((stage, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center min-w-[180px] group/node">
                            
                            {/* Year Badge */}
                            <div className="mb-6 bg-white px-3 py-1 rounded border border-stone-200 text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest group-hover/node:border-stone-400 group-hover/node:text-stone-800 transition-colors duration-500 shadow-sm">
                                {stage.year}
                            </div>

                            {/* Node Point */}
                            <div className="w-5 h-5 rounded-full bg-white border-[3px] border-stone-300 group-hover/node:border-stone-800 group-hover/node:scale-110 transition-all duration-300 shadow-sm mb-6 relative">
                                <div className="absolute inset-0 bg-stone-800 rounded-full opacity-0 group-hover/node:opacity-100 transform scale-50 transition-opacity duration-300"></div>
                            </div>

                            {/* Content Card */}
                            <div className="text-center space-y-2 w-56 transform transition-transform duration-500 group-hover/node:-translate-y-1">
                                <p className="text-[9px] uppercase text-stone-400 font-sans tracking-[0.15em] border-b border-transparent inline-block pb-0.5">{stage.language}</p>
                                <h4 className="font-serif text-2xl text-stone-800 italic">{stage.word}</h4>
                                <p className="text-sm text-stone-600 font-medium leading-relaxed">{stage.meaning}</p>
                                <div className="pt-2 opacity-0 group-hover/node:opacity-100 transition-opacity duration-500 delay-100">
                                    <p className="text-[11px] text-stone-400 leading-relaxed font-light">
                                        {stage.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Mobile View: Vertical Timeline */}
        <div className="md:hidden flex flex-col pl-6 border-l border-stone-200 ml-4 relative py-2">
             {timeline.map((stage, index) => (
                <div key={index} className="relative pl-8 pb-10 last:pb-0 group">
                    {/* Node Dot */}
                    <div className="absolute left-[-29px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-stone-300 group-hover:border-stone-800 transition-colors duration-300"></div>
                    
                    <div className="flex flex-col items-start">
                        <span className="inline-block bg-stone-50 border border-stone-100 px-2 py-0.5 rounded text-[9px] font-sans font-bold text-stone-400 uppercase tracking-wider mb-2">
                            {stage.year}
                        </span>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex flex-wrap items-baseline gap-2">
                                <span className="font-serif text-xl text-stone-800 italic">{stage.word}</span>
                                <span className="text-[9px] uppercase text-stone-400 font-sans tracking-wide border border-stone-100 px-1 rounded">
                                    {stage.language}
                                </span>
                            </div>
                            <p className="text-sm text-stone-700 font-medium">{stage.meaning}</p>
                            <p className="text-xs text-stone-500 leading-relaxed mt-1 opacity-80">
                                {stage.description}
                            </p>
                        </div>
                    </div>
                </div>
             ))}
        </div>
    </div>
  );
};

