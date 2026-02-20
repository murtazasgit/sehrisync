export interface Registration {
  id: string;
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
  status: 'pending' | 'delivered';
  createdAt: string;
  date: string;
}

export interface PG {
  id: string;
  name: string;
  address: string;
}

export interface DashboardStats {
  totalRequests: number;
  totalPeople: number;
  pgBreakdown: { name: string; count: number; people: number }[];
  todayRequests: number;
  todayPeople: number;
}

export type RegistrationFormData = Omit<Registration, 'id' | 'requestId' | 'status' | 'createdAt' | 'date'>;
