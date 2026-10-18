'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';
import { submitPtspForm } from '@/lib/api';
import { SubmissionResponse } from '@/types';

interface MutasiSiswaFormProps {
  onSuccess: (data: SubmissionResponse) => void;
  onProgressChange: (percent: number) => void;
}

export default function MutasiSiswaForm({
  onSuccess,
  onProgressChange,
}: MutasiSiswaFormProps) {
  const [formData, setFormData] = useState({
    nama_siswa: '',
    wa: '',
    nisn: '',
    kelas: '',
    jenis_kelamin: 'Laki-laki',
    tempat_lahir: '',
    tanggal_lahir: '',
    nama_ibu: '',
    alasan_pindah: '',
    file_permohonan_ortu: '',
    file_rekomendasi_tujuan: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateProgress = (data: typeof formData) => {
    let filled = 0;
    const requiredKeys: (keyof typeof formData)[] = [
      'nama_siswa',
      'wa',
      'nisn',
      'kelas',
      'jenis_kelamin',
      'tempat_lahir',
      'tanggal_lahir',
      'nama_ibu',
      'alasan_pindah',
      'file_permohonan_ortu',
    ];
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

    if (!formData.file_permohonan_ortu) {
      setError('Surat Permohonan Mutasi dari Orang Tua wajib diunggah.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitPtspForm('mutasi-siswa', formData);
      onSuccess(res);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim permohonan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Nama Siswa */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              Nama Lengkap Siswa <span className="text-red-500">*</span>
            </label>
            <span className="char-counter">{formData.nama_siswa.length}/60</span>
          </div>
          <input
            type="text"
            required
            maxLength={60}
            value={formData.nama_siswa}
            onChange={(e) => handleChange('nama_siswa', e.target.value)}
            placeholder="Contoh: Muhammad Rayhan Pratama"
            className="ptsp-input"
          />
        </div>

        {/* No. WhatsApp Orang Tua */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              No. WhatsApp Orang Tua / Wali <span className="text-red-500">*</span>
            </label>
            <span className="char-counter">{formData.wa.length}/20</span>
          </div>
          <input
            type="tel"
            required
            maxLength={20}
            value={formData.wa}
            onChange={(e) => handleChange('wa', e.target.value)}
            placeholder="Contoh: 081234567890"
            className="ptsp-input"
          />
        </div>

        {/* NISN */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              NISN <span className="text-red-500">*</span>
            </label>
            <span className="char-counter">{formData.nisn.length}/10</span>
          </div>
          <input
            type="text"
            required
            maxLength={10}
            value={formData.nisn}
            onChange={(e) => handleChange('nisn', e.target.value)}
            placeholder="Contoh: 0071234567"
            className="ptsp-input"
          />
        </div>

        {/* Kelas */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Kelas Siswa Saat Ini <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={20}
            value={formData.kelas}
            onChange={(e) => handleChange('kelas', e.target.value)}
            placeholder="Contoh: X-1 atau XI MIPA 2"
            className="ptsp-input"
          />
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Jenis Kelamin <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.jenis_kelamin}
            onChange={(e) => handleChange('jenis_kelamin', e.target.value)}
            className="ptsp-input bg-transparent cursor-pointer"
          >
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        {/* Nama Ibu Kandung */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              Nama Ibu Kandung <span className="text-red-500">*</span>
            </label>
            <span className="char-counter">{formData.nama_ibu.length}/60</span>
          </div>
          <input
            type="text"
            required
            maxLength={60}
            value={formData.nama_ibu}
            onChange={(e) => handleChange('nama_ibu', e.target.value)}
            placeholder="Contoh: Siti Nurhaliza"
            className="ptsp-input"
          />
        </div>

        {/* Tempat Lahir */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              Tempat Lahir <span className="text-red-500">*</span>
            </label>
            <span className="char-counter">{formData.tempat_lahir.length}/40</span>
          </div>
          <input
            type="text"
            required
            maxLength={40}
            value={formData.tempat_lahir}
            onChange={(e) => handleChange('tempat_lahir', e.target.value)}
            placeholder="Contoh: Gowa"
            className="ptsp-input"
          />
        </div>

        {/* Tanggal Lahir */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tanggal Lahir <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            required
            value={formData.tanggal_lahir}
            onChange={(e) => handleChange('tanggal_lahir', e.target.value)}
            className="ptsp-input"
          />
        </div>

        {/* Alasan Pindah */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              Alasan Pindah Sekolah <span className="text-red-500">*</span>
            </label>
            <span className="char-counter">{formData.alasan_pindah.length}/255</span>
          </div>
          <input
            type="text"
            required
            maxLength={255}
            value={formData.alasan_pindah}
            onChange={(e) => handleChange('alasan_pindah', e.target.value)}
            placeholder="Contoh: Mengikuti perpindahan tugas orang tua ke Jakarta"
            className="ptsp-input"
          />
        </div>
      </div>

      {/* Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <FileUpload
          label="SURAT PERMOHONAN MUTASI DARI ORANG TUA"
          helperText="Upload surat permohonan bermaterai (PDF)"
          subfolder="mutasi"
          required
          value={formData.file_permohonan_ortu}
          onChange={(url) => handleChange('file_permohonan_ortu', url)}
        />

        <FileUpload
          label="SURAT REKOMENDASI DARI SEKOLAH TUJUAN"
          helperText="Upload surat kesediaan menerima (PDF - Opsional)"
          subfolder="mutasi"
          value={formData.file_rekomendasi_tujuan}
          onChange={(url) => handleChange('file_rekomendasi_tujuan', url)}
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
        className="w-full h-12 bg-gradient-to-r from-[#6320ee] to-[#4f1cdb] hover:from-[#5218cb] hover:to-[#4314be] text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
      >
        <Send className="w-4 h-4" />
        <span>{loading ? 'Mengirim Permohonan...' : 'Kirim Permohonan Sekarang'}</span>
      </button>
    </form>
  );
}
