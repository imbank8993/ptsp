'use client';

import React from 'react';
import {
  BookOpen,
  Megaphone,
  Home,
  Building2,
  Microscope,
  FileCheck2,
  GraduationCap,
  Briefcase,
  ArrowLeftRight,
  AlertCircle,
  QrCode,
  X,
} from 'lucide-react';
import { ServiceId } from '@/types';

interface SidebarProps {
  activeService: ServiceId;
  onSelectService: (id: ServiceId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const PTSP_SERVICES = [
  {
    id: 'buku-tamu' as ServiceId,
    title: 'Buku Tamu Digital',
    subtitle: 'CATATAN KUNJUNGAN TAMU DIGITAL',
    icon: BookOpen,
    accent: '#0891b2',
  },
  {
    id: 'sosialisasi' as ServiceId,
    title: 'Pengajuan Sosialisasi',
    subtitle: 'PERMOHONAN KUNJUNGAN & SOSIALISASI',
    icon: Megaphone,
    accent: '#ea580c',
  },
  {
    id: 'izin-siswa' as ServiceId,
    title: 'Izin Siswa Asrama',
    subtitle: 'IZIN PULANG ATAU KELUAR SISWA',
    icon: Home,
    accent: '#059669',
  },
  {
    id: 'peminjaman-sarana' as ServiceId,
    title: 'Peminjaman Sarana',
    subtitle: 'PINJAM SARANA DAN PRASARANA',
    icon: Building2,
    accent: '#d97706',
  },
  {
    id: 'izin-penelitian' as ServiceId,
    title: 'Izin Penelitian',
    subtitle: 'RISET & PENGAMBILAN DATA',
    icon: Microscope,
    accent: '#3083FF',
  },
  {
    id: 'legalisir' as ServiceId,
    title: 'Layanan Legalisir',
    subtitle: 'LEGALISIR IJAZAH & RAPOR ONLINE',
    icon: FileCheck2,
    accent: '#dc2626',
  },
  {
    id: 'ganti-ijazah' as ServiceId,
    title: 'Ganti Ijazah Hilang',
    subtitle: 'SURAT KETERANGAN GANTI IJAZAH',
    icon: GraduationCap,
    accent: '#db2777',
  },
  {
    id: 'izin-magang' as ServiceId,
    title: 'Permohonan Magang',
    subtitle: 'PENGAJUAN PRAKTEK / MAGANG',
    icon: Briefcase,
    accent: '#d97706',
  },
  {
    id: 'mutasi-siswa' as ServiceId,
    title: 'Mutasi Keluar Siswa',
    subtitle: 'PINDAH SEKOLAH KELUAR',
    icon: ArrowLeftRight,
    accent: '#3083FF',
  },
  {
    id: 'pengaduan' as ServiceId,
    title: 'Pengaduan Masyarakat',
    subtitle: 'LAYANAN PENGADUAN & ASPIRASI',
    icon: AlertCircle,
    accent: '#dc2626',
  },
  {
    id: 'tracker' as ServiceId,
    title: 'Lacak Permohonan',
    subtitle: 'TRACKING DENGAN KODE TOKEN',
    icon: QrCode,
    accent: '#10b981',
  },
];

export default function Sidebar({
  activeService,
  onSelectService,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const content = (
    <div className="flex flex-col h-full text-white">
      {/* Brand Header */}
      <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center p-1.5 shadow-inner">
            {/* Logo IC Gowa */}
            <img src="/acca-logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight leading-none text-white">
              PTSP DIGITAL
            </h1>
            <p className="text-[11px] font-medium text-white/75 mt-0.5">
              MAN Insan Cendekia Gowa
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Services List */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5 custom-scroll">
        {PTSP_SERVICES.map((item) => {
          const Icon = item.icon;
          const isActive = activeService === item.id;
          const isTracker = item.id === 'tracker';

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectService(item.id);
                onCloseMobile();
              }}
              className={`w-full text-left transition-all duration-200 flex items-center justify-between px-3.5 py-3 rounded-2xl cursor-pointer group ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xl shadow-purple-950/20 translate-x-1'
                  : isTracker
                  ? 'bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 border border-emerald-400/30'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    isActive
                      ? 'bg-slate-100 text-slate-800'
                      : 'bg-white/10 text-white'
                  }`}
                  style={isActive ? { color: item.accent } : undefined}
                >
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="truncate text-left">
                  <p
                    className={`text-xs font-black truncate leading-snug ${
                      isActive ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {item.title}
                  </p>
                  <p
                    className={`text-[9.5px] uppercase font-bold tracking-wider truncate mt-0.5 ${
                      isActive ? 'text-purple-600' : 'text-white/60'
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Blue indicator dot for active item */}
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-[#6320ee] shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Branding */}
      <div className="p-4 pt-3 border-t border-white/10 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="h-px bg-white/20 flex-1" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
            PTSP DIGITAL
          </span>
          <div className="h-px bg-white/20 flex-1" />
        </div>
        <p className="text-[9.5px] text-white/40">
          Akademik & Layanan Publik Terpadu
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 bg-gradient-to-b from-[#6c22f5] via-[#5d1be8] to-[#4c14c5] shadow-2xl relative z-20 min-h-screen">
        {content}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-[#6c22f5] via-[#5d1be8] to-[#4c14c5] shadow-2xl z-50 flex flex-col">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
