"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Layout } from './components/Layout';
import { SearchInput } from './components/SearchInput';
import { WordCard } from './components/WordCard';
import { DerivativesModal } from './components/DerivativesModal';
import { VirtualGallery } from './components/VirtualGallery';
import { WordAssociationBoard } from './components/WordAssociationBoard';
import { analyzeWord, generateWordImage, compareWords, quickAnalyzeWord } from './services/geminiService';
import { getCollection, saveToCollection } from './services/storageService';
import { AppState, ImageStyle } from './types';
import { TRANSLATIONS } from './constants/translations';
import { getStoredApiKey } from '@/lib/apiKey';

const HolographicRadar3D = dynamic(
  () => import('./components/HolographicRadar3D'),
  { ssr: false }
);

export default function LexiconArtistryPage() {
  const [state, setState] = useState<AppState>({
    language: 'cn',
    view: 'home',
    status: 'idle',
    data: null,
    imageUrl: null,
    error: null,
    explorationStatus: 'idle',
    derivativesStatus: 'idle',
    comparisonStatus: 'idle',
    comparisonData: null,
    collection: []
  });

  const [hasApiKey, setHasApiKey] = useState(false);
  const [exploreWord, setExploreWord] = useState<string>('');

  // Check API key on mount
  useEffect(() => {
    setHasApiKey(!!getStoredApiKey());
  }, []);

  // Load collection when entering gallery view
  useEffect(() => {
    if (state.view === 'gallery') {
        const loadCollection = async () => {
            const savedWords = await getCollection();
            setState(prev => ({ ...prev, collection: savedWords }));
        };
        loadCollection();
    }
  }, [state.view]);

  const handleApiKeyChange = (apiKey: string) => {
    setHasApiKey(!!apiKey);
    // Clear previous error if it was about API Key
    if (apiKey && state.error?.includes('API Key')) {
      setState(prev => ({ ...prev, error: null }));
    }
  };

  const toggleLanguage = () => {
    setState(prev => ({
        ...prev,
        language: prev.language === 'en' ? 'cn' : 'en'
    }));
  };

  const handleSearch = async (word: string, style: ImageStyle) => {
    const currentApiKey = getStoredApiKey();
    if (!currentApiKey) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: "请先点击右上角的钥匙图标设置 Gemini API Key"
      }));
      return;
    }

    // Reset state for new search
    setState(prev => ({ 
      ...prev, 
      view: 'home',
      status: 'analyzing', 
      error: null, 
      data: null, 
      imageUrl: null,
      explorationStatus: 'idle',
      derivativesStatus: 'idle',
      comparisonStatus: 'idle',
      comparisonData: null
    }));

    try {
      // Step 1: Consolidated Analysis (Text + Concepts + Derivatives + Timeline)
      const analysisData = await analyzeWord(word, style);
      
      setState(prev => ({
        ...prev,
        status: 'generating_image',
        data: analysisData,
      }));

      // Step 2: Image Generation (Separate Model)
      const imageBase64 = await generateWordImage(analysisData.nano_banana_image_prompt);
      
      setState(prev => {
          if (prev.data?.word === analysisData.word) {
              return { ...prev, status: 'success', imageUrl: imageBase64 };
          }
          return prev;
      });

      // Step 3: Auto-save to gallery (history)
      try {
        await saveToCollection({
          ...analysisData,
          imageUrl: imageBase64,
          timestamp: Date.now()
        });
        console.log(`Word "${analysisData.word}" auto-saved to gallery`);
      } catch (error) {
        console.error("Failed to auto-save to gallery:", error);
        // Don't block the UI if save fails
      }

    } catch (error: any) {
      console.error(error);
      const t = TRANSLATIONS[state.language];
      setState(prev => ({
        ...prev,
        status: 'error',
        error: t.home.error_prefix + (error.message || "Unknown error"),
      }));
    }
  };

  const handleExplore = async () => {
    if (!state.data) {
      console.error('[Explore] No data available');
      return;
    }

    const t = TRANSLATIONS[state.language];
    setExploreWord(state.data.word);
    setState(prev => ({ ...prev, explorationStatus: 'active', error: null }));

    // 如果已有联想数据，直接展示
    if (state.data.related_concepts && state.data.related_concepts.length > 0) {
      return;
    }

    try {
      const quick = await quickAnalyzeWord(state.data.word);
      setState(prev => ({
        ...prev,
        data: prev.data ? {
          ...prev.data,
          related_concepts: quick.related_concepts,
          phonetic: prev.data.phonetic || quick.phonetic,
          meaning_cn: prev.data.meaning_cn || quick.meaning_cn,
        } : quick,
      }));
    } catch (error: any) {
      console.error('[Explore] Quick association failed:', error);
      setState(prev => ({
        ...prev,
        explorationStatus: 'idle',
        status: 'error',
        error: t.home.error_prefix + (error.message || "Unknown error"),
      }));
    }
  };

  const handleCompare = async (wordA: string, wordB: string) => {
    setState(prev => ({ ...prev, comparisonStatus: 'analyzing' }));
    try {
        const data = await compareWords(wordA, wordB, state.language);
        setState(prev => ({ ...prev, comparisonStatus: 'success', comparisonData: data }));
    } catch (e) {
        console.error("Comparison failed", e);
        setState(prev => ({ ...prev, comparisonStatus: 'error' }));
    }
  };

  const resetComparison = () => {
      setState(prev => ({ ...prev, comparisonStatus: 'idle', comparisonData: null }));
  };

  const handleCloseExplore = () => {
    setExploreWord('');
    setState(prev => {
      // 如果data存在但没有词源数据，说明是快速联想模式，需要清空
      const isQuickMode = prev.data && !prev.data.etymology_cn;
      
      return { 
        ...prev, 
        explorationStatus: 'idle', 
        comparisonStatus: 'idle', 
        comparisonData: null,
        // 只有快速模式才清空data，完整解析的数据要保留
        ...(isQuickMode ? { data: null, status: 'idle' } : {})
      };
    });
  };

  const handleDerivatives = () => {
    if (state.data?.derivatives) {
        setState(prev => ({ 
          ...prev, 
          derivativesStatus: 'active',
          // 保存当前状态，以便返回时恢复
        }));
    }
  };

  const handleCloseDerivatives = () => {
      setState(prev => ({ 
        ...prev, 
        derivativesStatus: 'idle'
      }));
  };

  // 快速探索星系（不需要完整解析）
  const handleQuickExplore = async (word: string) => {
    const currentApiKey = getStoredApiKey();
    if (!currentApiKey) {
      alert("请先设置 API Key");
      return;
    }

    console.log('[QuickExplore] Starting quick association for:', word);
    setExploreWord(word);
    setState(prev => ({ 
      ...prev, 
      view: 'home',
      status: 'idle',
      error: null, 
      data: null,
      imageUrl: null,
      comparisonStatus: 'idle',
      comparisonData: null,
      explorationStatus: 'active'
    }));

    try {
      // 1. 快速获取轻量级联想数据
      const minimalAnalysis = await quickAnalyzeWord(word);

      // 2. 数据准备就绪，更新 state
      setState(prev => ({
        ...prev,
        data: minimalAnalysis,
      }));
    } catch (error: any) {
      console.error('[QuickExplore] Failed:', error);
      setState(prev => ({
        ...prev,
        explorationStatus: 'idle',
        status: 'error',
        error: "词汇联想失败: " + (error.message || "Unknown error")
      }));
    }
  };

  const handleNavigate = (view: 'home' | 'gallery') => {
      setState(prev => ({ ...prev, view }));
  };

  const t = TRANSLATIONS[state.language];

  return (
    <Layout 
      currentView={state.view} 
      onNavigate={handleNavigate} 
      lang={state.language} 
      onToggleLanguage={toggleLanguage}
      onApiKeyChange={handleApiKeyChange}
    >
      
      {state.view === 'gallery' ? (
        <VirtualGallery 
            collection={state.collection} 
            onClose={() => handleNavigate('home')}
            lang={state.language}
        />
      ) : (
        /* Home View */
        <div className="w-full flex flex-col items-center animate-fade-in">
            
            {/* Intro */}
            {state.status === 'idle' && state.explorationStatus === 'idle' && state.derivativesStatus === 'idle' && state.comparisonStatus === 'idle' && (
            <div className="mb-6 md:mb-8 mt-8 md:mt-12 max-w-2xl w-full mx-auto px-2">
                <div className="bg-white/30 backdrop-blur-md border border-white/40 p-6 md:p-10 lg:p-14 rounded-xl md:rounded-2xl shadow-sm text-center transform transition-all hover:bg-white/40">
                <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-stone-700 italic leading-snug">
                    {t.home.quote}
                </p>
                <div className="mt-6 md:mt-8 flex justify-center">
                    <div className="h-px w-12 md:w-16 bg-stone-400/50"></div>
                </div>
                <p className="mt-3 md:mt-4 text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.25em] text-stone-500 font-semibold">
                    {t.home.author}
                </p>
                </div>
            </div>
            )}

            {/* 仅在非探索、非派生词、非对比模式下显示搜索框和结果 */}
            {state.explorationStatus === 'idle' && state.derivativesStatus === 'idle' && state.comparisonStatus === 'idle' && (
              <>
            <SearchInput 
              onSearch={handleSearch}
              onQuickExplore={handleQuickExplore}
              isLoading={state.status === 'analyzing' || state.status === 'generating_image'}
              lang={state.language}
            />

            {/* Analysis Loading */}
            {state.status === 'analyzing' && (
            <div className="flex flex-col items-center space-y-4 md:space-y-6 my-12 md:my-16 animate-pulse">
                <div className="w-12 h-12 md:w-16 md:h-16 border-3 md:border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
                <p className="font-serif text-lg md:text-xl text-stone-600 tracking-wide">{t.home.loading}</p>
            </div>
            )}

            {/* Error */}
            {state.status === 'error' && (
            <div className="p-5 md:p-6 border border-red-200 bg-red-50/80 backdrop-blur-sm text-red-900 font-serif italic text-base md:text-lg rounded-lg max-w-md text-center shadow-lg mx-2">
                {state.error}
            </div>
            )}

            {/* Result */}
            {state.data && (
            <WordCard 
                data={state.data} 
                imageUrl={state.imageUrl} 
                loadingStep={state.status}
                onExplore={handleExplore}
                onDerivatives={handleDerivatives}
                lang={state.language}
            />
                )}
              </>
            )}

            {/* 词汇联想面板 */}
            {state.explorationStatus === 'active' && state.comparisonStatus === 'idle' && (
              <WordAssociationBoard
                word={state.data?.word || exploreWord}
                phonetic={state.data?.phonetic}
                meaning={state.data?.meaning_cn}
                relatedConcepts={state.data?.related_concepts}
                isLoading={!state.data || !state.data.related_concepts || state.data.related_concepts.length === 0}
                onClose={handleCloseExplore}
                onCompare={handleCompare}
                lang={state.language}
              />
            )}

            {/* 语义雷达对比 */}
            {state.comparisonStatus !== 'idle' && state.comparisonData && (
              <HolographicRadar3D
                data={state.comparisonData}
                onClose={resetComparison}
                isLoading={state.comparisonStatus === 'analyzing'}
                lang={state.language}
              />
            )}

            {/* 词汇派生面板 */}
            {state.derivativesStatus === 'active' && state.data && state.data.derivatives && (
                <DerivativesModal 
                    word={state.data.word}
                    derivatives={state.data.derivatives}
                    isLoading={false}
                    onClose={handleCloseDerivatives}
                    onSelectWord={(w) => handleSearch(w, 'artistic')}
                    lang={state.language}
                />
            )}
        </div>
      )}
    </Layout>
  );
}
