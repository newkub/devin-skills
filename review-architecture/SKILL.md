---
name: review-architecture
description: Review architecture, modularity, isolation, resilience, reliability, governance
argument-hint: "[scope]"
related:
  - scan-codebase
  - deep-analyze
  - deep-review
  - deep-validate
  - report
  - suggest-next-action
---

## Goal

Review architecture ระดับ macro ครอบคลุม design patterns, module boundaries, dependency directions, coupling, SOLID principles, anti-patterns, modularity, isolation, resilience, reliability และ governance พร้อม review score

## Scope

architectural patterns, module boundaries, dependency directions, SOLID principles, scalability, concurrency, multi-tenancy, queue architecture, routing, side effects, modularity, isolation, resilience, reliability และ governance

ดูเพิ่มเติม: /deep-review

## Execute

### 1. Prepare

> Goal: เข้าใจ architecture, patterns, module structure และ dependency graph

1. ทำ `/scan-codebase` เพื่อเข้าใจ architecture และ module layout
2. รัน `madge` เพื่อสร้าง dependency graph และหา circular dependencies
3. ระบุ architectural patterns, module/package boundaries, shared state, test strategy และ environment separation ที่ใช้
4. ถ้าสแกนไม่ได้ → stop และ report

### 2. Review Dimensions

> Goal: ครอบคลุมทุก architecture dimension

1. Modularity/isolation: module boundaries, cohesion, coupling, public API ชัดเจน, ไม่ bypass layers, state/side-effect/test isolation
2. Dependency direction: domain ไม่พึ่ง infrastructure, ไม่มี circular deps, fan-in/fan-out ยอมรับได้
3. Paradigm consistency: paradigm หลัก (declarative/functional/imperative/OOP/reactive) สม่ำเสมอภายใน module — mixed paradigms ต้องมี boundaries ชัดเจน
4. Design patterns: pattern fit กับปัญหา — ไม่ over/under-engineer, ระบุ anti-patterns และ premature abstraction
5. Import/export: barrel exports สม่ำเสมอ, ไม่มี deep imports ข้าม layer, public API ผ่าน `index` entry point
6. Resilience/reliability: retries, timeouts, circuit breakers, fallback, health checks บน critical path
7. Governance: ADR สำหรับ significant decisions, dependency rules enforced ผ่าน lint/CI, ownership ชัดเจน

### 3. Validate Findings

> Goal: findings ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings
2. จัด severity: Critical (broken boundaries/SPOF/no isolation), High (tight coupling, missing resilience), Medium (inconsistency), Low (cosmetic)
3. ระบุ false positives ที่พบ

### 4. Report

> Goal: รายงาน findings พร้อม actionable recommendations

1. ทำ `/report`
2. สร้างตาราง findings: Category, Finding, Severity, Location, Recommendation
3. จัดกลุ่ม findings ตาม category และเรียงตาม severity
4. ทำ `/suggest-next-action`

## Rules

1. ทุก finding ต้องมี file path, line number และ evidence
2. แยก review process จาก fix process — review เป็น report-only จนกว่า user confirm
3. ใช้ skip conditions เมื่อ project ไม่มีสภาพแวดล้อมที่เกี่ยวข้อง
4. รายงานด้วยตารางและไม่ใช้ bold markers

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. จัดลำดับ findings ตาม severity — canonical steps ที่ `../shared/review-fix.md`
2. structural fixes (boundary violations, coupling, misplaced files) → ทำ `/refactor`, `/restructure` และ `/update-references` — รักษา behavior เดิม ผ่าน `/run-check` และ `/run-test` ถ้ามี
3. เลือก/apply architecture pattern ตาม guides ใน `## Pattern Guides` เมื่อ finding ต้องเปลี่ยน pattern:

| Finding | Guide |
|---------|-------|
| ต้อง layered structure สำหรับ frontend ขนาดเล็ก-กลาง | `### Pattern: Layered Architecture` |
| ต้อง clean architecture — testability สูง, ports & adapters | `### Pattern: Clean Architecture` |
| ต้อง microservices — distributed, service boundaries | `### Pattern: Microservices Architecture` |

