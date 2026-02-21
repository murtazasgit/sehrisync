'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';

export interface Entry {
  id: string;
  personName: string;
  pgName: string;
  phoneNumber: string;
  peopleCount: number;
  date: string;
  userId: string;
  createdAt: string;
}

interface AppContextType {
  entries: Entry[];
  currentUserId: string | null;
  currentUserPhone: string | null;
  loading: boolean;
  addEntry: (entry: Omit<Entry, 'id' | 'date' | 'userId' | 'createdAt'>) => Promise<void>;
  refreshEntries: () => Promise<void>;
  getTodayEntries: () => Entry[];
  getAllEntries: () => Entry[];
  getAllDates: () => { date: string; count: number; people: number }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('Supabase URL:', supabaseUrl ? 'Set' : 'NOT SET');
console.log('Supabase Key:', supabaseAnonKey ? 'Set' : 'NOT SET');

const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl.includes('supabase')
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

console.log('Supabase client:', supabase ? 'Created' : 'NOT Created');

const CURRENT_USER_KEY = 'sehri_current_user';

function generateId(): string {
  return `SEH-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

function generateUserId(): string {
  return `USER-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

function getTomorrowDateString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserPhone, setCurrentUserPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    console.log('Fetching entries from Supabase...');
    
    if (!supabase) {
      console.log('Supabase not initialized, skipping fetch');
      setLoading(false);
      return;
    }

    console.log('Querying entries table...');
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching entries:', error);
    } else {
      console.log('Fetched entries count:', data?.length || 0);
      setEntries(data?.map((row: any) => ({
        id: row.id,
        personName: row.person_name,
        pgName: row.pg_name,
        phoneNumber: row.phone_number,
        peopleCount: row.people_count,
        date: row.date,
        userId: row.user_id,
        createdAt: row.created_at,
      })) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUserId(user.userId);
        setCurrentUserPhone(user.phone);
      } catch (e) {
        console.error('Error loading user:', e);
      }
    }
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    if (!supabase || loading) return;

    const channel: RealtimeChannel = supabase
      .channel('entries-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'entries',
        },
        () => {
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loading, fetchEntries]);

  const setCurrentUser = (userId: string, phone: string) => {
    setCurrentUserId(userId);
    setCurrentUserPhone(phone);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ userId, phone }));
  };

  const addEntry = async (entry: Omit<Entry, 'id' | 'date' | 'userId' | 'createdAt'>) => {
    if (!supabase) {
      console.error('Supabase not configured');
      return;
    }

    const tomorrowDate = getTomorrowDateString();
    console.log('Adding entry with date:', tomorrowDate);
    
    const trimmedName = entry.personName.trim();
    const trimmedPG = entry.pgName.trim();
    
    const existingEntry = entries.find(
      e => 
        e.personName.toLowerCase() === trimmedName.toLowerCase() && 
        e.pgName.toLowerCase() === trimmedPG.toLowerCase() &&
        e.date === tomorrowDate
    );

    const userId = currentUserId || generateUserId();
    
    if (existingEntry) {
      const newCount = existingEntry.peopleCount + entry.peopleCount;
      
      await supabase
        .from('entries')
        .update({ people_count: newCount })
        .eq('id', existingEntry.id);
    } else {
      const newEntry = {
        id: generateId(),
        person_name: entry.personName,
        pg_name: entry.pgName,
        phone_number: entry.phoneNumber,
        people_count: entry.peopleCount,
        date: tomorrowDate,
        user_id: userId,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('entries').insert([newEntry]);
      console.log('Insert result:', error ? error : 'Success');
    }

    if (!currentUserId) {
      setCurrentUser(userId, entry.phoneNumber);
    }

    await fetchEntries();
  };

  const refreshEntries = async () => {
    setLoading(true);
    await fetchEntries();
  };

  const getTodayEntries = () => {
    const tomorrowDate = getTomorrowDateString();
    return entries.filter(e => e.date === tomorrowDate);
  };

  const getAllEntries = () => {
    return [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getAllDates = () => {
    const dateMap = new Map<string, { date: string; count: number; people: number }>();
    
    entries.forEach(e => {
      const existing = dateMap.get(e.date);
      if (existing) {
        existing.count += 1;
        existing.people += e.peopleCount;
      } else {
        dateMap.set(e.date, { date: e.date, count: 1, people: e.peopleCount });
      }
    });
    
    return Array.from(dateMap.values()).sort((a, b) => b.date.localeCompare(a.date));
  };

  return (
    <AppContext.Provider value={{
      entries,
      currentUserId,
      currentUserPhone,
      loading,
      addEntry,
      refreshEntries,
      getTodayEntries,
      getAllEntries,
      getAllDates,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
