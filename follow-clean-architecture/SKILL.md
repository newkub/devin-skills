---
name: follow-clean-architecture
description: สร้างโครงสร้าง Clean Architecture ด้วย modules, ports, adapters และ pure domain
related:
  - review-architecture
  - follow-lib-effect-ts
  - follow-lib-zod
  - follow-orm
  - follow-tool-vitest
  - follow-tool-vite
  - follow-lang-typescript
  - follow-lang-rust
  - follow-create-bun-cli
  - review-architecture
---

## Goal

Implement Clean Architecture ด้วย Vertical Slice Modules, Functional Core และ Ports & Adapters สำหรับ production-grade applications

## Scope

ใช้สำหรับ projects ที่ต้องการ testability สูง และ maintainability ระยะยาว

## Execute

### 1. Setup Project Structure

> Goal: สร้าง project structure ตาม Clean Architecture

```
src/
├── modules/                      # Feature modules (Vertical Slice)
│   └── [module-name]/            # types/ schemas/ domain/ application/ ports/ index.ts
├── adapters/                     # External systems: db/ http/ external/ config/ cache/ queue/ storage/ auth/
├── presentation/                 # Entry points: http/ graphql/ grpc/ cli/ events/
├── shared/                       # Shared kernel: types/ utils/ errors/ constants/ ports/ mappers/
test/                             # Mirror src structure: fixtures/ helpers/ mocks/ modules/
```

### 2. Create Shared Kernel

> Goal: ทำ `/review-architecture` เพื่อเริ่มจาก pure functions และ immutability ก่อนสร้าง `shared/`

1. `types/` - Common types (`Result`, `Option`)
2. `utils/` - Pure utility functions
3. `errors/` - Error types
4. `ports/` - Cross-module shared interfaces (`LoggerPort`, `ClockPort`, `IdGeneratorPort`)
5. `mappers/` - Shared mapper functions across modules

### 3. Implement Functional Core

> Goal: เขียน business logic ใน `modules/*/domain/` ด้วย pure functions (ถ้า project ใช้ TypeScript ให้ทำ `/follow-lib-effect-ts` ก่อนเพื่อใช้ Effect สำหรับ type-safe effects, error handling และ dependency injection)

1. ใช้ `pure functions` เท่านั้น, Immutable data structures (`readonly`)
2. ไม่มี side effects, ไม่พึ่ง infrastructure
3. ทำ `/review-quality` เพื่อกำหนด validation strategy ข้าม layers
4. ทำ `/follow-lib-zod` สำหรับ schema validation ใน `modules/*/schemas/`

### 4. Implement Application Layer

> Goal: ทำ `/follow-event-driven` เมื่อ application มี event-driven workflows; ถ้าไม่ใช้ event-driven ให้สร้าง usecases/queries ตรงๆ ใน `modules/*/application/`

1. `usecases/` - Flow orchestration (write side)
2. `queries/` - Read-side queries (CQRS read)
3. `workflows/` - Complex multi-step workflows
4. `handlers/` - Domain event handlers
5. ใช้ `ports` สำหรับ side effects

### 5. Implement Adapters And Presentation

> Goal: วางโครงสร้าง adapters และ presentation layers ตาม dependency direction (presentation → application → adapters → ports)

1. `adapters/db/` - Database implementations — ทำ `/follow-orm`
2. `adapters/http/` - HTTP clients, `adapters/external/` - External services
3. `adapters/cache/` - Cache, `adapters/queue/` - Message queues, `adapters/storage/` - File storage
4. `presentation/http/` - HTTP handlers, `presentation/graphql/` - GraphQL resolvers
5. `presentation/cli/` - CLI commands, `presentation/events/` - Event handlers

### 6. Refactor Existing Code

> Goal: ถ้ามี existing code: ทำ `/refactor` เพื่อย้าย code เข้า structure ใหม่ (ถ้าไม่มี ให้ข้ามขั้นตอนนี้)

