'use client';

import { motion } from 'framer-motion';

interface LanternProps {
  className?: string;
  delay?: number;
}

export default function Lantern({ className = '', delay = 0 }: LanternProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className={`relative ${className}`}
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 60 100" className="w-12 h-20 md:w-16 md:h-28">
          <defs>
            <linearGradient id="lanternGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d4a853" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#f0c95e" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#d4a853" stopOpacity="0.9" />
            </linearGradient>
            <filter id="lanternGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <ellipse cx="30" cy="85" rx="8" ry="3" fill="#d4a853" opacity="0.5" />
          <path
            d="M20 15 L40 15 L45 30 L45 70 L40 85 L20 85 L15 70 L15 30 Z"
            fill="url(#lanternGradient)"
            filter="url(#lanternGlow)"
          />
          <path
            d="M20 15 Q30 12 40 15"
            stroke="#d4a853"
            strokeWidth="2"
            fill="none"
          />
          <ellipse cx="30" cy="50" rx="10" ry="15" fill="#f0c95e" opacity="0.3" />
        </svg>
      </motion.div>
      <motion.div
        animate={{
          boxShadow: [
            '0 0 30px rgba(212, 168, 83, 0.3)',
            '0 0 60px rgba(212, 168, 83, 0.5)',
            '0 0 30px rgba(212, 168, 83, 0.3)',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-12 rounded-full bg-gold-500/20 blur-2xl pointer-events-none"
      />
    </motion.div>
  );
}
