import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface TrackingDetail {
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
  timeline: {
    title: string;
    description: string;
    status: 'completed' | 'current' | 'pending' | 'rejected';
    timestamp?: string;
  }[];
}

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);

  constructor(private readonly db: DatabaseService) {}

  private maskName(name?: string): string {
    if (!name) return 'Pemohon';
    const parts = name.trim().split(/\s+/);
    return parts
      .map((part) => {
        if (part.length <= 2) return part;
        return part[0] + '*'.repeat(part.length - 2) + part[part.length - 1];
      })
      .join(' ');
  }

  async track(tokenOrCode: string): Promise<TrackingDetail> {
    const cleanQuery = tokenOrCode.trim();
    if (!cleanQuery) {
      throw new NotFoundException('Kode token atau short code tidak valid.');
    }

    // Lookup in ptsp_master_tracking by short_code (case-insensitive) or tracking_token
    const sql = `
      SELECT id, tracking_token, short_code, no_wa, service_type, table_name,
             status, catatan_admin, created_at, updated_at
      FROM ptsp_master_tracking
      WHERE UPPER(short_code) = UPPER($1) OR tracking_token::text = $1
      LIMIT 1
    `;
    const record = await this.db.queryOne(sql, [cleanQuery]);

    if (!record) {
      throw new NotFoundException(
        `Permohonan dengan kode "${cleanQuery}" tidak ditemukan. Pastikan kode yang dimasukkan benar.`,
      );
    }

    // Fetch applicant name from the specific table for friendly greeting (masked)
    let applicantName = '';
    try {
      const allowedTables = [
        'ptsp_sosialisasi',
        'ptsp_peminjaman_sarana',
        'ptsp_izin_penelitian',
        'ptsp_legalisir',
        'ptsp_pengganti_ijazah',
        'ptsp_izin_magang',
        'ptsp_mutasi_siswa',
        'ptsp_pengaduan',
        'ptsp_izin_siswa',
        'ptsp_buku_tamu',
      ];
      if (allowedTables.includes(record.table_name)) {
        const nameCol = record.table_name.includes('siswa') || record.table_name.includes('ijazah')
          ? 'nama_siswa'
          : 'nama';
        const formRow = await this.db.queryOne(
          `SELECT ${nameCol} as applicant_name FROM ${record.table_name} WHERE tracking_token::text = $1 LIMIT 1`,
          [record.tracking_token],
        );
        if (formRow && formRow.applicant_name) {
          applicantName = formRow.applicant_name;
        }
      }
    } catch (e) {
      this.logger.warn(`Could not fetch applicant name: ${e.message}`);
    }

    const rawStatus = parseInt(String(record.status ?? 1), 10);
    const statusCode = isNaN(rawStatus) ? 1 : rawStatus;

    let statusLabel = 'Menunggu Verifikasi';
    let progressPercent = 25;

    if (statusCode === 0) {
      statusLabel = 'Permohonan Ditolak';
      progressPercent = 0;
    } else if (statusCode === 1) {
      statusLabel = 'Menunggu Verifikasi Berkas';
      progressPercent = 25;
    } else if (statusCode === 50) {
      statusLabel = 'Sedang Diproses';
      progressPercent = 65;
    } else if (statusCode === 100) {
      statusLabel = 'Permohonan Selesai / Diterbitkan';
      progressPercent = 100;
    } else {
      statusLabel = `Proses (${statusCode}%)`;
      progressPercent = statusCode;
    }

    // Generate dynamic timeline
    const isRejected = statusCode === 0;
    const isPending = statusCode === 1;
    const isProcessing = statusCode === 50 || (statusCode > 1 && statusCode < 100);
    const isCompleted = statusCode === 100;

    const timeline = [
      {
        title: 'Permohonan Dikirim',
        description: 'Berkas dan formulir berhasil masuk ke sistem PTSP MAN IC Gowa',
        status: 'completed' as const,
        timestamp: record.created_at
          ? new Date(record.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
          : undefined,
      },
      {
        title: 'Verifikasi Berkas',
        description: isPending
          ? 'Petugas PTSP sedang memeriksa kelengkapan persyaratan dokumen'
          : isRejected
          ? 'Pemeriksaan berkas selesai dengan catatan penolakan'
          : 'Berkas dan persyaratan dinyatakan lengkap & valid',
        status: isRejected
          ? ('rejected' as const)
          : isPending
          ? ('current' as const)
          : ('completed' as const),
      },
      {
        title: 'Pemrosesan Dokumen & Disposisi',
        description: isRejected
          ? 'Proses dihentikan karena berkas ditolak'
          : isProcessing
          ? 'Dokumen sedang ditindaklanjuti oleh pimpinan / pihak terkait'
          : isCompleted
          ? 'Selesai ditandatangani dan diverifikasi'
          : 'Menunggu antrean disposisi',
        status: isRejected
          ? ('rejected' as const)
          : isProcessing
          ? ('current' as const)
          : isCompleted
          ? ('completed' as const)
          : ('pending' as const),
        timestamp: record.updated_at && isProcessing
          ? new Date(record.updated_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
          : undefined,
      },
      {
        title: 'Penerbitan / Pengambilan Layanan',
        description: isCompleted
          ? 'Layanan telah selesai. Dokumen dapat diambil di loket PTSP atau diunduh.'
          : isRejected
          ? 'Permohonan tidak dapat diterbitkan.'
          : 'Dokumen fisik / digital siap diserahkan kepada pemohon',
        status: isCompleted
          ? ('completed' as const)
          : isRejected
          ? ('rejected' as const)
          : ('pending' as const),
        timestamp: record.updated_at && isCompleted
          ? new Date(record.updated_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
          : undefined,
      },
    ];

    return {
      ok: true,
      short_code: record.short_code,
      tracking_token: record.tracking_token,
      service_type: record.service_type,
      table_name: record.table_name,
      status_code: statusCode,
      status_label: statusLabel,
      progress_percent: progressPercent,
      catatan_admin: record.catatan_admin || null,
      applicant_masked_name: this.maskName(applicantName),
      created_at: new Date(record.created_at).toISOString(),
      updated_at: new Date(record.updated_at || record.created_at).toISOString(),
      timeline,
    };
  }
}
