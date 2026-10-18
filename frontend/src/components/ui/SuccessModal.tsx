'use client';

import React, { useEffect, useState } from 'react';
import { Check, Copy, CheckCheck, ExternalLink, QrCode, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SubmissionResponse } from '@/types';

interface SuccessModalProps {
  data: SubmissionResponse | null;
  onClose: () => void;
  onTrackNow: (token: string) => void;
}

export default function SuccessModal({ data, onClose, onTrackNow }: SuccessModalProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    if (data) {
      // Trigger confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6320ee', '#3083ff', '#10b981', '#f59e0b'],
        });
      } catch (e) {
        // Safe fallback if canvas not available
      }
    }
  }, [data]);

  if (!data) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(data.short_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(data.tracking_token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const shareText = encodeURIComponent(
    `Halo, permohonan saya "${data.service_type}" di PTSP MAN IC Gowa telah terkirim dengan Kode Lacak: ${data.short_code}. Mohon info proses selanjutnya. Terima kasih.`,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200">
        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner mb-4">
          <Check className="w-8 h-8 stroke-[2.5]" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
          Permohonan Berhasil Dikirim!
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          Berkas permohonan <span className="font-semibold text-slate-700">{data.service_type}</span> telah masuk ke sistem PTSP MAN Insan Cendekia Gowa.
        </p>

        {/* Short Code Box */}
        <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4 mb-4">
          <p className="text-[11px] font-bold text-purple-600 uppercase tracking-wider mb-1">
            Kode Lacak Permohonan (Short Code)
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-widest text-[#6320ee] font-mono">
              {data.short_code}
            </span>
            <button
              onClick={handleCopyCode}
              type="button"
              className="p-2 rounded-xl bg-white text-purple-700 shadow-sm hover:bg-purple-100 transition border border-purple-100"
              title="Salin Kode"
            >
              {copiedCode ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Simpan kode ini untuk mengecek status permohonan Anda sewaktu-waktu.
          </p>
        </div>

        {/* Full Token info */}
        <div className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 text-left mb-6 border border-slate-200/60">
          <div className="min-w-0 pr-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Token UUID</p>
            <p className="text-[11px] font-mono text-slate-600 truncate">{data.tracking_token}</p>
          </div>
          <button
            onClick={handleCopyToken}
            type="button"
            className="p-1.5 text-slate-500 hover:text-slate-800 transition"
            title="Salin Token UUID"
          >
            {copiedToken ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => onTrackNow(data.short_code)}
            className="w-full h-12 bg-gradient-to-r from-[#6320ee] to-[#4f1cdb] hover:from-[#5218cb] hover:to-[#4314be] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Lacak Status Permohonan</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={`https://wa.me/?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
          >
            <span>Bagikan ke WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
          >
            Tutup & Buat Permohonan Baru
          </button>
        </div>
      </div>
    </div>
  );
}
