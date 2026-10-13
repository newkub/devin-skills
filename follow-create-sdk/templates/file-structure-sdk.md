# SDK File Structure

Canonical file structure for an SDK/client library — resource-grouped API surface + transport internals

## File Structure

```text
project/
│
├─ src/
│  ├─ index.ts                            # public API barrel — exports Client + types + errors only
│  │
│  ├─ client.ts                           # Client class — config, auth, resource wiring (presentation)
│  │
│  ├─ resources/                          # API resources — 1 file per resource (presentation)
│  │  ├─ users.ts                         # client.users.list/get/create
│  │  ├─ orders.ts
│  │  └─ index.ts                         # resource registry
│  │
│  ├─ core/                               # transport internals (data)
│  │  ├─ http.ts                          # request/response pipeline
│  │  ├─ auth.ts                          # auth strategies — bearer, oauth, api-key
│  │  ├─ retry.ts                         # retry/backoff policy
│  │  ├─ pagination.ts                    # iterators — auto-paging
│  │  └─ hooks.ts                         # request/response interceptors
│  │
│  ├─ types/                              # request/response/resource types (shared leaf)
│  │  ├─ users.ts
│  │  ├─ orders.ts
│  │  └─ common.ts
│  │
│  ├─ errors/                             # typed errors — APIError, RateLimitError (shared leaf)
│  │  └─ index.ts
│  │
│  ├─ schemas/                            # runtime validation — zod/valibot (shared leaf, optional)
│  │
│  └─ utils/                              # pure helpers — qs, headers (shared leaf)
│
├─ tests/
│  ├─ unit/                               # resources (mock fetch), core/, utils/
│  └─ contract/                           # recorded/live API contract tests
├─ package.json                           # exports map, types, sideEffects:false
└─ tsconfig.json
```

## Layer Table

| No. | Layer | Folder | Contains | Deps |
|-----|-------|--------|----------|------|
| 1 | presentation | `client.ts`+`resources/` | public API surface | → `core/` (+ leaves) |
| 2 | data | `core/` | http, auth, retry, pagination | leaf (+ leaves) — not exported through index |
| 3 | shared leaf | `types/`+`errors/`+`schemas/`+`utils/` | public types, errors, pure helpers | leaf — usable by every layer |

## Rules

- `index.ts` = the single public API — internals must never leak (enforce via the `exports` map)
- `resources/*` thin — 1 method = 1 endpoint, delegate transport to `core/http.ts`
- Auth/retry/pagination logic lives in `core/` only — resources must not reimplement it
- `types/` exports everything — users import `import type { User } from 'sdk'`
- Errors are typed + catchable — never throw a raw `Error` from the HTTP layer
- Runtime agnostic — use standard `fetch`, never bind `node:*` unless necessary
