import type { Component } from 'solid-js'
import type { useFeatureApp } from './hooks/useFeatureApp'

type App = ReturnType<typeof useFeatureApp>

interface HeaderProps {
  loading: () => boolean
  loadData: () => void
  app: App
}

const Header: Component<HeaderProps> = (props) => {
  return (
    <header class="flex h-12 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-4">
      <div class="flex items-center gap-2">
        <div class="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-900">
          IF
        </div>
        <h1 class="text-sm font-semibold text-slate-100">Idea Features</h1>
      </div>

      <div class="flex items-center gap-2">
        <div class="hidden items-center gap-2 text-xs text-slate-400 md:flex">
          <span>{props.app.counts().all} total</span>
          <span class="text-slate-600">|</span>
          <span class="font-medium text-slate-200">{props.app.counts().high} high</span>
          <span class="text-slate-600">|</span>
          <span>{props.app.counts().mvp} MVP</span>
        </div>

        <button
          onClick={props.loadData}
          disabled={props.loading()}
          class="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-50"
        >
          {props.loading() ? '...' : 'Reload'}
        </button>
      </div>
    </header>
  )
}

export default Header
