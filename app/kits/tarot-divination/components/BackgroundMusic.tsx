"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    
    // 使用免费的环境音乐URL（示例）
    // 您可以替换为自己的音乐文件
    // 这里使用一个占位符，实际使用时需要提供真实的音频文件
    audio.src = '/sounds/mystical-ambient.mp3'; // 需要添加音频文件到 public/sounds/
    audio.loop = true;
    audio.volume = 0.3;
    
    audio.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current || !isLoaded) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.log('Audio play failed:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={togglePlay}
      disabled={!isLoaded}
      className="group relative"
      title={isPlaying ? '关闭背景音乐' : '播放背景音乐'}
    >
      <div className="relative p-3 rounded-xl bg-white/80 border border-stone-200 hover:border-purple-300 hover:bg-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-purple-600 transition-colors" />
        ) : (
          <VolumeX className="w-5 h-5 text-stone-500 group-hover:text-purple-600 transition-colors" />
        )}
        
        {/* Playing indicator */}
        {isPlaying && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
        )}
      </div>
    </button>
  );
}

