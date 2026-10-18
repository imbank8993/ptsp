'use client';

import React, { useState } from 'react';
import { Send, ShieldAlert } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';
import { submitPtspForm } from '@/lib/api';
import { SubmissionResponse } from '@/types';

interface PengaduanFormProps {
  onSuccess: (data: SubmissionResponse) => void;
  onProgressChange: (percent: number) => void;
}

export default function PengaduanForm({
  onSuccess,
  onProgressChange,
}: PengaduanFormProps) {
  const [formData, setFormData] = useState({
    nama: '',
    wa: '',
    jenis_laporan: '',
    isi_laporan: '',
    file_bukti: '',
  });

  const [isAnonim, setIsAnonim] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateProgress = (data: typeof formData) => {
    let filled = 0;
    const requiredKeys: (keyof typeof formData)[] = ['jenis_laporan', 'isi_laporan'];
    requiredKeys.forEach((k) => {
      if (data[k]?.trim()) filled++;
    });
    const pct = Math.round((filled / requiredKeys.length) * 100);
    onProgressChange(pct);
    return pct;
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    calculateProgress(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setLoading(true);
    try {
      const payload = {
        ...formData,
        nama: isAnonim ? 'Anonim' : formData.nama || 'Anonim',
      };
      const res = await submitPtspForm('pengaduan', payload);
      onSuccess({
        ...res,
        applicant_name: isAnonim ? 'Anonim (Dirahasiakan)' : (formData.nama || 'Masyarakat'),
        applicant_phone: formData.wa,
      });
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim laporan pengaduan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Privacy Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-3 text-amber-800 text-xs">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
        <div>
          <span className="font-bold">Kerahasiaan Identitas Dijamin:</span> Layanan pengaduan PTSP MAN Insan Cendekia Gowa bersifat rahasia dan aman. Anda diperkenankan mengirimkan aspirasi secara anonim.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Nama Pelapor */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">Nama Pelapor</label>
            <div className="flex items-center gap-1.5">
              <input
                type="checkbox"
                id="anonim"
                checked={isAnonim}
                onChange={(e) => {
                  setIsAnonim(e.target.checked);
                  if (e.target.checked) handleChange('nama', 'Anonim');
                  else handleChange('nama', '');
                }}
                className="rounded text-[#2B60DE] accent-[#2B60DE] cursor-pointer"
              />
              <label htmlFor="anonim" className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold cursor-pointer">
                Kirim Anonim
              </label>
            </div>
          </div>
          <input
            type="text"
            disabled={isAnonim}
            maxLength={60}
            value={isAnonim ? 'Anonim' : formData.nama}
            onChange={(e) => handleChange('nama', e.target.value)}
            placeholder={isAnonim ? 'Pengirim Anonim' : 'Contoh: H. Ahmad Subardjo'}
            className="ptsp-input disabled:opacity-50"
          />
        </div>

        {/* No. WhatsApp */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">No. WhatsApp (Opsional)</label>
            <span className="char-counter">{formData.wa.length}/20</span>
          </div>
          <input
            type="tel"
            maxLength={20}
            value={formData.wa}
            onChange={(e) => handleChange('wa', e.target.value)}
            placeholder="Untuk menerima kabar tindak lanjut"
            className="ptsp-input"
          />
        </div>

        {/* Jenis Pengaduan */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Jenis Laporan / Pengaduan <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.jenis_laporan}
            onChange={(e) => handleChange('jenis_laporan', e.target.value)}
            className="ptsp-input bg-transparent cursor-pointer"
          >
            <option value="">Pilih klasifikasi pengaduan</option>
            <option value="Pelayanan Akademik & Guru">Pelayanan Akademik & Proses Belajar Mengajar</option>
            <option value="Sarana & Prasarana">Fasilitas, Sarana & Prasarana Madrasah</option>
            <option value="Asrama & Kedisiplinan">Kehidupan Asrama & Kedisiplinan Siswa</option>
            <option value="Kebersihan & Kantin">Kebersihan Lingkungan & Layanan Konsumsi/Kantin</option>
            <option value="Keamanan & Ketertiban">Keamanan, Kenyamanan & Ketertiban Kampus</option>
            <option value="Aspirasi & Saran">Aspirasi, Saran & Masukan Umum</option>
          </select>
        </div>

        {/* Isi Laporan */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Uraian Pengaduan / Aspirasi <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={formData.isi_laporan}
            onChange={(e) => handleChange('isi_laporan', e.target.value)}
            placeholder="Jelaskan secara rinci permasalahan, waktu, lokasi, dan kronologi kejadian..."
            className="ptsp-textarea"
          />
        </div>
      </div>

      {/* File Bukti */}
      <div className="pt-2">
        <FileUpload
          label="LAMPIRAN BUKTI DOKUMENTASI / FOTO (OPSIONAL)"
          helperText="Upload foto bukti / PDF pendukung (Opsional)"
          subfolder="pengaduan"
          value={formData.file_bukti}
          onChange={(url) => handleChange('file_bukti', url)}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="ptsp-btn-submit"
      >
        <Send className="w-4 h-4" />
        <span>{loading ? 'Mengirim Laporan...' : 'Kirim Laporan Pengaduan'}</span>
      </button>
    </form>
  );
}
