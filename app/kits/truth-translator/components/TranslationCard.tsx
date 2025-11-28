"use client";

import React, { useState } from 'react';
import { TranslationMode } from '../types';
import { Briefcase, HeartHandshake, Zap, Copy, Check, Share2 } from 'lucide-react';

interface Props {
  mode: TranslationMode;
  content: string;
  delay: number;
  onShare?: (mode: TranslationMode, content: string) => void;
}

const config = {
  [TranslationMode.PROFESSIONAL]: {
    title: '🛡️ 职场防锅',
    icon: <Briefcase className="w-5 h-5" />,
    colorClass: 'bg-blue-50 border-blue-200 text-blue-900',
    iconClass: 'text-blue-600',
    btnClass: 'hover:bg-blue-100 text-blue-600',
    hoverClass: 'hover:shadow-blue-200/60 hover:border-blue-300',
  },
  [TranslationMode.HIGH_EQ]: {
    title: '🍵 顶级绿茶',
    icon: <HeartHandshake className="w-5 h-5" />,
    colorClass: 'bg-pink-50 border-pink-200 text-pink-900',
    iconClass: 'text-pink-600',
    btnClass: 'hover:bg-pink-100 text-pink-600',
    hoverClass: 'hover:shadow-pink-200/60 hover:border-pink-300',
  },
  [TranslationMode.SARCASTIC]: {
    title: '🌚 阴阳大师',
    icon: <Zap className="w-5 h-5" />,
    colorClass: 'bg-violet-50/80 border-violet-300 text-slate-800 shadow-sm',
    iconClass: 'text-violet-700',
    btnClass: 'hover:bg-violet-200 text-violet-700',
    hoverClass: 'hover:shadow-violet-200/60 hover:border-violet-400',
  },
};

const TranslationCard: React.FC<Props> = ({ mode, content, delay, onShare }) => {
  const [copied, setCopied] = useState(false);
  const { title, icon, colorClass, iconClass, btnClass, hoverClass } = config[mode];

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`relative p-8 rounded-xl border-2 transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-xl ${colorClass} ${hoverClass} animate-slide-up flex flex-col`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className={`flex items-center gap-2 font-bold text-lg ${iconClass}`}>
          {icon}
          <h3>{title}</h3>
        </div>
        <div className="flex items-center gap-1">
            {onShare && (
              <button
                onClick={() => onShare(mode, content)}
                className={`p-2 rounded-full transition-colors ${btnClass}`}
                title="生成分享图片"
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}
            <div className="relative">
                {copied && (
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg animate-fade-in z-10">
                        ✨ 文案已复制，快去发挥吧！
                    </div>
                )}
                <button
                  onClick={handleCopy}
                  className={`p-2 rounded-full transition-colors ${btnClass}`}
                  title="复制文案"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
            </div>
        </div>
      </div>
      <p className="text-base leading-relaxed whitespace-pre-wrap font-medium opacity-90">
        {content}
      </p>
    </div>
  );
};

export default TranslationCard;
