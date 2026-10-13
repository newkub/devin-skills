# Clean Architecture File Structure

Canonical file structure for targets restructured into Clean Architecture — designed for multiple apps/entry points that need unified support: `modules/` shared across entry points via the `app/` composition root

## File Structure

```text
project/
│
├─ src/
│  │
│  ├─ app/                                  # Runtime & composition roots
│  │  ├─ api/
│  │  │  ├─ routes/                         # auth.ts, users.ts, orders.ts, payments.ts
│  │  │  ├─ middleware/                     # auth.ts, error.ts, logging.ts
│  │  │  └─ server.ts
│  │  ├─ web/
│  │  │  ├─ routes/                         # home.ts, dashboard.ts
│  │  │  ├─ components/                     # UI components (optional — if the web entry renders UI)
│  │  │  ├─ hooks/                          # hooks/composables — UI state + view logic (optional)
│  │  │  ├─ middleware/                     # session.ts
│  │  │  └─ server.ts
│  │  ├─ cli/
│  │  │  ├─ commands/                       # user.ts, migrate.ts, seed.ts
│  │  │  └─ runner.ts
│  │  ├─ worker/
│  │  │  ├─ jobs/                           # process-order.ts, send-email.ts
│  │  │  └─ runner.ts
│  │  ├─ cron/
│  │  │  ├─ jobs/                           # cleanup.ts, billing.ts
│  │  │  └─ runner.ts
│  │  ├─ plugin/
│  │  │  ├─ loader.ts
│  │  │  ├─ registry.ts
│  │  │  └─ runtime.ts
│  │  ├─ runtime.ts                         # composition root — wire ports → adapters
│  │  └─ layers.ts
│  │
│  ├─ modules/                              # Business capabilities (bounded contexts)
│  │  ├─ auth/
│  │  │  ├─ domain/                         # model.ts, errors.ts — pure types + rules, no IO/framework
│  │  │  ├─ usecases/                       # login.ts, refresh-token.ts — application use cases called by app/ (optional)
│  │  │  ├─ features/                       # session.ts, permissions.ts — feature logic/orchestration
│  │  │  ├─ ports/                          # interfaces the module needs — session-store, token-issuer
│  │  │  ├─ adapters/                       # dto.ts, mappers/ — module-level boundary translation
│  │  │  └─ index.ts                        # module barrel — public API only
│  │  ├─ users/
│  │  │  ├─ domain/                         # model.ts, errors.ts, schema.ts
│  │  │  ├─ usecases/                       # register-user.ts, update-profile.ts
│  │  │  ├─ features/                       # create.ts, get.ts, update.ts, delete.ts
│  │  │  ├─ ports/                          # user-store, notifier
│  │  │  ├─ adapters/                       # dto.ts, mappers/
│  │  │  └─ index.ts
│  │  ├─ orders/
│  │  │  ├─ domain/                         # model.ts, errors.ts
│  │  │  ├─ usecases/                       # checkout.ts, refund-order.ts
│  │  │  ├─ features/                       # create.ts, get.ts, cancel.ts, refund.ts
│  │  │  ├─ ports/                          # order-store, payment-gateway
│  │  │  ├─ adapters/                       # dto.ts, mappers/
│  │  │  └─ index.ts
│  │  └─ payments/
│  │     ├─ domain/                         # model.ts, errors.ts
│  │     ├─ usecases/                       # process-payment.ts, handle-webhook.ts
│  │     ├─ features/                       # charge.ts, refund.ts, webhook.ts
│  │     ├─ ports/                          # payment-gateway, payment-store
│  │     ├─ adapters/                       # dto.ts, mappers/
│  │     └─ index.ts
│  │
│  ├─ core/                                 # Pure / fundamental — shared kernel
│  │  ├─ errors/                            # error.ts, domain-error.ts, system-error.ts
│  │  ├─ result.ts
│  │  ├─ option.ts
│  │  ├─ ids.ts
│  │  ├─ time.ts
│  │  ├─ events.ts
│  │  ├─ pagination.ts
│  │  └─ ports/                             # clock.ts, random.ts, id-generator.ts
│  │
│  ├─ adapters/                             # Boundary translation (cross-module)
│  │  ├─ http/                              # request.ts, response.ts, errors.ts, serialization.ts
│  │  ├─ persistence/                       # user.ts, order.ts, payment.ts
│  │  ├─ payments/                          # stripe.ts
│  │  ├─ auth/                              # session.ts
│  │  └─ messaging/                         # command.ts, event.ts
│  │
│  ├─ infra/                                # External implementations — implement ports
│  │  ├─ database/                          # client.ts, schema.ts, transaction.ts, migrations/
│  │  ├─ postgres/                          # user-store.ts, order-store.ts, payment-store.ts
│  │  ├─ auth/                              # clerk.ts, workos.ts
│  │  ├─ payments/                          # stripe.ts
│  │  ├─ queue/                             # redis.ts, client.ts
│  │  ├─ cache/                             # redis.ts
│  │  ├─ storage/                           # s3.ts
│  │  ├─ email/                             # resend.ts, templates/
│  │  ├─ http/                              # fetch.ts
│  │  ├─ clock/                             # system.ts
│  │  └─ observability/                     # logger.ts, metrics.ts, tracing.ts
│  │
│  ├─ contracts/                            # Cross-boundary contracts — pure types
│  │  ├─ api/                               # auth.ts, users.ts, orders.ts, payments.ts
│  │  ├─ events/                            # order-created.ts, order-cancelled.ts, payment-completed.ts
│  │  └─ plugins/                           # plugin.ts
│  │
│  └─ config/                               # Configuration
│     ├─ env.ts
│     ├─ app.ts
│     ├─ database.ts
│     └─ services.ts
│
├─ tests/
│  ├─ unit/                                 # core/, modules/
│  ├─ integration/                          # infra/, adapters/
│  └─ e2e/                                  # app/ entry points
│
├─ scripts/                                 # migrate.ts, seed.ts, generate.ts
├─ docs/
├─ package.json
├─ tsconfig.json
├─ README.md
└─ .env.example
```

