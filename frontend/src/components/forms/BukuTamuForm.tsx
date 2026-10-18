'use client';

import React, { useState } from 'react';
import { Send, UserCheck } from 'lucide-react';
import { submitPtspForm } from '@/lib/api';
import { SubmissionResponse } from '@/types';

interface BukuTamuFormProps {
  onSuccess: (data: SubmissionResponse) => void;
  onProgressChange: (percent: number) => void;
}

export default function BukuTamuForm({
  onSuccess,
  onProgressChange,
}: BukuTamuFormProps) {
  const [formData, setFormData] = useState({
    nama: '',
    wa: '',
    instansi: '',
    bertemu_dengan: 'Kepala Madrasah',
    tujuan: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateProgress = (data: typeof formData) => {
    let filled = 0;
    const requiredKeys: (keyof typeof formData)[] = ['nama', 'tujuan'];
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
      const res = await submitPtspForm('buku-tamu', formData);
      onSuccess(res);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan catatan buku tamu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Nama Lengkap Tamu */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              Nama Lengkap Tamu <span className="text-red-500">*</span>
            </label>
            <span className="char-counter">{formData.nama.length}/60</span>
          </div>
          <input
            type="text"
            required
            maxLength={60}
            value={formData.nama}
            onChange={(e) => handleChange('nama', e.target.value)}
            placeholder="Contoh: Drs. H. Ruslan, M.Ag."
            className="ptsp-input"
          />
        </div>

        {/* No. WhatsApp */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">No. WhatsApp</label>
            <span className="char-counter">{formData.wa.length}/20</span>
          </div>
          <input
            type="tel"
            maxLength={20}
            value={formData.wa}
            onChange={(e) => handleChange('wa', e.target.value)}
            placeholder="Contoh: 081234567890"
            className="ptsp-input"
          />
        </div>

        {/* Instansi Asal */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">Instansi / Lembaga Asal</label>
            <span className="char-counter">{formData.instansi.length}/80</span>
          </div>
          <input
            type="text"
            maxLength={80}
            value={formData.instansi}
            onChange={(e) => handleChange('instansi', e.target.value)}
            placeholder="Contoh: Kantor Wilayah Kemenag Sulsel"
            className="ptsp-input"
          />
        </div>

        {/* Bertemu Dengan */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Bertemu / Menemui <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.bertemu_dengan}
            onChange={(e) => handleChange('bertemu_dengan', e.target.value)}
            className="ptsp-input bg-transparent cursor-pointer"
          >
            <option value="Kepala Madrasah">Kepala Madrasah</option>
            <option value="Kepala Tata Usaha">Kepala Bagian Tata Usaha</option>
            <option value="Wakamad Kurikulum & Akademik">Wakamad Kurikulum & Akademik</option>
            <option value="Wakamad Kesiswaan">Wakamad Kesiswaan & Asrama</option>
            <option value="Wakamad Sarana & Prasarana">Wakamad Sarana & Prasarana</option>
            <option value="Wakamad Hubungan Masyarakat">Wakamad Humas & Kemitraan</option>
            <option value="Guru / Pegawai Tertentu">Guru / Tenaga Pendidik</option>
          </select>
        </div>

        {/* Keperluan / Tujuan */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Maksud / Tujuan Kunjungan <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={formData.tujuan}
            onChange={(e) => handleChange('tujuan', e.target.value)}
            placeholder="Tuliskan keperluan kunjungan Anda..."
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
        className="ptsp-btn-submit"
      >
        <UserCheck className="w-4 h-4" />
        <span>{loading ? 'Menyimpan...' : 'Simpan Catatan Kunjungan'}</span>
      </button>
    </form>
  );
}
