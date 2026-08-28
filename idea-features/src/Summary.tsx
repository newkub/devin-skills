import type { Accessor, Component } from 'solid-js'
import { Card } from './ui'

interface SummaryProps {
  counts: Accessor<{ all: number; extends: number; new: number; selected: number; mvp: number; high: number }>
  tab: Accessor<'all' | 'extends' | 'new' | 'selected'>
  setTab: (v: 'all' | 'extends' | 'new' | 'selected') => void
}

const tabs = [
  { key: 'all' as const, label: 'All' },
  { key: 'extends' as const, label: 'Extends' },
  { key: 'new' as const, label: 'New' },
  { key: 'selected' as const, label: 'Selected' },
]

const Summary: Component<SummaryProps> = (props) => (
  <>
    <section class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card title="ทั้งหมด" value={props.counts().all} />
      <Card title="เลือกแล้ว" value={props.counts().selected} />
      <Card title="MVP" value={props.counts().mvp} />
      <Card title="Impact สูง" value={props.counts().high} />
    </section>

    <section class="mb-4 flex flex-wrap gap-2">
      {tabs.map(t => (
        <button
          onClick={() => props.setTab(t.key)}
          class={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            props.tab() === t.key
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {t.label} <span class="ml-1 rounded-full bg-white/20 px-1.5 text-xs">{props.counts()[t.key]}</span>
        </button>
      ))}
    </section>
  </>
)

export default Summary
