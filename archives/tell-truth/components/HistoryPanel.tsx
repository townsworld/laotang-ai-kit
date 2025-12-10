import React from 'react';
import { X, Trash2, Clock, ChevronRight, History } from 'lucide-react';
import { HistoryRecord } from '../types';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryRecord[];
  onSelectRecord: (record: HistoryRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
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
    
    // 一小时内
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return minutes < 1 ? '刚刚' : `${minutes}分钟前`;
    }
    // 今天
    if (date.toDateString() === now.toDateString()) {
      return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    // 昨天
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    // 更早
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
              <History className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">历史记录</h2>
              <p className="text-xs text-slate-400">{history.length} 条记录</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-140px)] overflow-y-auto">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <div className="p-6 rounded-full bg-slate-800/50 mb-4">
                <Clock size={48} className="opacity-50" />
              </div>
              <p className="text-lg font-medium">暂无历史记录</p>
              <p className="text-sm mt-1">开始转译后记录会出现在这里</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {history.map((record, index) => (
                <div
                  key={record.id}
                  className="group relative bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 cursor-pointer transition-all duration-200 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => {
                    onSelectRecord(record);
                    onClose();
                  }}
                >
                  {/* Time badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={12} className="text-slate-500" />
                    <span className="text-xs text-slate-500">{formatTime(record.timestamp)}</span>
                  </div>
                  
                  {/* Input text */}
                  <p className="text-slate-200 font-medium leading-relaxed mb-2">
                    {truncateText(record.input)}
                  </p>
                  
                  {/* Analysis preview */}
                  <p className="text-sm text-slate-400 truncate">
                    💡 {truncateText(record.result.analysis, 40)}
                  </p>

                  {/* Hover actions */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRecord(record.id);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="删除记录"
                    >
                      <Trash2 size={16} />
                    </button>
                    <ChevronRight size={18} className="text-slate-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-slate-700 bg-slate-900/90 backdrop-blur-sm">
            <button
              onClick={onClearAll}
              className="w-full py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 hover:border-red-500/50 font-medium transition-all flex items-center justify-center gap-2"
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

export default HistoryPanel;

