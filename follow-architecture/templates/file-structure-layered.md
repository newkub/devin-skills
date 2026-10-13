# Layered Architecture File Structure

Canonical file structure for targets restructured into Layered Architecture — designed for a single app (single app): **flat folders, grouping by type** — layers are a logical grouping of folders pointing one way down, `presentation` → `domain` → `data`, no bypass

## File Structure

```text
project/
│
├─ src/
│  │
│  ├─ app/                                  # Entry & routes — wire layers (presentation)
│  │  ├─ routes/                            # auth.ts, users.ts, orders.ts (or pages/ for web)
│  │  ├─ middleware/                        # auth.ts, error.ts, logging.ts
│  │  ├─ server.ts
│  │  └─ index.ts
│  │
│  ├─ components/                           # UI components — PascalCase, presentational (presentation)
│  │  ├─ Button.tsx
│  │  └─ UserCard.tsx
│  │
│  ├─ hooks/                                # hooks / composables — UI state + view logic (presentation)
│  │  ├─ use-session.ts
│  │  └─ use-orders.ts
│  │
│  ├─ usecases/                             # application use cases — orchestration entries called by app/ (domain)
│  │  ├─ login.ts
│  │  ├─ create-order.ts
│  │  └─ refund-payment.ts
│  │
│  ├─ services/                             # domain services — business rules called by usecases (domain)
│  │  ├─ user-service.ts
│  │  ├─ order-service.ts
│  │  └─ payment-service.ts
│  │
│  ├─ features/                             # domain-specific feature-level logic — composes usecases+services (domain)
│  │  ├─ checkout.ts
│  │  └─ subscription.ts
│  │
│  ├─ infra/                                # external implementations — DB, APIs, IO (data)
│  │  ├─ database/                          # client.ts, schema.ts, migrations/
│  │  ├─ repositories/                      # user.ts, order.ts, payment.ts
│  │  ├─ http.ts
│  │  └─ stripe.ts
│  │
│  ├─ lib/                                  # third-party wrappers / singleton clients (data)
│  │  ├─ db.ts
│  │  └─ stripe-client.ts
│  │
│  ├─ utils/                                # pure utilities — helpers with no IO (shared leaf)
│  │  ├─ date.ts
│  │  └─ slug.ts
│  │
│  ├─ types/                                # shared types — pure types only (shared leaf)
│  │  ├─ user.ts
│  │  ├─ order.ts
│  │  └─ index.ts
│  │
│  ├─ constants/                            # constants (shared leaf)
│  │  └─ index.ts
│  │
│  ├─ config/                               # Configuration (shared leaf)
│  │  ├─ env.ts
│  │  ├─ app.ts
│  │  └─ database.ts
│  │
│  └─ index.ts                              # barrel — public API
│
├─ tests/
│  ├─ unit/                                 # usecases/, services/, features/, utils/
│  ├─ integration/                          # infra/, lib/
│  └─ e2e/                                  # app/ routes + components/
│
├─ scripts/                                 # migrate.ts, seed.ts
├─ docs/
├─ package.json
├─ tsconfig.json
├─ README.md
└─ .env.example
```

## Layer Table

| No. | Layer | Folder | Contains | Required | Tests | Deps | Risk |
|-----|-------|--------|----------|----------|-------|------|------|
| 1 | presentation | `app/` | routes/pages, middleware, `server.ts` — entry points wiring the layers | required | e2e tests | → `usecases/`, `features/` (+ shared leaves) | low |
| 2 | presentation | `components/` | UI components — PascalCase, presentational | optional (if there is UI) | component tests | → `hooks/`, `usecases/` (+ shared leaves) — never call `infra/`/`lib/` directly | low |
| 3 | presentation | `hooks/` | hooks / composables — UI state + view logic | optional (if there is a UI framework) | unit tests | → `usecases/` (+ shared leaves) | low |
| 4 | domain | `usecases/` | application use cases — orchestration entries (`login.ts`, `create-order.ts`) | required | unit tests with mocked infra | → `services/`, `features/`, `infra/` ports (+ shared leaves) | medium — orchestration |
| 5 | domain | `services/` | domain services (`*-service.ts`) — pure business rules | required | unit tests | → `infra/`, `lib/` (+ shared leaves) — never call presentation | high — business rules |
| 6 | domain | `features/` | domain-specific feature-level logic — composes usecases+services | optional | unit tests | → `usecases/`, `services/` (+ shared leaves) | medium |
| 7 | data | `infra/` | repositories, `database/` (client, schema, migrations), external APIs | required | integration tests | leaf — no imports from presentation/domain (+ shared leaves) | medium — IO |
| 8 | data | `lib/` | third-party wrappers / singleton clients (`db.ts`, `stripe-client.ts`) | optional | integration tests | leaf (+ shared leaves) | low |
| 9 | shared leaf | `types/` | shared types — pure types only | optional | — (types only) | leaf — every layer may use it; never import back | low |
| 10 | shared leaf | `constants/` | constants | optional | — | leaf — usable by every layer | low |
| 11 | shared leaf | `utils/` | pure utilities — helpers with no IO | optional | pure unit tests | leaf — usable by every layer | low |
| 12 | shared leaf | `config/` | `env.ts`, `app.ts`, `database.ts` | optional (if there is env/config) | config tests | leaf — usable by every layer | low |
| 13 | root | `index.ts` | barrel — public API | required | smoke test | → every layer | low |

## Rules

- **Flat folders only** — never nest folders by capability/domain; group by type (`components/`, `services/`, `usecases/`…) and prefix file names with the domain instead (`user-service.ts`, `order-service.ts`)
- Dependencies point one way down: presentation folders → domain folders → data folders — no bypassing (e.g. `components/` calling `infra/` directly) and never pointing up
- `app/` calls `usecases/`/`features/` only — never call `services/` or `infra/` directly when a usecase wraps them
- `types/`, `constants/`, `utils/`, `config/` are leaves — every layer may import them, but they must never import back into layer folders
- `utils/` and `types/` must stay pure — no IO, framework imports, or side effects
- Public API through the `index.ts` barrel — no deep imports across layers
- Use the project's path aliases instead of cross-folder relative imports
- Preserve existing behavior — routes/pages work exactly as before the restructure
- If this app grows into several apps that must share a domain → upgrade to Clean (`/follow-architecture` `### Pattern: Clean` — `templates/file-structure-clean.md`)
