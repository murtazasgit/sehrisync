'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { Registration } from '@/types';
import { cn, formatDate, formatTime } from '@/lib/utils';

interface DataTableProps {
  data: Registration[];
  onStatusChange: (id: string, status: 'pending' | 'delivered') => void;
}

export default function DataTable({ data, onStatusChange }: DataTableProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredData = data.filter(item =>
    item.fullName.toLowerCase().includes(search.toLowerCase()) ||
    item.phoneNumber.includes(search) ||
    item.pgName.toLowerCase().includes(search.toLowerCase()) ||
    item.requestId.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-gold-500/10">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500/40" />
            <input
              type="text"
              placeholder="Search by name, phone, PG..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-4 py-2 bg-navy-900/50 border border-gold-500/20 rounded-lg text-gold-50 text-sm placeholder:text-gold-500/40 focus:border-gold-500 focus:outline-none w-full sm:w-64"
            />
          </div>
          <p className="text-sm text-gold-500/60 self-center">
            Showing {paginatedData.length} of {filteredData.length} entries
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-navy-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gold-500/60 uppercase tracking-wider">Request ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gold-500/60 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gold-500/60 uppercase tracking-wider">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gold-500/60 uppercase tracking-wider">PG Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gold-500/60 uppercase tracking-wider">People</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gold-500/60 uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gold-500/60 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-500/10">
            {paginatedData.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-gold-500/5 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-mono text-gold-400">{item.requestId}</td>
                <td className="px-4 py-3 text-sm text-gold-50">{item.fullName}</td>
                <td className="px-4 py-3 text-sm text-gold-500/70">{item.phoneNumber}</td>
                <td className="px-4 py-3 text-sm text-gold-50">{item.pgName}</td>
                <td className="px-4 py-3 text-sm text-gold-400 font-medium">{item.numberOfPeople}</td>
                <td className="px-4 py-3 text-sm text-gold-500/60">
                  <div>{formatDate(new Date(item.createdAt))}</div>
                  <div className="text-xs">{formatTime(new Date(item.createdAt))}</div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onStatusChange(item.id, item.status === 'pending' ? 'delivered' : 'pending')}
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors',
                      item.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                    )}
                  >
                    {item.status === 'pending' ? (
                      <>
                        <X size={12} /> Pending
                      </>
                    ) : (
                      <>
                        <Check size={12} /> Delivered
                      </>
                    )}
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="p-8 text-center text-gold-500/50">
          No registrations found
        </div>
      )}

      {totalPages > 1 && (
        <div className="p-4 border-t border-gold-500/10 flex items-center justify-between">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gold-500/20 text-gold-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-500/10 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-sm transition-colors',
                    page === pageNum
                      ? 'bg-gold-500 text-navy-900'
                      : 'text-gold-500 hover:bg-gold-500/10'
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-gold-500/20 text-gold-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-500/10 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
