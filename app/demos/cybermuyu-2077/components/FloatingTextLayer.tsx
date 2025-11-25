import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FloatingText } from '../types';

interface FloatingTextLayerProps {
  items: FloatingText[];
  onComplete: (id: number) => void;
}

const FloatingTextLayer: React.FC<FloatingTextLayerProps> = ({ items, onComplete }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, y: item.y - 20, x: item.x }}
            animate={{ opacity: 0, y: item.y - 150 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            onAnimationComplete={() => onComplete(item.id)}
            className="absolute text-cyan-300 font-bold text-xl whitespace-nowrap"
            style={{ 
              textShadow: '0 0 10px rgba(34, 211, 238, 0.8)',
              fontFamily: "'Orbitron', sans-serif"
            }}
          >
            {item.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingTextLayer;