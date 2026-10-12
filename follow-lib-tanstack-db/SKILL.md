---
name: follow-lib-tanstack-db
description: ใช้ TanStack DB ครบวงจร — collections, live queries, optimistic mutations, sync backends, joins
argument-hint: "[framework] [sync-backend]"
related:
  - follow-lib-tanstack-ecosystem
  - run-test
  - run-typecheck
  - resolve-errors
---

## Goal

ใช้ TanStack DB ครบ — reactive client store: collections, live queries (filter/join/order), optimistic mutations, sync engines (Query, ElectricSQL, localStorage, local-only)

## Scope

ใช้เมื่อต้องการ local-first/reactive data layer ที่ query ฝั่ง client ได้เหมือน DB — ตัวเลือกกับ `follow-query` (server cache ธรรมดา) — **0.x**: API อาจเปลี่ยน ตรวจ docs ล่าสุดก่อน implement

- part of TanStack ecosystem — selection/dispatch อยู่ที่ `/follow-lib-tanstack-ecosystem`

## Execute

### 1. Install Packages

> Goal: core + framework adapter + collection driver

1. `bun add @tanstack/db @tanstack/react-db` (React; มี `vue-db`/`solid-db`/`svelte-db`)
2. Driver ตาม backend:
   - REST/Query sync → `bun add @tanstack/query-db-collection`
   - ElectricSQL realtime sync → `bun add @tanstack/electric-db-collection`
   - localStorage persist → `localStorageCollectionOptions` จาก `@tanstack/db`
   - in-memory only → `localOnlyCollectionOptions`

### 2. Create Collections

> Goal: typed collections sync กับ backend

```ts
import { createCollection } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'

export const todosCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['todos'],
    queryFn: () => fetch('/api/todos').then((r) => r.json()),
    getKey: (t) => t.id,
    onInsert: async ({ transaction }) => { /* POST → server */ },
    onUpdate: async ({ transaction }) => { /* PATCH */ },
    onDelete: async ({ transaction }) => { /* DELETE */ },
    schema: todoSchema,  // zod/standard schema → runtime + type safety
  }),
)
```

- `electricCollectionOptions({ shape: { url, params } })` สำหรับ ElectricSQL — realtime push
- `localStorageCollectionOptions({ storageKey })` — persist offline
- `startSync`/eager vs lazy sync ตาม options

### 3. Live Queries

> Goal: reactive queries เหมือน DB

```ts
import { useLiveQuery, eq, gt } from '@tanstack/react-db'

const { data, isLoading } = useLiveQuery((q) =>
  q.from({ todo: todosCollection })
   .join({ todo: todosCollection }, ({ todo }) => eq(todo.listId, list.id))  // joins
   .where(({ todo }) => gt(todo.priority, 0))
   .orderBy(({ todo }) => todo.createdAt, 'desc')
   .select(({ todo }) => ({ id: todo.id, title: todo.title })),
)
```

- Operators: `eq`, `gt`, `lt`, `like`, `inArray`, `and`, `or` — import จาก adapter
- `groupBy` + aggregates (`count`, `sum`, `avg`) สำหรับ summary queries
- Multi-collection joins — live query re-evaluate เมื่อ collection ใดเปลี่ยน
- Non-hook usage: `liveQueryCollectionOptions` สร้าง derived collection ที่ reuse ได้

### 4. Mutations (Optimistic)

> Goal: writes ที่ UI เห็นทันที

1. `collection.insert(item)` / `collection.update(key, (d) => {...})` / `collection.delete(key)` — optimistic อัตโนมัติ
2. Transaction API: `mutationFn` ใน `useOptimisticMutation`/`createOptimisticAction` สำหรับ custom flows
3. Write handlers (`onInsert`/`onUpdate`/`onDelete`) persist ไป server — fail → auto rollback
4. Pending states: `tx.state`/`isPersisted` track ว่า mutation sync แล้วหรือยัง

### 5. Verify

> Goal: sync + optimistic + joins ทำงานจริง

1. `/run-typecheck` + `/run-test`
2. Mutation: UI เปลี่ยนทันที → server confirm → rollback เมื่อ error
3. Live query re-render เมื่อ collection เปลี่ยน; multi-collection join อัปเดตถูก
4. ถ้า fail → `/resolve-errors` max 3 รอบ

## Rules

- `getKey` ต้อง stable + unique — ห้ามใช้ array index
- Collection driver ต้องตรง backend; Query-backed ต้อง `queryClient` ตัวเดียวกับ app
- ใส่ `schema` (standard schema) ที่ collection — ได้ type + runtime validation
- DB เฉพาะ data ที่ต้อง live query/optimistic/local-first — fetch ธรรมดายังใช้ `follow-query`
- 0.x API — pin version, อ่าน changelog ก่อน upgrade
- ใช้ `/follow-lib-tanstack-ecosystem` สำหรับ overview

## Expected Outcome

- Collections sync กับ backend driver ที่เลือก
- Live queries (filter/join/aggregate) reactive ถูกต้อง
- Optimistic mutations + rollback ทำงาน
