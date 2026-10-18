'use client';

import React from 'react';
import { Menu, Search, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenTracker: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export default function Header({
  onOpenMobileSidebar,
  onOpenTracker,
  isDark,
  onToggleDark,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-[70px] bg-white/85 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-3 sm:px-8 flex items-center justify-between transition-colors duration-200 shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title and Tagline */}
        <div className="min-w-0">
          <h2 className="text-xs sm:text-base font-black text-slate-800 dark:text-slate-100 leading-tight">
            <span className="block sm:inline">Pelayanan Terpadu</span>{' '}
            <span className="block sm:inline">Satu Pintu</span>
          </h2>
          <p className="hidden sm:block text-[10.5px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 line-clamp-1">
            Pelayanan Cepat, Transparan, dan Akuntabel
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={onToggleDark}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-amber-400 transition flex items-center gap-1.5 cursor-pointer text-xs font-semibold shadow-xs"
          title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400 stroke-[2.2]" /> : <Moon className="w-4 h-4 text-slate-700 stroke-[2.2]" />}
          <span className="hidden sm:inline text-slate-700 dark:text-slate-200">
            {isDark ? 'Light' : 'Dark'}
          </span>
        </button>

        {/* Tracker Quick Shortcut */}
        <button
          type="button"
          onClick={onOpenTracker}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#2B60DE] dark:text-[#5c8cf0] font-bold text-xs transition border border-blue-200/60 dark:border-blue-800/50 shadow-sm cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Lacak Permohonan</span>
          <span className="sm:hidden">Lacak</span>
        </button>
      </div>
    </header>
  );
}
