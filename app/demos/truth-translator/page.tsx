"use client";

import React, { useState } from 'react';
import { translateText } from './services/geminiService';
import { TranslationResult, TranslationMode } from './types';
import TranslationCard from './components/TranslationCard';
import { Sparkles, ArrowRight, AlertCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TruthTranslatorPage() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await translateText(inputText);
      setResult(data);
    } catch (err) {
      setError("分析失败，请稍后再试。(Analysis failed)");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleTranslate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 text-slate-800 font-sans selection:bg-indigo-100">
      {/* 返回按钮 */}
      <div className="absolute top-6 left-6 z-30">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 rounded-lg text-indigo-600 hover:text-indigo-700 hover:border-indigo-400 transition-all shadow-sm hover:shadow-md group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">返回装备库</span>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight mb-2">
            互联网嘴替 | 真话翻译机
          </h1>
          <h2 className="text-xl font-bold text-slate-400 mb-4 tracking-wide">
            Internet Mouthpiece
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">
            把你的大实话、心里话、难听话，变成职场得体、高情商或阴阳怪气的神回复。
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 mb-10 border border-slate-100 animate-slide-up">
          <div className="relative">
            <label htmlFor="input" className="block text-sm font-semibold text-slate-700 mb-2">
              你的心里话 (Inner Truth)
            </label>
            <div className="relative">
               <textarea
                id="input"
                className="w-full h-40 p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all resize-none text-lg text-slate-800 placeholder-slate-400 focus:outline-none"
                placeholder="例如：这破会开得没完没了，老子想回家... (Example: This meeting is useless...)"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="absolute bottom-4 right-4 text-xs text-slate-400 pointer-events-none">
                ⌘ + Enter 发送
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleTranslate}
              disabled={isLoading || !inputText.trim()}
              className={`
                group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white rounded-xl shadow-md transition-all duration-200
                ${isLoading || !inputText.trim() 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                }
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  正在翻译...
                </>
              ) : (
                <>
                  一键翻译 <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center text-red-600 animate-fade-in">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-fade-in">
            {/* Analysis Banner - Updated to Yellow/Warning Style */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-sm flex items-start">
              <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-yellow-800 text-sm tracking-wide mb-1">当前情绪诊断</h4>
                <p className="text-yellow-900 font-medium">{result.analysis}</p>
              </div>
            </div>

            {/* Cards Grid - Ensuring vertical stack on mobile via grid-cols-1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TranslationCard 
                mode={TranslationMode.PROFESSIONAL} 
                content={result.translations.professional} 
                delay={100}
              />
              <TranslationCard 
                mode={TranslationMode.HIGH_EQ} 
                content={result.translations.high_eq} 
                delay={200}
              />
              <TranslationCard 
                mode={TranslationMode.SARCASTIC} 
                content={result.translations.sarcastic} 
                delay={300}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

