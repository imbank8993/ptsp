import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  IsInt,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitSosialisasiDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama lengkap wajib diisi' })
  @MaxLength(60, { message: 'Nama maksimal 60 karakter' })
  nama: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor WhatsApp wajib diisi' })
  @MaxLength(20, { message: 'Nomor WhatsApp maksimal 20 digit' })
  wa: string;

  @IsString()
  @IsNotEmpty({ message: 'Instansi/Lembaga wajib diisi' })
  @MaxLength(80, { message: 'Instansi maksimal 80 karakter' })
  instansi: string;

  @IsString()
  @IsNotEmpty({ message: 'Tujuan kegiatan wajib diisi' })
  @MaxLength(150, { message: 'Tujuan maksimal 150 karakter' })
  tujuan: string;

  @IsString()
  @IsNotEmpty({ message: 'Jenis sosialisasi wajib dipilih' })
  @MaxLength(50)
  jenis: string;

  @IsString()
  @IsNotEmpty({ message: 'Jumlah anggota tim wajib diisi' })
  @MaxLength(30)
  jumlah_tim: string;

  @IsString()
  @IsNotEmpty({ message: 'Rencana pelaksanaan wajib diisi' })
  rencana_waktu: string;

  @IsString()
  @IsNotEmpty({ message: 'Target peserta wajib diisi' })
  @MaxLength(100, { message: 'Target peserta maksimal 100 karakter' })
  target: string;

  @IsString()
  @IsNotEmpty({ message: 'Surat permohonan wajib diunggah' })
  file_url: string;
}

export class SubmitPeminjamanSaranaDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama lengkap wajib diisi' })
  @MaxLength(60)
  nama: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor WhatsApp wajib diisi' })
  @MaxLength(20)
  wa: string;

  @IsString()
  @IsNotEmpty({ message: 'Alamat wajib diisi' })
  @MaxLength(150)
  alamat: string;

  @IsString()
  @IsNotEmpty({ message: 'Jadwal peminjaman mulai wajib diisi' })
  tanggal_mulai: string;

  @IsString()
  @IsOptional()
  tanggal_selesai?: string;

  @IsString()
  @IsNotEmpty({ message: 'Proposal / Surat Permohonan wajib diunggah' })
  file_proposal: string;
}

export class SubmitIzinPenelitianDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama peneliti wajib diisi' })
  @MaxLength(60)
  nama: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor WhatsApp wajib diisi' })
  @MaxLength(20)
  wa: string;

  @IsString()
  @IsNotEmpty({ message: 'Instansi / Kampus wajib diisi' })
  @MaxLength(80)
  instansi: string;

  @IsString()
  @IsNotEmpty({ message: 'Judul penelitian wajib diisi' })
  @MaxLength(150)
  judul_penelitian: string;

  @IsString()
  @IsNotEmpty({ message: 'Tanggal mulai penelitian wajib diisi' })
  tanggal_mulai: string;

  @IsString()
  @IsNotEmpty({ message: 'Tanggal selesai penelitian wajib diisi' })
  tanggal_selesai: string;

  @IsString()
  @IsNotEmpty({ message: 'Surat permohonan izin meneliti wajib diunggah' })
  file_proposal: string;
}

export class SubmitLegalisirDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama pemohon wajib diisi' })
  @MaxLength(60)
  nama: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor WhatsApp wajib diisi' })
  @MaxLength(20)
  wa: string;

  @IsString()
  @IsNotEmpty({ message: 'Jenis dokumen wajib dipilih' })
  jenis_dokumen: string;

  @Type(() => Number)
  @IsInt({ message: 'Jumlah lembar harus berupa angka bulat' })
  @Min(1, { message: 'Jumlah lembar minimal 1' })
  @Max(50, { message: 'Jumlah lembar maksimal 50 per permohonan' })
  jumlah_lembar: number;

  @IsString()
  @IsNotEmpty({ message: 'Scan dokumen asli wajib diunggah' })
  file_dokumen: string;
}

export class SubmitPenggantiIjazahDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama lengkap siswa wajib diisi' })
  @MaxLength(60)
  nama_siswa: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor WhatsApp aktif wajib diisi' })
  @MaxLength(20)
  wa: string;

  @IsString()
  @IsNotEmpty({ message: 'Tempat lahir wajib diisi' })
  @MaxLength(40)
  tempat_lahir: string;

  @IsString()
  @IsNotEmpty({ message: 'Tanggal lahir wajib diisi' })
  tanggal_lahir: string;

  @IsString()
  @IsNotEmpty({ message: 'Alamat lengkap wajib diisi' })
  @MaxLength(150)
  alamat: string;

  @IsString()
  @IsNotEmpty({ message: 'NISN wajib diisi' })
  @MaxLength(10, { message: 'NISN maksimal 10 digit' })
  nisn: string;

  @IsString()
  @IsOptional()
  file_copy_ijazah?: string;

  @IsString()
  @IsOptional()
  file_copy_ktp?: string;

  @IsString()
  @IsOptional()
  file_pas_foto?: string;

  @IsString()
  @IsOptional()
  file_surat_kehilangan?: string;
}

