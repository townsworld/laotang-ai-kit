import { Code2, Zap, Terminal, Sparkles } from "lucide-react";
import Link from "next/link";

// Mock 数据：未来的 Demo 列表
const demos = [
  {
    id: "01-cyber-profile",
    title: "赛博朋克个人主页",
    description: "一个充满赛博朋克风格的酷炫个人主页",
    episode: "Ep.01",
    status: "live",
    tags: ["Next.js", "Tailwind CSS", "Cyberpunk"],
  },
  {
    id: "scumbag-quotes",
    title: "渣男语录生成器",
    description: "一键生成各种渣男语录，娱乐向工具",
    episode: "Ep.02",
    status: "coming-soon",
    tags: ["AI", "OpenAI", "娱乐"],
  },
  {
    id: "placeholder-3",
    title: "敬请期待...",
    description: "更多脑洞大开的 Demo 正在路上",
    episode: "Ep.03",
    status: "coming-soon",
    tags: ["AI", "Web", "Magic"],
  },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="relative">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-12 md:pt-32 md:pb-20">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Icon */}
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-cyan-500/30 rounded-full animate-pulse" />
              <div className="relative bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-cyan-500/20">
                <Zap className="w-16 h-16 text-cyan-400" strokeWidth={1.5} />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  老唐的 AI 装备库
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 font-mono">
                Laotang AI Kit
              </p>
            </div>

            {/* Tagline */}
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <p className="text-slate-300 font-medium">
                致力于用 AI 提早两小时下班
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">{demos.length}</div>
                <div className="text-sm text-slate-500">装备</div>
              </div>
              <div className="w-px bg-slate-700" />
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">100%</div>
                <div className="text-sm text-slate-500">AI 生成</div>
              </div>
              <div className="w-px bg-slate-700" />
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">∞</div>
                <div className="text-sm text-slate-500">可能性</div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Grid */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-8">
            <Code2 className="w-6 h-6 text-cyan-400" />
            <h2 className="text-3xl font-bold text-slate-200">装备库</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demos.map((demo, index) => (
              <div
                key={demo.id}
                className="group relative bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="px-3 py-1 rounded-md bg-slate-800/50 border border-slate-700">
                      <span className="text-xs font-mono text-cyan-400">
                        {demo.episode}
                      </span>
                    </div>
                    {demo.status === "coming-soon" ? (
                      <div className="px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/30">
                        <span className="text-xs font-mono text-purple-400">
                          Coming Soon
                        </span>
                      </div>
                    ) : demo.status === "live" ? (
                      <div className="px-3 py-1 rounded-md bg-green-500/10 border border-green-500/30">
                        <span className="text-xs font-mono text-green-400">
                          ● Live
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                      {demo.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {demo.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {demo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-md bg-slate-800/50 text-slate-400 border border-slate-700/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Generated
                      </span>
                      {demo.status === "coming-soon" ? (
                        <span className="text-slate-600 font-mono">敬请期待</span>
                      ) : demo.status === "live" ? (
                        <Link
                          href={`/demos/${demo.id}`}
                          className="text-cyan-400 hover:text-cyan-300 font-mono transition-colors flex items-center gap-1 group"
                        >
                          <span>查看演示</span>
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                      ) : (
                        <Link
                          href={`/demos/${demo.id}`}
                          className="text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
                        >
                          查看 →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 mt-20">
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Code2 className="w-5 h-5" />
                <span className="font-mono">Made by 程序员老唐 (AI版)</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <a
                  href="https://github.com/townsworld/laotang-ai-kit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://xiaohongshu.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  小红书
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

