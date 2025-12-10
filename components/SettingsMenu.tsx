"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Settings, Key, X } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey, hasApiKey } from '@/lib/apiKey';
import ApiKeyModal from './ApiKeyModal';

const SettingsMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setApiKeySet(hasApiKey());
  }, []);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSaveApiKey = (key: string) => {
    setStoredApiKey(key);
    setApiKeySet(!!key);
  };

  return (
    <>
      <div ref={menuRef} className="fixed top-6 right-6 z-50">
        {/* 触发按钮 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            p-3 rounded-full border backdrop-blur-sm transition-all duration-300 shadow-sm
            ${isOpen 
              ? 'bg-white border-stone-300 text-stone-700 rotate-90 shadow-md' 
              : 'bg-white/80 border-stone-200 text-stone-500 hover:text-stone-700 hover:border-stone-300 hover:shadow-md'
            }
          `}
          title="设置"
        >
          <Settings className="w-5 h-5 transition-transform duration-300" />
        </button>

        {/* 下拉菜单 */}
        <div 
          className={`
            absolute top-full right-0 mt-3 w-72 
            bg-white/95 backdrop-blur-md border border-stone-200 rounded-2xl 
            shadow-xl shadow-stone-200/50 overflow-hidden
            transition-all duration-300 origin-top-right
            ${isOpen 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }
          `}
        >
          {/* 菜单头部 */}
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <span className="text-sm font-medium text-stone-700">设置</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 菜单项 */}
          <div className="p-3">
            {/* API Key 设置 */}
            <button
              onClick={() => {
                setIsApiKeyModalOpen(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left hover:bg-stone-50 transition-colors group"
            >
              <div className={`p-2.5 rounded-xl ${apiKeySet ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                <Key className={`w-4 h-4 ${apiKeySet ? 'text-emerald-500' : 'text-amber-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-stone-700 group-hover:text-stone-900">
                  Gemini API Key
                </div>
                <div className={`text-xs ${apiKeySet ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {apiKeySet ? '✓ 已配置' : '未配置'}
                </div>
              </div>
            </button>
          </div>

          {/* 菜单底部 */}
          <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/50">
            <div className="text-xs text-stone-400 text-center">
              v0.1.0 · Made with AI ✨
            </div>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleSaveApiKey}
        initialKey={getStoredApiKey()}
        canClose={true}
        title={apiKeySet ? "管理 API Key" : "设置 API Key"}
      />
    </>
  );
};

export default SettingsMenu;
