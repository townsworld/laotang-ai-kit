import React from 'react';
import { Language, RelatedConcept } from '../types';

interface WordAssociationBoardProps {
  word: string;
  phonetic?: string;
  meaning?: string;
  relatedConcepts?: RelatedConcept[];
  isLoading?: boolean;
  onClose: () => void;
  onCompare: (wordA: string, wordB: string) => void;
  lang: Language;
}

const CategoryCard: React.FC<{
  title: string;
  accent: string;
  items: RelatedConcept[];
  limit: number;
  onSelect: (w: string) => void;
  isLoading?: boolean;
}> = ({ title, accent, items, limit, onSelect, isLoading }) => {
  const visible = items.slice(0, limit);
  return (
    <div className={`relative overflow-hidden rounded-xl md:rounded-2xl border border-white/70 bg-white/70 backdrop-blur-xl shadow-[0_15px_50px_-15px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 ${accent}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent pointer-events-none" />
      <div className="p-4 md:p-5 lg:p-6 relative z-10 flex flex-col gap-3 md:gap-4">
        <h3 className="font-serif text-base md:text-lg lg:text-xl text-stone-900 tracking-tight font-medium">{title}</h3>

        <div className="flex flex-wrap gap-2 md:gap-3">
          {isLoading ? (
            Array.from({ length: limit }).map((_, idx) => (
              <div
                key={idx}
                className="h-8 md:h-9 w-20 md:w-24 rounded-full bg-white/60 border border-white/80 animate-pulse"
              />
            ))
          ) : visible.length > 0 ? (
            visible.map((item) => (
              <button
                key={item.word}
                onClick={() => onSelect(item.word)}
                className="group px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/90 border border-stone-200/70 text-stone-700 hover:text-stone-900 hover:bg-white hover:border-stone-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1.5 md:gap-2"
              >
                <span className="text-xs md:text-sm font-serif capitalize font-medium">{item.word}</span>
                <span className="text-[9px] md:text-[10px] text-stone-400 group-hover:text-stone-600">{item.translation}</span>
              </button>
            ))
          ) : (
            <p className="text-xs md:text-sm text-stone-400 italic">等待生成...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const WordAssociationBoard: React.FC<WordAssociationBoardProps> = ({
  word,
  phonetic,
  meaning,
  relatedConcepts = [],
  isLoading = false,
  onClose,
  onCompare,
  lang,
}) => {
  const associations = relatedConcepts.filter(c => c.relationType === 'association').slice(0, 2);
  const synonyms = relatedConcepts.filter(c => c.relationType === 'synonym').slice(0, 3);
  const antonyms = relatedConcepts.filter(c => c.relationType === 'antonym').slice(0, 3);
  const confusables = relatedConcepts.filter(c => c.relationType === 'confusable').slice(0, 3);

  const labels = {
    headline: lang === 'cn' ? '词汇联想' : 'Lexical Associations',
    association: lang === 'cn' ? '联想' : 'Associations',
    synonym: lang === 'cn' ? '近义' : 'Synonyms',
    antonym: lang === 'cn' ? '反义' : 'Antonyms',
    confusable: lang === 'cn' ? '易混淆' : 'Confusables',
    close: lang === 'cn' ? '返回' : 'Back',
  };

  const firstMeaningLine = meaning?.split('\n')?.[0] ?? '';

  return (
    <div className="relative w-full animate-fade-in">
      <div className="w-full max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6 lg:py-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 md:gap-4 mb-6 md:mb-8 lg:mb-10">
          <div>
            <p className="text-[8px] md:text-[9px] lg:text-[10px] tracking-[0.25em] md:tracking-[0.3em] uppercase text-stone-400 mb-1">Lexical Network</p>
            <h2 className="font-serif text-xl md:text-2xl lg:text-3xl text-stone-900 tracking-tight">
              {labels.headline}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/80 hover:bg-white border border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-900 transition-all duration-200 shadow-sm hover:shadow-md text-xs md:text-sm font-medium flex-shrink-0"
          >
            {labels.close}
          </button>
        </div>

        {/* Core card */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] p-6 md:p-8 lg:p-12 mb-6 md:mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent pointer-events-none" />
          <div className="flex flex-col items-center relative z-10 space-y-2 md:space-y-3 text-center">
            <p className="text-[8px] md:text-[9px] tracking-[0.25em] md:tracking-[0.3em] uppercase text-stone-400">Core Word</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-stone-900 leading-none tracking-tight">{word}</h1>
            {phonetic && (
              <p className="text-stone-400 tracking-[0.15em] md:tracking-[0.2em] text-xs md:text-sm">{phonetic}</p>
            )}
            {firstMeaningLine && (
              <p className="text-base md:text-lg lg:text-xl text-stone-700 font-serif leading-relaxed mt-1 md:mt-2">{firstMeaningLine}</p>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:gap-5">
          <CategoryCard
            title={labels.association}
            accent="from-amber-50/40"
            items={associations}
            limit={2}
            onSelect={(target) => onCompare(word, target)}
            isLoading={isLoading}
          />
          <CategoryCard
            title={labels.synonym}
            accent="from-blue-50/40"
            items={synonyms}
            limit={3}
            onSelect={(target) => onCompare(word, target)}
            isLoading={isLoading}
          />
          <CategoryCard
            title={labels.antonym}
            accent="from-rose-50/40"
            items={antonyms}
            limit={3}
            onSelect={(target) => onCompare(word, target)}
            isLoading={isLoading}
          />
          <CategoryCard
            title={labels.confusable}
            accent="from-emerald-50/40"
            items={confusables}
            limit={3}
            onSelect={(target) => onCompare(word, target)}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

