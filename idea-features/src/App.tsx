import { Show } from 'solid-js'
import type { Component } from 'solid-js'
import { useFeatures } from './hooks/useFeatures'
import { useFeatureTable } from './hooks/useFeatureTable'
import Header from './Header'
import Summary from './Summary'
import Filters from './Filters'
import FeatureTable from './FeatureTable'

const App: Component = () => {
  const { features, loading, error, dark, setDark, loadData } = useFeatures()
  const {
    table,
    search,
    setSearch,
    activeFilters,
    setActiveFilters,
    filterCategories,
    filteredCount,
    tab,
    setTab,
    clearFilters,
    copySelected,
    copied,
    selectedRows,
    counts,
  } = useFeatureTable(features)

  return (
    <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Header
        dark={dark}
        setDark={setDark}
        loading={loading}
        loadData={loadData}
        table={table}
        selectedRows={selectedRows}
        copySelected={copySelected}
        copied={copied}
      />

      <main class="mx-auto max-w-7xl px-4 py-6">
        <Show when={loading()}>
          <div class="py-20 text-center text-gray-500 dark:text-gray-400">กำลังโหลดข้อมูล...</div>
        </Show>

        <Show when={error()}>
          <div class="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            {error()}
          </div>
        </Show>

        <Show when={!loading() && !error()}>
          <Summary counts={counts} tab={tab} setTab={setTab} />
          <Filters
            search={search}
            setSearch={setSearch}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            filterCategories={filterCategories}
            filteredCount={filteredCount}
            clearFilters={clearFilters}
          />
          <FeatureTable table={table} />
        </Show>
      </main>

      <footer class="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-gray-400 dark:text-gray-500">
        ปิด tab นี้เพื่อหยุด dev server อัตโนมัติ
      </footer>
    </div>
  )
}

export default App
