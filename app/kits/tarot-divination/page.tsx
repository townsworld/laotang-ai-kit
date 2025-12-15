"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, ArrowLeft, History, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { hasApiKey } from '@/lib/apiKey';
import ApiKeyButton from '@/components/ApiKeyButton';
import QuestionInput from './components/QuestionInput';
import SpreadSelector from './components/SpreadSelector';
import TarotCard from './components/TarotCard';
import ReadingResult from './components/ReadingResult';
import HistoryPanel from './components/HistoryPanel';
import MysticalBackground from './components/MysticalBackground';
import CandleLight from './components/CandleLight';
import MysticalRunes from './components/MysticalRunes';
import BackgroundMusic from './components/BackgroundMusic';
import ShufflingDeck from './components/ShufflingDeck';
import MoodSelector from './components/MoodSelector';
import ThemeSelector from './components/ThemeSelector';
import { MoodType, DivinationType } from './constants/personalization';
import { SpreadType, DrawnCard, ReadingResult as ReadingResultType, HistoryRecord } from './types';
import { SPREADS, drawCards, isCardReversed } from './constants/tarotData';
import { interpretReading } from './services/geminiService';

const HISTORY_STORAGE_KEY = 'tarot-divination-history';
const MAX_HISTORY_RECORDS = 50;

enum Stage {
  Input = 'input',
  Shuffling = 'shuffling',
  Drawing = 'drawing',
  Revealing = 'revealing',
  Result = 'result',
}

