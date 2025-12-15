# 塔罗占卜 AI 工具

一个结合神秘塔罗牌和 AI 智慧的占卜工具，为您提供深刻的洞察和指引。

## ✨ 功能特点

### 🎴 完整的塔罗牌系统
- **22张大阿卡纳牌**：包含从愚者到世界的所有主牌
- **正位与逆位**：每张牌都有正位和逆位的不同含义
- **关键词提示**：每张牌都配有中英文关键词

### 🃏 多种牌阵选择

1. **单张抽牌** - 每日指引，快速洞察
2. **三张牌阵** - 过去-现在-未来 或 情况-行动-结果
3. **关系牌阵** - 5张牌深入了解关系动态
4. **事业牌阵** - 5张牌为职业发展提供指引
5. **凯尔特十字** - 10张牌全面深度解读

### 🤖 AI 智能解读
- 基于 Google Gemini 2.0 Flash Exp 模型
- 温暖、智慧且富有洞察力的语言
- 综合解读牌面之间的联系和能量流动
- 提供具体可行的建议和指引

### 📝 历史记录
- 自动保存所有占卜记录
- 可查看、重温历史占卜
- 支持删除单条或清空全部记录
- 本地存储，保护隐私

## 🎨 设计特色

- **精美的视觉效果**：紫色到粉色的渐变主题，神秘而优雅
- **动画翻牌体验**：点击翻牌，带来真实的占卜仪式感
- **响应式设计**：完美适配桌面和移动设备
- **流畅的动画**：淡入淡出、翻转、脉动等多种动画效果

## 📖 使用方法

1. **选择牌阵**：根据你的问题选择合适的牌阵
2. **输入问题**：诚心提出你的问题
3. **抽取塔罗牌**：系统会随机抽取相应数量的牌
4. **翻牌查看**：点击每张牌进行翻牌
5. **获得解读**：AI 会为你提供综合解读和建议

## 🔑 准备工作

使用前需要设置 Gemini API Key：
1. 点击右上角的 API Key 按钮
2. 输入你的 Google Gemini API Key
3. 开始占卜

## 💡 使用建议

- **诚心提问**：以开放的心态提出问题
- **关注直觉**：除了 AI 解读，也要关注自己的直觉
- **理性看待**：塔罗牌是一种自我探索工具，不要过度迷信
- **定期记录**：通过历史记录追踪自己的成长

## 🛠️ 技术栈

- **框架**：Next.js 14 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **AI**：Google Gemini 2.0 Flash Exp
- **图标**：Lucide React
- **存储**：LocalStorage

## 📁 文件结构

```
tarot-divination/
├── components/           # React 组件
│   ├── QuestionInput.tsx      # 问题输入组件
│   ├── SpreadSelector.tsx     # 牌阵选择器
│   ├── TarotCard.tsx          # 塔罗牌卡片
│   ├── ReadingResult.tsx      # 解读结果
│   └── HistoryPanel.tsx       # 历史记录面板
├── constants/           # 常量数据
│   └── tarotData.ts          # 塔罗牌数据和牌阵配置
├── services/            # 服务层
│   └── geminiService.ts      # AI 解读服务
├── types.ts             # TypeScript 类型定义
├── page.tsx             # 主页面
├── metadata.json        # 工具元数据
└── README.md           # 说明文档
```

## 🔮 塔罗牌列表

包含完整的22张大阿卡纳牌：
0. 愚者 (The Fool)
1. 魔术师 (The Magician)
2. 女祭司 (The High Priestess)
3. 皇后 (The Empress)
4. 皇帝 (The Emperor)
5. 教皇 (The Hierophant)
6. 恋人 (The Lovers)
7. 战车 (The Chariot)
8. 力量 (Strength)
9. 隐士 (The Hermit)
10. 命运之轮 (Wheel of Fortune)
11. 正义 (Justice)
12. 倒吊人 (The Hanged Man)
13. 死神 (Death)
14. 节制 (Temperance)
15. 恶魔 (The Devil)
16. 高塔 (The Tower)
17. 星星 (The Star)
18. 月亮 (The Moon)
19. 太阳 (The Sun)
20. 审判 (Judgement)
21. 世界 (The World)

## 📝 版本说明

**v1.0.0** (2025-12-10)
- ✅ 22张大阿卡纳牌完整实现
- ✅ 5种牌阵选择
- ✅ AI 智能解读
- ✅ 历史记录功能
- ✅ 精美的翻牌动画
- ✅ 响应式设计

## 🚀 未来计划

- [ ] 添加56张小阿卡纳牌
- [ ] 更多牌阵选择
- [ ] 塔罗牌学习模式
- [ ] 牌义详细解释
- [ ] 分享占卜结果
- [ ] 每日一卡推送

---

© 2025 塔罗占卜 · Powered by 程序员老唐AI

