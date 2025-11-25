import { TranslationResult } from "../types";

export const translateText = async (inputText: string): Promise<TranslationResult> => {
  try {
    const response = await fetch('/api/truth-translator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: inputText }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result as TranslationResult;
  } catch (error) {
    console.error("Error translating text:", error);
    throw error;
  }
};