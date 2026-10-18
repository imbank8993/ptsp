import {
  Controller,
  Post,
  Get,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PtspService } from './ptsp.service';
import { R2StorageService } from '../storage/r2-storage.service';
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

@Controller('ptsp')
export class PtspController {
  constructor(
    private readonly ptspService: PtspService,
    private readonly storageService: R2StorageService,
  ) {}

  @Get('services')
  getServices() {
    return {
      ok: true,
      services: [
        {
          id: 'buku-tamu',
          title: 'Buku Tamu Digital',
          subtitle: 'CATATAN KUNJUNGAN TAMU DIGITAL',
          icon: 'book',
          color: '#0891b2',
        },
        {
          id: 'sosialisasi',
          title: 'Pengajuan Sosialisasi',
          subtitle: 'PERMOHONAN KUNJUNGAN & SOSIALISASI',
          icon: 'megaphone',
          color: '#ea580c',
        },
        {
          id: 'izin-siswa',
          title: 'Izin Siswa Asrama',
          subtitle: 'IZIN PULANG ATAU KELUAR SISWA',
          icon: 'home',
          color: '#059669',
        },
        {
          id: 'peminjaman-sarana',
          title: 'Peminjaman Sarana',
          subtitle: 'PINJAM SARANA DAN PRASARANA',
          icon: 'truck',
          color: '#0891b2',
        },
        {
          id: 'izin-penelitian',
          title: 'Izin Penelitian',
          subtitle: 'RISET & PENGAMBILAN DATA',
          icon: 'microscope',
          color: '#3083FF',
        },
        {
          id: 'legalisir',
          title: 'Layanan Legalisir',
          subtitle: 'LEGALISIR IJAZAH & RAPOR ONLINE',
          icon: 'file-text',
          color: '#dc2626',
        },
        {
          id: 'ganti-ijazah',
          title: 'Ganti Ijazah Hilang',
          subtitle: 'SURAT KETERANGAN GANTI IJAZAH',
          icon: 'graduation-cap',
          color: '#db2777',
        },
        {
          id: 'izin-magang',
          title: 'Permohonan Magang',
          subtitle: 'PENGAJUAN PRAKTEK / MAGANG',
          icon: 'briefcase',
          color: '#d97706',
        },
        {
          id: 'mutasi-siswa',
          title: 'Mutasi Keluar Siswa',
          subtitle: 'PINDAH SEKOLAH KELUAR',
          icon: 'arrow-left-right',
          color: '#3083FF',
        },
        {
          id: 'pengaduan',
          title: 'Pengaduan Masyarakat',
          subtitle: 'LAYANAN PENGADUAN & ASPIRASI',
          icon: 'alert-circle',
          color: '#dc2626',
        },
      ],
    };
  }

  /**
   * Upload file to Cloudflare R2 under folder PTSP
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('subfolder') subfolder = 'documents',
  ) {
    if (!file) {
      throw new BadRequestException('Berkas tidak ditemukan dalam permintaan unggah.');
    }

    const res = await this.storageService.uploadFile(
      file.buffer,
      file.originalname,
      subfolder,
      10, // Max 10MB
    );

    return {
      ok: true,
      message: 'Berkas berhasil diunggah',
      ...res,
    };
  }

  // 1. SOSIALISASI
  @Post('submit/sosialisasi')
  submitSosialisasi(@Body() dto: SubmitSosialisasiDto) {
    return this.ptspService.submitSosialisasi(dto);
  }

  // 2. PEMINJAMAN SARANA
  @Post('submit/peminjaman-sarana')
  submitPeminjamanSarana(@Body() dto: SubmitPeminjamanSaranaDto) {
    return this.ptspService.submitPeminjamanSarana(dto);
  }

  // 3. IZIN PENELITIAN
  @Post('submit/izin-penelitian')
  submitIzinPenelitian(@Body() dto: SubmitIzinPenelitianDto) {
    return this.ptspService.submitIzinPenelitian(dto);
  }

  // 4. LAYANAN LEGALISIR
  @Post('submit/legalisir')
  submitLegalisir(@Body() dto: SubmitLegalisirDto) {
    return this.ptspService.submitLegalisir(dto);
  }

  // 5. GANTI IJAZAH HILANG
  @Post('submit/pengganti-ijazah')
  submitPenggantiIjazah(@Body() dto: SubmitPenggantiIjazahDto) {
    return this.ptspService.submitPenggantiIjazah(dto);
  }

  // 6. PERMOHONAN MAGANG
  @Post('submit/izin-magang')
  submitIzinMagang(@Body() dto: SubmitIzinMagangDto) {
    return this.ptspService.submitIzinMagang(dto);
  }

  // 7. MUTASI SISWA
  @Post('submit/mutasi-siswa')
  submitMutasiSiswa(@Body() dto: SubmitMutasiSiswaDto) {
    return this.ptspService.submitMutasiSiswa(dto);
  }

  // 8. PENGADUAN MASYARAKAT
  @Post('submit/pengaduan')
  submitPengaduan(@Body() dto: SubmitPengaduanDto) {
    return this.ptspService.submitPengaduan(dto);
  }

  // 9. IZIN SISWA ASRAMA
  @Post('submit/izin-siswa')
  submitIzinSiswa(@Body() dto: SubmitIzinSiswaDto) {
    return this.ptspService.submitIzinSiswa(dto);
  }

  // 10. BUKU TAMU DIGITAL
  @Post('submit/buku-tamu')
  submitBukuTamu(@Body() dto: SubmitBukuTamuDto) {
    return this.ptspService.submitBukuTamu(dto);
  }
}
