"use client";

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
      <div className="absolute inset-0 flex items-center justify-center bg-cream/95 backdrop-blur-md z-[60] animate-fade-in">
        <div className="flex flex-col items-center gap-6">
            <div className="relative w-16 h-16">
                 <div className="absolute inset-0 border-4 border-stone-200 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-t-stone-700 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <span className="text-stone-600 font-sans text-sm uppercase tracking-widest font-medium">{t.radar.calculating}</span>
        </div>
      </div>
    );
  }

  // SVG Radar Logic
  const dimensions = data.dimensions;
  const numAxes = dimensions.length;
  const radius = 100;
  const center = 150;
  
  const getCoordinates = (value: number, index: number) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    const r = (value / 10) * radius;
    const x = center + Math.cos(angle) * r;
    const y = center + Math.sin(angle) * r;
    return { x, y };
  };

  const pathA = dimensions.map((d, i) => {
    const { x, y } = getCoordinates(d.scoreA, i);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ') + ' Z';

  const pathB = dimensions.map((d, i) => {
    const { x, y } = getCoordinates(d.scoreB, i);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ') + ' Z';

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-cream/95 backdrop-blur-xl z-[60] animate-fade-in p-4 overflow-y-auto">
        
        {/* 背景装饰 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-noise opacity-[0.02] mix-blend-multiply"></div>
        </div>
        
        {/* 关闭按钮 */}
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 md:top-8 md:right-8 p-3 bg-white/80 hover:bg-white border border-stone-200 hover:border-stone-400 rounded-full transition-all shadow-sm hover:shadow-md z-50 group"
        >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-500 group-hover:text-stone-900 transition-colors">
               <line x1="18" y1="6" x2="6" y2="18"></line>
               <line x1="6" y1="6" x2="18" y2="18"></line>
             </svg>
        </button>

        {/* 主容器 */}
        <div className="relative flex flex-col items-center w-full max-w-3xl py-8 md:py-12">
            
            {/* 标题区 */}
            <div className="mb-10 md:mb-16 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8 bg-stone-300"></div>
                <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500 font-semibold">语义对比分析</h2>
                <div className="h-px w-8 bg-stone-300"></div>
              </div>
              
              <div className="flex items-center justify-center gap-6 md:gap-10">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-sm"></div>
                    <span className="font-serif text-2xl md:text-3xl text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>{data.wordA}</span>
                </div>
                <div className="text-stone-300 font-light text-2xl">vs</div>
                <div className="flex items-center gap-3">
                    <span className="font-serif text-2xl md:text-3xl text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>{data.wordB}</span>
                    <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm"></div>
                </div>
              </div>
            </div>

            {/* 雷达图卡片 */}
            <div className="bg-white/90 backdrop-blur-md border border-stone-200 rounded-3xl p-8 md:p-12 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] mb-10 relative">
              {/* 图例和说明 */}
              <div className="flex flex-col items-center gap-3 mb-8">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-3 bg-cyan-500/30 border-2 border-cyan-500 rounded-sm"></div>
                    <span className="text-sm text-stone-700 font-semibold">{data.wordA}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-3 bg-rose-500/30 border-2 border-rose-600 rounded-sm"></div>
                    <span className="text-sm text-stone-700 font-semibold">{data.wordB}</span>
                  </div>
                </div>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest">
                  {lang === 'cn' ? '分值范围：0-10 分 · 数值越大程度越高' : 'SCALE: 0-10 · HIGHER = STRONGER'}
                </p>
              </div>
              
              <div className="relative w-[320px] h-[320px] md:w-[480px] md:h-[480px] mx-auto">
                  <svg viewBox="0 0 300 300" className="w-full h-full">
                      {/* 背景网格 - 增强对比度 */}
                      {[2, 4, 6, 8, 10].map((level) => (
                          <g key={level}>
                            <path 
                                d={dimensions.map((_, i) => {
                                    const { x, y } = getCoordinates(level, i);
                                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                                }).join(' ') + ' Z'}
                                fill={level === 10 ? "rgba(231, 229, 228, 0.1)" : "none"}
                                stroke="#d6d3d1"
                                strokeWidth="1"
                                opacity={level === 10 ? "0.5" : level >= 6 ? "0.3" : "0.15"}
                            />
                            {/* 刻度标注 */}
                            {level % 2 === 0 && (
                              <text 
                                x={center + 5} 
                                y={center - (level / 10) * radius} 
                                className="fill-stone-400 text-[9px] font-sans"
                              >
                                {level}
                              </text>
                            )}
                          </g>
                      ))}

                      {/* 轴线和标签 */}
                      {dimensions.map((d, i) => {
                          const { x, y } = getCoordinates(10, i);
                          const labelX = x + (x - center) * 0.35;
                          const labelY = y + (y - center) * 0.35;
                          const scoreDiff = Math.abs(d.scoreA - d.scoreB).toFixed(1);

                          return (
                              <g key={i}>
                                  <line x1={center} y1={center} x2={x} y2={y} stroke="#d6d3d1" strokeWidth="1.5" opacity="0.5" />
                                  
                                  {/* 维度标签背景 */}
                                  <rect
                                    x={labelX - 35}
                                    y={labelY - 10}
                                    width="70"
                                    height="20"
                                    fill="white"
                                    opacity="0.9"
                                    rx="4"
                                  />
                                  
                                  {/* 维度标签 */}
                                  <text 
                                      x={labelX} 
                                      y={labelY} 
                                      textAnchor="middle" 
                                      dominantBaseline="middle"
                                      className="fill-stone-800 text-[11px] md:text-xs font-sans font-bold"
                                      style={{ letterSpacing: '0.03em' }}
                                  >
                                      {d.label}
                                  </text>
                                  
                                  {/* 分数差异提示 */}
                                  {parseFloat(scoreDiff) >= 2 && (
                                    <text 
                                        x={labelX} 
                                        y={labelY + 16} 
                                        textAnchor="middle" 
                                        className="fill-amber-600 text-[9px] font-sans font-semibold"
                                    >
                                        {lang === 'cn' ? `差 ${scoreDiff}` : `Δ ${scoreDiff}`}
                                    </text>
                                  )}
                              </g>
                          );
                      })}

                      {/* 中心装饰 */}
                      <circle cx={center} cy={center} r="8" fill="white" stroke="#e7e5e4" strokeWidth="2" />
                      <circle cx={center} cy={center} r="3" fill="#a8a29e" opacity="0.3" />
                      
                      {/* 数据形状 A（青色） */}
                      <path d={pathA} fill="rgba(6, 182, 212, 0.18)" stroke="#06b6d4" strokeWidth="3" />
                      {dimensions.map((d, i) => {
                        const { x, y } = getCoordinates(d.scoreA, i);
                        return (
                          <g key={`a-${i}`}>
                            <circle cx={x} cy={y} r="5" fill="#06b6d4" stroke="#ffffff" strokeWidth="2.5" />
                            <text 
                              x={x} 
                              y={y + (y > center ? 16 : -10)} 
                              textAnchor="middle"
                              className="fill-cyan-700 text-[10px] font-bold font-sans"
                            >
                              {d.scoreA.toFixed(1)}
                            </text>
                          </g>
                        );
                      })}
                      
                      {/* 数据形状 B（玫瑰色） */}
                      <path d={pathB} fill="rgba(225, 29, 72, 0.15)" stroke="#e11d48" strokeWidth="3" />
                      {dimensions.map((d, i) => {
                        const { x, y } = getCoordinates(d.scoreB, i);
                        return (
                          <g key={`b-${i}`}>
                            <circle cx={x} cy={y} r="5" fill="#e11d48" stroke="#ffffff" strokeWidth="2.5" />
                            <text 
                              x={x} 
                              y={y + (y > center ? 16 : -10)} 
                              textAnchor="middle"
                              className="fill-rose-700 text-[10px] font-bold font-sans"
                            >
                              {d.scoreB.toFixed(1)}
                            </text>
                          </g>
                        );
                      })}
                  </svg>
              </div>
            </div>

            {/* 洞察卡片 */}
            <div className="w-full max-w-2xl mb-8">
                <div className="bg-white/90 backdrop-blur-sm p-7 md:p-10 rounded-3xl border border-stone-200 shadow-lg relative">
                    {/* 顶部装饰 */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"></div>
                    
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <div className="h-px w-12 bg-stone-300"></div>
                      <h3 className="text-xs uppercase tracking-[0.3em] text-stone-500 font-semibold">
                        {lang === 'cn' ? '核心差异' : 'KEY INSIGHT'}
                      </h3>
                      <div className="h-px w-12 bg-stone-300"></div>
                    </div>
                    <p className="text-stone-800 font-serif text-base md:text-xl leading-relaxed text-center px-4"
                       style={{ fontFamily: "'Playfair Display', serif", lineHeight: '1.8' }}>
                        {data.insight}
                    </p>
                    
                    {/* 维度得分对比 */}
                    <div className="mt-8 pt-6 border-t border-stone-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {dimensions.map((d, i) => (
                          <div key={i} className="text-center">
                            <div className="text-[10px] text-stone-500 mb-2 uppercase tracking-wider">{d.label}</div>
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-sm font-bold text-cyan-600">{d.scoreA.toFixed(1)}</span>
                              <span className="text-xs text-stone-400">vs</span>
                              <span className="text-sm font-bold text-rose-600">{d.scoreB.toFixed(1)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                </div>
            </div>

            {/* 例句卡片 */}
            <div className="w-full">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8 bg-stone-300"></div>
                <h3 className="text-xs uppercase tracking-[0.3em] text-stone-500 font-semibold">
                  {lang === 'cn' ? '使用示例' : 'EXAMPLES'}
                </h3>
                <div className="h-px w-8 bg-stone-300"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-gradient-to-br from-cyan-50 to-white backdrop-blur-sm p-6 md:p-7 rounded-2xl border border-cyan-200 shadow-lg">
                       <div className="flex items-center gap-2 mb-4">
                         <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-sm"></div>
                         <div className="text-xs uppercase tracking-widest text-cyan-700 font-bold">{data.wordA}</div>
                       </div>
                       <div className="pl-4 border-l-2 border-cyan-200">
                         <p className="text-stone-800 font-serif italic text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
                           &quot;{data.sentenceA}&quot;
                         </p>
                       </div>
                  </div>
                  <div className="bg-gradient-to-br from-rose-50 to-white backdrop-blur-sm p-6 md:p-7 rounded-2xl border border-rose-200 shadow-lg">
                       <div className="flex items-center gap-2 mb-4">
                         <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm"></div>
                         <div className="text-xs uppercase tracking-widest text-rose-700 font-bold">{data.wordB}</div>
                       </div>
                       <div className="pl-4 border-l-2 border-rose-200">
                         <p className="text-stone-800 font-serif italic text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
                           &quot;{data.sentenceB}&quot;
                         </p>
                       </div>
                  </div>
              </div>
            </div>
        </div>
    </div>
  );
};
