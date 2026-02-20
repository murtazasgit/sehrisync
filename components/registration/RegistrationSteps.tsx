'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
}

interface RegistrationStepsProps {
  steps: Step[];
  currentStep: number;
}

export default function RegistrationSteps({ steps, currentStep }: RegistrationStepsProps) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                backgroundColor: currentStep >= step.number ? '#d4a853' : 'rgba(212, 168, 83, 0.2)',
                borderColor: currentStep >= step.number ? '#d4a853' : 'rgba(212, 168, 83, 0.3)',
              }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'w-10 h-10 rounded-full border-2 flex items-center justify-center font-medium',
                'transition-colors duration-300',
                currentStep >= step.number ? 'text-navy-900' : 'text-gold-500'
              )}
            >
              {currentStep > step.number ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                step.number
              )}
            </motion.div>
            <span className={cn(
              'text-xs mt-2 hidden md:block',
              currentStep >= step.number ? 'text-gold-400' : 'text-gold-500/50'
            )}>
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              'w-8 md:w-16 h-0.5 mx-2',
              currentStep > step.number ? 'bg-gold-500' : 'bg-gold-500/20'
            )} />
          )}
        </div>
      ))}
    </div>
  );
}
