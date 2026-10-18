'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';
import DatePicker from '@/components/ui/DatePicker';
import { submitPtspForm } from '@/lib/api';
import { SubmissionResponse } from '@/types';

interface GantiIjazahFormProps {
  onSuccess: (data: SubmissionResponse) => void;
  onProgressChange: (percent: number) => void;
}

export default function GantiIjazahForm({
  onSuccess,
  onProgressChange,
}: GantiIjazahFormProps) {
  const [formData, setFormData] = useState({
    nama_siswa: '',
    wa: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat: '',
    nisn: '',
    file_copy_ijazah: '',
    file_copy_ktp: '',
    file_pas_foto: '',
    file_surat_kehilangan: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateProgress = (data: typeof formData) => {
    let filled = 0;
    const requiredKeys: (keyof typeof formData)[] = [
      'nama_siswa',
      'wa',
      'tempat_lahir',
      'tanggal_lahir',
      'alamat',
      'nisn',
      'file_copy_ijazah',
      'file_copy_ktp',
      'file_pas_foto',
      'file_surat_kehilangan',
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

    if (!formData.file_surat_kehilangan) {
      setError('Surat Keterangan Kehilangan dari Kepolisian wajib diunggah.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitPtspForm('pengganti-ijazah', formData);
      onSuccess({
        ...res,
        applicant_name: formData.nama_siswa,
        applicant_phone: formData.wa,
      });
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim permohonan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Nama Lengkap Siswa */}
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
            placeholder="Contoh: Andi Muhammad Alfian"
            className="ptsp-input"
          />
        </div>

        {/* No. WhatsApp Aktif */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              No. WhatsApp Aktif <span className="text-red-500">*</span>
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
            placeholder="Contoh: Makassar"
            className="ptsp-input"
          />
        </div>

        {/* Tanggal Lahir */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tanggal Lahir <span className="text-red-500">*</span>
          </label>
          <DatePicker
            required
            value={formData.tanggal_lahir}
            onChange={(val) => handleChange('tanggal_lahir', val)}
            placeholder="Pilih tanggal lahir"
          />
        </div>

        {/* Alamat */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              Alamat <span className="text-red-500">*</span>
            </label>
            <span className="char-counter">{formData.alamat.length}/150</span>
          </div>
          <input
            type="text"
            required
            maxLength={150}
            value={formData.alamat}
            onChange={(e) => handleChange('alamat', e.target.value)}
            placeholder="Contoh: Jl. Poros Malino KM. 14, Gowa"
            className="ptsp-input"
          />
        </div>

        {/* NISN */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              No Induk Siswa Nasional (NISN) <span className="text-red-500">*</span>
            </label>
            <span className="char-counter">{formData.nisn.length}/10</span>
          </div>
          <input
            type="text"
            required
            maxLength={10}
            value={formData.nisn}
            onChange={(e) => handleChange('nisn', e.target.value)}
            placeholder="Contoh: 0012345678"
            className="ptsp-input"
          />
        </div>
      </div>

      {/* 4 File Uploads in 2x2 grid matching Screenshot 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <FileUpload
          label="FOTO COPY IJAZAH (1 LBR)"
          helperText="Upload scan ijazah asli (PDF)"
          subfolder="ganti-ijazah"
          value={formData.file_copy_ijazah}
          onChange={(url) => handleChange('file_copy_ijazah', url)}
        />

        <FileUpload
          label="FOTO COPY KTP"
          helperText="Upload scan KTP (PDF/JPG)"
          subfolder="ganti-ijazah"
          value={formData.file_copy_ktp}
          onChange={(url) => handleChange('file_copy_ktp', url)}
        />

        <FileUpload
          label="FOTO UKURAN 3X4 LATAR MERAH"
          helperText="Upload pas foto formal 3x4 (JPG/PNG)"
          subfolder="ganti-ijazah"
          accept=".jpg,.jpeg,.png"
          value={formData.file_pas_foto}
          onChange={(url) => handleChange('file_pas_foto', url)}
        />

        <FileUpload
          label="SURAT KETERANGAN KEHILANGAN DARI KEPOLISIAN"
          helperText="Upload surat keterangan kepolisian asli (PDF)"
          subfolder="ganti-ijazah"
          required
          value={formData.file_surat_kehilangan}
          onChange={(url) => handleChange('file_surat_kehilangan', url)}
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
        <span>{loading ? 'Mengirim Permohonan...' : 'Kirim Permohonan Sekarang'}</span>
      </button>
    </form>
  );
}