4. สรุปผลด้วย `/report-before-after`

## Pattern Guides

> Merged จาก `references/patterns-*.md` เดิม — guides สำหรับ `## Fix` เมื่อต้องเปลี่ยน architecture pattern

### Pattern: Clean Architecture

Implement Clean Architecture ด้วย Vertical Slice Modules, Functional Core และ Ports & Adapters สำหรับ production-grade applications — เหมาะกับ projects ที่ต้องการ testability สูง และ maintainability ระยะยาว

#### Execute — Clean

##### 1. Setup Project Structure

```
src/
├── modules/                      # Feature modules (Vertical Slice)
│   └── [module-name]/            # types/ schemas/ domain/ application/ ports/ index.ts
├── adapters/                     # External systems: db/ http/ external/ config/ cache/ queue/ storage/ auth/
├── presentation/                 # Entry points: http/ graphql/ grpc/ cli/ events/
├── shared/                       # Shared kernel: types/ utils/ errors/ constants/ ports/ mappers/
test/                             # Mirror src structure: fixtures/ helpers/ mocks/ modules/
```

##### 2. Create Shared Kernel

1. `types/` - Common types (`Result`, `Option`)
2. `utils/` - Pure utility functions
3. `errors/` - Error types
4. `ports/` - Cross-module shared interfaces (`LoggerPort`, `ClockPort`, `IdGeneratorPort`)
5. `mappers/` - Shared mapper functions across modules

##### 3. Implement Functional Core

เขียน business logic ใน `modules/*/domain/` ด้วย pure functions (ถ้า project ใช้ TypeScript ให้ทำ `/follow-lib-effect-ts` ก่อนเพื่อใช้ Effect สำหรับ type-safe effects, error handling และ dependency injection)

1. ใช้ `pure functions` เท่านั้น, Immutable data structures (`readonly`)
2. ไม่มี side effects, ไม่พึ่ง infrastructure
3. ทำ `/review-quality` เพื่อกำหนด validation strategy ข้าม layers
4. ทำ `/follow-lib-zod` สำหรับ schema validation ใน `modules/*/schemas/`

##### 4. Implement Application Layer

ทำ `/follow-event-driven` เมื่อ application มี event-driven workflows; ถ้าไม่ใช้ event-driven ให้สร้าง usecases/queries ตรงๆ ใน `modules/*/application/`

1. `usecases/` - Flow orchestration (write side)
2. `queries/` - Read-side queries (CQRS read)
3. `workflows/` - Complex multi-step workflows
4. `handlers/` - Domain event handlers
5. ใช้ `ports` สำหรับ side effects

##### 5. Implement Adapters And Presentation

วางโครงสร้าง adapters และ presentation layers ตาม dependency direction (presentation → application → adapters → ports)

1. `adapters/db/` - Database implementations — ทำ `/follow-orm`
2. `adapters/http/` - HTTP clients, `adapters/external/` - External services
3. `adapters/cache/` - Cache, `adapters/queue/` - Message queues, `adapters/storage/` - File storage
4. `presentation/http/` - HTTP handlers, `presentation/graphql/` - GraphQL resolvers
5. `presentation/cli/` - CLI commands, `presentation/events/` - Event handlers

##### 6. Refactor Existing Code

ถ้ามี existing code: ทำ `/refactor` เพื่อย้าย code เข้า structure ใหม่ (ถ้าไม่มี ให้ข้ามขั้นตอนนี้)

1. ย้าย business logic ไป `modules/*/domain/operations/`
2. ย้าย data models ไป `modules/*/domain/models/` เป็น `readonly` types
3. ย้าย repository implementations ไป `adapters/db/`, HTTP handlers ไป `presentation/http/`
4. แปลง class methods เป็น `pure functions`
5. สร้าง module ports ใน `modules/*/ports/`

##### 7. Testing Strategy

ทำ `/update-tests` เพื่อจัดการ tests ตาม Clean Architecture

