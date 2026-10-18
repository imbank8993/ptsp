import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import {
  SubmitSosialisasiDto,
  SubmitPeminjamanSaranaDto,
  SubmitIzinPenelitianDto,
  SubmitLegalisirDto,
  SubmitPenggantiIjazahDto,
  SubmitIzinMagangDto,
  SubmitMutasiSiswaDto,
  SubmitPengaduanDto,
  SubmitIzinSiswaDto,
  SubmitBukuTamuDto,
} from './dto/ptsp-submissions.dto';

export interface SubmissionResult {
  ok: boolean;
  tracking_token: string;
  short_code: string;
  service_type: string;
  created_at: string;
  message: string;
}

@Injectable()
export class PtspService {
  private readonly logger = new Logger(PtspService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Generates a collision-resistant human-readable short code (e.g. PTSP-A8X92K)
   */
  private async generateUniqueShortCode(): Promise<string> {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // base32 without confusing 0/O, 1/I
    for (let attempt = 0; attempt < 5; attempt++) {
      let code = 'PTSP-';
      const randomBytes = crypto.randomBytes(6);
      for (let i = 0; i < 6; i++) {
        code += chars[randomBytes[i] % chars.length];
      }

      // Check for collision in ptsp_master_tracking
      const existing = await this.db.queryOne(
        'SELECT id FROM ptsp_master_tracking WHERE short_code = $1',
        [code],
      );
      if (!existing) {
        return code;
      }
    }
    // Fallback timestamp code
    return `PTSP-${Date.now().toString(36).toUpperCase()}`;
  }

  // 1. SOSIALISASI
  async submitSosialisasi(dto: SubmitSosialisasiDto): Promise<SubmissionResult> {
    const tracking_token = uuidv4();
    const short_code = await this.generateUniqueShortCode();
    const service_type = 'Pengajuan Sosialisasi';
    const table_name = 'ptsp_sosialisasi';

    await this.db.transaction(async (client) => {
      const sqlForm = `
        INSERT INTO ptsp_sosialisasi (
          nama, wa, instansi, jenis, tujuan, target, jumlah_tim, rencana_waktu,
          file_url, tracking_token, status, created_at, updated_at, storage_type
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, 1, timezone('utc'::text, now()), timezone('utc'::text, now()), 'cloudflare_r2'
        )
      `;
      await client.query(sqlForm, [
        dto.nama,
        dto.wa,
        dto.instansi,
        dto.jenis,
        dto.tujuan,
        dto.target,
        dto.jumlah_tim,
        dto.rencana_waktu ? new Date(dto.rencana_waktu) : null,
        dto.file_url,
        tracking_token,
      ]);

      const sqlTrack = `
        INSERT INTO ptsp_master_tracking (
          tracking_token, short_code, no_wa, service_type, table_name, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, 1, timezone('utc'::text, now()), timezone('utc'::text, now())
        )
      `;
      await client.query(sqlTrack, [tracking_token, short_code, dto.wa, service_type, table_name]);
    });

    return {
      ok: true,
      tracking_token,
      short_code,
      service_type,
      created_at: new Date().toISOString(),
      message: 'Permohonan Pengajuan Sosialisasi berhasil dikirim!',
    };
  }

  // 2. PEMINJAMAN SARANA
  async submitPeminjamanSarana(dto: SubmitPeminjamanSaranaDto): Promise<SubmissionResult> {
    const tracking_token = uuidv4();
    const short_code = await this.generateUniqueShortCode();
    const service_type = 'Peminjaman Sarana';
    const table_name = 'ptsp_peminjaman_sarana';

    await this.db.transaction(async (client) => {
      const sqlForm = `
        INSERT INTO ptsp_peminjaman_sarana (
          nama, wa, alamat, file_proposal, tanggal_mulai, tanggal_selesai,
          tracking_token, status, created_at, updated_at, storage_type
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, 1, timezone('utc'::text, now()), timezone('utc'::text, now()), 'cloudflare_r2'
        )
      `;
      await client.query(sqlForm, [
        dto.nama,
        dto.wa,
        dto.alamat,
        dto.file_proposal,
        dto.tanggal_mulai ? new Date(dto.tanggal_mulai) : null,
        dto.tanggal_selesai ? new Date(dto.tanggal_selesai) : null,
        tracking_token,
      ]);

      const sqlTrack = `
        INSERT INTO ptsp_master_tracking (
          tracking_token, short_code, no_wa, service_type, table_name, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, 1, timezone('utc'::text, now()), timezone('utc'::text, now())
        )
      `;
      await client.query(sqlTrack, [tracking_token, short_code, dto.wa, service_type, table_name]);
    });

    return {
      ok: true,
      tracking_token,
      short_code,
      service_type,
      created_at: new Date().toISOString(),
      message: 'Permohonan Peminjaman Sarana berhasil dikirim!',
    };
  }

  // 3. IZIN PENELITIAN
  async submitIzinPenelitian(dto: SubmitIzinPenelitianDto): Promise<SubmissionResult> {
    const tracking_token = uuidv4();
    const short_code = await this.generateUniqueShortCode();
    const service_type = 'Izin Penelitian';
    const table_name = 'ptsp_izin_penelitian';

    await this.db.transaction(async (client) => {
      const sqlForm = `
        INSERT INTO ptsp_izin_penelitian (
          nama, wa, instansi, instansi_sekolah, judul_penelitian, tanggal_mulai, tanggal_selesai,
          file_proposal, tracking_token, status, created_at, updated_at, storage_type
        ) VALUES (
          $1, $2, $3, $3, $4, $5, $6,
          $7, $8, 1, timezone('utc'::text, now()), timezone('utc'::text, now()), 'cloudflare_r2'
        )
      `;
      await client.query(sqlForm, [
        dto.nama,
        dto.wa,
        dto.instansi,
        dto.judul_penelitian,
        dto.tanggal_mulai,
        dto.tanggal_selesai,
        dto.file_proposal,
        tracking_token,
      ]);

      const sqlTrack = `
        INSERT INTO ptsp_master_tracking (
          tracking_token, short_code, no_wa, service_type, table_name, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, 1, timezone('utc'::text, now()), timezone('utc'::text, now())
        )
      `;
      await client.query(sqlTrack, [tracking_token, short_code, dto.wa, service_type, table_name]);
    });

    return {
      ok: true,
      tracking_token,
      short_code,
      service_type,
      created_at: new Date().toISOString(),
      message: 'Permohonan Izin Penelitian berhasil dikirim!',
    };
  }

  // 4. LAYANAN LEGALISIR
  async submitLegalisir(dto: SubmitLegalisirDto): Promise<SubmissionResult> {
    const tracking_token = uuidv4();
    const short_code = await this.generateUniqueShortCode();
    const service_type = 'Layanan Legalisir';
    const table_name = 'ptsp_legalisir';

    await this.db.transaction(async (client) => {
      const sqlForm = `
        INSERT INTO ptsp_legalisir (
          nama, wa, jenis_dokumen, jumlah_lembar, file_dokumen,
          tracking_token, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, 1, timezone('utc'::text, now()), timezone('utc'::text, now())
        )
      `;
      await client.query(sqlForm, [
        dto.nama,
        dto.wa,
        dto.jenis_dokumen,
        dto.jumlah_lembar || 1,
        dto.file_dokumen,
        tracking_token,
      ]);

      const sqlTrack = `
        INSERT INTO ptsp_master_tracking (
          tracking_token, short_code, no_wa, service_type, table_name, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, 1, timezone('utc'::text, now()), timezone('utc'::text, now())
        )
      `;
      await client.query(sqlTrack, [tracking_token, short_code, dto.wa, service_type, table_name]);
    });

    return {
      ok: true,
      tracking_token,
      short_code,
      service_type,
      created_at: new Date().toISOString(),
      message: 'Permohonan Layanan Legalisir berhasil dikirim!',
    };
  }

  // 5. GANTI IJAZAH HILANG
  async submitPenggantiIjazah(dto: SubmitPenggantiIjazahDto): Promise<SubmissionResult> {
    const tracking_token = uuidv4();
    const short_code = await this.generateUniqueShortCode();
    const service_type = 'Ganti Ijazah Hilang';
    const table_name = 'ptsp_pengganti_ijazah';

    await this.db.transaction(async (client) => {
      const sqlForm = `
        INSERT INTO ptsp_pengganti_ijazah (
          nama_siswa, wa, tempat_lahir, tanggal_lahir, alamat, nisn,
          file_copy_ijazah, file_copy_ktp, file_pas_foto, file_surat_kehilangan,
          tracking_token, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, 1, timezone('utc'::text, now()), timezone('utc'::text, now())
        )
      `;
      await client.query(sqlForm, [
        dto.nama_siswa,
        dto.wa,
        dto.tempat_lahir,
        dto.tanggal_lahir,
        dto.alamat,
        dto.nisn,
        dto.file_copy_ijazah || null,
        dto.file_copy_ktp || null,
        dto.file_pas_foto || null,
        dto.file_surat_kehilangan || null,
        tracking_token,
      ]);

      const sqlTrack = `
        INSERT INTO ptsp_master_tracking (
          tracking_token, short_code, no_wa, service_type, table_name, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, 1, timezone('utc'::text, now()), timezone('utc'::text, now())
        )
      `;
      await client.query(sqlTrack, [tracking_token, short_code, dto.wa, service_type, table_name]);
    });

    return {
      ok: true,
      tracking_token,
      short_code,
      service_type,
      created_at: new Date().toISOString(),
      message: 'Permohonan Pengganti Ijazah Hilang berhasil dikirim!',
    };
  }

  // 6. PERMOHONAN MAGANG
  async submitIzinMagang(dto: SubmitIzinMagangDto): Promise<SubmissionResult> {
    const tracking_token = uuidv4();
    const short_code = await this.generateUniqueShortCode();
    const service_type = 'Permohonan Magang';
    const table_name = 'ptsp_izin_magang';

    await this.db.transaction(async (client) => {
      const sqlForm = `
        INSERT INTO ptsp_izin_magang (
          nama, wa, sekolah_kampus, jurusan, tanggal_mulai, tanggal_selesai,
          file_surat_pengantar, tracking_token, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, 1, timezone('utc'::text, now()), timezone('utc'::text, now())
        )
      `;
      await client.query(sqlForm, [
        dto.nama,
        dto.wa,
        dto.sekolah_kampus,
        dto.jurusan,
        dto.tanggal_mulai,
        dto.tanggal_selesai,
        dto.file_surat_pengantar || null,
        tracking_token,
      ]);

      const sqlTrack = `
        INSERT INTO ptsp_master_tracking (
          tracking_token, short_code, no_wa, service_type, table_name, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, 1, timezone('utc'::text, now()), timezone('utc'::text, now())
        )
      `;
      await client.query(sqlTrack, [tracking_token, short_code, dto.wa, service_type, table_name]);
    });

    return {
      ok: true,
      tracking_token,
      short_code,
      service_type,
      created_at: new Date().toISOString(),
      message: 'Permohonan Izin Magang berhasil dikirim!',
    };
  }

  // 7. MUTASI SISWA
  async submitMutasiSiswa(dto: SubmitMutasiSiswaDto): Promise<SubmissionResult> {
    const tracking_token = uuidv4();
    const short_code = await this.generateUniqueShortCode();
    const service_type = 'Mutasi Keluar Siswa';
    const table_name = 'ptsp_mutasi_siswa';

    await this.db.transaction(async (client) => {
      const sqlForm = `
        INSERT INTO ptsp_mutasi_siswa (
          nama_siswa, tempat_lahir, tanggal_lahir, jenis_kelamin, nisn, kelas,
          nama_ibu, alasan_pindah, wa, file_permohonan_ortu, file_rekomendasi_tujuan,
          tracking_token, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11,
          $12, 1, timezone('utc'::text, now()), timezone('utc'::text, now())
        )
      `;
      await client.query(sqlForm, [
        dto.nama_siswa,
        dto.tempat_lahir,
        dto.tanggal_lahir,
        dto.jenis_kelamin,
        dto.nisn,
        dto.kelas,
        dto.nama_ibu,
        dto.alasan_pindah,
        dto.wa,
        dto.file_permohonan_ortu || null,
        dto.file_rekomendasi_tujuan || null,
        tracking_token,
      ]);

      const sqlTrack = `
        INSERT INTO ptsp_master_tracking (
          tracking_token, short_code, no_wa, service_type, table_name, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, 1, timezone('utc'::text, now()), timezone('utc'::text, now())
        )
      `;
      await client.query(sqlTrack, [tracking_token, short_code, dto.wa, service_type, table_name]);
    });

    return {
      ok: true,
      tracking_token,
      short_code,
      service_type,
      created_at: new Date().toISOString(),
      message: 'Permohonan Mutasi Keluar Siswa berhasil dikirim!',
    };
  }

  // 8. PENGADUAN MASYARAKAT
  async submitPengaduan(dto: SubmitPengaduanDto): Promise<SubmissionResult> {
    const tracking_token = uuidv4();
    const short_code = await this.generateUniqueShortCode();
    const service_type = 'Pengaduan Masyarakat';
    const table_name = 'ptsp_pengaduan';

    await this.db.transaction(async (client) => {
      const sqlForm = `
        INSERT INTO ptsp_pengaduan (
          nama, wa, jenis_laporan, isi_laporan, file_bukti,
          tracking_token, status, created_at, updated_at, storage_type
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, 1, timezone('utc'::text, now()), timezone('utc'::text, now()), 'cloudflare_r2'
        )
      `;
      await client.query(sqlForm, [
        dto.nama || 'Anonim',
        dto.wa || null,
        dto.jenis_laporan,
        dto.isi_laporan,
        dto.file_bukti || null,
        tracking_token,
      ]);

      const sqlTrack = `
        INSERT INTO ptsp_master_tracking (
          tracking_token, short_code, no_wa, service_type, table_name, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, 1, timezone('utc'::text, now()), timezone('utc'::text, now())
        )
      `;
      await client.query(sqlTrack, [
        tracking_token,
        short_code,
        dto.wa || '0000000000',
        service_type,
        table_name,
      ]);
    });

    return {
      ok: true,
      tracking_token,
      short_code,
      service_type,
      created_at: new Date().toISOString(),
      message: 'Laporan Pengaduan Masyarakat berhasil dikirim!',
    };
  }

  // 9. IZIN SISWA ASRAMA
  async submitIzinSiswa(dto: SubmitIzinSiswaDto): Promise<SubmissionResult> {
    const tracking_token = uuidv4();
    const short_code = await this.generateUniqueShortCode();
    const service_type = 'Izin Siswa Asrama';
    const table_name = 'ptsp_izin_siswa';

    await this.db.transaction(async (client) => {
      const sqlForm = `
        INSERT INTO ptsp_izin_siswa (
          nama, kelas, wa, alasan, alasan_lainnya, keterangan,
          tanggal_mulai, tanggal_selesai, tracking_token, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, 1, timezone('utc'::text, now()), timezone('utc'::text, now())
        )
      `;
      await client.query(sqlForm, [
        dto.nama,
        dto.kelas,
        dto.wa || null,
        dto.alasan,
        dto.alasan_lainnya || null,
        dto.keterangan || null,
        dto.tanggal_mulai,
        dto.tanggal_selesai,
        tracking_token,
      ]);

      const sqlTrack = `
        INSERT INTO ptsp_master_tracking (
          tracking_token, short_code, no_wa, service_type, table_name, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, 1, timezone('utc'::text, now()), timezone('utc'::text, now())
        )
      `;
      await client.query(sqlTrack, [
        tracking_token,
        short_code,
        dto.wa || '0000000000',
        service_type,
        table_name,
      ]);
    });

    return {
      ok: true,
      tracking_token,
      short_code,
      service_type,
      created_at: new Date().toISOString(),
      message: 'Permohonan Izin Siswa Asrama berhasil dikirim!',
    };
  }

  // 10. BUKU TAMU DIGITAL
  async submitBukuTamu(dto: SubmitBukuTamuDto): Promise<SubmissionResult> {
    const tracking_token = uuidv4();
    const short_code = await this.generateUniqueShortCode();
    const service_type = 'Buku Tamu Digital';
    const table_name = 'ptsp_buku_tamu';

    await this.db.transaction(async (client) => {
      const sqlForm = `
        INSERT INTO ptsp_buku_tamu (
          nama, wa, instansi, tujuan, bertemu_dengan,
          tracking_token, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, 100, timezone('utc'::text, now()), timezone('utc'::text, now())
        )
      `;
      await client.query(sqlForm, [
        dto.nama,
        dto.wa || null,
        dto.instansi || null,
        dto.tujuan,
        dto.bertemu_dengan || null,
        tracking_token,
      ]);

      const sqlTrack = `
        INSERT INTO ptsp_master_tracking (
          tracking_token, short_code, no_wa, service_type, table_name, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, 100, timezone('utc'::text, now()), timezone('utc'::text, now())
        )
      `;
      await client.query(sqlTrack, [
        tracking_token,
        short_code,
        dto.wa || '0000000000',
        service_type,
        table_name,
      ]);
    });

    return {
      ok: true,
      tracking_token,
      short_code,
      service_type,
      created_at: new Date().toISOString(),
      message: 'Catatan Kunjungan Buku Tamu berhasil disimpan!',
    };
  }
}
