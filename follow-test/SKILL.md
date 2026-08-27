---
name: follow-test
description: ตั้งค่าและใช้งาน testing strategies ครบวงจร รวม regression testing ตามมาตรฐาน
related:
  - follow-math-combinatorics
  - follow-math-probability
  - follow-math-statistics
  - follow-math-proofs
  - follow-math-numerical-methods
  - follow-math-algorithm-complexity
---

## Goal

ตั้งค่าและใช้งาน testing strategies ครบวงจรตาม test pyramid principle

## Scope

ใช้สำหรับตั้งค่าและใช้งาน testing สำหรับทุกประเภทโปรเจกต์และ ecosystems

## Execute

### 1. Check Prerequisites

> Goal: Check Prerequisites

- ตรวจสอบ `package.json` หรือ `Cargo.toml`
- ตรวจสอบ testing framework ที่ใช้ตาม ecosystem
- ตรวจสอบ monorepo (หลาย `package.json`, workspace config)
- ถ้าเป็น monorepo ทำ `/follow-monorepo` ก่อน

### 2. Select Test Strategy Level

> Goal: Select Test Strategy Level

เลือกระดับตาม Rules section 1

### 3. Setup Test Configurations

> Goal: Setup Test Configurations

- ทำ `/follow-tool-vitest` สำหรับ framework testing
- ทำ `/follow-tool-playwright` สำหรับ E2E testing
- ทำ `/follow-package-manifest` สำหรับ test scripts
- ตั้งค่า config files ตาม tech stack

### 4. Apply Test Scripts

> Goal: Apply Test Scripts

- ทำ `/use-scripts` ตาม tech stack จาก Rules section 3
- เพิ่ม test scripts ใน `package.json` หรือ `Cargo.toml`
- Single workspace: แก้ไขโดยตรง
- Multiple workspaces: ทำ `/follow-monorepo` ก่อน

### 5. Setup Test Directories

> Goal: Setup Test Directories

- สร้าง directory structure ตาม Rules section 4
- จัดระเบียบ test files ตาม conventions
- ตั้งค่า test fixtures และ helpers

### 6. Write Tests

> Goal: Write Tests

- ทำ `/write-test` สำหรับเขียน unit tests และ coverage
- ทำ `/run-test-all` สำหรับรัน tests ทุกประเภท (unit, integration, e2e, component)
- ทำ `/run-test-api` สำหรับ API tests และ contract tests ถ้า project มี API

### 7. Validate

> Goal: Validate

- รัน test scripts ตามระดับที่เลือก
- ตรวจสอบ coverage ตามเป้าหมาย
- ตรวจสอบ test quality ตาม best practices

## Rules

### 1. Test Strategy Levels

เลือกระดับตามขนาดและความซับซ้อนของโปรเจกต์:
- Minimal (Default): unit tests, basic coverage (70%) - เหมาะสำหรับโปรเจกต์เล็ก-กลาง
- Standard: Minimal + integration tests, component tests, coverage (85%) - เหมาะสำหรับโปรเจกต์ที่ต้องการความมั่นใจสูง
- Complete: Standard + e2e tests, performance tests, visual tests, contract tests, coverage (100%) - เหมาะสำหรับ production systems

### 2. Test Pyramid Principle

ใช้ test pyramid เพื่อ balance ระหว่าง test types:
- 70% Unit Tests: Test individual units in isolation - fast, cheap, maintainable
- 20% Integration Tests: Test interactions between components - moderate speed, cost
- 10% E2E Tests: Test complete user flows - slow, expensive, critical paths only

### 3. Test Scripts

Scripts สำหรับ testing ตาม ecosystem:

| Task | Bun/Node | Rust | Python | Go |
|------|----------|------|--------|----|
| test | vitest run | cargo nextest run | pytest | go test ./... |
| test:watch | vitest | cargo nextest run --watch | pytest-watch | go test ./... -watch |
| test:coverage | vitest run --coverage | cargo llvm-cov --html | pytest --cov | go test -coverprofile=coverage.out |
| test:integration | vitest run --config vitest.integration.config.ts | cargo nextest run --test-dir integration | pytest tests/integration | go test ./tests/integration |
| test:e2e | vitest run --config vitest.e2e.config.ts | cargo nextest run --test-dir e2e | pytest tests/e2e | go test ./tests/e2e |
| test:component | vitest run --config vitest.component.config.ts | - | - | - |

