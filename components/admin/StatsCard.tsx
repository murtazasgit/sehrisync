'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatsCard({ title, value, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('glass-card p-5', className)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gold-500/60 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gold-400">{value}</p>
          {trend && (
            <p className={cn(
              'text-xs mt-1',
              trend.isPositive ? 'text-emerald-400' : 'text-red-400'
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}% from yesterday
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-gold-500" />
        </div>
      </div>
    </motion.div>
  );
}
