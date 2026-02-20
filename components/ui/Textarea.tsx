'use client';

import { TextareaHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = props.value && String(props.value).length > 0;

    return (
      <div className="relative w-full">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              'block text-sm font-medium mb-2 transition-colors duration-200',
              error ? 'text-red-400' : focused || hasValue ? 'text-gold-400' : 'text-gold-500/70'
            )}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            'w-full bg-navy-800/50 border rounded-lg px-4 py-3 min-h-[100px] resize-y',
            'text-gold-50 placeholder:text-gold-500/40',
            'focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20',
            'transition-all duration-200',
            error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-gold-500/20 focus:border-gold-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
