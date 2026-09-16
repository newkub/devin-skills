import type { Accessor, Setter } from 'solid-js';

export default function DiffToolbar(props: {
  diffStyle: Accessor<'unified' | 'split'>;
  setDiffStyle: Setter<'unified' | 'split'>;
  wrap: Accessor<boolean>;
  setWrap: Setter<boolean>;
  onReload: () => void;
  loading: Accessor<boolean>;
  inputRef: (el: HTMLInputElement) => void;
  fileQuery: Accessor<string>;
  setFileQuery: Setter<string>;
  position: Accessor<string>;
}) {
  return (
    <div class="shrink-0 flex items-center gap-2 px-3 py-1.5 border-b border-[var(--border)] bg-[var(--surface)]/40 text-xs">
      <span class="dim mr-1">View:</span>
      <div class="flex items-center rounded-full border border-[var(--border)] overflow-hidden">
        <button
          class={`px-2.5 py-1 text-[11px] ${props.diffStyle() === 'unified' ? 'bg-[var(--focus)]/15 text-[var(--text)]' : 'text-[var(--text-dim)] hover:text-[var(--text)]'}`}
          onClick={() => props.setDiffStyle('unified')}
        >Unified</button>
        <button
          class={`px-2.5 py-1 text-[11px] border-l border-[var(--border)] ${props.diffStyle() === 'split' ? 'bg-[var(--focus)]/15 text-[var(--text)]' : 'text-[var(--text-dim)] hover:text-[var(--text)]'}`}
          onClick={() => props.setDiffStyle('split')}
        >Split</button>
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
      <div class="relative ml-auto w-52">
        <span class="i-mdi-magnify absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-dim)] pointer-events-none" />
        <input
          ref={props.inputRef}
          class="input !py-1 !pl-7 !rounded-full !text-xs"
          placeholder="Filter files…  (f)"
          value={props.fileQuery()}
          onInput={(e) => props.setFileQuery(e.currentTarget.value)}
        />
      </div>
      <span class="dim font-mono text-[11px]">{props.position()}</span>
    </div>
  );
}
