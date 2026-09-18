import type { Accessor, Setter } from 'solid-js';

export default function DiffToolbar(props: {
  diffStyle: Accessor<'unified' | 'split' | 'stacked'>;
  setDiffStyle: Setter<'unified' | 'split' | 'stacked'>;
  wrap: Accessor<boolean>;
  setWrap: Setter<boolean>;
  onReload: () => void;
  loading: Accessor<boolean>;
  position: Accessor<string>;
  fileName: Accessor<string>;
}) {
  return (
    <div class="shrink-0 flex items-center gap-2 px-3 py-1.5 border-b border-[var(--border)] bg-[var(--surface)]/40 text-xs">
      <span
        class="font-mono text-[11px] text-[var(--text-dim)] truncate max-w-72"
        title={props.fileName()}
      >
        {props.fileName() || 'No file selected'}
      </span>
      <div class="flex items-center gap-2 ml-auto">
        <div class="flex items-center rounded-full border border-[var(--border)] overflow-hidden">
          <button
            class={`px-2.5 py-1 text-[11px] ${props.diffStyle() === 'unified' ? 'bg-[var(--focus)]/15 text-[var(--text)]' : 'text-[var(--text-dim)] hover:text-[var(--text)]'}`}
            onClick={() => props.setDiffStyle('unified')}
            title="Unified view (v)"
          >Unified</button>
          <button
            class={`px-2.5 py-1 text-[11px] border-l border-[var(--border)] ${props.diffStyle() === 'split' ? 'bg-[var(--focus)]/15 text-[var(--text)]' : 'text-[var(--text-dim)] hover:text-[var(--text)]'}`}
            onClick={() => props.setDiffStyle('split')}
            title="Split view — left/right columns (v)"
          >Split</button>
          <button
            class={`px-2.5 py-1 text-[11px] border-l border-[var(--border)] ${props.diffStyle() === 'stacked' ? 'bg-[var(--focus)]/15 text-[var(--text)]' : 'text-[var(--text-dim)] hover:text-[var(--text)]'}`}
            onClick={() => props.setDiffStyle('stacked')}
            title="Stacked view — old on top, new below (v)"
          >Stacked</button>
        </div>
        <button
          class={`px-2.5 py-1 text-[11px] rounded-full border ${props.wrap() ? 'border-[var(--focus)]/50 bg-[var(--focus)]/10 text-[var(--text)]' : 'border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text)]'}`}
          onClick={() => props.setWrap(!props.wrap())}
          title="Toggle line wrap (w)"
        >Wrap</button>
        <button
          class="px-2 py-1 text-[11px] rounded-full border border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text)] flex items-center gap-1"
          onClick={props.onReload}
          title="Reload diff (r)"
          disabled={props.loading()}
        >
          <span class={`i-mdi-refresh w-3 h-3 ${props.loading() ? 'animate-spin' : ''}`} />
        </button>
        <span class="dim font-mono text-[11px]">{props.position()}</span>
      </div>
    </div>
  );
}
