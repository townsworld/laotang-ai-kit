export interface EtymologyStage {
  year: string; // e.g. "12th Century"
  language: string; // e.g. "Old French"
  word: string; // The form of the word at that time
  meaning: string; // The meaning at that time (in CN)
  description: string; // Brief context (in CN)
}

export interface RelatedConcept {
  word: string;
  translation: string;
  reason: string;
  relationType: 'synonym' | 'antonym' | 'association';
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

