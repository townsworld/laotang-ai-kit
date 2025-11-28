"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Settings, Key, X, Github, ExternalLink } from 'lucide-react';
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
            p-3 rounded-xl border backdrop-blur-md transition-all duration-300 shadow-lg
            ${isOpen 
              ? 'bg-slate-800 border-cyan-500/50 text-cyan-400 rotate-90' 
              : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30'
            }
          `}
          title="设置"
        >
          <Settings className="w-5 h-5 transition-transform duration-300" />
        </button>

        {/* 下拉菜单 */}
        <div 
          className={`
            absolute top-full right-0 mt-2 w-64 
            bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl 
            shadow-2xl shadow-black/50 overflow-hidden
            transition-all duration-300 origin-top-right
            ${isOpen 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }
          `}
        >
          {/* 菜单头部 */}
          <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">设置</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 菜单项 */}
          <div className="p-2">
            {/* API Key 设置 */}
            <button
              onClick={() => {
                setIsApiKeyModalOpen(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-slate-800/50 transition-colors group"
            >
              <div className={`p-2 rounded-lg ${apiKeySet ? 'bg-green-500/10' : 'bg-amber-500/10'}`}>
                <Key className={`w-4 h-4 ${apiKeySet ? 'text-green-400' : 'text-amber-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-200 group-hover:text-white">
                  Gemini API Key
                </div>
                <div className={`text-xs ${apiKeySet ? 'text-green-400' : 'text-amber-400'}`}>
                  {apiKeySet ? '✓ 已配置' : '未配置'}
                </div>
              </div>
            </button>

            {/* 分隔线 */}
            <div className="my-2 border-t border-slate-700/50" />

            {/* GitHub 链接 */}
            <a
              href="https://github.com/townsworld"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-slate-800/50 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-slate-800">
                <Github className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-200 group-hover:text-white flex items-center gap-1">
                  GitHub
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </div>
                <div className="text-xs text-slate-500">
                  查看源码
                </div>
              </div>
            </a>

            {/* 小红书链接 */}
            <a
              href="https://xhslink.com/m/8DTfNeEEiba"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-slate-800/50 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-red-500/10">
                <span className="text-sm">📕</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-200 group-hover:text-white flex items-center gap-1">
                  小红书
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </div>
                <div className="text-xs text-slate-500">
                  @程序员老唐AI
                </div>
              </div>
            </a>
          </div>

          {/* 菜单底部 */}
          <div className="px-4 py-2 border-t border-slate-700/50 bg-slate-800/30">
            <div className="text-xs text-slate-500 text-center">
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