export default function TarotDivinationPage() {
  const [stage, setStage] = useState<Stage>(Stage.Input);
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>(SpreadType.ThreeCard);
  const [question, setQuestion] = useState('');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);
  const [result, setResult] = useState<ReadingResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodType>(MoodType.Calm);
  const [selectedTheme, setSelectedTheme] = useState<DivinationType>(DivinationType.General);

  // Load history
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
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

  const addToHistory = useCallback((question: string, result: ReadingResultType) => {
    const newRecord: HistoryRecord = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      question,
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
    setQuestion(record.question);
    setResult(record.result);
    setDrawnCards(record.result.cards);
    setRevealedCards(new Array(record.result.cards.length).fill(true));
    setStage(Stage.Result);
    setError(null);
  }, []);

  const handleStartReading = async (userQuestion: string) => {
    if (!hasApiKey()) {
      setError('请先设置 Gemini API Key 才能使用塔罗占卜功能');
      return;
    }

    setQuestion(userQuestion);
    setError(null);
    
    // Stage 1: Shuffling
    setStage(Stage.Shuffling);

    // Get spread configuration
    const spread = SPREADS.find(s => s.id === selectedSpread)!;
    const cardCount = spread.positions.length;

    // Draw cards
    const cards = drawCards(cardCount);
    const drawn: DrawnCard[] = cards.map((card, idx) => ({
      card,
      position: idx,
      isReversed: isCardReversed(),
      positionMeaning: spread.positions[idx].nameCn,
    }));

    // Shuffle for 3 seconds
    setTimeout(() => {
      setDrawnCards(drawn);
      setRevealedCards(new Array(cardCount).fill(false));
      setStage(Stage.Drawing);

      // Wait a moment for cards to appear, then move to revealing
      setTimeout(() => {
        setStage(Stage.Revealing);
      }, cardCount * 500 + 500);
    }, 3000);
  };

  const handleRevealCard = (index: number) => {
    if (revealedCards[index]) return;

    setRevealedCards(prev => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });

    // Check if all cards are revealed
    const allRevealed = revealedCards.every((revealed, idx) => 
      idx === index || revealed
    );

    if (allRevealed) {
      // All cards revealed, get AI interpretation
      setTimeout(() => {
        getInterpretation();
      }, 1000);
    }
  };

  const getInterpretation = async () => {
    setIsLoading(true);
    try {
      const apiKey = localStorage.getItem('gemini_api_key') || '';
      const { cardInterpretations, cardRelations, storyNarrative, interpretation, advice } = await interpretReading(
        question,
        selectedSpread,
        drawnCards,
        apiKey,
        selectedMood,
        selectedTheme
      );

      const readingResult: ReadingResultType = {
        question,
        spread: selectedSpread,
        cards: drawnCards,
        cardInterpretations,
        cardRelations,
        storyNarrative,
        interpretation,
        advice,
        timestamp: Date.now(),
      };

      setResult(readingResult);
      addToHistory(question, readingResult);
      setStage(Stage.Result);
    } catch (err) {
      setError('占卜解读失败，请稍后再试');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStage(Stage.Input);
    setQuestion('');
    setDrawnCards([]);
    setRevealedCards([]);
    setResult(null);
    setError(null);
    setSelectedCardIndex(null);
  };

  const handleCardClick = (index: number) => {
    if (stage === Stage.Result || stage === Stage.Revealing) {
      setSelectedCardIndex(selectedCardIndex === index ? null : index);
    }
  };

  const isCardHighlighted = (index: number): boolean => {
    if (selectedCardIndex === null) return false;
    if (index === selectedCardIndex) return true;
    
    // Highlight related cards (same number mod 7 for simple connection)
    const selectedCard = drawnCards[selectedCardIndex];
    const currentCard = drawnCards[index];
    
    // Same number or adjacent numbers
    if (Math.abs(selectedCard.card.number - currentCard.card.number) <= 1) {
      return true;
    }
    
    // Same keywords (at least one match)
    const hasCommonKeyword = selectedCard.card.keywordsCn.some(kw => 
      currentCard.card.keywordsCn.includes(kw)
    );
    
    return hasCommonKeyword;
  };

  return (
    <div className="min-h-screen bg-[#0a0519] text-white selection:bg-purple-500/30 selection:text-purple-100 pb-20">
      {/* Mystical Background Effects */}
      <MysticalBackground />
      <CandleLight />
      <MysticalRunes />
      
      {/* Ambient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-indigo-900/20 pointer-events-none" style={{ zIndex: 3 }} />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-20" style={{ zIndex: 10 }}>
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">返回装备库</span>
          </Link>

          <div className="flex items-center gap-3">
            <BackgroundMusic />
            <ApiKeyButton />
            {stage !== Stage.Input && (
              <button
                onClick={handleReset}
                className="group relative"
                title="重新开始"
              >
                <div className="relative p-3 rounded-xl bg-white/80 border border-stone-200 hover:border-purple-300 hover:bg-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <RotateCcw className="w-5 h-5 text-stone-500 group-hover:text-purple-600 group-hover:rotate-180 transition-all duration-300" />
                </div>
              </button>
            )}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="group relative"
              title="查看历史记录"
            >
              <div className="relative p-3 rounded-xl bg-white/80 border border-stone-200 hover:border-purple-300 hover:bg-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105">
                <History className="w-5 h-5 text-stone-500 group-hover:text-purple-600 transition-colors" />
                {history.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-lg">
                    {history.length > 99 ? '99+' : history.length}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Header */}
        <header className="text-center mb-12 animate-fade-in-down">
          <div className="inline-flex items-center justify-center gap-4 p-6 mb-6 bg-black/60 backdrop-blur-xl rounded-3xl border-2 border-amber-400/50 shadow-2xl shadow-purple-500/30 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-violet-600/20 to-indigo-600/20 animate-pulse-slow"></div>
            
            {/* Icon with mystical glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl blur-xl opacity-60 animate-pulse"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 flex items-center justify-center shadow-2xl shadow-amber-500/50 border-2 border-amber-300/50">
                <Sparkles size={32} className="text-white drop-shadow-lg" strokeWidth={2.5} />
              </div>
            </div>
            
            <h1 className="relative text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-purple-200 to-pink-200 tracking-tight drop-shadow-2xl">
              塔罗占卜
            </h1>
          </div>
          <p className="text-lg md:text-xl text-purple-200 max-w-2xl mx-auto font-medium leading-relaxed">
            通过神秘的塔罗牌，获得<span className="text-amber-300 font-bold">宇宙的启示</span>
            和<span className="text-pink-300 font-bold mx-1">内在的智慧</span>
          </p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-900/50 border border-red-500/50 rounded-2xl text-red-200 text-center animate-shake backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-12">
          {/* Stage 1: Input */}
          {stage === Stage.Input && (
            <div className="space-y-12 animate-fade-in-up">
              <MoodSelector
                selectedMood={selectedMood}
                onSelectMood={setSelectedMood}
              />
              <ThemeSelector
                selectedTheme={selectedTheme}
                onSelectTheme={setSelectedTheme}
              />
              <SpreadSelector
                selectedSpread={selectedSpread}
                onSelectSpread={setSelectedSpread}
              />
              <QuestionInput
                onSubmit={handleStartReading}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Stage 2: Shuffling */}
          {stage === Stage.Shuffling && <ShufflingDeck />}

          {/* Stage 3: Drawing */}
          {stage === Stage.Drawing && (
            <div className="space-y-12 animate-fade-in">
              <div className="text-center bg-black/40 backdrop-blur-md rounded-2xl p-6 max-w-2xl mx-auto shadow-2xl border border-purple-500/30">
                <h2 className="text-2xl font-bold text-amber-300 mb-2">你的问题</h2>
                <p className="text-lg text-purple-100">{question}</p>
              </div>

              {/* Cards flying in */}
              <div className={`grid gap-8 justify-items-center ${
                drawnCards.length === 1 
                  ? 'grid-cols-1' 
                  : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5'
              }`}>
                {drawnCards.map((drawnCard, index) => (
                  <div
                    key={index}
                    className="animate-fly-in"
                    style={{
                      animationDelay: `${index * 0.5}s`,
                      opacity: 0,
                      animationFillMode: 'forwards',
                    }}
                  >
                    <TarotCard
                      drawnCard={drawnCard}
                      index={index}
                      isRevealed={false}
                      isSingleCard={drawnCards.length === 1}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 3: Revealing */}
          {stage === Stage.Revealing && (
            <div className="space-y-12 animate-fade-in">
              <div className="text-center bg-black/40 backdrop-blur-md rounded-2xl p-6 max-w-2xl mx-auto shadow-2xl border border-purple-500/30">
                <h2 className="text-2xl font-bold text-amber-300 mb-2">你的问题</h2>
                <p className="text-lg text-purple-100">{question}</p>
              </div>

              <div className={`grid gap-8 justify-items-center ${
                drawnCards.length === 1 
                  ? 'grid-cols-1' 
                  : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5'
              }`}>
                {drawnCards.map((drawnCard, index) => (
                  <TarotCard
                    key={index}
                    drawnCard={drawnCard}
                    index={index}
                    isRevealed={revealedCards[index]}
                    onReveal={() => handleRevealCard(index)}
                    isHighlighted={isCardHighlighted(index)}
                    onClick={() => handleCardClick(index)}
                    isSingleCard={drawnCards.length === 1}
                  />
                ))}
              </div>

              {isLoading && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-purple-900/50 rounded-full border border-purple-500/30 backdrop-blur-md">
                    <div className="w-4 h-4 border-2 border-purple-300 border-t-amber-400 rounded-full animate-spin"></div>
                    <span className="text-purple-200 font-medium">正在解读中...</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stage 4: Result */}
          {stage === Stage.Result && result && (
            <div className="space-y-12 animate-fade-in">
              <div className="text-center bg-black/40 backdrop-blur-md rounded-2xl p-6 max-w-2xl mx-auto shadow-2xl border border-purple-500/30">
                <h2 className="text-2xl font-bold text-amber-300 mb-2">你的问题</h2>
                <p className="text-lg text-purple-100">{question}</p>
              </div>

              <div className={`grid gap-8 justify-items-center ${
                drawnCards.length === 1 
                  ? 'grid-cols-1' 
                  : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5'
              }`}>
                {drawnCards.map((drawnCard, index) => (
                  <TarotCard
                    key={index}
                    drawnCard={drawnCard}
                    index={index}
                    isRevealed={true}
                    isHighlighted={isCardHighlighted(index)}
                    onClick={() => handleCardClick(index)}
                    isSingleCard={drawnCards.length === 1}
                  />
                ))}
              </div>

              {selectedCardIndex !== null && (
                <div className="text-center animate-fade-in">
                  <p className="text-amber-300 text-sm">✨ 点击任意牌查看能量连接 · 点击同一张牌取消选择</p>
                </div>
              )}

              <ReadingResult
                cards={result.cards}
                cardInterpretations={result.cardInterpretations}
                cardRelations={result.cardRelations}
                storyNarrative={result.storyNarrative}
                interpretation={result.interpretation}
                advice={result.advice}
              />
            </div>
          )}
        </div>

        <footer className="mt-24 text-center text-purple-400/60 text-sm pb-8">
          <p>© {new Date().getFullYear()} 塔罗占卜 · Powered by 程序员老唐AI</p>
          <p className="text-xs mt-2 text-purple-400/40">仅供娱乐参考，请勿过度迷信</p>
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
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        @keyframes pulseSlower {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes flyIn {
          0% {
            opacity: 0;
            transform: translateX(-50vw) translateY(-50vh) rotate(-180deg) scale(0.3);
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translateX(0) translateY(0) rotate(0deg) scale(1);
          }
        }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-shake { animation: shake 0.5s ease-out; }
        .animate-pulse-slow { animation: pulseSlow 4s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulseSlower 6s ease-in-out infinite; }
        .animate-fly-in { animation: flyIn 1s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>
    </div>
  );
}

