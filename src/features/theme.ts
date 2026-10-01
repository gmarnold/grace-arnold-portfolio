import { useSyncExternalStore } from 'react';

export type Theme = 'system' | 'light' | 'dark';
export const themeKey = 'grace-portfolio-theme';
const changed = 'portfolio:theme';

function preference(): Theme {
  const value = document.documentElement.dataset.theme;
  return value === 'light' || value === 'dark' ? value : 'system';
}

export function chooseTheme(theme: Theme) {
  if (theme === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  try {
    if (!document.documentElement.dataset.atmospherePreview) {
      if (theme === 'system') localStorage.removeItem(themeKey);
      else localStorage.setItem(themeKey, theme);
    }
  } catch {
    /* Browsing without storage still supports a session override. */
  }
  window.dispatchEvent(new Event(changed));
}

function snapshot() {
  const theme = preference();
  const dark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  return `${theme}:${dark ? 'dark' : 'light'}`;
}

function subscribe(callback: () => void) {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const update = () => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', snapshot().endsWith(':dark') ? '#211d29' : '#f7f6f2');
    callback();
  };
  const storage = (event: StorageEvent) => {
    if (document.documentElement.dataset.atmospherePreview) return;
    if (event.key !== themeKey && event.key !== null) return;
    if (event.newValue === 'light' || event.newValue === 'dark')
      document.documentElement.dataset.theme = event.newValue;
    else delete document.documentElement.dataset.theme;
    update();
  };
  media.addEventListener('change', update);
  window.addEventListener(changed, update);
  window.addEventListener('storage', storage);
  update();
  return () => {
    media.removeEventListener('change', update);
    window.removeEventListener(changed, update);
    window.removeEventListener('storage', storage);
  };
}

export function useTheme() {
  const value = useSyncExternalStore(subscribe, snapshot, () => 'system:light');
  const [theme, resolved] = value.split(':');
  return { theme: theme as Theme, resolved: resolved as 'light' | 'dark', chooseTheme };
}

const subscribeReady = () => () => {};
export function useInteractive() {
  return useSyncExternalStore(
    subscribeReady,
    () => true,
    () => false,
  );
}
