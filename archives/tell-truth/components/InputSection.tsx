import React, { useState, useEffect } from 'react';
import { Send, Sparkles, RefreshCcw, Dices } from 'lucide-react';

// 打工人和学生最经典的吐槽
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
    // 随机选择一条吐槽
    const randomIndex = Math.floor(Math.random() * RANDOM_COMPLAINTS.length);
    setInput(RANDOM_COMPLAINTS[randomIndex]);
    // 动画结束后重置
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
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-slate-800 rounded-2xl p-2 md:p-4 shadow-2xl border border-slate-700">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="请在这里输入你此刻的暴躁、委屈或想要吐槽的大白话...&#10;例如：'这需求变来变去的，当我是猴耍呢？我不干了！'"
            className="w-full h-32 md:h-40 bg-slate-900/50 text-slate-100 p-4 rounded-xl border border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none placeholder-slate-500 transition-all text-lg"
          />
          
          <div className="flex justify-between items-center mt-3 px-1">
            <span className="text-xs text-slate-500 hidden md:block">
              按 <code className="bg-slate-700 px-1 py-0.5 rounded text-slate-300">Cmd/Ctrl + Enter</code> 发送
            </span>
            <div className="flex items-center gap-3 ml-auto">
              {/* 试试手气按钮 */}
              <button
                onClick={handleRandomPick}
                disabled={isLoading}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95
                  ${isLoading 
                    ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-amber-500/50 hover:-translate-y-0.5'
                  }`}
                title="随机选一条经典吐槽"
              >
                <Dices 
                  size={20} 
                  className={isShaking ? 'animate-bounce' : ''} 
                />
                <span className="hidden sm:inline">试试手气</span>
              </button>
              
              {/* 转译按钮 */}
              <button
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isLoading}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95
                  ${!input.trim() || isLoading 
                    ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                    : 'bg-gradient-to-r from-primary to-secondary hover:shadow-primary/50 hover:-translate-y-0.5'
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
    </div>
  );
};

export default InputSection;