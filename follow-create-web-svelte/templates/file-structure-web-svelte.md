# Web Svelte (SvelteKit) File Structure

Canonical file structure for a SvelteKit app — `src/routes` + `src/lib` conventions + layered mapping

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
│  │  ├─ usecases/                        # application use cases — called from load/actions (domain)
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
| 1 | presentation | `routes/` (+page/+layout/+server) | routes, load, actions, endpoints | → `lib/usecases`, `lib/components` — never call `lib/server` from client files |
| 2 | presentation | `lib/components` | UI | → `lib/stores`, `lib/usecases` |
| 3 | domain | `lib/usecases`+`services` | business rules | → `lib/server`, `lib/stores` |
| 4 | domain | `lib/stores` | client state | leaf |
| 5 | data | `lib/server/` | db, repositories, auth — server-only | leaf — never import from client |
| 6 | shared leaf | `lib/utils|types|constants|config` | pure/shared | leaf — usable by every layer |

## Rules

- Server code lives only in `lib/server/` or `*.server.ts` — SvelteKit enforces this itself, don't work around it
- `+page.server.ts`/`+server.ts` are thin boundaries — delegate to `lib/usecases/`
- `lib/utils|types` are pure — no IO
- Use the `$lib/` alias — no relative imports across folders
- Business rules must not live in `.svelte` components
