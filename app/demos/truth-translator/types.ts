export interface TranslationResult {
  analysis: string;
  translations: {
    professional: string;
    high_eq: string;
    sarcastic: string;
  };
}

export enum TranslationMode {
  PROFESSIONAL = 'professional',
  HIGH_EQ = 'high_eq',
  SARCASTIC = 'sarcastic',
}

export interface TranslationCardProps {
  mode: TranslationMode;
  content: string;
  delay: number;
}