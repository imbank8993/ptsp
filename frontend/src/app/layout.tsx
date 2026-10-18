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
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('ptsp_theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased selection:bg-[#4169e1] selection:text-white">
        {children}
      </body>
    </html>
  );
}
