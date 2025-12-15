"use client";

import React from 'react';
import { 
  Waves, 
  AlertCircle, 
  Star, 
  HelpCircle, 
  CloudRain, 
  Zap,
  Sparkles,
  Heart,
  Briefcase,
  DollarSign,
  Activity,
  BookOpen,
  Users,
} from 'lucide-react';

export enum MoodType {
  Calm = 'calm',
  Anxious = 'anxious',
  Hopeful = 'hopeful',
  Confused = 'confused',
  Sad = 'sad',
  Excited = 'excited',
}

export enum DivinationType {
  General = 'general',
  Love = 'love',
  Career = 'career',
  Money = 'money',
  Health = 'health',
  Study = 'study',
  Relationship = 'relationship',
}

interface Mood {
  type: MoodType;
  name: string;
  icon: any;
  color: string;
  bgGradient: string;
  description: string;
}

interface DivinationTheme {
  type: DivinationType;
  name: string;
  icon: any;
  color: string;
  gradient: string;
  bgGradient: string;
  description: string;
}

export const MOODS: Mood[] = [
  {
    type: MoodType.Calm,
    name: '平静',
    icon: Waves,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    description: '心如止水，寻求智慧',
  },
  {
    type: MoodType.Anxious,
    name: '焦虑',
    icon: AlertCircle,
    color: 'text-orange-400',
    bgGradient: 'from-orange-500/20 to-red-500/20',
    description: '内心不安，需要指引',
  },
  {
    type: MoodType.Hopeful,
    name: '期待',
    icon: Star,
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-500/20 to-amber-500/20',
    description: '充满希望，渴望答案',
  },
  {
    type: MoodType.Confused,
    name: '困惑',
    icon: HelpCircle,
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/20 to-violet-500/20',
    description: '迷茫不解，寻找方向',
  },
  {
    type: MoodType.Sad,
    name: '沮丧',
    icon: CloudRain,
    color: 'text-gray-400',
    bgGradient: 'from-gray-500/20 to-slate-500/20',
    description: '情绪低落，需要安慰',
  },
  {
    type: MoodType.Excited,
    name: '兴奋',
    icon: Zap,
    color: 'text-pink-400',
    bgGradient: 'from-pink-500/20 to-rose-500/20',
    description: '激动雀跃，充满能量',
  },
];

export const DIVINATION_THEMES: DivinationTheme[] = [
  {
    type: DivinationType.General,
    name: '综合运势',
    icon: Sparkles,
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-indigo-500',
    bgGradient: 'from-purple-500/20 to-indigo-500/20',
    description: '全方位指引',
  },
  {
    type: DivinationType.Love,
    name: '爱情感情',
    icon: Heart,
    color: 'text-pink-400',
    gradient: 'from-pink-500 to-rose-500',
    bgGradient: 'from-pink-500/20 to-rose-500/20',
    description: '情感关系解读',
  },
  {
    type: DivinationType.Career,
    name: '事业发展',
    icon: Briefcase,
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    description: '职场前程指引',
  },
  {
    type: DivinationType.Money,
    name: '财富运势',
    icon: DollarSign,
    color: 'text-amber-400',
    gradient: 'from-amber-500 to-yellow-500',
    bgGradient: 'from-amber-500/20 to-yellow-500/20',
    description: '财运金钱解析',
  },
  {
    type: DivinationType.Health,
    name: '健康状况',
    icon: Activity,
    color: 'text-green-400',
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    description: '身心健康建议',
  },
  {
    type: DivinationType.Study,
    name: '学业进步',
    icon: BookOpen,
    color: 'text-indigo-400',
    gradient: 'from-indigo-500 to-purple-500',
    bgGradient: 'from-indigo-500/20 to-purple-500/20',
    description: '学习成长指导',
  },
  {
    type: DivinationType.Relationship,
    name: '人际关系',
    icon: Users,
    color: 'text-teal-400',
    gradient: 'from-teal-500 to-cyan-500',
    bgGradient: 'from-teal-500/20 to-cyan-500/20',
    description: '社交关系洞察',
  },
];

export function getMoodInfo(mood: MoodType): Mood {
  return MOODS.find(m => m.type === mood) || MOODS[0];
}

export function getThemeInfo(theme: DivinationType): DivinationTheme {
  return DIVINATION_THEMES.find(t => t.type === theme) || DIVINATION_THEMES[0];
}