1. ทำ `/follow-tool-vitest` สำหรับ testing framework setup
2. Unit tests - Pure function tests ใน `test/modules/*/domain/` (AAA pattern)
3. Integration tests - Adapter tests ใน `test/adapters/` (mock ports)
4. E2E tests - Full workflow tests ใน `test/e2e/` (critical flows)
5. Test fixtures ใน `test/fixtures/`, helpers ใน `test/helpers/`

##### 8. Split Modules When Too Large

ถ้า module โตเกินเกณฑ์ ให้ทำ `/refactor-workspace`

1. วัด module size: module เกิน 15 ไฟล์, ไฟล์ใน `domain/operations/` เกิน 300 บรรทัด, usecases ใน `application/usecases/` เกิน 5 ตัว
2. เลือก pattern: sub-module (ยังเกี่ยวข้อง parent), sibling module (อิสระ), shared module (ใช้ร่วม)
3. สร้าง sub-module directories ตาม Clean Architecture structure
4. ทำ `/update-references` เพื่ออัปเดท imports
5. ทำ `/run-test` เพื่อยืนยัน functionality ไม่พัง

#### Rules — Clean

##### 1. Core Rules

- `Domain` = business rules (100% pure)
- `Application` = orchestration + "what happens next" decisions
- `Adapters` = side effects only

##### 2. Folder Structure

| Folder | Purpose | Side Effects | Required |
|--------|---------|--------------|----------|
| `modules/*/domain/` | Pure business logic | None | Required |
| `modules/*/application/` | Orchestration | Via ports | Required |
| `modules/*/ports/` | Module interfaces | None | Required |
| `adapters/` | External systems | I/O only | Required |
| `presentation/` | Entry points | I/O only | Required |
| `shared/` | Common utilities | None | Required |

##### 3. Layer Responsibilities

| Layer | Dependencies | Side Effects |
|-------|--------------|--------------|
| Domain | None | None |
| Application | Domain | Via ports |
| Adapters | Ports | I/O only |
| Presentation | Application | I/O only |
| Shared | None | None |

##### 4. When To Use

เหมาะกับ: testability สูง, เปลี่ยน technology ได้ง่าย, ทีม 3+ developers
ไม่เหมาะกับ: CRUD ธรรมดา, Prototype/MVP, One-person project ระยะสั้น

##### 5. Module Splitting

- ผ่าน 2+ triggers = ควร split (ไฟล์เกิน 15, operations เกิน 300 บรรทัด, usecases เกิน 5)
- ไม่ split module ที่ < 5 ไฟล์ (`over-engineering`)
- แต่ละ sub-module ควรมี 3-10 ไฟล์ และเขียน responsibility ได้ในประโยคเดียว (SRP)
- ไม่ split ถ้าทำให้เกิด `circular dependency` หรือใน prototype/MVP phase

- ใช้ /follow-tool-vite ถ้าจำเป็น
- ใช้ /follow-lang-typescript ถ้าจำเป็น
- ใช้ /follow-lang-rust ถ้าจำเป็น
- ใช้ /follow-create-bun-cli ถ้าจำเป็น
- ใช้ /improve ถ้าจำเป็น
- ใช้ /run-clean ถ้าจำเป็น

#### Expected Outcome — Clean

- Functional Clean Architecture ที่ production-ready
- Pure domain logic ใน `modules/` (100% functional)
- Side effects isolation ใน `adapters/` layer เท่านั้น
- Production-grade testability จาก pure functions + clear boundaries

### Pattern: Layered Architecture

Implement Layered Architecture สำหรับ Frontend projects โดยแยก concerns ตาม layers และ enforce dependency rules — เหมาะกับ Frontend projects (Vue/Nuxt/React/Solid) ขนาดเล็ก-กลาง

#### Execute — Layered

##### 1. Select Pattern

1. ประเมิน project size และ team experience
2. เลือก pattern: traditional layered, feature-based, 4-layer, หรือ hybrid
3. พิจารณา project lifecycle และ migration path
4. ทำ `/follow-tool-vite` สำหรับ build tooling setup

##### 2. Create Structure

Traditional Layered (โปรเจกต์ขนาดเล็ก หรือ classic):

