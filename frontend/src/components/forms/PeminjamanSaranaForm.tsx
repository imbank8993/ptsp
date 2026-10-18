'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';
import DatePicker from '@/components/ui/DatePicker';
import { submitPtspForm } from '@/lib/api';
import { SubmissionResponse } from '@/types';

interface PeminjamanSaranaFormProps {
  onSuccess: (data: SubmissionResponse) => void;
  onProgressChange: (percent: number) => void;
}

export default function PeminjamanSaranaForm({
  onSuccess,
  onProgressChange,
}: PeminjamanSaranaFormProps) {
  const [formData, setFormData] = useState({
    nama: '',
    wa: '',
    alamat: '',
    rencana_tanggal: '',
    rencana_jam: '',
    file_proposal: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateProgress = (data: typeof formData) => {
    let filled = 0;
    const requiredKeys: (keyof typeof formData)[] = [
      'nama',
      'wa',
      'alamat',
      'rencana_tanggal',
      'rencana_jam',
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
      setError('Proposal / Surat Permohonan wajib diunggah.');
      return;
    }

    setLoading(true);
    try {
      const tanggal_mulai = formData.rencana_tanggal && formData.rencana_jam
        ? `${formData.rencana_tanggal}T${formData.rencana_jam}`
        : (formData.rencana_tanggal ? `${formData.rencana_tanggal}T08:00` : '');

      const payload = {
        nama: formData.nama,
        wa: formData.wa,
        alamat: formData.alamat,
        tanggal_mulai,
        file_proposal: formData.file_proposal,
      };

      const res = await submitPtspForm('peminjaman-sarana', payload);
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
        {/* Nama Lengkap */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              Nama Lengkap <span className="text-red-500">*</span>
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

        {/* Tanggal Pelaksanaan */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tanggal Pelaksanaan <span className="text-red-500">*</span>
          </label>
          <DatePicker
            required
            value={formData.rencana_tanggal}
            onChange={(val) => handleChange('rencana_tanggal', val)}
            placeholder="Pilih tanggal pelaksanaan"
          />
        </div>

        {/* Waktu / Jam Pelaksanaan */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Waktu / Jam Pelaksanaan <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            required
            value={formData.rencana_jam}
            onChange={(e) => handleChange('rencana_jam', e.target.value)}
            className="ptsp-input cursor-pointer"
          />
        </div>
      </div>

      {/* File Upload */}
      <div className="pt-2">
        <FileUpload
          label="UNGGAH PROPOSAL/SURAT PERMOHONAN ASLI"
          helperText="Upload proposal asli (PDF)"
          subfolder="peminjaman-sarana"
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
