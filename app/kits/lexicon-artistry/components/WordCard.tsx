"use client";

import React, { useState, useRef, useEffect } from 'react';
import { WordAnalysis, Language } from '../types';
import html2canvas from 'html2canvas';
import { saveToCollection, isWordSaved } from '../services/storageService';
import { playTextToSpeech } from '../services/geminiService';
import { TRANSLATIONS } from '../constants/translations';
import { EtymologyTimeline } from './EtymologyTimeline';

interface WordCardProps {
  data: WordAnalysis;
  imageUrl: string | null;
  loadingStep: 'idle' | 'analyzing' | 'generating_image' | 'success' | 'error';
  onExplore: () => void;
  onDerivatives: () => void;
  lang: Language;
}

const SpeakerIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    width="1em" 
    height="1em"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);

const Spinner = ({ className }: { className?: string }) => (
    <div className={`border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin ${className}`}></div>
);

export const WordCard: React.FC<WordCardProps> = ({ data, imageUrl, loadingStep, onExplore, onDerivatives, lang }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [audioLoading, setAudioLoading] = useState<'word' | 'sentence' | null>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const checkSaved = async () => {
      try {
        const saved = await isWordSaved(data.word);
        setIsSaved(saved);
      } catch (e) {
        console.error("Error checking saved status:", e);
      }
    };
    checkSaved();
  }, [data.word]);

  const handleDownload = async () => {
    if (!shareRef.current) return;
    setIsGeneratingShare(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(shareRef.current, {
        scale: 2,
        backgroundColor: '#F9F8F4',
        logging: false,
        useCORS: true,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `LexiconArtistry-${data.word}.png`;
      link.click();
    } catch (err) {
      console.error("Share generation failed", err);
    } finally {
      setIsGeneratingShare(false);
    }
  };

  const handleSpeak = async (text: string, type: 'word' | 'sentence', e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioLoading) return;
    setAudioLoading(type);
    try {
        await playTextToSpeech(text);
    } catch (err) {
        console.error("Failed to play audio", err);
    } finally {
        setAudioLoading(null);
    }
  };

  const handleCollect = async () => {
    if (!imageUrl || isSaved) return;
    try {
        await saveToCollection({
            ...data,
            imageUrl: imageUrl,
            timestamp: Date.now()
        });
        setIsSaved(true);
    } catch (error) {
        console.error("Failed to save to collection", error);
    }
  };

  const renderActionButtons = (isMobile: boolean) => (
    <div className={
        isMobile 
        ? "flex md:hidden w-full overflow-x-auto gap-4 py-6 mt-4 mb-2 scrollbar-hide snap-x px-2"
        : "hidden md:flex absolute top-10 right-10 z-20 flex-wrap justify-end gap-3"
    }>
        <button
            onClick={handleCollect}
            disabled={isSaved}
            className={`group flex items-center justify-center w-11 h-11 rounded-full transition-all duration-500 flex-shrink-0 shadow-sm ${isSaved ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-white hover:bg-white text-stone-400 hover:text-rose-500 border border-stone-200 hover:shadow-md'}`}
            title={t.wordCard.buttons.save}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
        </button>

        <button
          onClick={onDerivatives}
          disabled={isGeneratingShare}
          className="group flex items-center gap-2 px-5 py-2.5 bg-stone-50 hover:bg-white border border-stone-200 hover:border-stone-300 rounded-full transition-all duration-300 text-stone-600 shadow-sm hover:shadow-md disabled:opacity-50 flex-shrink-0"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.15em] font-medium">{t.wordCard.buttons.derivations}</span>
        </button>

        <button
          onClick={onExplore}
          disabled={isGeneratingShare}
          className="group flex items-center gap-2 px-5 py-2.5 bg-stone-50 hover:bg-white border border-stone-200 hover:border-stone-300 rounded-full transition-all duration-300 text-stone-600 shadow-sm hover:shadow-md disabled:opacity-50 flex-shrink-0"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z"></path>
            </svg>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.15em] font-medium">{t.wordCard.buttons.explore}</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={isGeneratingShare}
          className="group flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 border border-transparent rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-stone-50 disabled:opacity-50 flex-shrink-0"
        >
          {isGeneratingShare ? (
            <div className="w-4 h-4 border-2 border-stone-400 border-t-stone-100 rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          )}
          <span className="text-[10px] md:text-xs uppercase tracking-[0.15em] font-medium">{t.wordCard.buttons.save}</span>
        </button>
    </div>
  );

  return (
    <div className="w-full animate-fade-in-up pb-10 md:pb-20 relative">
      
      {/* Main Display Card */}
      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-14 border border-stone-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative z-10 overflow-hidden">
        
        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-stone-200/50 via-stone-100/50 to-stone-200/50"></div>

        {imageUrl && renderActionButtons(false)}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 items-start">
          
          {/* Left Column: Visuals - "Museum Mat" Style */}
          <div className="relative group w-full">
            <div className={`relative w-full aspect-[3/4] bg-white rounded-lg p-4 md:p-6 shadow-[inset_0_0_40px_rgba(0,0,0,0.03)] border border-stone-100 transition-all duration-700 ease-out`}>
              
              <div className="w-full h-full relative overflow-hidden rounded shadow-sm">
                 {!imageUrl && loadingStep === 'generating_image' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 space-y-4 bg-stone-50/50">
                    <div className="w-10 h-10 border-2 border-stone-200 border-t-stone-500 rounded-full animate-spin"></div>
                    <span className="text-[10px] tracking-widest uppercase font-medium opacity-60">{t.wordCard.visualizing}</span>
                    </div>
                )}
                
                {imageUrl && (
                    <img
                    src={imageUrl}
                    alt={`Artistic representation of ${data.word}`}
                    className={`w-full h-full object-cover transition-transform duration-1000 ease-out scale-100 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                    />
                )}

                {!imageUrl && loadingStep !== 'generating_image' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#F4F2EE] text-stone-300">
                        <span className="font-serif italic text-xl opacity-40">{t.wordCard.visualMetaphor}</span>
                    </div>
                )}
                
                {/* Grain Overlay */}
                <div className="absolute inset-0 bg-noise opacity-[0.08] pointer-events-none mix-blend-overlay"></div>
              </div>
            </div>
            {/* Shadow beneath the mat */}
            <div className="absolute inset-x-4 bottom-0 h-12 bg-black/5 blur-2xl transform translate-y-4 -z-10 rounded-[50%]"></div>
          </div>

          {/* Right Column: Linguistics */}
          <div className="flex flex-col h-full py-2 md:py-4">
            
            {imageUrl && renderActionButtons(true)}

            {/* Header */}
            <div className="text-center md:text-left mb-8 md:mb-12">
              <h2 className="font-serif text-5xl md:text-8xl text-stone-900 capitalize tracking-tight leading-[0.9] mb-4">
                {data.word}
              </h2>
              
              {/* Phonetic & Audio */}
              <div className="flex items-center justify-center md:justify-start gap-4 md:gap-6">
                <p className="font-sans text-stone-400 text-lg md:text-xl tracking-widest font-light">
                  {data.phonetic}
                </p>
                <button 
                  onClick={(e) => handleSpeak(data.word, 'word', e)}
                  disabled={!!audioLoading}
                  className="text-stone-300 hover:text-stone-800 transition-colors duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed p-2 -ml-2 rounded-full hover:bg-stone-50"
                  title="Pronounce word"
                >
                  {audioLoading === 'word' ? (
                     <Spinner className="w-5 h-5" />
                  ) : (
                    <SpeakerIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8 md:space-y-12">
                
                {/* Meaning */}
                <div className="space-y-3">
                    <div className="flex items-center justify-center md:justify-start gap-3">
                        <div className="w-8 h-px bg-stone-300"></div>
                        <h3 className="text-[0.65rem] md:text-xs uppercase tracking-[0.2em] text-stone-400 font-medium">{t.wordCard.translation}</h3>
                    </div>
                    <div className="font-serif text-2xl md:text-3xl text-stone-800 leading-[1.6] text-center md:text-left font-light">
                        {data.meaning_cn.split('\n').map((line, index) => (
                        <p key={index} className={index > 0 ? "mt-3" : ""}>{line}</p>
                        ))}
                    </div>
                </div>

                {/* Etymology */}
                <div className="space-y-3">
                    <div className="flex items-center justify-center md:justify-start gap-3">
                        <div className="w-8 h-px bg-stone-300"></div>
                        <h3 className="text-[0.65rem] md:text-xs uppercase tracking-[0.2em] text-stone-400 font-medium">{t.wordCard.etymology}</h3>
                    </div>
                    <p className="font-sans text-stone-600 text-sm md:text-[0.95rem] leading-relaxed text-center md:text-left opacity-90 max-w-lg">
                        {data.etymology_cn}
                    </p>
                </div>

                {/* Context */}
                <div className="space-y-4 pt-4">
                     <div className="flex items-center justify-center md:justify-start gap-3">
                        <div className="w-8 h-px bg-stone-300"></div>
                        <h3 className="text-[0.65rem] md:text-xs uppercase tracking-[0.2em] text-stone-400 font-medium">{t.wordCard.context}</h3>
                    </div>
                    
                    <div className="relative pl-0 md:pl-6 border-l-0 md:border-l-2 border-stone-200 text-center md:text-left">
                        <div className="relative inline-block">
                            <p className="font-serif text-xl md:text-2xl italic text-stone-800 leading-relaxed">
                                &quot;{data.sentence_en}&quot;
                            </p>
                            <button 
                                onClick={(e) => handleSpeak(data.sentence_en, 'sentence', e)}
                                disabled={!!audioLoading}
                                className="absolute -right-8 top-1 md:relative md:right-auto md:top-auto md:ml-3 inline-flex text-stone-300 hover:text-stone-800 transition-colors duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Read sentence"
                            >
                                {audioLoading === 'sentence' ? (
                                    <Spinner className="w-5 h-5" />
                                ) : (
                                    <SpeakerIcon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        <p className="font-sans text-stone-500 text-sm mt-3 font-medium opacity-80">
                            {data.sentence_cn}
                        </p>
                    </div>
                </div>

            </div>
          </div>
        </div>

        {/* --- Etymology Timeline --- */}
        {data.etymology_timeline && data.etymology_timeline.length > 0 && (
             <div className="mt-12 md:mt-20 pt-12 border-t border-stone-100">
                <EtymologyTimeline timeline={data.etymology_timeline} lang={lang} />
             </div>
        )}

      </div>

      {/* HIDDEN "SHARE CARD" LAYOUT - Optimized for Poster */}
      <div 
        ref={shareRef}
        className="fixed top-0 left-[-9999px] w-[800px] bg-[#F9F8F4] p-16 flex flex-col items-center text-stone-800"
        style={{ fontFeatureSettings: '"kern" 1' }}
      >
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-multiply pointer-events-none z-0"></div>

        <div className="relative z-10 w-full flex flex-col items-center space-y-12">
          <div className="text-center pb-6 border-b border-stone-200 w-full flex justify-between items-end">
             <h3 className="font-display text-2xl tracking-[0.2em] uppercase text-stone-900">Lexicon Artistry</h3>
             <span className="font-sans text-xs tracking-widest text-stone-400 uppercase">Visual Archive</span>
          </div>
          
          <div className="w-full p-8 bg-white border border-stone-100 shadow-sm">
             <div className="w-full aspect-[4/3] bg-stone-100 overflow-hidden relative">
                {imageUrl && <img src={imageUrl} alt={data.word} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none mix-blend-overlay"></div>
             </div>
          </div>

          <div className="text-center space-y-4">
             <h1 className="font-serif text-7xl text-stone-900 capitalize tracking-tight">{data.word}</h1>
             <p className="font-sans text-stone-500 text-2xl tracking-[0.2em] font-light">{data.phonetic}</p>
          </div>
          <div className="w-3/4 text-center px-4">
             {data.meaning_cn.split('\n').map((line, index) => (
                <p key={index} className={`font-serif text-3xl text-stone-800 leading-relaxed ${index > 0 ? "mt-4" : ""}`}>
                  {line}
                </p>
             ))}
          </div>
          <div className="w-full bg-white/60 p-8 rounded-xl border border-stone-200/50">
             <p className="font-sans text-stone-600 text-base leading-relaxed text-center italic opacity-90 max-w-2xl mx-auto">{data.etymology_cn}</p>
          </div>
          <div className="w-full text-center space-y-4 pt-4">
            <p className="font-serif text-2xl italic text-stone-800 leading-normal max-w-3xl mx-auto">&quot;{data.sentence_en}&quot;</p>
            <p className="font-sans text-stone-500 text-sm font-medium opacity-80">{data.sentence_cn}</p>
          </div>
          <div className="pt-12 w-full flex justify-center items-center gap-4">
            <div className="h-px w-20 bg-stone-300"></div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400">Powered by 程序员老唐AI</p>
            <div className="h-px w-20 bg-stone-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

