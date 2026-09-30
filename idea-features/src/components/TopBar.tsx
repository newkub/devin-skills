import { For } from 'solid-js'
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
}

const selectCls =
  'rounded-md bg-neutral-900 border border-neutral-700 px-2 py-1.5 text-sm text-neutral-200 outline-none focus:border-sky-500'

export default function TopBar(p: Props) {
  return (
    <header class="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur px-4 py-3 space-y-2">
      <div class="flex flex-wrap items-center gap-2">
        <input
          type="search"
          placeholder="Search ideas…"
          value={p.filters.query}
          onInput={(e) => p.onQuery(e.currentTarget.value)}
          class="min-w-56 flex-1 rounded-md bg-neutral-900 border border-neutral-700 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
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
        <span class="ml-auto text-xs text-neutral-500">
          {p.count}/{p.total} ideas
        </span>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <For each={p.tags}>
          {(t) => (
            <button
              type="button"
              onClick={() => p.onToggleTag(t)}
              class={`rounded-full border px-2 py-0.5 text-xs transition-colors ${
                p.filters.tags.includes(t)
                  ? 'border-sky-500 bg-sky-500/20 text-sky-300'
                  : 'border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-500'
              }`}
            >
              #{t}
            </button>
          )}
        </For>
      </div>
    </header>
  )
}
