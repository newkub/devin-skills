import { Show } from 'solid-js'
import type { Component } from 'solid-js'
import { useFeatures } from './hooks/useFeatures'
import { useFeatureApp } from './hooks/useFeatureApp'
import Header from './Header'
import Filters from './Filters'
import FeatureGrid from './components/FeatureGrid'
import PreviewPanel from './components/PreviewDrawer'

const App: Component = () => {
  const { features, loading, error, loadData } = useFeatures()
  const app = useFeatureApp(features)

  return (
    <div class="flex h-screen flex-col bg-slate-950 text-slate-100">
      <Header
        loading={loading}
        loadData={loadData}
        app={app}
      />

      <main class="flex min-h-0 flex-1">
        <Show when={loading()}>
          <div class="flex w-full items-center justify-center">
            <div class="h-6 w-6 animate-spin rounded-full border-2 border-slate-800 border-t-blue-500"></div>
          </div>
        </Show>

        <Show when={error()}>
          <div class="flex w-full items-center justify-center p-6 text-sm text-red-400">
            {error()}
          </div>
        </Show>

        <Show when={!loading() && !error()}>
          <div class="flex h-full w-full flex-col overflow-y-auto p-5 lg:w-[calc(100%-26rem)]">
            <Filters app={app} />
            <FeatureGrid app={app} />
          </div>
          <PreviewPanel app={app} />
        </Show>
      </main>
    </div>
  )
}

export default App
