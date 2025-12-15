"use client";

import { SpreadType, DrawnCard, TarotCard } from '../types';
import { MoodType, DivinationType } from '../constants/personalization';
import { SPREADS } from '../constants/tarotData';

// Gemini API 图像生成 - 使用 Gemini 2.0 Flash Image Generation
export async function generateTarotImage(
  card: TarotCard,
  isReversed: boolean,
  question: string,
  mood: MoodType,
  theme: DivinationType,
  apiKey: string
): Promise<string> {
  // 构建生图提示词 - 简洁且富有艺术感
  const orientationHint = isReversed 
    ? 'with subtle darker tones, inverted energy, shadows and challenges' 
    : 'with radiant light, uplifting energy, clarity and hope';

  const moodMap: Record<MoodType, string> = {
    [MoodType.Calm]: 'serene, tranquil, peaceful atmosphere',
    [MoodType.Anxious]: 'tense, uncertain, turbulent energy',
    [MoodType.Hopeful]: 'bright, optimistic, promising light',
    [MoodType.Confused]: 'mysterious, foggy, complex layers',
    [MoodType.Sad]: 'melancholic, soft, gentle twilight',
    [MoodType.Excited]: 'vibrant, dynamic, electric energy',
  };

  const themeMap: Record<DivinationType, string> = {
    [DivinationType.General]: 'cosmic universe, starlight, divine wisdom',
    [DivinationType.Love]: 'roses, hearts, romantic atmosphere',
    [DivinationType.Career]: 'upward path, mountain peak, achievement',
    [DivinationType.Money]: 'golden coins, abundance, prosperity',
    [DivinationType.Health]: 'healing light, nature, vitality',
    [DivinationType.Study]: 'ancient books, owl, knowledge',
    [DivinationType.Relationship]: 'intertwined hands, connection, bridges',
  };

  const prompt = `Create a mystical tarot card illustration for "${card.nameCn}" (${card.name}, Number ${card.number}).

Visual Style:
- Ethereal and dreamlike with magical lighting
- Rich colors: deep purples, golds, cosmic blues, mystical violets
- Ornate border with intricate patterns and symbols
- Professional tarot card aesthetic with spiritual symbolism

Card Meaning: ${isReversed ? card.reversed : card.upright}
Keywords: ${card.keywordsCn.join(', ')}

Atmosphere: ${moodMap[mood]}, ${orientationHint}
Symbolic Elements: ${themeMap[theme]}

Artistic Elements:
- Central symbolic figure or scene representing the card's essence
- Mystical symbols: stars, moon, crystals, sacred geometry
- Flowing energy, light rays, or magical particles
- Ornamental frame with mystical motifs
- Professional tarot card layout and composition

The image should be visually stunning, spiritually evocative, and capture the essence of both the card's traditional meaning and the querent's personal context.`;

  try {
    // 使用 Gemini 2.0 Flash Image Generation 模型
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

    if (!parts) {
      throw new Error("No content returned from image generation");
    }

    // 查找图像数据
    for (const part of parts) {
      if (part.inlineData?.data) {
        // 返回 base64 格式的图片
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error('Error generating tarot image:', error);
    throw error;
  }
}

// Gemini API 解读塔罗牌
export async function interpretReading(
  question: string,
  spreadType: SpreadType,
  drawnCards: DrawnCard[],
  apiKey: string,
  mood?: MoodType,
  theme?: DivinationType
): Promise<{
  cardInterpretations: string[];
  cardRelations: string;
  storyNarrative: string;
  interpretation: string;
  advice: string;
}> {
  const spread = SPREADS.find(s => s.id === spreadType);
  if (!spread) {
    throw new Error('Invalid spread type');
  }

  // 构建提示词
  const cardsDescription = drawnCards
    .map((dc, idx) => {
      const pos = spread.positions[idx];
      return `位置${idx + 1} - ${pos.nameCn} (${pos.meaningCn})：
      卡牌：${dc.card.nameCn} (${dc.card.name})
      牌号：${dc.card.number}
      状态：${dc.isReversed ? '逆位' : '正位'}
      关键词：${dc.card.keywordsCn.join('、')}
      含义：${dc.isReversed ? dc.card.reversed : dc.card.upright}`;
    })
    .join('\n\n');

  const moodContext = mood ? `\n当前心情：${mood}` : '';
  const themeContext = theme ? `\n占卜主题：${theme}` : '';

  const systemPrompt = `你是一位经验丰富的塔罗占卜师，拥有深厚的神秘学知识和敏锐的直觉。

你的任务是为求问者提供深入、富有洞察力的塔罗牌解读。请提供：

1. **单牌解读** (cardInterpretations)：
   - 为每张牌提供独立的深入解读
   - 结合牌的位置意义、正逆位状态
   - 每张牌的解读约150-200字
   - 返回字符串数组，每个元素对应一张牌

2. **牌间关联** (cardRelations)：
   - 分析牌与牌之间的能量流动
   - 揭示牌面之间的呼应、冲突或互补关系
   - 如何共同构成完整的指引
   - 约200-300字的段落

3. **故事叙事** (storyNarrative)：
   - 将所有牌串联成一个连贯的故事
   - 用诗意、象征性的语言
   - 让求问者感受到神秘的氛围
   - 约300-400字的叙事段落

4. **综合解读** (interpretation)：
   - 整体分析牌阵的核心信息
   - 回应求问者的问题
   - 提供深层次的洞察
   - 约300-400字

5. **建议与指引** (advice)：
   - 具体、可操作的建议
   - 精神层面的指引
   - 鼓励与启发
   - 约200-300字

语言风格：
- 神秘而富有诗意
- 充满智慧和同理心
- 避免绝对化的预言
- 强调自由意志和个人选择
- 使用象征性和隐喻性的表达

请以JSON格式返回：
{
  "cardInterpretations": ["牌1的解读", "牌2的解读", ...],
  "cardRelations": "牌间关联分析",
  "storyNarrative": "故事化叙事",
  "interpretation": "综合解读",
  "advice": "建议与指引"
}`;

  const userPrompt = `求问者的问题：${question}${moodContext}${themeContext}

牌阵：${spread.nameCn}
${spread.descriptionCn}

抽到的牌：
${cardsDescription}

请进行深入解读。`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [
            {
              parts: [{ text: userPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 3000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from Gemini API');
    }

    // 尝试解析JSON响应
    try {
      // 清理可能的markdown代码块标记
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const result = JSON.parse(cleanedText);
      
      return {
        cardInterpretations: result.cardInterpretations || [],
        cardRelations: result.cardRelations || '',
        storyNarrative: result.storyNarrative || '',
        interpretation: result.interpretation || '',
        advice: result.advice || '',
      };
    } catch (parseError) {
      // 如果JSON解析失败，尝试从文本中提取内容
      console.error('JSON parse error:', parseError);
      return {
        cardInterpretations: drawnCards.map(() => text.slice(0, 200)),
        cardRelations: '',
        storyNarrative: '',
        interpretation: text,
        advice: '请根据牌面含义，结合自己的直觉做出选择。',
      };
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}