### 4. Test Structure

Directory structure สำหรับ test files:

```
tests/
├── unit/                    # Unit tests
│   ├── modules/
│   └── shared/
├── integration/             # Integration tests
│   ├── adapters/
│   └── api/
├── e2e/                     # End-to-end tests
│   ├── flows/
│   └── pages/
├── component/               # Component tests
├── fixtures/                # Test fixtures
└── helpers/                 # Test helpers
```

### 5. Coverage Targets

เป้าหมาย coverage ตามระดับ:

| Level | Unit | Integration | E2E | Overall |
|-------|------|-------------|-----|---------|
| Minimal | 70% | - | - | 70% |
| Standard | 85% | 60% | - | 80% |
| Complete | 95% | 80% | 50% | 90% |

### 6. Test Best Practices

ทำตาม best practices สำหรับการเขียน tests:
- AAA Pattern: Arrange, Act, Assert สำหรับ test structure
- Descriptive Names: Test names ควรบอกว่าทดสอบอะไร
- One Assertion per Test: ทดสอบสิ่งเดียวในแต่ละ test
- Independent Tests: Tests ไม่ควรขึ้นต่อกัน
- Fast Feedback: Unit tests ควรเร็ว (< 100ms per test)
- Mock External Dependencies: Mock services, databases, APIs
- Test Edge Cases: Boundary values, null, undefined, empty
- Use Fixtures: Reuse test data และ setup code
- CI Integration: Run tests ใน CI pipeline
- Test Documentation: Tests เป็น documentation ของ code

### 7. Regression Testing

> Goal: ตรวจสอบว่าการเปลี่ยนแปลงใหม่ไม่ได้ทำลายฟีเจอร์ที่มีอยู่เดิม

1. ระบุ files และ modules ที่ถูกเปลี่ยนแปลงด้วย `git diff`
2. วิเคราะห์ dependencies และ downstream effects ระบุ critical paths และ integration points
3. เลือก test cases ที่ครอบคลุม changed code, critical paths และ edge cases ที่เกี่ยวข้อง
4. รัน unit tests สำหรับ modules ที่เปลี่ยนแปลง, integration tests สำหรับ affected flows, e2e tests สำหรับ critical user journeys
5. วิเคราะห์ failures จัดกลุ่มตาม root cause ระบุ regressions จากการเปลี่ยนแปลงใหม่ ตรวจ flaky tests
6. แก้ไข regressions เพิ่ม test cases ใหม่หากจำเป็น รัน tests ซ้ำจนผ่านทั้งหมด

### 8. Advanced Testing (Optional)

สำหรับ Complete level เพิ่ม advanced testing:
- Mutation Testing: Verify test quality ด้วย code mutation
- Performance Testing: Benchmark critical paths และ bottlenecks
- Visual Testing: Detect UI regressions ด้วย screenshot comparison
- Contract Testing: Verify API contracts ระหว่าง services
- Security Testing: Scan vulnerabilities ใน dependencies และ code
- Load Testing: Test system ภายใต้ high load scenarios

### 8. Regression Testing

วิเคราะห์ผลกระทบและป้องกัน regressions:
- ใช้ `git diff` เพื่อดูการเปลี่ยนแปลงและ dependency graph สำหรับ downstream effects
- รัน tests ที่ cover changed lines ก่อน รวม smoke tests สำหรับ critical functionality
- ใช้ CI/CD pipeline สำหรับ automated regression รันบน environment ที่ใกล้เคียง production
- จัดกลุ่ม failures ตาม error patterns ระบุว่าเป็น regression หรือ pre-existing bug
- เพิ่ม test cases สำหรับ bugs ที่พบ ใช้ mutation testing สำหรับ critical code
- ห้ามข้าม regression testing เพื่อ save time หรือรันเฉพาะ unit tests และข้าม integration/e2e

## Expected Outcome

- Test scripts ตั้งค่าครบถ้วนใน `package.json`
- Test directory structure จัดระเบียบถูกต้อง
- Test configurations ตั้งค่าตาม tech stack
- Coverage บรรลุเป้าหมายตามระดับที่เลือก
- Tests ทำงานได้ใน CI pipeline
- Regression testing ครอบคลุม changed code และ critical paths