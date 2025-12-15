/**
 * 批量生成塔罗牌图片脚本
 * 
 * 使用方法：
 * 1. 设置环境变量 GEMINI_API_KEY
 * 2. 运行: node scripts/generate-tarot-images.js
 * 
 * 生成的图片将保存到 public/images/tarot/ 目录
 */

import * as fsModule from 'fs';
import * as pathModule from 'path';
import * as httpsModule from 'https';

const fs = fsModule;
const path = pathModule;
const https = httpsModule;

// 塔罗牌数据（从 tarotData.ts 复制）
const MAJOR_ARCANA = [
  {
    id: 'major-0',
    nameCn: '愚者',
    name: 'The Fool',
    number: 0,
    keywordsCn: ['新开始', '天真', '冒险', '自由'],
    upright: '新的开始、纯真的信念、自由的灵魂、勇敢的冒险',
    reversed: '鲁莽冲动、缺乏计划、愚昧无知、错失机会',
  },
  {
    id: 'major-1',
    nameCn: '魔术师',
    name: 'The Magician',
    number: 1,
    keywordsCn: ['显化', '力量', '技巧', '行动'],
    upright: '创造力、技能、意志力、开始行动',
    reversed: '操纵他人、缺乏才能、延迟行动、浪费潜力',
  },
  {
    id: 'major-2',
    nameCn: '女祭司',
    name: 'The High Priestess',
    number: 2,
    keywordsCn: ['直觉', '神秘', '潜意识', '智慧'],
    upright: '直觉、内在智慧、神秘知识、潜意识',
    reversed: '忽视直觉、肤浅、秘密被揭露、内心混乱',
  },
  {
    id: 'major-3',
    nameCn: '皇后',
    name: 'The Empress',
    number: 3,
    keywordsCn: ['丰盛', '养育', '创造力', '自然'],
    upright: '丰饶、母性、创造力、自然之美',
    reversed: '依赖他人、窒息的爱、创造力受阻、物质损失',
  },
  {
    id: 'major-4',
    nameCn: '皇帝',
    name: 'The Emperor',
    number: 4,
    keywordsCn: ['权威', '结构', '控制', '父性'],
    upright: '权威、结构、控制、父性力量',
    reversed: '专制、缺乏纪律、刚愎自用、权力滥用',
  },
  {
    id: 'major-5',
    nameCn: '教皇',
    name: 'The Hierophant',
    number: 5,
    keywordsCn: ['传统', '信仰', '教育', '道德'],
    upright: '传统、宗教、道德、教育、精神指引',
    reversed: '反叛、打破常规、怀疑权威、个人信仰',
  },
  {
    id: 'major-6',
    nameCn: '恋人',
    name: 'The Lovers',
    number: 6,
    keywordsCn: ['爱情', '和谐', '选择', '结合'],
    upright: '爱情、和谐、关系、价值观、重要选择',
    reversed: '失衡、错误选择、不和谐、价值观冲突',
  },
  {
    id: 'major-7',
    nameCn: '战车',
    name: 'The Chariot',
    number: 7,
    keywordsCn: ['意志', '胜利', '控制', '前进'],
    upright: '意志力、胜利、自律、成功、前进',
    reversed: '失控、缺乏方向、侵略性、挫败',
  },
  {
    id: 'major-8',
    nameCn: '力量',
    name: 'Strength',
    number: 8,
    keywordsCn: ['勇气', '耐心', '温柔', '控制'],
    upright: '内在力量、勇气、耐心、温柔的控制',
    reversed: '自我怀疑、缺乏信心、虚弱、滥用力量',
  },
  {
    id: 'major-9',
    nameCn: '隐者',
    name: 'The Hermit',
    number: 9,
    keywordsCn: ['内省', '独处', '智慧', '指引'],
    upright: '内省、独处、寻求真理、内在指引',
    reversed: '孤立、孤独、拒绝帮助、迷失方向',
  },
  {
    id: 'major-10',
    nameCn: '命运之轮',
    name: 'Wheel of Fortune',
    number: 10,
    keywordsCn: ['命运', '循环', '转折', '机会'],
    upright: '命运、循环、转折点、好运、新机会',
    reversed: '坏运气、抗拒变化、失控、恶性循环',
  },
  {
    id: 'major-11',
    nameCn: '正义',
    name: 'Justice',
    number: 11,
    keywordsCn: ['公正', '真相', '法律', '平衡'],
    upright: '公正、真相、法律、平衡、因果',
    reversed: '不公、逃避责任、不诚实、失衡',
  },
  {
    id: 'major-12',
    nameCn: '倒吊人',
    name: 'The Hanged Man',
    number: 12,
    keywordsCn: ['牺牲', '放手', '暂停', '新视角'],
    upright: '牺牲、放手、暂停、新视角、启示',
    reversed: '无谓牺牲、拖延、抗拒、错失机会',
  },
  {
    id: 'major-13',
    nameCn: '死神',
    name: 'Death',
    number: 13,
    keywordsCn: ['结束', '转变', '重生', '释放'],
    upright: '结束、转变、蜕变、重生、释放过去',
    reversed: '抗拒改变、无法释怀、停滞、恐惧',
  },
  {
    id: 'major-14',
    nameCn: '节制',
    name: 'Temperance',
    number: 14,
    keywordsCn: ['平衡', '和谐', '耐心', '融合'],
    upright: '平衡、和谐、耐心、节制、融合',
    reversed: '失衡、极端、不耐烦、缺乏和谐',
  },
  {
    id: 'major-15',
    nameCn: '恶魔',
    name: 'The Devil',
    number: 15,
    keywordsCn: ['束缚', '诱惑', '物欲', '阴影'],
    upright: '束缚、诱惑、物质主义、阴影面',
    reversed: '解脱、觉醒、打破束缚、自由',
  },
  {
    id: 'major-16',
    nameCn: '高塔',
    name: 'The Tower',
    number: 16,
    keywordsCn: ['突变', '混乱', '启示', '解放'],
    upright: '突然改变、混乱、启示、破坏重建',
    reversed: '避免灾难、恐惧改变、延迟不可避免',
  },
  {
    id: 'major-17',
    nameCn: '星星',
    name: 'The Star',
    number: 17,
    keywordsCn: ['希望', '灵感', '平静', '更新'],
    upright: '希望、灵感、平静、疗愈、更新',
    reversed: '绝望、缺乏信心、断开连接、悲观',
  },
  {
    id: 'major-18',
    nameCn: '月亮',
    name: 'The Moon',
    number: 18,
    keywordsCn: ['幻觉', '恐惧', '直觉', '潜意识'],
    upright: '幻觉、恐惧、焦虑、直觉、潜意识',
    reversed: '释放恐惧、清晰、真相浮现、内在平静',
  },
  {
    id: 'major-19',
    nameCn: '太阳',
    name: 'The Sun',
    number: 19,
    keywordsCn: ['喜悦', '成功', '庆祝', '活力'],
    upright: '喜悦、成功、庆祝、活力、光明',
    reversed: '过度乐观、延迟快乐、悲观、低落',
  },
  {
    id: 'major-20',
    nameCn: '审判',
    name: 'Judgement',
    number: 20,
    keywordsCn: ['觉醒', '重生', '召唤', '宽恕'],
    upright: '觉醒、重生、内在召唤、宽恕、反思',
    reversed: '自我怀疑、拒绝改变、逃避责任、内疚',
  },
  {
    id: 'major-21',
    nameCn: '世界',
    name: 'The World',
    number: 21,
    keywordsCn: ['完成', '圆满', '成就', '整合'],
    upright: '完成、圆满、成就、整合、旅程终点',
    reversed: '未完成、缺乏闭环、延迟、需要努力',
  },
];

