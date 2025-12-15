"use client";

import React, { useState, useRef } from 'react';
import { WordAnalysis, Language } from '../types';
import html2canvas from 'html2canvas';
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

// Share Card Content Component
const ShareCardContent: React.FC<{ data: WordAnalysis; imageUrl: string | null; lang: Language }> = ({ data, imageUrl, lang }) => (
  <div className="relative z-10 w-full flex flex-col items-center space-y-8">
    {/* Header */}
    <div className="text-center pb-4 border-b border-stone-200 w-full flex justify-between items-end">
       <h3 className="font-display text-xl tracking-[0.2em] uppercase text-stone-900">Lexicon Artistry</h3>
       <span className="font-sans text-[10px] tracking-widest text-stone-400 uppercase">by 程序员老唐</span>
    </div>
    
    {/* Image */}
    {imageUrl && (
      <div className="w-full p-5 bg-white border border-stone-100 shadow-sm rounded-lg">
         <div className="w-full aspect-[4/3] bg-stone-100 overflow-hidden relative rounded">
            <img src={imageUrl} alt={data.word} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none mix-blend-overlay"></div>
         </div>
      </div>
    )}

    {/* Word & Phonetic */}
    <div className="text-center space-y-2">
       <h1 className="font-serif text-5xl text-stone-900 capitalize tracking-tight">{data.word}</h1>
       <p className="font-sans text-stone-500 text-lg tracking-[0.2em] font-light">{data.phonetic}</p>
    </div>
    
    {/* Meaning */}
    <div className="w-full text-center px-4">
       {data.meaning_cn.split('\n').map((line, index) => (
          <p key={index} className={`font-serif text-2xl text-stone-800 leading-relaxed ${index > 0 ? "mt-2" : ""}`}>
            {line}
          </p>
       ))}
    </div>
    
    {/* Etymology */}
    <div className="w-full bg-white/60 p-5 rounded-xl border border-stone-200/50">
       <h4 className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-2 text-center">词源</h4>
       <p className="font-sans text-stone-600 text-sm leading-relaxed text-center opacity-90">{data.etymology_cn}</p>
    </div>
    
    {/* Example Sentence */}
    <div className="w-full bg-stone-50/50 p-5 rounded-xl border border-stone-200/30">
      <h4 className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-3 text-center">例句</h4>
      <p className="font-serif text-lg italic text-stone-800 leading-normal text-center mb-2">&quot;{data.sentence_en}&quot;</p>
      <p className="font-sans text-stone-500 text-sm text-center opacity-80">{data.sentence_cn}</p>
    </div>

    {/* Derivatives */}
    {data.derivatives && data.derivatives.length > 0 && (
      <div className="w-full bg-white/60 p-5 rounded-xl border border-stone-200/50">
        <h4 className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-3 text-center">词汇派生</h4>
        <div className="flex flex-wrap justify-center gap-2">
          {data.derivatives.slice(0, 6).map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200 rounded-full text-xs">
              <span className="font-serif text-stone-800">{item.word}</span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-500">{item.translation}</span>
            </span>
          ))}
        </div>
      </div>
    )}
    
    {/* Footer */}
    <div className="pt-6 w-full flex justify-center items-center gap-3">
      <div className="h-px w-12 bg-stone-300"></div>
      <p className="text-[9px] tracking-[0.3em] uppercase text-stone-400">Powered by 程序员老唐AI</p>
      <div className="h-px w-12 bg-stone-300"></div>
    </div>
  </div>
);

