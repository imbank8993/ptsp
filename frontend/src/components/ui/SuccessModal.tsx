'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Check,
  Copy,
  CheckCheck,
  ExternalLink,
  ArrowRight,
  Download,
  ShieldCheck,
  Calendar,
  User,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
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
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (data) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6395EE', '#3d72d6', '#10b981', '#f59e0b'],
        });
      } catch (e) {
        // Safe fallback if canvas-confetti not available
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

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }) + ' WITA';

  const shareText = encodeURIComponent(
    `Halo, permohonan saya "${data.service_type}" di PTSP MAN IC Gowa telah terkirim dengan Kode Lacak: ${data.short_code}. Mohon info proses selanjutnya. Terima kasih.`,
  );

  /**
   * Generates a high-resolution PNG receipt card using HTML5 Canvas
   */
  const handleDownloadCard = async () => {
    if (!data || downloading) return;
    setDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      const width = 1200;
      const height = 740;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Background clean white with soft border
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // 2. Header solid banner (#6395EE)
      ctx.fillStyle = '#6395EE';
      ctx.fillRect(0, 0, width, 140);

      // Gold bottom bar on header
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, 136, width, 4);

      // Load school logo onto canvas
      try {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          logoImg.onload = resolve;
          logoImg.onerror = resolve; // Continue even if image fails to load
          logoImg.src = '/Logo Insan Cendekia.png';
        });

        if (logoImg.width > 0) {
          // White rounded backdrop for logo
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(40, 20, 100, 100, 16);
          } else {
            ctx.rect(40, 20, 100, 100);
          }
          ctx.fill();
          ctx.drawImage(logoImg, 46, 26, 88, 88);
        }
      } catch (err) {
        // Non-blocking fallback
      }

      // Header Texts
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';

      ctx.font = 'bold 20px sans-serif';
      ctx.letterSpacing = '1px';
      ctx.fillText('KEMENTERIAN AGAMA REPUBLIK INDONESIA', 165, 48);

      ctx.font = '900 30px sans-serif';
      ctx.fillText('MAN INSAN CENDEKIA GOWA', 165, 84);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '600 17px sans-serif';
      ctx.fillText('PELAYANAN TERPADU SATU PINTU (PTSP) DIGITAL', 165, 114);

      // Title Badge inside body
      ctx.fillStyle = '#eef4fd';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(40, 165, width - 80, 52, 12);
      } else {
        ctx.rect(40, 165, width - 80, 52);
      }
      ctx.fill();

      ctx.fillStyle = '#2f66c7';
      ctx.font = '800 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('KARTU TANDA BUKTI PENGAJUAN PERMOHONAN RESMI', width / 2, 198);

      // Short Code Frame
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#6395EE';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(40, 235, width - 80, 110, 16);
      } else {
        ctx.rect(40, 235, width - 80, 110);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('KODE LACAK PERMOHONAN (SHORT CODE)', width / 2, 268);

      ctx.fillStyle = '#2563eb';
      ctx.font = '900 42px monospace';
      ctx.letterSpacing = '6px';
      ctx.fillText(data.short_code, width / 2, 318);

      // Data Details Table
      const fields = [
        { label: 'Nama Pemohon', value: data.applicant_name || 'Pemohon PTSP' },
        { label: 'Jenis Layanan', value: data.service_type },
        { label: 'Waktu Pengajuan', value: `${formattedDate}, ${formattedTime}` },
        { label: 'Token UUID', value: data.tracking_token },
        { label: 'Status Awal', value: 'BERKAS DITERIMA (MENUNGGU VERIFIKASI ADMIN)' },
      ];

      let startY = 375;
      ctx.textAlign = 'left';
      fields.forEach((f, idx) => {
        const rowY = startY + idx * 52;

        // Alternating row background
        if (idx % 2 === 0) {
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(40, rowY, width - 80, 46);
        }

        ctx.fillStyle = '#64748b';
        ctx.font = '600 16px sans-serif';
        ctx.fillText(f.label, 60, rowY + 28);

        ctx.fillStyle = '#0f172a';
        ctx.font = idx === 3 ? 'bold 14px monospace' : (idx === 4 ? 'bold 15px sans-serif' : 'bold 17px sans-serif');
        if (idx === 4) ctx.fillStyle = '#059669'; // Green status

        // Truncate long value if needed
        const val = f.value.length > 68 ? f.value.substring(0, 65) + '...' : f.value;
        ctx.fillText(val, 280, rowY + 28);
      });

      // Digital Stamp in bottom right
      ctx.save();
      ctx.translate(width - 200, 650);
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 52, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#2563eb';
      ctx.textAlign = 'center';
      ctx.fillText('PTSP MAN IC GOWA', 0, -18);
      ctx.font = '900 13px sans-serif';
      ctx.fillText('VERIFIED', 0, 4);
      ctx.font = '800 9px sans-serif';
      ctx.fillText('TERCATAT SISTEM', 0, 22);
      ctx.restore();

      // Footer note
      ctx.textAlign = 'left';
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 13px sans-serif';
      ctx.fillText('* Simpan kartu ini sebagai bukti resmi. Gunakan Kode Lacak untuk memantau proses di ptsp.icgowa.sch.id', 40, 670);

      // Outer Card Border
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, width - 4, height - 4);

      // Convert to PNG download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Bukti-PTSP-${data.short_code}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Gagal membuat gambar bukti:', e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl my-auto bg-white dark:bg-[#111c33] rounded-3xl shadow-2xl border border-slate-100 dark:border-[#1e3052] overflow-hidden p-5 sm:p-7 text-center animate-in zoom-in-95 duration-200">
        {/* Top Success Badge */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">
              Permohonan Berhasil Dikirim!
            </h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              Tercatat Resmi di Sistem PTSP MAN IC Gowa
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Berikut adalah kartu tanda bukti identitas pengajuan Anda. Anda dapat menyalin kode lacak maupun mengunduh kartu ini sebagai gambar bukti.
        </p>

        {/* ================= OFFICIAL RECEIPT CARD PREVIEW ================= */}
        <div className="relative text-left bg-slate-50 dark:bg-[#0d1627] border-2 border-[#6395EE]/30 dark:border-[#6395EE]/40 rounded-2xl p-4 sm:p-5 shadow-xs mb-5 overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 p-1 shadow-xs border border-slate-200/60 dark:border-white/10 shrink-0">
              <img
                src="/Logo Insan Cendekia.png"
                alt="MAN IC Gowa"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  MAN Insan Cendekia Gowa
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-[9.5px] font-black text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Resmi</span>
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                Bukti Pendaftaran Layanan PTSP
              </h4>
            </div>
          </div>

          {/* Short Code Feature Box */}
          <div className="my-3 p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/60 flex items-center justify-between gap-2">
            <div>
              <p className="text-[9.5px] font-bold text-[#6395EE] dark:text-[#7baaf5] uppercase tracking-wider">
                Kode Lacak (Short Code)
              </p>
              <p className="text-xl sm:text-2xl font-black text-[#2f66c7] dark:text-[#7baaf5] font-mono tracking-widest">
                {data.short_code}
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              type="button"
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#182744] text-[#6395EE] dark:text-[#7baaf5] shadow-xs hover:bg-blue-100 dark:hover:bg-[#1e3256] transition border border-blue-200 dark:border-blue-900/70 flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
              title="Salin Kode Lacak"
            >
              {copiedCode ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Salin</span>
                </>
              )}
            </button>
          </div>

          {/* Identity Details Grid */}
          <div className="space-y-2 text-xs">
            <div className="flex items-start justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Pemohon</span>
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-right truncate ml-2">
                {data.applicant_name || 'Pemohon PTSP'}
              </span>
            </div>

            <div className="flex items-start justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Layanan</span>
              </span>
              <span className="font-bold text-[#6395EE] dark:text-[#7baaf5] text-right truncate ml-2">
                {data.service_type}
              </span>
            </div>

            <div className="flex items-start justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Waktu Submit</span>
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-300 text-right ml-2 text-[11px]">
                {formattedDate}, {formattedTime}
              </span>
            </div>

            {/* Token UUID Row with Copy */}
            <div className="flex items-center justify-between py-1 pt-1.5">
              <div className="min-w-0 pr-2">
                <p className="text-[9.5px] font-bold text-slate-400 uppercase">Token UUID</p>
                <p className="text-[10px] font-mono text-slate-600 dark:text-slate-400 truncate">
                  {data.tracking_token}
                </p>
              </div>
              <button
                onClick={handleCopyToken}
                type="button"
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                title="Salin Token UUID"
              >
                {copiedToken ? (
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* PRIMARY: Unduh Bukti Kartu Gambar PNG */}
          <button
            type="button"
            onClick={handleDownloadCard}
            disabled={downloading}
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Membuat Gambar...' : 'Unduh Kartu Bukti (Gambar PNG)'}</span>
          </button>

          {/* Lacak Status */}
          <button
            type="button"
            onClick={() => onTrackNow(data.short_code)}
            className="w-full h-11 bg-[#6395EE] hover:bg-[#4d82e4] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Lacak Status Permohonan</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* WhatsApp Share */}
          <a
            href={`https://wa.me/?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-10 bg-slate-50 dark:bg-[#16233d] hover:bg-slate-100 dark:hover:bg-[#1d2d4f] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
          >
            <span>Bagikan Kode ke WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
          >
            Tutup & Buat Permohonan Baru
          </button>
        </div>
      </div>
    </div>
  );
}
