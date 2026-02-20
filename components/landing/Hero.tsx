'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Shield } from 'lucide-react';
import CrescentMoon from './CrescentMoon';
import Lantern from './Lantern';
import { Button } from '@/components/ui';

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950" />
      
      <div className="absolute inset-0 geometric-pattern opacity-40" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Lantern className="absolute top-20 left-[8%]" delay={0.2} />
        <Lantern className="absolute top-32 right-[12%]" delay={0.4} />
        <Lantern className="absolute bottom-32 left-[15%]" delay={0.6} />
        <Lantern className="absolute bottom-24 right-[8%]" delay={0.8} />
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <motion.div
          animate={{
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gold-500/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            opacity: [0.1, 0.18, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-amber-600/15 rounded-full blur-[100px]"
        />
      </div>

      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin')}
          className="flex items-center gap-2 border-gold-500/30 text-gold-500/80 hover:text-gold-400 hover:bg-gold-500/10 transition-all duration-300"
        >
          <Shield size={16} />
          Admin
        </Button>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-10 flex justify-center"
        >
          <CrescentMoon />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-3"
        >
          <span className="text-gold-400/80 text-lg tracking-[0.3em] uppercase font-medium">
            Ramadan 2026
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
        >
          <div className="relative inline-block">
            <span 
              className="islamic-heading text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-gold-400 to-amber-300"
              style={{
                textShadow: '0 0 60px rgba(212, 168, 83, 0.4)',
              }}
            >
              Ramadan
            </span>
          </div>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gold-100 mb-8 tracking-wide"
        >
          Sehri Food Registration
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-2xl md:text-3xl text-gold-500/70 mb-3 font-amiri"
        >
          مَنۡ فَطَرَ صَائِمًا
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-gold-500/50 mb-12 text-lg font-light"
        >
          May Allah bless those who feed others
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Button
            size="lg"
            onClick={() => router.push('/entries')}
            className="
              group relative px-10 py-4 text-lg
              bg-gradient-to-r from-gold-500 to-amber-500
              text-navy-950 font-semibold
              rounded-full
              shadow-[0_0_30px_rgba(212,168,83,0.4)]
              hover:shadow-[0_0_50px_rgba(212,168,83,0.6)]
              hover:scale-105
              active:scale-95
              transition-all duration-300
            "
          >
            <span className="flex items-center gap-3">
              Register for Sehri
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
