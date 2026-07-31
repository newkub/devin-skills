---
name: follow-feda
description: FEDA-Lite + Monorepo - Production-ready architecture ที่ balance simplicity แล scalability
---

## Goal

ใช้ FEDA-Lite (Functional Event Data Architecture Lite) ร่วมกับ Monorepo เพื่อสร้าง architecture ที่ production-ready โดย balance ระหว่าง simplicity, testability, scalability, แล maintainability

## Execute

### 1. Setup Monorepo Structure

1. ทำตาม `/moonrepo` สำหรับ monorepo setup
2. แยก packages ตาม domain boundaries ไม่ใช่ technical boundaries
3. ตั้งค่า workspace สำหรับ dependency isolation
4. ตั้งค่า build pipeline สำหรับ parallel builds

### 2. Design Functional Core

1. แยก business logic เป็น pure functions ใน domain packages
2. ใช้ dependency injection สำหรับ side effects
3. เขียน functions ที่ deterministic และ testable
4. ใช้ TypeScript types สำหรับ input/output ที่ชัดเจน

### 3. Build Application Orchestration

1. สร้าง use case orchestrators ใน application packages
2. สร้าง services สำหรับ business workflow coordination
3. Connect domain logic กับ infrastructure adapters
4. แยก orchestration logic จาก core domain logic

### 4. Implement Infrastructure Adapters

1. สร้าง database adapters ใน infrastructure packages
2. สร้าง API clients สำหรับ external services
3. ใช้ event system (minimal) เฉพาะ cross-package communication
4. ใช้ actor system (optional) เฉพาะ stateful components
5. ใช้ data optimization (selective) เฉพาะ hot paths

### 5. Implement Optional Capabilities

1. ใช้ events เฉพาะเมื่อต้อง loose coupling ข้าม packages
2. ใช้ actors เฉพาะเมื่อต้อง isolation สำหรับ stateful components
3. ใช้ data optimization เฉพาะเมื่อ performance เป็น bottleneck
4. หลีกเลี่ยง optional capabilities ที่ไม่จำเป็น

### 6. Setup Operational Concerns

1. ตั้งค่า structured logging ในทุก layers
2. ตั้งค่า metrics สำหรับ critical paths
3. ตั้งค่า tracing สำหรับ cross-package workflows
4. ตั้งค่า error tracking ด้วย context เต็ม

## Rules

### Core Principles

- Simplicity First: เลือก simplest solution ที่ work ได้ก่อน, เพิ่ม complexity เฉพาะเมื่อจำเป็น
- Selective Usage: Events/Actors/Data optimization เป็น optional, ใช้เฉพาะที่จำเป็น
- Domain Boundaries: แยก packages ตาม domain ไม่ใช่ technical concerns
- No Circular Dependencies: Strict acyclic dependency graph

### Package Structure

```
packages/
├── domain/                  # Domain packages (pure functions)
│   ├── user/               # User domain logic
│   ├── auth/               # Auth domain logic
│   └── shared/             # Shared domain types
├── contracts/               # Shared contracts, schemas, types
│   ├── events/             # Event types (ถ้าใช้)
│   └── api/                # API contracts
├── infrastructure/          # Infrastructure packages
│   ├── database/           # Database adapters
│   ├── events/             # Event system (optional)
│   └── actors/             # Actor system (optional)
├── application/             # Application packages
│   ├── services/           # Application services
│   └── use-cases/          # Use case orchestrators
└── apps/                    # Applications
    ├── web/                # Web application
    ├── api/                # API application
    └── cli/                # CLI application
```

### Testing Strategy

- Functional Core: Unit tests ด้วย pure functions
- Package Boundaries: Contract tests ระหว่าง packages
- Event System: Integration tests (ถ้าใช้)
- Actor System: Concurrency tests (ถ้าใช้)
- Data Optimization: Performance tests (ถ้าใช้)

### Debugging Strategy

- ใช้ functional purity สำหรับ reproduce bugs
- ใช้ package isolation สำหรับ pinpoint issues
- ใช้ event logs (ถ้าใช้ event system)
- ใช้ actor isolation (ถ้าใช้ actors)

## Operational Rules

### Observability

- Structured logging ในทุก layers
- Metrics สำหรับ critical paths
- Tracing สำหรับ cross-package workflows
- Error tracking ด้วย context เต็ม

### Migrations

- Database migrations ใน infrastructure packages
- Versioned schemas ใน contracts/
- Backward compatibility เมื่อเป็นไปได้
- Rollback plans สำหรับ breaking changes

### Retries & Resilience

- Exponential backoff สำหรับ external calls
- Circuit breakers สำหรับ downstream services
- Idempotent operations สำหรับ safe retries
- Timeout configurations ตาม SLA

### Versioning

- Semantic versioning สำหรับ packages
- Contract versioning ใน contracts/
- Deprecation warnings สำหรับ breaking changes
- Migration guides สำหรับ major versions

### Deployment

- Independent package deployment ถ้าเป็นไปได้
- Canary deployments สำหรับ critical packages
- Feature flags สำหรับ gradual rollout
- Health checks สำหรับทุก services

## Expected Outcome

- Architecture ที่ balance ระหว่าง simplicity แล scalability
- System ที่ testable, debuggable, maintainable
- Monorepo structure ที่ support scaling แล decoupling
- Code ที่ simple, production-ready, แล operational
