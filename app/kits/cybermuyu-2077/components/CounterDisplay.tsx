import React from 'react';
import { motion } from 'framer-motion';

interface CounterDisplayProps {
  count: number;
}

const CounterDisplay: React.FC<CounterDisplayProps> = ({ count }) => {
  return (
    <div className="absolute top-12 left-0 right-0 flex flex-col items-center justify-center z-20 pointer-events-none">
      <div className="relative px-8 py-4 bg-slate-900/80 border border-purple-500/50 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.3)] backdrop-blur-sm">
        <h1 className="text-purple-300 text-sm md:text-base font-['Share_Tech_Mono'] uppercase tracking-widest mb-1 opacity-80">
          System Merit Counter
        </h1>
        <div className="flex items-center justify-center space-x-2">
            <span className="text-cyan-400 text-lg">今日功德：</span>
            <motion.span 
                key={count}
                initial={{ y: -5, opacity: 0.5 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl md:text-4xl font-['Orbitron'] font-bold text-white tabular-nums drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            >
            {count.toString().padStart(6, '0')}
            </motion.span>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-purple-500 -mt-1 -ml-1"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-purple-500 -mt-1 -mr-1"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-purple-500 -mb-1 -ml-1"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-purple-500 -mb-1 -mr-1"></div>
      </div>
    </div>
  );
};

export default CounterDisplay;