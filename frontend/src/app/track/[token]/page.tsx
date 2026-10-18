import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TrackerView from '@/components/tracker/TrackerView';

interface TrackPageProps {
  params: Promise<{ token: string }>;
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { token } = await params;

  return (
    <div className="min-h-screen bg-[#f1f5fa] dark:bg-[#0a1120] text-slate-800 dark:text-slate-100 p-4 sm:p-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2B60DE] dark:text-[#5c8cf0] hover:underline bg-white dark:bg-[#121d33] px-3.5 py-2 rounded-xl shadow-xs border border-slate-200/60 dark:border-[#1e3052]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Pusat Layanan PTSP</span>
          </Link>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
            MAN Insan Cendekia Gowa
          </span>
        </div>

        <TrackerView initialToken={token} />
      </div>
    </div>
  );
}
