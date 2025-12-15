export interface EtymologyStage {
  year: string; // e.g. "12th Century"
  language: string; // e.g. "Old French"
  word: string; // The form of the word at that time
  meaning: string; // The meaning at that time (in CN)
  description: string; // Brief context (in CN)
}

export interface RelatedConcept {
  word: string;
  part_of_speech: string; // 词性: n./v./adj./adv. etc.
  translation: string;
  reason: string;
  relationType: 'synonym' | 'antonym' | 'association' | 'confusable';
}

// 3D Galaxy 数据结构
export interface GalaxySatellite {
  word: string;
  type: 'synonym' | 'antonym' | 'confusable';
  distance: number; // 轨道半径倍数 (1.0 = 基础半径)
  nuance_score?: {
    formal?: number;      // 0-10: 非正式 -> 正式
    positive?: number;    // 0-10: 消极 -> 积极
    active?: number;      // 0-10: 被动 -> 主动
    common?: number;      // 0-10: 罕见 -> 常见
    intensity?: number;   // 0-10: 温和 -> 强烈
  };
  part_of_speech?: string;
  translation?: string;
}

export interface GalaxyData {
  coreWord: {
    word: string;
    definition: string;
    pronunciation: string;
  };
  satellites: GalaxySatellite[];
  radar_dimensions: string[]; // AI 动态生成的雷达图维度
  visual_prompt?: string; // 用于生成背景图
}

export interface Derivative {
  part_of_speech: string;
  word: string;
  translation: string;
}

export interface WordAnalysis {
  word: string;
  phonetic: string;
  meaning_cn: string;
  etymology_cn: string;
  sentence_en: string;
  sentence_cn: string;
  nano_banana_image_prompt: string;
  etymology_timeline?: EtymologyStage[];
  // Consolidated Data Fields
  related_concepts?: RelatedConcept[];
  derivatives?: Derivative[];
  // 3D Galaxy 数据 (可选，如果启用 3D 模式)
  galaxy_data?: GalaxyData;
}

export interface SavedWord extends WordAnalysis {
  id?: number;
  imageUrl: string;
  timestamp: number;
}

export interface ComparisonAnalysis {
  wordA: string;
  wordB: string;
  dimensions: {
    label: string; // Dynamic label chosen by AI
    scoreA: number; // 0-10
    scoreB: number; // 0-10
  }[];
  insight: string; // Detailed explanation
  sentenceA: string; // Example sentence for word A
  sentenceB: string; // Example sentence for word B
}

export type ImageStyle = 'artistic' | 'healing' | 'anime' | 'scifi';

export type Language = 'en' | 'cn';

export interface AppState {
  language: Language;
  view: 'home' | 'gallery';
  status: 'idle' | 'analyzing' | 'generating_image' | 'success' | 'error';
  data: WordAnalysis | null;
  imageUrl: string | null;
  error: string | null;
  
  // Exploration (StarField)
  explorationStatus: 'idle' | 'active'; // Removed 'loading' as data is now consolidated
  
  // Comparison (Nuance Radar)
  comparisonStatus: 'idle' | 'analyzing' | 'success' | 'error';
  comparisonData: ComparisonAnalysis | null;

  // Derivatives
  derivativesStatus: 'idle' | 'active'; // Removed 'loading'
  
  collection: SavedWord[];
}

