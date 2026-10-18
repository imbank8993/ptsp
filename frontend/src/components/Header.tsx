'use client';

import React from 'react';
import { Menu, Search, PhoneCall, ShieldCheck } from 'lucide-react';
import { ServiceId } from '@/types';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenTracker: () => void;
}

export default function Header({ onOpenMobileSidebar, onOpenTracker }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center p-1">
            <img src="/acca-logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800 leading-tight">
              Pusat Pengajuan Digital PTSP
            </h2>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              MAN Insan Cendekia Gowa • Pelayanan Cepat, Transparan & Akuntabel
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenTracker}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6320ee] font-bold text-xs transition border border-purple-200/60 shadow-sm cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Lacak Permohonan</span>
          <span className="sm:hidden">Lacak</span>
        </button>

        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-100">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Terintegrasi ACCA DB</span>
        </div>
      </div>
    </header>
  );
}
