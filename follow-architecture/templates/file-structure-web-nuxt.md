# Web Nuxt File Structure

Canonical file structure สำหรับ Nuxt app — framework conventions + layered mapping (presentation → domain → data)

## File Structure

```text
project/
│
├─ nuxt.config.ts
├─ app/
│  ├─ app.vue                             # root
│  │
│  ├─ pages/                              # file-based routes (presentation)
│  │  ├─ index.vue
│  │  └─ users/[id].vue
│  │
│  ├─ layouts/                            # default.vue, admin.vue (presentation)
│  ├─ middleware/                         # route middleware — auth.ts (presentation)
│  ├─ components/                         # UI components (presentation)
│  │  ├─ ui/
│  │  └─ features/
│  ├─ composables/                        # useSession.ts, useOrders.ts — view logic (presentation)
│  ├─ stores/                             # pinia stores (domain state)
│  ├─ assets/                             # css, images
│  └─ plugins/                            # app plugins
│
├─ server/                                # nitro server
│  ├─ api/                                # route handlers — users.get.ts, orders.post.ts (presentation)
│  ├─ routes/                             # non-/api routes
│  ├─ middleware/                         # server middleware (presentation)
│  ├─ usecases/                           # server orchestration (domain)
│  ├─ services/                           # business rules (domain)
│  ├─ repositories/                       # data access (data)
│  ├─ database/                           # client, schema, migrations (data)
│  ├─ plugins/                            # nitro plugins
│  └─ utils/                              # auto-imported server utils
│
├─ shared/                                # isomorphic — types/schemas/utils ใช้ทั้งสองฝั่ง
│  ├─ types/
│  ├─ schemas/
│  └─ utils/
│
├─ modules/                               # local nuxt modules (optional)
├─ content/                               # nuxt/content (optional)
├─ public/
├─ tests/
│  ├─ unit/                               # composables, stores, server/usecases
│  └─ e2e/                                # pages + api
├─ package.json
└─ tsconfig.json
```

## Layer Table

| No. | Layer | Folder | Contains | Deps |
|-----|-------|--------|----------|------|
| 1 | client presentation | `app/pages`+`layouts`+`middleware` | routes | → `components`, `composables` (+ `shared/`) |
| 2 | client presentation | `app/components`+`composables` | UI + view logic | → `stores`, `$fetch` calls (+ `shared/`) |
| 3 | client domain | `app/stores` | client state | leaf (+ `shared/`) |
| 4 | server presentation | `server/api`+`routes`+`middleware` | HTTP entry | → `server/usecases` — ห้ามเรียก `repositories`/`database` ตรง |
| 5 | server domain | `server/usecases`+`services` | business rules | → `server/repositories` |
| 6 | server data | `server/repositories`+`database` | persistence | leaf (+ `shared/`) |
| 7 | contracts | `shared/` | types/schemas/utils | leaf — pure เท่านั้น |

## Rules

- ใช้ Nuxt conventions จริง — `pages/`, `server/api/`, auto-imports; ห้ามสร้าง router/server เอง
- `server/api/*` handlers = thin — เรียก `server/usecases/` เท่านั้น
- `shared/` pure — ห้าม import server-only (`process.env`, db client)
- Secrets อยู่ `server/` + `runtimeConfig` เท่านั้น — ห้ามเข้า `app/`/`shared/`
- Business rules ห้ามอยู่ใน `.vue`/`composables` — ย้ายลง `server/services/` หรือ `app/stores` ตามฝั่ง
