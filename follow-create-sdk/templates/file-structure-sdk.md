# SDK File Structure

Canonical file structure สำหรับ SDK/client library — resource-grouped API surface + transport internals

## File Structure

```text
project/
│
├─ src/
│  ├─ index.ts                            # public API barrel — export Client + types + errors เท่านั้น
│  │
│  ├─ client.ts                           # Client class — config, auth, resource wiring (presentation)
│  │
│  ├─ resources/                          # API resources — 1 file ต่อ resource (presentation)
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
| 2 | data | `core/` | http, auth, retry, pagination | leaf (+ leaves) — ไม่ export ผ่าน index |
| 3 | shared leaf | `types/`+`errors/`+`schemas/`+`utils/` | public types, errors, pure helpers | leaf — ทุก layer ใช้ได้ |

## Rules

- `index.ts` = public API เดียว — internals ห้าม leak (ใช้ `exports` map enforce)
- `resources/*` thin — 1 method = 1 endpoint, delegate transport ไป `core/http.ts`
- Auth/retry/pagination logic อยู่ `core/` เท่านั้น — resources ห้ามทำเอง
- `types/` export ทั้งหมด — users import `import type { User } from 'sdk'`
- Errors เป็น typed + catchable — ห้าม throw raw `Error` จาก HTTP layer
- Runtime agnostic — ใช้ `fetch` standard, ห้ามผูก `node:*` ถ้าไม่จำเป็น
