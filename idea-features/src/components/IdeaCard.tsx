import { For } from 'solid-js'
import { ideaSurfaces } from '../lib/ideas'
import type { Idea } from '../types/idea'

interface Props {
  idea: Idea
  active: boolean
  pinned: boolean
  onHover: (idea: Idea) => void
  onPin: (idea: Idea) => void
}

const impactColor = { high: 'text-rose-400', medium: 'text-amber-400', low: 'text-emerald-400' } as const

export default function IdeaCard(p: Props) {
  return (
    <article
      role="button"
      tabIndex={0}
      aria-pressed={p.pinned}
      title="hover/focus = preview · click/Enter = pin"
      onMouseEnter={() => p.onHover(p.idea)}
      onFocus={() => p.onHover(p.idea)}
      onClick={() => p.onPin(p.idea)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          p.onPin(p.idea)
        }
      }}
      class={`cursor-pointer rounded-lg border p-3 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 ${
        p.pinned
          ? 'border-sky-500 bg-sky-500/10'
          : p.active
            ? 'border-[var(--border2)] bg-[var(--panel)]'
            : 'border-[var(--border)] bg-[var(--panel)] hover:border-[var(--border2)]'
      }`}
    >
      <div class="mb-1.5 flex items-center gap-2">
        <span class="rounded bg-[var(--panel2)] px-1.5 py-0.5 font-mono text-xs text-[var(--sub)]">#{p.idea.no}</span>
        <span class="truncate text-sm font-semibold">{p.idea.title}</span>
      </div>
      <div class="mb-2 flex flex-wrap gap-1">
        <For each={ideaSurfaces(p.idea).slice(0, 4)}>
          {(sf) => (
            <span class="rounded border border-[var(--border2)] bg-[var(--panel2)] px-1.5 py-0.5 font-mono text-[9px] text-sky-300/90">
              {sf}
            </span>
          )}
        </For>
      </div>
      <ul class="mb-2 space-y-0.5">
        <For each={p.idea.features.slice(0, 3)}>
          {(f) => <li class="truncate text-xs text-[var(--sub)]">• {f}</li>}
        </For>
      </ul>
      <p class="line-clamp-2 text-xs text-[var(--muted)]">{p.idea.description}</p>
      <div class="mt-2 flex items-center gap-2 text-[10px]">
        <span class={`font-semibold uppercase ${impactColor[p.idea.impact]}`}>{p.idea.impact}</span>
        <span class="text-[var(--faint)]">{p.idea.kind}</span>
        <span class="text-[var(--faint)]">{p.idea.phase}</span>
        <span class="ml-auto text-[var(--muted)]">
          {p.pinned ? '📌 ' : ''}mvp {p.idea.mvpScore}
        </span>
      </div>
    </article>
  )
}
