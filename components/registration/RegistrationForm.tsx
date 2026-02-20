'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, Textarea, NumericStepper } from '@/components/ui';
import { PG } from '@/types';
import { generateRequestId } from '@/lib/constants';

interface RegistrationFormData {
  fullName: string;
  phoneNumber: string;
  roomNumber: string;
  address: string;
  numberOfPeople: number;
  landmark: string;
  additionalNotes: string;
}

interface SubmitData extends RegistrationFormData {
  pgName: string;
  pgId: string;
  requestId: string;
}

interface RegistrationFormProps {
  selectedPG: PG | null;
  onSubmit: (data: SubmitData) => Promise<void>;
  onBack: () => void;
}

export default function RegistrationForm({ selectedPG, onSubmit, onBack }: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    phoneNumber: '',
    roomNumber: '',
    address: selectedPG?.address || '',
    numberOfPeople: 1,
    landmark: '',
    additionalNotes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const isOthers = selectedPG?.id === 'others';

  const validateForm = () => {
    const newErrors: Partial<Record<keyof RegistrationFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Enter a valid 10-digit phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedPG) return;

    setLoading(true);
    try {
      await onSubmit({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        roomNumber: formData.roomNumber,
        address: formData.address,
        numberOfPeople: formData.numberOfPeople,
        landmark: formData.landmark,
        additionalNotes: formData.additionalNotes,
        pgName: selectedPG.name,
        pgId: selectedPG.id,
        requestId: generateRequestId(),
      });
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof RegistrationFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="form"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="w-full max-w-xl mx-auto"
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
            <div>
              <h2 className="text-xl font-semibold text-gold-400">
                {isOthers ? 'Register for Others PG' : 'Register for Sehri'}
              </h2>
              <p className="text-sm text-gold-500/60">{selectedPG?.name}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <Input
                id="fullName"
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                error={errors.fullName}
                placeholder="Enter your full name"
                required
              />

              <Input
                id="phone"
                label="Phone Number"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => updateField('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                error={errors.phoneNumber}
                placeholder="Enter 10-digit phone number"
                required
              />

              {!isOthers && (
                <Input
                  id="roomNumber"
                  label="Room Number (Optional)"
                  value={formData.roomNumber}
                  onChange={(e) => updateField('roomNumber', e.target.value)}
                  placeholder="e.g., 101, A-205"
                />
              )}

              <Input
                id="address"
                label={isOthers ? 'Full Address' : 'Address'}
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                error={errors.address}
                placeholder={isOthers ? 'Enter full address' : 'Enter your address'}
                required
              />

              {isOthers && (
                <Input
                  id="landmark"
                  label="Landmark (Optional)"
                  value={formData.landmark}
                  onChange={(e) => updateField('landmark', e.target.value)}
                  placeholder="Nearby landmark"
                />
              )}
            </div>

            <div className="py-2">
              <NumericStepper
                label="Number of People for Sehri"
                value={formData.numberOfPeople}
                onChange={(value) => updateField('numberOfPeople', value)}
                min={1}
                max={50}
              />
            </div>

            <Textarea
              id="notes"
              label="Additional Notes (Optional)"
              value={formData.additionalNotes}
              onChange={(e) => updateField('additionalNotes', e.target.value)}
              placeholder="Any special requirements..."
              rows={3}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full mt-6"
              loading={loading}
            >
              Submit Sehri Request
            </Button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
