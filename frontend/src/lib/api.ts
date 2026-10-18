import { SubmissionResponse, TrackingData } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Upload a file to Cloudflare R2 via backend
 */
export async function uploadToR2(
  file: File,
  subfolder = 'documents',
  onProgress?: (percent: number) => void,
): Promise<{ file_url: string; file_path: string; file_size: number }> {
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `${API_BASE}/api/ptsp/upload?subfolder=${encodeURIComponent(subfolder)}`;

    xhr.open('POST', url, true);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && res.ok) {
          resolve(res);
        } else {
          reject(new Error(res.message || 'Gagal mengunggah berkas.'));
        }
      } catch (err) {
        reject(new Error('Format balasan server tidak valid.'));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Koneksi ke server unggah terputus.'));
    };

    xhr.send(formData);
  });
}

/**
 * Submit PTSP form payload to NestJS backend
 */
export async function submitPtspForm(
  endpoint: string,
  payload: any,
): Promise<SubmissionResponse> {
  const res = await fetch(`${API_BASE}/api/ptsp/submit/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.message || 'Gagal mengirim permohonan.');
  }

  return data;
}

/**
 * Track request status by token or short code
 */
export async function trackPtsp(tokenOrCode: string): Promise<TrackingData> {
  const res = await fetch(`${API_BASE}/api/ptsp/track/${encodeURIComponent(tokenOrCode.trim())}`);
  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.message || 'Permohonan tidak ditemukan.');
  }
  return data;
}
