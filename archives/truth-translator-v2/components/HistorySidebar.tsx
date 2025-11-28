
import React from 'react';
import { HistoryItem } from '../types';
import { X, Trash2, Clock, ChevronRight, MessageSquare } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistorySidebar: React.FC<Props> = ({ isOpen, onClose, history, onSelect, onClear }) => {
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white/95 backdrop-blur-md shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold">历史记录</h2>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {history.length}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
              <Clock className="w-12 h-12 opacity-20" />
              <p>暂无历史记录</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelect(item)}
                className="group p-4 bg-white border border-slate-100 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-slate-700 line-clamp-2 font-medium mb-2">
                  {item.inputText}
                </p>
                
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-50">
                    <div className="flex -space-x-2 overflow-hidden">
                        <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-blue-100 flex items-center justify-center" title="职场">🛡️</div>
                        <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-pink-100 flex items-center justify-center" title="绿茶">🍵</div>
                        <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-violet-100 flex items-center justify-center" title="阴阳">🌚</div>
                    </div>
                    <span className="text-xs text-indigo-600 group-hover:underline ml-auto flex items-center">
                        查看详情 <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button 
              onClick={onClear}
              className="w-full py-2.5 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              清空历史记录
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default HistorySidebar;
