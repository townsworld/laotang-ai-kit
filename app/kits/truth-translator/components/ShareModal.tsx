"use client";

import React, { useRef, useState } from 'react';
import { TranslationMode } from '../types';
import { Download, X, Sparkles, Briefcase, HeartHandshake, Zap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: {
    mode: TranslationMode;
    content: string;
  } | null;
}

const modeConfig = {
  [TranslationMode.PROFESSIONAL]: {
    title: '🛡️ 职场防锅',
    icon: <Briefcase className="w-6 h-6 text-white" />,
    gradient: 'from-blue-500 to-cyan-400',
  },
  [TranslationMode.HIGH_EQ]: {
    title: '🍵 顶级绿茶',
    icon: <HeartHandshake className="w-6 h-6 text-white" />,
    gradient: 'from-pink-500 to-rose-400',
  },
  [TranslationMode.SARCASTIC]: {
    title: '🌚 阴阳大师',
    icon: <Zap className="w-6 h-6 text-white" />,
    gradient: 'from-violet-600 to-purple-500',
  },
};

const ShareModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen || !data) return null;

  const { mode, content } = data;
  const config = modeConfig[mode];

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      // 动态导入 html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `truth-translator-${mode}-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to generate image', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            生成分享卡片
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Area */}
        <div className="p-6 bg-slate-50 flex justify-center overflow-y-auto max-h-[60vh]">
          {/* Card to capture */}
          <div 
            ref={cardRef} 
            className={`w-full aspect-[4/5] max-w-[320px] rounded-xl shadow-lg flex flex-col relative overflow-hidden bg-gradient-to-br ${config.gradient}`}
          >
             {/* Decorative Background Elements */}
             <div className="absolute top-0 right-0 p-12 opacity-20 transform translate-x-1/3 -translate-y-1/3">
                 <div className="w-32 h-32 rounded-full bg-white blur-2xl"></div>
             </div>
             <div className="absolute bottom-0 left-0 p-12 opacity-20 transform -translate-x-1/3 translate-y-1/3">
                 <div className="w-40 h-40 rounded-full bg-black blur-3xl"></div>
             </div>

             {/* Card Content */}
             <div className="flex-1 p-8 flex flex-col relative z-10">
                {/* Card Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg shadow-inner">
                        {config.icon}
                    </div>
                    <div className="text-white">
                        <h2 className="text-xl font-bold tracking-wide">{config.title}</h2>
                        <p className="text-xs opacity-80 uppercase tracking-widest">Translation Mode</p>
                    </div>
                </div>

                {/* Main Text */}
                <div className="flex-1 flex items-center">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl w-full">
                        <p className="text-slate-800 text-lg leading-relaxed font-medium whitespace-pre-wrap relative">
                             <span className="absolute -top-3 -left-2 text-4xl text-slate-200 font-serif">&quot;</span>
                             {content}
                             <span className="absolute -bottom-6 -right-2 text-4xl text-slate-200 font-serif leading-none">&quot;</span>
                        </p>
                    </div>
                </div>

                {/* Footer / Branding */}
                <div className="mt-8 flex justify-between items-end">
                    <div>
                        <p className="text-white/60 text-xs">Generated by</p>
                        <p className="text-white font-bold text-sm">互联网嘴替 | 真话翻译机</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-white border-t border-gray-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
          >
            取消
          </button>
          <button 
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? '生成中...' : (
              <>
                <Download className="w-4 h-4" />
                保存图片
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

