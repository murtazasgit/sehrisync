import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function submitRegistration(data: {
  fullName: string;
  phoneNumber: string;
  pgName: string;
  pgId: string;
  roomNumber?: string;
  address: string;
  numberOfPeople: number;
  landmark?: string;
  additionalNotes?: string;
  requestId: string;
}) {
  const { error } = await supabase
    .from('registrations')
    .insert([
      {
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
      },
    ]);

  if (error) throw error;
}

export async function checkDuplicatePhone(phoneNumber: string) {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('phoneNumber', phoneNumber)
    .gte('createdAt', new Date().toISOString().split('T')[0]);

  if (error) throw error;
  return data && data.length > 0;
}

export async function getRegistrations(filters?: {
  pgId?: string;
  phone?: string;
  date?: string;
  status?: string;
}) {
  let query = supabase
    .from('registrations')
    .select('*')
    .order('createdAt', { ascending: false });

  if (filters?.pgId) {
    query = query.eq('pgId', filters.pgId);
  }
  if (filters?.phone) {
    query = query.like('phoneNumber', `%${filters.phone}%`);
  }
  if (filters?.date) {
    query = query.eq('date', filters.date);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateStatus(id: string, status: 'pending' | 'delivered') {
  const { error } = await supabase
    .from('registrations')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

export async function getDashboardStats() {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: allData, error } = await supabase
    .from('registrations')
    .select('*');

  if (error) throw error;

  const todayData = allData.filter(r => r.date === today);
  
  const pgBreakdown = PG_LIST.reduce((acc: { name: string; count: number; people: number }[], pg) => {
    const pgData = allData.filter(r => r.pgId === pg.id);
    if (pgData.length > 0) {
      acc.push({
        name: pg.name,
        count: pgData.length,
        people: pgData.reduce((sum, r) => sum + r.numberOfPeople, 0),
      });
    }
    return acc;
  }, []);

  const othersData = allData.filter(r => r.pgId === 'others');
  if (othersData.length > 0) {
    pgBreakdown.push({
      name: 'Others',
      count: othersData.length,
      people: othersData.reduce((sum, r) => sum + r.numberOfPeople, 0),
    });
  }

  return {
    totalRequests: allData.length,
    totalPeople: allData.reduce((sum, r) => sum + r.numberOfPeople, 0),
    pgBreakdown,
    todayRequests: todayData.length,
    todayPeople: todayData.reduce((sum, r) => sum + r.numberOfPeople, 0),
  };
}

const PG_LIST = [
  { id: 'pg-1', name: 'Manju PG' },
  { id: 'pg-2', name: 'PG Street LMP PG' },
  { id: 'pg-3', name: 'Yadavi PG' },
  { id: 'pg-4', name: 'Sri Sai Ram Boys PG' },
  { id: 'pg-5', name: 'Techies Nest' },
  { id: 'pg-6', name: 'King PG - 1' },
  { id: 'pg-7', name: 'King PG - 2' },
  { id: 'pg-8', name: 'Maruti PG' },
  { id: 'pg-9', name: 'Guest Hub PG' },
  { id: 'pg-10', name: 'Shanuboganahalli Flat' },
];
