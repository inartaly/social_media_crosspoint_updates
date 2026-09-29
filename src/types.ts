export interface ReleaseHighlight {
  id: string;
  category: 'feature' | 'hardware' | 'bugfix' | 'performance';
  emoji: '⚡' | '📱' | '🐛' | '🚀' | '📚' | string;
  rawText: string;
  conciseText: string;
  selected: boolean;
}

export interface ReleaseData {
  id: string;
  version: string;
  title: string;
  date: string;
  releaseUrl: string;
  markdown: string;
  highlights: ReleaseHighlight[];
}

export interface TweetRuleCheck {
  id: string;
  label: string;
  passed: boolean;
  details: string;
}

export interface TweetCharacterStats {
  bodyLength: number;
  maxBodyLength: number; // 220 chars
  totalLength: number;
  twitterMaxTotal: number; // 280 chars
  urlLength: number;
  isBodyValid: boolean;
  isTotalValid: boolean;
}

export type FocusVariant = 'balanced' | 'hardware' | 'performance' | 'compact';
