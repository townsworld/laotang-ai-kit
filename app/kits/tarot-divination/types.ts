// 塔罗牌类型定义
export enum TarotSuit {
  MajorArcana = 'major',
  Wands = 'wands',
  Cups = 'cups',
  Swords = 'swords',
  Pentacles = 'pentacles',
}

export interface TarotCard {
  id: string;
  name: string;
  nameCn: string;
  suit: TarotSuit;
  number: number;
  keywords: string[];
  keywordsCn: string[];
  upright: string;
  reversed: string;
  whisper?: string; // 神秘低语
  image?: string; // 预生成图片路径
}

export interface DrawnCard {
  card: TarotCard;
  position: number;
  isReversed: boolean;
  positionMeaning: string;
  generatedImage?: string; // AI生成的图片URL
}

export enum SpreadType {
  Single = 'single',
  ThreeCard = 'three',
  CelticCross = 'celtic',
  Relationship = 'relationship',
  Career = 'career',
}

export interface Spread {
  id: SpreadType;
  name: string;
  nameCn: string;
  description: string;
  descriptionCn: string;
  positions: SpreadPosition[];
  icon: any; // Lucide icon component
}

export interface SpreadPosition {
  index: number;
  name: string;
  nameCn: string;
  meaning: string;
  meaningCn: string;
}

export interface ReadingResult {
  question: string;
  spread: SpreadType;
  cards: DrawnCard[];
  cardInterpretations?: string[]; // 每张牌的独立解读
  cardRelations?: string; // 牌与牌之间的关联分析
  storyNarrative?: string; // 故事化叙事
  interpretation: string; // 综合解读
  advice: string; // 建议与指引
  timestamp: number;
}

export interface HistoryRecord {
  id: string;
  question: string;
  result: ReadingResult;
  timestamp: number;
}

