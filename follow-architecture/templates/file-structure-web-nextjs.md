# Web Next.js File Structure

Canonical file structure สำหรับ Next.js App Router — `app/` routes (RSC boundary) + layered `lib/`

## File Structure

```text
project/
│
├─ next.config.ts
├─ public/
│
├─ src/
│  ├─ app/                                # App Router routes (presentation)
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ loading.tsx / error.tsx / not-found.tsx
│  │  ├─ (app)/
│  │  │  ├─ dashboard/page.tsx
│  │  │  └─ users/[id]/page.tsx
│  │  ├─ api/                             # route handlers — auth/route.ts, webhooks/route.ts
│  │  └─ actions/                         # colocated server actions (optional — ดู rules)
│  │
│  ├─ components/                         # UI components (presentation)
│  │  ├─ ui/                              # client primitives — 'use client'
│  │  └─ features/                        # feature components
│  │
│  ├─ hooks/                              # client hooks — 'use client' (presentation)
│  │
│  ├─ lib/
│  │  ├─ actions/                         # server actions — 'use server' (domain boundary)
│  │  │  ├─ auth.ts
│  │  │  └─ orders.ts
│  │  ├─ queries/                         # data fetching — cached loaders (domain boundary)
│  │  │  └─ users.ts
│  │  ├─ usecases/                        # application use cases (domain)
│  │  ├─ services/                        # business rules — pure (domain)
│  │  ├─ repositories/                    # data access (data)
│  │  ├─ db/                              # client, schema, migrations — server-only (data)
│  │  ├─ auth.ts                          # session helpers — server-only (data)
│  │  ├─ utils/                           # pure helpers (shared leaf)
│  │  ├─ types/                           # shared types (shared leaf)
│  │  ├─ constants/                       # constants (shared leaf)
│  │  └─ config/                          # env (shared leaf — server-only vars แยก)
│  │
│  └─ middleware.ts                       # edge middleware — auth redirect (presentation)
│
├─ tests/
│  ├─ unit/                               # usecases/, services/, utils/
│  └─ e2e/                                # routes + api
├─ package.json
└─ tsconfig.json
```

## Layer Table

| No. | Layer | Folder | Contains | Deps |
|-----|-------|--------|----------|------|
| 1 | presentation | `app/` routes | pages, layouts, route handlers, middleware | → `components`, `lib/queries`, `lib/actions` — ห้ามเรียก `repositories`/`db` ตรง |
| 2 | presentation | `components/`+`hooks/` | UI + client logic | → `lib/actions` (server calls), `lib/utils` |
| 3 | domain boundary | `lib/actions`+`lib/queries` | server actions + cached data loaders | → `usecases` — channel เดียวข้าม RSC boundary |
| 4 | domain | `lib/usecases`+`services` | business rules | → `repositories`, `db` |
| 5 | data | `lib/repositories`+`db`+`auth` | persistence, session | leaf — server-only |
| 6 | shared leaf | `lib/utils|types|constants|config` | pure/shared | leaf — isomorphic-safe |

## Rules

- Server writes ผ่าน `lib/actions/` (`'use server'`) เท่านั้น — ห้าม server actions กระจายใน page/component
- Data reads ผ่าน `lib/queries/` — RSC pages เรียก queries ตรงได้, client components ผ่าน props/actions
- `lib/db`, `lib/repositories`, `lib/auth` server-only — ห้าม import จาก `'use client'` files
- shared leaves isomorphic-safe — server env vars อยู่ `lib/config` ที่ server เรียกเท่านั้น (ไม่ใช้ `NEXT_PUBLIC_` สำหรับ secrets)
- Business rules ห้ามอยู่ใน `page.tsx`/route handlers — delegate ลง `usecases/`/`services/`
