# Clean Architecture File Structure

Canonical file structure สำหรับ target ที่ restructure เป็น Clean Architecture — ออกแบบสำหรับหลาย apps/entry points ที่ต้อง unified support: `modules/` แชร์ข้าม entry points ผ่าน `app/` composition root

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
│  │  │  ├─ domain/                         # model.ts, errors.ts — pure types + rules, ไม่มี IO/framework
│  │  │  ├─ features/                       # login.ts, logout.ts, session.ts — use cases/orchestration
│  │  │  ├─ ports/                          # interfaces ที่ module ต้องการ — session-store, token-issuer
│  │  │  ├─ adapters/                       # dto.ts, mappers/ — module-level boundary translation
│  │  │  └─ index.ts                        # module barrel — public API เท่านั้น
│  │  ├─ users/
│  │  │  ├─ domain/                         # model.ts, errors.ts, schema.ts
│  │  │  ├─ features/                       # create.ts, get.ts, update.ts, delete.ts
│  │  │  ├─ ports/                          # user-store, notifier
│  │  │  ├─ adapters/                       # dto.ts, mappers/
│  │  │  └─ index.ts
│  │  ├─ orders/
│  │  │  ├─ domain/                         # model.ts, errors.ts
│  │  │  ├─ features/                       # create.ts, get.ts, cancel.ts, refund.ts
│  │  │  ├─ ports/                          # order-store, payment-gateway
│  │  │  ├─ adapters/                       # dto.ts, mappers/
│  │  │  └─ index.ts
│  │  └─ payments/
│  │     ├─ domain/                         # model.ts, errors.ts
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
| 1 | `core/` | `src/core/` | pure primitives: `result.ts`, `option.ts`, `errors/`, `ids.ts`, `time.ts`, `events.ts`, `pagination.ts` + `ports/` (clock, random, id-generator) | unit tests pure — ไม่ mock IO | leaf — ไม่ import layer อื่น | สูง — shared kernel ทุก module พึ่ง |
| 2 | `modules/<name>/domain/` | `src/modules/*/domain/` | `model.ts`, `errors.ts`, `schema.ts` — pure types + business rules | unit tests pure | → `core/` เท่านั้น | สูง — core logic ห้ามพึ่ง infra |
| 3 | `modules/<name>/features/` | `src/modules/*/features/` | use cases (`login.ts`, `create.ts`) — orchestrate domain + ports | unit tests ด้วย mock ports | → `domain/` (module เดียว), `ports/`, `core/` | กลาง — orchestration |
| 4 | `modules/<name>/ports/` | `src/modules/*/ports/` | interfaces ที่ module ต้องการ — `*Port` | — (types only) | → `domain/` types เท่านั้น | ต่ำ |
| 5 | `modules/<name>/adapters/` | `src/modules/*/adapters/` | module-level boundary translation/mappers | integration tests | → `domain/`, `ports/` | กลาง |
| 6 | `contracts/` | `src/contracts/` | api schemas, event schemas, plugin contracts — pure types | schema validation tests | leaf — ไม่ import layer อื่น | ต่ำ |
| 7 | `adapters/` | `src/adapters/` | cross-module boundary translation: `http/`, `persistence/`, `messaging/` | integration tests | → `modules/` ports, `contracts/` | กลาง |
| 8 | `infra/` | `src/infra/` | external implementations: `database/`, `postgres/`, `queue/`, `cache/`, `storage/`, `email/`, `http/`, `clock/`, `observability/` — implement ports | integration tests | → `ports/` ของ `core/`/`modules/`, `adapters/` | กลาง — IO/framework |
| 9 | `app/` | `src/app/` | entry points `api/`, `web/`, `cli/`, `worker/`, `cron/`, `plugin/` + composition root `runtime.ts` | smoke + e2e tests | → ทุก layer (composition root เท่านั้น) | ต่ำ |
| 10 | `config/` | `src/config/` | `env.ts`, `app.ts`, `database.ts`, `services.ts` | config tests | leaf | ต่ำ |

## Rules

- Dependency direction: `core` ← `modules` ← `adapters`/`infra` ← `app` — ห้ามกลับทิศ
- `contracts/` และ `config/` เป็น leaf — ทุก layer ใช้ได้ แต่ห้าม import กลับ
- modules ข้ามกันผ่าน `contracts/` events หรือ ports เท่านั้น — ห้าม import module อื่นตรงๆ
- `app/runtime.ts` เป็น composition root เดียวที่ wire ports → implementations
- public API ผ่าน `index.ts` barrel ของ module/layer เท่านั้น — ห้าม deep imports จากภายนอก
- `domain/` + `core/` ต้อง pure — ไม่มี IO, framework imports, side effects
- ไม่มี `fx/` หรือ effect system layer — side effects อยู่ใน `infra/` และ orchestrate ผ่าน `features/` + ports
