export type ServiceId =
  | 'buku-tamu'
  | 'sosialisasi'
  | 'izin-siswa'
  | 'peminjaman-sarana'
  | 'izin-penelitian'
  | 'legalisir'
  | 'ganti-ijazah'
  | 'izin-magang'
  | 'mutasi-siswa'
  | 'pengaduan'
  | 'tracker';

export interface ServiceItem {
  id: ServiceId;
  title: string;
  subtitle?: string;
  icon: string;
  color?: string;
  badge?: string;
}

export interface SubmissionResponse {
  ok: boolean;
  tracking_token: string;
  short_code: string;
  service_type: string;
  created_at: string;
  message: string;
  applicant_name?: string;
  applicant_phone?: string;
}

export interface TimelineStep {
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending' | 'rejected';
  timestamp?: string;
}

export interface TrackingData {
  ok: boolean;
  short_code: string;
  tracking_token: string;
  service_type: string;
  table_name: string;
  status_code: number;
  status_label: string;
  progress_percent: number;
  catatan_admin: string | null;
  applicant_masked_name?: string;
  created_at: string;
  updated_at: string;
  timeline: TimelineStep[];
}
