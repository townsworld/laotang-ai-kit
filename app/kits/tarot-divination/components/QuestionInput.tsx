"use client";

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

export default function QuestionInput({ onSubmit, isLoading }: QuestionInputProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question.trim());
    }
  };

  const suggestedQuestions = [
    '我最近的感情状况如何？',
    '我的事业发展方向在哪里？',
    '我该如何提升自己？',
    '这段关系的未来会怎样？',
    '我现在最需要关注什么？',
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="请输入你的问题..."
            disabled={isLoading}
            rows={4}
            className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-purple-500/30 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 outline-none transition-all resize-none bg-black/40 backdrop-blur-md shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder:text-purple-300/50"
          />
          <div className="absolute bottom-4 right-4 text-xs text-purple-400/60">
            {question.length}/500
          </div>
        </div>

        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className="w-full py-4 px-8 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:via-orange-600 hover:to-amber-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-2xl flex items-center justify-center gap-3 group"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>占卜中...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span>开始占卜</span>
            </>
          )}
        </button>
      </form>

      {/* Suggested Questions */}
      {!question && (
        <div className="mt-8 animate-fade-in-up">
          <p className="text-sm text-purple-300/70 mb-3 text-center">试试这些问题：</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuestion(q)}
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-black/40 hover:bg-purple-900/50 border border-purple-500/30 hover:border-amber-400/50 rounded-full transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md text-purple-200"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

