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
    icon: BookOpen,
    accent: '#0284c7',
  },
  {
    id: 'sosialisasi' as ServiceId,
    title: 'Pengajuan Sosialisasi',
    icon: Megaphone,
    accent: '#ea580c',
  },
  {
    id: 'izin-siswa' as ServiceId,
    title: 'Izin Siswa Asrama',
    icon: Home,
    accent: '#059669',
  },
  {
    id: 'peminjaman-sarana' as ServiceId,
    title: 'Peminjaman Sarana',
    icon: Building2,
    accent: '#d97706',
  },
  {
    id: 'izin-penelitian' as ServiceId,
    title: 'Izin Penelitian',
    icon: Microscope,
    accent: '#2563eb',
  },
  {
    id: 'legalisir' as ServiceId,
    title: 'Layanan Legalisir',
    icon: FileCheck2,
    accent: '#dc2626',
  },
  {
    id: 'ganti-ijazah' as ServiceId,
    title: 'Ganti Ijazah Hilang',
    icon: GraduationCap,
    accent: '#db2777',
  },
  {
    id: 'izin-magang' as ServiceId,
    title: 'Permohonan Magang',
    icon: Briefcase,
    accent: '#d97706',
  },
  {
    id: 'mutasi-siswa' as ServiceId,
    title: 'Mutasi Keluar Siswa',
    icon: ArrowLeftRight,
    accent: '#2d79d6',
  },
  {
    id: 'pengaduan' as ServiceId,
    title: 'Pengaduan Masyarakat',
    icon: AlertCircle,
    accent: '#dc2626',
  },
  {
    id: 'tracker' as ServiceId,
    title: 'Lacak Permohonan',
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
      {/* Brand Header with Logo Insan Cendekia */}
      <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/15 dark:bg-white/10 backdrop-blur-md flex items-center justify-center p-1.5 shadow-inner border border-white/20">
            {/* Logo Insan Cendekia */}
            <img
              src="/Logo Insan Cendekia.png"
              alt="Logo Insan Cendekia"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight leading-none text-white">
              PTSP DIGITAL
            </h1>
            <p className="text-[11px] font-semibold text-blue-200/90 mt-0.5 tracking-wide">
              MAN Insan Cendekia Gowa
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Services List with independent smooth scrolling and clean compact gap */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-3 space-y-1">
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
              className={`w-full text-left transition-all duration-200 flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer group ${
                isActive
                  ? 'bg-white dark:bg-[#142340] text-slate-900 dark:text-white shadow-md shadow-blue-950/20 translate-x-1 border border-transparent dark:border-blue-500/30'
                  : isTracker
                  ? 'bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 border border-emerald-400/30'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                      : 'bg-white/10 text-white'
                  }`}
                  style={isActive ? { color: item.accent } : undefined}
                >
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span
                  className={`text-xs font-bold truncate ${
                    isActive ? 'text-slate-900 dark:text-white' : 'text-white'
                  }`}
                >
                  {item.title}
                </span>
              </div>

              {/* Indicator dot for active item */}
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#2d79d6] dark:bg-[#4d92ee] shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Branding */}
      <div className="p-4 pt-3 border-t border-white/10 text-center shrink-0">
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
      {/* Desktop Sidebar (Permanent, independent scroll, no-scrollbar) */}
      <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 h-screen sticky top-0 bg-gradient-to-b from-[#1e4480] via-[#17376c] to-[#122c57] dark:from-[#0d1627] dark:via-[#091120] dark:to-[#060b15] shadow-2xl z-20 border-r border-blue-900/20 dark:border-slate-800">
        {content}
      </aside>

      {/* Mobile Drawer (Clean, no-scrollbar) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-[#1e4480] via-[#17376c] to-[#122c57] dark:from-[#0d1627] dark:via-[#091120] dark:to-[#060b15] shadow-2xl z-50 flex flex-col h-full">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
