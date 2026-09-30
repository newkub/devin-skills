import { createFileRoute } from '@tanstack/solid-router'
import { For, Show, createMemo, createSignal } from 'solid-js'
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

  const patch = (p: Partial<IdeaFilters>) => setFilters((f) => ({ ...f, ...p }))
  const toggleTag = (t: string) =>
    patch({ tags: filters().tags.includes(t) ? filters().tags.filter((x) => x !== t) : [...filters().tags, t] })

  return (
    <div class="min-h-screen bg-neutral-950 font-sans text-neutral-100">
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
      />
      <Show when={meta.project || meta.topic}>
        <div class="border-b border-neutral-800 px-4 py-1.5 text-xs text-neutral-500">
          {meta.project} {meta.topic ? `— ${meta.topic}` : ''} {meta.generatedAt ? `· generated ${meta.generatedAt}` : ''}
        </div>
      </Show>
      <main class="grid grid-cols-[1fr_24rem] gap-4 p-4">
        <div class="space-y-5">
          <For each={grouped()}>
            {([name, list]) => (
              <section>
                <Show when={groupBy() !== 'none'}>
                  <h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">
                    {name} <span class="text-neutral-600">({list.length})</span>
                  </h2>
                </Show>
                <div class="grid grid-cols-4 gap-3">
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
            <p class="py-12 text-center text-sm text-neutral-500">
              No ideas match — adjust filters, or run <code>/idea-features</code> to generate <code>src/data/ideas.json</code>.
            </p>
          </Show>
        </div>
        <aside class="sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-auto">
          <PreviewPanel idea={preview()} />
        </aside>
      </main>
    </div>
  )
}
