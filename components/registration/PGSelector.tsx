'use client';

import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { Card } from '@/components/ui';
import { PG } from '@/types';
import { cn } from '@/lib/utils';

interface PGSelectorProps {
  pgs: PG[];
  selectedId: string | null;
  onSelect: (pg: PG) => void;
}

export default function PGSelector({ pgs, selectedId, onSelect }: PGSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {pgs.map((pg, index) => (
        <motion.div
          key={pg.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card
            hover
            selected={selectedId === pg.id}
            onClick={() => onSelect(pg)}
            className={cn(
              'flex items-center gap-4',
              selectedId === pg.id && 'border-gold-500'
            )}
          >
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center transition-colors',
              selectedId === pg.id
                ? 'bg-gold-500 text-navy-900'
                : 'bg-gold-500/10 text-gold-500'
            )}>
              <Building2 size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                'font-medium truncate transition-colors',
                selectedId === pg.id ? 'text-gold-400' : 'text-gold-50'
              )}>
                {pg.name}
              </h3>
              <p className="text-xs text-gold-500/60 truncate">
                {pg.address}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
