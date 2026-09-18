# Isolation Checks

## Goal

ตรวจสอบ isolation ของ modules, state, side effects, tests, environment, และ data

## Checks

### Module Isolation

1. แต่ละ module มี single responsibility หรือไม่
2. hidden internals และ public API ชัดเจน
3. ไม่เข้าถึง internal ข้าม module
4. ไม่ bypass layers

### State Isolation

1. global state vs local state — ระบุ shared mutable state
2. singleton/shared instances ที่ทำให้ test ไม่ได้
3. race conditions จาก shared state

### Side Effect Isolation

1. I/O, network, file system, environment, logging ถูกกักกันหรือกระจาย
2. side effects อยู่ใน imperative shell ไม่ใช่ functional core

### Test Isolation

1. tests ไม่ขึ้นต่อลำดับ
2. shared fixtures ที่ทำให้ flaky
3. database state ที่ไม่ clean
4. mocked boundaries ที่ถูกต้อง

### Environment Isolation

1. dev/staging/prod separation
2. secrets/config isolation
3. container/process boundaries

### Data Isolation

1. tenant data แยกกัน
2. user data แยกกัน
3. session data แยกกัน
4. cache data แยกกัน

### Boundaries

1. module boundaries: clear import/export boundaries
2. package boundaries: package-level visibility, public vs internal API, cyclic package references
3. interface boundaries: interfaces/ports กั้นระหว่าง domain กับ infrastructure
4. API boundaries: service boundaries, version boundaries, contract boundaries
5. namespace/folder boundaries: group by feature/domain, ไม่ผสม concerns

### Dependencies

1. dependency direction: domain ไม่พึ่ง infrastructure (Dependency Rule)
2. circular dependencies: import cycles ระหว่าง modules/packages
3. coupling: tight coupling, shared knowledge, hardcoded dependencies
4. dependency graph: depth, fan-in, fan-out, unstable modules
5. external dependencies: third-party libraries ถูก isolate ด้วย abstraction/adapter
6. transitive dependencies: ไม่ expose internal dependencies ผ่าน public API

## Severity

- Critical: global mutable state ใน critical path, circular dependency ระหว่าง core modules, broken test isolation ที่ทำให้ flaky, no environment separation ระหว่าง prod กับ non-prod
- High: tight coupling ระหว่าง modules, missing boundaries ระหว่าง layers, shared state ที่ไม่จำเป็น, leaky abstraction, missing dependency direction
- Medium: inconsistent module boundaries, minor side effect leak, missing test isolation, minor namespace misuse
- Low: cosmetic, minor dependency cleanup, documentation gap
