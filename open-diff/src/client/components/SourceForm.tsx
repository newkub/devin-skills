import { createSignal, Show } from 'solid-js';
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
  const [open, setOpen] = createSignal(false);

  const needsParams = () =>
    (props.source === 'pr' && !v('pr')) ||
    (props.source === 'git' && !v('ref')) ||
    (props.source === 'branch' && !(v('base') && v('head'))) ||
    (props.source === 'file' && !(v('old') && v('new')));

  return (
    <div class="flex flex-col items-center gap-2">
      <nav class="flex items-center gap-0.5 p-1 rounded-full bg-[var(--surface)]/80 backdrop-blur-md border border-[var(--border)] shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        {TABS.map((t) => (
          <button
            type="button"
            onClick={() => { props.setSource(t.value); setOpen(true); }}
            class={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              props.source === t.value
                ? 'bg-[var(--focus)]/15 text-[var(--text)] shadow-sm border border-[var(--focus)]/40'
                : 'text-[var(--text-dim)] hover:text-[var(--text)] border border-transparent'
            }`}
          >
            <div class="flex items-center gap-1.5">
              <span class={`${t.icon} w-3.5 h-3.5`} />
              {t.label}
            </div>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOpen(!open())}
          class={`ml-0.5 w-7 h-7 rounded-full flex items-center justify-center transition-colors border ${
            open() ? 'border-[var(--focus)]/40 text-[var(--text)]' : 'border-transparent text-[var(--text-dim)] hover:text-[var(--text)]'
          }`}
          title="Source options"
        >
          <span class={`i-mdi-tune-variant w-4 h-4 transition-transform ${open() ? 'rotate-90' : ''}`} />
        </button>
      </nav>

      <Show when={open() || needsParams()}>
        <form
          onSubmit={(e) => { e.preventDefault(); props.onSubmit(e); setOpen(false); }}
          class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)]/80 backdrop-blur-md border border-[var(--border)] shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
        >
          {props.source === 'pr' && (
            <>
              <input class="input !w-20 !py-1 !rounded-full !text-xs" type="number" min="1" placeholder="PR" value={v('pr')} onInput={(e) => props.setField('pr', e.currentTarget.value)} />
              <input class="input !w-44 !py-1 !rounded-full !text-xs" placeholder="owner/repo" value={v('repo')} onInput={(e) => props.setField('repo', e.currentTarget.value)} />
            </>
          )}
          {props.source === 'git' && (
            <>
              <input class="input !w-44 !py-1 !rounded-full !text-xs" placeholder="ref (e.g. main, HEAD~1)" value={v('ref')} onInput={(e) => props.setField('ref', e.currentTarget.value)} />
              <input class="input !w-44 !py-1 !rounded-full !text-xs" placeholder="repo path (optional)" value={v('repo')} onInput={(e) => props.setField('repo', e.currentTarget.value)} />
            </>
          )}
          {props.source === 'branch' && (
            <>
              <input class="input !w-32 !py-1 !rounded-full !text-xs" placeholder="base" value={v('base')} onInput={(e) => props.setField('base', e.currentTarget.value)} />
              <span class="text-[var(--text-dim)] text-xs">..</span>
              <input class="input !w-32 !py-1 !rounded-full !text-xs" placeholder="head" value={v('head')} onInput={(e) => props.setField('head', e.currentTarget.value)} />
              <input class="input !w-44 !py-1 !rounded-full !text-xs" placeholder="repo path (optional)" value={v('repo')} onInput={(e) => props.setField('repo', e.currentTarget.value)} />
            </>
          )}
          {props.source === 'file' && (
            <>
              <input class="input !w-48 !py-1 !rounded-full !text-xs" placeholder="old file path" value={v('old')} onInput={(e) => props.setField('old', e.currentTarget.value)} />
              <input class="input !w-48 !py-1 !rounded-full !text-xs" placeholder="new file path" value={v('new')} onInput={(e) => props.setField('new', e.currentTarget.value)} />
            </>
          )}
          <button type="submit" class="btn !rounded-full !py-1 !px-3 text-xs">Load</button>
        </form>
      </Show>
    </div>
  );
}
