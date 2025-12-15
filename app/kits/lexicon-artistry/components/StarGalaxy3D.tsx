"use client";

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { GalaxyData, GalaxySatellite, Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface StarGalaxy3DProps {
  galaxyData: GalaxyData | null;
  isLoading?: boolean;
  onSelectWord: (word: string) => void;
  onCompare: (wordA: string, wordB: string) => void;
  onClose: () => void;
  lang: Language;
}

// 2D 星空配色
const STAR_COLORS: Record<'core' | 'synonym' | 'antonym' | 'confusable', { dot: string; glow: string }> = {
  core: { dot: '#ffffff', glow: 'rgba(255,255,255,0.9)' },
  synonym: { dot: '#a78bfa', glow: 'rgba(167,139,250,0.55)' },
  antonym: { dot: '#60a5fa', glow: 'rgba(96,165,250,0.55)' },
  confusable: { dot: '#f472b6', glow: 'rgba(244,114,182,0.55)' },
};

// 计算卫星位置（固定分布，静止）
function computePositions(galaxyData: GalaxyData | null, width: number, height: number) {
  if (!galaxyData?.satellites || galaxyData.satellites.length === 0) return [];

  const minDim = Math.max(Math.min(width, height), 320); // 保底尺寸，避免过小
  // 动态半径，随视窗缩放
  const r1 = minDim * 0.25; // synonyms
  const r2 = minDim * 0.35; // antonyms
  const r3 = minDim * 0.45; // confusables

    const synonyms = galaxyData.satellites.filter(s => s.type === 'synonym');
    const antonyms = galaxyData.satellites.filter(s => s.type === 'antonym');
    const confusables = galaxyData.satellites.filter(s => s.type === 'confusable');

  const positions: Array<{ satellite: GalaxySatellite; x: number; y: number }> = [];

  const place = (list: GalaxySatellite[], radius: number, offset = 0) => {
    list.forEach((sat, i) => {
      const angle = (i / list.length) * Math.PI * 2 + offset;
      positions.push({
        satellite: sat,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      });
    });
  };

  place(synonyms, r1);
  place(antonyms, r2, Math.PI / 8);
  place(confusables, r3, Math.PI / 4);

    return positions;
}

// 星点组件：闪烁呼吸，但位置静止
const StarDot: React.FC<{
  label: string;
  type: 'core' | 'synonym' | 'antonym' | 'confusable';
  x: number;
  y: number;
  onClick?: () => void;
  active?: boolean;
}> = ({ label, type, x, y, onClick, active }) => {
  const color = STAR_COLORS[type];
  // 缩短光芒长度、减薄线条，整体更柔和
  const size = type === 'core' ? 18 : 10;
  const glowSize = type === 'core' ? 64 : 38;
  const flareLength = type === 'core' ? 78 : 48;
  const flareThickness = type === 'core' ? 8 : 5;
  const corePoint = type === 'core' ? 8 : 5; // 缩小中心圆点，减少可见圆形感

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <div
        className="relative"
        style={{
          width: glowSize,
          height: glowSize,
          opacity: active ? 1 : 0.8,
          transition: 'opacity 200ms ease, transform 200ms ease',
          transform: active ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        <div
          className="absolute inset-0 rounded-full twinkle"
          style={{
            background: `radial-gradient(circle, ${color.glow} 0%, rgba(255,255,255,0) 70%)`,
            filter: 'blur(12px)',
            opacity: 0.9,
          }}
        />
        {/* 星形核心 + 光芒 */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            top: (glowSize - flareLength) / 2,
            left: (glowSize - flareLength) / 2,
            width: flareLength,
            height: flareLength,
          }}
        >
          {/* 十字光芒 */}
          <div
            className="absolute twinkle"
            style={{
              width: flareLength,
              height: flareThickness,
              background: `linear-gradient(90deg, transparent, ${color.dot}, transparent)`,
              filter: 'blur(1px)',
              opacity: 0.7,
            }}
          />
          <div
            className="absolute twinkle"
            style={{
              width: flareLength,
              height: flareThickness,
              transform: 'rotate(90deg)',
              background: `linear-gradient(90deg, transparent, ${color.dot}, transparent)`,
              filter: 'blur(1px)',
              opacity: 0.7,
            }}
              />
          {/* 斜向光芒 */}
          <div
            className="absolute twinkle"
            style={{
              width: flareLength * 0.8,
              height: flareThickness * 0.8,
              transform: 'rotate(45deg)',
              background: `linear-gradient(90deg, transparent, ${color.dot}, transparent)`,
              filter: 'blur(1.2px)',
              opacity: 0.55,
            }}
          />
          <div
            className="absolute twinkle"
            style={{
              width: flareLength * 0.8,
              height: flareThickness * 0.8,
              transform: 'rotate(-45deg)',
              background: `linear-gradient(90deg, transparent, ${color.dot}, transparent)`,
              filter: 'blur(1.2px)',
              opacity: 0.55,
            }}
          />
          {/* 核心星点 */}
          <div
            className="rounded-full twinkle"
            style={{
              width: corePoint,
              height: corePoint,
              background: `radial-gradient(circle, ${color.dot} 0%, rgba(255,255,255,0.6) 60%, rgba(255,255,255,0) 100%)`,
              boxShadow: `0 0 6px ${color.dot}`,
            }}
          />
        </div>
      </div>
      <div className="mt-2 text-white text-xs font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
        {label}
      </div>
    </div>
  );
};

export const StarGalaxy3D: React.FC<StarGalaxy3DProps> = ({
  galaxyData,
  isLoading = false,
  onSelectWord,
  onCompare,
  onClose,
  lang,
}) => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [showGalaxy, setShowGalaxy] = useState(false);
  const [viewport, setViewport] = useState<{ width: number; height: number }>({ width: 1200, height: 900 });
  const containerRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (!isLoading && galaxyData) {
      setShowGalaxy(true);
    }
  }, [isLoading, galaxyData]);

  // 监听容器尺寸，随窗口调整星星分布
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const resize = () => {
      const rect = el.getBoundingClientRect();
      setViewport({ width: rect.width, height: rect.height });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const positions = useMemo(
    () => computePositions(galaxyData, viewport.width, viewport.height),
    [galaxyData, viewport],
  );

  if (!galaxyData) return null;

  const handleSelect = (word: string) => {
    setActiveNode(word === activeNode ? null : word);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black">
      {/* 背景：真实星空图 + 渐变叠加 */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1600&q=80)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/65" />

      {/* 退出按钮 */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 rounded-full transition-all duration-300 shadow-lg group text-white text-xs tracking-widest uppercase"
      >
        {t.starField?.exit || 'Exit'}
      </button>

      {/* 信息面板 */}
      {showGalaxy && (
        <div className="absolute bottom-8 left-8 z-40 max-w-md bg-black/55 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-white animate-fade-in">
          <h3 className="font-serif text-3xl mb-2 tracking-tight">{galaxyData.coreWord.word}</h3>
          <p className="text-sm text-white/60 mb-3">{galaxyData.coreWord.pronunciation}</p>
          <p className="text-sm text-white/80 leading-relaxed">{galaxyData.coreWord.definition}</p>
        </div>
      )}

      {/* 2D 星图层 */}
      <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
        <div
          ref={containerRef}
          className="relative"
          style={{ width: '100%', height: '100%' }}
        >
          {/* 核心词：居中且最亮 */}
          <div className="absolute left-1/2 top-1/2" style={{ transform: 'translate(-50%, -50%)' }}>
            <StarDot label={galaxyData.coreWord.word} type="core" x={0} y={0} active />
          </div>

          {/* 卫星词：固定分布，闪烁但不移动 */}
          {positions.map(({ satellite, x, y }) => (
            <StarDot
              key={satellite.word}
              label={satellite.word}
              type={satellite.type}
              x={x}
              y={y}
              onClick={() => handleSelect(satellite.word)}
              active={activeNode === satellite.word}
            />
          ))}
        </div>
      </div>

      {/* 选中时的操作菜单 */}
      {activeNode && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex gap-4 animate-fade-in">
          <button
            onClick={() => {
              onSelectWord(activeNode);
              setActiveNode(null);
            }}
            className="px-6 py-3 bg-white text-black rounded-full font-medium shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform"
          >
            {t.starField?.navigate || '导航'}
          </button>
          <button
            onClick={() => {
              onCompare(galaxyData.coreWord.word, activeNode);
              setActiveNode(null);
            }}
            className="px-6 py-3 bg-black/60 backdrop-blur-md border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-colors"
          >
            {t.starField?.radar || '雷达'}
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes twinklePulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        .twinkle {
          animation: twinklePulse 2.4s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StarGalaxy3D;
