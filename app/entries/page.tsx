'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import EntriesTable from '@/components/registration/EntriesTable';
import { useApp } from '@/context/AppContext';

export default function EntriesPage() {
  const router = useRouter();
  const { getTodayEntries, updateEntryCount, currentDate, isOwner, currentUserId, loading, error, refreshEntries } = useApp();
  
  if (loading) {
    return (
      <main className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-3 border-gold-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gold-500/60">Loading entries...</p>
        </div>
      </main>
    );
  }
  
  const todayEntries = getTodayEntries();
  const totalPeople = todayEntries.reduce((sum, e) => sum + e.peopleCount, 0);

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleUpdateCount = (id: string, newCount: number) => {
    updateEntryCount(id, newCount);
  };

  const handleRefresh = () => {
    refreshEntries();
  };

  return (
    <main className="min-h-screen bg-navy-950 py-8 px-4">
      <div className="geometric-pattern absolute inset-0 opacity-30" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gold-500/60 hover:text-gold-500 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gold-400 islamic-heading">
            Ramadan Sehri
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/add-entry')}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Add
            </Button>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 glass-card p-4 border-red-500/30 flex items-center gap-3"
          >
            <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
            <Button size="sm" variant="outline" onClick={handleRefresh}>
              Retry
            </Button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gold-50 mb-2">
              Tomorrow&apos;s Entries
            </h2>
            <p className="text-gold-500/70 text-lg">
              {getTomorrowDate()}
            </p>
          </div>

          {todayEntries.length > 0 && (
            <div className="mb-6">
              <p className="text-gold-500/60 text-center">
                Total: <span className="text-gold-400 font-semibold">{todayEntries.length}</span> {todayEntries.length === 1 ? 'person' : 'people'}, {' '}
                <span className="text-gold-400 font-semibold">{totalPeople}</span> for Sehri
              </p>
            </div>
          )}

          <div className="glass-card p-4 md:p-6 overflow-hidden">
            {todayEntries.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-500/10 flex items-center justify-center">
                  <svg 
                    className="w-8 h-8 text-gold-500/50" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                </div>
                <p className="text-gold-500/60 mb-4">
                  No entries added yet for tomorrow.
                </p>
                <Button
                  onClick={() => router.push('/add-entry')}
                  className="inline-flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add First Entry
                </Button>
              </div>
            ) : (
              <EntriesTable
                entries={todayEntries}
                onUpdateCount={handleUpdateCount}
                isOwner={isOwner}
                currentUserId={currentUserId}
              />
            )}
          </div>

          {todayEntries.length > 0 && (
            <div className="text-center mt-6">
              <Button
                size="lg"
                onClick={() => router.push('/add-entry')}
                className="inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Add More Entries
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
