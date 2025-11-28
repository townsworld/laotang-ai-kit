# Truth Translator 配置说明

## 环境变量设置

此应用需要 Gemini API Key 才能正常工作。

### 设置步骤：

1. 在项目根目录创建 `.env.local` 文件
2. 添加以下内容：

```
GEMINI_API_KEY=your_gemini_api_key_here
```

3. 获取 API Key：访问 [Google AI Studio](https://aistudio.google.com/app/apikey)

## 使用方式

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 访问：http://localhost:3000/demos/truth-translator

## 功能说明

将直白的心里话转换为三种不同风格的表达：
- 🛡️ **职场防锅**：正式、客观、礼貌的职场用语
- 🍵 **顶级绿茶**：温柔、看似善解人意但坚定的表达
- 🌚 **阴阳大师**：知识分子式的讽刺回复

