import { createSignal, createEffect, For, Show, onCleanup } from 'solid-js';

export interface DropOption {
  value: string;
  label: string;
  icon?: string;
  desc?: string;
  group?: string;
}

interface Props {
  value: string;
  options: DropOption[];
  onSelect: (v: string) => void;
  placeholder?: string;
  icon?: string;
  width?: string;          // trigger width class e.g. 'w-40'
  freeText?: boolean;      // allow typing custom value
  loading?: boolean;
  onOpen?: () => void;     // lazy fetch hook
  disabled?: boolean;
}

export default function Dropdown(props: Props) {
  const [open, setOpen] = createSignal(false);
  const [query, setQuery] = createSignal('');
  let rootEl: HTMLDivElement | undefined;
  let inputEl: HTMLInputElement | undefined;

  const filtered = () => {
    const q = query().trim().toLowerCase();
    const opts = props.options;
    if (!q) return opts;
    return opts.filter((o) =>
      o.label.toLowerCase().includes(q) ||
      o.value.toLowerCase().includes(q) ||
      (o.desc || '').toLowerCase().includes(q)
    );
  };

  const groups = () => {
    const map = new Map<string, DropOption[]>();
    for (const o of filtered()) {
      const g = o.group || '';
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(o);
    }
    return [...map.entries()];
  };

  const open_ = () => {
    if (props.disabled) return;
    setQuery('');
    setOpen(true);
    props.onOpen?.();
    setTimeout(() => inputEl?.focus(), 0);
  };

  const pick = (v: string) => {
    props.onSelect(v);
    setOpen(false);
  };

  const onDocClick = (e: MouseEvent) => {
    if (rootEl && !rootEl.contains(e.target as Node)) setOpen(false);
  };
  document.addEventListener('mousedown', onDocClick);
  onCleanup(() => document.removeEventListener('mousedown', onDocClick));

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); e.stopPropagation(); }
    if (e.key === 'Enter' && props.freeText && query().trim()) {
      pick(query().trim());
    }
  };

  const current = () => props.options.find((o) => o.value === props.value);

  return (
    <div ref={rootEl} class="relative shrink-0">
      <button
        type="button"
        onClick={() => (open() ? setOpen(false) : open_())}
        disabled={props.disabled}
        class={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs transition-colors max-w-56 ${
          open()
            ? 'border-[var(--focus)]/50 bg-[var(--focus)]/10 text-[var(--text)]'
            : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--text-dim)]/50'
        } ${props.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        <Show when={props.icon}>
          <span class={`${props.icon} w-3.5 h-3.5 text-[var(--text-dim)] shrink-0`} />
        </Show>
        <span class={`truncate font-mono ${props.value ? '' : 'text-[var(--text-dim)]'}`}>
          {current()?.label || props.value || props.placeholder || 'Select…'}
        </span>
        <span class={`i-mdi-chevron-down w-3 h-3 shrink-0 text-[var(--text-dim)] transition-transform ${open() ? 'rotate-180' : ''}`} />
      </button>

      <Show when={open()}>
        <div class="absolute left-0 top-full mt-1 z-50 w-72 panel shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
          <div class="p-1.5 border-b border-[var(--border)] flex items-center gap-1.5">
            <span class="i-mdi-magnify w-3.5 h-3.5 text-[var(--text-dim)] ml-1" />
            <input
              ref={inputEl!}
              class="flex-1 bg-transparent text-xs py-1 px-1 focus:outline-none text-[var(--text)]"
              placeholder={props.freeText ? 'Type or search… (Enter = custom)' : 'Search…'}
              value={query()}
              onInput={(e) => setQuery(e.currentTarget.value)}
              onKeyDown={onKey}
            />
            <Show when={props.loading}>
              <span class="i-mdi-loading w-3.5 h-3.5 animate-spin text-[var(--text-dim)]" />
            </Show>
          </div>
          <div class="max-h-64 overflow-y-auto py-1">
            <Show when={!props.loading && filtered().length === 0}>
              <div class="px-3 py-2 text-xs text-[var(--text-dim)]">
                {props.freeText && query().trim() ? `Press Enter to use "${query().trim()}"` : 'No options'}
              </div>
            </Show>
            <For each={groups()}>
              {([group, opts]) => (
                <>
                  <Show when={group}>
                    <div class="px-3 pt-2 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                      {group}
                    </div>
                  </Show>
                  <For each={opts}>
                    {(o) => (
                      <button
                        type="button"
                        onClick={() => pick(o.value)}
                        class={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-[var(--surface-2)] ${
                          o.value === props.value ? 'text-[var(--focus)]' : 'text-[var(--text)]'
                        }`}
                      >
                        <Show when={o.icon}>
                          <span class={`${o.icon} w-3.5 h-3.5 shrink-0`} />
                        </Show>
                        <span class="truncate font-mono flex-1">{o.label}</span>
                        <Show when={o.desc}>
                          <span class="text-[10px] text-[var(--text-dim)] truncate max-w-28">{o.desc}</span>
                        </Show>
                        <Show when={o.value === props.value}>
                          <span class="i-mdi-check w-3.5 h-3.5 shrink-0" />
                        </Show>
                      </button>
                    )}
                  </For>
                </>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
}
