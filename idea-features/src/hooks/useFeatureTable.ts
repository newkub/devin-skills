import { createMemo, createSignal } from 'solid-js'
import { createTable, tableFeatures, stockFeatures, createCoreRowModel, createSortedRowModel, createFilteredRowModel, createExpandedRowModel } from '@tanstack/solid-table'
import type { Feature } from '../types'
import { columns } from '../columns'

const filterableKeys: (keyof Feature)[] = ['type', 'impact', 'phase', 'effort', 'risk']

export const useFeatureTable = (features: () => Feature[]) => {
  const [search, setSearch] = createSignal('')
  const [sorting, setSorting] = createSignal([] as any[])
  const [rowSelection, setRowSelection] = createSignal({} as Record<string, boolean>)
  const [expanded, setExpanded] = createSignal({} as Record<string, boolean>)
  const [tab, setTab] = createSignal<'all' | 'extends' | 'new' | 'selected'>('all')
  const [activeFilters, setActiveFilters] = createSignal<Record<string, Set<string>>>({})
  const [copied, setCopied] = createSignal(false)

  const filterCategories = createMemo(() => {
    const cats: Record<string, Set<string>> = {}
    for (const key of filterableKeys) cats[key] = new Set()
    for (const f of features()) {
      for (const key of filterableKeys) {
        const v = f[key]
        if (v !== undefined) cats[key].add(String(v))
      }
    }
    return cats
  })

  const visibleFeatures = createMemo(() => {
    let list = features()
    if (tab() === 'extends') list = list.filter(f => f.type === 'Extends')
    if (tab() === 'new') list = list.filter(f => f.type === 'New')
    if (tab() === 'selected') {
      const s = rowSelection()
      list = list.filter(f => s[f.number.toString()])
    }
    const af = activeFilters()
    list = list.filter(f =>
      Object.entries(af).every(([key, set]) => {
        if (set.size === 0) return true
        return set.has(String(f[key as keyof Feature]))
      })
    )
    return list
  })

  const table = createTable({
    features: tableFeatures({
      ...stockFeatures,
      coreRowModel: createCoreRowModel(),
      sortedRowModel: createSortedRowModel(),
      filteredRowModel: createFilteredRowModel(),
      expandedRowModel: createExpandedRowModel(),
    } as any),
    get data() { return visibleFeatures() },
    columns: columns as any,
    getRowId: (row: Feature) => row.number.toString(),
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableExpanding: true,
    getRowCanExpand: () => true,
    state: {
      get sorting() { return sorting() },
      get rowSelection() { return rowSelection() },
      get expanded() { return expanded() },
      get globalFilter() { return search() },
    },
    onSortingChange: (updater: any) => setSorting(typeof updater === 'function' ? updater(sorting()) : updater),
    onRowSelectionChange: (updater: any) => setRowSelection(typeof updater === 'function' ? updater(rowSelection()) : updater),
    onExpandedChange: (updater: any) => setExpanded(typeof updater === 'function' ? updater(expanded()) : updater),
    onGlobalFilterChange: setSearch,
    globalFilterFn: (row: any, _columnId: any, value: any) => {
      const f = row.original as Feature
      const q = String(value).toLowerCase()
      return [f.feature, f.description, f.type, f.impact, f.phase, f.effort, f.risk, f.reason, f.how, f.riskDetail]
        .some(v => v && String(v).toLowerCase().includes(q))
    },
  } as any)

  const selectedRows = createMemo(() => (table as any).getSelectedRowModel().rows)
  const filteredCount = createMemo(() => (table as any).getRowModel().rows.length)

  const clearFilters = () => {
    setActiveFilters({})
    setSearch('')
    setSorting([])
  }

  const copySelected = async () => {
    const rows = selectedRows()
    if (rows.length === 0) return
    const text = rows.map((row: any, i: number) => `${i + 1}. ${row.original.feature} — ${row.original.description}`).join('\n')
    try { await navigator.clipboard.writeText(text) } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const counts = createMemo(() => {
    const all = features()
    return {
      all: all.length,
      extends: all.filter(f => f.type === 'Extends').length,
      new: all.filter(f => f.type === 'New').length,
      selected: selectedRows().length,
      mvp: all.filter(f => f.phase === 'MVP').length,
      high: all.filter(f => f.impact === 'สูง').length,
    }
  })

  return {
    table: table as any,
    search,
    setSearch,
    sorting,
    setSorting,
    rowSelection,
    setRowSelection,
    expanded,
    setExpanded,
    tab,
    setTab,
    activeFilters,
    setActiveFilters,
    filterCategories,
    visibleFeatures,
    selectedRows,
    filteredCount,
    clearFilters,
    copySelected,
    copied,
    counts,
  }
}
