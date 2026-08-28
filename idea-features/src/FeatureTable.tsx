import { For, Show } from 'solid-js'
import type { Component } from 'solid-js'
import { FlexRender } from '@tanstack/solid-table'
import { generateSketch } from './sketch'

interface FeatureTableProps {
  table: any
}

const FeatureTable: Component<FeatureTableProps> = (props) => {
  return (
    <section class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="sticky top-0 z-10 bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
            <For each={props.table.getHeaderGroups()}>
              {(headerGroup: any) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header: any) => (
                      <th
                        class="border-b border-gray-200 px-4 py-3 font-semibold dark:border-gray-700"
                        onClick={header.column.getCanSort?.() ? header.column.getToggleSortingHandler() : undefined}
                      >
                        <Show when={!header.isPlaceholder}>
                          {header.column.getCanSort?.() && header.column.getIsSorted?.() ? (
                            <span class="ml-1 text-gray-400">
                              {header.column.getIsSorted() === 'asc' ? '▲' : '▼'}
                            </span>
                          ) : null}
                          <FlexRender header={header} />
                        </Show>
                      </th>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
            <For each={props.table.getRowModel().rows} fallback={
              <tr>
                <td colSpan={props.table.getAllLeafColumns().length} class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  ไม่พบ features
                </td>
              </tr>
            }>
              {(row: any) => (
                <>
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <For each={row.getVisibleCells()}>
                      {(cell: any) => (
                        <td class="whitespace-nowrap px-4 py-3">
                          <FlexRender cell={cell} />
                        </td>
                      )}
                    </For>
                  </tr>
                  <Show when={row.getIsExpanded?.()}>
                    <tr>
                      <td colSpan={row.getVisibleCells().length} class="bg-gray-50 px-4 py-4 dark:bg-gray-900/50">
                        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                          <div>
                            <h4 class="mb-2 text-sm font-semibold text-gray-900 dark:text-white">UX/UI Sketch</h4>
                            <pre class="overflow-x-auto rounded border border-gray-200 bg-white p-3 text-xs leading-tight text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              {generateSketch(row.original)}
                            </pre>
                          </div>
                          <div>
                            <h4 class="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Details</h4>
                            <div class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                              <p><span class="font-medium text-gray-900 dark:text-white">Why:</span> {row.original.reason || '-'}</p>
                              <p><span class="font-medium text-gray-900 dark:text-white">How:</span> {row.original.how || '-'}</p>
                              <p><span class="font-medium text-gray-900 dark:text-white">Risk:</span> {row.original.riskDetail || '-'}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </Show>
                </>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default FeatureTable
