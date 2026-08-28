import type { Component } from 'solid-js'

interface HeaderProps {
  dark: () => boolean
  setDark: (v: boolean) => void
  loading: () => boolean
  loadData: () => void
  selectedCount: () => number
  selectAll: () => void
  clearSelection: () => void
  copySelected: () => void
  copied: () => boolean
  counts: () => { all: number; selected: number; mvp: number; high: number }
}

const Header: Component<HeaderProps> = (props) => (
  <header class="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/80">
    <div class="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-sm">
          IF
        </div>
        <div>
          <h1 class="text-lg font-bold leading-tight text-slate-900 dark:text-white">Idea Features</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400">เลือก features แล้ว copy ในรูปแบบ enhance-prompt</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <div class="hidden items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 md:flex">
          <span class="font-medium text-slate-500 dark:text-slate-400">ทั้งหมด</span>
          <span class="font-semibold text-slate-900 dark:text-white">{props.counts().all}</span>
          <span class="mx-1 text-slate-300 dark:text-slate-600">|</span>
          <span class="font-medium text-slate-500 dark:text-slate-400">เลือก</span>
          <span class="font-semibold text-blue-600 dark:text-blue-400">{props.counts().selected}</span>
          <span class="mx-1 text-slate-300 dark:text-slate-600">|</span>
          <span class="font-medium text-slate-500 dark:text-slate-400">MVP</span>
          <span class="font-semibold text-indigo-600 dark:text-indigo-400">{props.counts().mvp}</span>
          <span class="mx-1 text-slate-300 dark:text-slate-600">|</span>
          <span class="font-medium text-slate-500 dark:text-slate-400">Impact สูง</span>
          <span class="font-semibold text-rose-600 dark:text-rose-400">{props.counts().high}</span>
        </div>

        <button
          onClick={() => props.setDark(!props.dark())}
          class="rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          title="Toggle theme"
        >
          {props.dark() ? '☀' : '☾'}
        </button>
        <button
          onClick={props.loadData}
          disabled={props.loading()}
          class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          {props.loading() ? 'กำลังโหลด...' : 'โหลดใหม่'}
        </button>
        <button
          onClick={props.selectAll}
          class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          เลือกทั้งหมด
        </button>
        <button
          onClick={props.clearSelection}
          class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          ล้าง
        </button>
        <button
          onClick={props.copySelected}
          class="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
          disabled={props.selectedCount() === 0}
        >
          {props.copied() ? 'Copied!' : `Copy ${props.selectedCount()} รายการ`}
        </button>
      </div>
    </div>
  </header>
)

export default Header
