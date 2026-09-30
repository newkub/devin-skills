import { For } from 'solid-js'
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
      onMouseEnter={() => p.onHover(p.idea)}
      onClick={() => p.onPin(p.idea)}
      class={`cursor-pointer rounded-lg border p-3 transition-colors ${
        p.pinned
          ? 'border-sky-500 bg-sky-500/10'
          : p.active
            ? 'border-neutral-500 bg-neutral-900'
            : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-600'
      }`}
    >
      <div class="mb-1.5 flex items-center gap-2">
        <span class="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-xs text-neutral-300">#{p.idea.no}</span>
        <span class="truncate text-sm font-semibold">{p.idea.title}</span>
      </div>
      <pre class="ansi-sketch mb-2 overflow-hidden rounded bg-black/60 p-1.5 font-mono text-[9px] leading-tight text-neutral-400">
        {p.idea.ansi}
      </pre>
      <ul class="mb-2 space-y-0.5">
        <For each={p.idea.features.slice(0, 3)}>
          {(f) => <li class="truncate text-xs text-neutral-300">• {f}</li>}
        </For>
      </ul>
      <p class="line-clamp-2 text-xs text-neutral-500">{p.idea.description}</p>
      <div class="mt-2 flex items-center gap-2 text-[10px]">
        <span class={`font-semibold uppercase ${impactColor[p.idea.impact]}`}>{p.idea.impact}</span>
        <span class="text-neutral-600">{p.idea.kind}</span>
        <span class="text-neutral-600">{p.idea.phase}</span>
        <span class="ml-auto text-neutral-500">mvp {p.idea.mvpScore}</span>
      </div>
    </article>
  )
}
