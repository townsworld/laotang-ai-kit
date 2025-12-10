import { Scene, CopywritingResult } from '../types';

const SCENE_PROMPTS: Record<Scene, string> = {
  xiaohongshu_title: `你是小红书爆款标题专家。根据用户输入的主题，生成 8 个小红书标题。

要求：
1. 必须包含 emoji，但不要过度使用
2. 使用数字、对比、疑问等吸引眼球的手法
3. 长度控制在 15-25 字
4. 风格多样：有的专业、有的可爱、有的悬疑、有的直接
5. 避免标题党，保持真实感
6. 不要使用"震惊"、"必看"等低质词汇

返回格式：
{
  "variants": ["标题1", "标题2", ..., "标题8"],
  "tips": "一句话写作建议"
}`,

  douyin_script: `你是抖音爆款脚本专家。根据用户输入的主题，生成 5 个抖音短视频脚本大纲。

每个脚本包含：
1. 【开头钩子】(3秒内抓住注意力)
2. 【核心内容】(主要观点或故事)
3. 【结尾引导】(点赞/关注/评论)

要求：
- 开头必须有冲突/疑问/反常识
- 语言口语化，适合脱口秀
- 每个脚本控制在 60 字内
- 风格多样

返回格式：
{
  "variants": [
    "【开头】xxx\n【内容】xxx\n【结尾】xxx",
    ...
  ],
  "tips": "脚本创作建议"
}`,

  moments: `你是朋友圈文案高手。根据用户输入的主题/心情，生成 6 条朋友圈文案。

要求：
1. 有的简短有力（1句话），有的细腻动人（3-5句）
2. 适当使用 emoji，但不要每句都有
3. 风格多样：文艺、幽默、正能量、自嘲、感性
4. 避免鸡汤和说教
5. 让人看了想点赞或评论

返回格式：
{
  "variants": ["文案1", "文案2", ..., "文案6"],
  "tips": "朋友圈文案小技巧"
}`,

  product_desc: `你是电商文案专家。根据用户输入的产品信息，生成 5 个产品描述文案。

要求：
1. 突出卖点，而非堆砌参数
2. 用场景化语言（用户能想象使用画面）
3. 有的走专业路线，有的走情感路线
4. 长度控制在 50-100 字
5. 可以用对比、数据、用户评价等手法

返回格式：
{
  "variants": ["描述1", "描述2", ..., "描述5"],
  "tips": "产品文案撰写建议"
}`,

  email_marketing: `你是营销邮件专家。根据用户输入的营销目的，生成 4 个邮件主题行 + 开头段落。

要求：
1. 主题行：15字内，吸引打开
2. 开头段落：3-5句，引导点击
3. 避免被识别为垃圾邮件的词汇
4. 风格：有的专业正式，有的亲切随和
5. 可以用限时优惠、独家内容等钩子

返回格式：
{
  "variants": [
    "【主题】xxx\n【开头】xxx",
    ...
  ],
  "tips": "邮件营销小贴士"
}`,
};

export const generateCopywriting = async (
  scene: Scene,
  input: string,
  apiKey: string
): Promise<CopywritingResult> => {
  const systemPrompt = SCENE_PROMPTS[scene];

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
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: input }],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'object',
              properties: {
                variants: {
                  type: 'array',
                  items: { type: 'string' },
                },
                tips: {
                  type: 'string',
                },
              },
              required: ['variants'],
            },
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      throw new Error('AI 返回内容为空');
    }

    return JSON.parse(textContent) as CopywritingResult;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

