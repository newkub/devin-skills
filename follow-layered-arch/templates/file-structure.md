# Layered Architecture File Structure

Canonical file structure สำหรับ target ที่ restructure เป็น Layered Architecture — ออกแบบสำหรับ app เดียว (single app): layers ชี้ลงทางเดียว `presentation` → `domain` → `data` ไม่ bypass

## File Structure

```text
project/
│
├─ src/
│  │
│  ├─ presentation/                         # UI & entry — ชั้นบนสุด (routes, pages, controllers)
│  │  ├─ routes/                            # auth.ts, users.ts, orders.ts
│  │  ├─ pages/                             # index.ts, users/, orders/ (web apps)
│  │  ├─ components/                        # ui components — PascalCase
│  │  ├─ middleware/                        # auth.ts, error.ts, logging.ts
│  │  └─ server.ts                          # entry point — wire layers
│  │
│  ├─ domain/                               # Business rules — services/use cases ต่อ capability
│  │  ├─ auth/                              # service.ts, model.ts, errors.ts
│  │  ├─ users/                             # service.ts, model.ts, errors.ts, schema.ts
│  │  ├─ orders/                            # service.ts, model.ts, errors.ts, schema.ts
│  │  ├─ payments/                          # service.ts, model.ts, errors.ts
│  │  └─ index.ts                           # barrel — public API ของ layer
│  │
│  ├─ data/                                 # Persistence & external calls — ชั้นล่างสุด
│  │  ├─ repositories/                      # user.ts, order.ts, payment.ts
│  │  ├─ clients/                           # stripe.ts, resend.ts, http.ts
│  │  ├─ database/                          # client.ts, schema.ts, migrations/
│  │  └─ index.ts                           # barrel — public API ของ layer
│  │
│  ├─ shared/                               # Cross-layer pure utilities (optional)
│  │  ├─ result.ts
│  │  ├─ errors.ts
│  │  ├─ pagination.ts
│  │  └─ index.ts
│  │
│  └─ config/                               # Configuration
│     ├─ env.ts
│     ├─ app.ts
│     └─ database.ts
│
├─ tests/
│  ├─ unit/                                 # domain/
│  ├─ integration/                          # data/
│  └─ e2e/                                  # presentation/ routes/pages
│
├─ scripts/                                 # migrate.ts, seed.ts
├─ docs/
├─ package.json
├─ tsconfig.json
├─ README.md
└─ .env.example
```

## Layer Table

| No. | Layer | Path | Contains | Tests | Deps | Risk |
|-----|-------|------|----------|-------|------|------|
| 1 | `presentation/` | `src/presentation/` | `routes/` (`*.route`), `pages/`, `components/` (PascalCase), `middleware/`, `server.ts` — controllers/handlers เท่านั้น | component + e2e tests | → `domain/` เท่านั้น — ห้ามเรียก `data/` ตรง | ต่ำ |
| 2 | `domain/` | `src/domain/<capability>/` | `service.ts`/`use-case`, `model.ts`, `errors.ts`, `schema.ts` ต่อ capability + barrel `index.ts` | unit tests | → `data/` เท่านั้น (+ `shared/`) | สูง — business rules |
| 3 | `data/` | `src/data/` | `repositories/` (`*Repository`), `clients/` (`*Client`), `database/` (client, schema, migrations) + barrel `index.ts` | integration tests | leaf — ไม่ import layer อื่น (+ `shared/`) | กลาง |
| 4 | `shared/` | `src/shared/` | pure utilities: `result.ts`, `errors.ts`, `pagination.ts` + barrel `index.ts` | unit tests pure | leaf — ทุก layer ใช้ได้ | ต่ำ |
| 5 | `config/` | `src/config/` | `env.ts`, `app.ts`, `database.ts` | config tests | leaf | ต่ำ |

## Rules

- Dependencies ชี้ลงทางเดียว: `presentation` → `domain` → `data` — ห้าม bypass (presentation เรียก data ตรง) และห้ามชี้ขึ้น
- Public API ผ่าน `index.ts` barrel ของแต่ละ layer/capability — ห้าม deep imports ข้าม layer
- ใช้ path aliases ของ project แทน relative imports ข้าม layer
- `shared/` เก็บ pure utilities เท่านั้น — ห้ามใส่ business logic หรือ IO
- รักษา behavior เดิม — routes/pages ทำงานเหมือนก่อน restructure
- app นี้โตเป็นหลาย apps ที่ต้องแชร์ domain → upgrade เป็น Clean (`/follow-clean-arch` `templates/file-structure.md`)
