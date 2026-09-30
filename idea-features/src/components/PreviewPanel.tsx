import { For, Show } from 'solid-js'
import type { Idea } from '../types/idea'

interface Props {
  idea: Idea | null
}

function Section(props: { title: string; children: any }) {
  return (
    <section>
      <h3 class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">{props.title}</h3>
      {props.children}
    </section>
  )
}

export default function PreviewPanel(p: Props) {
  return (
    <Show
      when={p.idea}
      fallback={<div class="rounded-lg border border-neutral-800 p-6 text-center text-sm text-neutral-500">Hover a card to preview</div>}
    >
      {(idea) => (
        <div class="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="rounded bg-sky-500/20 px-1.5 py-0.5 font-mono text-xs text-sky-300">#{idea().no}</span>
              <h2 class="text-base font-bold">{idea().title}</h2>
            </div>
            <div class="mt-1 flex flex-wrap gap-1.5 text-[10px] text-neutral-400">
              <span class="rounded bg-neutral-800 px-1.5 py-0.5">{idea().kind}</span>
              <span class="rounded bg-neutral-800 px-1.5 py-0.5">{idea().category}</span>
              <span class="rounded bg-neutral-800 px-1.5 py-0.5">{idea().phase}</span>
              <span class="rounded bg-neutral-800 px-1.5 py-0.5">impact: {idea().impact}</span>
              <span class="rounded bg-neutral-800 px-1.5 py-0.5">effort: {idea().effort}</span>
              <span class="rounded bg-neutral-800 px-1.5 py-0.5">mvp: {idea().mvpScore}/10</span>
              <For each={idea().tags}>{(t) => <span class="rounded bg-sky-500/15 px-1.5 py-0.5 text-sky-300">#{t}</span>}</For>
            </div>
          </div>

          <Section title="Preview">
            <pre class="ansi-sketch overflow-auto rounded bg-black/70 p-2.5 font-mono text-[10px] leading-tight text-neutral-200">
              {idea().ansi}
            </pre>
          </Section>

          <Section title="Description">
            <p class="text-sm text-neutral-300">{idea().description}</p>
          </Section>

          <Section title="Why">
            <p class="text-sm text-neutral-300">{idea().why}</p>
          </Section>

          <Section title="Usage">
            <p class="text-sm text-neutral-300">{idea().usage}</p>
          </Section>

          <Section title="Features">
            <ul class="list-disc space-y-0.5 pl-4 text-sm text-neutral-300">
              <For each={idea().features}>{(f) => <li>{f}</li>}</For>
            </ul>
          </Section>

          <Section title="Risk">
            <p class="text-sm text-rose-300/90">{idea().risk}</p>
          </Section>

          <Section title="File Changes">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-neutral-800 text-left text-neutral-500">
                  <th class="py-1 pr-2">No.</th>
                  <th class="py-1 pr-2">File</th>
                  <th class="py-1 pr-2">Action</th>
                  <th class="py-1">Note</th>
                </tr>
              </thead>
              <tbody>
                <For each={idea().fileChanges}>
                  {(fc, i) => (
                    <tr class="border-b border-neutral-800/60">
                      <td class="py-1 pr-2 text-neutral-500">{i() + 1}</td>
                      <td class="py-1 pr-2 font-mono text-neutral-200">{fc.path}</td>
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
                      <td class="py-1 text-neutral-400">{fc.note}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </Section>

          <Section title="Test Cases">
            <ol class="list-decimal space-y-0.5 pl-4 text-sm text-neutral-300">
              <For each={idea().testCases}>{(t) => <li>{t}</li>}</For>
            </ol>
          </Section>
        </div>
      )}
    </Show>
  )
}
