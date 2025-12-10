"use client";

import { ArrowUpRight, Sparkles, Github, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import SettingsMenu from "@/components/SettingsMenu";

// Demo 数据
const demos = [
  {
    id: "profile",
    title: "个人主页模板",
    description: "一键生成高级感个人主页，展示你的专业形象",
    tags: ["无需代码", "5分钟完成"],
    gradient: "from-rose-500/20 to-amber-500/20",
  },
  {
    id: "truth-translator",
    title: "互联网嘴替",
    description: "大白话秒变职场黑话、顶级绿茶、阴阳怪气",
    tags: ["AI 驱动", "三种风格"],
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: "lexicon-artistry",
    title: "词汇艺术馆",
    description: "用博物馆级美学学英语，单词过目不忘",
    tags: ["AI 驱动", "学习利器"],
    gradient: "from-violet-500/20 to-indigo-500/20",
  },
  {
    id: "ai-copywriter",
    title: "AI 文案大师",
    description: "3秒生成爆款文案，小红书、抖音、朋友圈全搞定",
    badge: "新品",
    tags: ["AI 驱动", "5种场景"],
    gradient: "from-pink-500/20 to-rose-500/20",
  },
];


export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] text-stone-900 selection:bg-amber-200 selection:text-amber-900">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-100/40 to-rose-100/40 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-violet-100/30 to-sky-100/30 blur-3xl" />
      </div>
      
      {/* Settings Menu */}
      <SettingsMenu />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-20 pb-12 md:pt-32 md:pb-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Eyebrow - Brand */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-stone-200/60 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-stone-600">
                程序员老唐AI · 装备库
              </span>
            </div>

            {/* Main Value Proposition */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-stone-900">用 AI，</span>
              <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 bg-clip-text text-transparent">
                0 基础
              </span>
              <span className="text-stone-900">做产品</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg md:text-xl text-stone-500 max-w-xl mx-auto leading-relaxed">
              免费 AI 工具 + 保姆级教程，拿走直接用
            </p>

            {/* Value Props */}
            <div className="flex flex-wrap items-center justify-center gap-3 py-2">
              <span className="px-4 py-2 rounded-full bg-white/80 border border-stone-200/60 text-sm text-stone-600">
                ✨ 6 年程序员经验
              </span>
              <span className="px-4 py-2 rounded-full bg-white/80 border border-stone-200/60 text-sm text-stone-600">
                🎯 0 基础友好
              </span>
              <span className="px-4 py-2 rounded-full bg-white/80 border border-stone-200/60 text-sm text-stone-600">
                🚀 持续更新中
              </span>
            </div>

            {/* Primary CTA */}
            <div className="pt-4 space-y-3">
              <a
                href="https://xhslink.com/m/8DTfNeEEiba"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full font-bold hover:from-rose-600 hover:to-rose-700 transition-all shadow-lg shadow-rose-200/50 group"
              >
                <span className="text-xl">📕</span>
                <span>关注小红书，领取免费教程</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
              {/* Secondary Links */}
              <div className="flex items-center justify-center gap-4 text-sm">
                <a
                  href="https://m.douyin.com/share/user/MS4wLjABAAAA7Yuwtyuea-Vd4VmR_aF_GrR4wSE3JSAUiNwTmSlEE1ntWI-Kj_YESEFEQFEYo8oM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <span>🎵</span>
                  <span>抖音</span>
                </a>
                <span className="text-stone-300">·</span>
                <a
                  href="https://github.com/townsworld"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="container mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
        </div>

        {/* Tools Section */}
        <section className="container mx-auto px-6 py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-3">
                免费 AI 工具，即开即用
              </h2>
              <p className="text-stone-500">
                无需注册，打开就能用的实用工具集合
              </p>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {demos.map((demo, index) => (
                <Link
                  key={demo.id}
                  href={`/kits/${demo.id}`}
                  className="group relative bg-white rounded-2xl border border-stone-200/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-stone-200/50 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${demo.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Content */}
                  <div className="relative p-5 space-y-3">
                    {/* Badge */}
                    {demo.badge && (
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm">
                        {demo.badge}
                      </span>
                    )}

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-1 group-hover:text-stone-800 transition-colors">
                        {demo.title}
                      </h3>
                      <p className="text-sm text-stone-500 leading-relaxed">
                        {demo.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {demo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs rounded-full bg-stone-100 text-stone-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action */}
                    <div className="flex items-center gap-1 pt-2 text-sm font-medium text-stone-600 group-hover:text-stone-900 transition-colors">
                      <span>立即使用</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* More Coming */}
            <div className="text-center mt-8">
              <span className="text-sm text-stone-400">更多工具持续更新中...</span>
            </div>
          </div>
        </section>

        {/* Lead Magnet Section */}
        <section className="container mx-auto px-6 pb-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-3xl border border-violet-100/60 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-200/50 shrink-0">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-stone-900 mb-1">免费领取 AI 资料包</h3>
                  <p className="text-stone-500 text-sm">精选 Prompt 模板 + 工具使用指南，助你快速上手</p>
                </div>
                <a
                  href="https://ai.feishu.cn/wiki/space/7577399611992624094"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-colors whitespace-nowrap"
                >
                  立即领取
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent mb-10" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-stone-900">程序员老唐AI</div>
                  <div className="text-xs text-stone-400">让 AI 帮你提效，不再加班</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <a
                  href="https://xhslink.com/m/8DTfNeEEiba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-stone-500 hover:text-rose-600 transition-colors"
                >
                  📕 小红书
                </a>
                <a
                  href="https://m.douyin.com/share/user/MS4wLjABAAAA7Yuwtyuea-Vd4VmR_aF_GrR4wSE3JSAUiNwTmSlEE1ntWI-Kj_YESEFEQFEYo8oM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
                >
                  🎵 抖音
                </a>
                <a
                  href="https://github.com/townsworld"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
            
          </div>
        </footer>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .grid > a {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </main>
  );
}
