import { createSignal, createEffect, onMount, onCleanup, Show } from 'solid-js';
import { useNavigate, useSearch } from '@tanstack/solid-router';
import SourceForm from './SourceForm';
import FileStrip from './FileStrip';
import DiffView from './DiffView';
import Header from './Header';
import DiffToolbar from './DiffToolbar';
import CommentBar from './CommentBar';
import HelpModal from './HelpModal';
import Banners from './Banners';
import StatusFooter from './StatusFooter';
import { useChecks } from '../lib/use-checks';
import { usePrefs } from '../lib/use-prefs';
import { useShortcuts } from '../lib/use-shortcuts';
import { useDiff } from '../lib/use-diff';
import type { SourceKind } from '../types';

export default function App() {
  const navigate = useNavigate();
  const search: any = useSearch({ strict: false });

  const [theme, setTheme] = createSignal<'dark' | 'light'>('dark');
  const [actionOutput, setActionOutput] = createSignal<string | null>(null);
  const [actionBusy, setActionBusy] = createSignal<string | null>(null);
  const [mergeOpen, setMergeOpen] = createSignal(false);
  const [commentOpen, setCommentOpen] = createSignal(false);
  const [helpOpen, setHelpOpen] = createSignal(false);
  const [commentText, setCommentText] = createSignal('');
  const [diffStyle, setDiffStyle] = createSignal<'unified' | 'split'>('unified');
  const [wrap, setWrap] = createSignal(false);
  let filterEl: HTMLInputElement | undefined;

  const getSource = () => (search().source as SourceKind) || 'pr';
  const params = () => search() as Record<string, string>;

  const { checks, setChecks, pollChecks, ciBlocked, ciLabel, ciTitle } = useChecks();
  const {
    data, setData, loading, error, setError, selected, setSelected,
    fileQuery, setFileQuery, visibleIndices, getMeta, load,
  } = useDiff(params, getSource, theme, pollChecks, () => setChecks(null));

  const moveSelection = (delta: number) => {
    const vis = visibleIndices();
    if (!vis.length) return;
    const pos = vis.indexOf(selected());
    const next = pos < 0 ? 0 : pos + delta;
    if (next >= 0 && next < vis.length) setSelected(vis[next]);
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

    onCleanup(() => {
      clearInterval(i);
      window.removeEventListener('beforeunload', beforeUnload);
    });
  });

  // Auto-load as soon as source params become ready (covers /api/default → navigate)
  let autoLoaded = false;
  createEffect(() => {
    const p = params();
    const ready =
      (p.source === 'pr' && p.pr) ||
      (p.source === 'git' && p.ref) ||
      (p.source === 'branch' && p.base && p.head) ||
      (p.source === 'file' && p.old && p.new);
    if (ready && !autoLoaded) {
      autoLoaded = true;
      load();
    }
  });

  usePrefs(theme, setTheme, diffStyle, setDiffStyle, wrap, setWrap);

  createEffect(() => {
    const vis = visibleIndices();
    if (vis.length && !vis.includes(selected())) setSelected(vis[0]);
  });

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
  const currentFile = () => data()?.files[selected()];

  useShortcuts({
    helpOpen, setHelpOpen,
    mergeOpen, setMergeOpen,
    commentOpen, setCommentOpen,
    hasFiles: () => !!data()?.files.length,
    moveSelection,
    scrollDiff,
    focusFilter: () => filterEl?.focus(),
    toggleTheme,
    toggleDiffStyle: () => setDiffStyle(diffStyle() === 'unified' ? 'split' : 'unified'),
    toggleWrap: () => setWrap(!wrap()),
    reload: load,
  });

  return (
    <div class="h-full flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <Header
        data={data}
        checks={checks}
        onPollChecks={pollChecks}
        ciBlocked={ciBlocked}
        ciLabel={ciLabel}
        ciTitle={ciTitle}
        totals={totals}
        isPr={isPr}
        busy={busy}
        actionBusy={actionBusy}
        runAction={runAction}
        mergeOpen={mergeOpen}
        setMergeOpen={setMergeOpen}
        onToggleComment={() => setCommentOpen(!commentOpen())}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div class="shrink-0 pt-2 pb-1">
        <SourceForm source={getSource()} params={params()} setSource={setSource} setField={setField} onSubmit={load} />
      </div>

      <Show when={commentOpen()}>
        <CommentBar commentText={commentText} setCommentText={setCommentText} onSubmit={submitComment} />
      </Show>

      <Banners error={error} loading={loading} actionOutput={actionOutput} />

      <Show
        when={data()}
        fallback={
          <div class="flex-1 flex flex-col items-center justify-center gap-3 text-[var(--text-dim)]">
            <span class="i-mdi-file-compare w-12 h-12 opacity-30" />
            <span class="text-sm">Select a source and click Load</span>
            <div class="flex items-center gap-3 text-[11px] opacity-70 font-mono">
              <span>open-diff pr 123</span>
              <span class="opacity-40">·</span>
              <span>open-diff branch main..feat</span>
              <span class="opacity-40">·</span>
              <span>open-diff file a.ts b.ts</span>
            </div>
          </div>
        }
      >
        <FileStrip
          files={data()!.files}
          indices={visibleIndices()}
          selected={selected()}
          onSelect={setSelected}
        />
        <DiffToolbar
          diffStyle={diffStyle}
          setDiffStyle={setDiffStyle}
          wrap={wrap}
          setWrap={setWrap}
          onReload={load}
          loading={loading}
          inputRef={(el) => (filterEl = el)}
          fileQuery={fileQuery}
          setFileQuery={setFileQuery}
          position={() => `${visibleIndices().indexOf(selected()) + 1} / ${visibleIndices().length}`}
        />
        <main class="flex-1 flex overflow-hidden">
          <DiffView file={currentFile()} meta={getMeta(selected())} theme={theme()} diffStyle={diffStyle()} wrap={wrap()} />
        </main>
      </Show>

      <Show when={helpOpen()}>
        <HelpModal onClose={() => setHelpOpen(false)} />
      </Show>

      <StatusFooter onOpenHelp={() => setHelpOpen(true)} fileName={() => currentFile()?.name ?? ''} />
    </div>
  );
}