// 生成图片提示词
function generatePrompt(card: any): string {
  return `Create a mystical tarot card illustration for "${card.nameCn}" (${card.name}, Number ${card.number}).

Visual Style:
- Ethereal and dreamlike with magical lighting
- Rich colors: deep purples, golds, cosmic blues, mystical violets
- Ornate border with intricate patterns and symbols
- Professional tarot card aesthetic with spiritual symbolism

Card Meaning: ${card.upright}
Keywords: ${card.keywordsCn.join(', ')}

Artistic Elements:
- Central symbolic figure or scene representing the card's essence
- Mystical symbols: stars, moon, crystals, sacred geometry
- Flowing energy, light rays, or magical particles
- Ornamental frame with mystical motifs
- Professional tarot card layout and composition

The image should be visually stunning, spiritually evocative, and capture the essence of the card's traditional meaning.`;
}

// 调用 Gemini API 生成图片
async function generateImage(prompt: string, apiKey: string): Promise<string> {
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
    throw new Error("No content returned");
  }

  for (const part of parts) {
    if (part.inlineData?.data) {
      return part.inlineData.data; // 返回 base64 数据
    }
  }
  
  throw new Error("No image data found");
}

// 保存图片
function saveImage(base64Data: string, filename: string, outputDir: string): void {
  const buffer = Buffer.from(base64Data, 'base64');
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, buffer);
  console.log(`✅ Saved: ${filename}`);
}

// 主函数
async function main(): Promise<void> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY environment variable not set');
    console.error('Usage: GEMINI_API_KEY=your_key npx ts-node scripts/generate-tarot-images.ts');
    process.exit(1);
  }

  // 创建输出目录
  const outputDir = path.join(process.cwd(), 'public', 'images', 'tarot');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created directory: ${outputDir}`);
  }

  console.log(`🎨 Starting to generate ${MAJOR_ARCANA.length} tarot card images...\n`);

  for (let i = 0; i < MAJOR_ARCANA.length; i++) {
    const card = MAJOR_ARCANA[i];
    console.log(`[${i + 1}/${MAJOR_ARCANA.length}] Generating: ${card.nameCn} (${card.name})...`);

    try {
      const prompt = generatePrompt(card);
      const base64Data = await generateImage(prompt, apiKey);
      const filename = `${card.id}.png`;
      saveImage(base64Data, filename, outputDir);
      
      // 添加延迟避免 API 限流
      if (i < MAJOR_ARCANA.length - 1) {
        console.log('⏳ Waiting 2 seconds...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`❌ Failed to generate ${card.nameCn}:`, error);
      console.log('⏭️  Skipping to next card...\n');
    }
  }

  console.log('\n✨ All done! Images saved to:', outputDir);
  console.log('\n📝 Next steps:');
  console.log('1. Review the generated images');
  console.log('2. Run the update script to add image paths to tarotData.ts');
}

main().catch(console.error);

