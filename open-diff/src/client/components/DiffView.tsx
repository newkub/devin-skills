import { onMount, onCleanup, createEffect } from 'solid-js';
import { FileDiff, type FileDiffMetadata } from '@pierre/diffs';
import type { FileEntry } from '../../types';

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

  return (
    <div class="flex-1 flex flex-col overflow-hidden">
      <div ref={wrapper!} class="diff-scroll flex-1 overflow-auto" />
    </div>
  );
}
