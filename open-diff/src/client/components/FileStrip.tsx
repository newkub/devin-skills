import { For, Show, createEffect } from 'solid-js';
import type { FileEntry } from '../../types';

interface Props {
  files: FileEntry[];
  indices: number[];
  selected: number;
  onSelect: (i: number) => void;
}

const STATUS: Record<string, { letter: string; cls: string; icon: string }> = {
  new: { letter: 'A', cls: 'text-green-400', icon: 'i-mdi-file-plus-outline' },
  deleted: { letter: 'D', cls: 'text-red-400', icon: 'i-mdi-file-remove-outline' },
  change: { letter: 'M', cls: 'text-amber-400', icon: 'i-mdi-file-edit-outline' },
  'rename-pure': { letter: 'R', cls: 'text-blue-400', icon: 'i-mdi-file-swap-outline' },
  'rename-changed': { letter: 'R', cls: 'text-blue-400', icon: 'i-mdi-file-swap-outline' },
};

function basename(path: string) {
  const i = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  return i >= 0 ? path.slice(i + 1) : path;
}

export default function FileStrip(props: Props) {
  let strip: HTMLDivElement | undefined;
  const cardRefs = new Map<number, HTMLElement>();

  createEffect(() => {
    const el = cardRefs.get(props.selected);
    if (el && strip) {
      el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
  });

  const selectedFile = () => props.files[props.selected];

  return (
    <div class="shrink-0 relative border-b border-[var(--border)] bg-[var(--surface)]/50">
      <div
        ref={strip!}
        class="flex items-stretch gap-2 px-4 pt-3 pb-1 overflow-x-auto overflow-y-hidden file-strip"
      >
        <For each={props.indices}>
          {(idx) => {
            const file = props.files[idx];
            const st = STATUS[file.type] || STATUS.change;
            const active = () => idx === props.selected;
            return (
              <button
                ref={(el) => cardRefs.set(idx, el)}
                onClick={() => props.onSelect(idx)}
                title={file.name}
                class={`relative shrink-0 w-44 px-3 py-2 rounded-lg border text-left transition-all duration-150 ${
                  active()
                    ? 'bg-[var(--surface-2)] border-[var(--focus)]/60 shadow-[0_0_0_1px_var(--focus)/30,0_4px_12px_rgba(0,0,0,0.35)] -translate-y-0.5'
                    : 'bg-[var(--surface)] border-[var(--border)]/70 opacity-60 hover:opacity-100 hover:border-[var(--text-dim)]/40'
                }`}
              >
                <div class="flex items-center gap-2">
                  <span class={`${st.icon} w-4 h-4 ${st.cls} shrink-0`} />
                  <span class="text-xs font-medium truncate text-[var(--text)]">{basename(file.name)}</span>
                  <span class={`ml-auto font-mono text-[10px] font-bold ${st.cls}`}>{st.letter}</span>
                </div>
                <div class="mt-1 flex items-center gap-1.5 text-[10px] font-mono">
                  {file.additions > 0 && <span class="text-green-500">+{file.additions}</span>}
                  {file.deletions > 0 && <span class="text-red-500">-{file.deletions}</span>}
                  <Show when={file.additions === 0 && file.deletions === 0}>
                    <span class="text-[var(--text-dim)]">—</span>
                  </Show>
                </div>
                <Show when={active()}>
                  <div class="absolute left-1/2 -bottom-1 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[var(--focus)]/70" />
                </Show>
              </button>
            );
          }}
        </For>
      </div>
      <Show when={selectedFile()}>
        <div class="flex items-center justify-center px-4 pb-1.5">
          <span class="text-[11px] font-mono text-[var(--text-dim)] truncate" title={selectedFile()!.name}>
            {selectedFile()!.name}
          </span>
        </div>
      </Show>
      <Show when={props.indices.length === 0}>
        <div class="px-4 pb-3 text-center text-xs text-[var(--text-dim)]">No files match filter</div>
      </Show>
    </div>
  );
}
