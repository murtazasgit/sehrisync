'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';

export interface Entry {
  id: string;
  personName: string;
  pgName: string;
  phoneNumber: string;
  peopleCount: number;
  date: string;
  sessionId: string;
  userId: string;
  createdAt: string;
}

interface AppContextType {
  entries: Entry[];
  currentDate: string;
  currentSessionId: string;
  currentUserId: string | null;
  currentUserPhone: string | null;
  loading: boolean;
  error: string | null;
  addEntry: (entry: Omit<Entry, 'id' | 'date' | 'sessionId' | 'userId' | 'createdAt'>) => Promise<void>;
  updateEntryCount: (id: string, newCount: number) => Promise<void>;
  updateEntryCountAdmin: (id: string, newCount: number) => Promise<void>;
  refreshEntries: () => Promise<void>;
  startNewDay: () => void;
  getTodayEntries: () => Entry[];
  getAllEntries: () => Entry[];
  getSessionEntries: (sessionId: string) => Entry[];
  getAllSessions: () => { sessionId: string; date: string; count: number; people: number }[];
  setCurrentUser: (userId: string, phone: string) => void;
  clearCurrentUser: () => void;
  isOwner: (userId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const CURRENT_SESSION_KEY = 'sehri_current_session';
const CURRENT_USER_KEY = 'sehri_current_user';

function generateRequestId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SEH-${timestamp.slice(-4)}${random}`;
}

function generateSessionId(): string {
  return `SESSION-${Date.now()}`;
}

function generateUserId(): string {
  return `USER-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentDate, setCurrentDate] = useState<string>(getTodayDateString());
  const [currentSessionId, setCurrentSessionId] = useState<string>(generateSessionId());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserPhone, setCurrentUserPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching entries:', fetchError);
      setError('Failed to fetch entries from database');
    } else if (data) {
      setEntries(data.map((row: any) => ({
        id: row.id,
        personName: row.person_name,
        pgName: row.pg_name,
        phoneNumber: row.phone_number,
        peopleCount: row.people_count,
        date: row.date,
        sessionId: row.session_id,
        userId: row.user_id,
        createdAt: row.created_at,
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    const initializeData = async () => {
      const storedSession = localStorage.getItem(CURRENT_SESSION_KEY);
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      
      if (storedSession) {
        setCurrentSessionId(storedSession);
      } else {
        const newSession = generateSessionId();
        setCurrentSessionId(newSession);
        localStorage.setItem(CURRENT_SESSION_KEY, newSession);
      }

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUserId(user.userId);
          setCurrentUserPhone(user.phone);
        } catch (e) {
          console.error('Failed to parse stored user', e);
        }
      }

      await fetchEntries();
    };

    initializeData();
  }, []);

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
  }, [loading]);

  const refreshEntries = async () => {
    setLoading(true);
    setError(null);
    await fetchEntries();
  };

  const setCurrentUser = (userId: string, phone: string) => {
    setCurrentUserId(userId);
    setCurrentUserPhone(phone);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ userId, phone }));
  };

  const clearCurrentUser = () => {
    setCurrentUserId(null);
    setCurrentUserPhone(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const isOwner = (userId: string): boolean => {
    return currentUserId === userId;
  };

  const addEntry = async (entry: Omit<Entry, 'id' | 'date' | 'sessionId' | 'userId' | 'createdAt'>) => {
    if (!supabase) {
      setError('Database not connected. Please configure Supabase.');
      return;
    }

    const trimmedName = entry.personName.trim();
    const trimmedPG = entry.pgName.trim();
    
    const existingIndex = entries.findIndex(
      e => 
        e.personName.toLowerCase() === trimmedName.toLowerCase() && 
        e.pgName.toLowerCase() === trimmedPG.toLowerCase() &&
        e.sessionId === currentSessionId
    );

    const userId = currentUserId || generateUserId();
    
    if (existingIndex >= 0) {
      const existingEntry = entries[existingIndex];
      const newCount = existingEntry.peopleCount + entry.peopleCount;
      
      const { error: updateError } = await supabase
        .from('entries')
        .update({ people_count: newCount })
        .eq('id', existingEntry.id);

      if (updateError) {
        console.error('Error updating entry:', updateError);
        setError('Failed to update entry');
        return;
      }

      await fetchEntries();
    } else {
      const newEntry: Entry = {
        ...entry,
        id: generateRequestId(),
        date: currentDate,
        sessionId: currentSessionId,
        userId: userId,
        createdAt: new Date().toISOString(),
      };

      const { error: insertError } = await supabase.from('entries').insert([{
        id: newEntry.id,
        person_name: newEntry.personName,
        pg_name: newEntry.pgName,
        phone_number: newEntry.phoneNumber,
        people_count: newEntry.peopleCount,
        date: newEntry.date,
        session_id: newEntry.sessionId,
        user_id: newEntry.userId,
        created_at: newEntry.createdAt,
      }]);

      if (insertError) {
        console.error('Error inserting entry:', insertError);
        setError('Failed to add entry');
        return;
      }

      if (!currentUserId) {
        setCurrentUser(userId, entry.phoneNumber);
      }

      await fetchEntries();
    }
  };

  const updateEntryCount = async (id: string, newCount: number) => {
    if (!supabase) {
      setError('Database not connected');
      return;
    }

    const entry = entries.find(e => e.id === id);
    if (!entry || entry.userId !== currentUserId) return;

    const { error: updateError } = await supabase
      .from('entries')
      .update({ people_count: newCount })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating count:', updateError);
      setError('Failed to update count');
      return;
    }

    await fetchEntries();
  };

  const updateEntryCountAdmin = async (id: string, newCount: number) => {
    if (!supabase) {
      setError('Database not connected');
      return;
    }

    const { error: updateError } = await supabase
      .from('entries')
      .update({ people_count: newCount })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating count:', updateError);
      setError('Failed to update count');
      return;
    }

    await fetchEntries();
  };

  const startNewDay = () => {
    const newDate = getTodayDateString();
    const newSessionId = generateSessionId();
    setCurrentDate(newDate);
    setCurrentSessionId(newSessionId);
    localStorage.setItem(CURRENT_SESSION_KEY, newSessionId);
  };

  const getTodayEntries = () => {
    return entries.filter(e => e.sessionId === currentSessionId);
  };

  const getAllEntries = () => {
    return [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getSessionEntries = (sessionId: string) => {
    return entries.filter(e => e.sessionId === sessionId);
  };

  const getAllSessions = () => {
    const sessionMap = new Map<string, { sessionId: string; date: string; count: number; people: number }>();
    
    entries.forEach(e => {
      const existing = sessionMap.get(e.sessionId);
      if (existing) {
        existing.count += 1;
        existing.people += e.peopleCount;
      } else {
        sessionMap.set(e.sessionId, {
          sessionId: e.sessionId,
          date: e.date,
          count: 1,
          people: e.peopleCount,
        });
      }
    });
    
    return Array.from(sessionMap.values()).sort((a, b) => b.date.localeCompare(a.date));
  };

  return (
    <AppContext.Provider value={{
      entries,
      currentDate,
      currentSessionId,
      currentUserId,
      currentUserPhone,
      loading,
      error,
      addEntry,
      updateEntryCount,
      updateEntryCountAdmin,
      refreshEntries,
      startNewDay,
      getTodayEntries,
      getAllEntries,
      getSessionEntries,
      getAllSessions,
      setCurrentUser,
      clearCurrentUser,
      isOwner,
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
