'use client';

import { motion } from 'framer-motion';

export default function CrescentMoon() {
  return (
    <motion.div
      initial={{ rotate: -90, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className="relative w-16 h-16 md:w-20 md:h-20"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0c95e" />
            <stop offset="100%" stopColor="#d4a853" />
          </linearGradient>
          <filter id="moonGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M50 5
             A45 45 0 1 1 50 95
             A35 35 0 1 0 50 5"
          fill="url(#moonGradient)"
          filter="url(#moonGlow)"
        />
      </svg>
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -top-4 -right-4 w-24 h-24 bg-gold-500/20 rounded-full blur-3xl"
      />
    </motion.div>
  );
}
