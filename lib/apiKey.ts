// API Key 存储工具函数

const API_KEY_STORAGE_KEY = 'gemini_api_key';

export const getStoredApiKey = (): string => {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

export const setStoredApiKey = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
  } catch (e) {
    console.error('Failed to save API key', e);
  }
};

export const hasApiKey = (): boolean => {
  return !!getStoredApiKey();
};

