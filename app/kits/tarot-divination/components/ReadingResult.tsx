"use client";

import React, { useState } from 'react';
import { BookOpen, Lightbulb, Link2, Layers, BookMarked } from 'lucide-react';

interface ReadingResultProps {
  cards?: Array<{ card: { nameCn: string }, position: number }>;
  cardInterpretations?: string[];
  cardRelations?: string;
  storyNarrative?: string;
  interpretation: string;
  advice: string;
}

// Helper function to parse markdown-style bold text
function parseMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2);
      return <strong key={index} className="text-amber-300 font-bold">{content}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

export default function ReadingResult({ cards, cardInterpretations, cardRelations, storyNarrative, interpretation, advice }: ReadingResultProps) {
  const [expandedLayer, setExpandedLayer] = useState<'cards' | 'relations' | 'story' | 'all'>('story');

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Layer Toggle */}
      {cardInterpretations && cardInterpretations.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => setExpandedLayer('story')}
            className={`px-4 py-2 rounded-xl transition-all ${
              expandedLayer === 'story'
                ? 'bg-rose-500 text-white shadow-lg'
                : 'bg-black/40 text-rose-300 border border-rose-500/30 hover:bg-rose-900/50'
            }`}
          >
            <BookMarked className="w-4 h-4 inline mr-2" />
            故事叙事
          </button>
          <button
            onClick={() => setExpandedLayer(expandedLayer === 'cards' ? 'story' : 'cards')}
            className={`px-4 py-2 rounded-xl transition-all ${
              expandedLayer === 'cards'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-black/40 text-purple-300 border border-purple-500/30 hover:bg-purple-900/50'
            }`}
          >
            <Layers className="w-4 h-4 inline mr-2" />
            单牌解读
          </button>
          <button
            onClick={() => setExpandedLayer(expandedLayer === 'relations' ? 'story' : 'relations')}
            className={`px-4 py-2 rounded-xl transition-all ${
              expandedLayer === 'relations'
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'bg-black/40 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900/50'
            }`}
          >
            <Link2 className="w-4 h-4 inline mr-2" />
            能量关联
          </button>
          <button
            onClick={() => setExpandedLayer('all')}
            className="px-4 py-2 rounded-xl bg-black/40 text-amber-300 border border-amber-500/30 hover:bg-amber-900/50 transition-all"
          >
            查看全部
          </button>
        </div>
      )}

      {/* Story Narrative */}
      {storyNarrative && (expandedLayer === 'story' || expandedLayer === 'all') && (
        <div className="bg-gradient-to-br from-rose-900/60 to-pink-900/60 rounded-3xl p-8 border-2 border-rose-500/30 shadow-2xl shadow-rose-500/20 backdrop-blur-md animate-fade-in relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 text-9xl opacity-5 pointer-events-none">📖</div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-rose-500 rounded-xl shadow-lg">
                <BookMarked className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-rose-100">你的塔罗故事</h3>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-rose-100 leading-relaxed text-lg italic border-l-4 border-rose-400/50 pl-6">
                {parseMarkdown(storyNarrative)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Individual Card Interpretations */}
      {cardInterpretations && cardInterpretations.length > 0 && (expandedLayer === 'cards' || expandedLayer === 'all') && (
        <div className="space-y-3 animate-fade-in">
          <h3 className="text-xl font-bold text-purple-200 flex items-center gap-2">
            <Layers className="w-5 h-5" />
            每张牌的独立解读
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cardInterpretations.map((interp, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl p-4 border border-purple-500/20 shadow-lg backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  {cards && cards[index] && (
                    <h4 className="text-amber-300 font-bold text-sm">
                      {cards[index].card.nameCn}
                    </h4>
                  )}
                </div>
                <p className="text-purple-100 text-sm leading-relaxed">
                  {parseMarkdown(interp)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card Relations */}
      {cardRelations && (expandedLayer === 'relations' || expandedLayer === 'all') && (
        <div className="bg-gradient-to-br from-indigo-900/60 to-blue-900/60 rounded-3xl p-6 border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/20 backdrop-blur-md animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-500 rounded-xl shadow-lg">
              <Link2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-indigo-100">牌面能量关联</h3>
          </div>
          <p className="text-indigo-100 leading-relaxed">
            {parseMarkdown(cardRelations)}
          </p>
        </div>
      )}

      {/* Interpretation */}
      <div className="bg-gradient-to-br from-purple-900/60 to-violet-900/60 rounded-3xl p-8 border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-purple-100">综合解读</h3>
        </div>
        <p className="text-purple-100 leading-relaxed whitespace-pre-wrap">
          {parseMarkdown(interpretation)}
        </p>
      </div>

      {/* Advice */}
      <div className="bg-gradient-to-br from-amber-900/60 to-orange-900/60 rounded-3xl p-8 border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-amber-500 rounded-xl shadow-lg">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-amber-100">建议与指引</h3>
        </div>
        <p className="text-amber-100 leading-relaxed whitespace-pre-wrap">
          {parseMarkdown(advice)}
        </p>
      </div>
    </div>
  );
}
