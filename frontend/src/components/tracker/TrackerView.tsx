'use client';

import React, { useState, useEffect } from 'react';
import { Search, QrCode, CheckCircle2, Clock, AlertTriangle, XCircle, ArrowRight, Copy, CheckCheck, RefreshCw } from 'lucide-react';
import { trackPtsp } from '@/lib/api';
import { TrackingData } from '@/types';

interface TrackerViewProps {
  initialToken?: string;
}

export default function TrackerView({ initialToken = '' }: TrackerViewProps) {
  const [query, setQuery] = useState(initialToken);
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialToken) {
      handleSearch(initialToken);
    }
  }, [initialToken]);

  const handleSearch = async (codeToSearch?: string) => {
    const target = (codeToSearch || query).trim();
    if (!target) {
      setError('Masukkan kode token atau short code terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await trackPtsp(target);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Permohonan tidak ditemukan.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (data?.short_code) {
      navigator.clipboard.writeText(data.short_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Search Card */}
      <div className="bg-white dark:bg-[#121d33] rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-[#1e3052] transition-colors duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#6395EE] dark:text-[#7baaf5] flex items-center justify-center border border-blue-100 dark:border-blue-900/50 shadow-sm">
            <QrCode className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">
              Lacak Status Permohonan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pantau progres permohonan PTSP menggunakan Kode Lacak (Short Code) atau Token UUID.
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Contoh: PTSP-K8J29A atau token UUID"
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#0e172a] border border-slate-200 dark:border-[#1e3052] rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-100 outline-none focus:border-[#6395EE] focus:bg-white dark:focus:bg-[#10192d] focus:ring-4 focus:ring-blue-100/50 dark:focus:ring-blue-900/30 transition uppercase tracking-wider"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 bg-gradient-to-r from-[#6395EE] to-[#3d72d6] hover:from-[#5084e6] hover:to-[#2e62c4] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Cek Status</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 flex items-start gap-3 text-red-700 dark:text-red-400 text-xs font-semibold animate-in fade-in">
            <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Result Card */}
      {data && (
        <div className="bg-white dark:bg-[#121d33] rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-[#1e3052] space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Header Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Jenis Layanan:
                </span>
                <span className="text-xs font-black text-[#6395EE] dark:text-[#7baaf5] bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-lg border border-blue-100 dark:border-blue-900/50">
                  {data.service_type}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {data.applicant_masked_name || 'Pemohon'}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Diajukan pada {new Date(data.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <div
                className={`px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-2 self-start sm:self-auto ${
                  data.status_code === 100
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    : data.status_code === 0
                    ? 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    data.status_code === 100
                      ? 'bg-emerald-500'
                      : data.status_code === 0
                      ? 'bg-red-500'
                      : 'bg-amber-500'
                  }`}
                />
                <span>{data.status_label}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-[#0e172a] px-3 py-1 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <span>Kode: </span>
                <strong className="text-slate-800 dark:text-slate-100 font-bold">{data.short_code}</strong>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="ml-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  title="Salin Kode"
                >
                  {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="text-slate-600 dark:text-slate-400">Progres Permohonan</span>
              <span className="text-[#6395EE] dark:text-[#7baaf5]">{data.progress_percent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-[#0e172a] rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  data.status_code === 0
                    ? 'bg-red-500'
                    : data.status_code === 100
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-[#6395EE] to-[#3d72d6]'
                }`}
                style={{ width: `${Math.max(data.progress_percent, 5)}%` }}
              />
            </div>
          </div>

          {/* Admin Note if available */}
          {data.catatan_admin && (
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
              <p className="text-xs font-bold text-[#6395EE] dark:text-[#7baaf5] uppercase tracking-wider mb-1">
                Catatan dari Petugas PTSP:
              </p>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium italic">
                "{data.catatan_admin}"
              </p>
            </div>
          )}

          {/* Timeline */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              Tahapan Pelayanan
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {data.timeline.map((step, idx) => {
                const isCompleted = step.status === 'completed';
                const isCurrent = step.status === 'current';
                const isRejected = step.status === 'rejected';

                return (
                  <div key={idx} className="relative">
                    {/* Step Icon */}
                    <div
                      className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-[#121d33] ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-[#6395EE] text-white animate-pulse'
                          : isRejected
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                      ) : isRejected ? (
                        <XCircle className="w-3 h-3 stroke-[2.5]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <p
                          className={`text-sm font-bold leading-tight ${
                            isCurrent
                              ? 'text-[#6395EE] dark:text-[#7baaf5]'
                              : isRejected
                              ? 'text-red-600 dark:text-red-400'
                              : isCompleted
                              ? 'text-slate-800 dark:text-slate-200'
                              : 'text-slate-400 dark:text-slate-600'
                          }`}
                        >
                          {step.title}
                        </p>
                        {step.timestamp && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            • {step.timestamp}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
