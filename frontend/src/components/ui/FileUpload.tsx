'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, FileText, X, AlertCircle } from 'lucide-react';
import { uploadToR2 } from '@/lib/api';

interface FileUploadProps {
  label?: string;
  helperText?: string;
  subfolder?: string;
  value?: string;
  onChange: (fileUrl: string) => void;
  required?: boolean;
  accept?: string;
  maxSizeMb?: number;
}

export default function FileUpload({
  label,
  helperText = 'Upload scan asli (PDF/JPG)',
  subfolder = 'documents',
  value,
  onChange,
  required = false,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMb = 10,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    // Validate size
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Ukuran berkas (${(file.size / 1024 / 1024).toFixed(1)} MB) melebihi batas maksimal ${maxSizeMb} MB`);
      return;
    }

    setUploading(true);
    setProgress(0);
    setUploadedName(file.name);

    try {
      const res = await uploadToR2(file, subfolder, (pct) => {
        setProgress(pct);
      });
      onChange(res.file_url);
    } catch (err: any) {
      setError(err.message || 'Gagal mengunggah berkas.');
      setUploadedName(null);
      onChange('');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setUploadedName(null);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          {label} {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}

      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[140px] ${
          isDragging
            ? 'border-[#6395EE] bg-blue-50/60 dark:bg-blue-950/30 scale-[1.01]'
            : value
            ? 'border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/30 dark:bg-emerald-950/20'
            : error
            ? 'border-red-300 dark:border-red-800/60 bg-red-50/30 dark:bg-red-950/20'
            : 'border-slate-200 dark:border-[#1e3052] hover:border-[#6395EE]/60 dark:hover:border-[#6395EE] bg-slate-50/50 dark:bg-[#0e172a]/60 hover:bg-white dark:hover:bg-[#121d33]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {value ? (
          <div className="flex items-center gap-3 w-full justify-between px-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-left truncate">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {uploadedName || 'Berkas Terunggah'}
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Tersimpan di Cloudflare R2</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
              title="Hapus berkas"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : uploading ? (
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[#6395EE] dark:text-[#7baaf5]">
              <span>Mengunggah berkas...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-blue-100 dark:bg-blue-950/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#6395EE] to-[#3d72d6] transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-white dark:bg-[#16223b] shadow-sm border border-slate-100 dark:border-[#1e3052] flex items-center justify-center text-slate-400 dark:text-slate-300 mb-2">
              <UploadCloud className="w-6 h-6 stroke-[1.75]" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Pilih File atau Seret ke sini</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{helperText}</p>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-medium mt-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
