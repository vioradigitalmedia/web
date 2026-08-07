import { S3Client } from '@aws-sdk/client-s3';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${import.meta.env.VITE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY || '',
  },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  forcePathStyle: true,
});

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

export const isSubmissionMsg = (messageStr: string) => {
  const content = (messageStr || '').toLowerCase();
  return (
    content.includes('film title:') ||
    content.includes('logline:') ||
    content.includes('director:') ||
    content.includes('movie url:') ||
    content.includes('genre:') ||
    content.includes('submission:') ||
    content.includes('payment id:') ||
    content.includes('film submission')
  );
};

export interface CfoTransaction {
  id: string;
  created_at: string;
  transaction_date: string;
  title: string;
  type: 'income' | 'expense';
  amount: number;
}

export interface FestivalSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  film_title: string;
  genre: string;
  runtime: string;
  logline: string;
  lang: string | null;
  director: string;
  cinematographer: string | null;
  editor: string | null;
  music_composer: string | null;
  sound_engineer: string | null;
  main_actor: string | null;
  main_actress: string | null;
  movie_url: string;
  poster_url: string | null;
  is_cs: boolean;
  id_url: string | null;
  payment_id: string;
  payment_status: string;
  amount_paid: number;
  created_at: string;
}

export interface PartnerProposal {
  id: string;
  name: string;
  email: string;
  company: string;
  proposal: string;
  status: string;
  created_at: string;
}

export interface JobApplication {
  id: string;
  role_id: string;
  role_title: string;
  name: string;
  email: string;
  phone: string | null;
  portfolio: string | null;
  cover_letter: string;
  status: string;
  created_at: string;
}

export interface AdminDocument {
  id: string;
  title: string;
  type: string;
  recipient_name: string;
  file_url: string;
  created_by: string;
  created_at: string;
}

export interface PhotoFestSubmission {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  is_student: boolean;
  photo_filename: string;
  photo_url: string | null;
  id_url: string | null;
  status: string;
  created_at: string;
}
