'use client';

import { Minus, Plus, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Entry {
  id: string;
  personName: string;
  pgName: string;
  peopleCount: number;
  userId: string;
}

interface EntriesTableProps {
  entries: Entry[];
  onUpdateCount: (id: string, newCount: number) => void;
  isOwner?: (userId: string) => boolean;
  currentUserId: string | null;
}

export default function EntriesTable({ entries, onUpdateCount, isOwner, currentUserId }: EntriesTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="border-b border-gold-500/20">
            <th className="text-left py-3 px-4 text-gold-500/70 font-medium text-sm">Person Name</th>
            <th className="text-left py-3 px-4 text-gold-500/70 font-medium text-sm">PG Name</th>
            <th className="text-center py-3 px-4 text-gold-500/70 font-medium text-sm">People Count</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const canEdit = currentUserId && isOwner ? isOwner(entry.userId) : false;
            
            return (
              <tr
                key={entry.id}
                className="border-b border-gold-500/10 hover:bg-gold-500/5 transition-colors"
              >
                <td className="py-3 px-4 text-gold-50">{entry.personName}</td>
                <td className="py-3 px-4 text-gold-50">{entry.pgName}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    {canEdit ? (
                      <>
                        <button
                          onClick={() => onUpdateCount(entry.id, entry.peopleCount - 1)}
                          disabled={entry.peopleCount <= 1}
                          className={cn(
                            'w-8 h-8 rounded-lg border flex items-center justify-center',
                            'text-gold-500 transition-all duration-200',
                            'hover:bg-gold-500/10 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed',
                            'border-gold-500/30'
                          )}
                        >
                          <Minus size={16} />
                        </button>
                        
                        <input
                          type="number"
                          value={entry.peopleCount}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') return;
                            const num = parseInt(val, 10);
                            if (!isNaN(num) && num >= 1) {
                              onUpdateCount(entry.id, num);
                            }
                          }}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (isNaN(val) || val < 1) {
                              onUpdateCount(entry.id, 1);
                            }
                          }}
                          className={cn(
                            'w-16 text-center bg-navy-800/50 border border-gold-500/20 rounded-lg py-1.5',
                            'text-gold-50 text-base font-semibold',
                            'focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20',
                            'transition-all duration-200 outline-none',
                            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                          )}
                          min={1}
                        />

                        <button
                          onClick={() => onUpdateCount(entry.id, entry.peopleCount + 1)}
                          className={cn(
                            'w-8 h-8 rounded-lg border flex items-center justify-center',
                            'text-gold-500 transition-all duration-200',
                            'hover:bg-gold-500/10 active:scale-95',
                            'border-gold-500/30'
                          )}
                        >
                          <Plus size={16} />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-gold-50 text-base font-semibold w-16 text-center">
                          {entry.peopleCount}
                        </span>
                        {!currentUserId && (
                          <div title="Login to edit">
                            <Lock size={14} className="text-gold-500/40" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
