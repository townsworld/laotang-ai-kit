"use client";

import React from 'react';
import { X, Trash2, Clock, ChevronRight, History as HistoryIcon } from 'lucide-react';
import { HistoryRecord } from '../types';
import { SCENES } from './SceneSelector';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryRecord[];
  onSelectRecord: (record: HistoryRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  onClose,
  history,
  onSelectRecord,
  onDeleteRecord,
  onClearAll,
}) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - timestamp;

    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return minutes < 1 ? '刚刚' : `${minutes}分钟前`;
    }
    if (date.toDateString() === now.toDateString()) {
      return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const getSceneInfo = (sceneId: string) => {
    return SCENES.find(s => s.id === sceneId);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-stone-200 z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-200">
              <HistoryIcon className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">创作历史</h2>
              <p className="text-xs text-stone-500">{history.length} 条记录</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="h-[calc(100%-140px)] overflow-y-auto bg-stone-50/30">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-400">
              <div className="p-6 rounded-full bg-stone-100 mb-4">
                <Clock size={48} className="opacity-50" />
              </div>
              <p className="text-lg font-medium text-stone-600">暂无创作记录</p>
              <p className="text-sm mt-1">生成文案后会保存在这里</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {history.map((record, index) => {
                const sceneInfo = getSceneInfo(record.scene);
                return (
                  <div
                    key={record.id}
                    className="group relative bg-white hover:bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-2xl p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                    onClick={() => {
                      onSelectRecord(record);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{sceneInfo?.icon}</span>
                      <span className="text-xs font-semibold text-stone-600">{sceneInfo?.name}</span>
                      <span className="text-xs text-stone-400">·</span>
                      <Clock size={12} className="text-stone-400" />
                      <span className="text-xs text-stone-400">{formatTime(record.timestamp)}</span>
                    </div>

                    <p className="text-stone-800 font-medium leading-relaxed mb-2">
                      {truncateText(record.input)}
                    </p>

                    <p className="text-sm text-stone-500">
                      生成了 {record.result.variants.length} 条文案
                    </p>

                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteRecord(record.id);
                        }}
                        className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="删除记录"
                      >
                        <Trash2 size={16} />
                      </button>
                      <ChevronRight size={18} className="text-stone-300" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-stone-200 bg-white">
            <button
              onClick={onClearAll}
              className="w-full py-3 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 hover:border-red-300 font-medium transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              清空所有记录
            </button>
          </div>
        )}
      </div>
    </>
  );
};

