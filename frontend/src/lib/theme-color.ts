'use client';

/**
 * Utility to synchronize browser chrome (Safari iOS status bar / "bilah jaringan"
 * & bottom URL address bar, Android Chrome header bar) with the active header / sidebar theme.
 *
 * Implements the proven Safari chrome synchronization logic from acca-new.
 */

export function applyThemeColor(isSidebarOpen: boolean = false): void {
  if (typeof document === 'undefined') return;

  const isDark = document.documentElement.classList.contains('dark');
  
  // Both header and sidebar share the same clean solid background:
  // Light: #ffffff, Dark: #0f172a
  const chromeColor = isDark ? '#0f172a' : '#ffffff';
  const schemeVal = isDark ? 'dark' : 'light';

  // 1. Set CSS variable for canvas / mobile background
  document.documentElement.style.setProperty('--app-browser-bg', chromeColor);

  // 2. Synchronize all meta[name="theme-color"] tags
  const metas = Array.from(document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]'));
  if (metas.length > 0) {
    metas.forEach((meta) => {
      meta.setAttribute('content', chromeColor);
      meta.content = chromeColor;
    });
  } else {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.id = 'meta-theme-color';
    meta.content = chromeColor;
    document.head.appendChild(meta);
  }

  // 3. Synchronize meta[name="color-scheme"]
  let csMeta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
  if (!csMeta) {
    csMeta = document.createElement('meta');
    csMeta.name = 'color-scheme';
    csMeta.id = 'color-scheme-meta';
    document.head.appendChild(csMeta);
  }
  csMeta.setAttribute('content', schemeVal);
  csMeta.content = schemeVal;

  if (document.documentElement.style.colorScheme !== schemeVal) {
    document.documentElement.style.colorScheme = schemeVal;
  }

  // 4. Directly update html and body background-color so Safari iOS immediately matches
  if (document.documentElement.style.backgroundColor !== chromeColor) {
    document.documentElement.style.backgroundColor = chromeColor;
  }
  if (document.body && document.body.style.backgroundColor !== chromeColor) {
    document.body.style.backgroundColor = chromeColor;
  }
}
