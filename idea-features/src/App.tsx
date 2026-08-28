import { Show } from 'solid-js'
import type { Component } from 'solid-js'
import { useFeatures } from './hooks/useFeatures'
import { useFeatureApp } from './hooks/useFeatureApp'
import Header from './Header'
import FeatureList from './components/FeatureList'
import SketchPanel from './components/SketchPanel'
import DetailPanel from './components/DetailPanel'

const App: Component = () => {
  const { features, loading, error, dark, setDark, loadData } = useFeatures()
  const app = useFeatureApp(features)

  return (
    <div class="flex h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
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
      />

      <main class="flex-1 overflow-hidden p-4">
        <Show when={loading()}>
          <div class="py-20 text-center text-gray-500 dark:text-gray-400">กำลังโหลดข้อมูล...</div>
        </Show>

        <Show when={error()}>
          <div class="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            {error()}
          </div>
        </Show>

        <Show when={!loading() && !error()}>
          <div class="grid h-full grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            <div class="h-full overflow-hidden lg:col-span-1">
              <FeatureList
                grouped={app.groupedFeatures()}
                selectedIds={app.selectedIds()}
                selectedDetailId={app.selectedDetailId()}
                search={app.search()}
                setSearch={app.setSearch}
                groupBy={app.groupBy()}
                setGroupBy={app.setGroupBy}
                sortBy={app.sortBy()}
                setSortBy={app.setSortBy}
                sortDesc={app.sortDesc()}
                setSortDesc={app.setSortDesc}
                activeFilters={app.activeFilters()}
                filterCategories={app.filterCategories()}
                toggleFilter={app.toggleFilter}
                clearFilters={app.clearFilters}
                toggleSelect={app.toggleSelect}
                setSelectedDetail={app.setSelectedDetailId}
                counts={app.counts()}
              />
            </div>
            <div class="h-full overflow-hidden lg:col-span-1 xl:col-span-1">
              <SketchPanel feature={app.selectedFeature()} />
            </div>
            <div class="h-full overflow-hidden lg:col-span-1 xl:col-span-2">
              <DetailPanel feature={app.selectedFeature()} />
            </div>
          </div>
        </Show>
      </main>

      <footer class="border-t border-gray-200 bg-white px-4 py-2 text-center text-xs text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500">
        ปิด tab นี้เพื่อหยุด dev server อัตโนมัติ
      </footer>
    </div>
  )
}

export default App
