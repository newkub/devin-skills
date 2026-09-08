import { createSignal, createEffect, onMount, onCleanup, Show, For } from 'solid-js';
import { useNavigate, useSearch } from '@tanstack/solid-router';
import { parsePatchFiles } from '@pierre/diffs';
import SourceForm from './components/SourceForm';
import FileSidebar from './components/FileSidebar';
import DiffView from './components/DiffView';
import type { DiffResult, DiffFile, SourceKind } from '../types';

type MergeMethod = 'merge' | 'squash' | 'rebase';
const MERGE_METHODS: { value: MergeMethod; label: string }[] = [
  { value: 'merge', label: 'Create a merge commit' },
  { value: 'squash', label: 'Squash and merge' },
  { value: 'rebase', label: 'Rebase and merge' },
];

export default function App() {
  const navigate = useNavigate();
  const search: any = useSearch({ strict: false });

  const [theme, setTheme] = createSignal<'dark' | 'light'>('dark');
  const [data, setData] = createSignal<DiffResult | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [selected, setSelected] = createSignal(0);
  const [fileQuery, setFileQuery] = createSignal('');
  const [diffStyle, setDiffStyle] = createSignal<'unified' | 'split'>('unified');
  const [wrap, setWrap] = createSignal(false);
  const [actionOutput, setActionOutput] = createSignal<string | null>(null);
  const [actionBusy, setActionBusy] = createSignal<string | null>(null);
  const [mergeOpen, setMergeOpen] = createSignal(false);
  const [commentOpen, setCommentOpen] = createSignal(false);
  const [commentText, setCommentText] = createSignal('');
  let filterEl: HTMLInputElement | undefined;

  const getSource = () => (search().source as SourceKind) || 'pr';
  const params = () => search() as Record<string, string>;

  const visibleIndices = () => {
    const files = data()?.files ?? [];
    const q = fileQuery().trim().toLowerCase();
    if (!q) return files.map((_, i) => i);
    return files.map((f, i) => ({ f, i })).filter(({ f }) => f.meta.name.toLowerCase().includes(q)).map(({ i }) => i);
  };

  const isTyping = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
  };

  const moveSelection = (delta: number) => {
    const vis = visibleIndices();
    if (!vis.length) return;
    const pos = vis.indexOf(selected());
    const next = pos < 0 ? 0 : pos + delta;
    if (next >= 0 && next < vis.length) setSelected(vis[next]);
    scrollSelectedIntoView();
  };

  const scrollSelectedIntoView = () => {
    requestAnimationFrame(() => {
      document.querySelector('.file-item-active')?.scrollIntoView({ block: 'nearest' });
    });
  };

  const scrollDiff = (delta: number) => {
    document.querySelector('.diff-scroll')?.scrollBy({ top: delta, behavior: 'smooth' });
  };

  onMount(() => {
    fetch('/api/default')
      .then((r) => r.json())
      .then((def) => {
        if (def && !params().source) {
          navigate({ search: { ...params(), ...def } as any, replace: true });
        }
      })
      .catch(() => {});

    const i = setInterval(() => {
      fetch('/api/ping', { method: 'POST' }).catch(() => {});
    }, 2000);

    const beforeUnload = () => {
      navigator.sendBeacon?.('/api/close');
    };
    window.addEventListener('beforeunload', beforeUnload);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mergeOpen()) { setMergeOpen(false); return; }
        if (commentOpen()) { setCommentOpen(false); return; }
        if (isTyping(e)) { (e.target as HTMLElement).blur(); return; }
      }
      if (isTyping(e)) return;
      if (!data()?.files.length) return;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === '[' || e.key === ']') {
        e.preventDefault();
        moveSelection(e.key === 'ArrowLeft' || e.key === '[' ? -1 : 1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'k' || e.key === 'j') {
        e.preventDefault();
        scrollDiff(e.key === 'ArrowUp' || e.key === 'k' ? -60 : 60);
      } else if (e.key === 'PageUp' || e.key === 'PageDown') {
        e.preventDefault();
        scrollDiff(e.key === 'PageUp' ? -400 : 400);
      } else if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        filterEl?.focus();
      } else if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
        toggleTheme();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    onCleanup(() => {
      clearInterval(i);
      window.removeEventListener('beforeunload', beforeUnload);
      window.removeEventListener('keydown', onKeyDown);
    });

    const p = params();
    const ready =
      (p.source === 'pr' && p.pr) ||
      (p.source === 'git' && p.ref) ||
      (p.source === 'branch' && p.base && p.head) ||
      (p.source === 'file' && p.old && p.new);
    if (ready) load();
  });

  createEffect(() => {
    document.documentElement.classList.toggle('dark', theme() === 'dark');
    document.documentElement.classList.toggle('light', theme() === 'light');
  });

  createEffect(() => {
    const vis = visibleIndices();
    if (vis.length && !vis.includes(selected())) setSelected(vis[0]);
  });

  async function load() {
    setLoading(true);
    setError(null);
    const source = getSource();
    const p = params();
    const body: any = { kind: source, theme: theme() };
    if (source === 'pr') {
      body.pr = Number(p.pr || 0);
      body.repo = p.repo;
    } else if (source === 'git') {
      body.ref = p.ref;
      body.repo = p.repo;
    } else if (source === 'branch') {
      body.base = p.base;
      body.head = p.head;
      body.repo = p.repo;
    } else if (source === 'file') {
      body.old = p.old;
      body.new = p.new;
    }

    try {
      const res = await fetch('/api/diff', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Unknown error');

      const parsed = parsePatchFiles(json.raw);
      const files: DiffFile[] = [];
      for (const patch of parsed) {
        for (const f of patch.files) {
          files.push({
            meta: f,
            additions: f.additionLines?.length ?? 0,
            deletions: f.deletionLines?.length ?? 0,
          });
        }
      }

      setData({ source: json.source, files, raw: json.raw, prMeta: json.prMeta });
      setSelected(0);
      setFileQuery('');
    } catch (e: any) {
      setError(e.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  function setField(key: string, value: string) {
    navigate({ search: { ...params(), [key]: value } as any, replace: true });
  }

  function setSource(kind: SourceKind) {
    navigate({ search: { source: kind } as any, replace: true });
  }

  function toggleTheme() {
    setTheme(theme() === 'dark' ? 'light' : 'dark');
  }

  async function runAction(action: string, extra: any = {}) {
    setActionBusy(action);
    setActionOutput(null);
    setError(null);
    try {
      const res = await fetch('/api/action', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action, ...extra }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || 'Action failed');
      setActionOutput(`${action}: ${json.output || 'ok'}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setActionBusy(null);
    }
  }

  const submitComment = async () => {
    const body = commentText().trim();
    if (!body) return;
    setCommentOpen(false);
    setCommentText('');
    await runAction('comment', { body });
  };

  const totals = () => {
    const files = data()?.files ?? [];
    return files.reduce(
      (acc, f) => {
        acc.add += f.additions;
        acc.del += f.deletions;
        return acc;
      },
      { add: 0, del: 0 }
    );
  };

  const isPr = () => data()?.source?.kind === 'pr';
  const busy = () => actionBusy() !== null;

  return (
    <div class="h-full flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <header class="shrink-0 px-4 py-3 border-b border-[var(--border)] flex flex-col gap-3 bg-[var(--surface)]">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div class="i-mdi-source-branch w-5 h-5 text-[var(--focus)]" />
            <h1 class="text-lg font-semibold tracking-tight">open-diff</h1>
          </div>

          <Show when={data()?.prMeta}>
            <a
              href={data()!.prMeta!.url}
              target="_blank"
              rel="noreferrer"
              class="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-xs hover:border-[var(--focus)] transition-colors"
            >
              <img
                src={data()!.prMeta!.author?.avatarUrl || `https://github.com/${data()!.prMeta!.author?.login || 'unknown'}.png`}
                class="w-4 h-4 rounded-full"
                alt="author"
              />
              <span class="font-medium truncate max-w-72">{data()!.prMeta!.title}</span>
              <span class={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                data()!.prMeta!.state === 'OPEN'
                  ? 'bg-green-500/15 text-green-400'
                  : data()!.prMeta!.state === 'MERGED'
                    ? 'bg-purple-500/15 text-purple-400'
                    : 'bg-zinc-500/15 text-zinc-400'
              }`}>{data()!.prMeta!.state}</span>
              <span class="text-[var(--text-dim)]">#{data()!.prMeta!.number}</span>
            </a>
          </Show>

          <div class="ml-auto flex items-center gap-2">
            <Show when={data()}>
              <div class="hidden sm:flex items-center gap-2 px-2 py-1 rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono">
                <span class="text-green-500">+{totals().add}</span>
                <span class="text-red-500">-{totals().del}</span>
                <span class="dim">{data()?.files.length} files</span>
              </div>
            </Show>
            <Show when={isPr()}>
              <div class="flex items-center gap-1">
                <div class="relative">
                  <button
                    onClick={() => setMergeOpen(!mergeOpen())}
                    disabled={busy()}
                    class="btn text-xs flex items-center gap-1 !bg-green-700/30 !border-green-700/50 hover:!bg-green-700/40"
                    title="gh pr merge"
                  >
                    <span class="i-mdi-source-merge w-3.5 h-3.5" />
                    {actionBusy() === 'merge' ? 'Merging…' : 'Merge'}
                    <span class="i-mdi-chevron-down w-3 h-3" />
                  </button>
                  <Show when={mergeOpen()}>
                    <div class="absolute right-0 top-full mt-1 z-50 w-52 panel shadow-lg">
                      <For each={MERGE_METHODS}>
                        {(m) => (
                          <button
                            class="w-full text-left px-3 py-2 text-xs hover:bg-[var(--surface-2)] flex items-center gap-2"
                            onClick={() => { setMergeOpen(false); runAction('merge', { method: m.value }); }}
                          >
                            <span class="i-mdi-check w-3.5 h-3.5 text-green-500" />
                            {m.label}
                          </button>
                        )}
                      </For>
                    </div>
                  </Show>
                </div>
                <button onClick={() => runAction('approve')} disabled={busy()} class="btn text-xs" title="gh pr review --approve">
                  <span class="i-mdi-check-decagram w-3.5 h-3.5 text-green-500 inline-block align-[-2px]" /> {actionBusy() === 'approve' ? 'Approving…' : 'Approve'}
                </button>
                <button onClick={() => setCommentOpen(!commentOpen())} disabled={busy()} class="btn text-xs" title="gh pr comment">
                  <span class="i-mdi-comment-outline w-3.5 h-3.5 inline-block align-[-2px]" /> Comment
                </button>
                <button onClick={() => runAction('checkout')} disabled={busy()} class="btn text-xs" title="git checkout">
                  <span class="i-mdi-source-pull w-3.5 h-3.5 inline-block align-[-2px]" /> {actionBusy() === 'checkout' ? 'Checking out…' : 'Checkout'}
                </button>
                <button onClick={() => runAction('close')} disabled={busy()} class="btn text-xs !text-red-400 hover:!bg-red-900/20" title="gh pr close">
                  Close
                </button>
              </div>
            </Show>
            <button onClick={toggleTheme} class="btn shrink-0" title="Toggle theme (t)">
              <span class={theme() === 'dark' ? 'i-mdi-weather-sunny w-4 h-4' : 'i-mdi-weather-night w-4 h-4'} />
            </button>
          </div>
        </div>

        <SourceForm source={getSource()} params={params()} setSource={setSource} setField={setField} onSubmit={load} />
      </header>

      <Show when={commentOpen()}>
        <div class="shrink-0 px-4 py-2 border-b border-[var(--border)] bg-[var(--surface)] flex items-center gap-2">
          <input
            class="input flex-1 !py-1.5 text-xs"
            placeholder="Write a PR comment… (Enter to send, Esc to cancel)"
            value={commentText()}
            onInput={(e) => setCommentText(e.currentTarget.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submitComment(); }}
            autofocus
          />
          <button class="btn text-xs" onClick={submitComment} disabled={!commentText().trim()}>Send</button>
        </div>
      </Show>

      <Show when={error()}>
        <div class="shrink-0 px-4 py-2 bg-red-950/40 text-red-200 text-sm border-b border-red-900/50 flex items-center gap-2">
          <span class="i-mdi-alert-circle-outline w-4 h-4" /> {error()}
        </div>
      </Show>

      <Show when={loading()}>
        <div class="shrink-0 px-4 py-2 text-xs text-[var(--text-dim)] flex items-center gap-2">
          <span class="i-mdi-loading w-3.5 h-3.5 animate-spin" /> Loading diff…
        </div>
      </Show>

      <Show when={actionOutput()}>
        <div class="shrink-0 px-4 py-2 bg-green-950/40 text-green-200 text-xs border-b border-green-900/50 font-mono whitespace-pre-wrap">{actionOutput()}</div>
      </Show>

      <Show
        when={data()}
        fallback={
          <div class="flex-1 flex flex-col items-center justify-center gap-2 text-[var(--text-dim)]">
            <span class="i-mdi-file-compare w-10 h-10 opacity-40" />
            <span class="text-sm">Select a source and click Load diff.</span>
          </div>
        }
      >
        <main class="flex-1 flex overflow-hidden">
          <FileSidebar
            files={data()!.files}
            indices={visibleIndices()}
            selected={selected()}
            onSelect={setSelected}
            query={fileQuery()}
            onQuery={setFileQuery}
            filterRef={(el) => (filterEl = el)}
          />
          <div class="flex-1 flex flex-col overflow-hidden">
            <div class="shrink-0 flex items-center gap-1 px-3 py-1.5 border-b border-[var(--border)] bg-[var(--surface)]/60 text-xs">
              <span class="dim mr-1">View:</span>
              <div class="flex items-center rounded-md border border-[var(--border)] overflow-hidden">
                <button
                  class={`px-2 py-1 text-[11px] ${diffStyle() === 'unified' ? 'bg-[var(--focus)]/15 text-[var(--text)]' : 'text-[var(--text-dim)] hover:text-[var(--text)]'}`}
                  onClick={() => setDiffStyle('unified')}
                >Unified</button>
                <button
                  class={`px-2 py-1 text-[11px] border-l border-[var(--border)] ${diffStyle() === 'split' ? 'bg-[var(--focus)]/15 text-[var(--text)]' : 'text-[var(--text-dim)] hover:text-[var(--text)]'}`}
                  onClick={() => setDiffStyle('split')}
                >Split</button>
              </div>
              <button
                class={`px-2 py-1 text-[11px] rounded-md border ${wrap() ? 'border-[var(--focus)]/50 bg-[var(--focus)]/10 text-[var(--text)]' : 'border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text)]'}`}
                onClick={() => setWrap(!wrap())}
                title="Toggle line wrap"
              >Wrap</button>
              <span class="dim ml-auto hidden md:inline">
                {selected() + 1} / {data()!.files.length}
              </span>
            </div>
            <DiffView file={data()!.files[selected()]} theme={theme()} diffStyle={diffStyle()} wrap={wrap()} />
          </div>
        </main>
      </Show>

      <footer class="shrink-0 flex items-center gap-4 px-4 py-1.5 border-t border-[var(--border)] bg-[var(--surface)] text-[11px] text-[var(--text-dim)]">
        <span class="flex items-center gap-1"><kbd class="kbd">←</kbd><kbd class="kbd">→</kbd> files</span>
        <span class="flex items-center gap-1"><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> scroll</span>
        <span class="flex items-center gap-1"><kbd class="kbd">f</kbd> filter</span>
        <span class="flex items-center gap-1"><kbd class="kbd">t</kbd> theme</span>
        <span class="ml-auto truncate font-mono">{data()?.files[selected()]?.meta.name ?? ''}</span>
      </footer>
    </div>
  );
}
