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
  artistic: `
    Aesthetic: ELEGANT, MINIMALIST, ARTISTIC.
    Visual: Muted tones (Morandi), natural light, museum quality.
    Literary: Poetic, philosophical, sophisticated, evocative.
    Associations: Poetic, thematic, literary connections.
  `,
  healing: `
    Aesthetic: HEALING, COZY, WARM.
    Visual: Soft watercolor textures, pastel colors, golden hour sunlight.
    Literary: Gentle, soothing, positive, simple, comforting.
    Associations: Positive, comforting, nature-oriented connections.
  `,
  anime: `
    Aesthetic: ANIME STYLE, DRAMATIC.
    Visual: Makoto Shinkai vibes, vibrant high-definition, cel-shaded.
    Literary: Emotional, dramatic, slice-of-life, internal monologue.
    Associations: Emotional, character-driven, narrative connections.
  `,
  scifi: `
    Aesthetic: SCI-FI, FUTURISTIC, COLD.
    Visual: Neon accents, deep blues, holographic elements, cyberpunk.
    Literary: Technical, analytical, visionary, sharp, precise.
    Associations: Technological, futuristic, scientific connections.
  `
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
          description_cn: { type: "string" },
          description_en: { type: "string" }
        },
        required: ["year", "language", "word", "meaning", "description_cn", "description_en"]
      }
    },
    related_concepts: {
      type: "array",
      description: "12 UNIQUE related concepts: 3 Synonyms, 3 Antonyms, 3 Associations, 3 Confusable words. Each word must appear only once.",
      minItems: 12,
      maxItems: 12,
      items: {
        type: "object",
        properties: {
          word: { type: "string", description: "The related word (must be unique)" },
          part_of_speech: { type: "string", description: "Part of speech: n./v./adj./adv./etc." },
          translation: { type: "string", description: "Chinese translation" },
          reason: { type: "string", description: "Brief explanation of the relationship" },
          relationType: { type: "string", enum: ["synonym", "antonym", "association", "confusable"] }
        },
        required: ["word", "part_of_speech", "translation", "reason", "relationType"],
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
    },
    galaxy_data: {
      type: "object",
      description: "Optional 3D Word Galaxy data (simplified)",
      properties: {
        coreWord: {
          type: "object",
          properties: {
            word: { type: "string" },
            definition: { type: "string" },
            pronunciation: { type: "string" }
          }
        },
        satellites: {
          type: "array",
          description: "Related words for 3D visualization",
          items: {
            type: "object",
            properties: {
              word: { type: "string" },
              type: { type: "string" },
              distance: { type: "number" }
            }
          }
        }
      }
    }
  },
  required: ["word", "phonetic", "meaning_cn", "etymology_cn", "sentence_en", "sentence_cn", "nano_banana_image_prompt", "related_concepts", "derivatives"],
};

const getComparisonSchema = (lang: Language) => ({
  type: "object",
  properties: {
    wordA: { type: "string" },
    wordB: { type: "string" },
    dimensions: {
      type: "array",
      description: "Exactly 4 comparison dimensions. Scores must use full 0-10 range, avoid clustering in middle.",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        properties: {
          label: { 
            type: "string", 
            description: lang === 'cn' 
              ? "Dimension name in Simplified Chinese ONLY (e.g. 正式程度, 情感强度). NO English." 
              : "Dimension name in English ONLY (e.g. Formality, Emotional Intensity). NO Chinese."
          },
          scoreA: { type: "number", description: "Score for word A (0-10). Use full range, avoid 4-6." },
          scoreB: { type: "number", description: "Score for word B (0-10). Use full range, avoid 4-6." }
        },
        required: ["label", "scoreA", "scoreB"]
      }
    },
    insight: { 
      type: "string", 
      description: lang === 'cn'
        ? "Detailed analysis in Simplified Chinese (2-3 sentences, minimum 50 Chinese characters). Explain key differences and usage guidance."
        : "Detailed analysis in English (2-3 sentences, minimum 50 words). Explain key differences and usage guidance."
    },
    sentenceA: { type: "string", description: "Example sentence for word A (ALWAYS in English)" },
    sentenceB: { type: "string", description: "Example sentence for word B (ALWAYS in English)" }
  },
  required: ["wordA", "wordB", "dimensions", "insight", "sentenceA", "sentenceB"]
});

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
    1. Output Language: Simplified Chinese (except target word, image prompt, and English fields).
    2. Aesthetic: ${selectedAesthetic}
    
    CRITICAL REQUIREMENTS:
    
    1. DEFINITION: Field 'meaning_cn' must be direct translation categorized by Part of Speech (e.g., "n. 狗\\nv. 跟踪").
    
    2. IMAGE PROMPT: Field 'nano_banana_image_prompt'. Use a specific, concrete visual metaphor based on the "Visual" aesthetic instructions. Embed the word '${inputWord}' artistically into the scene.
    
    3. EXAMPLE SENTENCE: Field 'sentence_en'. Write a sentence that strictly follows the "Literary" aesthetic instructions.
       - The sentence tone, vocabulary, and imagery must MATCH the style (e.g., poetic for Artistic, comforting for Healing, dramatic for Anime, technical for Sci-Fi).
    
    4. RELATED CONCEPTS (Starfield): Field 'related_concepts'. Generate EXACTLY 12 UNIQUE items.
       - The choice of 'associations' (3 items) must align with the "Associations" aesthetic instructions.
       - Must include EXACTLY 3 of each type:
         * 3 SYNONYMS: Near-synonyms.
         * 3 ANTONYMS: Direct opposites.
         * 3 ASSOCIATIONS: Thematic connections matching the style.
         * 3 CONFUSABLE: Words commonly confused.
       - CRITICAL: Ensure all 12 words are different.
    
    5. DERIVATIVES: Field 'derivatives'. List top 5 morphological variations.

    6. TIMELINE: Field 'etymology_timeline'. 3-5 historical stages.
       - 'description_cn': Context in Simplified Chinese.
       - 'description_en': Context in English.
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

