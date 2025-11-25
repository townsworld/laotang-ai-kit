import React, { useState, useCallback } from 'react';
import NeonBackground from './components/NeonBackground';
import CyberFish from './components/CyberFish';
import FloatingTextLayer from './components/FloatingTextLayer';
import CounterDisplay from './components/CounterDisplay';
import { FloatingText } from './types';
import { playWoodenFishSound } from './utils/sound';

const App: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default behavior to avoid double firing on some touch devices if mixing events
    // but in React onClick usually handles tap well. We just need coordinates.
    
    let clientX, clientY;
    
    // Determine coordinates based on event type
    if ('touches' in e) {
        // Touch event
        // We use the first touch point
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        // Mouse event
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    // 1. Play Sound
    playWoodenFishSound();

    // 2. Increment Counter
    setCount(prev => prev + 1);

    // 3. Add Floating Text
    const newText: FloatingText = {
      id: Date.now(),
      x: clientX,
      y: clientY,
      text: '功德 +1'
    };

    setFloatingTexts(prev => [...prev, newText]);
  }, []);

  const handleTextComplete = useCallback((id: number) => {
    setFloatingTexts(prev => prev.filter(item => item.id !== id));
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 text-white selection:bg-cyan-500/30">
      <NeonBackground />
      
      <CounterDisplay count={count} />

      <main className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <div className="mb-12">
            <CyberFish onClick={handleInteraction} />
        </div>
        
        {/* Helper Hint */}
        <div className="absolute bottom-8 opacity-40 text-xs font-mono tracking-widest text-cyan-100 animate-pulse">
            TAP TO ACCUMULATE MERIT
        </div>
      </main>

      <FloatingTextLayer 
        items={floatingTexts} 
        onComplete={handleTextComplete} 
      />
    </div>
  );
};

export default App;