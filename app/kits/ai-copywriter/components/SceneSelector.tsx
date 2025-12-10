"use client";

import React from 'react';
import { Scene, SceneConfig } from '../types';

const SCENES: SceneConfig[] = [
  {
    id: 'xiaohongshu_title',
    name: '小红书标题',
    icon: '📕',
    placeholder: '例如：分享我的早餐 routine',
    description: '生成 8 个爆款标题',
  },
  {
    id: 'douyin_script',
    name: '抖音脚本',
    icon: '🎵',
    placeholder: '例如：教大家用 AI 做海报',
    description: '生成 5 个视频脚本',
  },
  {
    id: 'moments',
    name: '朋友圈文案',
    icon: '💬',
    placeholder: '例如：今天心情很好',
    description: '生成 6 条走心文案',
  },
  {
    id: 'product_desc',
    name: '产品描述',
    icon: '🛍️',
    placeholder: '例如：智能蓝牙耳机，降噪功能',
    description: '生成 5 个卖货文案',
  },
  {
    id: 'email_marketing',
    name: '营销邮件',
    icon: '📧',
    placeholder: '例如：推广新课程',
    description: '生成 4 个邮件开头',
  },
];

interface SceneSelectorProps {
  selected: Scene;
  onSelect: (scene: Scene) => void;
}

export const SceneSelector: React.FC<SceneSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <h3 className="text-sm font-semibold text-stone-500 mb-4 text-center">选择文案场景</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {SCENES.map((scene) => (
          <button
            key={scene.id}
            onClick={() => onSelect(scene.id)}
            className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
              selected === scene.id
                ? 'border-rose-400 bg-gradient-to-br from-rose-50 to-pink-50 shadow-lg shadow-rose-100/50 scale-105'
                : 'border-stone-200 bg-white/80 hover:border-stone-300 hover:bg-white hover:shadow-md'
            }`}
          >
            <div className="text-3xl mb-2">{scene.icon}</div>
            <div className="font-bold text-stone-900 text-sm mb-1">{scene.name}</div>
            <div className="text-xs text-stone-500">{scene.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export { SCENES };

