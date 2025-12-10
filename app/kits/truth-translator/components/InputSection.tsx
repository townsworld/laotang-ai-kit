"use client";

import React, { useState } from 'react';
import { Sparkles, RefreshCcw, Dices } from 'lucide-react';

const RANDOM_COMPLAINTS = [
  "这需求变来变去的，当我是猴耍呢？我不干了！",
  "又要加班，这点工资配吗？我的时间不是时间？",
  "领导天天画饼，我都能开连锁面包店了",
  "开会开了两小时，其实一句话就能说完的事",
  "说好的弹性工作制，结果弹性的只有我的神经和发际线",
  "ddl是第一生产力，但我的头发和健康是代价",
  "这作业明天就要交？现在才说？你是魔鬼吗？",
  "周末还要回消息处理工作，我的私人时间呢？",
  "为什么简单的事情非要搞这么复杂，显得你很专业？",
  "别人上班是上班，我上班是上坟，心态已经凉透了",
];

interface InputSectionProps {
  onTranslate: (text: string) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onTranslate, isLoading }) => {
  const [input, setInput] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleRandomPick = () => {
    setIsShaking(true);
    const randomIndex = Math.floor(Math.random() * RANDOM_COMPLAINTS.length);
    setInput(RANDOM_COMPLAINTS[randomIndex]);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim() && !isLoading) {
      onTranslate(input);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-xl shadow-stone-200/50 border border-stone-200/60">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="请在这里输入你此刻的暴躁、委屈或想要吐槽的大白话...&#10;例如：'这需求变来变去的，当我是猴耍呢？我不干了！'"
          className="w-full h-32 md:h-40 bg-stone-50 text-stone-900 p-4 rounded-2xl border border-stone-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-200 outline-none resize-none placeholder-stone-400 transition-all text-lg"
        />
        
        <div className="flex justify-between items-center mt-4 px-1">
          <span className="text-xs text-stone-400 hidden md:block">
            按 <code className="bg-stone-200 px-2 py-1 rounded text-stone-600 font-medium">Cmd/Ctrl + Enter</code> 发送
          </span>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={handleRandomPick}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold shadow-lg transition-all transform active:scale-95
                ${isLoading 
                  ? 'bg-stone-200 cursor-not-allowed text-stone-400' 
                  : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white hover:from-amber-500 hover:to-orange-500 hover:shadow-xl hover:shadow-amber-200/50 hover:-translate-y-0.5'
                }`}
              title="随机选一条经典吐槽"
            >
              <Dices 
                size={20} 
                className={isShaking ? 'animate-bounce' : ''} 
              />
              <span className="hidden sm:inline">试试手气</span>
            </button>
            
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all transform active:scale-95
                ${!input.trim() || isLoading 
                  ? 'bg-stone-200 cursor-not-allowed text-stone-400' 
                  : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 hover:shadow-xl hover:shadow-rose-200/50 hover:-translate-y-0.5'
                }`}
            >
              {isLoading ? (
                <>
                  <RefreshCcw className="animate-spin" size={20} />
                  <span>正在疯狂运转...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>立即转译</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSection;
