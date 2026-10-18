import type { Metadata, Viewport } from 'next';
import './globals.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export const metadata: Metadata = {
  title: 'PTSP MAN Insan Cendekia Gowa',
  description:
    'Pusat Pelayanan Terpadu Satu Pintu (PTSP) MAN Insan Cendekia Gowa. Layanan terpadu pengajuan izin, peminjaman sarana, legalisir, pengaduan, dan tracking token secara online.',
  icons: {
    icon: '/Logo Insan Cendekia.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PTSP IC Gowa',
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
        <meta name="color-scheme" content="light" id="color-scheme-meta" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" id="theme-color-light-meta" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" id="theme-color-dark-meta" />
        <meta name="theme-color" content="#ffffff" id="meta-theme-color" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var d = localStorage.getItem('ptsp_theme') === 'dark' || (!localStorage.getItem('ptsp_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (d) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                var c = d ? '#0f172a' : '#ffffff';
                var s = d ? 'dark' : 'light';
                document.documentElement.style.backgroundColor = c;
                document.documentElement.style.colorScheme = s;
                document.documentElement.style.setProperty('--app-browser-bg', c);
                var metas = ['meta-theme-color', 'theme-color-light-meta', 'theme-color-dark-meta'];
                for (var i = 0; i < metas.length; i++) {
                  var el = document.getElementById(metas[i]);
                  if (el) { el.content = c; el.setAttribute('content', c); }
                }
                var cs = document.getElementById('color-scheme-meta');
                if (cs) { cs.content = s; cs.setAttribute('content', s); }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased selection:bg-[#005599] selection:text-white">
        {children}
      </body>
    </html>
  );
}
