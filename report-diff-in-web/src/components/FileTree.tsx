import { For, Show, createSignal, type JSX } from 'solid-js';
import type { FileDiffMetadata } from '@pierre/diffs';
import type { FileEntry } from '../types';
import type { FileTree as FileTreeData, TreeDir } from '../lib/file-tree';
import { fileIcon, fileKind, statusIcon } from '../lib/file-icons';

function FileRow(props: {
  file: FileEntry;
  label: string;
  prefix?: string;
  active: boolean;
  viewed: boolean;
  broken: boolean;
  indent: number;
  onSelect: () => void;
  onToggleViewed: () => void;
}) {
  const icon = () => {
    const kind = fileKind(props.file.type);
    return kind === 'change' ? fileIcon(props.file.name) : statusIcon(props.file.type);
  };
  const deleted = () => fileKind(props.file.type) === 'deleted';
  return (
    <div
      role="button"
      tabindex={0}
      title={props.file.name}
      onClick={props.onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          props.onSelect();
        }
      }}
      style={{ 'padding-left': `${props.indent + 8}px` }}
      class={`group flex cursor-pointer items-center gap-2 rounded-md border-l-2 py-1.5 pr-1.5 text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-focus ${
        props.active
          ? 'border-accent bg-muted text-foreground'
          : 'border-transparent text-secondary-foreground hover:bg-secondary'
      }`}
    >
      <span class={`${icon().icon} shrink-0 text-sm ${icon().tone}`} />
      <div class="min-w-0 flex-1">
        <div class="flex items-baseline gap-1">
          <span class={`truncate font-medium ${deleted() ? 'text-muted-foreground line-through decoration-destructive/60' : ''}`}>
            {props.label}
          </span>
          <Show when={props.prefix}>
            <span class="truncate text-[10px] text-muted-foreground">{props.prefix}</span>
          </Show>
        </div>
      </div>
      <Show when={props.broken}>
        <span class="i-mdi-file-question-outline shrink-0 text-xs text-warning" title="No preview" />
      </Show>
      <span class="flex shrink-0 items-center gap-1 font-mono text-[10px] tabular-nums">
        <Show when={props.file.additions > 0}>
          <span class="text-success">+{props.file.additions}</span>
        </Show>
        <Show when={props.file.deletions > 0}>
          <span class="text-destructive">−{props.file.deletions}</span>
        </Show>
      </span>
      <button
        type="button"
        title={props.viewed ? 'Mark unviewed' : 'Mark viewed'}
        aria-label={props.viewed ? 'Mark unviewed' : 'Mark viewed'}
        onClick={(event) => {
          event.stopPropagation();
          props.onToggleViewed();
        }}
        class={`grid size-4 shrink-0 place-items-center rounded-full border transition-colors ${
          props.viewed
            ? 'border-success bg-success text-success-foreground'
            : 'border-border text-transparent hover:border-muted-foreground'
        }`}
      >
        <span class="i-mdi-check text-[10px]" />
      </button>
    </div>
  );
}

function DirView(props: {
  dir: TreeDir;
  depth: number;
  renderFile: (file: TreeDir['files'][number], depth: number) => JSX.Element;
}) {
  const [open, setOpen] = createSignal(true);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={{ 'padding-left': `${props.depth * 10 + 8}px` }}
        class="flex w-full items-center gap-1.5 rounded-md py-1 pr-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <span class={`${open() ? 'i-mdi-chevron-down' : 'i-mdi-chevron-right'} text-sm`} />
        <span class="i-mdi-folder-outline text-sm text-primary" />
        <span class="truncate">{props.dir.name}</span>
      </button>
      <Show when={open()}>
        <For each={props.dir.dirs}>{(child) => <DirView dir={child} depth={props.depth + 1} renderFile={props.renderFile} />}</For>
        <For each={props.dir.files}>{(file) => props.renderFile(file, props.depth + 1)}</For>
      </Show>
    </div>
  );
}

export default function FileTree(props: {
  files: FileEntry[];
  indices: number[];
  metas: (FileDiffMetadata | null)[];
  activeIdx: number | null;
  viewed: Set<number>;
  treeView: boolean;
  tree: FileTreeData;
  onSelect: (index: number) => void;
  onToggleViewed: (index: number) => void;
}) {
  return (
    <div class="min-h-0 flex-1 overflow-auto px-2 py-2">
      <Show
        when={props.indices.length > 0}
        fallback={
          <div class="flex h-full flex-col items-center justify-center gap-1.5 text-center">
            <span class="i-mdi-file-search-outline text-2xl text-muted-foreground" />
            <p class="text-xs text-muted-foreground">No files match the filter.</p>
          </div>
        }
      >
        <Show
          when={props.treeView}
          fallback={
            <For each={props.indices}>
              {(idx) => {
                const file = () => props.files[idx];
                const slash = () => Math.max(file().name.lastIndexOf('/'), file().name.lastIndexOf('\\'));
                return (
                  <FileRow
                    file={file()}
                    label={slash() >= 0 ? file().name.slice(slash() + 1) : file().name}
                    prefix={slash() >= 0 ? file().name.slice(0, slash() + 1) : undefined}
                    active={props.activeIdx === idx}
                    viewed={props.viewed.has(idx)}
                    broken={!props.metas[idx]}
                    indent={0}
                    onSelect={() => props.onSelect(idx)}
                    onToggleViewed={() => props.onToggleViewed(idx)}
                  />
                );
              }}
            </For>
          }
        >
          <For each={props.tree.dirs}>
            {(dir) => (
              <DirView
                dir={dir}
                depth={0}
                renderFile={(file, depth) => (
                  <FileRow
                    file={props.files[file.idx]}
                    label={file.name}
                    active={props.activeIdx === file.idx}
                    viewed={props.viewed.has(file.idx)}
                    broken={!props.metas[file.idx]}
                    indent={depth * 10 + 14}
                    onSelect={() => props.onSelect(file.idx)}
                    onToggleViewed={() => props.onToggleViewed(file.idx)}
                  />
                )}
              />
            )}
          </For>
          <For each={props.tree.files}>
            {(file) => (
              <FileRow
                file={props.files[file.idx]}
                label={file.name}
                active={props.activeIdx === file.idx}
                viewed={props.viewed.has(file.idx)}
                broken={!props.metas[file.idx]}
                indent={0}
                onSelect={() => props.onSelect(file.idx)}
                onToggleViewed={() => props.onToggleViewed(file.idx)}
              />
            )}
          </For>
        </Show>
      </Show>
    </div>
  );
}
