import { Show } from 'solid-js'
import { Badge, impactColor, riskColor } from './ui'

const SortButton = (props: { label: string; column: any }) => (
  <button onClick={props.column.getToggleSortingHandler()} class="flex items-center gap-1 font-semibold">
    {props.label}
    <Show when={props.column.getIsSorted() === 'asc'}>▲</Show>
    <Show when={props.column.getIsSorted() === 'desc'}>▼</Show>
  </button>
)

export const columns: any[] = [
  {
    id: 'select',
    header: ({ table }: any) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
    ),
    cell: ({ row }: any) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'number',
    header: '#',
    cell: (info: any) => <span class="text-sm font-mono text-gray-500 dark:text-gray-400">#{info.getValue()}</span>,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: (info: any) => <Badge class="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">{info.getValue()}</Badge>,
  },
  {
    accessorKey: 'impact',
    header: 'Impact',
    cell: (info: any) => <Badge class={impactColor(info.getValue())}>{info.getValue()}</Badge>,
  },
  {
    accessorKey: 'feature',
    header: ({ column }: any) => <SortButton label="Feature" column={column} />,
    cell: (info: any) => (
      <div>
        <div class="font-semibold text-gray-900 dark:text-white">{info.getValue()}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">{info.row.original.description}</div>
      </div>
    ),
  },
  {
    accessorKey: 'phase',
    header: 'Phase',
    cell: (info: any) => <Badge class="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{info.getValue()}</Badge>,
  },
  {
    accessorKey: 'effort',
    header: 'Effort',
    cell: (info: any) => <Badge class="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">{info.getValue()}</Badge>,
  },
  {
    accessorKey: 'mvpScore',
    header: ({ column }: any) => <SortButton label="MVP" column={column} />,
    cell: (info: any) => <span class="text-sm font-medium text-gray-900 dark:text-white">{info.getValue()}</span>,
    sortingFn: 'basic',
  },
  {
    accessorKey: 'risk',
    header: 'Risk',
    cell: (info: any) => <Badge class={riskColor(info.getValue())}>{info.getValue()}</Badge>,
  },
  {
    id: 'expand',
    header: '',
    cell: ({ row }: any) => (
      <button
        onClick={() => row.toggleExpanded()}
        class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        {row.getIsExpanded() ? '▲' : '▼'}
      </button>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
