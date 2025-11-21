"use client";

import { User, Zap, ArrowLeft, Sparkles, Terminal, Code2, Cpu } from "lucide-react";
import Link from "next/link";

export default function CyberProfilePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e933_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e933_1px,transparent_1px)] bg-[size:4rem_4rem] animate-grid-flow" />
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scan pointer-events-none" />

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_50%)]" />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 text-cyan-400 hover:text-cyan-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-sm">Back to Arsenal</span>
          </Link>

          {/* Main Card */}
          <div className="holographic-card relative">
            {/* Glow Border Animation */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-2xl opacity-75 blur-sm animate-glow-rotate" />
            
            {/* Card Content */}
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-8 md:p-12 shadow-2xl">
              {/* Corner Decorations */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-cyan-400 animate-pulse" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-purple-400 animate-pulse" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-purple-400 animate-pulse" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-cyan-400 animate-pulse" />

              {/* Avatar Section */}
              <div className="flex flex-col items-center mb-8 animate-float">
                <div className="relative mb-6">
                  {/* Rotating Rings */}
                  <div className="absolute inset-0 -m-4">
                    <div className="w-32 h-32 rounded-full border-2 border-cyan-500/30 animate-spin-slow" />
                  </div>
                  <div className="absolute inset-0 -m-6">
                    <div className="w-36 h-36 rounded-full border-2 border-purple-500/20 animate-spin-reverse" />
                  </div>
                  
                  {/* Avatar Circle */}
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border-2 border-cyan-400/50 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                    <User className="w-12 h-12 text-cyan-300" strokeWidth={1.5} />
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse shadow-lg shadow-green-400/50" />
                </div>

                {/* Name with Glitch Effect */}
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center glitch-text" data-text="程序员老唐">
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                    程序员老唐
                  </span>
                </h1>
                
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 mb-2">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span className="text-sm font-mono text-purple-300">(AI版)</span>
                </div>

                {/* Title */}
                <p className="text-lg md:text-xl text-cyan-300 font-mono text-center mb-4">
                  AI Efficiency Hacker | 职场反内卷专家
                </p>

                {/* Status Line */}
                <div className="flex items-center gap-2 text-sm text-slate-400 font-mono">
                  <Terminal className="w-4 h-4 text-green-400" />
                  <span className="typing-animation">Status: Online and Building...</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-800/50 rounded-lg p-6 mb-6 border border-cyan-500/20">
                <p className="text-slate-300 text-center leading-relaxed">
                  <span className="text-cyan-400 font-bold">"能让 AI 干的活，我绝不自己干。"</span>
                  <br />
                  <span className="text-sm text-slate-400 mt-2 block">
                    正在构建老唐的 AI 装备库...
                  </span>
                </p>
              </div>

              {/* Skills/Tech Stack */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-mono text-slate-400">Tech Arsenal</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    { icon: Zap, label: "Next.js", color: "cyan" },
                    { icon: Cpu, label: "AI Tools", color: "purple" },
                    { icon: Terminal, label: "Cursor", color: "blue" },
                    { icon: Code2, label: "React", color: "cyan" },
                    { icon: Sparkles, label: "Prompt Engineering", color: "purple" },
                  ].map((skill, index) => (
                    <div
                      key={skill.label}
                      className={`
                        skill-badge
                        px-4 py-2 rounded-full 
                        bg-gradient-to-r ${
                          skill.color === "cyan"
                            ? "from-cyan-500/10 to-cyan-500/5 border-cyan-500/30 hover:border-cyan-400"
                            : skill.color === "purple"
                            ? "from-purple-500/10 to-purple-500/5 border-purple-500/30 hover:border-purple-400"
                            : "from-blue-500/10 to-blue-500/5 border-blue-500/30 hover:border-blue-400"
                        }
                        border backdrop-blur-sm
                        transition-all duration-300
                        hover:scale-105 hover:shadow-lg
                        ${skill.color === "cyan" ? "hover:shadow-cyan-500/50" : 
                          skill.color === "purple" ? "hover:shadow-purple-500/50" : "hover:shadow-blue-500/50"}
                      `}
                      style={{
                        animationDelay: `${index * 0.1}s`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <skill.icon className={`w-4 h-4 ${
                          skill.color === "cyan" ? "text-cyan-400" :
                          skill.color === "purple" ? "text-purple-400" : "text-blue-400"
                        }`} />
                        <span className="text-sm font-mono text-slate-300">
                          {skill.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                {/* Primary Button */}
                <a
                  href="https://github.com/townsworld/laotang-ai-kit/tree/main/prompts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full sm:w-auto"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />
                  <button className="relative w-full sm:w-auto px-8 py-4 bg-slate-900 rounded-lg leading-none flex items-center justify-center gap-3 border border-cyan-500/50 group-hover:border-cyan-400 transition-all duration-300">
                    <Zap className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                    <span className="text-cyan-400 group-hover:text-cyan-300 font-bold transition-colors">
                      Get My Prompts
                    </span>
                  </button>
                </a>

                {/* Secondary Button */}
                <Link
                  href="/"
                  className="w-full sm:w-auto px-8 py-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 text-slate-300 hover:text-purple-300 font-mono transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Arsenal</span>
                </Link>
              </div>

              {/* Footer Tag */}
              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-500 font-mono">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span>HOLOGRAPHIC_CARD_V1.0 // Generated by AI</span>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              { label: "Projects", value: "∞", icon: Code2 },
              { label: "AI Powered", value: "100%", icon: Cpu },
              { label: "Efficiency", value: "MAX", icon: Zap },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="bg-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-800 hover:border-cyan-500/30 p-4 transition-all duration-300 hover:scale-105 animate-float"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">{stat.value}</div>
                    <div className="text-xs text-slate-500 font-mono">{stat.label}</div>
                  </div>
                  <stat.icon className="w-8 h-8 text-purple-400/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes glow-rotate {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes grid-flow {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 4rem 4rem;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 rgba(6, 182, 212, 0.75),
              -0.05em -0.025em 0 rgba(168, 85, 247, 0.75);
          }
          14% {
            text-shadow: 0.05em 0 0 rgba(6, 182, 212, 0.75),
              -0.05em -0.025em 0 rgba(168, 85, 247, 0.75);
          }
          15% {
            text-shadow: -0.05em -0.025em 0 rgba(6, 182, 212, 0.75),
              0.05em 0.025em 0 rgba(168, 85, 247, 0.75);
          }
          49% {
            text-shadow: -0.05em -0.025em 0 rgba(6, 182, 212, 0.75),
              0.05em 0.025em 0 rgba(168, 85, 247, 0.75);
          }
          50% {
            text-shadow: 0.025em 0.05em 0 rgba(6, 182, 212, 0.75),
              -0.025em -0.05em 0 rgba(168, 85, 247, 0.75);
          }
          99% {
            text-shadow: 0.025em 0.05em 0 rgba(6, 182, 212, 0.75),
              -0.025em -0.05em 0 rgba(168, 85, 247, 0.75);
          }
          100% {
            text-shadow: -0.025em 0 0 rgba(6, 182, 212, 0.75),
              -0.025em -0.025em 0 rgba(168, 85, 247, 0.75);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow-rotate {
          animation: glow-rotate 3s linear infinite;
          background-size: 200% 200%;
        }

        .animate-scan {
          animation: scan 8s linear infinite;
        }

        .animate-grid-flow {
          animation: grid-flow 20s linear infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 6s linear infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .glitch-text {
          position: relative;
          animation: glitch 2s infinite;
        }

        .skill-badge {
          animation: float 3s ease-in-out infinite;
        }

        .typing-animation {
          overflow: hidden;
          border-right: 0.15em solid #06b6d4;
          white-space: nowrap;
          animation: typing 3.5s steps(40, end) infinite, blink-caret 0.75s step-end infinite;
        }

        @keyframes blink-caret {
          from, to {
            border-color: transparent;
          }
          50% {
            border-color: #06b6d4;
          }
        }
      `}</style>
    </main>
  );
}

