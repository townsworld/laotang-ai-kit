"use client";

import React, { useState, useEffect } from 'react';
import { Key, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  initialKey: string;
  /** 是否可以关闭（首次设置时可能不允许关闭） */
  canClose?: boolean;
  /** 标题 */
  title?: string;
}

const ApiKeyModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialKey, 
  canClose = true,
  title = "管理 API Key"
}) => {
  const [apiKey, setApiKey] = useState(initialKey || '');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setApiKey(initialKey || '');
  }, [initialKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape' && canClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-500 to-purple-500">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5" />
            {title}
          </h3>
          {canClose && (
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-slate-600 text-sm mb-4">
            请输入你的 Gemini API Key。你可以在{' '}
            <a 
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Google AI Studio
            </a>
            {' '}获取免费的 API Key。
          </p>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="AIzaSy..."
              autoFocus
              className="w-full p-4 pr-12 bg-slate-50 rounded-xl border border-slate-200 transition-all duration-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-[0_0_15px_rgba(99,102,241,0.15)]"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showKey ? "🙈" : "👁️"}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            🔒 API Key 仅保存在你的浏览器本地，不会上传到任何服务器。
          </p>
        </div>
        
        {/* Actions */}
        <div className="p-4 bg-slate-50 border-t border-gray-100 flex justify-end gap-3">
          {canClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
            >
              取消
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className={`px-6 py-2 font-medium rounded-lg transition-all ${
              apiKey.trim() 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95' 
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;

