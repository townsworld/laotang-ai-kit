"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
}

// 优化的木鱼敲击声音 - 更接近真实木鱼的声音
const playWoodenFishSound = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  const t = ctx.currentTime;

  // 创建多个振荡器来模拟木鱼的复杂音色
  const oscillator1 = ctx.createOscillator();
  const oscillator2 = ctx.createOscillator();
  const oscillator3 = ctx.createOscillator();
  
  const gainNode = ctx.createGain();
  const filterNode = ctx.createBiquadFilter();

  // 混音器
  const gain1 = ctx.createGain();
  const gain2 = ctx.createGain();
  const gain3 = ctx.createGain();

  oscillator1.connect(gain1);
  oscillator2.connect(gain2);
  oscillator3.connect(gain3);
  
  gain1.connect(filterNode);
  gain2.connect(filterNode);
  gain3.connect(filterNode);
  
  filterNode.connect(gainNode);
  gainNode.connect(ctx.destination);

  // 木鱼的音色：基频 + 谐波
  const variance = Math.random() * 30 - 15;
  oscillator1.frequency.setValueAtTime(520 + variance, t); // 基频
  oscillator2.frequency.setValueAtTime(1040 + variance * 2, t); // 二次谐波
  oscillator3.frequency.setValueAtTime(280 + variance * 0.5, t); // 低频共鸣
  
  oscillator1.type = 'triangle';
  oscillator2.type = 'sine';
  oscillator3.type = 'sine';

  // 设置各振荡器的音量比例
  gain1.gain.setValueAtTime(0.5, t);
  gain2.gain.setValueAtTime(0.2, t);
  gain3.gain.setValueAtTime(0.3, t);

  // 低通滤波器模拟木质音色
  filterNode.type = 'lowpass';
  filterNode.frequency.setValueAtTime(2000, t);
  filterNode.frequency.exponentialRampToValueAtTime(800, t + 0.1);

  // 短促的敲击包络
  gainNode.gain.setValueAtTime(0, t);
  gainNode.gain.linearRampToValueAtTime(0.8, t + 0.005); // 快速上升
  gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.12); // 快速衰减

  oscillator1.start(t);
  oscillator2.start(t);
  oscillator3.start(t);
  
  oscillator1.stop(t + 0.15);
  oscillator2.stop(t + 0.15);
  oscillator3.stop(t + 0.15);
};

// 背景组件
const NeonBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* 动态紫色光晕 */}
      <motion.div
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px]"
      />

      {/* 赛博格子地板 */}
      <div 
        className="absolute bottom-0 w-full h-1/2 opacity-20"
        style={{
          background: `
            linear-gradient(transparent 0%, rgba(168, 85, 247, 0.3) 100%),
            linear-gradient(90deg, rgba(168, 85, 247, 0.15) 1px, transparent 1px),
            linear-gradient(0deg, rgba(168, 85, 247, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'perspective(600px) rotateX(60deg) scale(2)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* 顶部装饰网格 */}
      <div 
        className="absolute top-0 w-full h-1/3 opacity-10"
        style={{
          background: `linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                      linear-gradient(180deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          transform: 'perspective(600px) rotateX(-60deg) scale(2)',
          transformOrigin: 'top center',
        }}
      />
    </div>
  );
};

// 计数器显示组件
const CounterDisplay: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className="absolute top-12 left-0 right-0 flex flex-col items-center justify-center z-20 pointer-events-none">
      <div className="relative px-8 py-4 bg-slate-900/90 border border-purple-500/50 rounded-lg shadow-[0_0_30px_rgba(168,85,247,0.4)] backdrop-blur-md">
        <h1 className="text-purple-300 text-sm md:text-base font-mono uppercase tracking-widest mb-1 opacity-80">
          功德计数器 System Merit Counter
        </h1>
        <div className="flex items-center justify-center space-x-3">
          <span className="text-cyan-400 text-lg font-medium">今日功德：</span>
          <motion.span 
            key={count}
            initial={{ y: -5, opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-white tabular-nums drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]"
          >
            {count.toString().padStart(6, '0')}
          </motion.span>
        </div>
        
        {/* 装饰角 */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-purple-400 -mt-1 -ml-1 animate-pulse" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-purple-400 -mt-1 -mr-1 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-purple-400 -mb-1 -ml-1 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-purple-400 -mb-1 -mr-1 animate-pulse" />
      </div>
    </div>
  );
};

