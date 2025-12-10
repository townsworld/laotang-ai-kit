"use client";

import React from 'react';
import { Copy, Check } from 'lucide-react';

interface TranslationCardProps {
  title: string;
  icon: React.ReactNode;
  content: string;
  colorClass: string;
  bgClass: string;
  delay: number;
}

const TranslationCard: React.FC<TranslationCardProps> = ({ title, icon, content, colorClass, bgClass, delay }) => {
  const [copied, setCopied] = React.useState(false);

  // 从 colorClass 提取颜色名称
  const getColorName = (colorClass: string) => {
    // colorClass 格式: "text-blue-600"
    const match = colorClass.match(/text-(\w+)-(\d+)/);
    if (match) {
      return { color: match[1], shade: match[2] }; // { color: "blue", shade: "600" }
    }
    return { color: 'stone', shade: '600' };
  };

  const { color, shade } = getColorName(colorClass);

  const handleCopy = () => {
    const cleanText = content.replace(/\*\*/g, '');
    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 高亮背景色
  const getHighlightBgClass = () => {
    switch(color) {
      case 'blue':
        return 'bg-blue-50';
      case 'emerald':
        return 'bg-emerald-50';
      case 'purple':
        return 'bg-purple-50';
      default:
        return 'bg-stone-50';
    }
  };

  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span 
            key={index} 
            className={`font-bold ${colorClass} ${getHighlightBgClass()} px-1.5 py-0.5 rounded mx-0.5`}
          >
            {part.slice(2, -2)}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // 根据颜色设置图标背景和边框
  const getIconBgClass = () => {
    switch(color) {
      case 'blue':
        return 'bg-blue-50 border-blue-100';
      case 'emerald':
        return 'bg-emerald-50 border-emerald-100';
      case 'purple':
        return 'bg-purple-50 border-purple-100';
      default:
        return 'bg-stone-50 border-stone-100';
    }
  };

  // 装饰性渐变背景色
  const getDecorationBgClass = () => {
    switch(color) {
      case 'blue':
        return 'bg-blue-400';
      case 'emerald':
        return 'bg-emerald-400';
      case 'purple':
        return 'bg-purple-400';
      default:
        return 'bg-stone-400';
    }
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl border border-stone-200/60 ${bgClass} backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${getIconBgClass()} border`}>
            <div className={colorClass}>
              {icon}
            </div>
          </div>
          <h3 className={`text-xl font-bold ${colorClass}`}>{title}</h3>
        </div>
        <button
          onClick={handleCopy}
          className={`p-2.5 rounded-xl transition-all ${
            copied 
              ? 'bg-emerald-50 text-emerald-600' 
              : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
          }`}
          title={copied ? "已复制" : "复制内容"}
        >
          {copied ? (
            <Check size={18} className="animate-bounce" />
          ) : (
            <Copy size={18} />
          )}
        </button>
      </div>
      
      <div className="text-stone-700 leading-relaxed text-base tracking-wide whitespace-pre-wrap">
        {renderContent(content)}
      </div>

      {/* Decorative gradient */}
      <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-10 ${getDecorationBgClass()}`}></div>
    </div>
  );
};

export default TranslationCard;
