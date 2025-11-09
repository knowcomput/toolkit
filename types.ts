
export enum AppState {
  IDLE,
  FILE_UPLOADED,
  CONVERTING,
  RESULT_READY,
  ERROR,
}

export type ImageFormat = 'jpeg' | 'png' | 'webp';

export type ConversionSettings = {
  format: ImageFormat;
  quality: number; // 1-100
};

export type UploadedFile = {
  file: File;
  previewUrl: string;
};

export type Tool = 'menu' | 'imageConverter' | 'fileConverter' | 'textAnalyzer';

export type TextFileFormat = 'json' | 'csv' | 'xml' | 'yaml' | 'md' | 'html' | 'txt';

export type TextAnalysis = {
  charCount: number;
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  readingTimeSeconds: number;
  summary: string;
  keywords: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
};
