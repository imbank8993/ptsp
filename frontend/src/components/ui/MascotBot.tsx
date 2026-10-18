'use client';

import React, { useState } from 'react';

interface MascotBotProps {
  progress?: number;
  message?: string;
}

export default function MascotBot({ progress = 0, message }: MascotBotProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getTip = () => {
    if (message) return message;
    if (progress === 100) return 'Keren! Semua isian formulir sudah lengkap. Klik Kirim sekarang!';
    if (progress > 50) return 'Hampir selesai! Periksa kembali dokumen yang diunggah ya.';
    if (progress > 0) return 'Teruskan pengisian! Pastikan nomor WhatsApp aktif untuk notifikasi.';
    return 'Halo! Butuh bantuan? Silakan pilih jenis layanan di sebelah kiri.';
  };

  return (
    <div
      className="fixed bottom-6 right-20 z-40 flex flex-col items-end pointer-events-auto"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(!showTooltip)}
    >
      {/* Speech bubble */}
      <div
        className={`transition-all duration-300 transform origin-bottom-right mb-2 max-w-xs ${
          showTooltip
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-90 translate-y-2 pointer-events-none'
        }`}
      >
        <div className="bg-white text-slate-800 text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-purple-100 relative">
          <p className="leading-snug">{getTip()}</p>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-purple-100 transform rotate-45" />
        </div>
      </div>

      {/* Mascot Bot Graphic */}
      <div className="animate-mascot-float cursor-pointer select-none transition-transform hover:scale-105 active:scale-95">
        <svg
          width="82"
          height="88"
          viewBox="0 0 100 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          {/* Shadow */}
          <ellipse cx="50" cy="106" rx="22" ry="4" fill="#0f172a" fillOpacity="0.2" />

          {/* Legs */}
          <rect x="36" y="90" width="10" height="14" rx="5" fill="#2563eb" />
          <rect x="54" y="90" width="10" height="14" rx="5" fill="#2563eb" />
          <ellipse cx="41" cy="102" rx="6" ry="3" fill="#1d4ed8" />
          <ellipse cx="59" cy="102" rx="6" ry="3" fill="#1d4ed8" />

          {/* Body */}
          <rect x="28" y="58" width="44" height="34" rx="12" fill="#3b82f6" />
          <rect x="34" y="66" width="32" height="18" rx="8" fill="#60a5fa" />
          {/* Belly detail: terminal bar */}
          <rect x="40" y="74" width="20" height="3" rx="1.5" fill="#93c5fd" />

          {/* Arms */}
          <rect x="18" y="64" width="9" height="20" rx="4.5" fill="#2563eb" />
          <rect x="73" y="64" width="9" height="20" rx="4.5" fill="#2563eb" />

          {/* Neck */}
          <rect x="44" y="50" width="12" height="10" rx="2" fill="#1d4ed8" />

          {/* Head Cloud/Curved Outline */}
          <path
            d="M 50 12 
               C 62 12, 70 18, 73 24 
               C 82 24, 88 32, 86 41 
               C 85 49, 78 54, 70 54 
               L 30 54 
               C 22 54, 15 49, 14 41 
               C 12 32, 18 24, 27 24 
               C 30 18, 38 12, 50 12 Z"
            fill="#3b82f6"
          />

          {/* Head Screen Face (Dark Navy) */}
          <rect x="25" y="24" width="50" height="26" rx="9" fill="#0f172a" />

          {/* Screen Glare */}
          <path
            d="M 28 27 Q 40 25, 48 27"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.4"
          />

          {/* Eyes (Terminal prompt `> _` animated blink) */}
          {progress === 100 ? (
            /* Happy eyes */
            <g className="animate-pulse">
              <path
                d="M 33 38 Q 38 32, 43 38"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 57 38 Q 62 32, 67 38"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          ) : (
            /* Terminal prompt eyes `> _` */
            <g className="animate-blink">
              {/* Left eye: > */}
              <path
                d="M 34 32 L 40 37 L 34 42"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Right eye: _ */}
              <line
                x1="58"
                y1="41"
                x2="66"
                y2="41"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Cheeks */}
          <circle cx="28" cy="42" r="2.5" fill="#ec4899" fillOpacity="0.6" />
          <circle cx="72" cy="42" r="2.5" fill="#ec4899" fillOpacity="0.6" />
        </svg>
      </div>
    </div>
  );
}