// --- Fast Analysis for Galaxy (No Image Prompt, Timeline, etc.) ---
const quickAnalysisSchema = {
  type: "object",
  properties: {
    word: { type: "string" },
    phonetic: { type: "string" },
    meaning_cn: { type: "string" },
    related_concepts: {
      type: "array",
      minItems: 11,
      maxItems: 11,
      items: {
        type: "object",
        properties: {
          word: { type: "string" },
          part_of_speech: { type: "string" },
          translation: { type: "string" },
          reason: { type: "string" },
          relationType: { type: "string", enum: ["synonym", "antonym", "association", "confusable"] }
        },
        required: ["word", "part_of_speech", "translation", "reason", "relationType"],
      }
    }
  },
  required: ["word", "phonetic", "meaning_cn", "related_concepts"],
};

export const quickAnalyzeWord = async (inputWord: string): Promise<WordAnalysis> => {
  const apiKey = getStoredApiKey();
  if (!apiKey) throw new Error("请先设置 API Key");

  const systemInstruction = `
    You are a Linguistic Expert.
    Goal: QUICKLY analyze the word "${inputWord}" for a lexical association board.
    Output JSON fields: phonetic, meaning_cn (简要), and EXACTLY 11 related_concepts with counts:
      - 2 associations (relationType="association")
      - 3 synonyms (relationType="synonym")
      - 3 antonyms (relationType="antonym")
      - 3 confusables (relationType="confusable")
    All items must be UNIQUE and tagged with the correct relationType. Use 简体中文 for translations/reasons.
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: `Analyze: "${inputWord}"` }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: quickAnalysisSchema,
            temperature: 0.6,
          },
        })
      }
    );

    if (!response.ok) throw new Error('Quick analysis failed');
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("No response");

    const partialData = JSON.parse(text);
    
    // Fill in missing fields required by WordAnalysis type
    return {
      ...partialData,
      etymology_cn: "",
      sentence_en: "",
      sentence_cn: "",
      nano_banana_image_prompt: "",
      derivatives: [],
      etymology_timeline: [],
    } as WordAnalysis;

  } catch (error) {
    console.error("Quick Analysis Error:", error);
    throw error;
  }
};

// 独立生成 Galaxy 数据（按需调用，不影响主解析）
export const generateGalaxyData = async (wordAnalysis: WordAnalysis): Promise<WordAnalysis> => {
  // 如果已有 galaxy_data，直接返回
  if (wordAnalysis.galaxy_data) {
    console.log('[Galaxy] Using existing galaxy_data');
    return wordAnalysis;
  }

  console.log('[Galaxy] Generating galaxy data from related_concepts:', wordAnalysis.related_concepts?.length);

  // 从 related_concepts 转换为简化的 galaxy satellites
  const validConcepts = (wordAnalysis.related_concepts || [])
    .filter(c => {
      const isValid = c.relationType === 'synonym' || c.relationType === 'antonym' || c.relationType === 'confusable';
      if (!isValid) {
        console.log(`[Galaxy] Filtering out concept with type: ${c.relationType}`);
      }
      return isValid;
    })
    .slice(0, 10); // 最多10个

  console.log('[Galaxy] Valid concepts after filter:', validConcepts.length);

  if (validConcepts.length === 0) {
    console.error('[Galaxy] No valid concepts found, cannot generate galaxy data');
    throw new Error('No valid concepts for galaxy visualization');
  }

  const satellites = validConcepts.map((concept, index) => {
      let distance = 1.0;
      if (concept.relationType === 'synonym') distance = 0.8 + Math.random() * 0.5; // 0.8-1.3
      else if (concept.relationType === 'antonym') distance = 1.8 + Math.random() * 0.7; // 1.8-2.5
      else if (concept.relationType === 'confusable') distance = 1.2 + Math.random() * 0.6; // 1.2-1.8

      const satellite = {
        word: concept.word,
        type: concept.relationType as 'synonym' | 'antonym' | 'confusable',
        distance,
        part_of_speech: concept.part_of_speech,
        translation: concept.translation,
        nuance_score: {
          formal: Math.floor(Math.random() * 11),
          positive: Math.floor(Math.random() * 11),
          active: Math.floor(Math.random() * 11),
          common: Math.floor(Math.random() * 11),
          intensity: Math.floor(Math.random() * 11),
        }
      };

      console.log(`[Galaxy] Satellite ${index}:`, satellite.word, satellite.type);
      return satellite;
    });

  const galaxyData = {
    coreWord: {
      word: wordAnalysis.word,
      definition: wordAnalysis.meaning_cn.split('\n')[0]?.replace(/^[a-z]\.\s*/, '') || wordAnalysis.word,
      pronunciation: wordAnalysis.phonetic,
    },
    satellites,
    radar_dimensions: ['Formal', 'Positive', 'Active', 'Common', 'Intensity'],
    visual_prompt: `A glowing ethereal orb representing "${wordAnalysis.word}" floating in a soft violet nebula, dreamlike atmosphere, cinematic lighting`,
  };

  console.log('[Galaxy] Generated galaxy data:', {
    coreWord: galaxyData.coreWord.word,
    satellitesCount: galaxyData.satellites.length,
    satelliteTypes: galaxyData.satellites.map(s => s.type)
  });

  return {
    ...wordAnalysis,
    galaxy_data: galaxyData
  };
};

export const compareWords = async (wordA: string, wordB: string, lang: Language): Promise<ComparisonAnalysis> => {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error("请先设置 API Key");
  }

  const targetLang = lang === 'cn' ? 'Simplified Chinese' : 'English';

  const systemInstruction = `
    You are a Semantic Nuance Analyzer specializing in deep vocabulary comparison.
    
    Goal: Compare "${wordA}" and "${wordB}" across exactly 4 meaningful dimensions.
    
    CRITICAL SCORING REQUIREMENTS:
    1. Scores range from 0-10 (0 = lowest, 10 = highest on that dimension)
    2. AVOID clustering scores around 5-6. Use the FULL range (0-10)
    3. At least 2 dimensions should show SIGNIFICANT difference (4+ points apart)
    4. Scores should reflect REAL semantic differences, not be artificially balanced
    
    DIMENSION SELECTION:
    - Choose dimensions where the words genuinely differ
    - Good examples: 正式程度, 情感强度, 具体性, 使用频率, 文学性, 口语化, 抽象度, 褒贬性
    - Make dimensions SPECIFIC and MEANINGFUL
    
    INSIGHT REQUIREMENTS:
    - Write 2-3 sentences (minimum 50 words in ${targetLang})
    - Explain the KEY difference between the words
    - Give PRACTICAL usage guidance (when to use which word)
    - Be specific and insightful, not generic
    
    EXAMPLE SENTENCES:
    - Must clearly demonstrate the nuance difference
    - Use natural, sophisticated English
    
    STRICT LANGUAGE OUTPUT RULES:
    ${lang === 'cn' ? `
    - Dimension labels: MUST be in Simplified Chinese ONLY (e.g. "正式程度", "情感强度", NOT "Formality" or "正式程度 Formality")
    - Insight: MUST be in Simplified Chinese ONLY
    ` : `
    - Dimension labels: MUST be in English ONLY (e.g. "Formality", "Emotional Intensity")
    - Insight: MUST be in English ONLY
    `}
    - Example sentences: ALWAYS in English (regardless of interface language)
    - DO NOT mix languages in dimension labels
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
            responseSchema: getComparisonSchema(lang),
            temperature: 0.7,
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
