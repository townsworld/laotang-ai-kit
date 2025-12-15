# Word Galaxy 3D - 灵犀星云

## 🌌 概述

全新的 **3D 单词探索系统**，采用 "灵犀星云 (Ethereal Nebula)" 设计风格，打造通透、梦幻、流动的视觉体验。

## ✨ 核心特性

### 1. 多轨道原子模型
- **中心恒星**: 查询的目标单词（最大体积）
- **轨道 A (近地轨道)**: 近义词 Synonyms，距离最近，轨道倾斜 15°
- **轨道 B (中层轨道)**: 反义词 Antonyms，距离中等，轨道倾斜 -30°
- **轨道 C (外层带)**: 易混词 Confusable，距离最远，漂浮状态

### 2. 晶体质感节点
使用 `MeshPhysicalMaterial` 实现玻璃质感：
- `transmission: 0.9` - 通透度
- `roughness: 0.1` - 光滑表面
- `thickness: 1.0` - 厚度
- `ior: 1.5` - 折射率

### 3. 灵犀星云配色
```typescript
背景渐变:
  - Top: #0F172A (Deep Space Blue)
  - Bottom: #2E1065 (Soft Violet/Nebula Purple)

节点光源:
  - Core (主词): #F8FAFC (Moonlight White)
  - Synonyms (近义词): #F0ABFC (Soft Pink/Rose)
  - Antonyms (反义词): #93C5FD (Ice Blue)
  - Confusable (易混词): #C4B5FD (Lavender)
```

### 4. 入场动画 - 星尘汇聚
1. **散布阶段**: 2000+ 粒子随机分布在球形空间
2. **汇聚阶段**: 粒子螺旋向心运动，形成漩涡
3. **爆炸绽放**: 到达中心后"砰"的一声柔和绽放
4. **完整显现**: 星系结构浮现

### 5. 全息雷达图 (Holographic Radar)
点击任意"行星"词汇，触发微渺辨析：
- 摄像机平滑推近，聚焦两个词
- 展开半透明雷达图，显示 5 个语义维度
- 实时对比评分（0-10 全范围）
- 动态旋转 + 呼吸效果

### 6. 后处理效果 (Post-processing)
- **UnrealBloomPass**: 
  - `threshold: 0.2`
  - `strength: 1.5` (爆炸时 3.0)
  - `radius: 0.5`
- **噪点纹理**: 增加质感
- **柔和光晕**: 紫色/蓝色环境光

## 🎯 交互流程

```
1. 搜索单词 → 显示词卡
2. 点击"探索"按钮 → 星尘汇聚动画 → 进入 3D 星系
3. 在星系中:
   - 点击任意"行星" → 弹出菜单
   - 选择"导航" → 跳转到该词
   - 选择"雷达" → 展开全息雷达图对比
4. 雷达图:
   - 显示 5 维度语义对比
   - 粉色 vs 冰蓝双色多边形
   - 自动旋转展示
```

## 🛠️ 技术栈

- **Three.js**: 3D 场景渲染
- **React Three Fiber**: React 集成
- **@react-three/drei**: 辅助组件 (Text, OrbitControls, etc.)
- **@react-three/postprocessing**: 后处理效果 (Bloom)
- **Gemini 2.0**: AI 生成语义数据 + 雷达维度

## 📦 文件结构

```
app/kits/lexicon-artistry/
├── components/
│   ├── StarGalaxy3D.tsx          # 主 3D 星系组件
│   ├── HolographicRadar3D.tsx    # 全息雷达图
│   ├── StarDustAnimation.tsx     # 入场动画（星尘汇聚）
│   └── StarField.tsx              # 原 2D 星空（保留）
├── services/
│   └── geminiService.ts          # 更新：生成 galaxy_data
├── types.ts                       # 新增 GalaxyData 类型
└── page.tsx                       # 集成 3D 组件

新增依赖:
- @react-three/fiber
- @react-three/drei
- @react-three/postprocessing
- three
```

## 🎨 设计原则

### 拒绝赛博朋克
❌ 硬光照射、黑暗背景、霓虹线条
✅ 柔和辉光、通透质感、梦幻渐变

### 女性友好审美
- 使用柔和的粉色、紫色、冰蓝色
- 圆润的几何体（球形、冰晶体）
- 流动的动画（呼吸、漂浮）
- 优雅的字体（Playfair Display 衬线体）

### 呼吸感
- 核心词：正弦波光晕律动
- 粒子：轻微上下浮动
- 整体场景：极慢旋转（0.0005 rad/frame）

## 🔄 切换模式

在 `page.tsx` 中设置：
```typescript
const [use3DMode, setUse3DMode] = useState(true); // true = 3D, false = 2D
```

- **3D 模式**: 使用 StarGalaxy3D + HolographicRadar3D
- **2D 模式**: 使用原有 StarField + NuanceRadar

## 🚀 性能优化

- `useMemo`: 缓存粒子位置计算
- `useFrame`: 高效动画更新
- `powerPreference: 'high-performance'`: GPU 加速
- 粒子数量控制在 2000 以内
- 卫星数量限制 8-12 个

## 📊 数据结构示例

```json
{
  "galaxy_data": {
    "coreWord": {
      "word": "Serendipity",
      "definition": "The occurrence of events by chance in a happy way.",
      "pronunciation": "/ˌserənˈdɪpəti/"
    },
    "satellites": [
      {
        "word": "Chance",
        "type": "synonym",
        "distance": 1.0,
        "nuance_score": {
          "formal": 4, "positive": 6, "active": 5, 
          "common": 8, "intensity": 5
        },
        "part_of_speech": "n.",
        "translation": "机会，偶然"
      },
      {
        "word": "Misfortune",
        "type": "antonym",
        "distance": 2.2,
        "nuance_score": {
          "formal": 5, "positive": 1, "active": 3,
          "common": 6, "intensity": 7
        }
      }
    ],
    "radar_dimensions": ["Formal", "Positive", "Active", "Common", "Intensity"],
    "visual_prompt": "A glowing ethereal orb floating in a soft violet nebula..."
  }
}
```

## 🎬 动画时间轴

```
0.0s - 2.0s : 星尘汇聚（螺旋向心）
2.0s - 2.5s : 爆炸绽放（Bloom 强度 3.0）
2.5s+       : 星系完整显示（开始自转）
```

## 🌟 未来增强

- [ ] 添加星云粒子背景
- [ ] 实现词汇切换穿梭动画
- [ ] 支持手势控制（移动端）
- [ ] 添加音效（环境音 + 交互反馈）
- [ ] 多词同时探索（星系碰撞）

---

**设计理念**: "语言是流动的星河，每个词汇都是一颗独特的星辰，它们在意义的维度中彼此吸引、相斥、共鸣。"

