"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Key, X, Eye, EyeOff, Lock } from 'lucide-react';

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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

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

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200/60">
        {/* Decorative Top Border */}
        <div className="h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-violet-400" />
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-200/50">
              <Key className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-stone-900 text-lg">
              {title}
            </h3>
          </div>
          {canClose && (
            <button 
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-stone-500 text-sm mb-4 leading-relaxed">
            请输入你的 Gemini API Key。你可以在{' '}
            <a 
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-600 hover:text-rose-700 font-medium hover:underline"
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
              className="w-full px-4 py-3.5 pr-12 bg-stone-50 rounded-xl border border-stone-200 transition-all duration-300 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-rose-300 focus:bg-white focus:shadow-lg focus:shadow-rose-100/50"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-stone-400 hover:text-stone-600 transition-colors rounded-lg hover:bg-stone-100"
              title={showKey ? "隐藏" : "显示"}
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-start gap-2 mt-3 p-3 bg-amber-50/50 rounded-lg border border-amber-100/50">
            <Lock className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700/80 leading-relaxed">
              API Key 仅保存在你的浏览器本地，不会上传到任何服务器
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="px-6 pb-6 flex justify-end gap-3">
          {canClose && (
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-stone-600 font-medium hover:bg-stone-100 rounded-xl transition-colors"
            >
              取消
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className={`px-6 py-2.5 font-semibold rounded-xl transition-all ${
              apiKey.trim() 
                ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-200/50 hover:shadow-xl hover:shadow-rose-200/60 hover:scale-105 active:scale-95' 
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );

  // 使用 Portal 渲染到 body，避免被父容器的 overflow:hidden 裁剪
  return createPortal(modalContent, document.body);
};

export default ApiKeyModal;

