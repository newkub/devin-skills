import { Show, For, type Accessor, type Setter } from 'solid-js';
import type { DiffResult } from '../types';
import type { Checks } from '../lib/use-checks';

type MergeMethod = 'merge' | 'squash' | 'rebase';
const MERGE_METHODS: { value: MergeMethod; label: string }[] = [
  { value: 'merge', label: 'Create a merge commit' },
  { value: 'squash', label: 'Squash and merge' },
  { value: 'rebase', label: 'Rebase and merge' },
];

export default function Header(props: {
  data: Accessor<DiffResult | null>;
  checks: Accessor<Checks | null>;
  onPollChecks: () => void;
  ciBlocked: Accessor<boolean>;
  ciLabel: Accessor<string>;
  ciTitle: Accessor<string>;
  totals: Accessor<{ add: number; del: number }>;
  isPr: Accessor<boolean>;
  busy: Accessor<boolean>;
  actionBusy: Accessor<string | null>;
  runAction: (action: string, extra?: any) => void;
  mergeOpen: Accessor<boolean>;
  setMergeOpen: Setter<boolean>;
  onToggleComment: () => void;
  theme: Accessor<'dark' | 'light'>;
  onToggleTheme: () => void;
}) {
  const data = props.data;
  const checks = props.checks;

  return (
    <header class="shrink-0 px-4 py-2 border-b border-[var(--border)] flex items-center gap-3 bg-[var(--surface)]/70">
      <div class="flex items-center gap-2">
        <div class="i-mdi-source-branch w-4 h-4 text-[var(--focus)]" />
        <h1 class="text-sm font-semibold tracking-tight">open-diff</h1>
      </div>

      <Show when={data()?.prMeta}>
        <a
          href={data()!.prMeta!.url}
          target="_blank"
          rel="noreferrer"
          class="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-xs hover:border-[var(--focus)] transition-colors"
        >
          <img
            src={data()!.prMeta!.author?.avatarUrl || `https://github.com/${data()!.prMeta!.author?.login || 'unknown'}.png`}
            class="w-4 h-4 rounded-full"
            alt="author"
          />
          <span class="font-medium truncate max-w-64">{data()!.prMeta!.title}</span>
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

      <Show when={checks() && checks()!.summary !== 'none'}>
        <button
          onClick={props.onPollChecks}
          title={props.ciTitle() + ' (click to refresh)'}
          class={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
            checks()!.summary === 'pass'
              ? 'bg-green-500/10 border-green-700/50 text-green-400'
              : checks()!.summary === 'pending'
                ? 'bg-amber-500/10 border-amber-700/50 text-amber-400'
                : 'bg-red-500/10 border-red-700/50 text-red-400'
          }`}
        >
          <span class={checks()!.summary === 'pending' ? 'i-mdi-loading w-3.5 h-3.5 animate-spin' : checks()!.summary === 'pass' ? 'i-mdi-check-circle w-3.5 h-3.5' : 'i-mdi-close-circle w-3.5 h-3.5'} />
          {props.ciLabel()}
        </button>
      </Show>

      <div class="ml-auto flex items-center gap-2">
        <Show when={data()}>
          <div class="hidden sm:flex items-center gap-2 px-2 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono">
            <span class="text-green-500">+{props.totals().add}</span>
            <span class="text-red-500">-{props.totals().del}</span>
            <span class="dim">{data()?.files.length} files</span>
          </div>
        </Show>
        <Show when={props.isPr()}>
          <div class="flex items-center gap-1">
            <div class="relative">
              <button
                onClick={() => props.setMergeOpen(!props.mergeOpen())}
                disabled={props.busy() || props.ciBlocked()}
                class={`btn text-xs flex items-center gap-1 !rounded-full ${
                  props.ciBlocked()
                    ? '!bg-zinc-700/20 !border-zinc-700/50 !text-zinc-500 cursor-not-allowed'
                    : '!bg-green-700/30 !border-green-700/50 hover:!bg-green-700/40'
                }`}
                title={props.ciBlocked() ? props.ciTitle() : 'gh pr merge'}
              >
                <span class="i-mdi-source-merge w-3.5 h-3.5" />
                {props.actionBusy() === 'merge' ? 'Merging…' : 'Merge'}
                <span class="i-mdi-chevron-down w-3 h-3" />
              </button>
              <Show when={props.mergeOpen()}>
                <div class="absolute right-0 top-full mt-1 z-50 w-52 panel shadow-lg">
                  <For each={MERGE_METHODS}>
                    {(m) => (
                      <button
                        class="w-full text-left px-3 py-2 text-xs hover:bg-[var(--surface-2)] flex items-center gap-2"
                        onClick={() => { props.setMergeOpen(false); props.runAction('merge', { method: m.value }); }}
                      >
                        <span class="i-mdi-check w-3.5 h-3.5 text-green-500" />
                        {m.label}
                      </button>
                    )}
                  </For>
                </div>
              </Show>
            </div>
            <button onClick={() => props.runAction('approve')} disabled={props.busy()} class="btn text-xs !rounded-full" title="gh pr review --approve">
              <span class="i-mdi-check-decagram w-3.5 h-3.5 text-green-500 inline-block align-[-2px]" /> {props.actionBusy() === 'approve' ? 'Approving…' : 'Approve'}
            </button>
            <button onClick={props.onToggleComment} disabled={props.busy()} class="btn text-xs !rounded-full" title="gh pr comment">
              <span class="i-mdi-comment-outline w-3.5 h-3.5 inline-block align-[-2px]" /> Comment
            </button>
            <button onClick={() => props.runAction('checkout')} disabled={props.busy()} class="btn text-xs !rounded-full" title="git checkout">
              <span class="i-mdi-source-pull w-3.5 h-3.5 inline-block align-[-2px]" /> {props.actionBusy() === 'checkout' ? 'Checking out…' : 'Checkout'}
            </button>
            <button onClick={() => props.runAction('close')} disabled={props.busy()} class="btn text-xs !rounded-full !text-red-400 hover:!bg-red-900/20" title="gh pr close">
              Close
            </button>
          </div>
        </Show>
        <button onClick={props.onToggleTheme} class="btn shrink-0 !rounded-full !px-2.5" title="Toggle theme (t)">
          <span class={props.theme() === 'dark' ? 'i-mdi-weather-sunny w-4 h-4' : 'i-mdi-weather-night w-4 h-4'} />
        </button>
      </div>
    </header>
  );
}
