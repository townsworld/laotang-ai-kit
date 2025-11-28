import { GoogleGenAI, Type } from "@google/genai";
import { TranslationResult } from "../types";

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
`;

export const translateText = async (inputText: string): Promise<TranslationResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: inputText,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.STRING,
              description: "A short, 1-sentence analysis of the user's original emotion (in Chinese).",
            },
            translations: {
              type: Type.OBJECT,
              properties: {
                professional: { type: Type.STRING, description: "Professional mode translation" },
                high_eq: { type: Type.STRING, description: "High EQ mode translation" },
                sarcastic: { type: Type.STRING, description: "Sarcastic mode translation" },
              },
              required: ["professional", "high_eq", "sarcastic"],
            },
          },
          required: ["analysis", "translations"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as TranslationResult;
  } catch (error) {
    console.error("Error translating text:", error);
    throw error;
  }
};