"use client";

import React, { useState } from 'react';
import { Copy, Check, Lightbulb } from 'lucide-react';

interface CopywritingCardProps {
  variants: string[];
  tips?: string;
}

export const CopywritingCard: React.FC<CopywritingCardProps> = ({ variants, tips }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Tips */}
      {tips && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-4 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-amber-900 mb-1">💡 创作建议</div>
            <p className="text-sm text-amber-800">{tips}</p>
          </div>
        </div>
      )}

      {/* Variants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {variants.map((variant, index) => (
          <div
            key={index}
            className="relative group bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-stone-200/60 hover:border-stone-300 hover:bg-white shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Number Badge */}
            <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white text-xs font-bold flex items-center justify-center shadow-lg">
              {index + 1}
            </div>

            {/* Content */}
            <div className="text-stone-800 leading-relaxed mb-3 pr-8 whitespace-pre-wrap">
              {variant}
            </div>

            {/* Copy Button */}
            <button
              onClick={() => handleCopy(variant, index)}
              className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
                copiedIndex === index
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100 opacity-0 group-hover:opacity-100'
              }`}
              title={copiedIndex === index ? '已复制' : '复制文案'}
            >
              {copiedIndex === index ? (
                <Check size={18} className="animate-bounce" />
              ) : (
                <Copy size={18} />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

