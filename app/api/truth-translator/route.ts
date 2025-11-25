import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: "Invalid input text" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not found in environment variables");
      return NextResponse.json(
        { error: "API Key not configured" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: text,
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

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response from Gemini");
    }

    const result = JSON.parse(responseText);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error translating text:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}

