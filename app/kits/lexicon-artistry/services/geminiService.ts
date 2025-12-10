import { WordAnalysis, ImageStyle, ComparisonAnalysis, Language } from "../types";
import { getStoredApiKey } from "@/lib/apiKey";
import {
  getCachedAudio,
  cacheAudio
} from "./storageService";

// --- Request Deduplication Map ---
const pendingRequests = new Map<string, Promise<any>>();

// --- Style Instructions Mapping ---
const STYLE_PROMPTS: Record<ImageStyle, string> = {
  artistic: `Aesthetic: ELEGANT, MINIMALIST, ARTISTIC. Muted tones (Morandi), natural light, museum quality.`,
  healing: `Aesthetic: HEALING, COZY, WARM. Soft watercolor textures, pastel colors, golden hour sunlight.`,
  anime: `Aesthetic: ANIME STYLE, CEL-SHADED. Makoto Shinkai vibes, vibrant high-definition.`,
  scifi: `Aesthetic: SCI-FI, FUTURISTIC. Neon accents, deep blues, holographic elements.`
};

// --- JSON Schema for Analysis ---
const analysisSchema = {
  type: "object",
  properties: {
    word: { type: "string", description: "The target English word, corrected if necessary." },
    phonetic: { type: "string", description: "IPA pronunciation." },
    meaning_cn: { type: "string", description: "Direct Chinese translation categorized by part of speech. Format: '[pos]. [translation]'. Separate POS with newlines." },
    etymology_cn: { type: "string", description: "Brief, interesting etymology in Simplified Chinese." },
    sentence_en: { type: "string", description: "Sophisticated English example sentence." },
    sentence_cn: { type: "string", description: "Simplified Chinese translation of the example sentence." },
    nano_banana_image_prompt: { type: "string", description: "Detailed artistic image prompt for the Nano Banana model." },
    etymology_timeline: {
      type: "array",
      description: "Timeline of the word's evolution (3-5 stages).",
      items: {
        type: "object",
        properties: {
          year: { type: "string" },
          language: { type: "string" },
          word: { type: "string" },
          meaning: { type: "string" },
          description: { type: "string" }
        },
        required: ["year", "language", "word", "meaning", "description"]
      }
    },
    related_concepts: {
      type: "array",
      description: "8 related concepts: Synonyms (esp confusing ones), Antonyms, and Associations.",
      items: {
        type: "object",
        properties: {
          word: { type: "string" },
          translation: { type: "string" },
          reason: { type: "string" },
          relationType: { type: "string", enum: ["synonym", "antonym", "association"] }
        },
        required: ["word", "translation", "reason", "relationType"],
      }
    },
    derivatives: {
      type: "array",
      description: "Top 5 morphological derivatives (e.g. adv, n, adj forms).",
      items: {
        type: "object",
        properties: {
          part_of_speech: { type: "string" },
          word: { type: "string" },
          translation: { type: "string" }
        },
        required: ["part_of_speech", "word", "translation"],
      }
    }
  },
  required: ["word", "phonetic", "meaning_cn", "etymology_cn", "sentence_en", "sentence_cn", "nano_banana_image_prompt", "related_concepts", "derivatives"],
};

const comparisonSchema = {
  type: "object",
  properties: {
    wordA: { type: "string" },
    wordB: { type: "string" },
    dimensions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string", description: "Name of the dimension." },
          scoreA: { type: "number" },
          scoreB: { type: "number" }
        },
        required: ["label", "scoreA", "scoreB"]
      }
    },
    insight: { type: "string" },
    sentenceA: { type: "string" },
    sentenceB: { type: "string" }
  },
  required: ["wordA", "wordB", "dimensions", "insight", "sentenceA", "sentenceB"]
};

