import { For, Show, createSignal } from 'solid-js'
import { meta } from '../lib/ideas'
import { buildImplementPrompt, buildRegenPrompt, copyText } from '../lib/prompt'
import { queueRegenerate } from '../lib/regen'
import type { Idea } from '../types/idea'

interface Props {
  idea: Idea | null
}

function Section(props: { title: string; children: any }) {
  return (
    <section>
      <h3 class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">{props.title}</h3>
      {props.children}
    </section>
  )
}

export default function PreviewPanel(p: Props) {
  const [copied, setCopied] = createSignal(false)
  const [queued, setQueued] = createSignal(false)

  const flash = (set: (v: boolean) => void) => {
    set(true)
    setTimeout(() => set(false), 1500)
  }

  const onCopy = async (idea: Idea) => {
    await copyText(buildImplementPrompt(idea, meta.project, meta.topic))
    flash(setCopied)
  }

  const onRegen = async (idea: Idea) => {
    try {
      await queueRegenerate({ data: { no: idea.no, title: idea.title } })
    } catch {}
    await copyText(buildRegenPrompt(idea, meta.project, meta.topic))
    flash(setQueued)
  }

  return (
    <Show
      when={p.idea}
      fallback={<div class="rounded-lg border border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]">Hover a card to preview</div>}
    >
      {(idea) => (
        <div class="space-y-4 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="rounded bg-sky-500/20 px-1.5 py-0.5 font-mono text-xs text-sky-300">#{idea().no}</span>
              <h2 class="text-base font-bold">{idea().title}</h2>
            </div>
            <Show when={meta.topic}>
              <p class="mt-1 text-xs text-[var(--faint)]">topic: {meta.topic}</p>
            </Show>
            <div class="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => onCopy(idea())}
                class="rounded-md border border-[var(--border2)] bg-[var(--panel)] px-2.5 py-1 text-xs text-[var(--sub)] hover:border-sky-500"
              >
                {copied() ? '✓ Copied!' : '📋 Copy prompt'}
              </button>
              <button
                type="button"
                onClick={() => onRegen(idea())}
                title="queue regenerate + copy regen prompt"
                class="rounded-md border border-[var(--border2)] bg-[var(--panel)] px-2.5 py-1 text-xs text-[var(--sub)] hover:border-amber-400"
              >
                {queued() ? '✓ Queued + copied' : '♻️ Regenerate'}
              </button>
            </div>
            <div class="mt-1 flex flex-wrap gap-1.5 text-[10px] text-[var(--muted)]">
              <span class="rounded bg-[var(--panel2)] px-1.5 py-0.5">{idea().kind}</span>
              <span class="rounded bg-[var(--panel2)] px-1.5 py-0.5">{idea().category}</span>
              <span class="rounded bg-[var(--panel2)] px-1.5 py-0.5">{idea().phase}</span>
              <span class="rounded bg-[var(--panel2)] px-1.5 py-0.5">impact: {idea().impact}</span>
              <span class="rounded bg-[var(--panel2)] px-1.5 py-0.5">effort: {idea().effort}</span>
              <span class="rounded bg-[var(--panel2)] px-1.5 py-0.5">mvp: {idea().mvpScore}/10</span>
              <For each={idea().tags}>{(t) => <span class="rounded bg-sky-500/15 px-1.5 py-0.5 text-sky-300">#{t}</span>}</For>
            </div>
          </div>

          <Section title="Preview">
            <pre class="ansi-sketch overflow-auto rounded bg-[var(--sketch)] p-2.5 font-mono text-[10px] leading-tight text-[var(--text)]">
              {idea().ansi}
            </pre>
          </Section>

          <Section title="Description">
            <p class="text-sm text-[var(--sub)]">{idea().description}</p>
          </Section>

          <Section title="Why">
            <p class="text-sm text-[var(--sub)]">{idea().why}</p>
          </Section>

          <Section title="Usage">
            <p class="text-sm text-[var(--sub)]">{idea().usage}</p>
          </Section>

          <Section title="Features">
            <ul class="list-disc space-y-0.5 pl-4 text-sm text-[var(--sub)]">
              <For each={idea().features}>{(f) => <li>{f}</li>}</For>
            </ul>
          </Section>

          <Section title="Risk">
            <p class="text-sm text-rose-300/90">{idea().risk}</p>
          </Section>

          <Section title="File Changes">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-[var(--border)] text-left text-[var(--muted)]">
                  <th class="py-1 pr-2">No.</th>
                  <th class="py-1 pr-2">File</th>
                  <th class="py-1 pr-2">Action</th>
                  <th class="py-1">Note</th>
                </tr>
              </thead>
              <tbody>
                <For each={idea().fileChanges}>
                  {(fc, i) => (
                    <tr class="border-b border-[var(--border)]">
                      <td class="py-1 pr-2 text-[var(--muted)]">{i() + 1}</td>
                      <td class="py-1 pr-2 font-mono text-[var(--text)]">{fc.path}</td>
                      <td class="py-1 pr-2">
                        <span
                          class={`rounded px-1 py-0.5 ${
                            fc.action === 'create'
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : fc.action === 'delete'
                                ? 'bg-rose-500/15 text-rose-300'
                                : 'bg-amber-500/15 text-amber-300'
                          }`}
                        >
                          {fc.action}
                        </span>
                      </td>
                      <td class="py-1 text-[var(--muted)]">{fc.note}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </Section>

          <Section title="Test Cases">
            <ol class="list-decimal space-y-0.5 pl-4 text-sm text-[var(--sub)]">
              <For each={idea().testCases}>{(t) => <li>{t}</li>}</For>
            </ol>
          </Section>
        </div>
      )}
    </Show>
  )
}
