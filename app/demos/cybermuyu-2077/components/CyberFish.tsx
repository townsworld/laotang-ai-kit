import React from 'react';
import { motion } from 'framer-motion';

interface CyberFishProps {
  onClick: (e: React.MouseEvent | React.TouchEvent) => void;
}

const CyberFish: React.FC<CyberFishProps> = ({ onClick }) => {
  return (
    <div className="relative flex justify-center items-center">
      {/* Outer Glow Ring (Static/Pulse) */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute w-64 h-64 rounded-full border border-cyan-500/30 bg-cyan-500/5 blur-md"
      />

      {/* The "Wooden Fish" - Stylized as a Cyber Percussion Block */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.85 }} // Q-bounce effect
        onClick={onClick}
        className="relative z-10 group focus:outline-none touch-manipulation"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <svg
          width="180"
          height="140"
          viewBox="0 0 180 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]"
        >
          {/* Main Body */}
          <path
            d="M20 70C20 42.3858 42.3858 20 70 20H110C137.614 20 160 42.3858 160 70V80C160 107.614 137.614 130 110 130H70C42.3858 130 20 107.614 20 80V70Z"
            className="fill-slate-900 stroke-cyan-500 stroke-[3px] transition-colors duration-300 group-hover:fill-slate-800"
          />
          
          {/* Inner Detail - Cyber Circuit Lines */}
          <path
            d="M50 70H130"
            className="stroke-cyan-500/50 stroke-2"
          />
          <circle cx="90" cy="70" r="15" className="fill-slate-950 stroke-cyan-400 stroke-2" />
          <circle cx="90" cy="70" r="5" className="fill-cyan-400 animate-pulse" />

          {/* Decorative Corners */}
          <path d="M40 40L50 40M40 40L40 50" className="stroke-cyan-400 stroke-2" />
          <path d="M140 40L130 40M140 40L140 50" className="stroke-cyan-400 stroke-2" />
          <path d="M40 100L50 100M40 100L40 90" className="stroke-cyan-400 stroke-2" />
          <path d="M140 100L130 100M140 100L140 90" className="stroke-cyan-400 stroke-2" />
          
          {/* Opening (The mouth of the fish) */}
          <path 
            d="M20 70 H 10" 
            className="stroke-cyan-500 stroke-[3px]"
          />
        </svg>

        {/* Text inside/below button for decoration */}
        <div className="absolute top-full mt-4 left-0 w-full text-center">
            <span className="text-[10px] text-cyan-500/60 tracking-[0.2em] font-mono">
                CYBER_MUYU_V1.0
            </span>
        </div>
      </motion.button>
    </div>
  );
};

export default CyberFish;