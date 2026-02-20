import { PG } from '@/types';

export const PG_LIST: PG[] = [
  { id: 'pg-1', name: 'Manju PG', address: 'Near City Center, Main Road' },
  { id: 'pg-2', name: 'PG Street LMP PG', address: 'PG Street, LMP Area' },
  { id: 'pg-3', name: 'Yadavi PG', address: 'Yadavi Nagar, Block A' },
  { id: 'pg-4', name: 'Sri Sai Ram Boys PG', address: 'Sri Sai Ram Colony' },
  { id: 'pg-5', name: 'Techies Nest', address: 'Tech Park Road' },
  { id: 'pg-6', name: 'King PG - 1', address: 'King Street, Phase 1' },
  { id: 'pg-7', name: 'King PG - 2', address: 'King Street, Phase 2' },
  { id: 'pg-8', name: 'Maruti PG', address: 'Maruti Industrial Area' },
  { id: 'pg-9', name: 'Guest Hub PG', address: 'Guest Hub Complex' },
  { id: 'pg-10', name: 'Shanuboganahalli Flat', address: 'Shanuboganahalli Village' },
];

export const OTHERS_PG: PG = {
  id: 'others',
  name: 'Others',
  address: '',
};

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ;

export const SEHRI_END_HOUR = 4; 

export const generateRequestId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SEH-${timestamp.slice(-4)}${random}`;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
