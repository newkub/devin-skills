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
    <header class="flex h-12 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
      <div class="flex items-center gap-2">
        <div class="flex h-6 w-6 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
          IF
        </div>
        <h1 class="text-sm font-semibold text-surface-foreground">Idea Features</h1>
      </div>

      <div class="flex items-center gap-2">
        <div class="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
          <span>{props.app.counts().all} total</span>
          <span class="text-border">|</span>
          <span class="font-medium text-surface-foreground">{props.app.counts().high} high</span>
          <span class="text-border">|</span>
          <span>{props.app.counts().mvp} MVP</span>
        </div>

        <button
          onClick={props.loadData}
          disabled={props.loading()}
          class="rounded border border-border bg-muted px-2.5 py-1 text-xs font-medium text-surface-foreground hover:bg-border-hover hover:text-foreground disabled:opacity-50"
        >
          {props.loading() ? '...' : 'Reload'}
        </button>
      </div>
    </header>
  )
}

export default Header