1. ย้าย business logic ไป `modules/*/domain/operations/`
2. ย้าย data models ไป `modules/*/domain/models/` เป็น `readonly` types
3. ย้าย repository implementations ไป `adapters/db/`, HTTP handlers ไป `presentation/http/`
4. แปลง class methods เป็น `pure functions`
5. สร้าง module ports ใน `modules/*/ports/`

### 7. Testing Strategy

> Goal: ทำ `/update-test-everything` เพื่อจัดการ tests ตาม Clean Architecture

1. ทำ `/follow-tool-vitest` สำหรับ testing framework setup
2. Unit tests - Pure function tests ใน `test/modules/*/domain/` (AAA pattern)
3. Integration tests - Adapter tests ใน `test/adapters/` (mock ports)
4. E2E tests - Full workflow tests ใน `test/e2e/` (critical flows)
5. Test fixtures ใน `test/fixtures/`, helpers ใน `test/helpers/`

### 8. Split Modules When Too Large

> Goal: ถ้า module โตเกินเกณฑ์ ให้ทำ `/refactor-workspace`

1. วัด module size: module เกิน 15 ไฟล์, ไฟล์ใน `domain/operations/` เกิน 300 บรรทัด, usecases ใน `application/usecases/` เกิน 5 ตัว
2. เลือก pattern: sub-module (ยังเกี่ยวข้อง parent), sibling module (อิสระ), shared module (ใช้ร่วม)
3. สร้าง sub-module directories ตาม Clean Architecture structure
4. ทำ `/update-references` เพื่ออัปเดท imports
5. ทำ `/run-test` เพื่อยืนยัน functionality ไม่พัง

## Rules

### 1. Core Rules

Clean Architecture มี 3 rules หลัก:

- `Domain` = business rules (100% pure)
- `Application` = orchestration + "what happens next" decisions
- `Adapters` = side effects only

### 2. Folder Structure

| Folder | Purpose | Side Effects | Required |
|--------|---------|--------------|----------|
| `modules/*/domain/` | Pure business logic | None | Required |
| `modules/*/application/` | Orchestration | Via ports | Required |
| `modules/*/ports/` | Module interfaces | None | Required |
| `adapters/` | External systems | I/O only | Required |
| `presentation/` | Entry points | I/O only | Required |
| `shared/` | Common utilities | None | Required |

### 3. Layer Responsibilities

| Layer | Dependencies | Side Effects |
|-------|--------------|--------------|
| Domain | None | None |
| Application | Domain | Via ports |
| Adapters | Ports | I/O only |
| Presentation | Application | I/O only |
| Shared | None | None |

### 4. When To Use

เหมาะกับ: testability สูง, เปลี่ยน technology ได้ง่าย, ทีม 3+ developers
ไม่เหมาะกับ: CRUD ธรรมดา, Prototype/MVP, One-person project ระยะสั้น

### 5. Module Splitting

- ผ่าน 2+ triggers = ควร split (ไฟล์เกิน 15, operations เกิน 300 บรรทัด, usecases เกิน 5)
- ไม่ split module ที่ < 5 ไฟล์ (`over-engineering`)
- แต่ละ sub-module ควรมี 3-10 ไฟล์ และเขียน responsibility ได้ในประโยคเดียว (SRP)
- ไม่ split ถ้าทำให้เกิด `circular dependency` หรือใน prototype/MVP phase

- ใช้ /follow-tool-vite ถ้าจำเป็น
- ใช้ /follow-lang-typescript ถ้าจำเป็น
- ใช้ /follow-lang-rust ถ้าจำเป็น
- ใช้ /follow-create-bun-cli ถ้าจำเป็น
- ใช้ /review-architecture ถ้าจำเป็น

## Expected Outcome

- Functional Clean Architecture ที่ production-ready
- Pure domain logic ใน `modules/` (100% functional)
- Side effects isolation ใน `adapters/` layer เท่านั้น
- Production-grade testability จาก pure functions + clear boundaries

