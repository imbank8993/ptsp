import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PTSP Digital - MAN Insan Cendekia Gowa',
  description:
    'Pusat Pelayanan Terpadu Satu Pintu (PTSP) MAN Insan Cendekia Gowa. Layanan terpadu pengajuan izin, peminjaman sarana, legalisir, pengaduan, dan tracking token secara online.',
  icons: {
    icon: '/Logo Insan Cendekia.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased selection:bg-[#2d79d6] selection:text-white">
        {children}
      </body>
    </html>
  );
}
