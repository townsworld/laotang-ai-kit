import React, { useState } from 'react';
import { SavedWord, Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface VirtualGalleryProps {
  collection: SavedWord[];
  onClose: () => void;
  lang: Language;
}

export const VirtualGallery: React.FC<VirtualGalleryProps> = ({ collection, onClose, lang }) => {
  const [selectedArt, setSelectedArt] = useState<SavedWord | null>(null);
  const t = TRANSLATIONS[lang];

  return (
    <div className="w-full animate-fade-in pb-20">
      {/* Header Info */}
      <div className="mb-10 md:mb-16 text-center space-y-3">
        <h2 className="font-display text-3xl md:text-5xl text-stone-800 uppercase tracking-widest opacity-90">{t.gallery.title}</h2>
        <div className="h-px w-12 bg-stone-300 mx-auto"></div>
        <p className="text-stone-400 text-[10px] uppercase tracking-[0.3em] font-sans">
            {collection.length} {collection.length === 1 ? t.gallery.count_one : t.gallery.count_many}
        </p>
      </div>

      {/* Empty State */}
      {collection.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-stone-400 space-y-6">
            <div className="w-20 h-20 border border-stone-200 rounded-full flex items-center justify-center bg-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
            </div>
            <p className="font-serif italic text-xl text-stone-500">{t.gallery.empty_title}</p>
            <button 
                onClick={onClose}
                className="text-[10px] uppercase tracking-[0.2em] border border-stone-300 px-6 py-3 rounded-full hover:bg-stone-800 hover:text-stone-50 hover:border-stone-800 transition-all duration-300"
            >
                {t.gallery.empty_action}
            </button>
        </div>
      )}

      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 md:gap-10 space-y-8 md:space-y-10 w-full px-4">
        {collection.map((item) => (
            <div 
                key={item.id}
                onClick={() => setSelectedArt(item)}
                className="break-inside-avoid bg-white p-4 pb-8 rounded shadow-[0_5px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1 cursor-pointer group border border-stone-100 hover:border-stone-200/50"
            >
                {/* Image Frame */}
                <div className="relative w-full bg-stone-50 overflow-hidden mb-6 aspect-[3/4] border border-stone-100">
                    <img 
                        src={item.imageUrl} 
                        alt={item.word} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale-[0.1] group-hover:grayscale-0"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-colors duration-500"></div>
                </div>

                {/* Metadata */}
                <div className="text-center px-4">
                    <p className="font-sans text-[9px] text-stone-400 uppercase tracking-[0.2em] mb-2">
                        {item.phonetic}
                    </p>
                    <h3 className="font-serif text-3xl text-stone-900 capitalize tracking-tight mb-4 group-hover:text-stone-600 transition-colors">
                        {item.word}
                    </h3>
                    <p className="font-sans text-[9px] text-stone-300 uppercase tracking-widest border-t border-stone-100 pt-3 inline-block">
                        {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </p>
                </div>
            </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedArt && (
        <div 
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
        >
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[#0c0a09]/90 backdrop-blur-md animate-fade-in"
                onClick={() => setSelectedArt(null)}
            ></div>

            {/* Content Card */}
            <div 
                className="relative bg-[#F9F8F4] w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl animate-fade-in-up flex flex-col md:flex-row overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={() => setSelectedArt(null)}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white rounded-full transition-all text-stone-500 hover:text-stone-900"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Image Side */}
                <div className="w-full md:w-1/2 bg-stone-100 relative min-h-[400px] border-r border-stone-200/50">
                    <img 
                        src={selectedArt.imageUrl} 
                        alt={selectedArt.word} 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>

                {/* Text Side */}
                <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-cream relative">
                     {/* Paper Texture */}
                     <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none mix-blend-multiply"></div>

                     <div className="relative z-10 space-y-8 md:space-y-10">
                        <div>
                            <h2 className="font-serif text-5xl md:text-7xl text-stone-900 capitalize tracking-tight leading-none mb-3">
                                {selectedArt.word}
                            </h2>
                            <p className="font-sans text-stone-400 text-lg tracking-[0.2em] font-light">
                                {selectedArt.phonetic}
                            </p>
                        </div>

                        <div className="space-y-3">
                             <h4 className="text-[0.65rem] uppercase tracking-[0.2em] text-stone-400 font-medium border-b border-stone-200 pb-2 inline-block">{t.wordCard.translation}</h4>
                             <div className="font-serif text-2xl text-stone-800 leading-relaxed">
                                {selectedArt.meaning_cn.split('\n').map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                             </div>
                        </div>

                        <div className="space-y-3">
                             <h4 className="text-[0.65rem] uppercase tracking-[0.2em] text-stone-400 font-medium border-b border-stone-200 pb-2 inline-block">{t.wordCard.etymology}</h4>
                             <p className="font-sans text-stone-600 text-sm leading-relaxed opacity-90">
                                {selectedArt.etymology_cn}
                             </p>
                        </div>

                        <div className="pt-6 border-t border-stone-200/60">
                             <p className="font-serif text-xl italic text-stone-700 mb-3 leading-relaxed">"{selectedArt.sentence_en}"</p>
                             <p className="font-sans text-stone-500 text-xs font-medium">{selectedArt.sentence_cn}</p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};