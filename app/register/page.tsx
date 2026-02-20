'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SimpleRegistrationForm from '@/components/registration/SimpleRegistrationForm';
import { useApp } from '@/context/AppContext';

export default function RegisterPage() {
  const router = useRouter();
  const { addEntry, currentDate } = useApp();

  const handleAddEntry = (data: {
    personName: string;
    pgName: string;
    phoneNumber: string;
    peopleCount: number;
  }) => {
    addEntry({
      personName: data.personName,
      pgName: data.pgName,
      phoneNumber: data.phoneNumber,
      peopleCount: data.peopleCount,
    });
    router.push('/entries');
  };

  const handleBack = () => {
    router.push('/');
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <main className="min-h-screen bg-navy-950 py-8 px-4">
      <div className="geometric-pattern absolute inset-0 opacity-30" />
      
      <div className="relative z-10 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gold-500/60 hover:text-gold-500 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gold-400 islamic-heading">
            Ramadan Sehri
          </h1>
          <div className="w-16" />
        </motion.div>

        <div className="text-center mb-6">
          <p className="text-gold-500/70">{formatDisplayDate(currentDate)}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <SimpleRegistrationForm
            onSubmit={handleAddEntry}
            onBack={handleBack}
          />
        </motion.div>
      </div>
    </main>
  );
}
