'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar, { PTSP_SERVICES } from '@/components/Sidebar';
import Header from '@/components/Header';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import SuccessModal from '@/components/ui/SuccessModal';
import TrackerView from '@/components/tracker/TrackerView';
import { applyThemeColor } from '@/lib/theme-color';

import SosialisasiForm from '@/components/forms/SosialisasiForm';
import PeminjamanSaranaForm from '@/components/forms/PeminjamanSaranaForm';
import IzinPenelitianForm from '@/components/forms/IzinPenelitianForm';
import LayananLegalisirForm from '@/components/forms/LayananLegalisirForm';
import GantiIjazahForm from '@/components/forms/GantiIjazahForm';
import IzinMagangForm from '@/components/forms/IzinMagangForm';
import MutasiSiswaForm from '@/components/forms/MutasiSiswaForm';
import PengaduanForm from '@/components/forms/PengaduanForm';
import IzinSiswaForm from '@/components/forms/IzinSiswaForm';
import BukuTamuForm from '@/components/forms/BukuTamuForm';

import { ServiceId, SubmissionResponse } from '@/types';

export default function PtspHomePage() {
  const [activeService, setActiveService] = useState<ServiceId>('peminjaman-sarana');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submissionSuccess, setSubmissionSuccess] = useState<SubmissionResponse | null>(null);
  const [trackerInitialCode, setTrackerInitialCode] = useState<string>('');
  const [isDark, setIsDark] = useState(false);
  const [enabledServices, setEnabledServices] = useState<ServiceId[]>(PTSP_SERVICES.filter((service) => service.id !== 'tracker').map((service) => service.id));

  const scrollPosRef = useRef(0);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${apiBase}/api/ptsp/services`, { cache: 'no-store' })
      .then((response) => response.json())
      .then((result) => {
        if (!result?.ok || !Array.isArray(result.services)) return;
        const ids = result.services.map((service: { id: ServiceId }) => service.id);
        setEnabledServices(ids);
        setActiveService((current) => current === 'tracker' || ids.includes(current) ? current : (ids[0] || 'tracker'));
      })
      .catch(() => undefined);
  }, []);

  const openMobileSidebar = useCallback(() => {
    scrollPosRef.current = window.scrollY;
    setMobileSidebarOpen(true);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  // Initialize theme from localStorage or system preference and sync chrome colors
  useEffect(() => {
    const savedTheme = localStorage.getItem('ptsp_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    applyThemeColor(false);
  }, []);

  // Close mobile sidebar automatically if screen expands to desktop size
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 1023.98px)');
    const handleDesktopBreak = () => {
      if (!mobile.matches) setMobileSidebarOpen(false);
    };
    mobile.addEventListener('change', handleDesktopBreak);
    return () => mobile.removeEventListener('change', handleDesktopBreak);
  }, []);

  // Synchronize Safari status bar and lock scroll when mobile sidebar opens (acca-new style)
  useEffect(() => {
    applyThemeColor(mobileSidebarOpen);

    if (mobileSidebarOpen && window.matchMedia('(max-width: 1023.98px)').matches) {
      const root = document.documentElement;
      root.style.setProperty('--sidebar-scroll-y', `${scrollPosRef.current}px`);
      root.classList.add('app-sidebar-open');

      return () => {
        root.classList.remove('app-sidebar-open');
        root.style.removeProperty('--sidebar-scroll-y');
        const prevBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        window.scrollTo(0, scrollPosRef.current);
        root.style.scrollBehavior = prevBehavior;
      };
    }
  }, [mobileSidebarOpen]);

  const handleToggleDark = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('ptsp_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('ptsp_theme', 'light');
      }
      applyThemeColor(mobileSidebarOpen);
      return next;
    });
  };

  const currentServiceMeta = PTSP_SERVICES.find((s) => s.id === activeService);
  const CurrentIcon = currentServiceMeta?.icon;

  const handleSuccess = (res: SubmissionResponse) => {
    setSubmissionSuccess(res);
  };

  const handleTrackNow = (codeOrToken: string) => {
    setSubmissionSuccess(null);
    setTrackerInitialCode(codeOrToken);
    setActiveService('tracker');
  };

  return (
    <div
      className={`min-h-screen lg:h-screen w-full lg:w-screen flex flex-col lg:flex-row overflow-x-hidden lg:overflow-hidden bg-[#f1f5fa] dark:bg-[#0a1120] text-slate-800 dark:text-slate-100 transition-colors duration-200 ptsp-layout ${
        mobileSidebarOpen ? 'sidebar-mobile-open' : ''
      }`}
    >
      {/* Left Sidebar (Independent scrolling on desktop, slide drawer on mobile) */}
      <Sidebar
        activeService={activeService}
        visibleServiceIds={enabledServices}
        onSelectService={(id) => {
          setActiveService(id);
          setProgress(0);
          closeMobileSidebar();
        }}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={closeMobileSidebar}
      />

      {/* Main Container (Native smooth document scroll on mobile, independent scroll on desktop) */}
      <div className="ptsp-content-wrapper flex-1 w-full min-h-screen lg:h-screen lg:overflow-y-auto no-scrollbar flex flex-col min-w-0 pt-0">
        <Header
          onOpenMobileSidebar={openMobileSidebar}
          onOpenTracker={() => {
            setActiveService('tracker');
            setProgress(0);
          }}
          isDark={isDark}
          onToggleDark={handleToggleDark}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-10 pt-[calc(60px+env(safe-area-inset-top)+14px)] lg:pt-10 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-10 max-w-5xl mx-auto w-full">
          {activeService === 'tracker' ? (
            /* Tracker View */
            <TrackerView initialToken={trackerInitialCode} />
          ) : (
            /* Main Form Card */
            <div className="bg-white dark:bg-[#121d33] rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-sm border border-slate-200/80 dark:border-[#1e3052] transition-colors duration-200 relative">
              {/* Form Header */}
              <div className="flex items-center justify-between pb-4 sm:pb-5 mb-5 sm:mb-6 border-b border-slate-100 dark:border-slate-800/80 gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-[#005599] dark:text-[#4da6ff] shadow-sm border border-blue-100 dark:border-blue-900/60 flex items-center justify-center p-1.5 sm:p-2 transition-transform hover:scale-105 shrink-0">
                    {CurrentIcon && <CurrentIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />}
                  </div>
                  <h2 className="text-sm sm:text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug truncate">
                    {currentServiceMeta?.title}
                  </h2>
                </div>

                {/* Percentage Progress Badge */}
                <div className="h-8 px-3.5 sm:px-4 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#005599] dark:text-[#4da6ff] border border-blue-100 dark:border-blue-800/60 flex items-center gap-2 shadow-xs shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#005599] dark:bg-[#4da6ff] animate-pulse" />
                  <span className="text-xs font-bold">
                    {progress}% Lengkap
                  </span>
                </div>
              </div>

              {/* Form Content Body */}
              <div>
                {activeService === 'sosialisasi' && (
                  <SosialisasiForm
                    onSuccess={handleSuccess}
                    onProgressChange={setProgress}
                  />
                )}
                {activeService === 'peminjaman-sarana' && (
                  <PeminjamanSaranaForm
                    onSuccess={handleSuccess}
                    onProgressChange={setProgress}
                  />
                )}
                {activeService === 'izin-penelitian' && (
                  <IzinPenelitianForm
                    onSuccess={handleSuccess}
                    onProgressChange={setProgress}
                  />
                )}
                {activeService === 'legalisir' && (
                  <LayananLegalisirForm
                    onSuccess={handleSuccess}
                    onProgressChange={setProgress}
                  />
                )}
                {activeService === 'ganti-ijazah' && (
                  <GantiIjazahForm
                    onSuccess={handleSuccess}
                    onProgressChange={setProgress}
                  />
                )}
                {activeService === 'izin-magang' && (
                  <IzinMagangForm
                    onSuccess={handleSuccess}
                    onProgressChange={setProgress}
                  />
                )}
                {activeService === 'mutasi-siswa' && (
                  <MutasiSiswaForm
                    onSuccess={handleSuccess}
                    onProgressChange={setProgress}
                  />
                )}
                {activeService === 'pengaduan' && (
                  <PengaduanForm
                    onSuccess={handleSuccess}
                    onProgressChange={setProgress}
                  />
                )}
                {activeService === 'izin-siswa' && (
                  <IzinSiswaForm
                    onSuccess={handleSuccess}
                    onProgressChange={setProgress}
                  />
                )}
                {activeService === 'buku-tamu' && (
                  <BukuTamuForm
                    onSuccess={handleSuccess}
                    onProgressChange={setProgress}
                  />
                )}
              </div>
            </div>
          )}
        </main>

        {/* Mobile Backdrop matching ACCA-NEW */}
        {mobileSidebarOpen && (
          <div
            className="sidebar-mobile-backdrop"
            onClick={closeMobileSidebar}
            aria-label="Tutup Menu"
          />
        )}
      </div>

      {/* Floating Draggable WhatsApp Helpdesk button */}
      <WhatsAppButton />

      {/* Submission Success Modal with Confetti */}
      <SuccessModal
        data={submissionSuccess}
        onClose={() => {
          setSubmissionSuccess(null);
          setProgress(0);
        }}
        onTrackNow={handleTrackNow}
      />
    </div>
  );
}
