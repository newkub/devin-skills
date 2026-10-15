# Web Solid + TanStack Start (Nitro) + Bun File Structure

Canonical file structure for a TanStack Start (Nitro-powered) Solid app on Bun — isomorphic routes + server functions + nitro API

## File Structure

```text
project/
│
├─ app.config.ts                          # vinxi/nitro config — server preset bun/node
├─ vite.config.ts
│
├─ src/
│  ├─ router.tsx                          # createRouter + routeTree
│  ├─ routeTree.gen.ts                    # generated — never edit
│  │
│  ├─ routes/                             # file-based routes (presentation — isomorphic)
│  │  ├─ __root.tsx
│  │  ├─ index.tsx
│  │  ├─ users/$userId.tsx
│  │  └─ api/                             # nitro API routes — auth.ts, webhooks.ts (server presentation)
│  │
│  ├─ components/                         # UI components (presentation)
│  │  ├─ ui/
│  │  └─ features/
│  │
│  ├─ hooks/                              # view logic (presentation)
│  │
│  ├─ server/                             # server functions — createServerFn (domain boundary)
│  │  ├─ fns/                             # get-user.ts, create-order.ts — RPC-style calls
│  │  ├─ middleware/                      # auth.ts, logging.ts
│  │  └─ utils/                           # server-only helpers
│  │
│  ├─ usecases/                           # application use cases — called from server fns (domain)
│  │  ├─ login.ts
│  │  └─ create-order.ts
│  │
│  ├─ services/                           # business rules — pure (domain)
│  │
│  ├─ stores/                             # client state (domain)
│  │
│  ├─ infra/                              # db, external APIs — server-only (data)
│  │  ├─ db/                              # client, schema, migrations
│  │  ├─ repositories/
│  │  └─ http.ts
│  │
│  ├─ lib/                                # third-party singletons (data)
│  │
│  ├─ utils/ types/ constants/ config/    # shared leaves — pure, isomorphic-safe
│  └─ styles/
│
├─ nitro/                                 # nitro-level config/plugins (optional)
├─ public/
├─ tests/
│  ├─ unit/                               # usecases/, services/
│  ├─ integration/                        # server fns + api routes
│  └─ e2e/
├─ package.json                           # runtime: bun
└─ tsconfig.json
```

## Layer Table

| No. | Layer | Folder | Contains | Deps |
|-----|-------|--------|----------|------|
| 1 | presentation | `routes/` (+`routes/api/`) | pages + nitro endpoints | → `components`, `server/fns` — never call `infra/` directly |
| 2 | presentation | `components/`+`hooks/` | UI + view logic | → `server/fns`, `stores` |
| 3 | domain boundary | `server/fns`+`middleware` | createServerFn RPC calls — isomorphic wire | → `usecases` — never call `infra` directly |
| 4 | domain | `usecases/`+`services/` | business rules | → `infra/` |
| 5 | domain | `stores/` | client state | leaf |
| 6 | data | `infra/`+`lib/` | db, external APIs | leaf — server-only |
| 7 | shared leaf | `utils/`+`types/`+`constants/`+`config/` | pure/shared | leaf — must be isomorphic-safe |

## Rules

- Server execution only via `createServerFn` in `server/fns/` or `routes/api/` — never inline server code in components
- `infra/`+`server/` are server-only — never import from client components (use `serverOnly`/split guards)
- Shared leaves must be isomorphic-safe — no `node:*`/`bun:*` in `utils/`/`types/` (move to `server/utils/`)
- Secrets via runtime env only — Bun: `Bun.env`/process.env on the server side only
- `routeTree.gen.ts` is generated — never edit
