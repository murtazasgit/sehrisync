'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Calendar, RefreshCw, Users, Home, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui';
import { useApp } from '@/context/AppContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { 
    getAllEntries, 
    getTodayEntries, 
    getAllSessions, 
    getSessionEntries,
    startNewDay, 
    currentDate,
    currentSessionId,
    loading: contextLoading,
    updateEntryCountAdmin,
  } = useApp();
  const [showSuccess, setShowSuccess] = useState(false);
  const [filterSession, setFilterSession] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contextLoading) return;
    setLoading(false);
  }, [contextLoading]);

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }
    setLoading(false);
  }, [router]);

  const allEntries = getAllEntries();
  const todayEntries = getTodayEntries();
  const sessions = getAllSessions();

  const filteredEntries = filterSession === 'all' 
    ? allEntries 
    : filterSession === 'today'
    ? todayEntries
    : getSessionEntries(filterSession);

  const todayPeople = todayEntries.reduce((sum, e) => sum + e.peopleCount, 0);
  const totalPeople = allEntries.reduce((sum, e) => sum + e.peopleCount, 0);

  const pgBreakdown = todayEntries.reduce((acc, e) => {
    const existing = acc.find(p => p.pgName === e.pgName);
    if (existing) {
      existing.people += e.peopleCount;
      existing.count += 1;
    } else {
      acc.push({ pgName: e.pgName, people: e.peopleCount, count: 1 });
    }
    return acc;
  }, [] as { pgName: string; people: number; count: number }[]);

  const maxPgPeople = Math.max(...pgBreakdown.map(p => p.people), 1);

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleStartNewDay = () => {
    startNewDay();
    setShowSuccess(true);
    setFilterSession('today');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy-950 p-4 md:p-8">
      <div className="geometric-pattern absolute inset-0 opacity-20" />
      
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 glass-card px-6 py-4 border-green-500/30"
          >
            <p className="text-green-400 font-medium">
              New registration day started successfully.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gold-400">
              Admin Dashboard
            </h1>
            <p className="text-gold-500/60 text-sm mt-1">
              Manage Sehri food registrations
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg border border-gold-500/20 text-gold-500 hover:bg-gold-500/10 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-gold-500" />
              </div>
              <div>
                <p className="text-gold-500/60 text-sm">Today&apos;s Entries</p>
                <p className="text-xl font-bold text-gold-50">{todayEntries.length}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-gold-500" />
              </div>
              <div>
                <p className="text-gold-500/60 text-sm">Today&apos;s People</p>
                <p className="text-xl font-bold text-gold-50">{todayPeople}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-gold-500" />
              </div>
              <div>
                <p className="text-gold-500/60 text-sm">Overall Entries</p>
                <p className="text-xl font-bold text-gold-50">{allEntries.length}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-gold-500" />
              </div>
              <div>
                <p className="text-gold-500/60 text-sm">Overall People</p>
                <p className="text-xl font-bold text-gold-50">{totalPeople}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="glass-card p-4">
            <h3 className="text-gold-400 font-medium mb-4 flex items-center gap-2">
              <BarChart3 size={18} />
              Today&apos;s PG Breakdown
            </h3>
            {pgBreakdown.length === 0 ? (
              <p className="text-gold-500/60 text-sm">No entries for today</p>
            ) : (
              <div className="space-y-3">
                {pgBreakdown.map((pg) => (
                  <div key={pg.pgName} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gold-50 truncate">{pg.pgName}</span>
                      <span className="text-gold-400 font-medium">{pg.people} people</span>
                    </div>
                    <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(pg.people / maxPgPeople) * 100}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="h-full bg-gold-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-4">
            <h3 className="text-gold-400 font-medium mb-4 flex items-center gap-2">
              <Calendar size={18} />
              Start New Day
            </h3>
            <p className="text-gold-500/60 text-sm mb-4">
              Current Date: {formatDisplayDate(currentDate)}
            </p>
            <p className="text-gold-500/60 text-sm mb-4">
              This will start a new registration session. Previous data will be preserved in history.
            </p>
            <Button onClick={handleStartNewDay} className="w-full">
              <RefreshCw size={18} className="mr-2" />
              Start New Day
            </Button>
          </div>
        </div>

        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gold-400">All Registrations</h2>
            <div className="flex items-center gap-2">
              <label className="text-gold-500/60 text-sm">Filter:</label>
              <select
                value={filterSession}
                onChange={(e) => setFilterSession(e.target.value)}
                className="bg-navy-800/50 border border-gold-500/20 rounded-lg px-3 py-2 text-gold-50 text-sm focus:border-gold-500 outline-none"
              >
                <option value="all">All Sessions</option>
                <option value="today">Today&apos;s Session</option>
                {sessions.filter(s => s.sessionId !== currentSessionId).map((session) => (
                  <option key={session.sessionId} value={session.sessionId}>
                    {formatDisplayDate(session.date)} ({session.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gold-500/20">
                  <th className="text-left py-3 px-4 text-gold-500/70 font-medium text-sm">Person Name</th>
                  <th className="text-left py-3 px-4 text-gold-500/70 font-medium text-sm">PG Name</th>
                  <th className="text-left py-3 px-4 text-gold-500/70 font-medium text-sm">Phone</th>
                  <th className="text-center py-3 px-4 text-gold-500/70 font-medium text-sm">Count</th>
                  <th className="text-left py-3 px-4 text-gold-500/70 font-medium text-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gold-500/60">
                      No entries found
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-gold-500/10 hover:bg-gold-500/5 transition-colors"
                    >
                      <td className="py-3 px-4 text-gold-50">{entry.personName}</td>
                      <td className="py-3 px-4 text-gold-50">{entry.pgName}</td>
                      <td className="py-3 px-4 text-gold-50">{entry.phoneNumber}</td>
                      <td className="py-3 px-4 text-gold-50 text-center font-medium">{entry.peopleCount}</td>
                      <td className="py-3 px-4 text-gold-500/70 text-sm">{formatDisplayDate(entry.date)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {filteredEntries.length > 0 && (
            <div className="p-4 border-t border-gold-500/20">
              <p className="text-gold-500/70 text-sm">
                Showing {filteredEntries.length} entries | Total: {filteredEntries.reduce((sum, e) => sum + e.peopleCount, 0)} people
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
