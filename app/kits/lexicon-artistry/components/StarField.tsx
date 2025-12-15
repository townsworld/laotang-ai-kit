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
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    setMounted(true);
  }, []);

  const getRelationColor = (type?: string) => {
    switch (type) {
        case 'synonym': return {
          main: '#0891b2', // cyan-600
          light: '#06b6d4', // cyan-500
          pale: '#cffafe', // cyan-50
        };
        case 'antonym': return {
          main: '#be123c', // rose-700
          light: '#e11d48', // rose-600
          pale: '#ffe4e6', // rose-50
        };
        case 'confusable': return {
          main: '#7c3aed', // violet-600
          light: '#8b5cf6', // violet-500
          pale: '#ede9fe', // violet-50
        };
        default: return {
          main: '#d97706', // amber-600
          light: '#f59e0b', // amber-500
          pale: '#fef3c7', // amber-50
        };
    }
  };

  const getLabelText = (type?: string) => {
    switch (type) {
        case 'synonym': return t.starField.labels.synonym;
        case 'antonym': return t.starField.labels.antonym;
        case 'confusable': return t.starField.labels.confusable;
        default: return t.starField.labels.association;
    }
  };

  const handleNodeClick = (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    setActiveNode(activeNode === word ? null : word);
  };

  // 动态布局 - 12个词需要4层轨道
  const getPlanetDistance = (index: number) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const baseRadius = isMobile ? 130 : 260;
    const variation = (index % 4) * (isMobile ? 12 : 25);
    return baseRadius + variation;
  };

  const getPlanetScale = (index: number, type?: string) => {
    if (type === 'synonym') return 1.15;
    if (type === 'antonym') return 1.1;
    if (type === 'confusable') return 1.08;
    return 1 + (index % 3) * 0.05;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden animate-fade-in bg-cream">
      
      {/* 背景层 - 与主页面一致 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         {/* 噪点纹理 */}
         <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-multiply"></div>
         
         {/* 柔和的环境光 */}
         <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#F5EFE6] mix-blend-multiply filter blur-[120px] opacity-40 animate-float-very-slow"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#EBE5DE] mix-blend-multiply filter blur-[140px] opacity-30 animate-float-slower"></div>
      </div>

      {/* 关闭按钮 */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 md:top-10 md:right-10 z-50 px-5 py-2.5 bg-white/80 hover:bg-white backdrop-blur-sm border border-stone-200 hover:border-stone-400 rounded-full transition-all duration-300 shadow-sm hover:shadow-md group"
      >
        <span className="text-xs tracking-widest uppercase text-stone-500 group-hover:text-stone-900 transition-colors font-medium">
          {t.starField.exit}
        </span>
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

      {/* 主场景容器 */}
      <div className={`relative w-full max-w-5xl h-[500px] md:h-[700px] flex items-center justify-center transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        
        {/* SVG 连接线 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
          <defs>
            {relatedConcepts.map((concept) => {
              const colors = getRelationColor(concept.relationType);
              return (
                <linearGradient key={`grad-${concept.word}`} id={`gradient-${concept.word}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={colors.main} stopOpacity="0" />
                  <stop offset="50%" stopColor={colors.main} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={colors.main} stopOpacity="0" />
                </linearGradient>
              );
            })}
          </defs>
          
          {relatedConcepts.map((concept, index) => {
            const angle = (index / relatedConcepts.length) * 2 * Math.PI;
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            const radius = getPlanetDistance(index);
            const centerX = isMobile ? 250 : 500;
            const centerY = isMobile ? 250 : 350;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            const isActive = activeNode === concept.word || hoveredNode === concept.word;
            
            return (
              <path
                key={`line-${concept.word}`}
                d={`M ${centerX} ${centerY} L ${x} ${y}`}
                stroke={`url(#gradient-${concept.word})`}
                strokeWidth={isActive ? "2" : "1"}
                strokeDasharray={isActive ? "none" : "4 6"}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        {/* 轨道环 - 优雅虚线（4层支持12个词） */}
        {[260, 285, 310, 335].map((size, idx) => (
          <div 
            key={`orbit-${idx}`}
            className="absolute border border-stone-300/30 rounded-full pointer-events-none"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderStyle: 'dashed',
              borderWidth: '1px',
              animation: `gentle-orbit ${75 + idx * 12}s linear infinite ${idx % 2 === 0 ? 'normal' : 'reverse'}`
            }}
          />
        ))}

        {/* 核心词 - 博物馆风格 */}
        <div className="absolute z-20 flex flex-col items-center justify-center text-center group cursor-pointer" 
             onClick={() => setActiveNode(null)}>
            
            {/* 主卡片 */}
            <div className="relative bg-white/80 backdrop-blur-md border border-stone-200 rounded-3xl p-8 md:p-12 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] group-hover:shadow-[0_30px_50px_-10px_rgba(0,0,0,0.12)] transition-all duration-700 group-hover:scale-105">
                {/* 顶部装饰线 */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-300/50 to-transparent"></div>
                
                {/* 核心文字 */}
                <h1 className="font-serif text-4xl md:text-7xl text-stone-900 capitalize tracking-tight font-medium"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    {centerWord}
                </h1>
                
                {/* 底部装饰 */}
                <div className="mt-6 flex justify-center">
                    <div className="h-px w-12 bg-stone-300/50"></div>
                </div>
            </div>
        </div>

        {/* 卫星层 */}
        <div className="absolute inset-0">
           {relatedConcepts.map((concept, index) => {
               const angle = (index / relatedConcepts.length) * 2 * Math.PI;
               const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
               const radius = getPlanetDistance(index);
               const scale = getPlanetScale(index, concept.relationType);
               const baseX = Math.cos(angle) * radius;
               const baseY = Math.sin(angle) * radius;
               
               const isActive = activeNode === concept.word;
               const isHovered = hoveredNode === concept.word;
               const colors = getRelationColor(concept.relationType);

               return (
                   <div 
                        key={concept.word}
                        className="absolute cursor-pointer"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: `translate(${baseX}px, ${baseY}px) translate(-50%, -50%) scale(${scale})`,
                            transition: 'transform 0.5s ease-out',
                            zIndex: isActive ? 100 : 30
                        }}
                        onClick={(e) => handleNodeClick(e, concept.word)}
                        onMouseEnter={() => setHoveredNode(concept.word)}
                        onMouseLeave={() => setHoveredNode(null)}
                   >
                       <div className="relative flex flex-col items-center group/planet"
                            style={{
                              animation: `gentle-float ${5 + index * 0.4}s ease-in-out infinite`,
                              animationDelay: `${index * 0.2}s`
                            }}>
                           
                           {/* 激活菜单 */}
                           {isActive && (
                               <div className="absolute bottom-full mb-6 flex flex-row gap-3 animate-menu-slide-up whitespace-nowrap" style={{ zIndex: 100 }}>
                                   <button 
                                      onClick={(e) => { e.stopPropagation(); onSelectWord(concept.word); }}
                                      className="px-5 py-2.5 bg-white hover:bg-stone-50 backdrop-blur-sm border border-stone-200 hover:border-stone-400 rounded-full text-sm text-stone-700 hover:text-stone-900 transition-all shadow-md hover:shadow-lg font-medium"
                                   >
                                       {t.starField.navigate}
                                   </button>
                                   <button 
                                      onClick={(e) => { e.stopPropagation(); onCompare(centerWord, concept.word); }}
                                      className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 border border-stone-900 rounded-full text-sm text-white transition-all shadow-lg hover:shadow-xl font-medium"
                                   >
                                       {t.starField.radar}
                                   </button>
                               </div>
                           )}

                           {/* 关系类型标签 - 优雅胶囊 */}
                           <div className={`mb-3 px-3 py-1 rounded-full backdrop-blur-sm text-[9px] uppercase tracking-widest font-semibold transition-all duration-300 border ${isActive ? 'scale-110' : ''}`}
                                style={{
                                  backgroundColor: `${colors.pale}cc`,
                                  borderColor: colors.light,
                                  color: colors.main
                                }}>
                                {getLabelText(concept.relationType)}
                           </div>

                           {/* 词汇卡片 - 白色毛玻璃 */}
                           <div className={`relative bg-white/90 backdrop-blur-md border border-stone-200 rounded-2xl p-4 md:p-5 shadow-lg transition-all duration-500 ${isActive ? 'scale-125 shadow-2xl border-stone-300' : isHovered ? 'scale-110 shadow-xl' : 'hover:scale-105 hover:shadow-xl'}`}>
                               
                               {/* 顶部装饰线 */}
                               <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent"></div>
                               
                               <div className="flex flex-col items-center gap-2 min-w-[120px] md:min-w-[140px]">
                                   {/* 主单词 */}
                                   <span className="font-serif text-xl md:text-3xl text-stone-900 capitalize tracking-tight font-medium"
                                         style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {concept.word}
                                   </span>
                                   
                                   {/* 词性 + 翻译 */}
                                   <div className="text-xs md:text-sm text-stone-600 font-sans">
                                        <span className="font-semibold text-stone-700">{concept.part_of_speech}</span>
                                        <span className="mx-2 text-stone-400">·</span>
                                        <span>{concept.translation}</span>
                                   </div>
                                   
                                   {/* 关系说明 - 只在hover时显示 */}
                                   {(isHovered || isActive) && (
                                     <p className="text-[10px] md:text-xs text-stone-500 leading-relaxed mt-2 text-center max-w-[180px] font-light animate-fade-in">
                                       {concept.reason}
                                     </p>
                                   )}
                               </div>
                               
                               {/* 底部装饰 */}
                               {isActive && (
                                 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-stone-400 to-transparent"></div>
                               )}
                           </div>
                       </div>
                   </div>
               );
           })}
        </div>
      </div>
      
      <style jsx>{`
        /* 柔和漂浮 */
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        /* 极慢漂浮 */
        @keyframes float-very-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -15px); }
        }
        .animate-float-very-slow { animation: float-very-slow 60s ease-in-out infinite; }
        
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-25px, 20px); }
        }
        .animate-float-slower { animation: float-slower 50s ease-in-out infinite; }
        
        /* 轨道旋转 */
        @keyframes gentle-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* 菜单滑入 */
        @keyframes menu-slide-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-menu-slide-up { animation: menu-slide-up 0.3s ease-out; }
        
        /* 淡入 */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
      `}</style>
    </div>
  );
};
