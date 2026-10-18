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
    <div className="min-h-screen bg-[#f6f8fc] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#6320ee] hover:underline bg-white px-3.5 py-2 rounded-xl shadow-xs border border-slate-200/60"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Pusat Layanan PTSP</span>
          </Link>
          <span className="text-xs font-bold text-slate-400">
            MAN Insan Cendekia Gowa
          </span>
        </div>

        <TrackerView initialToken={token} />
      </div>
    </div>
  );
}
