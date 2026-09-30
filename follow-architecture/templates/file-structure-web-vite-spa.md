# Web Vite SPA File Structure

Canonical file structure สำหรับ Vite SPA (React/Vue/Solid client-only) — flat type-grouped layered, ไม่มี server side

## File Structure

```text
project/
│
├─ index.html
├─ vite.config.ts
├─ public/
│
├─ src/
│  │
│  ├─ main.tsx                              # entry — mount app
│  ├─ App.tsx                               # root component + router setup
│  │
│  ├─ routes/                               # route definitions + lazy boundaries (presentation)
│  │  ├─ index.tsx                          # route tree
│  │  └─ guards.ts
│  │
│  ├─ pages/                                # page components ต่อ route (presentation)
│  │  ├─ home.tsx
│  │  └─ dashboard.tsx
│  │
│  ├─ components/                           # UI components — presentational (presentation)
│  │  ├─ Button.tsx
│  │  └─ UserCard.tsx
│  │
│  ├─ hooks/                                # hooks — UI state + view logic (presentation)
│  │  ├─ use-session.ts
│  │  └─ use-orders.ts
│  │
│  ├─ usecases/                             # application use cases — orchestration entry (domain)
│  │  ├─ login.ts
│  │  └─ create-order.ts
│  │
│  ├─ services/                             # domain services — business rules (domain)
│  │  ├─ user-service.ts
│  │  └─ order-service.ts
│  │
│  ├─ stores/                               # client state stores — zustand/pinia/solid-store (domain)
│  │  └─ session.ts
│  │
│  ├─ infra/                                # API clients, storage, IO (data)
│  │  ├─ http.ts                            # fetch/xh wrapper
│  │  ├─ api/                               # auth.ts, users.ts — endpoint calls
│  │  └─ storage.ts
│  │
│  ├─ lib/                                  # third-party singleton clients (data)
│  │  └─ query-client.ts
│  │
│  ├─ utils/                                # pure helpers — ไม่มี IO (shared leaf)
│  │  └─ date.ts
│  │
│  ├─ types/                                # shared types (shared leaf)
│  │  └─ index.ts
│  │
│  ├─ constants/                            # constants (shared leaf)
│  │  └─ index.ts
│  │
│  ├─ config/                               # env/runtime config (shared leaf)
│  │  └─ env.ts
│  │
│  └─ styles/                               # global styles, theme tokens (shared leaf)
│     └─ globals.css
│
├─ tests/
│  ├─ unit/                                 # usecases/, services/, stores/, utils/
│  └─ e2e/                                  # routes/pages
│
├─ package.json
└─ tsconfig.json
```

## Layer Table

| No. | Layer | Folder | Contains | Deps |
|-----|-------|--------|----------|------|
| 1 | presentation | `routes/`+`pages/` | route tree + page components | → `components/`, `hooks/`, `usecases/` (+ leaves) |
| 2 | presentation | `components/`+`hooks/` | UI + view logic | → `usecases/` (+ leaves) — ห้ามเรียก `infra/` ตรง |
| 3 | domain | `usecases/` | orchestration entry | → `services/`, `stores/`, `infra/` (+ leaves) |
| 4 | domain | `services/`+`stores/` | business rules + client state | → `infra/` (+ leaves) |
| 5 | data | `infra/`+`lib/` | API calls, storage, third-party clients | leaf (+ leaves) |
| 6 | shared leaf | `utils/`+`types/`+`constants/`+`config/`+`styles/` | pure/shared | leaf — ทุก layer ใช้ได้ ห้าม import กลับ |

## Rules

- Dependencies ชี้ลง: presentation → domain → data — ห้าม bypass/ชี้ขึ้น
- `utils/`, `types/` ต้อง pure — ไม่มี IO/framework side effects
- ไม่มี server code — API calls ทั้งหมดอยู่ `infra/`; env secrets ห้ามอยู่ฝั่ง client
- Public API ผ่าน barrel `index.ts` ต่อ folder — ห้าม deep imports ข้าม layer
- ใช้ path alias (`@/`) แทน relative imports ข้าม folder