export const analyzeWord = async (inputWord: string, style: ImageStyle = 'artistic'): Promise<WordAnalysis> => {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error("请先设置 API Key");
  }

  const selectedAesthetic = STYLE_PROMPTS[style];

  const systemInstruction = `
    You are a dual-expert: a deeply knowledgeable Linguistic Scholar and a High-End Visual Art Director.
    Goal: Analyze the input word and output a SINGLE JSON object containing definitions, visual prompts, etymology timeline, related concepts, and derivatives.
    
    Design Philosophy:
    1. Output Language: Simplified Chinese (except target word and image prompt).
    2. Aesthetic: ${selectedAesthetic}

    CRITICAL REQUIREMENTS:
    
    1. DEFINITION: Field 'meaning_cn' must be direct translation categorized by Part of Speech (e.g., "n. 狗\\nv. 跟踪").
    
    2. IMAGE PROMPT: Field 'nano_banana_image_prompt'. Use a specific, concrete visual metaphor. Embed the word '${inputWord}' artistically into the scene.
    
    3. RELATED CONCEPTS (Starfield): Field 'related_concepts'. Generate 8 items.
       - PRIORITY 1: Confusing words / Near-Synonyms (e.g. for 'lonely', include 'alone'). Tag 'synonym'.
       - PRIORITY 2: Direct Antonyms. Tag 'antonym'.
       - PRIORITY 3: Poetic associations. Tag 'association'.
    
    4. DERIVATIVES: Field 'derivatives'. List top 5 morphological variations.

    5. TIMELINE: Field 'etymology_timeline'. 3-5 historical stages.
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }]
          },
          contents: [{
            parts: [{ text: `Analyze the word: "${inputWord}"` }]
          }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
            temperature: 0.7,
          },
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Analysis API request failed');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as WordAnalysis;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};

export const compareWords = async (wordA: string, wordB: string, lang: Language): Promise<ComparisonAnalysis> => {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error("请先设置 API Key");
  }

  const targetLang = lang === 'cn' ? 'Simplified Chinese' : 'English';

  const systemInstruction = `
    You are a Semantic Nuance Analyzer.
    Goal: Compare two words by selecting the 4 most defining comparison dimensions.
    Language Rules:
    - Labels and Insight in ${targetLang}.
    - Sentences ALWAYS in English.
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }]
          },
          contents: [{
            parts: [{ text: `Compare "${wordA}" and "${wordB}"` }]
          }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: comparisonSchema,
          },
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Comparison API request failed');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("No response");

    return JSON.parse(text) as ComparisonAnalysis;
  } catch (error) {
    console.error("Comparison Error", error);
    throw error;
  }
};

export const generateWordImage = async (prompt: string): Promise<string> => {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error("请先设置 API Key");
  }

  try {
    // Use the imagen model for image generation
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"]
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Image generation failed');
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts;

    if (!parts) throw new Error("No content");

    for (const part of parts) {
      if (part.inlineData?.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

// --- Audio / TTS ---

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function createAudioBufferFromPCM(ctx: AudioContext, arrayBuffer: ArrayBuffer): AudioBuffer {
  const bytes = new Uint8Array(arrayBuffer);
  const int16Data = new Int16Array(arrayBuffer, 0, Math.floor(bytes.length / 2));
  const buffer = ctx.createBuffer(1, int16Data.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < int16Data.length; i++) {
    channelData[i] = int16Data[i] / 32768.0;
  }
  return buffer;
}

const ensureAudioData = async (text: string): Promise<ArrayBuffer> => {
  const key = `tts:${text}`;
  if (pendingRequests.has(key)) return pendingRequests.get(key);

  const promise = (async () => {
    const cachedPCM = await getCachedAudio(text);
    if (cachedPCM) return cachedPCM;

    const apiKey = getStoredApiKey();
    if (!apiKey) {
      throw new Error("请先设置 API Key");
    }

    // Use REST API for TTS
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: text }]
          }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: 'Kore'
                }
              }
            }
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'TTS generation failed');
    }

    const data = await response.json();
    const audioData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) throw new Error("No audio data");

    const pcmBuffer = base64ToArrayBuffer(audioData);
    await cacheAudio(text, pcmBuffer);
    return pcmBuffer;
  })();

  pendingRequests.set(key, promise);
  try {
    return await promise;
  } finally {
    pendingRequests.delete(key);
  }
};

export const playTextToSpeech = async (text: string): Promise<void> => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (audioContext.state === 'suspended') await audioContext.resume();

  try {
    const pcmBuffer = await ensureAudioData(text);
    const audioBuffer = createAudioBufferFromPCM(audioContext, pcmBuffer);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
};
