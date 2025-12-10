"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, History, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { SceneSelector } from './components/SceneSelector';
import { InputArea } from './components/InputArea';
import { CopywritingCard } from './components/CopywritingCard';
import { HistoryPanel } from './components/HistoryPanel';
import { generateCopywriting } from './services/geminiService';
import { Scene, CopywritingResult, HistoryRecord } from './types';
import { hasApiKey } from '@/lib/apiKey';
import ApiKeyButton from '@/components/ApiKeyButton';

const HISTORY_STORAGE_KEY = 'ai-copywriter-history';
const MAX_HISTORY_RECORDS = 50;

export default function AICopywriterPage() {
  const [selectedScene, setSelectedScene] = useState<Scene>('xiaohongshu_title');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CopywritingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  }, []);

  const saveHistory = useCallback((records: HistoryRecord[]) => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(records));
    } catch (err) {
      console.error('Failed to save history:', err);
    }
  }, []);

  const addToHistory = useCallback((input: string, scene: Scene, result: CopywritingResult) => {
    const newRecord: HistoryRecord = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      scene,
      input,
      result,
      timestamp: Date.now(),
    };

    setHistory(prev => {
      const updated = [newRecord, ...prev].slice(0, MAX_HISTORY_RECORDS);
      saveHistory(updated);
      return updated;
    });
  }, [saveHistory]);

  const deleteRecord = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(record => record.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, [saveHistory]);

  const clearAllHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }, []);

  const selectRecord = useCallback((record: HistoryRecord) => {
    setSelectedScene(record.scene);
    setResult(record.result);
    setError(null);
  }, []);

  const handleGenerate = async (input: string) => {
    if (!hasApiKey()) {
      setError('请先设置 API Key 才能使用 AI 文案生成功能');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiKey = localStorage.getItem('gemini_api_key') || '';
      const data = await generateCopywriting(selectedScene, input, apiKey);
      setResult(data);
      addToHistory(input, selectedScene, data);
    } catch (err) {
      setError('AI 创作失败，请稍后再试...');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-stone-900 selection:bg-rose-200 selection:text-rose-900 pb-20">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-rose-100/40 to-pink-100/40 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-violet-100/30 to-amber-100/30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-12 md:pt-20">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">返回装备库</span>
          </Link>

          <div className="flex items-center gap-3">
            <ApiKeyButton />
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="group relative"
              title="查看创作历史"
            >
              <div className="relative p-3 rounded-xl bg-white/80 border border-stone-200 hover:border-rose-300 hover:bg-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105">
                <History className="w-5 h-5 text-stone-500 group-hover:text-rose-600 transition-colors" />
                {history.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-lg">
                    {history.length > 99 ? '99+' : history.length}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Header */}
        <header className="text-center mb-12 animate-fade-in-down">
          <div className="inline-flex items-center justify-center gap-4 p-4 mb-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-stone-200/60 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-200/50">
              <Sparkles size={28} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-stone-900 via-stone-700 to-stone-900 tracking-tight">
              AI 文案大师
            </h1>
          </div>
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto font-medium leading-relaxed">
            3 秒生成爆款文案，小红书、抖音、朋友圈全搞定
          </p>
        </header>

        {/* Scene Selector */}
        <SceneSelector selected={selectedScene} onSelect={setSelectedScene} />

        {/* Input Area */}
        <InputArea scene={selectedScene} onGenerate={handleGenerate} isLoading={isLoading} />

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Results */}
        {result && <CopywritingCard variants={result.variants} tips={result.tips} />}

        <footer className="mt-24 text-center text-stone-400 text-sm pb-8">
          <p>© {new Date().getFullYear()} AI 文案大师 · Powered by 程序员老唐AI</p>
        </footer>
      </div>

      {/* History Panel */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectRecord={selectRecord}
        onDeleteRecord={deleteRecord}
        onClearAll={clearAllHistory}
      />

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}