```
src/
├── components/        // UI components (global)
├── composables/      // Vue composables / React hooks
├── stores/           // state management (Pinia/Zustand)
├── services/         // API calls and business logic
├── utils/            // pure utility functions
├── types/            // TypeScript types
├── constants/        // app constants
├── middleware/       // route middleware
└── plugins/          // framework plugins
```

Feature-Based (features ชัดเจน แยกกันได้):

```
src/
├── features/          // feature-based organization
│   ├── auth/         // authentication feature
│   │   ├── composables/  // Vue composables
│   │   ├── components/  // Vue components
│   │   ├── api/          // API calls
│   │   ├── stores/ (optional)   // state management
│   │   ├── hooks/ (optional)     // custom hooks
│   │   ├── middleware/ (optional) // route middleware
│   │   └── types/        // TypeScript types
│   └── dashboard/    // dashboard feature
└── shared/           // shared utilities
    ├── utils/        // utility functions
    ├── stores/ (optional)     // global state
    ├── plugins/ (optional)    // framework plugins
    ├── constants/ (optional)  // app constants
    └── types/ (optional)      // shared types
```

4-Layer (separation of concerns แบบชัดเจน):

```
src/
├── presentation/     // UI components, pages, routing, layout
│   ├── components/   // reusable UI (Button, Card)
│   ├── pages/        // page-level components
│   └── hooks/        // UI-specific hooks
├── application/      // state orchestration, workflows
│   ├── stores/       // TanStack Query, Zustand, Pinia
│   ├── useCases/     // application workflows
│   └── utils/        // app-wide utilities
├── domain/           // business entities and pure logic
│   ├── entities/     // models (User, Product)
│   ├── repositories/ // interfaces for data access
│   └── services/     // pure business logic functions
├── infrastructure/   // external integrations
│   ├── api/          // API clients
│   ├── storage/      // LocalStorage, IndexedDB wrappers
│   └── config/       // environment configs
└── shared/           // cross-layer utilities (types, constants)
```

##### 3. Enforce Dependencies And Public APIs

1. ใช้ path aliases (`@/domain/...`, `@/application/...`) เพื่อให้ layer transitions ชัดเจน
2. ถ้า project มี `Biome` → เพิ่ม restricted import rules
3. ถ้า project มี CI → เพิ่ม dependency graph checks สำหรับ cycle detection
4. หลีกเลี่ยง circular dependencies โดยใช้ dependency injection ผ่าน interfaces

##### 4. Align Tests With Layers

1. `Domain` tests: pure functions และ policies
2. `Application` tests: use cases กับ fake repositories
3. `Infrastructure` tests: adapters และ mapping (contract tests)
4. `Presentation` tests: behavior และ composition
5. ถ้า project มี `Vitest` → ทำตาม `/follow-tool-vitest`

##### 5. Setup And Migrate

1. สร้าง folder structure ตาม pattern ที่เลือก
2. ตั้งค่า import alias ใน `tsconfig` หรือ `nuxt.config`
3. ย้าย code ทีละ feature เพื่อลด risk
4. ถ้า project มี `Nuxt Layers` → ใช้ `extends` ใน `nuxt.config.ts`
5. ทำ `/refactor` หลังจากเสร็จ
6. ถ้า project โตขึ้น (3+ devs) → migrate ไป Clean Architecture (`### Pattern: Clean Architecture`)

#### Rules — Layered

##### 1. Pattern Selection

- `traditional layered` เหมาะกับโปรเจกต์ขนาดเล็ก หรือต้องการโครงสร้าง classic
- `feature-based` เหมาะกับโปรเจกต์ที่มี features ชัดเจนและแยกกันได้
- `4-layer` เหมาะกับโปรเจกต์ที่ต้องการ separation of concerns แบบชัดเจน
- `hybrid` (vertical slices + internal layering) เหมาะกับโปรเจกต์ขนาดใหญ่
- พิจารณา team experience และ project lifecycle

##### 2. Dependency Discipline

