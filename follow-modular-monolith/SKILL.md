---
name: follow-modular-monolith
description: Implement Modular Monolith architecture สำหรับ medium scale systems
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---
## Goal

## Goal

Implement Modular Monolith architecture ที่แยก modules ชัดเจน แต่ deploy เป็น single unit

## Scope

Use `follow-modular-monolith` for the specific tasks and workflows it covers

## Execute

## Execute

### 1. Analyze System Boundaries

1. ระบุ business domains และ modules ที่จำเป็น
2. กำหนด module boundaries ตาม bounded contexts
3. สร้าง dependency graph ระหว่าง modules
4. ระบุ shared infrastructure needs

### 2. Setup Module Structure

1. สร้าง folder structure สำหรับแต่ละ module:
   ```
   src/
   ├── modules/
   │   ├── module-a/
   │   │   ├── domain/
   │   │   ├── application/
   │   │   └── infrastructure/
   │   └── module-b/
   │       ├── domain/
   │       ├── application/
   │       └── infrastructure/
   └── shared/
       ├── infrastructure/
       └── kernel/
   ```
2. สร้าง module exports สำหรับ public APIs
3. กำหนด module interfaces และ contracts
4. ใช้ `/follow-clean-architecture` ภายในแต่ละ module

### 3. Implement Inter-Module Communication

1. เลือก communication pattern:
   - In-process method calls (synchronous)
   - Internal event bus (asynchronous)
   - Direct module API calls
2. สร้าง shared kernel สำหรับ common types
3. Implement module registry หรือ service locator
4. กำหนด transaction boundaries ข้าม modules

### 4. Setup Database Strategy

1. เลือก database approach:
   - Single database, schema-per-module
   - Single database, shared schema with prefixes
   - Separate databases (caution: distributed complexity)
2. สร้าง migration strategy แยกตาม module
3. Implement data access layer ในแต่ละ module
4. กำหนด cross-module query patterns

### 5. Configure Build And Deploy

1. สร้าง module-aware build configuration
2. Setup integration tests ระหว่าง modules
3. Implement health checks สำหรับแต่ละ module
4. สร้าง deployment pipeline ที่ deploy ทั้ง monolith

## Rules

## Rules

### 1. Module Boundaries

Strict Encapsulation
- แต่ละ module มี domain, application, infrastructure เป็นของตัวเอง
- Modules สื่อสารกันผ่าน public APIs เท่านั้น
- ห้าม access internal implementation ของ module อื่นโดยตรง
- ใช้ compiler/module system enforce boundaries

Shared Kernel
- เก็บ common types, utilities, base classes ใน shared kernel
- Shared kernel ต้อง stable และ minimal
- หลีกเลี่ยง business logic ใน shared kernel
- Version shared kernel อย่างระมัดระวัง

### 2. Communication Patterns

Synchronous (Default)
- ใช้สำหรับ operations ที่ต้องการ immediate consistency
- ง่ายต่อ debugging และ testing
- Transaction boundaries ชัดเจน

Asynchronous (Event-Driven)
- ใช้สำหรับ long-running operations หรือ cross-cutting concerns
- ทำ `/follow-event-driven` หากใช้ pattern นี้
- รองรับ eventual consistency
- Implement retry และ dead letter queue

### 3. Database Strategies

| Strategy | Pros | Cons | Use Case |
|----------|------|------|----------|
| Schema-per-module | Clear boundaries, easy extraction | More connections | Preparing for microservices |
| Shared schema | Simplest setup | Tight coupling | Smaller systems |
| Separate databases | True isolation | Distributed complexity | Large modules |

Recommendations
- เริ่มด้วย schema-per-module สำหรับ future flexibility
- ใช้ database-per-module เฉพาะเมื่อมี strong isolation requirements
- Avoid distributed transactions ถ้าเป็นไปได้

### 4. Testing Strategy

Module Tests
- Unit tests ในแต่ละ module
- Integration tests สำหรับ module boundaries
- Contract tests สำหรับ public APIs

System Tests
- End-to-end tests สำหรับ critical paths
- Performance tests สำหรับ cross-module operations
- Migration tests สำหรับ database changes

### 5. Migration Path

From Layered to Modular Monolith
1. Identify boundaries จาก existing code
2. Extract modules ทีละ module
3. Refactor dependencies เป็น explicit
4. Add module tests

From Modular Monolith to Microservices
1. Extract module ที่มี least dependencies ก่อน
2. เปลี่ยน in-process calls เป็น network calls
3. Implement distributed tracing
4. Add service discovery

### 6. Anti-Patterns

Module Coupling
- Circular dependencies ระหว่าง modules
- Shared database tables โดยไม่มี abstraction
- Business logic leak ระหว่าง modules

Over-Engineering
- สร้าง too many small modules (nanomodules)
- ใช้ distributed database โดยไม่จำเป็น
- แยก modules ก่อนที่จะเข้าใจ domains

## Expected Outcome

## Expected Outcome

- System ที่มี module boundaries ชัดเจน
- Each module สามารถ develop และ test ได้ independently
- สามารถ refactor หรือ extract modules ได้ง่าย
- Single deployment unit ที่ manage ได้ง่าย
- Path สำหรับ migrate to microservices เมื่อจำเป็น

## References

- ทำ `/follow-clean-architecture` เพื่อ implement architecture ภายในแต่ละ module
- ทำ `/follow-event-driven` หากใช้ async communication
- ทำ `/follow-microservices-architecture` สำหรับ migration path ถัดไป
