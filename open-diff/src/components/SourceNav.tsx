import { createSignal, createEffect, Show, For } from 'solid-js';
import Dropdown, { type DropOption } from './Dropdown';
import type { SourceKind } from '../types';

interface Props {
  source: SourceKind;
  params: Record<string, string>;
  setSource: (kind: SourceKind) => void;
  setField: (key: string, value: string) => void;
  onSubmit: (e: Event) => void;
}

const TABS: { label: string; value: SourceKind; icon: string }[] = [
  { label: 'PR', value: 'pr', icon: 'i-mdi-github' },
  { label: 'Commit', value: 'git', icon: 'i-mdi-source-commit' },
  { label: 'Branch', value: 'branch', icon: 'i-mdi-source-branch' },
  { label: 'File', value: 'file', icon: 'i-mdi-file-compare' },
];

interface RefsData { branches: string[]; tags: string[]; commits: { sha: string; subject: string }[] }
interface PrItem { number: number; title: string; author?: { login: string } }

export default function SourceNav(props: Props) {
  const v = (k: string) => props.params[k] || '';

  const [prs, setPrs] = createSignal<DropOption[]>([]);
  const [prsLoading, setPrsLoading] = createSignal(false);
  const [refs, setRefs] = createSignal<RefsData | null>(null);
  const [refsLoading, setRefsLoading] = createSignal(false);
  let prsFetched = '';
  let refsFetched = '';

  const fetchPrs = async () => {
    const repo = v('repo');
    if (prsFetched === repo) return;
    prsFetched = repo;
    setPrsLoading(true);
    try {
      const list: PrItem[] = await fetch(`/api/prs${repo ? `?repo=${encodeURIComponent(repo)}` : ''}`).then((r) => r.json());
      setPrs(list.map((p) => ({
        value: String(p.number),
        label: `#${p.number} ${p.title}`,
        icon: 'i-mdi-source-pull',
        desc: p.author?.login || '',
        group: 'Open PRs',
      })));
    } catch {
      setPrs([]);
    } finally {
      setPrsLoading(false);
    }
  };

  const fetchRefs = async () => {
    const repo = v('repo');
    if (refsFetched === repo) return;
    refsFetched = repo;
    setRefsLoading(true);
    try {
      const d: RefsData = await fetch(`/api/refs${repo ? `?repo=${encodeURIComponent(repo)}` : ''}`).then((r) => r.json());
      setRefs(d);
    } catch {
      setRefs({ branches: [], tags: [], commits: [] });
    } finally {
      setRefsLoading(false);
    }
  };

  // Invalidate caches when repo param changes
  createEffect(() => {
    const repo = v('repo');
    if (repo !== prsFetched) setPrs([]);
    if (repo !== refsFetched) setRefs(null);
  });

  const refOptions = (): DropOption[] => {
    const r = refs();
    if (!r) return [];
    return [
      ...r.branches.map((b) => ({ value: b, label: b, icon: 'i-mdi-source-branch', group: 'Branches' })),
      ...r.tags.map((t) => ({ value: t, label: t, icon: 'i-mdi-tag-outline', group: 'Tags' })),
      ...r.commits.map((c) => ({ value: c.sha, label: c.sha, icon: 'i-mdi-source-commit', desc: c.subject, group: 'Recent commits' })),
    ];
  };

  const branchOptions = () => refOptions();

  return (
    <nav class="flex items-center gap-2 shrink-0">
      <div class="flex items-center gap-0.5 p-0.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)]">
        <For each={TABS}>
          {(t) => (
            <button
              type="button"
              onClick={() => props.setSource(t.value)}
              title={t.label}
              class={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
                props.source === t.value
                  ? 'bg-[var(--focus)]/15 text-[var(--text)] border border-[var(--focus)]/40'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)] border border-transparent'
              }`}
            >
              <span class={`${t.icon} w-3.5 h-3.5`} />
              <span class="hidden lg:inline">{t.label}</span>
            </button>
          )}
        </For>
      </div>

      <form class="flex items-center gap-1.5" onSubmit={(e) => { e.preventDefault(); props.onSubmit(e); }}>
        <Show when={props.source === 'pr'}>
          <Dropdown
            value={v('pr')}
            options={prs()}
            onSelect={(val) => props.setField('pr', val)}
            placeholder="PR #"
            icon="i-mdi-source-pull"
            freeText
            loading={prsLoading()}
            onOpen={fetchPrs}
          />
          <Dropdown
            value={v('repo')}
            options={[]}
            onSelect={(val) => props.setField('repo', val)}
            placeholder="owner/repo"
            icon="i-mdi-bookmark-outline"
            freeText
          />
        </Show>

        <Show when={props.source === 'git'}>
          <Dropdown
            value={v('ref')}
            options={refOptions()}
            onSelect={(val) => props.setField('ref', val)}
            placeholder="ref…"
            icon="i-mdi-source-commit"
            freeText
            loading={refsLoading()}
            onOpen={fetchRefs}
          />
          <Dropdown
            value={v('repo')}
            options={[]}
            onSelect={(val) => props.setField('repo', val)}
            placeholder="repo path"
            icon="i-mdi-folder-outline"
            freeText
          />
        </Show>

        <Show when={props.source === 'branch'}>
          <Dropdown
            value={v('base')}
            options={branchOptions()}
            onSelect={(val) => props.setField('base', val)}
            placeholder="base…"
            icon="i-mdi-source-branch-minus"
            freeText
            loading={refsLoading()}
            onOpen={fetchRefs}
          />
          <span class="text-[var(--text-dim)] text-xs">..</span>
          <Dropdown
            value={v('head')}
            options={branchOptions()}
            onSelect={(val) => props.setField('head', val)}
            placeholder="head…"
            icon="i-mdi-source-branch-plus"
            freeText
            loading={refsLoading()}
            onOpen={fetchRefs}
          />
          <Dropdown
            value={v('repo')}
            options={[]}
            onSelect={(val) => props.setField('repo', val)}
            placeholder="repo path"
            icon="i-mdi-folder-outline"
            freeText
          />
        </Show>

        <Show when={props.source === 'file'}>
          <Dropdown
            value={v('old')}
            options={[]}
            onSelect={(val) => props.setField('old', val)}
            placeholder="old file"
            icon="i-mdi-file-outline"
            freeText
          />
          <span class="i-mdi-arrow-right w-3 h-3 text-[var(--text-dim)]" />
          <Dropdown
            value={v('new')}
            options={[]}
            onSelect={(val) => props.setField('new', val)}
            placeholder="new file"
            icon="i-mdi-file-outline"
            freeText
          />
        </Show>

        <button
          type="submit"
          class="btn !rounded-full !py-1 !px-3 text-[11px] flex items-center gap-1"
          title="Load diff"
        >
          <span class="i-mdi-reload w-3 h-3" /> Load
        </button>
      </form>
    </nav>
  );
}
