import { presetWind4 } from '@unocss/preset-wind4';
import { defineConfig, presetIcons, transformerVariantGroup, transformerDirectives } from 'unocss';

export default defineConfig({
  presets: [
    presetWind4({
      dark: 'class',
    }),
    presetIcons({
      cdn: 'https://esm.sh/',
    }),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  shortcuts: {
    'btn': 'px-3 py-1.5 rounded-md bg-[var(--surface-2)] hover:bg-[var(--surface)] text-[var(--text)] text-sm font-medium border border-[var(--border)] transition-colors',
    'input': 'w-full px-3 py-2 rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--focus)]',
    'panel': 'bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden',
    'dim': 'text-[var(--text-dim)]',
    'focus-ring': 'focus:outline-none focus:ring-2 focus:ring-[var(--focus)]/50',
    'file-item': 'w-full text-left px-3 py-2 cursor-pointer hover:bg-[var(--surface)] border-b border-[var(--border)]',
  },
});
