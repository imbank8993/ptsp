'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';
import DatePicker from '@/components/ui/DatePicker';
import { submitPtspForm } from '@/lib/api';
import { SubmissionResponse } from '@/types';

interface IzinPenelitianFormProps {
  onSuccess: (data: SubmissionResponse) => void;
  onProgressChange: (percent: number) => void;
}

export default function IzinPenelitianForm({
  onSuccess,
  onProgressChange,
}: IzinPenelitianFormProps) {
  const [formData, setFormData] = useState({
    nama: '',
    wa: '',
    instansi: '',
    judul_penelitian: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    file_proposal: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateProgress = (data: typeof formData) => {
    let filled = 0;
    const requiredKeys: (keyof typeof formData)[] = [
      'nama',
      'wa',
      'instansi',
      'judul_penelitian',
      'tanggal_mulai',
      'file_proposal',
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

    if (!formData.file_proposal) {
      setError('Surat permohonan izin meneliti wajib diunggah.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        tanggal_selesai: formData.tanggal_selesai || formData.tanggal_mulai,
      };
      const res = await submitPtspForm('izin-penelitian', payload);
      onSuccess({
        ...res,
        applicant_name: formData.nama,
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
        {/* Nama Peneliti */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              Nama Peneliti <span className="text-red-500">*</span>
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

        {/* Instansi / Kampus */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              Instansi / Sekolah / Kampus <span className="text-red-500">*</span>
            </label>
            <span className="char-counter">{formData.instansi.length}/80</span>
          </div>
          <input
            type="text"
            required
            maxLength={80}
            value={formData.instansi}
            onChange={(e) => handleChange('instansi', e.target.value)}
            placeholder="Contoh: Universitas Indonesia"
            className="ptsp-input"
          />
        </div>

        {/* Judul Penelitian */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              Judul Penelitian <span className="text-red-500">*</span>
            </label>
            <span className="char-counter">{formData.judul_penelitian.length}/150</span>
          </div>
          <input
            type="text"
            required
            maxLength={150}
            value={formData.judul_penelitian}
            onChange={(e) => handleChange('judul_penelitian', e.target.value)}
            placeholder="Contoh: Analisis Dampak Digitalisasi Layanan Pendidikan..."
            className="ptsp-input"
          />
        </div>

        {/* Rencana Pelaksanaan Mulai */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Rencana Pelaksanaan (Mulai) <span className="text-red-500">*</span>
          </label>
          <DatePicker
            required
            value={formData.tanggal_mulai}
            onChange={(val) => handleChange('tanggal_mulai', val)}
            placeholder="Pilih tanggal mulai"
          />
        </div>

        {/* Rencana Pelaksanaan Selesai */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Rencana Pelaksanaan (Selesai)
          </label>
          <DatePicker
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
          label="UPLOAD SURAT PERMOHONAN IZIN MENELITI"
          helperText="Upload surat pengantar/izin asli (PDF)"
          subfolder="penelitian"
          required
          value={formData.file_proposal}
          onChange={(url) => handleChange('file_proposal', url)}
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
