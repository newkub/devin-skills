# Lib TanStack Ecosystem API & Dependencies

## Install

ติดตั้งตาม naming convention `@tanstack/{framework}-{lib}` ด้วย package manager ของ project:

```sh
bun add @tanstack/react-query
# or
npm install @tanstack/react-query
# or
pnpm add @tanstack/react-query
```

## Current Versions (npm, Sep 2026)

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
| `@tanstack/ai` | 0.53.x |
| `@tanstack/cli` | 0.71.x |

- [Package Registry](https://www.npmjs.com/org/tanstack)
- [Repositories](https://github.com/TanStack)

## Dependencies

- Core packages (`@tanstack/query-core`, `@tanstack/table-core`, `@tanstack/store`) ไม่มี framework dependencies — framework adapters ใส่ framework เป็น `peerDependencies`
- ดู transitive dependencies ที่ package registry ของแต่ละ package

## Common API

| Library | Entry point หลัก | ตัวอย่าง API |
|---|---|---|
| Query | `QueryClient`, `QueryClientProvider` | `useQuery`, `useMutation`, `useQueryClient` |
| Router | `createRouter`, `RouterProvider` | `createRoute`, `createFileRoute`, `Link`, `useNavigate` |
| Start | `tanstackStart` (build plugin) | `createServerFn`, server routes |
| Table | `useReactTable` / `createTable` | `getCoreRowModel`, `flexRender`, column helpers |
| Form | `useForm` / `createForm` | `form.Field`, validators (Standard Schema) |
| Store | `createStore` (`@tanstack/store`) | `useStore`, `setState`, `subscribe`, `batch` |
| Virtual | `useVirtualizer` | `getVirtualItems`, `measureElement` |
| CLI | `npx @tanstack/cli` | `create`, `--blank`, `--router-only`, `--add-ons` |

## Source

- Official docs: https://tanstack.com/libraries
- GitHub org: https://github.com/TanStack
