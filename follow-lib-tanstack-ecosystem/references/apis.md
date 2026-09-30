| key | value |
|---|---|
| install | `bun add @tanstack/react-query` |
| package registry | https://www.npmjs.com/org/tanstack |
| repo | https://github.com/TanStack |
| docs | https://tanstack.com/libraries |

| Package | Version |
|---------|---------|
| `@tanstack/react-query` | 5.102.x |
| `@tanstack/react-router` | 1.170.x |
| `@tanstack/react-start` | 1.168.x |
| `@tanstack/react-form` | 1.33.x |
| `@tanstack/react-table` | 9.2.x |
| `@tanstack/react-virtual` | 3.14.x |
| `@tanstack/react-store` | 0.11.x |
| `@tanstack/react-db` | 0.3.x |
| `@tanstack/react-pacer` | 0.23.x |
| `@tanstack/ai` | 0.54.x |
| `@tanstack/cli` | 0.71.x |

| Library | Entry point หลัก | ตัวอย่าง API |
|---|---|---|
| Query | `QueryClient`, `QueryClientProvider` | `useQuery`, `useMutation`, `useQueryClient` |
| Router | `createRouter`, `RouterProvider` | `createRoute`, `createFileRoute`, `Link`, `useNavigate` |
| Start | `tanstackStart` (build plugin) | `createServerFn`, server routes |
| Table | `useReactTable` / `createTable` | `getCoreRowModel`, `flexRender`, column helpers |
| Form | `useForm` / `createForm` | `form.Field`, validators (Standard Schema) |
| Store | `createStore` (`@tanstack/store`) | `useStore`, `setState`, `subscribe`, `batch` |
| Virtual | `useVirtualizer` | `getVirtualItems`, `measureElement` |
| CLI | `bunx @tanstack/cli` | `create`, `--blank`, `--router-only`, `--add-ons` |
