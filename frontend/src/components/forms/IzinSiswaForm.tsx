'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { submitPtspForm } from '@/lib/api';
import { SubmissionResponse } from '@/types';

interface IzinSiswaFormProps {
  onSuccess: (data: SubmissionResponse) => void;
  onProgressChange: (percent: number) => void;
}

export default function IzinSiswaForm({
  onSuccess,
  onProgressChange,
}: IzinSiswaFormProps) {
  const [formData, setFormData] = useState({
    nama: '',
    kelas: '',
    wa: '',
    alasan: 'Izin' as 'Sakit' | 'Izin' | 'Lainnya',
    alasan_lainnya: '',
    keterangan: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateProgress = (data: typeof formData) => {
    let filled = 0;
    const requiredKeys: (keyof typeof formData)[] = [
      'nama',
      'kelas',
      'wa',
      'keterangan',
      'tanggal_mulai',
      'tanggal_selesai',
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

    setLoading(true);
    try {
      const res = await submitPtspForm('izin-siswa', formData);
      onSuccess(res);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim permohonan izin siswa.');
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
            <span className="char-counter">{formData.nama.length}/60</span>
          </div>
          <input
            type="text"
            required
            maxLength={60}
            value={formData.nama}
            onChange={(e) => handleChange('nama', e.target.value)}
            placeholder="Contoh: Muhammad Naufal Al-Ghifari"
            className="ptsp-input"
          />
        </div>

        {/* Kelas */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Kelas Asrama <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={20}
            value={formData.kelas}
            onChange={(e) => handleChange('kelas', e.target.value)}
            placeholder="Contoh: XII MIPA 1"
            className="ptsp-input"
          />
        </div>

        {/* No. WhatsApp Wali / Siswa */}
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

        {/* Kategori Alasan Izin */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Alasan Izin <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.alasan}
            onChange={(e) => handleChange('alasan', e.target.value as any)}
            className="ptsp-input bg-transparent cursor-pointer"
          >
            <option value="Izin">Izin Keperluan Keluarga</option>
            <option value="Sakit">Sakit / Perawatan Medis</option>
            <option value="Lainnya">Lainnya (Perlombaan / Tugas Luar)</option>
          </select>
        </div>

        {/* Alasan Lainnya if selected */}
        {formData.alasan === 'Lainnya' && (
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Sebutkan Alasan Lainnya <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.alasan_lainnya}
              onChange={(e) => handleChange('alasan_lainnya', e.target.value)}
              placeholder="Contoh: Mengikuti Final Olimpiade Sains Nasional (OSN)"
              className="ptsp-input"
            />
          </div>
        )}

        {/* Tanggal Mulai Izin */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tanggal & Jam Keluar Asrama <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            required
            value={formData.tanggal_mulai}
            onChange={(e) => handleChange('tanggal_mulai', e.target.value)}
            className="ptsp-input"
          />
        </div>

        {/* Tanggal Selesai Izin */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tanggal Kembali ke Asrama <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            required
            value={formData.tanggal_selesai}
            onChange={(e) => handleChange('tanggal_selesai', e.target.value)}
            className="ptsp-input"
          />
        </div>

        {/* Keterangan */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Keterangan / Keperluan Lengkap <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={formData.keterangan}
            onChange={(e) => handleChange('keterangan', e.target.value)}
            placeholder="Tuliskan keterangan detail izin dan penanggung jawab penjemputan..."
            className="ptsp-textarea"
          />
        </div>
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
        <span>{loading ? 'Mengirim Permohonan...' : 'Kirim Permohonan Izin Sekarang'}</span>
      </button>
    </form>
  );
}
