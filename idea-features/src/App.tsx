import { Show } from 'solid-js'
import type { Component } from 'solid-js'
import { useFeatures } from './hooks/useFeatures'
import { useFeatureApp } from './hooks/useFeatureApp'
import Header from './Header'
import Filters from './Filters'
import FeatureTable from './FeatureTable'

const App: Component = () => {
  const { features, loading, error, dark, setDark, loadData } = useFeatures()
  const app = useFeatureApp(features)

  return (
    <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header
        dark={dark}
        setDark={setDark}
        loading={loading}
        loadData={loadData}
        selectedCount={app.selectedCount}
        selectAll={app.selectAll}
        clearSelection={app.clearSelection}
        copySelected={app.copySelected}
        copied={app.copied}
        counts={app.counts}
      />

      <main class="mx-auto max-w-7xl px-4 py-6">
        <Show when={loading()}>
          <div class="py-24 text-center">
            <div class="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
            <div class="text-sm text-slate-500 dark:text-slate-400">กำลังโหลดข้อมูล...</div>
          </div>
        </Show>

        <Show when={error()}>
          <div class="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
            {error()}
          </div>
        </Show>

        <Show when={!loading() && !error()}>
          <Filters app={app} />
          <FeatureTable app={app} />
        </Show>
      </main>

      <footer class="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        close tab ไม่หยุด server แล้ว — หยุดเองใน terminal ตามต้องการ
      </footer>
    </div>
  )
}

export default App