- `Presentation` → `Application` / `Domain` เท่านั้น
- `Application` → `Domain` เท่านั้น
- `Infrastructure` → `Domain` (สำหรับ mapping) เท่านั้น
- `Domain` ห้าม import จาก layer อื่นทั้งหมด
- ใช้ path aliases (`@/domain/...`, `@/application/...`) เพื่อให้ layer transitions ชัดเจน
- ถ้า project มี `Biome` → เพิ่ม restricted import rules
- ถ้า project มี CI → เพิ่ม dependency graph checks สำหรับ cycle detection
- หลีกเลี่ยง circular dependencies โดยใช้ dependency injection ผ่าน interfaces

##### 3. Public API Rules

- แต่ละ layer/feature ต้องมี `index.ts` เป็น public API entry point
- ห้าม deep imports ข้าม layer (ใช้ `@/domain/order` ไม่ใช่ `@/domain/order/entities/User`)
- ใช้ barrel export pattern ทั้งหมด
- composables ใช้ prefix `use` เสมอ
- import ผ่าน alias ไม่ใช้ relative path

##### 4. Nuxt-Specific Guidelines

- ใช้ `Nuxt Layers` สำหรับ share configuration, components, และ composables ข้ามโปรเจกต์
- `srcDir` ค่าเริ่มต้นคือ `app/` ใน Nuxt 4
- auto-imported directories: `components/`, `composables/`, `utils/`
- ใช้ `shared/` สำหรับ code ที่ใช้ร่วมระหว่าง app และ server
- ลำดับ priority: project files > auto-scanned layers > `extends` config layers

##### 5. Common Pitfalls

- หลีกเลี่ยง `shared/` กลายเป็น escape hatch — shared ต้องมีเฉพาะ code ที่ใช้จริงข้าม layers
- หลีกเลี่ยง business layer กลายเป็น mega-service — แยก use cases ให้เล็กและ focused
- หลีกเลี่ยง features กระจายข้าม layers จนค้นหายาก — ใช้ `feature-based` ถ้าจำเป็น
- หลีกเลี่ยง manual enforcement โดยไม่มี lint หรือ CI checks

##### 6. Migration Path

- ถ้า project โตขึ้น (3+ devs, high testability) → migrate ไป Clean Architecture (`### Pattern: Clean Architecture`)
- ถ้า project ต้องการ modular boundaries → ใช้ module structure ใน `src/modules/<feature>/` ตาม `### Pattern: Clean Architecture`
- Domain logic ต้อง framework-agnostic เพื่อให้ migrate ได้ง่าย

- ใช้ /follow-lib-vue ถ้าจำเป็น
- ใช้ /follow-create-web-nuxt ถ้าจำเป็น
- ใช้ /follow-create-web-svelte ถ้าจำเป็น
- ใช้ /follow-create-web-nextjs ถ้าจำเป็น
- ใช้ /follow-lib-react ถ้าจำเป็น

#### Expected Outcome — Layered

- เลือก pattern ที่เหมาะสมกับโปรเจกต์
- Folder structure ชัดเจนตาม pattern ที่เลือก
- Dependency rules ถูก enforce ผ่าน aliases และ lint
- Code แยกตาม domain หรือ technical layer
- Tests จัดเรียงตาม layers
- Migration path ชัดเจนเมื่อ project โตขึ้น

### Pattern: Microservices Architecture

กำหนดโครงสร้างโปรเจกต์ด้วย Microservices Architecture สำหรับ distributed systems ที่ต้องการ scalability, independence และ fault tolerance

#### Execute — Microservices

##### 1. Analyze Domain Boundaries

1. ระบุ business capabilities และ bounded contexts
2. แยก concerns ตาม domain-driven design
3. ระบุ data ownership ของแต่ละ service
4. ตรวจสอบ coupling ระหว่าง services

##### 2. Design Service Boundaries

1. กำหนด service boundaries ชัดเจน
2. ระบุ APIs และ contracts ระหว่าง services
3. กำหนด data isolation strategy
4. ใช้ `### Pattern: Clean Architecture` เพื่อวางโครงสร้างพื้นฐานของแต่ละ service

##### 3. Implement API Gateway

1. สร้าง API Gateway สำหรับ routing
2. กำหนด authentication และ authorization — ทำ `/review-quality` สำหรับ input validation
3. ตั้งค่า rate limiting และ load balancing
4. กำหนด request/response transformation

##### 4. Implement Service Discovery

