import { createEffect, onMount, type Accessor, type Setter } from 'solid-js';

export function usePrefs(
  theme: Accessor<'dark' | 'light'>,
  setTheme: Setter<'dark' | 'light'>,
  diffStyle: Accessor<'unified' | 'split'>,
  setDiffStyle: Setter<'unified' | 'split'>,
  wrap: Accessor<boolean>,
  setWrap: Setter<boolean>
) {
  onMount(() => {
    // Restore persisted prefs
    try {
      const t = localStorage.getItem('od-theme');
      if (t === 'dark' || t === 'light') setTheme(t);
      else if (window.matchMedia?.('(prefers-color-scheme: light)').matches) setTheme('light');
      const ds = localStorage.getItem('od-diff-style');
      if (ds === 'unified' || ds === 'split') setDiffStyle(ds);
      if (localStorage.getItem('od-wrap') === '1') setWrap(true);
    } catch {}
  });

  createEffect(() => {
    document.documentElement.classList.toggle('dark', theme() === 'dark');
    document.documentElement.classList.toggle('light', theme() === 'light');
  });

  // Persist UI prefs
  createEffect(() => {
    try {
      localStorage.setItem('od-theme', theme());
      localStorage.setItem('od-diff-style', diffStyle());
      localStorage.setItem('od-wrap', wrap() ? '1' : '0');
    } catch {}
  });
}
