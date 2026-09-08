import type { SourceKind } from '../../types';

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

export default function SourceForm(props: Props) {
  const v = (k: string) => props.params[k] || '';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(e);
      }}
      class="flex-1 flex items-center gap-4 flex-wrap"
    >
      <nav class="flex items-center gap-1 p-1 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
        {TABS.map((t) => (
          <button
            type="button"
            onClick={() => props.setSource(t.value)}
            class={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              props.source === t.value
                ? 'bg-[var(--bg)] text-[var(--text)] shadow-sm'
                : 'text-[var(--text-dim)] hover:text-[var(--text)]'
            }`}
          >
            <div class="flex items-center gap-1.5">
              <span class={t.icon} />
              {t.label}
            </div>
          </button>
        ))}
      </nav>

      <div class="flex items-center gap-2 flex-wrap">
        {props.source === 'pr' && (
          <>
            <input class="input w-24" type="number" min="1" placeholder="PR" value={v('pr')} onInput={(e) => props.setField('pr', e.currentTarget.value)} />
            <input class="input w-48" placeholder="owner/repo" value={v('repo')} onInput={(e) => props.setField('repo', e.currentTarget.value)} />
          </>
        )}

        {props.source === 'git' && (
          <>
            <input class="input w-48" placeholder="ref (e.g. main, HEAD~1)" value={v('ref')} onInput={(e) => props.setField('ref', e.currentTarget.value)} />
            <input class="input w-48" placeholder="repo path (optional)" value={v('repo')} onInput={(e) => props.setField('repo', e.currentTarget.value)} />
          </>
        )}

        {props.source === 'branch' && (
          <>
            <input class="input w-36" placeholder="base" value={v('base')} onInput={(e) => props.setField('base', e.currentTarget.value)} />
            <span class="text-[var(--text-dim)]">..</span>
            <input class="input w-36" placeholder="head" value={v('head')} onInput={(e) => props.setField('head', e.currentTarget.value)} />
            <input class="input w-48" placeholder="repo path (optional)" value={v('repo')} onInput={(e) => props.setField('repo', e.currentTarget.value)} />
          </>
        )}

        {props.source === 'file' && (
          <>
            <input class="input w-56" placeholder="old file path" value={v('old')} onInput={(e) => props.setField('old', e.currentTarget.value)} />
            <input class="input w-56" placeholder="new file path" value={v('new')} onInput={(e) => props.setField('new', e.currentTarget.value)} />
          </>
        )}

        <button type="submit" class="btn">Load diff</button>
      </div>
    </form>
  );
}
