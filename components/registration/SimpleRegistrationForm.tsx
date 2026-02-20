'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, NumericStepper } from '@/components/ui';

interface RegistrationFormData {
  personName: string;
  pgName: string;
  phoneNumber: string;
  peopleCount: number;
}

interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData) => void;
  onBack: () => void;
}

export default function SimpleRegistrationForm({ 
  onSubmit, 
  onBack,
}: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationFormData>({
    personName: '',
    pgName: '',
    phoneNumber: '',
    peopleCount: 1,
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.personName.trim()) {
      setError('Person name is required');
      return;
    }

    if (!formData.pgName.trim()) {
      setError('PG / Place Name is required');
      return;
    }

    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }

    if (formData.phoneNumber.replace(/\D/g, '').length < 10) {
      setError('Phone number must be at least 10 digits');
      return;
    }

    onSubmit(formData);
  };

  const updateField = (field: keyof RegistrationFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handlePhoneChange = (value: string) => {
    const numericOnly = value.replace(/\D/g, '');
    if (numericOnly.length <= 10) {
      updateField('phoneNumber', numericOnly);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-card p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="text-gold-500/60 hover:text-gold-500 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-gold-400">
            Add New Entry
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="personName"
            label="Person Name *"
            value={formData.personName}
            onChange={(e) => updateField('personName', e.target.value)}
            placeholder="Enter person name"
            required
          />

          <Input
            id="pgName"
            label="PG / Place Name *"
            value={formData.pgName}
            onChange={(e) => updateField('pgName', e.target.value)}
            placeholder="Enter PG or place name"
            required
          />

          <Input
            id="phoneNumber"
            label="Phone Number *"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="Enter phone number"
            required
          />

          <NumericStepper
            label="Number of People"
            value={formData.peopleCount}
            onChange={(value) => updateField('peopleCount', value)}
            min={1}
            max={100}
          />

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <Button type="submit" size="lg" className="w-full">
            Add Entry
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
