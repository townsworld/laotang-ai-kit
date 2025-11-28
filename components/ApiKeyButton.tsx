"use client";

import React, { useState, useEffect } from 'react';
import { Key } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '@/lib/apiKey';
import ApiKeyModal from './ApiKeyModal';

interface Props {
  /** 按钮样式变体 */
  variant?: 'header' | 'floating';
  /** 是否在进入时自动弹窗（如果没有 API Key） */
  autoPrompt?: boolean;
  /** API Key 变化回调 */
  onApiKeyChange?: (apiKey: string) => void;
}

const ApiKeyButton: React.FC<Props> = ({ 
  variant = 'floating',
  autoPrompt = false,
  onApiKeyChange
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

  useEffect(() => {
    const storedKey = getStoredApiKey();
    setApiKey(storedKey);
    onApiKeyChange?.(storedKey);
    
    // 自动弹窗（仅在没有 API Key 且未弹过窗时）
    if (autoPrompt && !storedKey && !hasPrompted) {
      setIsModalOpen(true);
      setHasPrompted(true);
    }
  }, [autoPrompt, hasPrompted, onApiKeyChange]);

  const handleSave = (newKey: string) => {
    setApiKey(newKey);
    setStoredApiKey(newKey);
    onApiKeyChange?.(newKey);
  };

  const buttonClasses = variant === 'header' 
    ? `inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
        apiKey 
          ? 'bg-slate-800/50 border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50'
          : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
      }`
    : `p-3 backdrop-blur-sm rounded-full shadow-sm border transition-all ${
        apiKey 
          ? 'bg-white/80 border-slate-200 text-slate-600 hover:text-indigo-600 hover:shadow-md hover:scale-105'
          : 'bg-amber-50 border-amber-300 text-amber-600 hover:bg-amber-100 hover:shadow-md hover:scale-105 animate-pulse'
      }`;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={buttonClasses}
        title={apiKey ? "管理 API Key" : "设置 API Key"}
      >
        <Key className="w-5 h-5" />
        {variant === 'header' && (
          <span className="text-sm font-medium">
            {apiKey ? 'API Key ✓' : '设置 API Key'}
          </span>
        )}
      </button>

      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialKey={apiKey}
        canClose={true}
        title={apiKey ? "管理 API Key" : "设置 API Key"}
      />
    </>
  );
};

export default ApiKeyButton;

