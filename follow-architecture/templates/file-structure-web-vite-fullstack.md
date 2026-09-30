# Web Vite Fullstack File Structure

Canonical file structure สำหรับ Vite frontend + backend (Hono/Elysia/Express API) ใน repo เดียว — client layered + server layered, แชร์ contracts

## File Structure

```text
project/
│
├─ index.html
├─ vite.config.ts
├─ public/
│
├─ src/                                   # client (SPA)
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ routes/                             # route tree + guards (presentation)
│  ├─ pages/                              # page components (presentation)
│  ├─ components/                         # UI components (presentation)
│  ├─ hooks/                              # view logic (presentation)
│  ├─ usecases/                           # client orchestration (domain)
│  ├─ services/                           # client business rules (domain)
│  ├─ stores/                             # client state (domain)
│  ├─ infra/                              # API client calls → server (data)
│  ├─ lib/                                # third-party clients (data)
│  ├─ utils/ types/ constants/ config/    # shared leaves
│  └─ styles/
│
├─ server/                                # backend
│  ├─ index.ts                            # entry — wire routes + middleware
│  ├─ routes/                             # auth.ts, users.ts, orders.ts (presentation)
│  ├─ middleware/                         # auth.ts, error.ts, logging.ts (presentation)
│  ├─ usecases/                           # server-side orchestration (domain)
│  ├─ services/                           # business rules (domain)
│  ├─ infra/                              # database/, repositories/, external APIs (data)
│  ├─ lib/                                # db client, third-party wrappers (data)
│  ├─ utils/ types/ constants/ config/    # shared leaves (server)
│  └─ jobs/                               # background/scheduled work (optional)
│
├─ shared/                                # isomorphic contracts — ใช้ได้ทั้ง client+server
│  ├─ schemas/                            # zod/valibot schemas, DTO types
│  ├─ constants/
│  └─ index.ts
│
├─ tests/
│  ├─ unit/                               # usecases/, services/ (src+server)
│  ├─ integration/                        # server/infra, API routes
│  └─ e2e/                                # full stack flows
│
├─ package.json
└─ tsconfig.json
```

## Layer Table

| No. | Layer | Folder | Contains | Deps |
|-----|-------|--------|----------|------|
| 1 | client presentation | `src/routes|pages|components|hooks` | UI | → `src/usecases` (+ `shared/`) — ห้ามเรียก `server/` |
| 2 | client domain | `src/usecases|services|stores` | client logic | → `src/infra` (+ `shared/`) |
| 3 | client data | `src/infra`+`lib` | API calls | leaf (+ `shared/`) |
| 4 | server presentation | `server/routes`+`middleware` | HTTP entry | → `server/usecases` (+ `shared/`) — ห้ามเรียก `server/infra` ตรง |
| 5 | server domain | `server/usecases`+`services` | business rules | → `server/infra` (+ `shared/`) |
| 6 | server data | `server/infra`+`lib` | DB, external APIs | leaf (+ `shared/`) |
| 7 | contracts | `shared/` | schemas/DTO/constants | leaf — pure types เท่านั้น |

## Rules

- `src/` ห้าม import `server/` และกลับกัน — คุยกันผ่าน HTTP + `shared/` contracts เท่านั้น
- `shared/` ต้อง pure — ไม่มี IO, env secrets, framework-specific imports
- Secrets/server env อยู่ `server/config/` เท่านั้น — ห้าม leak เข้า `src/`
- แต่ละฝั่งใช้ layered rules เดียวกันกับ `file-structure-layered.md`
- ถ้า server แชร์ business modules กับหลาย entry points (api+worker+cron) → พิจารณา Clean (`templates/file-structure-clean.md`)
