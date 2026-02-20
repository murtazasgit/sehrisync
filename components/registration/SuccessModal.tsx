'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';

interface SuccessModalProps {
  isOpen: boolean;
  requestId: string;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, requestId, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-navy-950/90 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="relative bg-navy-800 border border-gold-500/30 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl shadow-gold-500/10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-700/20 flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </motion.div>

        <h2 className="text-2xl font-bold text-gold-400 mb-2">Request Received!</h2>
        
        <p className="text-gold-500/70 mb-6">
          Your Sehri request has been received. JazakAllah Khair.
        </p>

        <div className="bg-navy-900/50 rounded-lg p-4 mb-6">
          <p className="text-xs text-gold-500/60 mb-1">Request ID</p>
          <p className="text-lg font-mono text-gold-400">{requestId}</p>
        </div>

        <p className="text-sm text-gold-500/50 mb-6">
          Save this ID for your records. You will receive a confirmation message shortly.
        </p>

        <Button onClick={onClose} className="w-full">
          Done
        </Button>
      </motion.div>
    </motion.div>
  );
}
