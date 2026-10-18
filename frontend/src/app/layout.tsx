import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PTSP MAN Insan Cendekia Gowa',
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
    <html lang="id" suppressHydrationWarning className={poppins.variable}>
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
      <body className={`${poppins.className} antialiased selection:bg-[#2B60DE] selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
