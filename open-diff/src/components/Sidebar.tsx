import { createSignal, createEffect, For, Show, type Accessor, type Setter } from 'solid-js';
import { buildFileTree, allDirPaths, type TreeDir, type TreeFile } from '../lib/file-tree';
import { fileIcon, dirIcon } from '../lib/file-icons';
import type { FileEntry } from '../types';

interface Props {
  files: FileEntry[];
  indices: number[];
  selected: number;
  onSelect: (i: number) => void;
  fileQuery: Accessor<string>;
  setFileQuery: Setter<string>;
  inputRef: (el: HTMLInputElement) => void;
  collapsed: Accessor<boolean>;
}

const STATUS: Record<string, { letter: string; cls: string }> = {
  new: { letter: 'A', cls: 'text-green-400' },
  deleted: { letter: 'D', cls: 'text-red-400' },
  change: { letter: 'M', cls: 'text-amber-400' },
  'rename-pure': { letter: 'R', cls: 'text-blue-400' },
  'rename-changed': { letter: 'R', cls: 'text-blue-400' },
};

export default function Sidebar(props: Props) {
  const [collapsedDirs, setCollapsedDirs] = createSignal<Set<string>>(new Set());
  const [allCollapsed, setAllCollapsed] = createSignal(false);

  const tree = () => buildFileTree(props.files, props.indices);

  // Re-expand everything when a new diff loads (file list identity changes)
  createEffect(() => {
    props.files.length;
    setCollapsedDirs(new Set());
    setAllCollapsed(false);
  });

  // Scroll selected file into view (covers keyboard navigation)
  createEffect(() => {
    const sel = props.selected;
    requestAnimationFrame(() => {
      document.querySelector(`[data-file-idx="${sel}"]`)?.scrollIntoView({ block: 'nearest' });
    });
  });

  const toggleDir = (path: string) => {
    const next = new Set(collapsedDirs());
    if (next.has(path)) next.delete(path);
    else next.add(path);
    setCollapsedDirs(next);
  };

  const toggleAll = () => {
    if (allCollapsed()) {
      setCollapsedDirs(new Set());
      setAllCollapsed(false);
    } else {
      setCollapsedDirs(new Set(allDirPaths(tree())));
      setAllCollapsed(true);
    }
  };

  const FileRow = (p: { f: TreeFile; depth: number }) => {
    const st = STATUS[p.f.type] || STATUS.change;
    const active = () => p.f.idx === props.selected;
    return (
      <button
        type="button"
        data-file-idx={p.f.idx}
        onClick={() => props.onSelect(p.f.idx)}
        title={p.f.path}
        class={`w-full flex items-center gap-1.5 pr-2 py-[3px] text-left text-xs transition-colors border-l-2 ${
          active()
            ? 'bg-[var(--focus)]/12 border-[var(--focus)] text-[var(--text)]'
            : 'border-transparent text-[var(--text-dim)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
        }`}
        style={{ 'padding-left': `${8 + p.depth * 14}px` }}
      >
        <span class={`${fileIcon(p.f.name)} w-3.5 h-3.5 shrink-0`} />
        <span class="truncate flex-1">{p.f.name}</span>
        <Show when={p.f.additions > 0 || p.f.deletions > 0}>
          <span class="font-mono text-[9px] flex items-center gap-1 shrink-0">
            <Show when={p.f.additions > 0}><span class="text-green-500">+{p.f.additions}</span></Show>
            <Show when={p.f.deletions > 0}><span class="text-red-500">-{p.f.deletions}</span></Show>
          </span>
        </Show>
        <span class={`font-mono text-[9px] font-bold w-3 text-center shrink-0 ${st.cls}`}>{st.letter}</span>
      </button>
    );
  };

  const DirNode = (p: { dir: TreeDir; depth: number }) => {
    const collapsed = () => collapsedDirs().has(p.dir.path);
    const fileCount = () => {
      let n = p.dir.files.length;
      const walk = (d: TreeDir) => { n += d.files.length; d.dirs.forEach(walk); };
      p.dir.dirs.forEach(walk);
      return n;
    };
    return (
      <div>
        <button
          type="button"
          onClick={() => toggleDir(p.dir.path)}
          class="w-full flex items-center gap-1 pr-2 py-[3px] text-left text-xs text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
          style={{ 'padding-left': `${8 + p.depth * 14}px` }}
        >
          <span class={`i-mdi-chevron-right w-3 h-3 shrink-0 text-[var(--text-dim)] transition-transform ${collapsed() ? '' : 'rotate-90'}`} />
          <span class={`${dirIcon(p.dir.name.split('/').pop()!, !collapsed())} w-3.5 h-3.5 shrink-0`} />
          <span class="truncate flex-1 font-medium">{p.dir.name}</span>
          <span class="font-mono text-[9px] text-[var(--text-dim)] shrink-0">{fileCount()}</span>
        </button>
        <Show when={!collapsed()}>
          <For each={p.dir.dirs}>{(d) => <DirNode dir={d} depth={p.depth + 1} />}</For>
          <For each={p.dir.files}>{(f) => <FileRow f={f} depth={p.depth + 1} />}</For>
        </Show>
      </div>
    );
  };

  return (
    <aside class="shrink-0 w-64 border-r border-[var(--border)] bg-[var(--surface)]/40 flex flex-col overflow-hidden">
      <div class="shrink-0 px-2 py-1.5 border-b border-[var(--border)] flex items-center gap-1.5">
        <span class="i-mdi-file-tree w-3.5 h-3.5 text-[var(--text-dim)]" />
        <span class="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-dim)] flex-1">Files</span>
        <span class="font-mono text-[10px] text-[var(--text-dim)]">{props.indices.length}</span>
        <button
          type="button"
          onClick={toggleAll}
          title={allCollapsed() ? 'Expand all' : 'Collapse all'}
          class="w-5 h-5 rounded flex items-center justify-center text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
        >
          <span class={allCollapsed() ? 'i-mdi-unfold-more-horizontal w-3.5 h-3.5' : 'i-mdi-unfold-less-horizontal w-3.5 h-3.5'} />
        </button>
      </div>
      <div class="shrink-0 px-2 py-1.5 border-b border-[var(--border)] relative">
        <span class="i-mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-dim)] pointer-events-none" />
        <input
          ref={props.inputRef}
          class="input !py-0.5 !pl-6 !rounded !text-[11px]"
          placeholder="Filter… (f)"
          value={props.fileQuery()}
          onInput={(e) => props.setFileQuery(e.currentTarget.value)}
        />
      </div>
      <div class="flex-1 overflow-y-auto overflow-x-hidden py-1">
        <For each={tree().dirs}>{(d) => <DirNode dir={d} depth={0} />}</For>
        <For each={tree().files}>{(f) => <FileRow f={f} depth={0} />}</For>
        <Show when={props.indices.length === 0}>
          <div class="px-3 py-4 text-center text-xs text-[var(--text-dim)]">No files match</div>
        </Show>
      </div>
    </aside>
  );
}
