# Clean Pattern

> When: ≥2 deployable entry points share a domain/code, the target is a shared `packages/*`/`crates/*` library, or a single deployable carries ≥3 bounded contexts or ≥2 volatile external systems that need ports (see `SKILL.md` `### 2` rows 1, 2 and 4)
>
> Relationship: Layered and Clean are the same dependency rule at different granularity. Layered collapses one bounded context into type-grouped folders ([layered-arch](layered-arch.md)); Clean promotes each bounded context to an explicit `modules/<name>/` and keeps shared policy in `core/`. Choose this file when the boundary between contexts must be visible and enforceable.
>
> Dependency direction `core` ← `modules` ← `adapters` ← `infra` ← `app` — never reverse it; `contracts/` + `config/` are leaves any layer may import; inside a module the order is `domain` ← `features` ← `usecases` (see `## Layer Table`)
>
> The tree below is a greenfield default. Where `SKILL.md` `## File Structure By Workspace Type` names an owner skill, that template's folders win — carry over the Layer Table's direction and the Rules, not the folder names.

## Restructure

1. Prepare: `/scan-codebase` the target — domain logic, side effects, external deps; identify the current public API (barrel `index`) and consumers — they must be preserved
2. Create the structure below; move pure logic → `modules/*/domain/` + `core/`; application use cases called by `app/` → `modules/*/usecases/`; feature orchestration → `modules/*/features/`; interfaces → `ports/`; IO/framework → `infra/` + `adapters/`
3. Define the ports `features/` needs — `adapters`/`infra` implement them; wire everything at the `app/runtime.ts` composition root
4. Verify: no imports from `core/`/`domain`/`features` into `infra/`/`adapters/`; run `/run-check` + the tests, then the full gate at `SKILL.md` `### 4` (boundary persisted, `AGENTS.md` updated, before/after reported)

## File Structure

```text
src/
├─ app/            # entry points + composition roots: api/ web/ cli/ worker/ cron/ plugin/ + runtime.ts (ports → adapters wiring)
├─ modules/<name>/ # one bounded context: domain/ usecases/ features/ ports/ adapters/ + index.ts barrel
├─ core/           # shared kernel: result, option, errors, ids, time, events (mechanism), pagination + ports/
├─ adapters/       # cross-module translation, no IO: http/ persistence/ messaging/ payments/ auth/
├─ infra/          # IO implementations of ports: database/ queue/ cache/ storage/ email/ http/ clock/ observability/
├─ contracts/      # cross-boundary pure types: api/ events/ plugins/ — leaf
└─ config/         # env.ts app.ts database.ts services.ts — leaf
tests/               # unit/ integration/ e2e/ — where the project already puts them
scripts/  docs/  package.json  tsconfig.json  README.md  .env.example
```

## Shared Package Variant

A `packages/*` or `crates/*` workspace owns no entry point and performs no IO wiring — drop `app/`, cross-module `adapters/` and `infra/`; the package ships the context plus the shared kernel:

```text
src/
├─ modules/<name>/ # bounded context: domain/ usecases/ features/ ports/ adapters/ + index.ts
├─ core/           # shared kernel + ports/
├─ contracts/      # cross-boundary pure types — leaf
├─ config/         # env.ts <package>.ts — leaf
└─ index.ts        # package barrel — the only public API
```

- IO implementations stay in the consuming `apps/*` workspace — a shared package declares ports, never adapters that touch the network/disk
- Every module keeps its own `index.ts`; the package barrel re-exports only what consumers may see

## Layer Table

| No. | Layer | Contains | Tests | Deps | Risk |
|-----|-------|----------|-------|------|------|
| 1 | `core/` | pure primitives: `result.ts`, `option.ts`, `errors/`, `ids.ts`, `time.ts`, `events.ts` (mechanism — payloads → `contracts/events/`), `pagination.ts` + `ports/` | pure unit — no IO mocks | leaf — imports no other layer | high — shared kernel |
| 2 | `modules/*/domain/` | `model.ts`, `errors.ts`, `schema.ts` — pure types + business rules | pure unit | → `core/` only | high |
| 3 | `modules/*/usecases/` | application use cases called by `app/` (optional) | unit with mocked ports | → `features/`, `domain/`, `ports/`, `core/` | medium — application boundary |
| 4 | `modules/*/features/` | feature logic orchestrating domain + ports | unit with mocked ports | → `domain/` (same module), `ports/`, `core/` — never `usecases/` | medium |
| 5 | `modules/*/ports/` | `*Port` interfaces the module needs | — (types only) | → `domain/` types only | low |
| 6 | `modules/*/adapters/` | module-level boundary translation/mappers | integration | → `domain/`, `ports/` | medium |
| 7 | `contracts/` | api schemas, event schemas (payloads), plugin contracts — pure types | schema validation | leaf | low |
| 8 | `adapters/` | cross-module translation, no IO: `http/` shapes, `persistence/` dto, `messaging/` envelopes | integration | → module ports, `contracts/` | medium |
| 9 | `infra/` | `database/`, `postgres/`, `queue/`, `cache/`, `storage/`, `email/`, `http/` transport, `observability/` — IO implementations of ports | integration | → `core/`/module `ports/`, `adapters/` | medium — IO/framework |
| 10 | `app/` | entry points `api/`, `web/`, `cli/`, `worker/`, `cron/`, `plugin/` + `runtime.ts` | smoke + e2e | → `usecases/` (fallback `features/`), `contracts/`, `config/`; `runtime.ts` imports `infra/`/`adapters/` for wiring only | low |
| 11 | `config/` | `env.ts`, `app.ts`, `database.ts`, `services.ts` | config tests | leaf | low |

## Rules

- `domain/` + `core/` stay pure — no IO, framework imports, or side effects; no `fx/` layer — side effects live in `infra/`, orchestrated through `features/` + ports
- `adapters/` maps shapes, `infra/` owns transport: an HTTP/fetch client belongs to `infra/http/`, its request/response types to `adapters/http/` — never put IO in `adapters/`, never put DTO shapes in `infra/`
- `contracts/` and `config/` are leaves — every layer may use them, they never import back; modules reach each other only through `contracts/` events or ports — never import another module directly
- `usecases/` is optional per module — use when orchestration spans features or several entry points share one flow; `app/` calls `usecases/` first when present (fallback → `features/`); direction `usecases → features → domain` never reversed
- `app/runtime.ts` is the single composition root wiring ports → implementations; `app/web/components/` + `hooks/` are optional UI-only — call `usecases/`/`features/` + `contracts/`, never `infra/`/`domain/` directly
- Public API only through the module/layer `index.ts` barrel — no deep imports from outside; in a monorepo the package manifest is the real boundary — enforce it, not just the folder name
- Ports exist only where volatility lives — a port with exactly one implementation and no test/swap motivation is indirection without payoff; fold it back into the module until a second need appears