1. ติดตั้ง service registry (Consul, Eureka, etcd)
2. ตั้งค่า service registration
3. กำหนด health checks
4. ตรวจสอบ service availability

##### 5. Implement Communication

1. เลือก communication pattern: REST, gRPC, message queues
2. ตั้งค่า inter-service communication
3. กำหนด retry logic และ circuit breakers
4. ทำ `/follow-event-driven` สำหรับ async communication

##### 6. Implement Data Isolation

1. กำหนด database per service — ทำ `/follow-orm` สำหรับ data access patterns
2. ตั้งค่า data replication ถ้าจำเป็น
3. กำหนด eventual consistency strategy
4. ตรวจสอบ transaction boundaries

##### 7. Validate Architecture

1. ตรวจสอบ service independence
2. ทดสอบ fault tolerance และ resilience
3. ตรวจสอบ scalability
4. ทำ `/restructure` หลังจาก implement เสร็จ

#### Rules — Microservices

##### 1. Service Boundaries

- Services ต้อง loosely coupled
- แต่ละ service ต้องมี database ของตัวเอง
- ใช้ domain-driven design สำหรับ boundaries
- หลีกเลี่ยง shared databases

##### 2. API Gateway

- API Gateway เป็น single entry point
- จัดการ cross-cutting concerns ที่ gateway
- ใช้ API versioning สำหรับ compatibility
- ตรวจสอบ security ที่ gateway level

##### 3. Service Discovery

- Services ต้อง register กับ service registry
- ใช้ health checks สำหรับ monitoring
- ใช้ load balancing สำหรับ distribution
- ตรวจสอบ service availability อัตโนมัติ

##### 4. Communication Patterns

- ใช้ synchronous (REST/gRPC) สำหรับ immediate responses
- ใช้ asynchronous (message queues) สำหรับ eventual consistency
- ใช้ circuit breakers สำหรับ fault tolerance
- ใช้ retry logic สำหรับ transient failures

##### 5. Directory Structure

```text
# Example monorepo structure
services/
├── api-gateway/             # API Gateway
│   ├── src/
│   │   ├── routes/         # Route definitions
│   │   ├── middleware/     # Auth, rate limiting
│   │   └── config/         # Gateway config
│   └── package.json
├── user-service/           # User domain
│   ├── src/
│   │   ├── domain/         # Business logic
│   │   ├── application/    # Use cases
│   │   ├── infrastructure/ # DB, external
│   │   └── api/            # Controllers
│   └── package.json
├── order-service/          # Order domain
│   ├── src/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── api/
│   └── package.json
└── shared/
    ├── types/              # Shared types
    ├── utils/              # Shared utilities
    └── events/             # Event schemas
```

##### 6. Data Isolation

- แต่ละ service ต้องมี database ของตัวเอง
- ใช้ eventual consistency สำหรับ cross-service transactions
- ใช้ sagas สำหรับ long-running transactions
- หลีกเลี่ยง distributed transactions ที่ซับซ้อน

##### 7. Deployment

- Deploy services อิสระกัน
- ใช้ containerization (Docker)
- ใช้ orchestration (Kubernetes)
- ใช้ CI/CD pipelines สำหรับ automation

##### 8. Language Support

- รองรับ: TypeScript, Python, Rust, Go, Java, C#
- Services สามารถใช้ภาษาต่างกันได้
- ปรับ deployment strategy ตามภาษา

- ใช้ /follow-tool-vitest ถ้าจำเป็น
- ใช้ /follow-tool-vite ถ้าจำเป็น
- ใช้ /follow-monorepo ถ้าจำเป็น

#### Expected Outcome — Microservices

- Microservices Architecture ที่ loosely coupled
- Services ที่ independent และ scalable
- API Gateway สำหรับ unified entry point
- Communication ที่ reliable และ fault-tolerant
- Data isolation ที่ชัดเจน

## Expected Outcome

- รายงานตาราง findings พร้อม severity และ location
- รายงาน recommended actions พร้อม priority
- แนะนำ action ถัดไปผ่าน `/suggest-next-action` แยกเป็น follow-clean-architecture, follow-layered-architecture
