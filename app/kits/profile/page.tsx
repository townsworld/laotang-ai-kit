"use client";

import { ArrowLeft, Sparkles, Github, Play, Users, Zap, Gift, ChevronRight } from "lucide-react";
import Link from "next/link";

// 成果展示数据
const achievements = [
  { icon: Users, label: "帮助学员", value: "1000+", suffix: "人" },
  { icon: Zap, label: "AI 工具", value: "10+", suffix: "个" },
  { icon: Play, label: "教程视频", value: "50+", suffix: "期" },
];

// 你能学到什么
const benefits = [
  {
    emoji: "🚀",
    title: "0基础做出 AI 产品",
    desc: "不会写代码也能做出属于自己的 AI 工具",
  },
  {
    emoji: "💡",
    title: "掌握 AI 提效技巧",
    desc: "用 AI 提升 10 倍工作效率，提早下班",
  },
  {
    emoji: "🎯",
    title: "获取实战 Prompt",
    desc: "直接复制可用的高质量提示词模板",
  },
];

// 内容展示
const contentShowcase = [
  { title: "Cursor 零基础教程", views: "10w+", platform: "小红书" },
  { title: "AI 做产品实战", views: "5w+", platform: "抖音" },
  { title: "Prompt 技巧分享", views: "3w+", platform: "小红书" },
];

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] text-stone-900 selection:bg-amber-200 selection:text-amber-900">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] right-[-20%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-rose-100/50 to-amber-100/50 blur-3xl" />
        <div className="absolute bottom-[-30%] left-[-20%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-violet-100/40 to-sky-100/40 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-8 min-h-screen">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors group mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">返回装备库</span>
        </Link>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Hero Section - Value First */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-stone-200/60 shadow-xl shadow-stone-200/30 overflow-hidden">
            {/* Gradient Banner */}
            <div className="h-3 bg-gradient-to-r from-amber-400 via-rose-400 to-violet-400" />
            
            <div className="p-8 text-center">
              {/* Avatar + Name Row */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-rose-400 to-violet-400 p-0.5 shadow-lg shadow-rose-200/50">
                  <img 
                    src="/avatar.jpg" 
                    alt="程序员老唐AI" 
                    className="w-full h-full rounded-[14px] object-cover"
                  />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-stone-900">程序员老唐AI</h1>
                  <p className="text-stone-500 text-sm">6 年程序员 · AI 产品实践者</p>
                </div>
              </div>

              {/* Core Value Proposition */}
              <div className="bg-gradient-to-r from-amber-50 to-rose-50 rounded-2xl p-6 mb-6 border border-amber-100/50">
                <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-2">
                  带你用 AI「0基础」做产品
                </h2>
                <p className="text-stone-600">
                  不会写代码？没关系！跟着老唐，人人都能做出自己的 AI 工具
                </p>
              </div>

              {/* Achievement Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {achievements.map((item) => (
                  <div key={item.label} className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-bold text-stone-900">{item.value}</span>
                      <span className="text-sm text-stone-400">{item.suffix}</span>
                    </div>
                    <div className="text-xs text-stone-500 mt-1">{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Primary CTA - Follow */}
              <div className="space-y-3">
                <a
                  href="https://xhslink.com/m/8DTfNeEEiba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl font-bold hover:from-rose-600 hover:to-rose-700 transition-all shadow-lg shadow-rose-200/50 group"
                >
                  <span className="text-xl">📕</span>
                  <span>关注小红书，获取免费教程</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="https://m.douyin.com/share/user/MS4wLjABAAAA7Yuwtyuea-Vd4VmR_aF_GrR4wSE3JSAUiNwTmSlEE1ntWI-Kj_YESEFEQFEYo8oM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-lg shadow-stone-300/30 group"
                >
                  <span className="text-xl">🎵</span>
                  <span>关注抖音，看实操视频</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-stone-200/60 shadow-lg shadow-stone-200/20 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-500" />
              关注后你能学到
            </h3>
            <div className="space-y-3">
              {benefits.map((item) => (
                <div 
                  key={item.title}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50/80 border border-stone-100 hover:border-stone-200 transition-colors"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <div className="font-semibold text-stone-900">{item.title}</div>
                    <div className="text-sm text-stone-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Showcase */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-stone-200/60 shadow-lg shadow-stone-200/20 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-rose-500" />
              热门内容
            </h3>
            <div className="space-y-2">
              {contentShowcase.map((item) => (
                <div 
                  key={item.title}
                  className="flex items-center justify-between p-4 rounded-xl bg-stone-50/80 border border-stone-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-400" />
                    <span className="font-medium text-stone-800">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-rose-600 font-semibold">{item.views} 播放</span>
                    <span className="text-xs text-stone-400 px-2 py-0.5 bg-stone-100 rounded-full">{item.platform}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary CTA - Prompts */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-3xl border border-violet-100/60 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-200/50">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-stone-900">免费领取 Prompt 模板</h3>
                <p className="text-sm text-stone-500">精选高质量 AI 提示词，直接复制使用</p>
              </div>
              <a
                href="https://ai.feishu.cn/wiki/space/7577399611992624094"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors text-sm whitespace-nowrap"
              >
                立即领取
              </a>
            </div>
          </div>

          {/* GitHub - De-emphasized */}
          <div className="flex justify-center">
            <a
              href="https://github.com/townsworld"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-stone-400 hover:text-stone-600 transition-colors text-sm"
            >
              <Github className="w-4 h-4" />
              <span>GitHub @townsworld</span>
            </a>
          </div>

          {/* Footer */}
          <div className="text-center pb-4 space-y-2">
            <p className="text-xs text-stone-400">
              Made with AI ✨ by 程序员老唐AI
            </p>
            <p className="text-[10px] text-stone-300">
              * 页面数据仅供展示，不代表真实数据
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
