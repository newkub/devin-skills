# Web Svelte (SvelteKit) File Structure

Canonical file structure สำหรับ SvelteKit app — `src/routes` + `src/lib` conventions + layered mapping

## File Structure

```text
project/
│
├─ svelte.config.js
├─ vite.config.ts
│
├─ src/
│  ├─ app.html
│  ├─ hooks.server.ts                     # server hooks — auth/session (presentation)
│  │
│  ├─ routes/                             # file-based routes (presentation)
│  │  ├─ +layout.svelte / +layout.ts
│  │  ├─ +page.svelte / +page.ts          # public pages
│  │  ├─ +page.server.ts                  # server load/actions (presentation→domain boundary)
│  │  ├─ (app)/
│  │  │  └─ dashboard/+page.svelte
│  │  └─ api/                             # +server.ts endpoints (presentation)
│  │
│  ├─ lib/
│  │  ├─ components/                      # UI components (presentation)
│  │  │  ├─ ui/
│  │  │  └─ features/
│  │  ├─ usecases/                        # application use cases — called จาก load/actions (domain)
│  │  │  ├─ login.ts
│  │  │  └─ create-order.ts
│  │  ├─ services/                        # domain services — business rules (domain)
│  │  ├─ stores/                          # svelte stores (domain state)
│  │  ├─ server/                          # server-only — SvelteKit blocks client import (data)
│  │  │  ├─ db/                           # client, schema, migrations
│  │  │  ├─ repositories/
│  │  │  └─ auth.ts
│  │  ├─ utils/                           # pure helpers (shared leaf)
│  │  ├─ types/                           # shared types (shared leaf)
│  │  ├─ constants/                       # constants (shared leaf)
│  │  └─ config/                          # env via $env (shared leaf)
│  │
│  └─ params/                             # route param matchers
│
├─ static/
├─ tests/
│  ├─ unit/                               # usecases/, services/, utils/
│  └─ e2e/                                # routes
├─ package.json
└─ tsconfig.json
```

## Layer Table

| No. | Layer | Folder | Contains | Deps |
|-----|-------|--------|----------|------|
| 1 | presentation | `routes/` (+page/+layout/+server) | routes, load, actions, endpoints | → `lib/usecases`, `lib/components` — ห้ามเรียก `lib/server` จาก client files |
| 2 | presentation | `lib/components` | UI | → `lib/stores`, `lib/usecases` |
| 3 | domain | `lib/usecases`+`services` | business rules | → `lib/server`, `lib/stores` |
| 4 | domain | `lib/stores` | client state | leaf |
| 5 | data | `lib/server/` | db, repositories, auth — server-only | leaf — ห้าม import จาก client |
| 6 | shared leaf | `lib/utils|types|constants|config` | pure/shared | leaf — ทุก layer ใช้ได้ |

## Rules

- Server code อยู่ `lib/server/` หรือ `*.server.ts` เท่านั้น — SvelteKit enforce เอง ห้าม hack รอบ
- `+page.server.ts`/`+server.ts` = thin boundary — delegate ไป `lib/usecases/`
- `lib/utils|types` pure — ไม่มี IO
- ใช้ `$lib/` alias — ห้าม relative imports ข้าม folder
- Business rules ห้ามอยู่ใน `.svelte` components
