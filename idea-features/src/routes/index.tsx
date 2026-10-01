import { createFileRoute } from '@tanstack/solid-router'
import { For, Show, createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import IdeaCard from '../components/IdeaCard'
import PreviewPanel from '../components/PreviewPanel'
import TopBar from '../components/TopBar'
import {
  allCategories,
  allIdeas,
  allTags,
  filterIdeas,
  groupIdeas,
  meta,
  sortByImpact,
  type GroupBy,
  type IdeaFilters,
} from '../lib/ideas'
import type { Idea } from '../types/idea'

export const Route = createFileRoute('/')({ component: IdeasPage })

const defaultFilters: IdeaFilters = { query: '', kind: 'all', category: 'all', phase: 'all', tags: [] }

function IdeasPage() {
  const [filters, setFilters] = createSignal<IdeaFilters>(defaultFilters)
  const [groupBy, setGroupBy] = createSignal<GroupBy>('none')
  const [hovered, setHovered] = createSignal<Idea | null>(null)
  const [pinned, setPinned] = createSignal<Idea | null>(null)

  const filtered = createMemo(() => sortByImpact(filterIdeas(allIdeas, filters())))
  const grouped = createMemo(() => groupIdeas(filtered(), groupBy()))
  const preview = () => hovered() ?? pinned() ?? filtered()[0] ?? null

  const hasFilters = () =>
    filters().query !== '' ||
    filters().kind !== 'all' ||
    filters().category !== 'all' ||
    filters().phase !== 'all' ||
    filters().tags.length > 0

  onMount(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPinned(null)
    }
    document.addEventListener('keydown', onKey)
    onCleanup(() => document.removeEventListener('keydown', onKey))
  })

  const patch = (p: Partial<IdeaFilters>) => setFilters((f) => ({ ...f, ...p }))
  const toggleTag = (t: string) =>
    patch({ tags: filters().tags.includes(t) ? filters().tags.filter((x) => x !== t) : [...filters().tags, t] })

  return (
    <div class="min-h-screen bg-[var(--bg)] font-sans text-[var(--text)]">
      <TopBar
        filters={filters()}
        categories={allCategories(allIdeas)}
        tags={allTags(allIdeas)}
        count={filtered().length}
        total={allIdeas.length}
        groupBy={groupBy()}
        onQuery={(query) => patch({ query })}
        onKind={(kind) => patch({ kind })}
        onCategory={(category) => patch({ category })}
        onPhase={(phase) => patch({ phase })}
        onToggleTag={toggleTag}
        onGroupBy={setGroupBy}
        hasFilters={hasFilters()}
        onClear={() => setFilters(defaultFilters)}
      />
      <Show when={meta.project || meta.topic}>
        <div class="border-b border-[var(--border)] px-4 py-1.5 text-xs text-[var(--muted)]">
          {meta.project} {meta.topic ? `— ${meta.topic}` : ''} {meta.generatedAt ? `· generated ${meta.generatedAt}` : ''}
        </div>
      </Show>
      <main class="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_24rem]">
        <div class="space-y-5">
          <For each={grouped()}>
            {([name, list]) => (
              <section>
                <Show when={groupBy() !== 'none'}>
                  <h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
                    {name} <span class="text-[var(--faint)]">({list.length})</span>
                  </h2>
                </Show>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  <For each={list}>
                    {(idea) => (
                      <IdeaCard
                        idea={idea}
                        active={preview()?.no === idea.no}
                        pinned={pinned()?.no === idea.no}
                        onHover={setHovered}
                        onPin={setPinned}
                      />
                    )}
                  </For>
                </div>
              </section>
            )}
          </For>
          <Show when={filtered().length === 0}>
            <div class="py-12 text-center">
              <p class="text-sm text-[var(--muted)]">
                No ideas match — adjust filters, or run <code>/idea-features</code> to generate <code>src/data/ideas.json</code>.
              </p>
              <Show when={hasFilters()}>
                <button
                  type="button"
                  onClick={() => setFilters(defaultFilters)}
                  class="mt-3 rounded-md border border-[var(--border2)] bg-[var(--panel)] px-3 py-1.5 text-xs text-[var(--sub)] hover:border-sky-500"
                >
                  Clear all filters
                </button>
              </Show>
            </div>
          </Show>
        </div>
        <aside class="h-fit overflow-auto lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)]">
          <PreviewPanel idea={preview()} />
        </aside>
      </main>
    </div>
  )
}
