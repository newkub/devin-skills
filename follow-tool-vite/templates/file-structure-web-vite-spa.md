# Web Vite SPA File Structure

Canonical file structure for a Vite SPA (React/Vue/Solid client-only) — flat type-grouped layered, no server side

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
│  ├─ pages/                                # page components per route (presentation)
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
│  ├─ utils/                                # pure helpers — no IO (shared leaf)
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
| 2 | presentation | `components/`+`hooks/` | UI + view logic | → `usecases/` (+ leaves) — never call `infra/` directly |
| 3 | domain | `usecases/` | orchestration entry | → `services/`, `stores/`, `infra/` (+ leaves) |
| 4 | domain | `services/`+`stores/` | business rules + client state | → `infra/` (+ leaves) |
| 5 | data | `infra/`+`lib/` | API calls, storage, third-party clients | leaf (+ leaves) |
| 6 | shared leaf | `utils/`+`types/`+`constants/`+`config/`+`styles/` | pure/shared | leaf — usable by every layer, no imports back |

## Rules

- Dependencies point downward: presentation → domain → data — no bypassing/upward imports
- `utils/`, `types/` must be pure — no IO/framework side effects
- No server code — all API calls live in `infra/`; env secrets never on the client side
- Public API through the per-folder barrel `index.ts` — no deep imports across layers
- Use path aliases (`@/`) instead of relative imports across folders
