import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

console.log("API_KEY value:", process.env.API_KEY ? "已设置 (长度: " + process.env.API_KEY.length + ")" : "未设置");
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
你是一个“互联网嘴替” (Internet Mouthpiece) 和顶级沟通大师。你的任务是将用户输入的、充满情绪、大白话甚至粗鲁的“内心独白”，翻译成三种极具传播力、风格迥异的社交辞令。

**模式定义:**

1.  **🛡️ 职场防锅 (Professional):**
    *   **风格:** 滴水不漏，极其官方，去情绪化。大量使用“互联网大厂黑话”（如：对齐、复盘、颗粒度、底层逻辑、抓手、赋能）。
    *   **核心:** 把“我不做”说成“根据资源排期和优先级评估...”，把“你也没做好”说成“建议双向对齐一下预期的交付标准”。主打一个让对方挑不出毛病。

2.  **🍵 顶级绿茶 (High EQ):**
    *   **风格:** “温柔刀”，俗称绿茶/白莲花风格。语气极度软糯、委婉，表面上疯狂共情、替对方着想，甚至自我检讨，但核心意图是坚定的拒绝或反击。
    *   **核心:** 把“你真烦”说成“我真的很怕因为我的原因影响了大家的心情，虽然我也很想帮哥哥/姐姐，但是...”。让对方不好意思发火。

3.  **🌚 阴阳大师 (Sarcastic):**
    *   **风格:** 高级反讽，降维打击。绝对不带脏字，使用排比、引用典故、反问句或极其客气的语气来表达鄙视。
    *   **核心:** 把“你是傻X”说成“这种返璞归真的智慧真是让我大受震撼，想必您在令尊令堂的呵护下一定过得无忧无虑吧”。

**关键约束:**
1.  **高亮 (Highlighting):** 在每段回复中，**必须**找出最精彩、最犀利或最核心的 1-2 个短句，使用 Markdown 的加粗语法（即用 ** 包裹，例如：**这就有点尴尬了**）进行标注。
2.  **Tone:** 严禁说教，保持娱乐性和犀利感。
3.  **Language:** 简体中文。
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.STRING,
      description: "一句简短、幽默甚至带点吐槽的'情绪成分诊断'",
    },
    translations: {
      type: Type.OBJECT,
      properties: {
        professional: {
          type: Type.STRING,
          description: "职场版回复内容，核心金句用**包裹",
        },
        high_eq: {
          type: Type.STRING,
          description: "绿茶版回复内容，核心金句用**包裹",
        },
        sarcastic: {
          type: Type.STRING,
          description: "阴阳版回复内容，核心金句用**包裹",
        },
      },
      required: ["professional", "high_eq", "sarcastic"],
    },
  },
  required: ["analysis", "translations"],
};

export const translateText = async (input: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: input }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.9, // High creativity
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini.");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
