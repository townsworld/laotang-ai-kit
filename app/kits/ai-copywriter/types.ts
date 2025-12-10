export type Scene = 
  | 'xiaohongshu_title'
  | 'douyin_script'
  | 'moments'
  | 'product_desc'
  | 'email_marketing';

export interface SceneConfig {
  id: Scene;
  name: string;
  icon: string;
  placeholder: string;
  description: string;
}

export interface CopywritingResult {
  variants: string[];
  tips?: string;
}

export interface HistoryRecord {
  id: string;
  scene: Scene;
  input: string;
  result: CopywritingResult;
  timestamp: number;
}

