import { onMount, onCleanup, createEffect, createSignal, Show } from 'solid-js';
import { FileDiff, type FileDiffMetadata } from '@pierre/diffs';
import type { FileEntry } from '../types';

const STATUS_ICON: Record<string, { cls: string; icon: string }> = {
  new: { cls: 'text-green-400', icon: 'i-mdi-file-plus-outline' },
  deleted: { cls: 'text-red-400', icon: 'i-mdi-file-remove-outline' },
  change: { cls: 'text-amber-400', icon: 'i-mdi-file-edit-outline' },
  'rename-pure': { cls: 'text-blue-400', icon: 'i-mdi-file-swap-outline' },
  'rename-changed': { cls: 'text-blue-400', icon: 'i-mdi-file-swap-outline' },
};

interface Props {
  file?: FileEntry;
  meta?: FileDiffMetadata;
  theme: 'dark' | 'light';
  diffStyle: 'unified' | 'split';
  wrap: boolean;
}

export default function DiffView(props: Props) {
  let wrapper: HTMLDivElement | undefined;
  let instance: FileDiff | undefined;
  const [showTop, setShowTop] = createSignal(false);
  const [copied, setCopied] = createSignal(false);

  onMount(() => {
    if (!wrapper) return;
    instance = new FileDiff({
      diffStyle: 'unified',
      theme: { dark: 'github-dark', light: 'github-light' },
      disableFileHeader: true,
    });
  });

  onCleanup(() => {
    instance?.cleanUp();
  });

  createEffect(() => {
    if (!instance) return;
    if (props.file && wrapper) wrapper.scrollTop = 0;
    instance.setThemeType(props.theme);
    instance.setOptions({
      diffStyle: props.diffStyle,
      overflow: props.wrap ? 'wrap' : 'scroll',
      disableFileHeader: true,
    });
    if (props.file && props.meta) {
      instance.render({
        fileDiff: props.meta,
        containerWrapper: wrapper!,
      });
    } else if (props.file) {
      wrapper!.innerHTML = '<div class="p-8 text-center text-[var(--text-dim)] text-sm flex items-center justify-center gap-2"><span class="i-mdi-loading w-4 h-4 animate-spin" />Parsing…</div>';
    } else {
      wrapper!.innerHTML = '<div class="p-8 text-center text-[var(--text-dim)] text-sm">No file selected.</div>';
    }
  });

  const copyPath = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div class="flex-1 flex flex-col overflow-hidden relative">
      <Show when={props.file}>
        {(f) => (
          <div class="shrink-0 flex items-center gap-2 px-4 py-1.5 border-b border-[var(--border)] bg-[var(--surface)]/60 text-xs">
            <span class={`${STATUS_ICON[f().type]?.icon ?? 'i-mdi-file-edit-outline'} w-3.5 h-3.5 ${STATUS_ICON[f().type]?.cls ?? 'text-amber-400'}`} />
            <span class="font-mono text-[var(--text)] truncate">{f().name}</span>
            <button
              class="dim hover:text-[var(--text)] transition-colors shrink-0"
              title={copied() ? 'Copied!' : 'Copy path'}
              onClick={() => copyPath(f().name)}
            >
              <span class={`${copied() ? 'i-mdi-check text-green-400' : 'i-mdi-content-copy'} w-3.5 h-3.5`} />
            </button>
            <span class="ml-auto flex items-center gap-1.5 font-mono text-[11px]">
              <Show when={f().additions > 0}><span class="text-green-500">+{f().additions}</span></Show>
              <Show when={f().deletions > 0}><span class="text-red-500">-{f().deletions}</span></Show>
            </span>
          </div>
        )}
      </Show>
      <div
        ref={wrapper!}
        class="diff-scroll flex-1 overflow-auto"
        onScroll={(e) => setShowTop(e.currentTarget.scrollTop > 600)}
      />
      <Show when={showTop()}>
        <button
          class="absolute bottom-4 right-4 z-40 w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--border)] shadow-lg flex items-center justify-center text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--focus)]/50 transition-all"
          title="Scroll to top"
          onClick={() => wrapper?.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span class="i-mdi-arrow-up w-4 h-4" />
        </button>
      </Show>
    </div>
  );
}
