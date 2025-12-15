"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ComparisonAnalysis, Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface HolographicRadar3DProps {
  data: ComparisonAnalysis | null;
  onClose: () => void;
  isLoading?: boolean;
  lang: Language;
}

// 2D Radar Chart Component using SVG
const RadarChart2D: React.FC<{ data: ComparisonAnalysis }> = ({ data }) => {
  const width = 400;
  const height = 400;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 120; // Radius of the chart
  const dimensions = data.dimensions;
  const numDimensions = dimensions.length;

  // Helper to calculate coordinates
  const getCoordinates = (value: number, index: number, maxVal: number = 10) => {
    const angle = (Math.PI * 2 * index) / numDimensions - Math.PI / 2; // Start from top
    const r = (value / maxVal) * radius;
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      angle // Store angle for label positioning
    };
  };

  // Generate grid levels (0, 2, 4, 6, 8, 10)
  const levels = [2, 4, 6, 8, 10];
  
  // Calculate points for polygons
  const getPolygonPoints = (scores: number[]) => {
    return scores.map((score, i) => {
      const { x, y } = getCoordinates(score, i);
      return `${x},${y}`;
    }).join(' ');
  };

  const scoresA = dimensions.map(d => d.scoreA);
  const scoresB = dimensions.map(d => d.scoreB);
  
  const pointsA = getPolygonPoints(scoresA);
  const pointsB = getPolygonPoints(scoresB);

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {/* Grid Levels (Concentric Polygons) */}
      {levels.map((level, i) => {
        const levelPoints = dimensions.map((_, idx) => {
          const { x, y } = getCoordinates(level, idx);
          return `${x},${y}`;
        }).join(' ');
        
        return (
          <polygon
            key={`level-${level}`}
            points={levelPoints}
            fill="none"
            stroke="#D6D3D1"
            strokeOpacity={0.4}
            strokeWidth={1}
        />
        );
      })}

      {/* Radial Lines (Axes) */}
      {dimensions.map((_, i) => {
        const { x, y } = getCoordinates(10, i);
        return (
          <line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="#D6D3D1"
            strokeOpacity={0.3}
            strokeWidth={1}
            strokeDasharray="3 3"
        />
        );
      })}

      {/* Dimension Labels */}
      {dimensions.map((d, i) => {
        const { x, y, angle } = getCoordinates(13.5, i); // Position slightly outside
        
        // Adjust text anchor based on angle to prevent overlap
        let textAnchor = "middle";
        let dominantBaseline = "middle";
        
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        if (Math.abs(cos) < 0.1) textAnchor = "middle";
        else if (cos > 0) textAnchor = "start";
        else textAnchor = "end";
        
        if (Math.abs(sin) < 0.1) dominantBaseline = "middle";
        else if (sin > 0) dominantBaseline = "hanging";
        else dominantBaseline = "auto";

        return (
          <text
            key={`label-${i}`}
            x={x}
            y={y}
            fill="#57534E"
            fontSize="13"
            fontWeight="500"
            textAnchor={textAnchor}
            dominantBaseline={dominantBaseline}
            className="font-sans select-none"
          >
            {d.label}
          </text>
        );
      })}

      {/* Word A Polygon (Rose) */}
      <polygon
        points={pointsA}
        fill="#FB7185"
        fillOpacity={0.15}
        stroke="#FB7185"
        strokeWidth={2.5}
        className="transition-all duration-1000 ease-out"
      />
      {/* Word A Points */}
      {scoresA.map((score, i) => {
        const { x, y } = getCoordinates(score, i);
  return (
          <circle key={`pt-a-${i}`} cx={x} cy={y} r={4} fill="#FB7185" stroke="#FFF" strokeWidth={1.5} />
        );
      })}

      {/* Word B Polygon (Blue) */}
      <polygon
        points={pointsB}
        fill="#60A5FA"
        fillOpacity={0.15}
        stroke="#60A5FA"
        strokeWidth={2.5}
        className="transition-all duration-1000 ease-out"
      />
      {/* Word B Points */}
      {scoresB.map((score, i) => {
        const { x, y } = getCoordinates(score, i);
  return (
          <circle key={`pt-b-${i}`} cx={x} cy={y} r={4} fill="#60A5FA" stroke="#FFF" strokeWidth={1.5} />
        );
      })}
    </svg>
  );
};

