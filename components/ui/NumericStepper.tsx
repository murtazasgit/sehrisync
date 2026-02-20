'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumericStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  error?: string;
}

export default function NumericStepper({
  value,
  onChange,
  min = 1,
  max = 50,
  label,
  error,
}: NumericStepperProps) {
  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      return;
    }
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue)) {
      if (numValue < min) {
        onChange(min);
      } else if (numValue > max) {
        onChange(max);
      } else {
        onChange(numValue);
      }
    }
  };

  const handleInputBlur = () => {
    if (value < min) {
      onChange(min);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className={cn(
          'block text-sm font-medium mb-2',
          error ? 'text-red-400' : 'text-gold-500/70'
        )}>
          {label}
        </label>
      )}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className={cn(
            'w-10 h-10 sm:w-12 sm:h-12 rounded-lg border flex items-center justify-center',
            'text-gold-500 transition-all duration-200',
            'hover:bg-gold-500/10 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed',
            error ? 'border-red-500/50' : 'border-gold-500/30'
          )}
          aria-label="Decrease count"
        >
          <Minus size={18} />
        </button>
        
        <div className="flex-1 flex items-center justify-center">
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            min={min}
            max={max}
            className={cn(
              'w-20 sm:w-24 text-center bg-navy-800/50 border rounded-lg py-2.5 sm:py-3',
              'text-gold-50 text-lg sm:text-2xl font-semibold',
              'focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20',
              'transition-all duration-200 outline-none',
              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
              error ? 'border-red-500/50 focus:border-red-500' : 'border-gold-500/20'
            )}
            aria-label="Number of people"
          />
        </div>

        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className={cn(
            'w-10 h-10 sm:w-12 sm:h-12 rounded-lg border flex items-center justify-center',
            'text-gold-500 transition-all duration-200',
            'hover:bg-gold-500/10 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed',
            error ? 'border-red-500/50' : 'border-gold-500/30'
          )}
          aria-label="Increase count"
        >
          <Plus size={18} />
        </button>
      </div>
      <p className="text-center text-xs text-gold-500/60 mt-2">
        {value} {value === 1 ? 'person' : 'people'}
      </p>
      {error && (
        <p className="mt-2 text-xs text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}
