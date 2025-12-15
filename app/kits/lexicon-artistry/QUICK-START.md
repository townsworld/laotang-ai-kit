# 🚀 快速启动指南 - Word Galaxy 3D

## 立即测试

### 1. 确认依赖已安装
```bash
cd /Users/towns/gitlab/laotang-ai-kit
npm list @react-three/fiber @react-three/drei @react-three/postprocessing three
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 访问单词博物馆
打开浏览器访问：
```
http://localhost:3000/kits/lexicon-artistry
```

### 4. 测试 3D 星系
1. 在搜索框输入单词，例如：`serendipity`
2. 等待 AI 分析（10-15秒）
3. 点击词卡下方的 **"探索"** 按钮
4. 观看星尘汇聚动画（约2秒）
5. 进入 3D 星系场景

### 5. 测试雷达对比
1. 在 3D 星系中，点击任意"行星"词汇
2. 弹出菜单后，点击 **"雷达"** 按钮
3. 观看全息雷达图展开
4. 查看 5 维度语义对比

## 推荐测试词汇

| 词汇 | 特点 | 预期效果 |
|------|------|----------|
| `serendipity` | 抽象概念，文学性强 | 近义词多，语义丰富 |
| `love` | 常用词，情感强烈 | 反义词明显，维度对比鲜明 |
| `ephemeral` | 诗意词汇 | 适合展示通透晶体质感 |
| `resilience` | 正能量词汇 | 粉色系节点效果好 |
| `melancholy` | 忧郁色彩 | 蓝紫色调和谐 |

## 关键交互

### 相机控制（鼠标/触控板）
- **左键拖拽**: 旋转视角
- **滚轮**: 缩放（限制 10-30 单位）
- **右键拖拽**: 平移（已禁用，保持聚焦）

### 节点交互
- **点击行星**: 激活节点，显示菜单
- **点击背景**: 取消激活
- **导航按钮**: 跳转到新词汇（重新生成星系）
- **雷达按钮**: 展开全息对比图

## 性能监控

打开浏览器控制台（F12）查看：
```javascript
// 查看 Three.js 渲染信息
console.log(renderer.info)

// 预期指标:
// - FPS: ~60
// - Draw Calls: <50
// - Triangles: <10k
```

## 调试模式

在 `StarGalaxy3D.tsx` 中开启调试：
```typescript
// 显示辅助线
import { Stats } from '@react-three/drei';

<Canvas>
  <Stats /> {/* FPS 监控 */}
  <axesHelper args={[10]} /> {/* 坐标轴 */}
  ...
</Canvas>
```

## 切换回 2D 模式

如果遇到性能问题，在 `page.tsx` 中：
```typescript
const [use3DMode, setUse3DMode] = useState(false); // ← 改为 false
```

## 常见问题

### Q: 星系不显示？
**A**: 检查：
1. Gemini API Key 是否设置
2. 浏览器支持 WebGL 2.0
3. 控制台是否有错误信息

### Q: 动画卡顿？
**A**: 降低粒子数量：
```typescript
// StarDustAnimation.tsx
<StarDust count={1000} /> // 从 2000 减少到 1000
```

### Q: 文字显示异常？
**A**: 字体加载问题，检查网络连接或本地缓存字体。

### Q: 点击节点没反应？
**A**: 确保：
1. 动画已完成（showGalaxy = true）
2. 没有其他 UI 层遮挡
3. OrbitControls 未阻止事件

## 高级配置

### 自定义颜色
在 `StarGalaxy3D.tsx` 修改 `COLORS` 常量：
```typescript
const COLORS = {
  synonym: { main: '#你的颜色', glow: '#光晕颜色', pale: '#淡色' },
  ...
};
```

### 调整轨道半径
在 `GalaxyScene` 组件中：
```typescript
const baseRadius = 4;  // 基础半径（默认 4）
// 近义词：baseRadius * (0.8-1.3)
// 反义词：baseRadius * (1.8-2.5)
// 易混词：baseRadius * (1.2-1.8)
```

### 修改动画速度
```typescript
// 自转速度
groupRef.current.rotation.y += 0.001; // 加快（默认 0.0005）

// 呼吸频率
const breathe = Math.sin(clock.getElapsedTime() * 2) // 加快（默认 0.8）
```

## 截图/录屏

### 浏览器内置
- **Chrome/Edge**: F12 → Performance → Record
- **Firefox**: Shift+F2 → screenshot --fullpage

### 推荐工具
- **Loom**: 快速录屏
- **OBS Studio**: 高质量录制
- **ScreenFlow** (Mac): 专业级编辑

## 下一步

1. ✅ 完成基础测试
2. 📝 记录任何 bug 或改进建议
3. 🎨 尝试自定义配色方案
4. 🔊 考虑添加音效系统
5. 📱 测试移动端体验

---

**享受探索语言星河的旅程！** 🌌✨

