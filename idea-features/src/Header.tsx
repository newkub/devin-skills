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
}

const Header: Component<HeaderProps> = (props) => (
  <header class="sticky top-0 z-20 border-b border-gray-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
    <div class="mx-auto flex max-w-7xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Idea Features</h1>
        <p class="text-xs text-gray-500 dark:text-gray-400">เลือก features แล้ว copy ในรูปแบบ enhance-prompt</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          onClick={() => props.setDark(!props.dark())}
          class="rounded bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          {props.dark() ? 'Light' : 'Dark'}
        </button>
        <button
          onClick={props.loadData}
          disabled={props.loading()}
          class="rounded bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          {props.loading() ? 'กำลังโหลด...' : 'โหลดใหม่'}
        </button>
        <button
          onClick={props.selectAll}
          class="rounded bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          เลือกทั้งหมด
        </button>
        <button
          onClick={props.clearSelection}
          class="rounded bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          ล้าง
        </button>
        <button
          onClick={props.copySelected}
          class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {props.copied() ? 'Copied!' : `Copy ${props.selectedCount()} รายการ`}
        </button>
      </div>
    </div>
  </header>
)

export default Header
