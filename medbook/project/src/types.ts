export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  followers: number;
  ratings: number;
  languages: string[];
  about: string;
  specializations: string[];
  concernsTreated: string[];
  workExperience: {
    position: string;
    hospital: string;
    duration: string;
  }[];
  fees: {
    inClinic: number;
    video: number;
    chat: number;
  };
  image: string;
  location: string;
  gender: 'male' | 'female';
}

export type ConsultationType = 'in-clinic' | 'video' | 'chat';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
}

export interface Booking {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorImage: string;
  bookingDate: string;
  bookingTime: string;
  consultationType: ConsultationType;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  paymentId?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface PaymentDetails {
  bookingId: string;
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface PaymentResponse {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}