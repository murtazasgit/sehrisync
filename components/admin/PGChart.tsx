'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PGChartProps {
  data: { name: string; count: number; people: number }[];
}

const COLORS = [
  '#d4a853', '#059669', '#f0c95e', '#065f46', '#e8c547',
  '#047857', '#b8943f', '#22c55e', '#84cc16', '#a3e635'
];

export default function PGChart({ data }: PGChartProps) {
  const chartData = data.map(item => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
    value: item.count,
    people: item.people,
    fullName: item.name,
  }));

  if (data.length === 0) {
    return (
      <div className="glass-card p-6 flex items-center justify-center h-80">
        <p className="text-gold-500/50">No data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold text-gold-400 mb-4">PG-wise Distribution</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="rgba(212, 168, 83, 0.2)"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#162442',
                border: '1px solid rgba(212, 168, 83, 0.3)',
                borderRadius: '8px',
                color: '#f1f5f9',
              }}
            />
            <Legend
              wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }}
              formatter={(value) => <span className="text-gold-500/70">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