// 主导出组件
export const HolographicRadar3D: React.FC<HolographicRadar3DProps> = ({
  data,
  onClose,
  isLoading = false,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  // 加载状态
  if (isLoading) {
    return (
      <div className="relative w-full animate-fade-in">
        <div className="w-full max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6 lg:py-10">
          <div className="h-64 md:h-96 flex flex-col items-center justify-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 border-3 md:border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
            <p className="text-stone-600 text-base md:text-lg font-serif tracking-wide">
              {t.starField?.analyzing || '分析语义维度...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 无数据或错误状态
  if (!data) {
    return (
      <div className="relative w-full animate-fade-in">
        <div className="w-full max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6 lg:py-10">
          <div className="flex items-center justify-end mb-6 md:mb-8">
            <button
              onClick={onClose}
              className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/80 hover:bg-white border border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-900 transition-all duration-200 shadow-sm hover:shadow-md text-xs md:text-sm font-medium"
            >
              {lang === 'cn' ? '返回' : 'Back'}
            </button>
          </div>
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/70 bg-white/50 backdrop-blur-xl p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <p className="text-stone-900 text-lg md:text-xl mb-4 font-serif">
                {t.home?.error_prefix || '出错了:'} 无法获取分析数据
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-stone-900 hover:bg-stone-800 rounded-full text-white transition-all shadow-lg text-sm md:text-base"
              >
                {t.starField?.exit || '关闭'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full animate-fade-in">
      <div className="w-full max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6 lg:py-10">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-3 md:gap-4 mb-6 md:mb-8 lg:mb-10">
          <div>
            <p className="text-[8px] md:text-[9px] lg:text-[10px] tracking-[0.25em] md:tracking-[0.3em] uppercase text-stone-400 mb-1">Semantic Comparison</p>
            <h2 className="font-serif text-xl md:text-2xl lg:text-3xl text-stone-900 tracking-tight">
              {lang === 'cn' ? '语义对比雷达' : 'Semantic Radar'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/80 hover:bg-white border border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-900 transition-all duration-200 shadow-sm hover:shadow-md text-xs md:text-sm font-medium flex-shrink-0"
          >
            {lang === 'cn' ? '返回' : 'Back'}
          </button>
        </div>

        {/* Words Comparison Header */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] p-5 md:p-8 lg:p-10 mb-6 md:mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-row items-center justify-center gap-3 md:gap-4 lg:gap-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 rounded-full bg-rose-400 shadow-md flex-shrink-0"></div>
              <span className="text-stone-900 text-lg md:text-2xl lg:text-3xl xl:text-4xl font-serif tracking-tight">{data.wordA}</span>
            </div>
            <span className="text-stone-400 font-light italic text-sm md:text-base lg:text-lg flex-shrink-0">vs</span>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 rounded-full bg-blue-400 shadow-md flex-shrink-0"></div>
              <span className="text-stone-900 text-lg md:text-2xl lg:text-3xl xl:text-4xl font-serif tracking-tight">{data.wordB}</span>
            </div>
          </div>
        </div>

        {/* Chart Card */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] p-6 md:p-8 lg:p-12 mb-6 md:mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent pointer-events-none" />
          <div className="relative z-10 w-full max-w-[560px] mx-auto aspect-square">
            <RadarChart2D data={data} />
          </div>
        </div>

        {/* Analysis & Sentences */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/80 bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] p-6 md:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="h-px flex-1 bg-stone-300"></div>
              <h3 className="text-[9px] md:text-[10px] tracking-[0.25em] md:tracking-[0.3em] uppercase text-stone-400 font-medium">Analysis</h3>
              <div className="h-px flex-1 bg-stone-300"></div>
            </div>
            
            <p className="text-stone-700 text-sm md:text-base lg:text-lg leading-relaxed text-center mb-6 md:mb-8 font-serif">
              {data.insight}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="bg-rose-50/60 border border-rose-200/40 rounded-xl md:rounded-2xl p-4 md:p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-400/40"></div>
                <p className="text-stone-800 text-xs md:text-sm italic pl-3 leading-relaxed">&quot;{data.sentenceA}&quot;</p>
              </div>
              <div className="bg-blue-50/60 border border-blue-200/40 rounded-xl md:rounded-2xl p-4 md:p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-400/40"></div>
                <p className="text-stone-800 text-xs md:text-sm italic pl-3 leading-relaxed">&quot;{data.sentenceB}&quot;</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HolographicRadar3D;
