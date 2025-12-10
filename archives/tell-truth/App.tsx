import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, HeartHandshake, Smile, MessageSquareQuote, Zap, History } from 'lucide-react';
import InputSection from './components/InputSection';
import TranslationCard from './components/TranslationCard';
import HistoryPanel from './components/HistoryPanel';
import { translateText } from './services/geminiService';
import { AnalysisResult, HistoryRecord } from './types';

const HISTORY_STORAGE_KEY = 'internet-mouthpiece-history';
const MAX_HISTORY_RECORDS = 50;

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentInput, setCurrentInput] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  // 从 localStorage 加载历史记录
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

  // 保存历史记录到 localStorage
  const saveHistory = useCallback((records: HistoryRecord[]) => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(records));
    } catch (err) {
      console.error('Failed to save history:', err);
    }
  }, []);

  // 添加新记录
  const addToHistory = useCallback((input: string, result: AnalysisResult) => {
    const newRecord: HistoryRecord = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
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

  // 删除单条记录
  const deleteRecord = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(record => record.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, [saveHistory]);

  // 清空所有记录
  const clearAllHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }, []);

  // 选择历史记录
  const selectRecord = useCallback((record: HistoryRecord) => {
    setCurrentInput(record.input);
    setResult(record.result);
    setError(null);
  }, []);

  const handleTranslate = async (text: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCurrentInput(text);

    try {
      const data = await translateText(text);
      setResult(data);
      // 保存到历史记录
      addToHistory(text, data);
    } catch (err) {
      setError("AI 似乎也在思考人生，请稍后再试...");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-slate-200 selection:bg-secondary selection:text-white pb-20">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-12 md:pt-20">
        {/* History Button - Fixed Position */}
        <button
          onClick={() => setIsHistoryOpen(true)}
          className="fixed top-4 right-4 md:top-6 md:right-6 z-30 group"
          title="查看历史记录"
        >
          <div className="relative p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105">
            <History className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-lg">
                {history.length > 99 ? '99+' : history.length}
              </span>
            )}
          </div>
        </button>

        {/* Header */}
        <header className="text-center mb-12 animate-fade-in-down">
          <div className="inline-flex items-center justify-center p-3 mb-6 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
            <MessageSquareQuote size={40} className="text-secondary mr-3" />
            <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
              互联网嘴替
            </h1>
          </div>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            把你的<span className="text-secondary font-bold">大白话</span>瞬间变成
            <span className="text-blue-400 font-bold mx-1">职场黑话</span>、
            <span className="text-green-400 font-bold mx-1">顶级绿茶</span>和
            <span className="text-purple-400 font-bold mx-1">阴阳怪气</span>。
          </p>
        </header>

        {/* Input */}
        <InputSection onTranslate={handleTranslate} isLoading={isLoading} />

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 text-center animate-shake">
            {error}
          </div>
        )}

        {/* Loading State Skeleton (Optional visual flair if needed, but button shows loading) */}
        
        {/* Results */}
        {result && (
          <div className="space-y-10">
            {/* Analysis Banner */}
            <div className="max-w-4xl mx-auto animate-zoom-in">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Zap size={120} />
                </div>
                <div className="shrink-0 bg-yellow-500/10 p-4 rounded-full border border-yellow-500/20">
                  <Zap className="text-yellow-400 w-8 h-8 md:w-10 md:h-10" />
                </div>
                <div className="text-center md:text-left z-10">
                  <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">情绪成分诊断</h3>
                  <p className="text-xl md:text-2xl text-white font-bold leading-relaxed">
                    “{result.analysis}”
                  </p>
                </div>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <TranslationCard
                title="职场防锅"
                icon={<Briefcase size={24} />}
                content={result.translations.professional}
                colorClass="text-blue-400"
                bgClass="bg-slate-800/80 hover:bg-slate-800"
                delay={100}
              />
              <TranslationCard
                title="顶级绿茶"
                icon={<HeartHandshake size={24} />}
                content={result.translations.high_eq}
                colorClass="text-green-400"
                bgClass="bg-slate-800/80 hover:bg-slate-800"
                delay={300}
              />
              <TranslationCard
                title="阴阳大师"
                icon={<Smile size={24} />}
                content={result.translations.sarcastic}
                colorClass="text-purple-400"
                bgClass="bg-slate-800/80 hover:bg-slate-800"
                delay={500}
              />
            </div>
          </div>
        )}
        
        <footer className="mt-24 text-center text-slate-600 text-sm pb-8">
          <p>© {new Date().getFullYear()} 互联网嘴替实验室 · Powered by 程序员老唐AI</p>
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

      {/* Global CSS for animations */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .animate-zoom-in { animation: zoomIn 0.5s ease-out; }
      `}</style>
    </div>
  );
}

export default App;