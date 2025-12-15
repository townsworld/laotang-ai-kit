"use client";

import React, { useState } from 'react';
import { X, Trash2, Clock, Sparkles, BookOpen } from 'lucide-react';
import { HistoryRecord } from '../types';
import DiaryView from './DiaryView';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryRecord[];
  onSelectRecord: (record: HistoryRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export default function HistoryPanel({
  isOpen,
  onClose,
  history,
  onSelectRecord,
  onDeleteRecord,
  onClearAll,
}: HistoryPanelProps) {
  const [viewMode, setViewMode] = useState<'list' | 'diary'>('diary');
  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-gradient-to-br from-stone-50 to-purple-50 shadow-2xl z-50 overflow-hidden flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                {viewMode === 'diary' ? <BookOpen className="w-5 h-5 text-white" /> : <Clock className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  {viewMode === 'diary' ? '塔罗日记' : '历史记录'}
                </h2>
                <p className="text-xs text-stone-500">{history.length} 条记录</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('diary')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  viewMode === 'diary'
                    ? 'bg-purple-500 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                日记视图
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  viewMode === 'list'
                    ? 'bg-purple-500 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                列表视图
              </button>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        {/* Clear All Button */}
        {history.length > 0 && (
          <div className="px-6 py-3 border-b border-stone-200 bg-white/50">
            <button
              onClick={() => {
                if (confirm('确定要清空所有历史记录吗？')) {
                  onClearAll();
                }
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-2 hover:underline"
            >
              <Trash2 className="w-4 h-4" />
              清空全部记录
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'diary' ? (
            <DiaryView 
              history={history}
              onSelectRecord={(record) => {
                onSelectRecord(record);
                onClose();
              }}
            />
          ) : (
            <>
              {history.length === 0 ? (
                <div className="text-center py-20">
                  <Sparkles className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-400">还没有占卜记录</p>
                  <p className="text-sm text-stone-400 mt-2">开始你的第一次占卜吧</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((record) => (
                    <div
                      key={record.id}
                      className="group bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200 hover:border-purple-300 cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <button
                          onClick={() => {
                            onSelectRecord(record);
                            onClose();
                          }}
                          className="flex-1 text-left"
                        >
                          <p className="font-bold text-stone-900 group-hover:text-purple-600 transition-colors line-clamp-2 mb-2">
                            {record.question}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-stone-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(record.timestamp)}</span>
                            <span>·</span>
                            <span>{record.result.cards.length} 张牌</span>
                          </div>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('确定要删除这条记录吗？')) {
                              onDeleteRecord(record.id);
                            }
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>

                      {/* Card Preview */}
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {record.result.cards.slice(0, 5).map((drawn, idx) => (
                          <div
                            key={idx}
                            className="flex-shrink-0 w-12 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg border border-purple-200 flex items-center justify-center"
                          >
                            <span className="text-xs font-bold text-purple-700">
                              {drawn.card.nameCn.slice(0, 2)}
                            </span>
                          </div>
                        ))}
                        {record.result.cards.length > 5 && (
                          <div className="flex-shrink-0 w-12 h-16 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-center">
                            <span className="text-xs text-stone-500">
                              +{record.result.cards.length - 5}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
      `}</style>
    </>
  );
}

