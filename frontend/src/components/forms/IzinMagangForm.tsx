'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';
import DatePicker from '@/components/ui/DatePicker';
import { submitPtspForm } from '@/lib/api';
import { SubmissionResponse } from '@/types';

interface IzinMagangFormProps {
  onSuccess: (data: SubmissionResponse) => void;
  onProgressChange: (percent: number) => void;
}

export default function IzinMagangForm({
  onSuccess,
  onProgressChange,
}: IzinMagangFormProps) {
  const [formData, setFormData] = useState({
    nama: '',
    wa: '',
    sekolah_kampus: '',
    jurusan: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    file_surat_pengantar: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateProgress = (data: typeof formData) => {
    let filled = 0;
    const requiredKeys: (keyof typeof formData)[] = [
      'nama',
      'wa',
      'sekolah_kampus',
      'jurusan',
      'tanggal_mulai',
      'tanggal_selesai',
      'file_surat_pengantar',
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

    if (!formData.file_surat_pengantar) {
      setError('Surat Pengantar dari Kampus/Sekolah wajib diunggah.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitPtspForm('izin-magang', formData);
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
        {/* Nama Lengkap */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              Nama Lengkap Pemohon <span className="text-red-500">*</span>
            </label>
            <span className="char-counter">{formData.nama.length}/60</span>
          </div>
          <input
            type="text"
            required
            maxLength={60}
            value={formData.nama}
            onChange={(e) => handleChange('nama', e.target.value)}
            placeholder="Contoh: Muhammad Fikri Pratama"
            className="ptsp-input"
          />
        </div>

        {/* No. WhatsApp */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              No. WhatsApp <span className="text-red-500">*</span>
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

        {/* Sekolah / Kampus */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              Sekolah / Kampus Asal <span className="text-red-500">*</span>
            </label>
            <span className="char-counter">{formData.sekolah_kampus.length}/100</span>
          </div>
          <input
            type="text"
            required
            maxLength={100}
            value={formData.sekolah_kampus}
            onChange={(e) => handleChange('sekolah_kampus', e.target.value)}
            placeholder="Contoh: UIN Alauddin Makassar"
            className="ptsp-input"
          />
        </div>

        {/* Jurusan */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              Jurusan / Program Studi <span className="text-red-500">*</span>
            </label>
            <span className="char-counter">{formData.jurusan.length}/100</span>
          </div>
          <input
            type="text"
            required
            maxLength={100}
            value={formData.jurusan}
            onChange={(e) => handleChange('jurusan', e.target.value)}
            placeholder="Contoh: Pendidikan Fisika"
            className="ptsp-input"
          />
        </div>

        {/* Tanggal Mulai */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tanggal Mulai Magang <span className="text-red-500">*</span>
          </label>
          <DatePicker
            required
            value={formData.tanggal_mulai}
            onChange={(val) => handleChange('tanggal_mulai', val)}
            placeholder="Pilih tanggal mulai"
          />
        </div>

        {/* Tanggal Selesai */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tanggal Selesai Magang <span className="text-red-500">*</span>
          </label>
          <DatePicker
            required
            value={formData.tanggal_selesai}
            onChange={(val) => handleChange('tanggal_selesai', val)}
            placeholder="Pilih tanggal selesai"
            min={formData.tanggal_mulai}
          />
        </div>
      </div>

      {/* File Upload */}
      <div className="pt-2">
        <FileUpload
          label="SURAT PENGANTAR RESMI DARI KAMPUS / SEKOLAH"
          helperText="Upload surat pengantar magang asli (PDF)"
          subfolder="magang"
          required
          value={formData.file_surat_pengantar}
          onChange={(url) => handleChange('file_surat_pengantar', url)}
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
