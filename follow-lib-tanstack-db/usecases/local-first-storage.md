# Use Case — Local-First Collections (localStorage / localOnly / IndexedDB)

> Keep client state in a collection: persisted prefs (localStorage), ephemeral UI state (localOnly), or a durable local store (IndexedDB). Source: https://tanstack.com/db/latest/docs/collections/local-storage-collection, /local-only-collection, /indexed-db-collection (accessed 2026-10-20)

## 1. Choose the local collection

| Need | Collection | Persists | Cross-tab |
|---|---|---|---|
| UI state / form draft for this session | `localOnlyCollectionOptions` | no (memory) | no |
| user prefs / small settings | `localStorageCollectionOptions` | yes (localStorage) | yes |
| larger local data, async writes | `indexedDBCollectionOptions` | yes (IndexedDB) | via IDB |

## 2. localOnly — ephemeral UI state

Local-only collections mutate directly (no server handlers required); the change is applied to in-memory data.

```ts
import { createCollection } from '@tanstack/react-db'
import { localOnlyCollectionOptions } from '@tanstack/react-db'

export const modalState = createCollection(
  localOnlyCollectionOptions({
    id: 'modal-state',
    getKey: (m) => m.id,
    schema: modalSchema,
    initialData: [{ id: 'user-profile', isOpen: false }],
  }),
)

modalState.update('user-profile', (draft) => { draft.isOpen = true })
```

- Optional `onInsert`/`onUpdate`/`onDelete` run before the optimistic state is confirmed — use for logging/derived effects, not persistence.
- With a manual `createTransaction`, LocalOnly mutations need `utils.acceptMutations(transaction)` in the transaction's `mutationFn` after server mutations succeed.

## 3. localStorage — persisted prefs / settings

```ts
import { createCollection } from '@tanstack/react-db'
import { localStorageCollectionOptions } from '@tanstack/react-db'

export const userPrefs = createCollection(
  localStorageCollectionOptions({
    id: 'user-preferences',
    storageKey: 'app-user-prefs',
    getKey: (item) => item.id,
    schema: prefsSchema,
    // storage: sessionStorage,        // session-only persistence
    // storageEventApi: window,        // custom cross-tab/cross-process sync
  }),
)
```

- Persists to `localStorage` (or `sessionStorage`) and syncs across tabs via storage events automatically.
- Two collections with the same `storage` + `storageKey` sync within a tab without waiting for a browser event.
- Keep this for small values — browser storage is ~5–10 MB and synchronous.

## 4. IndexedDB — larger local store

```ts
import { createCollection, createIndexedDB, indexedDBCollectionOptions } from '@tanstack/db'

const db = createIndexedDB({ stores: ['todos'] })   // async writes, IDB storage

export const todos = createCollection(
  indexedDBCollectionOptions<Todo>({
    db,
    name: 'todos',
    getKey: (t) => t.id,
    schema: todoSchema,
  }),
)
```

## 5. Reading local state

All three are normal collections → `useLiveQuery` with the usual operators:

```tsx
const { data } = useLiveQuery((q) =>
  q.from({ modal: modalState }).where(({ modal }) => eq(modal.id, 'user-profile')),
)
```

## Pitfalls

- Using `localStorageCollectionOptions` for very large/structured data → quota + sync blocking; use IndexedDB.
- Expecting `localOnly` data to survive a reload → it's memory only; choose localStorage/IndexedDB.
- Relying on collection `onInsert` to deny/reject in localOnly → handlers are optional and run before confirm; to gate writes validate in the schema/action instead.
- Assuming cross-tab sync fires on the same tab → same-tab sync is immediate via the storage object, different tabs use storage events.
- Creating local collections inside components → duplicate stores; define them once at module scope.

## Related

- `references/apis.md`
- `best-practices/tanstack-db.md`
- `usecases/non-hook-and-ssr.md`
- `usecases/query-rest-crud.md`