## Layer Table

| No. | Layer | Path | Contains | Tests | Deps | Risk |
|-----|-------|------|----------|-------|------|------|
| 1 | `core/` | `src/core/` | pure primitives: `result.ts`, `option.ts`, `errors/`, `ids.ts`, `time.ts`, `events.ts`, `pagination.ts` + `ports/` (clock, random, id-generator) | pure unit tests — no IO mocks | leaf — imports no other layer | high — shared kernel every module relies on |
| 2 | `modules/<name>/domain/` | `src/modules/*/domain/` | `model.ts`, `errors.ts`, `schema.ts` — pure types + business rules | pure unit tests | → `core/` only | high — core logic must not rely on infra |
| 3 | `modules/<name>/usecases/` | `src/modules/*/usecases/` | application use cases (`login.ts`, `checkout.ts`) — entries called by `app/`, composing features + ports (optional — use when orchestration spans features or is shared by several entry points) | unit tests with mocked ports + features | → `features/`, `domain/`, `ports/`, `core/` | medium — application boundary |
| 4 | `modules/<name>/features/` | `src/modules/*/features/` | feature logic (`create.ts`, `session.ts`) — orchestrates domain + ports within the feature | unit tests with mocked ports | → `domain/` (same module), `ports/`, `core/` — never import `usecases/` | medium — orchestration |
| 5 | `modules/<name>/ports/` | `src/modules/*/ports/` | interfaces the module needs — `*Port` | — (types only) | → `domain/` types only | low |
| 6 | `modules/<name>/adapters/` | `src/modules/*/adapters/` | module-level boundary translation/mappers | integration tests | → `domain/`, `ports/` | medium |
| 7 | `contracts/` | `src/contracts/` | api schemas, event schemas, plugin contracts — pure types | schema validation tests | leaf — imports no other layer | low |
| 8 | `adapters/` | `src/adapters/` | cross-module boundary translation: `http/`, `persistence/`, `messaging/` | integration tests | → `modules/` ports, `contracts/` | medium |
| 9 | `infra/` | `src/infra/` | external implementations: `database/`, `postgres/`, `queue/`, `cache/`, `storage/`, `email/`, `http/`, `clock/`, `observability/` — implement ports | integration tests | → `ports/` of `core/`/`modules/`, `adapters/` | medium — IO/framework |
| 10 | `app/` | `src/app/` | entry points `api/`, `web/`, `cli/`, `worker/`, `cron/`, `plugin/` + composition root `runtime.ts` | smoke + e2e tests | → every layer (composition root only) | low |
| 11 | `config/` | `src/config/` | `env.ts`, `app.ts`, `database.ts`, `services.ts` | config tests | leaf | low |

## Rules

- Dependency direction: `core` ← `modules` ← `adapters`/`infra` ← `app` — never reverse it
- `contracts/` and `config/` are leaves — every layer may use them, but they must never import back
- Modules reach each other only through `contracts/` events or ports — never import another module directly
- `usecases/` is optional per module — use it when orchestration spans features or several entry points share one flow; `app/` always calls `usecases/` first when present (fallback → `features/`); the direction `usecases → features → domain` only, never reversed
- `app/runtime.ts` is the single composition root that wires ports → implementations
- `app/web/components/` + `app/web/hooks/` are optional — web-entry UI only; call `modules/<name>/usecases/` (or `features/` fallback) + `contracts/` — never call `infra/`/`domain/` directly
- Public API only through the module/layer `index.ts` barrel — no deep imports from outside
- `domain/` + `core/` must stay pure — no IO, framework imports, or side effects
- No `fx/` or effect-system layer — side effects live in `infra/` and are orchestrated through `features/` + ports
