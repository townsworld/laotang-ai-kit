"use client";

import React, { useState } from 'react';
import { Sparkles, RefreshCcw } from 'lucide-react';
import { Scene } from '../types';
import { SCENES } from './SceneSelector';

interface InputAreaProps {
  scene: Scene;
  onGenerate: (input: string) => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ scene, onGenerate, isLoading }) => {
  const [input, setInput] = useState('');

  const currentScene = SCENES.find(s => s.id === scene);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim() && !isLoading) {
      onGenerate(input.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-xl shadow-stone-200/50 border border-stone-200/60">
        <div className="mb-4">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            {currentScene?.icon} {currentScene?.name}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentScene?.placeholder || '请输入内容...'}
            className="w-full h-32 bg-stone-50 text-stone-900 p-4 rounded-2xl border border-stone-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-200 outline-none resize-none placeholder-stone-400 transition-all"
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-stone-400 hidden md:block">
            按 <code className="bg-stone-200 px-2 py-1 rounded text-stone-600 font-medium">Cmd/Ctrl + Enter</code> 生成
          </span>
          <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isLoading}
            className={`ml-auto flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all transform active:scale-95
              ${!input.trim() || isLoading
                ? 'bg-stone-200 cursor-not-allowed text-stone-400'
                : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 hover:shadow-xl hover:shadow-rose-200/50 hover:-translate-y-0.5'
              }`}
          >
            {isLoading ? (
              <>
                <RefreshCcw className="animate-spin" size={20} />
                <span>AI 正在创作...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>生成文案</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