export const WordCard: React.FC<WordCardProps> = ({ data, imageUrl, loadingStep, onExplore, onDerivatives, lang }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  const [audioLoading, setAudioLoading] = useState<'word' | 'sentence' | null>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  const handleDownload = async () => {
    if (!shareRef.current) return;
    setIsGeneratingShare(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (!shareRef.current) return;
      
      const canvas = await html2canvas(shareRef.current, {
        scale: 3, // Increased scale for better quality
        backgroundColor: '#F9F8F4',
        logging: false,
        useCORS: true,
        allowTaint: true,
        height: shareRef.current.offsetHeight, // Explicitly set height to full content
        windowHeight: shareRef.current.offsetHeight + 100, // Ensure window context is large enough
        onclone: (clonedDoc) => {
           // Optional: Ensure fonts or images are fully loaded in the clone if needed
           // For now, simple clone usually works
        }
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `LexiconArtistry-${data.word}.png`;
      link.click();
      setShowShareModal(false);
    } catch (err) {
      console.error("Share generation failed", err);
    } finally {
      setIsGeneratingShare(false);
    }
  };

  const handleOpenShareModal = () => {
    setShowShareModal(true);
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

  const renderActionButtons = (isMobile: boolean) => (
    <div className={
        isMobile 
        ? "flex md:hidden w-full gap-2 py-4 mt-2 mb-2 justify-center flex-wrap"
        : "hidden md:flex absolute top-4 lg:top-6 right-4 lg:right-6 z-20 flex-wrap justify-end gap-2 md:gap-3 max-w-[45%]"
    }>
        <button
          onClick={onDerivatives}
          disabled={isGeneratingShare}
          className="group flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-stone-50 hover:bg-white border border-stone-200 hover:border-stone-300 rounded-full transition-all duration-300 text-stone-600 shadow-sm hover:shadow-md disabled:opacity-50 flex-shrink-0"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          <span className="text-[9px] md:text-[10px] lg:text-xs uppercase tracking-[0.12em] md:tracking-[0.15em] font-medium">{t.wordCard.buttons.derivations}</span>
        </button>

        <button
          onClick={onExplore}
          disabled={isGeneratingShare}
          className="group flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-stone-50 hover:bg-white border border-stone-200 hover:border-stone-300 rounded-full transition-all duration-300 text-stone-600 shadow-sm hover:shadow-md disabled:opacity-50 flex-shrink-0"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z"></path>
            </svg>
          <span className="text-[9px] md:text-[10px] lg:text-xs uppercase tracking-[0.12em] md:tracking-[0.15em] font-medium">{t.wordCard.buttons.explore}</span>
        </button>

        <button
          onClick={handleOpenShareModal}
          disabled={isGeneratingShare}
          className="group flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-stone-50 hover:bg-white border border-stone-200 hover:border-stone-300 rounded-full transition-all duration-300 text-stone-600 shadow-sm hover:shadow-md disabled:opacity-50 flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          <span className="text-[9px] md:text-[10px] lg:text-xs uppercase tracking-[0.12em] md:tracking-[0.15em] font-medium">{lang === 'cn' ? '分享卡片' : 'Share'}</span>
        </button>
    </div>
  );

  return (
    <div className="w-full animate-fade-in-up pb-6 md:pb-10 lg:pb-20 relative">
      
      {/* Main Display Card */}
      <div className="bg-white rounded-2xl md:rounded-[2rem] lg:rounded-[2.5rem] p-4 md:p-8 lg:p-14 border border-stone-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative z-10 overflow-hidden">
        
        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1.5 md:h-2 bg-gradient-to-r from-stone-200/50 via-stone-100/50 to-stone-200/50"></div>

        {imageUrl && renderActionButtons(false)}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-24 items-start">
          
          {/* Left Column: Visuals - "Museum Mat" Style */}
          <div className="relative group w-full order-2 md:order-1">
            <div className={`relative w-full aspect-[3/4] bg-white rounded-lg p-3 md:p-4 lg:p-6 shadow-[inset_0_0_40px_rgba(0,0,0,0.03)] border border-stone-100 transition-all duration-700 ease-out`}>
              
              <div className="w-full h-full relative overflow-hidden rounded shadow-sm">
                 {!imageUrl && loadingStep === 'generating_image' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 space-y-3 md:space-y-4 bg-stone-50/50">
                    <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-stone-200 border-t-stone-500 rounded-full animate-spin"></div>
                    <span className="text-[9px] md:text-[10px] tracking-widest uppercase font-medium opacity-60">{t.wordCard.visualizing}</span>
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
                        <span className="font-serif italic text-lg md:text-xl opacity-40">{t.wordCard.visualMetaphor}</span>
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
          <div className="flex flex-col h-full py-0 md:py-2 lg:py-4 order-1 md:order-2">
            
            {imageUrl && renderActionButtons(true)}

            {/* Header */}
            <div className="text-center md:text-left mb-6 md:mb-8 lg:mb-12 md:mt-12 lg:mt-16">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl xl:text-8xl text-stone-900 capitalize tracking-tight leading-[0.9] mb-3 md:mb-4">
                {data.word}
              </h2>
              
              {/* Phonetic & Audio */}
              <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4 lg:gap-6">
                <p className="font-sans text-stone-400 text-base md:text-lg lg:text-xl tracking-widest font-light">
                  {data.phonetic}
                </p>
                <button 
                  onClick={(e) => handleSpeak(data.word, 'word', e)}
                  disabled={!!audioLoading}
                  className="text-stone-300 hover:text-stone-800 transition-colors duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed p-2 -ml-2 rounded-full hover:bg-stone-50"
                  title="Pronounce word"
                >
                  {audioLoading === 'word' ? (
                     <Spinner className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <SpeakerIcon className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-6 md:space-y-8 lg:space-y-12">
                
                {/* Meaning */}
                <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3">
                        <div className="w-6 md:w-8 h-px bg-stone-300"></div>
                        <h3 className="text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.18em] md:tracking-[0.2em] text-stone-400 font-medium">{t.wordCard.translation}</h3>
                    </div>
                    <div className="font-serif text-xl md:text-2xl lg:text-3xl text-stone-800 leading-[1.6] text-center md:text-left font-light">
                        {data.meaning_cn.split('\n').map((line, index) => (
                        <p key={index} className={index > 0 ? "mt-2 md:mt-3" : ""}>{line}</p>
                        ))}
                    </div>
                </div>

                {/* Etymology */}
                <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3">
                        <div className="w-6 md:w-8 h-px bg-stone-300"></div>
                        <h3 className="text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.18em] md:tracking-[0.2em] text-stone-400 font-medium">{t.wordCard.etymology}</h3>
                    </div>
                    <p className="font-sans text-stone-600 text-xs md:text-sm lg:text-[0.95rem] leading-relaxed text-center md:text-left opacity-90 max-w-lg">
                        {data.etymology_cn}
                    </p>
                </div>

                {/* Context */}
                <div className="space-y-3 md:space-y-4 pt-2 md:pt-4">
                     <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3">
                        <div className="w-6 md:w-8 h-px bg-stone-300"></div>
                        <h3 className="text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.18em] md:tracking-[0.2em] text-stone-400 font-medium">{t.wordCard.context}</h3>
                    </div>
                    
                    <div className="relative pl-0 md:pl-6 border-l-0 md:border-l-2 border-stone-200 text-center md:text-left">
                        <div className="relative inline-block">
                            <p className="font-serif text-lg md:text-xl lg:text-2xl italic text-stone-800 leading-relaxed">
                                &quot;{data.sentence_en}&quot;
                            </p>
                            <button 
                                onClick={(e) => handleSpeak(data.sentence_en, 'sentence', e)}
                                disabled={!!audioLoading}
                                className="absolute -right-7 top-0 md:relative md:right-auto md:top-auto md:ml-3 inline-flex text-stone-300 hover:text-stone-800 transition-colors duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Read sentence"
                            >
                                {audioLoading === 'sentence' ? (
                                    <Spinner className="w-4 h-4 md:w-5 md:h-5" />
                                ) : (
                                    <SpeakerIcon className="w-4 h-4 md:w-5 md:h-5" />
                                )}
                            </button>
                        </div>
                        <p className="font-sans text-stone-500 text-xs md:text-sm mt-2 md:mt-3 font-medium opacity-80">
                            {data.sentence_cn}
                        </p>
                    </div>
                </div>

            </div>
          </div>
        </div>

        {/* --- Etymology Timeline --- */}
        {data.etymology_timeline && data.etymology_timeline.length > 0 && (
             <div className="mt-8 md:mt-12 lg:mt-20 pt-8 md:pt-12 border-t border-stone-100">
                <EtymologyTimeline timeline={data.etymology_timeline} lang={lang} />
             </div>
        )}

      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setShowShareModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-cream w-full max-w-[95vw] md:max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setShowShareModal(false)}
              className="sticky top-4 right-4 ml-auto mr-4 mt-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-stone-400 hover:text-stone-800 transition-all shadow-sm hover:shadow-md flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Preview Area */}
            <div className="p-6 md:p-10 pt-0 flex flex-col items-center">
              <h3 className="text-center text-xl md:text-2xl font-serif text-stone-800 mb-8">
                {lang === 'cn' ? '分享预览' : 'Share Preview'}
              </h3>

              {/* Share Card Preview - Removed outer container styles to eliminate the "frame" effect */}
              <div className="w-full max-w-[800px] bg-[#F9F8F4] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
                <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-multiply pointer-events-none"></div>
                <ShareCardContent data={data} imageUrl={imageUrl} lang={lang} />
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-center gap-3 w-full">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-6 py-2.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-800 transition-all shadow-sm text-sm font-medium"
                >
                  {lang === 'cn' ? '取消' : 'Cancel'}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isGeneratingShare}
                  className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white transition-all shadow-md hover:shadow-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  {isGeneratingShare ? (
                    <>
                      <div className="w-4 h-4 border-2 border-stone-400 border-t-stone-100 rounded-full animate-spin"></div>
                      <span>{lang === 'cn' ? '生成中...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      <span>{lang === 'cn' ? '保存卡片' : 'Save Card'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HIDDEN "SHARE CARD" LAYOUT - For html2canvas */}
      <div className="fixed top-0 left-[-9999px] overflow-hidden">
        <div 
            ref={shareRef}
            className="w-[900px] min-h-[1200px] h-auto bg-[#F9F8F4] p-16 flex flex-col items-center text-stone-800 relative"
            style={{ fontFeatureSettings: '"kern" 1' }}
        >
            <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-multiply pointer-events-none h-full"></div>
            <ShareCardContent data={data} imageUrl={imageUrl} lang={lang} />
        </div>
      </div>
    </div>
  );
};

