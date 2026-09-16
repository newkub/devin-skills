import type { Accessor } from 'solid-js';

export default function StatusFooter(props: {
  onOpenHelp: () => void;
  fileName: Accessor<string>;
}) {
  return (
    <footer class="shrink-0 flex items-center gap-4 px-4 py-1.5 border-t border-[var(--border)] bg-[var(--surface)] text-[11px] text-[var(--text-dim)]">
      <span class="flex items-center gap-1"><kbd class="kbd">←</kbd><kbd class="kbd">→</kbd> files</span>
      <span class="flex items-center gap-1"><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> scroll</span>
      <span class="flex items-center gap-1"><kbd class="kbd">f</kbd> filter</span>
      <span class="flex items-center gap-1"><kbd class="kbd">v</kbd> view</span>
      <span class="flex items-center gap-1"><kbd class="kbd">w</kbd> wrap</span>
      <span class="flex items-center gap-1"><kbd class="kbd">r</kbd> reload</span>
      <span class="flex items-center gap-1"><kbd class="kbd">t</kbd> theme</span>
      <button
        class="flex items-center gap-1 hover:text-[var(--text)] transition-colors"
        onClick={props.onOpenHelp}
      >
        <kbd class="kbd">?</kbd> help
      </button>
      <span class="ml-auto truncate font-mono">{props.fileName()}</span>
    </footer>
  );
}
