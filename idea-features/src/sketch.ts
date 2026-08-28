import type { Feature } from './types'

export const padRight = (s: string, n: number) => (s || '-').slice(0, n).padEnd(n)

export const generateSketch = (f: Feature) => {
  const title = padRight(f.feature, 46)
  const desc = padRight(f.description, 46)
  const reason = padRight((f.reason || '-').slice(0, 46), 46)
  const how = padRight((f.how || '-').slice(0, 46), 46)
  const risk = padRight((f.riskDetail || '-').slice(0, 46), 46)
  const webTitle = padRight(f.feature.slice(0, 34), 34)
  const mobileTitle = padRight(f.feature.slice(0, 24), 24)

  return [
    '┌──────────────────────────────────────────────────────────────┐',
    `│  ${title} │`,
    '├──────────────────────────────────────────────────────────────┤',
    '│  [List]  [Detail]  [Sketch]  [Settings]                     │',
    '├──────────────────────────────────────────────────────────────┤',
    '│                                                              │',
    '│  ┌─ Overview ───────────────────────────────────────┐       │',
    `│  │ Impact: ${padRight(f.impact, 8)}  Risk: ${padRight(f.risk, 8)}          │       │`,
    `│  │ Phase:  ${padRight(f.phase, 8)}  Effort: ${padRight(f.effort, 8)}         │       │`,
    `│  │ MVP Score: ${padRight(f.mvpScore.toString(), 2)} / 10                               │       │`,
    `│  │ Type: ${padRight(f.type, 8)}                                      │       │`,
    '│  └───────────────────────────────────────────────────┘       │',
    '│                                                              │',
    '│  ┌─ Description ─────────────────────────────────────┐       │',
    `│  │ ${desc} │       │`,
    '│  └───────────────────────────────────────────────────┘       │',
    '│                                                              │',
    '│  ┌─ Why / How / Risk ────────────────────────────────┐       │',
    `│  │ Why:   ${reason} │       │`,
    `│  │ How:   ${how} │       │`,
    `│  │ Risk:  ${risk} │       │`,
    '│  └───────────────────────────────────────────────────┘       │',
    '│                                                              │',
    '│  ┌─ Actions ─────────────────────────────────────────┐       │',
    '│  │ [Select]  [Copy]  [Add to Plan]  [Report UX]     │       │',
    '│  └───────────────────────────────────────────────────┘       │',
    '│                                                              │',
    '│  ┌─ Web Layout ──────────────────────────────────────┐       │',
    '│  │ ┌────────────────────────────────────────────┐   │       │',
    `│  │ │ Header: ${webTitle} [Filter]   │   │       │`,
    '│  │ ├──────────┬─────────────────────────────────┤   │       │',
    '│  │ │ Sidebar  │ Feature Card                    │   │       │',
    '│  │ │ [List]   │ Title + Description             │   │       │',
    '│  │ │ [Sketch] │ [Select] [View Detail]          │   │       │',
    '│  │ │ [Plan]   │                                 │   │       │',
    '│  │ └──────────┴─────────────────────────────────┘   │       │',
    '│  └───────────────────────────────────────────────────┘       │',
    '│                                                              │',
    '│  ┌─ Mobile Screen ───────────────────────────────────┐       │',
    '│  │ ┌────┐                                           │       │',
    `│  │ │ ≡  │  ${mobileTitle}    │       │`,
    '│  │ └────┘                                           │       │',
    '│  │                                                  │       │',
    `│  │  ${padRight(f.description.slice(0, 32), 32)}       │       │`,
    '│  │                                                  │       │',
    '│  │  [Tap for detail]                                │       │',
    '│  │                                                  │       │',
    '│  │  [Select]  [Copy]                                │       │',
    '│  │                                                  │       │',
    '│  └───────────────────────────────────────────────────┘       │',
    '│                                                              │',
    '└──────────────────────────────────────────────────────────────┘'
  ].join('\n')
}
