"use client";

import React from 'react';
import { Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { HistoryRecord } from '../types';

interface DiaryViewProps {
  history: HistoryRecord[];
  onSelectRecord: (record: HistoryRecord) => void;
}

export default function DiaryView({ history, onSelectRecord }: DiaryViewProps) {
  // 按月分组
  const groupByMonth = (records: HistoryRecord[]) => {
    const groups: Record<string, HistoryRecord[]> = {};
    records.forEach(record => {
      const date = new Date(record.timestamp);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(record);
    });
    return groups;
  };

  const grouped = groupByMonth(history);
  const months = Object.keys(grouped).sort().reverse();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-900/50 rounded-2xl border border-purple-500/30 backdrop-blur-md mb-4">
          <Calendar className="w-6 h-6 text-purple-300" />
          <h2 className="text-2xl font-bold text-purple-100">我的塔罗日记</h2>
        </div>
        <p className="text-purple-300/70">记录你的占卜历程，见证成长轨迹</p>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20">
          <Sparkles className="w-16 h-16 text-purple-300/50 mx-auto mb-4" />
          <p className="text-purple-300/70">还没有占卜记录</p>
          <p className="text-sm text-purple-400/50 mt-2">开始你的第一次占卜，记录成长时刻</p>
        </div>
      ) : (
        <div className="space-y-8">
          {months.map(month => (
            <div key={month} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
                  <p className="text-amber-300 font-bold">
                    {new Date(month + '-01').toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
                  </p>
                </div>
                <div className="flex-1 h-px bg-purple-500/20"></div>
                <span className="text-sm text-purple-400">{grouped[month].length} 次占卜</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {grouped[month].map(record => (
                  <button
                    key={record.id}
                    onClick={() => onSelectRecord(record)}
                    className="group text-left bg-black/40 hover:bg-purple-900/40 rounded-2xl p-5 border border-purple-500/20 hover:border-amber-400/50 transition-all hover:scale-102 backdrop-blur-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-purple-100 font-bold line-clamp-2 group-hover:text-amber-300 transition-colors">
                          {record.question}
                        </p>
                        <p className="text-xs text-purple-400/60 mt-1">
                          {new Date(record.timestamp).toLocaleDateString('zh-CN', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="flex gap-2">
                      {record.result.cards.slice(0, 3).map((card, idx) => (
                        <div
                          key={idx}
                          className="w-10 h-14 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 rounded border border-purple-400/30 flex items-center justify-center text-xs"
                        >
                          <span className="text-purple-300">{card.card.nameCn.slice(0, 2)}</span>
                        </div>
                      ))}
                      {record.result.cards.length > 3 && (
                        <div className="w-10 h-14 bg-black/30 rounded border border-purple-400/20 flex items-center justify-center">
                          <span className="text-xs text-purple-400">+{record.result.cards.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="text-center text-purple-400/60 text-sm py-4">
          共 {history.length} 次占卜记录
        </div>
      )}
    </div>
  );
}