export class SubmitIzinMagangDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama pemohon wajib diisi' })
  @MaxLength(60)
  nama: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor WhatsApp wajib diisi' })
  @MaxLength(20)
  wa: string;

  @IsString()
  @IsNotEmpty({ message: 'Sekolah/Kampus wajib diisi' })
  @MaxLength(100)
  sekolah_kampus: string;

  @IsString()
  @IsNotEmpty({ message: 'Jurusan wajib diisi' })
  @MaxLength(100)
  jurusan: string;

  @IsString()
  @IsNotEmpty({ message: 'Tanggal mulai wajib diisi' })
  tanggal_mulai: string;

  @IsString()
  @IsNotEmpty({ message: 'Tanggal selesai wajib diisi' })
  tanggal_selesai: string;

  @IsString()
  @IsOptional()
  file_surat_pengantar?: string;
}

export class SubmitMutasiSiswaDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama siswa wajib diisi' })
  @MaxLength(60)
  nama_siswa: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor WhatsApp orang tua/wali wajib diisi' })
  @MaxLength(20)
  wa: string;

  @IsString()
  @IsNotEmpty({ message: 'Tempat lahir wajib diisi' })
  @MaxLength(40)
  tempat_lahir: string;

  @IsString()
  @IsNotEmpty({ message: 'Tanggal lahir wajib diisi' })
  tanggal_lahir: string;

  @IsString()
  @IsIn(['Laki-laki', 'Perempuan'], { message: 'Jenis kelamin harus Laki-laki atau Perempuan' })
  jenis_kelamin: string;

  @IsString()
  @IsNotEmpty({ message: 'NISN wajib diisi' })
  @MaxLength(10)
  nisn: string;

  @IsString()
  @IsNotEmpty({ message: 'Kelas siswa wajib diisi' })
  @MaxLength(20)
  kelas: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama ibu kandung wajib diisi' })
  @MaxLength(60)
  nama_ibu: string;

  @IsString()
  @IsNotEmpty({ message: 'Alasan pindah wajib diisi' })
  @MaxLength(255)
  alasan_pindah: string;

  @IsString()
  @IsOptional()
  file_permohonan_ortu?: string;

  @IsString()
  @IsOptional()
  file_rekomendasi_tujuan?: string;
}

export class SubmitPengaduanDto {
  @IsString()
  @IsOptional()
  @MaxLength(60)
  nama?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  wa?: string;

  @IsString()
  @IsNotEmpty({ message: 'Jenis laporan wajib dipilih' })
  @MaxLength(50)
  jenis_laporan: string;

  @IsString()
  @IsNotEmpty({ message: 'Isi laporan wajib diisi' })
  isi_laporan: string;

  @IsString()
  @IsOptional()
  file_bukti?: string;
}

export class SubmitIzinSiswaDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama siswa wajib diisi' })
  @MaxLength(60)
  nama: string;

  @IsString()
  @IsNotEmpty({ message: 'Kelas siswa wajib diisi' })
  @MaxLength(20)
  kelas: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  wa?: string;

  @IsString()
  @IsIn(['Sakit', 'Izin', 'Lainnya'], { message: 'Alasan izin harus Sakit, Izin, atau Lainnya' })
  alasan: 'Sakit' | 'Izin' | 'Lainnya';

  @IsString()
  @IsOptional()
  alasan_lainnya?: string;

  @IsString()
  @IsOptional()
  keterangan?: string;

  @IsString()
  @IsNotEmpty({ message: 'Tanggal mulai wajib diisi' })
  tanggal_mulai: string;

  @IsString()
  @IsNotEmpty({ message: 'Tanggal selesai wajib diisi' })
  tanggal_selesai: string;
}

export class SubmitBukuTamuDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama lengkap tamu wajib diisi' })
  @MaxLength(60)
  nama: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  wa?: string;

  @IsString()
  @IsOptional()
  @MaxLength(80)
  instansi?: string;

  @IsString()
  @IsOptional()
  @MaxLength(80)
  bertemu_dengan?: string;

  @IsString()
  @IsNotEmpty({ message: 'Tujuan kunjungan wajib diisi' })
  @MaxLength(255)
  tujuan: string;
}
