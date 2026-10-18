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
  },
  {
    id: 'sosialisasi' as ServiceId,
    title: 'Pengajuan Sosialisasi',
    icon: Megaphone,
  },
  {
    id: 'izin-siswa' as ServiceId,
    title: 'Izin Siswa Asrama',
    icon: Home,
  },
  {
    id: 'peminjaman-sarana' as ServiceId,
    title: 'Peminjaman Sarana',
    icon: Building2,
  },
  {
    id: 'izin-penelitian' as ServiceId,
    title: 'Izin Penelitian',
    icon: Microscope,
  },
  {
    id: 'legalisir' as ServiceId,
    title: 'Layanan Legalisir',
    icon: FileCheck2,
  },
  {
    id: 'ganti-ijazah' as ServiceId,
    title: 'Ganti Ijazah Hilang',
    icon: GraduationCap,
  },
  {
    id: 'izin-magang' as ServiceId,
    title: 'Permohonan Magang',
    icon: Briefcase,
  },
  {
    id: 'mutasi-siswa' as ServiceId,
    title: 'Mutasi Keluar Siswa',
    icon: ArrowLeftRight,
  },
  {
    id: 'pengaduan' as ServiceId,
    title: 'Pengaduan Masyarakat',
    icon: AlertCircle,
  },
  {
    id: 'tracker' as ServiceId,
    title: 'Lacak Permohonan',
    icon: QrCode,
  },
];

export default function Sidebar({
  activeService,
  onSelectService,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const content = (
    <div className="flex flex-col h-full text-slate-800 dark:text-slate-100">
      {/* Brand Header with Logo Insan Cendekia */}
      <div className="h-[70px] px-5 sm:px-6 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 p-1 shadow-xs border border-slate-200/80 dark:border-slate-700 shrink-0 flex items-center justify-center">
            {/* Logo Insan Cendekia */}
            <img
              src="/Logo Insan Cendekia.png"
              alt="Logo Insan Cendekia"
              className="w-full h-full object-contain filter drop-shadow-xs"
            />
          </div>
          <div>
            <h1 className="text-base font-black tracking-wider leading-none text-[#005599] dark:text-[#4da6ff]">
              PTSP DIGITAL
            </h1>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 tracking-wide">
              MAN Insan Cendekia Gowa
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
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
                  ? 'bg-[#005599] text-white shadow-md shadow-[#005599]/25 translate-x-1 font-bold'
                  : isTracker
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 text-[#005599] dark:text-[#4da6ff] hover:bg-blue-100/70 dark:hover:bg-blue-900/50 border border-blue-200/80 dark:border-blue-900/50 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : isTracker
                      ? 'bg-white dark:bg-blue-900/50 text-[#005599] dark:text-[#4da6ff] shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px] stroke-[2.2]" />
                </div>
                <span className="text-sm truncate">
                  {item.title}
                </span>
              </div>

              {/* Indicator dot for active item */}
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0 ml-2 shadow-xs" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Clean White Background) */}
      <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 h-screen sticky top-0 bg-white dark:bg-[#0f172a] shadow-xs z-20 border-r border-slate-200/80 dark:border-slate-800">
        {content}
      </aside>

      {/* Mobile Drawer (Clean White Background) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-[#0f172a] shadow-2xl z-50 flex flex-col h-full border-r border-slate-200/80 dark:border-slate-800">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
