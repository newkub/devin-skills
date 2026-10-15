# Follow Layered Architecture — Pattern Guide

Canonical Layered Architecture pattern guide (reference of `/follow-architecture`, read by `/refactor` `### 4. Architecture Refactor` argument `layered` — formerly `refactor/workflows/follow-layered-arch`, merged from the old `/follow-layered-arch` + `templates/file-structure-layered.md`): restructure a single app into flat folders grouped by type, layers as logical groupings pointing one way down, `presentation` → `domain` → `data`, no bypass

## When To Use

- Target is a single app — one `apps/*` or a single-app project; several apps sharing a domain or `packages/*`/`crates/*` → `follow-clean-arch.md` instead
- `/refactor` argument `layered` reads this guide; `target` = the directory to restructure; pattern selection logic stays in `/follow-architecture` + `references/architecture.md`
- Pattern guide (variants, boundaries) → this file's `## Guide` — canonical for layout; selection convention → `/follow-architecture`
- If this app grows into several apps that must share a domain → upgrade to Clean (`follow-clean-arch.md`)

## Execute

### 1. Prepare

> Goal: know the routes, logic, and data access before moving anything

1. Run `/scan-codebase` on the target — identify routes/pages, business logic, data access
2. Identify the current public API and route entry points — they must be preserved
3. Plan the folder mapping: presentation → `app/`+`components/`+`hooks/`; domain → `usecases/`+`services/`+`features/`; data → `infra/`+`lib/`; shared leaves → `types/`+`constants/`+`utils/`+`config/`; wide scope → `/create-plan-in-dot-devin` first

### 2. Restructure

> Goal: files land in the canonical flat structure of `## Guide`, one move batch at a time

1. Create flat type-grouped folders per `## Guide` — never nest by capability; prefix file names with the domain (`user-service.ts`) — the Required column marks mandatory/optional folders
2. Move UI/routes → `app/`+`components/`+`hooks/`; use cases → `usecases/`; business rules → `services/`+`features/`; persistence/external calls → `infra/`+`lib/`; pure helpers → `utils/`/`types/`/`constants/` — run `/refactor` one move at a time
3. Mixed concerns in one file (handler + logic + query) → run `/refactor` `### 5. Separate Of Concerns` to split before assigning layers
4. Enforce dependencies: presentation → domain → data only; `app/` calls `usecases/`/`features/` only; public API through the `index` barrel
5. Align tests per layer; after each move batch → `/update-references` + `/run-check`; red → rollback the batch

### 3. Verify

> Goal: no bypass, no cycles, behavior intact

1. Check no layer bypass (presentation calling `infra/`/`lib/` directly) and no cross-layer deep imports — run `/follow-tool-madge` for circular deps if present
2. Run `/run-check` and the tests; structure changed → `/update-agents-md`
3. Run `/report-before-after` with the old → new layer map

## Guide

### File Structure

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
│  ├─ features/                             # domain-specific feature-level logic — composes services (domain)
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

### Layer Table

| No. | Layer | Folder | Contains | Required | Tests | Deps | Risk |
|-----|-------|--------|----------|----------|-------|------|------|
| 1 | presentation | `app/` | routes/pages, middleware, `server.ts` — entry points wiring the layers | required | e2e tests | → `usecases/`, `features/` (+ shared leaves) | low |
| 2 | presentation | `components/` | UI components — PascalCase, presentational | optional (if there is UI) | component tests | → `hooks/`, `usecases/` (+ shared leaves) — never call `infra/`/`lib/` directly | low |
| 3 | presentation | `hooks/` | hooks / composables — UI state + view logic | optional (if there is a UI framework) | unit tests | → `usecases/` (+ shared leaves) | low |
| 4 | domain | `usecases/` | application use cases — orchestration entries (`login.ts`, `create-order.ts`) | required | unit tests with mocked infra | → `services/`, `features/`, `infra/` (+ shared leaves) | medium — orchestration |
| 5 | domain | `services/` | domain services (`*-service.ts`) — pure business rules | required | unit tests | → `infra/`, `lib/` (+ shared leaves) — never call presentation | high — business rules |
| 6 | domain | `features/` | domain-specific feature-level logic — composes services | optional | unit tests | → `services/` (+ shared leaves) — never import `usecases/` | medium |
| 7 | data | `infra/` | repositories, `database/` (client, schema, migrations), external APIs | required | integration tests | leaf — no imports from presentation/domain (+ shared leaves) | medium — IO |
| 8 | data | `lib/` | third-party wrappers / singleton clients (`db.ts`, `stripe-client.ts`) | optional | integration tests | leaf (+ shared leaves) | low |
| 9 | shared leaf | `types/` | shared types — pure types only | optional | — (types only) | leaf — every layer may use it; never import back | low |
| 10 | shared leaf | `constants/` | constants | optional | — | leaf — usable by every layer | low |
| 11 | shared leaf | `utils/` | pure utilities — helpers with no IO | optional | pure unit tests | leaf — usable by every layer | low |
| 12 | shared leaf | `config/` | `env.ts`, `app.ts`, `database.ts` | optional (if there is env/config) | config tests | leaf — usable by every layer | low |
| 13 | root | `index.ts` | barrel — public API | required | smoke test | → every layer | low |

## Rules

### 1. Structure

- Flat folders only — never nest folders by capability/domain; group by type (`components/`, `services/`, `usecases/`…) and prefix file names with the domain instead (`user-service.ts`, `order-service.ts`)
- Dependencies point one way down: presentation folders → domain folders → data folders — no bypassing (e.g. `components/` calling `infra/` directly) and never pointing up
- `app/` calls `usecases/`/`features/` only — never call `services/` or `infra/` directly when a usecase wraps them
- `types/`, `constants/`, `utils/`, `config/` are leaves — every layer may import them, but they must never import back into layer folders
- `utils/` and `types/` must stay pure — no IO, framework imports, or side effects
- Public API through the `index.ts` barrel — no deep imports across layers
- Use the project's path aliases instead of cross-folder relative imports

### 2. Safety

- Preserve existing behavior — routes/pages work exactly as before the restructure
- One move batch per `/update-references` + `/run-check` cycle; red → rollback before the next batch

## Expected Outcome

- The app is a flat type-grouped Layered structure — one folder per type, domain-prefixed files, dependencies pointing one way down
- No bypass, no circular imports; the original public API and routes still work
- Passes `/run-check` and the tests; `/report-before-after` shows the old → new layer map
