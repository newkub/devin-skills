# Layered Architecture File Structure

Canonical file structure สำหรับ target ที่ restructure เป็น Layered Architecture — ออกแบบสำหรับ app เดียว (single app): **flat folders, grouping by type** — layers เป็น logical grouping ของ folders ชี้ลงทางเดียว `presentation` → `domain` → `data` ไม่ bypass

## File Structure

```text
project/
│
├─ src/
│  │
│  ├─ app/                                  # Entry & routes — wire layers (presentation)
│  │  ├─ routes/                            # auth.ts, users.ts, orders.ts (หรือ pages/ สำหรับ web)
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
│  ├─ usecases/                             # application use cases — orchestration entry ที่ app/ เรียก (domain)
│  │  ├─ login.ts
│  │  ├─ create-order.ts
│  │  └─ refund-payment.ts
│  │
│  ├─ services/                             # domain services — business rules ที่ usecases เรียก (domain)
│  │  ├─ user-service.ts
│  │  ├─ order-service.ts
│  │  └─ payment-service.ts
│  │
│  ├─ features/                             # feature-level logic เฉพาะ domain — compose usecases+services (domain)
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
│  ├─ utils/                                # pure utilities — helpers ไม่มี IO (shared leaf)
│  │  ├─ date.ts
│  │  └─ slug.ts
│  │
│  ├─ types/                                # shared types — pure types เท่านั้น (shared leaf)
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
| 1 | presentation | `app/` | routes/pages, middleware, `server.ts` — entry point wire layers | required | e2e tests | → `usecases/`, `features/` (+ shared leaves) | ต่ำ |
| 2 | presentation | `components/` | UI components — PascalCase, presentational | optional (ถ้ามี UI) | component tests | → `hooks/`, `usecases/` (+ shared leaves) — ห้ามเรียก `infra/`/`lib/` ตรง | ต่ำ |
| 3 | presentation | `hooks/` | hooks / composables — UI state + view logic | optional (ถ้ามี UI framework) | unit tests | → `usecases/` (+ shared leaves) | ต่ำ |
| 4 | domain | `usecases/` | application use cases — orchestration entry (`login.ts`, `create-order.ts`) | required | unit tests ด้วย mock infra | → `services/`, `features/`, `infra/` ports (+ shared leaves) | กลาง — orchestration |
| 5 | domain | `services/` | domain services (`*-service.ts`) — business rules pure | required | unit tests | → `infra/`, `lib/` (+ shared leaves) — ห้ามเรียก presentation | สูง — business rules |
| 6 | domain | `features/` | feature-level logic เฉพาะ domain — compose usecases+services | optional | unit tests | → `usecases/`, `services/` (+ shared leaves) | กลาง |
| 7 | data | `infra/` | repositories, `database/` (client, schema, migrations), external APIs | required | integration tests | leaf — ไม่ import presentation/domain (+ shared leaves) | กลาง — IO |
| 8 | data | `lib/` | third-party wrappers / singleton clients (`db.ts`, `stripe-client.ts`) | optional | integration tests | leaf (+ shared leaves) | ต่ำ |
| 9 | shared leaf | `types/` | shared types — pure types เท่านั้น | optional | — (types only) | leaf — ทุก layer ใช้ได้ ห้าม import กลับ | ต่ำ |
| 10 | shared leaf | `constants/` | constants | optional | — | leaf — ทุก layer ใช้ได้ | ต่ำ |
| 11 | shared leaf | `utils/` | pure utilities — helpers ไม่มี IO | optional | unit tests pure | leaf — ทุก layer ใช้ได้ | ต่ำ |
| 12 | shared leaf | `config/` | `env.ts`, `app.ts`, `database.ts` | optional (ถ้ามี env/config) | config tests | leaf — ทุก layer ใช้ได้ | ต่ำ |
| 13 | root | `index.ts` | barrel — public API | required | smoke test | → ทุก layer | ต่ำ |

## Rules

- **Flat folders เท่านั้น** — ห้าม nest folder ตาม capability/domain; grouping by type (`components/`, `services/`, `usecases/`…) และตั้งชื่อไฟล์ prefix ตาม domain แทน (`user-service.ts`, `order-service.ts`)
- Dependencies ชี้ลงทางเดียว: presentation folders → domain folders → data folders — ห้าม bypass (เช่น `components/` เรียก `infra/` ตรง) และห้ามชี้ขึ้น
- `app/` เรียก `usecases/`/`features/` เท่านั้น — ห้ามเรียก `services/` หรือ `infra/` โดยตรงเมื่อมี usecase ครอบอยู่
- `types/`, `constants/`, `utils/`, `config/` เป็น leaf — ทุก layer import ได้ แต่ห้าม import กลับเข้า layer folders
- `utils/`, `types/` ต้อง pure — ไม่มี IO, framework imports, side effects
- Public API ผ่าน `index.ts` barrel — ห้าม deep imports ข้าม layer
- ใช้ path aliases ของ project แทน relative imports ข้าม folder
- รักษา behavior เดิม — routes/pages ทำงานเหมือนก่อน restructure
- app นี้โตเป็นหลาย apps ที่ต้องแชร์ domain → upgrade เป็น Clean (`/follow-clean-arch` `templates/file-structure.md`)
