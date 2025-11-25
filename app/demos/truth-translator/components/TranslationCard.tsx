"use client";

import React, { useState } from 'react';
import { TranslationMode } from '../types';
import { Briefcase, HeartHandshake, Zap, Copy, Check } from 'lucide-react';

interface Props {
  mode: TranslationMode;
  content: string;
  delay: number;
}

const config = {
  [TranslationMode.PROFESSIONAL]: {
    title: '🛡️ 职场防锅',
    icon: <Briefcase className="w-5 h-5" />,
    colorClass: 'bg-blue-50 border-blue-200 text-blue-900',
    iconClass: 'text-blue-600',
    btnClass: 'hover:bg-blue-100 text-blue-600',
  },
  [TranslationMode.HIGH_EQ]: {
    title: '🍵 顶级绿茶',
    icon: <HeartHandshake className="w-5 h-5" />,
    colorClass: 'bg-pink-50 border-pink-200 text-pink-900',
    iconClass: 'text-pink-600',
    btnClass: 'hover:bg-pink-100 text-pink-600',
  },
  [TranslationMode.SARCASTIC]: {
    title: '🌚 阴阳大师',
    icon: <Zap className="w-5 h-5" />,
    colorClass: 'bg-slate-50 border-slate-300 text-slate-800',
    iconClass: 'text-slate-600',
    btnClass: 'hover:bg-slate-200 text-slate-600',
  },
};

const TranslationCard: React.FC<Props> = ({ mode, content, delay }) => {
  const [copied, setCopied] = useState(false);
  const { title, icon, colorClass, iconClass, btnClass } = config[mode];

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`relative p-8 rounded-xl border-2 shadow-sm transition-all duration-500 transform hover:scale-[1.02] ${colorClass} animate-slide-up flex flex-col`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className={`flex items-center gap-2 font-bold text-lg ${iconClass}`}>
          {icon}
          <h3>{title}</h3>
        </div>
        <div className="relative">
            {copied && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg animate-fade-in z-10">
                    ✨ 文案已复制，快去发挥吧！
                </div>
            )}
            <button
              onClick={handleCopy}
              className={`p-2 rounded-full transition-colors ${btnClass}`}
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
        </div>
      </div>
      <p className="text-base leading-relaxed whitespace-pre-wrap font-medium opacity-90">
        {content}
      </p>
    </div>
  );
};

export default TranslationCard;