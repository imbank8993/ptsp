'use client';

import React, { useState, useEffect } from 'react';
import Sidebar, { PTSP_SERVICES } from '@/components/Sidebar';
import Header from '@/components/Header';
import MascotBot from '@/components/ui/MascotBot';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import SuccessModal from '@/components/ui/SuccessModal';
import TrackerView from '@/components/tracker/TrackerView';

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

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('ptsp_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

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
    <div className="h-screen w-screen flex overflow-hidden bg-[#f1f5fa] dark:bg-[#0a1120] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Left Sidebar (Independent scrolling) */}
      <Sidebar
        activeService={activeService}
        onSelectService={(id) => {
          setActiveService(id);
          setProgress(0);
        }}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Container (Independent scrolling, clean without visible scrollbar) */}
      <div className="flex-1 h-screen overflow-y-auto no-scrollbar flex flex-col min-w-0">
        <Header
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenTracker={() => {
            setActiveService('tracker');
            setProgress(0);
          }}
          isDark={isDark}
          onToggleDark={handleToggleDark}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto w-full">
          {activeService === 'tracker' ? (
            /* Tracker View */
            <TrackerView initialToken={trackerInitialCode} />
          ) : (
            /* Main Form Card */
            <div className="bg-white dark:bg-[#121d33] rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 dark:border-[#1e3052] transition-colors duration-200 relative">
              {/* Form Header */}
              <div className="flex items-center justify-between pb-8 mb-8 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl bg-white dark:bg-[#182744] shadow-md border border-slate-100 dark:border-slate-800 flex items-center justify-center p-2.5 transition-transform hover:scale-105"
                    style={{ color: currentServiceMeta?.accent || '#2d79d6' }}
                  >
                    {CurrentIcon && <CurrentIcon className="w-8 h-8 stroke-[1.8]" />}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 leading-tight">
                      {currentServiceMeta?.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10.5px] font-extrabold uppercase tracking-widest text-[#2d79d6] dark:text-[#60a5fa]">
                        PUSAT PENGAJUAN DIGITAL
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                        MAN IC Gowa
                      </span>
                    </div>
                  </div>
                </div>

                {/* Percentage Progress Badge */}
                <div className="px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2d79d6] dark:text-[#60a5fa] border border-blue-100 dark:border-blue-800/60 flex items-center gap-2 shadow-xs shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#2d79d6] dark:bg-[#60a5fa] animate-pulse" />
                  <span className="text-xs font-black font-mono">
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
      </div>

      {/* Interactive Mascot Bot at Bottom Right */}
      <MascotBot progress={progress} />

      {/* Floating WhatsApp Helpdesk button */}
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