// 漂浮文字层组件
const FloatingTextLayer: React.FC<{
  items: FloatingText[];
  onComplete: (id: number) => void;
}> = ({ items, onComplete }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, y: item.y - 20, x: item.x }}
            animate={{ opacity: 0, y: item.y - 150 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            onAnimationComplete={() => onComplete(item.id)}
            className="absolute text-cyan-300 font-bold text-2xl whitespace-nowrap"
            style={{ 
              textShadow: '0 0 15px rgba(34, 211, 238, 1), 0 0 30px rgba(34, 211, 238, 0.5)',
              fontFamily: 'monospace'
            }}
          >
            {item.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// 真实木鱼组件 - 使用真实木鱼图片
const CyberWoodenFish: React.FC<{
  onClick: (e: React.MouseEvent | React.TouchEvent) => void;
}> = ({ onClick }) => {
  return (
    <div className="relative flex justify-center items-center">
      {/* 外部光环 */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute w-96 h-96 rounded-full border-2 border-cyan-500/30 bg-cyan-500/5 blur-xl"
      />

      {/* 木鱼主体按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="relative z-10 group focus:outline-none touch-manipulation cursor-pointer"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {/* 真实木鱼图片 */}
        <div className="relative active:scale-90 transition-transform duration-150">
          <Image
            src="/cyber-fish.png"
            alt="赛博木鱼"
            width={288}
            height={288}
            className="w-64 md:w-72 h-auto drop-shadow-[0_0_20px_rgba(6,182,212,0.6)] group-hover:drop-shadow-[0_0_30px_rgba(168,85,247,0.7)] transition-all duration-300 mix-blend-screen"
            priority
          />
          
          {/* 能量脉冲效果 */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-cyan-400/20 blur-xl pointer-events-none"
          />
        </div>

        {/* 木鱼底座阴影 */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-64 md:w-72 h-8 bg-gradient-to-b from-slate-900/40 to-slate-950/80 rounded-[50%] blur-lg" />

        {/* 标签文字 */}
        <div className="absolute top-full mt-6 left-0 w-full text-center">
          <motion.span 
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm text-cyan-400 tracking-[0.3em] font-mono block mb-2"
          >
            CYBER_MUYU_2077
          </motion.span>
          <span className="text-xs text-purple-500/60 tracking-widest font-mono">
            [ 电子木鱼 功德无量 ]
          </span>
        </div>
      </motion.button>
    </div>
  );
};

// 主页面组件
export default function CyberMuyuPage() {
  const [count, setCount] = useState<number>(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    // 播放声音
    playWoodenFishSound();

    // 增加计数
    setCount(prev => prev + 1);

    // 添加漂浮文字
    const texts = ['功德 +1', '南无阿弥陀佛', '善哉善哉', '福报 +1', '智慧 +1'];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    
    const newText: FloatingText = {
      id: Date.now() + Math.random(),
      x: clientX,
      y: clientY,
      text: randomText
    };

    setFloatingTexts(prev => [...prev, newText]);
  }, []);

  const handleTextComplete = useCallback((id: number) => {
    setFloatingTexts(prev => prev.filter(item => item.id !== id));
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-cyan-500/30">
      <NeonBackground />
      
      {/* 返回按钮 */}
      <div className="absolute top-6 left-6 z-30">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/80 border border-cyan-500/30 rounded-lg text-cyan-400 hover:text-cyan-300 hover:border-cyan-400 transition-all backdrop-blur-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-sm">返回装备库</span>
        </Link>
      </div>

      <CounterDisplay count={count} />

      <main className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="mb-16">
          <CyberWoodenFish onClick={handleInteraction} />
        </div>
        
        {/* 提示文字 */}
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center space-y-2"
        >
          <div className="text-sm font-mono tracking-widest text-cyan-300">
            点击木鱼 · 积累功德
          </div>
          <div className="text-xs text-purple-400/60 tracking-wider">
            TAP THE WOODEN FISH TO ACCUMULATE MERIT
          </div>
        </motion.div>
      </main>

      <FloatingTextLayer 
        items={floatingTexts} 
        onComplete={handleTextComplete} 
      />

      {/* 底部装饰 */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
        <div className="text-[10px] text-slate-600 font-mono tracking-widest">
          SYSTEM_STATUS: ONLINE // VERSION: 2.0.77
        </div>
      </div>
    </div>
  );
}

