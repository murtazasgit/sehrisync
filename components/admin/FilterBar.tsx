'use client';

import { useState } from 'react';
import { Filter, Download } from 'lucide-react';
import { PG_LIST } from '@/lib/constants';
import { downloadCSV } from '@/lib/utils';
import { Button } from '@/components/ui';
import { Registration } from '@/types';

interface FilterBarProps {
  onFilterChange: (filters: { pgId?: string; date?: string }) => void;
  data: Registration[];
}

export default function FilterBar({ onFilterChange, data }: FilterBarProps) {
  const [pgFilter, setPgFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const handlePGChange = (value: string) => {
    setPgFilter(value);
    onFilterChange({ pgId: value || undefined, date: dateFilter || undefined });
  };

  const handleDateChange = (value: string) => {
    setDateFilter(value);
    onFilterChange({ pgId: pgFilter || undefined, date: value || undefined });
  };

  const handleExport = () => {
    const exportData = data.map(item => ({
      RequestID: item.requestId,
      Name: item.fullName,
      Phone: item.phoneNumber,
      'PG Name': item.pgName,
      'Room Number': item.roomNumber || 'N/A',
      Address: item.address,
      'Number of People': item.numberOfPeople,
      Landmark: item.landmark || 'N/A',
      'Additional Notes': item.additionalNotes || 'N/A',
      Status: item.status,
      Date: item.date,
      'Created At': item.createdAt,
    }));
    downloadCSV(exportData, `sehri-registrations-${today}`);
  };

  return (
    <div className="glass-card p-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-gold-500/60">
          <Filter size={18} />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <select
          value={pgFilter}
          onChange={(e) => handlePGChange(e.target.value)}
          className="bg-navy-900/50 border border-gold-500/20 rounded-lg px-4 py-2 text-gold-50 text-sm focus:border-gold-500 focus:outline-none"
        >
          <option value="">All PGs</option>
          {PG_LIST.map(pg => (
            <option key={pg.id} value={pg.id}>{pg.name}</option>
          ))}
          <option value="others">Others</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => handleDateChange(e.target.value)}
          className="bg-navy-900/50 border border-gold-500/20 rounded-lg px-4 py-2 text-gold-50 text-sm focus:border-gold-500 focus:outline-none"
        />

        <div className="flex-1" />

        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download size={16} className="mr-2" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
