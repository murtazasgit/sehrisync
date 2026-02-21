'use client';

interface Entry {
  id: string;
  personName: string;
  pgName: string;
  peopleCount: number;
  userId: string;
}

interface EntriesTableProps {
  entries: Entry[];
}

export default function EntriesTable({ entries }: EntriesTableProps) {
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
          {entries.map((entry) => (
            <tr
              key={entry.id}
              className="border-b border-gold-500/10 hover:bg-gold-500/5 transition-colors"
            >
              <td className="py-3 px-4 text-gold-50">{entry.personName}</td>
              <td className="py-3 px-4 text-gold-50">{entry.pgName}</td>
              <td className="py-3 px-4 text-center">
                <span className="text-gold-50 font-semibold">
                  {entry.peopleCount}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
