'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';
import { submitPtspForm } from '@/lib/api';
import { SubmissionResponse } from '@/types';

interface LayananLegalisirFormProps {
  onSuccess: (data: SubmissionResponse) => void;
  onProgressChange: (percent: number) => void;
}

export default function LayananLegalisirForm({
  onSuccess,
  onProgressChange,
}: LayananLegalisirFormProps) {
  const [formData, setFormData] = useState({
    nama: '',
    wa: '',
    jenis_dokumen: '',
    jumlah_lembar: 5,
    file_dokumen: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateProgress = (data: typeof formData) => {
    let filled = 0;
    const requiredKeys: (keyof typeof formData)[] = [
      'nama',
      'wa',
      'jenis_dokumen',
      'file_dokumen',
    ];
    requiredKeys.forEach((k) => {
      if (typeof data[k] === 'string' && data[k]?.trim()) filled++;
    });
    const pct = Math.round((filled / requiredKeys.length) * 100);
    onProgressChange(pct);
    return pct;
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    calculateProgress(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.file_dokumen) {
      setError('Scan dokumen asli wajib diunggah.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitPtspForm('legalisir', formData);
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
        {/* Nama Pemohon */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              Nama Pemohon <span className="text-red-500">*</span>
            </label>
            <span className="char-counter">{formData.nama.length}/60</span>
          </div>
          <input
            type="text"
            required
            maxLength={60}
            value={formData.nama}
            onChange={(e) => handleChange('nama', e.target.value)}
            placeholder="Contoh: Dr. Muh. Rifqi Fadhil, S.Pd., M.M."
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

        {/* Jenis Dokumen */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Jenis Dokumen <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.jenis_dokumen}
            onChange={(e) => handleChange('jenis_dokumen', e.target.value)}
            className="ptsp-input bg-transparent cursor-pointer"
          >
            <option value="">Pilih jenis dokumen</option>
            <option value="Ijazah">Ijazah Madrasah Aliyah</option>
            <option value="Rapor Lengkap (Semester 1 - 6)">Buku Rapor Lengkap (Sem 1 - 6)</option>
            <option value="Rapor Semester 1 - 5">Buku Rapor Semester 1 - 5 (SNBP / PMDK)</option>
            <option value="Transkrip Nilai">Transkrip Nilai Akademik</option>
            <option value="Sertifikat / Piagam">Piagam Penghargaan / Sertifikat</option>
            <option value="Dokumen Lainnya">Dokumen Akademik Lainnya</option>
          </select>
        </div>

        {/* Jumlah Lembar */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Jumlah Lembar <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            max={50}
            required
            value={formData.jumlah_lembar}
            onChange={(e) => handleChange('jumlah_lembar', parseInt(e.target.value, 10) || 1)}
            placeholder="Contoh: 5 lembar"
            className="ptsp-input"
          />
        </div>
      </div>

      {/* File Upload */}
      <div className="pt-2">
        <FileUpload
          label="SCAN DOKUMEN ASLI"
          helperText="Upload scan asli (PDF)"
          subfolder="legalisir"
          required
          value={formData.file_dokumen}
          onChange={(url) => handleChange('file_dokumen', url)}
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
