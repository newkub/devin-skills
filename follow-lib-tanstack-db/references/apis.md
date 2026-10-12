| key | value |
|---|---|
| install | `bun add @tanstack/db` |
| package registry | https://www.npmjs.com/org/tanstack |
| repo | https://github.com/TanStack |
| docs | https://tanstack.com/libraries |

| Package | Version | Lib |
|---------|---------|-----|
| `@tanstack/db` | 0.11.x | DB core |
| `@tanstack/react-db` | 0.5.x | DB adapter (+ `vue-db`, `solid-db`, `svelte-db`) |
| `@tanstack/query-db-collection` | 1.3.x | DB ↔ Query sync |
| `@tanstack/electric-db-collection` | 0.5.x | DB ↔ ElectricSQL sync |

| Library | Entry point หลัก | ตัวอย่าง API |
|---|---|---|
| DB | `createCollection` | `useLiveQuery`, `queryCollectionOptions`, `electricCollectionOptions`, `localOnlyCollectionOptions` |
