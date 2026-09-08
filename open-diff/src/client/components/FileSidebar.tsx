import { For, Show } from 'solid-js';
import type { DiffFile } from '../../types';

interface Props {
  files: DiffFile[];
  indices: number[];
  selected: number;
  onSelect: (i: number) => void;
  query: string;
  onQuery: (q: string) => void;
  filterRef?: (el: HTMLInputElement) => void;
}

const STATUS: Record<string, { letter: string; cls: string }> = {
  new: { letter: 'A', cls: 'text-green-400' },
  deleted: { letter: 'D', cls: 'text-red-400' },
  change: { letter: 'M', cls: 'text-amber-400' },
  'rename-pure': { letter: 'R', cls: 'text-blue-400' },
  'rename-changed': { letter: 'R', cls: 'text-blue-400' },
};

function basename(path: string) {
  const i = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  return i >= 0 ? path.slice(i + 1) : path;
}

function dirname(path: string) {
  const i = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  return i >= 0 ? path.slice(0, i) : '';
}

export default function FileSidebar(props: Props) {
  return (
    <aside class="w-72 shrink-0 border-r border-[var(--border)] flex flex-col bg-[var(--surface)]">
      <div class="px-3 pt-3 pb-2 space-y-2 border-b border-[var(--border)]">
        <div class="text-xs font-medium text-[var(--text-dim)] uppercase tracking-wide flex items-center justify-between">
          <span>Changed files</span>
          <span class="font-mono">{props.indices.length}/{props.files.length}</span>
        </div>
        <div class="relative">
          <span class="i-mdi-magnify absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-dim)] pointer-events-none" />
          <input
            ref={props.filterRef}
            class="input !py-1 !pl-7 !text-xs"
            placeholder="Filter files…  (f)"
            value={props.query}
            onInput={(e) => props.onQuery(e.currentTarget.value)}
          />
        </div>
      </div>
      <div class="flex-1 overflow-y-auto">
        <Show
          when={props.indices.length > 0}
          fallback={<div class="px-3 py-6 text-center text-xs text-[var(--text-dim)]">No files match “{props.query}”</div>}
        >
          <For each={props.indices}>
            {(idx) => {
              const file = props.files[idx];
              const st = STATUS[file.meta.type] || STATUS.change;
              return (
                <button
                  onClick={() => props.onSelect(idx)}
                  class={`w-full text-left px-3 py-2 border-b border-[var(--border)]/60 transition-colors ${
                    idx === props.selected
                      ? 'file-item-active bg-[var(--focus)]/10 border-l-2 border-l-[var(--focus)]'
                      : 'hover:bg-[var(--surface-2)]/60 border-l-2 border-l-transparent'
                  }`}
                >
                  <div class="flex items-center gap-2">
                    <span class={`w-4 text-center font-mono text-[11px] font-semibold ${st.cls}`}>{st.letter}</span>
                    <span class="text-[13px] text-[var(--text)] truncate font-medium">{basename(file.meta.name)}</span>
                    <span class="ml-auto text-[11px] font-mono flex gap-1.5 shrink-0">
                      {file.additions > 0 && <span class="text-green-500">+{file.additions}</span>}
                      {file.deletions > 0 && <span class="text-red-500">-{file.deletions}</span>}
                    </span>
                  </div>
                  <Show when={dirname(file.meta.name)}>
                    <div class="pl-6 truncate text-[11px] text-[var(--text-dim)]" title={file.meta.name}>
                      {dirname(file.meta.name)}
                    </div>
                  </Show>
                </button>
              );
            }}
          </For>
        </Show>
      </div>
    </aside>
  );
}
