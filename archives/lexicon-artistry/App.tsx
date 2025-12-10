
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SearchInput } from './components/SearchInput';
import { WordCard } from './components/WordCard';
import { StarField } from './components/StarField';
import { DerivativesModal } from './components/DerivativesModal';
import { VirtualGallery } from './components/VirtualGallery';
import { analyzeWord, generateWordImage, compareWords } from './services/geminiService';
import { getCollection } from './services/storageService';
import { AppState, ImageStyle } from './types';
import { TRANSLATIONS } from './constants/translations';

function App() {
  const [state, setState] = useState<AppState>({
    language: 'en',
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

  const toggleLanguage = () => {
    setState(prev => ({
        ...prev,
        language: prev.language === 'en' ? 'cn' : 'en'
    }));
  };

  const handleSearch = async (word: string, style: ImageStyle) => {
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

  const handleExplore = () => {
    if (state.data?.related_concepts) {
        setState(prev => ({ ...prev, explorationStatus: 'active' }));
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
    setState(prev => ({ ...prev, explorationStatus: 'idle' }));
  };

  const handleDerivatives = () => {
    if (state.data?.derivatives) {
        setState(prev => ({ ...prev, derivativesStatus: 'active' }));
    }
  };

  const handleCloseDerivatives = () => {
      setState(prev => ({ ...prev, derivativesStatus: 'idle' }));
  };

  const handleNavigate = (view: 'home' | 'gallery') => {
      setState(prev => ({ ...prev, view }));
  };

  const t = TRANSLATIONS[state.language];

  return (
    <Layout currentView={state.view} onNavigate={handleNavigate} lang={state.language} onToggleLanguage={toggleLanguage}>
      
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
            {state.status === 'idle' && (
            <div className="mb-8 mt-12 max-w-2xl w-full mx-auto">
                <div className="bg-white/30 backdrop-blur-md border border-white/40 p-10 md:p-14 rounded-2xl shadow-sm text-center transform transition-all hover:bg-white/40">
                <p className="font-serif text-3xl md:text-4xl text-stone-700 italic leading-snug">
                    {t.home.quote}
                </p>
                <div className="mt-8 flex justify-center">
                    <div className="h-px w-16 bg-stone-400/50"></div>
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
                    {t.home.author}
                </p>
                </div>
            </div>
            )}

            <SearchInput 
              onSearch={handleSearch} 
              isLoading={state.status === 'analyzing' || state.status === 'generating_image'}
              lang={state.language}
            />

            {/* Analysis Loading */}
            {state.status === 'analyzing' && (
            <div className="flex flex-col items-center space-y-6 my-16 animate-pulse">
                <div className="w-16 h-16 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
                <p className="font-serif text-xl text-stone-600 tracking-wide">{t.home.loading}</p>
            </div>
            )}

            {/* Error */}
            {state.status === 'error' && (
            <div className="p-6 border border-red-200 bg-red-50/80 backdrop-blur-sm text-red-900 font-serif italic text-lg rounded-lg max-w-md text-center shadow-lg">
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

            {/* 3D Exploration + Radar */}
            {state.explorationStatus === 'active' && state.data && state.data.related_concepts && (
                <StarField 
                    centerWord={state.data.word}
                    relatedConcepts={state.data.related_concepts}
                    onSelectWord={(w) => handleSearch(w, 'artistic')}
                    onCompare={handleCompare}
                    onClose={handleCloseExplore}
                    comparisonStatus={state.comparisonStatus}
                    comparisonData={state.comparisonData}
                    resetComparison={resetComparison}
                    lang={state.language}
                />
            )}

            {/* Derivatives */}
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

export default App;
