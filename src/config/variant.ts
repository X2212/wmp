const buildVariant = (() => {
  try {
    return import.meta.env?.VITE_VARIANT || 'full';
  } catch {
    return 'full';
  }
})();

function readStoredVariant(): string | null {
  try {
    const stored = localStorage.getItem('worldmonitor-variant');
    if (stored === 'tech' || stored === 'full' || stored === 'finance' || stored === 'happy' || stored === 'commodity') return stored;
  } catch { /* ignore */ }
  return null;
}

export const IS_OFFICIAL_WORLDMONITOR_HOST: boolean = (() => {
  if (typeof window === 'undefined') return true;
  const h = location.hostname;
  return h === 'worldmonitor.app'
    || h === 'www.worldmonitor.app'
    || h.endsWith('.worldmonitor.app');
})();

export const SITE_VARIANT: string = (() => {
  if (typeof window === 'undefined') return buildVariant;

  const isTauri = '__TAURI_INTERNALS__' in window || '__TAURI__' in window;
  if (isTauri) {
    const stored = readStoredVariant();
    if (stored) return stored;
    return buildVariant;
  }

  const h = location.hostname;
  if (h.startsWith('tech.')) return 'tech';
  if (h.startsWith('finance.')) return 'finance';
  if (h.startsWith('happy.')) return 'happy';
  if (h.startsWith('commodity.')) return 'commodity';

  if (h === 'localhost' || h === '127.0.0.1') {
    const stored = readStoredVariant();
    if (stored) return stored;
    return buildVariant;
  }

  // Non-official hosts (e.g., Vercel previews, forks, custom domains) can still
  // switch variants via localStorage without redirecting to worldmonitor.app.
  if (!IS_OFFICIAL_WORLDMONITOR_HOST) {
    const stored = readStoredVariant();
    if (stored) return stored;
    return buildVariant;
  }

  return 'full';
})();
