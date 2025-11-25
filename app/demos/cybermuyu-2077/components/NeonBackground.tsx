import React from 'react';
import { motion } from 'framer-motion';

const NeonBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-950">
      {/* Dynamic Purple Glow */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[100px]"
      />

      {/* Perspective Grid Floor */}
      <div 
        className="absolute bottom-0 w-full h-1/2 opacity-30"
        style={{
          background: `
            linear-gradient(transparent 0%, rgba(168, 85, 247, 0.2) 100%),
            linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
            linear-gradient(0deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) scale(2)',
          transformOrigin: 'bottom center',
        }}
      >
        <motion.div
          className="w-full h-full"
          animate={{ backgroundPosition: ["0px 0px", "0px 40px"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          style={{
             background: 'inherit',
             backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Top Grid Ceiling (mirrored but subtler) */}
      <div 
        className="absolute top-0 w-full h-1/3 opacity-10"
        style={{
           background: `linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                        linear-gradient(180deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
           backgroundSize: '60px 60px',
           transform: 'perspective(500px) rotateX(-60deg) scale(2)',
           transformOrigin: 'top center',
        }}
      />
    </div>
  );
};

export default NeonBackground;