import { For, Show, createSignal, onMount } from 'solid-js'
import type { GroupBy, IdeaFilters } from '../lib/ideas'

interface Props {
  filters: IdeaFilters
  categories: string[]
  tags: string[]
  count: number
  total: number
  groupBy: GroupBy
  onQuery: (v: string) => void
  onKind: (v: IdeaFilters['kind']) => void
  onCategory: (v: string) => void
  onPhase: (v: IdeaFilters['phase']) => void
  onToggleTag: (t: string) => void
  onGroupBy: (v: GroupBy) => void
  hasFilters: boolean
  onClear: () => void
}

const selectCls =
  'rounded-md bg-[var(--panel)] border border-[var(--border2)] px-2 py-1.5 text-sm text-[var(--text)] outline-none focus:border-sky-500'

const TAG_LIMIT = 20

export default function TopBar(p: Props) {
  const [expanded, setExpanded] = createSignal(false)
  const [light, setLight] = createSignal(false)
  onMount(() => setLight(document.documentElement.classList.contains('light')))
  const toggleTheme = () => {
    const next = !light()
    setLight(next)
    document.documentElement.classList.toggle('light', next)
    try { localStorage.setItem('iv-theme', next ? 'light' : 'dark') } catch {}
  }
  const visibleTags = () => (expanded() ? p.tags : p.tags.slice(0, TAG_LIMIT))
  return (
    <header class="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg)] backdrop-blur px-4 py-3 space-y-2">
      <div class="flex flex-wrap items-center gap-2">
        <input
          type="search"
          placeholder="Search ideas…"
          value={p.filters.query}
          onInput={(e) => p.onQuery(e.currentTarget.value)}
          aria-label="Search ideas"
          class="min-w-56 flex-1 rounded-md bg-[var(--panel)] border border-[var(--border2)] px-3 py-1.5 text-sm outline-none focus:border-sky-500"
        />
        <select class={selectCls} value={p.filters.kind} onChange={(e) => p.onKind(e.currentTarget.value as IdeaFilters['kind'])} aria-label="Filter">
          <option value="all">All kinds</option>
          <option value="extends">Extends</option>
          <option value="new">New</option>
        </select>
        <select class={selectCls} value={p.filters.phase} onChange={(e) => p.onPhase(e.currentTarget.value as IdeaFilters['phase'])} aria-label="Phase">
          <option value="all">All phases</option>
          <option value="mvp">MVP</option>
          <option value="v2">v2</option>
          <option value="v3">v3</option>
        </select>
        <select class={selectCls} value={p.filters.category} onChange={(e) => p.onCategory(e.currentTarget.value)} aria-label="Category">
          <option value="all">All categories</option>
          <For each={p.categories}>{(c) => <option value={c}>{c}</option>}</For>
        </select>
        <select class={selectCls} value={p.groupBy} onChange={(e) => p.onGroupBy(e.currentTarget.value as GroupBy)} aria-label="Group by">
          <option value="none">No grouping</option>
          <option value="category">Group: category</option>
          <option value="kind">Group: kind</option>
          <option value="phase">Group: phase</option>
          <option value="impact">Group: impact</option>
        </select>
        <Show when={p.hasFilters}>
          <button
            type="button"
            onClick={p.onClear}
            class="rounded-md border border-[var(--border2)] bg-[var(--panel)] px-2 py-1.5 text-xs text-[var(--sub)] hover:border-rose-400 hover:text-rose-400"
          >
            Clear filters
          </button>
        </Show>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          class="rounded-md border border-[var(--border2)] bg-[var(--panel)] px-2 py-1.5 text-xs text-[var(--sub)] hover:border-sky-500"
        >
          {light() ? '🌙' : '☀️'}
        </button>
        <span class="text-xs text-[var(--muted)]">
          {p.count}/{p.total} ideas
        </span>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <For each={visibleTags()}>
          {(t) => (
            <button
              type="button"
              onClick={() => p.onToggleTag(t)}
              class={`rounded-full border px-2 py-0.5 text-xs transition-colors ${
                p.filters.tags.includes(t)
                  ? 'border-sky-500 bg-sky-500/20 text-sky-300'
                  : 'border-[var(--border2)] bg-[var(--panel)] text-[var(--muted)] hover:border-[var(--border2)]'
              }`}
            >
              #{t}
            </button>
          )}
        </For>
        <Show when={p.tags.length > TAG_LIMIT}>
          <button
            type="button"
            onClick={() => setExpanded(!expanded())}
            class="rounded-full border border-dashed border-[var(--border2)] px-2 py-0.5 text-xs text-[var(--muted)] hover:border-sky-500"
          >
            {expanded() ? 'less' : `+${p.tags.length - TAG_LIMIT} more`}
          </button>
        </Show>
      </div>
    </header>
  )
}
