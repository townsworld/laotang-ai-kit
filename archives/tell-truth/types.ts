export interface Translations {
  professional: string;
  high_eq: string;
  sarcastic: string;
}

export interface AnalysisResult {
  analysis: string;
  translations: Translations;
}

export interface HistoryRecord {
  id: string;
  input: string;
  result: AnalysisResult;
  timestamp: number;
}

export enum Mode {
  Professional = 'professional',
  HighEQ = 'high_eq',
  Sarcastic = 'sarcastic',
}