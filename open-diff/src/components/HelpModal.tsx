export default function HelpModal(props: { onClose: () => void }) {
  return (
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={props.onClose}
    >
      <div class="panel w-80 p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-semibold">Keyboard shortcuts</h2>
          <button class="dim hover:text-[var(--text)]" onClick={props.onClose}>
            <span class="i-mdi-close w-4 h-4" />
          </button>
        </div>
        <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
          <span class="flex gap-1"><kbd class="kbd">←</kbd><kbd class="kbd">→</kbd><kbd class="kbd">[</kbd><kbd class="kbd">]</kbd></span><span class="dim">Previous / next file</span>
          <span class="flex gap-1"><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd><kbd class="kbd">j</kbd><kbd class="kbd">k</kbd></span><span class="dim">Scroll diff</span>
          <span class="flex gap-1"><kbd class="kbd">PgUp</kbd><kbd class="kbd">PgDn</kbd></span><span class="dim">Page scroll</span>
          <span><kbd class="kbd">f</kbd></span><span class="dim">Focus file filter</span>
          <span><kbd class="kbd">v</kbd></span><span class="dim">Toggle unified / split</span>
          <span><kbd class="kbd">w</kbd></span><span class="dim">Toggle line wrap</span>
          <span><kbd class="kbd">r</kbd></span><span class="dim">Reload diff</span>
          <span><kbd class="kbd">t</kbd></span><span class="dim">Toggle theme</span>
          <span><kbd class="kbd">?</kbd></span><span class="dim">This help</span>
          <span><kbd class="kbd">Esc</kbd></span><span class="dim">Close menu / blur input</span>
        </div>
      </div>
    </div>
  );
}
