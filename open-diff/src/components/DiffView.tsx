import { onCleanup, createEffect, createSignal, Show } from 'solid-js';
import { FileDiff, type FileDiffMetadata } from '@pierre/diffs';
import type { FileEntry } from '../types';

const STATUS_ICON: Record<string, { cls: string; icon: string }> = {
  new: { cls: 'text-green-400', icon: 'i-mdi-file-plus-outline' },
  deleted: { cls: 'text-red-400', icon: 'i-mdi-file-remove-outline' },
  change: { cls: 'text-amber-400', icon: 'i-mdi-file-edit-outline' },
  'rename-pure': { cls: 'text-blue-400', icon: 'i-mdi-file-swap-outline' },
  'rename-changed': { cls: 'text-blue-400', icon: 'i-mdi-file-swap-outline' },
};

type ViewMode = 'unified' | 'split' | 'stacked';

interface Props {
  file?: FileEntry;
  meta?: FileDiffMetadata;
  theme: 'dark' | 'light';
  diffStyle: ViewMode;
  wrap: boolean;
}

function makeDiff() {
  return new FileDiff({
    diffStyle: 'unified',
    theme: { dark: 'github-dark', light: 'github-light' },
    disableFileHeader: true,
  });
}

function reAnim(el?: HTMLElement) {
  if (!el) return;
  el.classList.remove('diff-in');
  void el.offsetWidth;
  el.classList.add('diff-in');
}

export default function DiffView(props: Props) {
  let wrapper: HTMLDivElement | undefined;
  let topWrap: HTMLDivElement | undefined;
  let botWrap: HTMLDivElement | undefined;
  let instMain: FileDiff | undefined;
  let instOld: FileDiff | undefined;
  let instNew: FileDiff | undefined;
  const [showTop, setShowTop] = createSignal(false);
  const [copied, setCopied] = createSignal(false);

  const stacked = () => props.diffStyle === 'stacked';

  const emptyHtml = (msg: string) =>
    `<div class="p-8 text-center text-[var(--text-dim)] text-sm">${msg}</div>`;
  const loadingHtml =
    '<div class="p-8 text-center text-[var(--text-dim)] text-sm flex items-center justify-center gap-2"><span class="i-mdi-loading w-4 h-4 animate-spin" />Parsing…</div>';

  onCleanup(() => {
    instMain?.cleanUp();
    instOld?.cleanUp();
    instNew?.cleanUp();
  });

  createEffect(() => {
    const file = props.file;
    const meta = props.meta;
    const theme = props.theme;
    const style = props.diffStyle;
    const overflow = props.wrap ? 'wrap' : 'scroll';

    if (style === 'stacked') {
      if (!instOld) instOld = makeDiff();
      if (!instNew) instNew = makeDiff();
      instOld.setThemeType(theme);
      instNew.setThemeType(theme);
      instOld.setOptions({ diffStyle: 'unified', overflow, disableFileHeader: true });
      instNew.setOptions({ diffStyle: 'unified', overflow, disableFileHeader: true });
      if (file && meta && topWrap && botWrap) {
        topWrap.scrollTop = 0;
        botWrap.scrollTop = 0;
        instOld.render({ fileDiff: meta, containerWrapper: topWrap });
        instNew.render({ fileDiff: meta, containerWrapper: botWrap });
      } else if (file) {
        if (topWrap) topWrap.innerHTML = loadingHtml;
        if (botWrap) botWrap.innerHTML = loadingHtml;
      } else {
        if (topWrap) topWrap.innerHTML = emptyHtml('No file selected.');
        if (botWrap) botWrap.innerHTML = emptyHtml('No file selected.');
      }
      reAnim(topWrap);
      reAnim(botWrap);
      return;
    }

    if (!instMain) instMain = makeDiff();
    instMain.setThemeType(theme);
    instMain.setOptions({ diffStyle: style, overflow, disableFileHeader: true });
    if (file && wrapper) wrapper.scrollTop = 0;
    if (file && meta && wrapper) {
      instMain.render({ fileDiff: meta, containerWrapper: wrapper });
    } else if (file && wrapper) {
      wrapper.innerHTML = loadingHtml;
    } else if (wrapper) {
      wrapper.innerHTML = emptyHtml('No file selected.');
    }
    reAnim(wrapper);
  });

  const copyPath = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const onScroll = (e: Event) => setShowTop((e.currentTarget as HTMLElement).scrollTop > 600);
  const scrollTop = () =>
    (stacked() ? botWrap : wrapper)?.scrollTo({ top: 0, behavior: 'smooth' });

  const PaneLabel = (p: { icon: string; label: string; cls: string }) => (
    <div class="shrink-0 flex items-center gap-1.5 px-3 py-1 border-b border-[var(--border)] bg-[var(--surface-2)]/50 text-[10px] font-semibold uppercase tracking-wider">
      <span class={`${p.icon} w-3 h-3 ${p.cls}`} />
      <span class={p.cls}>{p.label}</span>
      <Show when={props.file}>
        <span class="font-mono normal-case text-[var(--text-dim)] truncate ml-1">{props.file!.name}</span>
      </Show>
    </div>
  );

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

      <Show when={stacked()}>
        <div class="flex-1 flex flex-col overflow-hidden">
          <PaneLabel icon="i-mdi-arrow-up-box" label="Old" cls="text-red-400" />
          <div ref={topWrap!} class="diff-scroll diff-old flex-1 overflow-auto" onScroll={onScroll} />
          <PaneLabel icon="i-mdi-arrow-down-box" label="New" cls="text-green-400" />
          <div ref={botWrap!} class="diff-scroll diff-new flex-1 overflow-auto" onScroll={onScroll} />
        </div>
      </Show>
      <Show when={!stacked()}>
        <div ref={wrapper!} class="diff-scroll flex-1 overflow-auto" onScroll={onScroll} />
      </Show>

      <Show when={showTop()}>
        <button
          class="absolute bottom-4 right-4 z-40 w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--border)] shadow-lg flex items-center justify-center text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--focus)]/50 transition-all"
          title="Scroll to top"
          onClick={scrollTop}
        >
          <span class="i-mdi-arrow-up w-4 h-4" />
        </button>
      </Show>
    </div>
  );
}
