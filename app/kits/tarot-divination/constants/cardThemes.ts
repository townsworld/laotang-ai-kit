import { TarotCard } from '../types';

// 为每张塔罗牌配置视觉主题
export interface CardVisualTheme {
  gradient: string; // 渐变色
  symbol: string; // 符号emoji或图标
  accentColor: string; // 强调色
  borderGlow: string; // 边框光晕
}

export const CARD_VISUAL_THEMES: Record<string, CardVisualTheme> = {
  'major-0': {
    gradient: 'from-sky-400 via-blue-300 to-cyan-300',
    symbol: '🌤️',
    accentColor: 'text-sky-300',
    borderGlow: 'shadow-sky-400/50',
  },
  'major-1': {
    gradient: 'from-violet-600 via-purple-500 to-fuchsia-500',
    symbol: '🪄',
    accentColor: 'text-purple-300',
    borderGlow: 'shadow-purple-500/50',
  },
  'major-2': {
    gradient: 'from-indigo-600 via-blue-600 to-cyan-600',
    symbol: '🌙',
    accentColor: 'text-blue-300',
    borderGlow: 'shadow-blue-500/50',
  },
  'major-3': {
    gradient: 'from-emerald-500 via-green-400 to-lime-400',
    symbol: '👑',
    accentColor: 'text-emerald-300',
    borderGlow: 'shadow-emerald-400/50',
  },
  'major-4': {
    gradient: 'from-red-600 via-orange-500 to-amber-500',
    symbol: '⚔️',
    accentColor: 'text-orange-300',
    borderGlow: 'shadow-orange-500/50',
  },
  'major-5': {
    gradient: 'from-slate-600 via-gray-500 to-zinc-500',
    symbol: '📿',
    accentColor: 'text-slate-300',
    borderGlow: 'shadow-slate-400/50',
  },
  'major-6': {
    gradient: 'from-pink-500 via-rose-400 to-red-400',
    symbol: '💕',
    accentColor: 'text-rose-300',
    borderGlow: 'shadow-rose-400/50',
  },
  'major-7': {
    gradient: 'from-amber-600 via-yellow-500 to-orange-500',
    symbol: '🏹',
    accentColor: 'text-amber-300',
    borderGlow: 'shadow-amber-500/50',
  },
  'major-8': {
    gradient: 'from-rose-600 via-pink-500 to-fuchsia-500',
    symbol: '🦁',
    accentColor: 'text-rose-300',
    borderGlow: 'shadow-rose-500/50',
  },
  'major-9': {
    gradient: 'from-gray-700 via-slate-600 to-zinc-600',
    symbol: '🕯️',
    accentColor: 'text-gray-300',
    borderGlow: 'shadow-gray-500/50',
  },
  'major-10': {
    gradient: 'from-purple-600 via-violet-500 to-fuchsia-500',
    symbol: '☸️',
    accentColor: 'text-purple-300',
    borderGlow: 'shadow-purple-500/50',
  },
  'major-11': {
    gradient: 'from-blue-700 via-indigo-600 to-purple-600',
    symbol: '⚖️',
    accentColor: 'text-blue-300',
    borderGlow: 'shadow-blue-600/50',
  },
  'major-12': {
    gradient: 'from-teal-600 via-cyan-500 to-sky-500',
    symbol: '🔄',
    accentColor: 'text-teal-300',
    borderGlow: 'shadow-teal-500/50',
  },
  'major-13': {
    gradient: 'from-gray-900 via-slate-800 to-zinc-800',
    symbol: '💀',
    accentColor: 'text-gray-300',
    borderGlow: 'shadow-gray-700/50',
  },
  'major-14': {
    gradient: 'from-blue-500 via-cyan-400 to-teal-400',
    symbol: '🏺',
    accentColor: 'text-cyan-300',
    borderGlow: 'shadow-cyan-400/50',
  },
  'major-15': {
    gradient: 'from-red-900 via-rose-800 to-pink-800',
    symbol: '😈',
    accentColor: 'text-red-300',
    borderGlow: 'shadow-red-700/50',
  },
  'major-16': {
    gradient: 'from-orange-700 via-red-600 to-rose-600',
    symbol: '🗼',
    accentColor: 'text-orange-300',
    borderGlow: 'shadow-red-600/50',
  },
  'major-17': {
    gradient: 'from-blue-400 via-cyan-300 to-sky-300',
    symbol: '⭐',
    accentColor: 'text-blue-300',
    borderGlow: 'shadow-blue-400/50',
  },
  'major-18': {
    gradient: 'from-indigo-700 via-purple-600 to-violet-600',
    symbol: '🌙',
    accentColor: 'text-indigo-300',
    borderGlow: 'shadow-indigo-600/50',
  },
  'major-19': {
    gradient: 'from-yellow-400 via-amber-400 to-orange-400',
    symbol: '☀️',
    accentColor: 'text-yellow-200',
    borderGlow: 'shadow-yellow-400/50',
  },
  'major-20': {
    gradient: 'from-violet-700 via-purple-600 to-fuchsia-600',
    symbol: '📯',
    accentColor: 'text-violet-300',
    borderGlow: 'shadow-violet-600/50',
  },
  'major-21': {
    gradient: 'from-emerald-600 via-teal-500 to-cyan-500',
    symbol: '🌍',
    accentColor: 'text-emerald-300',
    borderGlow: 'shadow-emerald-500/50',
  },
};

// 获取牌的视觉主题
export function getCardTheme(cardId: string): CardVisualTheme {
  return CARD_VISUAL_THEMES[cardId] || {
    gradient: 'from-purple-600 via-violet-500 to-indigo-500',
    symbol: '✨',
    accentColor: 'text-purple-300',
    borderGlow: 'shadow-purple-500/50',
  };
}

