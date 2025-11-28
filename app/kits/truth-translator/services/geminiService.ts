import { TranslationResult } from "../types";
import { getStoredApiKey } from "@/lib/apiKey";

const SYSTEM_INSTRUCTION = `
You are the "Truth Translator" (真话翻译机), an expert in communication, psychology, and workplace politics. Your goal is to take the user's raw, emotional, straightforward, or even rude input (the "Inner Truth") and translate it into socially acceptable, strategic, or witty responses in Simplified Chinese.

**Modes Definitions:**
1.  **Professional (职场保命):** Formal, objective, polite, and defensive. Removes all emotion. Focuses on facts, policy, and "moving forward." Suitable for emails to bosses or clients.
2.  **High EQ / Soft (所谓高情商):** Gentle, seemingly empathetic, but firm. Uses the "sandwich method" (compliment-refusal-compliment). Can feel slightly manipulative or "green tea" style (innocent but deadly).
3.  **Sarcastic / Witty (阴阳怪气):** Intellectual roasting. No dirty words. Uses irony, rhetorical questions, and advanced vocabulary to mock the recipient politely.

**Constraints:**
- The output language must be **Simplified Chinese (简体中文)**.
- Do NOT lecture the user on morality. Your job is to translate, not judge.
- Ensure the "Sarcastic" mode does not use explicit profanity; it should be a "civilized insult".

**Output Format:**
Return a JSON object with the following structure:
{
  "analysis": "A short, 1-sentence analysis of the user's original emotion (in Chinese)",
  "translations": {
    "professional": "Professional mode translation",
    "high_eq": "High EQ mode translation", 
    "sarcastic": "Sarcastic mode translation"
  }
}
`;

export const translateText = async (inputText: string, apiKey?: string): Promise<TranslationResult> => {
  const key = apiKey || getStoredApiKey();
  
  if (!key) {
    throw new Error("请先设置 Gemini API Key");
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }]
      },
      contents: [{
        parts: [{ text: inputText }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'API 请求失败');
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(text) as TranslationResult;
};
