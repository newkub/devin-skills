import { onMount, onCleanup, createEffect, Show } from 'solid-js';
import { FileDiff } from '@pierre/diffs';
import type { DiffFile } from '../../types';

interface Props {
  file?: DiffFile;
  theme: 'dark' | 'light';
  diffStyle: 'unified' | 'split';
  wrap: boolean;
}

export default function DiffView(props: Props) {
  let wrapper: HTMLDivElement | undefined;
  let instance: FileDiff | undefined;

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
    instance.setThemeType(props.theme);
    instance.setOptions({
      diffStyle: props.diffStyle,
      overflow: props.wrap ? 'wrap' : 'scroll',
      disableFileHeader: true,
    });
    if (props.file) {
      instance.render({
        fileDiff: props.file.meta,
        containerWrapper: wrapper!,
      });
    } else {
      wrapper!.innerHTML = '<div class="p-8 text-center text-[var(--text-dim)] text-sm">No file selected.</div>';
    }
  });

  const copyPath = () => {
    if (props.file) navigator.clipboard?.writeText(props.file.meta.name).catch(() => {});
  };

  return (
    <div class="flex-1 flex flex-col overflow-hidden">
      <Show when={props.file}>
        <div class="shrink-0 flex items-center gap-2 px-4 py-1.5 border-b border-[var(--border)] bg-[var(--surface)]">
          <span class="i-mdi-file-document-outline w-3.5 h-3.5 text-[var(--text-dim)]" />
          <span class="text-xs font-mono text-[var(--text)] truncate" title={props.file!.meta.name}>
            {props.file!.meta.name}
          </span>
          <span class="text-[11px] font-mono flex gap-1.5 shrink-0">
            {props.file!.additions > 0 && <span class="text-green-500">+{props.file!.additions}</span>}
            {props.file!.deletions > 0 && <span class="text-red-500">-{props.file!.deletions}</span>}
          </span>
          <button
            onClick={copyPath}
            class="ml-auto p-1 rounded hover:bg-[var(--surface-2)] text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
            title="Copy file path"
          >
            <span class="i-mdi-content-copy w-3.5 h-3.5" />
          </button>
        </div>
      </Show>
      <div ref={wrapper!} class="diff-scroll flex-1 overflow-auto" />
    </div>
  );
}
