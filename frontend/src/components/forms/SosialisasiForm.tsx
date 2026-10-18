'use client';

import React, { useState } from 'react';
import { Megaphone, Calendar, Clock, Send } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';
import DatePicker from '@/components/ui/DatePicker';
import { submitPtspForm } from '@/lib/api';
import { SubmissionResponse } from '@/types';

interface SosialisasiFormProps {
  onSuccess: (data: SubmissionResponse) => void;
  onProgressChange: (percent: number) => void;
}

export default function SosialisasiForm({ onSuccess, onProgressChange }: SosialisasiFormProps) {
  const [formData, setFormData] = useState({
    nama: '',
    wa: '',
    instansi: '',
    tujuan: '',
    jenis: '',
    jumlah_tim: '',
    rencana_tanggal: '',
    rencana_jam: '',
    target: '',
    file_url: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic progress calculation (10 required fields)
  const calculateProgress = (data: typeof formData) => {
    let filled = 0;
    const requiredKeys: (keyof typeof formData)[] = [
      'nama',
      'wa',
      'instansi',
      'tujuan',
      'jenis',
      'jumlah_tim',
      'rencana_tanggal',
      'rencana_jam',
      'target',
      'file_url',
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

    if (!formData.file_url) {
      setError('Harap unggah surat permohonan / proposal terlebih dahulu.');
      return;
    }

    setLoading(true);
    try {
      const rencana_waktu = formData.rencana_tanggal && formData.rencana_jam
        ? `${formData.rencana_tanggal}T${formData.rencana_jam}`
        : (formData.rencana_tanggal ? `${formData.rencana_tanggal}T08:00` : '');

      const payload = {
        nama: formData.nama,
        wa: formData.wa,
        instansi: formData.instansi,
        tujuan: formData.tujuan,
        jenis: formData.jenis,
        jumlah_tim: formData.jumlah_tim,
        rencana_waktu,
        target: formData.target,
        file_url: formData.file_url,
      };

      const res = await submitPtspForm('sosialisasi', payload);
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

        {/* Instansi / Lembaga */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              Instansi / Lembaga <span className="text-red-500">*</span>
            </label>
            <span className="char-counter">{formData.instansi.length}/80</span>
          </div>
          <input
            type="text"
            required
            maxLength={80}
            value={formData.instansi}
            onChange={(e) => handleChange('instansi', e.target.value)}
            placeholder="Contoh: Universitas Hasanuddin"
            className="ptsp-input"
          />
        </div>

        {/* Tujuan */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              Tujuan <span className="text-red-500">*</span>
            </label>
            <span className="char-counter">{formData.tujuan.length}/150</span>
          </div>
          <input
            type="text"
            required
            maxLength={150}
            value={formData.tujuan}
            onChange={(e) => handleChange('tujuan', e.target.value)}
            placeholder="Contoh: Koordinasi Pelayanan"
            className="ptsp-input"
          />
        </div>

        {/* Jenis Sosialisasi */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Jenis Sosialisasi <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.jenis}
            onChange={(e) => handleChange('jenis', e.target.value)}
            className="ptsp-input bg-transparent cursor-pointer"
          >
            <option value="">Pilih kategori sosialisasi</option>
            <option value="Sosialisasi Kampus / PTN">Sosialisasi Perguruan Tinggi / Kampus</option>
            <option value="Studi Banding">Studi Banding / Kunjungan Kerja</option>
            <option value="Program Beasiswa">Pengenalan Program Beasiswa</option>
            <option value="Karier & Profesi">Edukasi Karier & Kepemimpinan</option>
            <option value="Lainnya">Kategori Lainnya</option>
          </select>
        </div>

        {/* Jumlah Anggota Tim */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Jumlah Anggota Tim <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.jumlah_tim}
            onChange={(e) => handleChange('jumlah_tim', e.target.value)}
            placeholder="Contoh: 5"
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

        {/* Target Peserta */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700">
              Target Peserta <span className="text-red-500">*</span>
            </label>
            <span className="char-counter">{formData.target.length}/100</span>
          </div>
          <input
            type="text"
            required
            maxLength={100}
            value={formData.target}
            onChange={(e) => handleChange('target', e.target.value)}
            placeholder="Contoh: 70 orang (Siswa & Guru)"
            className="ptsp-input"
          />
        </div>
      </div>

      {/* File Upload */}
      <div className="pt-2">
        <FileUpload
          label="UNGGAH SURAT PERMOHONAN"
          helperText="Upload proposal / surat permohonan asli (PDF)"
          subfolder="sosialisasi"
          required
          value={formData.file_url}
          onChange={(url) => handleChange('file_url', url)}
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
