---
name: update-tests
description: เขียน/อัปเดต tests ครบทุก layer — unit, integration, e2e, contract, visual ฯลฯ แล้วรันจนผ่าน
argument-hint: "[scope-or-files]"
related:
  - review-test
  - run-test
  - run-test-all
  - follow-tool-playwright
  - follow-tool-vitest
  - update-specs
  - use-subagents
  - resolve-errors
  - run-check
  - report
  - suggest-next-action
---

## Goal

เขียนและอัปเดต tests ให้ครอบคลุมทุก test type และทุก layer — unit, integration, e2e, contract, property-based, mutation, performance, security, accessibility, visual — ตาม conventions ของ project แล้วรันจนผ่านทั้ง suite (merged from: `update-test-and-fix`, `update-unit-test`, `update-integration-test`, `update-e2e-test`, `deep-test`)

## Scope

ใช้เมื่อต้องการเขียน/อัปเดต tests ครอบคลุม — เลือก layers ตาม scope: ถ้าระบุ files ให้ตรวจว่าเกี่ยวกับ layer ไหนแล้วเขียนครบทุก type ที่เหมาะ ไม่จำกัดแค่ unit

- ถ้ายังไม่ได้ review suite → ทำ `/review-test` ก่อน
- ถ้าต้องการรัน tests เฉยๆ → `run-test-*` ที่ตรง layer หรือ `/run-test-all`
- ถ้าต้องการ improve test suite quality → `/deep-review-then-fix`
- ถ้า scope ใหญ่หลาย modules → dispatch ผ่าน `/use-subagents`

## Execute

### 1. Detect Framework And Strategy

> Goal: ใช้ setup เดิมของ project และวาง test pyramid

1. ตรวจ manifests (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`) หา test deps (`vitest`, `jest`, `bun test`, `pytest`, `go test`)
2. ตรวจ config + test files เดิม — naming, structure, assertion style, mock patterns
3. กำหนด test pyramid และ types ที่จำเป็นตาม scope — ตาม [references/layers.md](references/layers.md)
4. กำหนด data strategy: `factories` (dynamic), `fixtures` (static), `builders` (complex)
5. กำหนด mock strategy: mock external deps เท่านั้น — internal pure functions ใช้ real

### 2. Analyze Source

> Goal: map code paths ก่อนเขียน

1. อ่าน source ทั้งหมดใน scope — handlers, services, utils, types
2. ระบุ branches/code paths, external deps ที่ต้อง mock, input validation rules, output/error shapes
3. ระบุ security-critical logic (auth checks, IDOR, sanitization, userId injection)
4. สร้าง code-path map → minimum test cases ที่ต้องมี

### 3. Sync Specs

> Goal: spec ครอบคลุม tests

1. ทำ `/update-specs` สร้าง/อัปเดต `specs/overview.md` + `specs/<feature>.md`
2. ตรวจว่า spec ครอบคลุม test files ที่จะเขียน

### 4. Write Tests Per Layer

> Goal: เขียนครบทุก layer ที่ scope ต้องการ

ทำตาม [references/layers.md](references/layers.md) — unit, integration, e2e (Playwright ตาม `/follow-tool-playwright`, Vitest ตาม `/follow-tool-vitest`), contract, property-based, mutation, performance, security, accessibility, visual

ทุก handler/function ต้องมี: happy path, error path, edge cases, unauthorized, input validation + conditional categories ตามที่ logic เกี่ยวข้อง

### 5. Run Per-Layer Runners

> Goal: ทุก layer ผ่านก่อนรวม

1. unit → `/run-test`; integration → `/run-test`; e2e → `/run-test`; api → `/run-test`
2. FAIL → แยก test bug vs app bug: test bug แก้ test, app bug → `/resolve-errors` หรือ report
3. retry สูงสุด 3 รอบต่อ failure

### 6. Run All Tests

> Goal: suite ทั้งหมดเขียวรวมกัน

1. ทำ `/run-test-all` — orchestrator เลือก runners ที่ project มีจริงและรายงานผลรวม
2. ถ้ามี failures ข้าม layer → กลับ Step 5 แก้เฉพาะ layer นั้น

### 7. Verify Coverage And Quality

> Goal: ครอบคลุมและมีคุณภาพ

1. ทำ `/run-test` (coverage) — verify lines/branches/functions ตาม target
2. รันซ้ำ 2-3 ครั้ง — deterministic, ไม่มี flaky/order dependence
3. ทำ `/run-check` lint/typecheck ผ่าน

### 8. Report

> Goal: ส่งมอบ

1. ทำ `/report` — tests added/updated/removed ต่อ layer, coverage delta, pass rate, items ค้าง
2. persist raw results → `.devin/reports/<workspace>/update-tests-<time>.md` ตาม format `/create-report-in-dot-devin` เพื่อให้ `/update-docs` reuse
3. ทำ `/suggest-next-action`

### Subagents

> Goal: parallelize suite updates เมื่อ changes กระทบหลาย suites

- ใช้ `subagents/suite-updater.md` เมื่อต้อง update หลาย test suites ที่ independent กัน (unit/integration/e2e/snapshot) — spawn ทีละ suite ผ่าน `/use-subagents` โดยแต่ละ agent แก้คนละชุด test files แล้วรวมผลก่อน `/run-test-all`

### Subskills

> Goal: dispatch งาน update ไปยัง subskill ตาม test layer

| Topic | Subskill |
|-------|----------|
| อัปเดต e2e specs หลัง UI/route เปลี่ยน | `subskills/update-e2e/SKILL.md` |
| อัปเดต unit tests หลัง refactor | `subskills/update-unit/SKILL.md` |
| Regenerate/review snapshots อย่างปลอดภัย | `subskills/update-snapshot/SKILL.md` |

## Rules

### 1. All Layers Covered

- ห้ามเขียนแค่ unit เมื่อ scope ต้องการ integration/e2e — เลือกทุก layer ที่เหมาะกับ code ที่เปลี่ยน
- flows ที่เพิ่งผ่าน exploratory testing (เช่น `/watch-browser-test`) ต้อง codify เป็น Playwright specs

### 2. Behavior Over Implementation

- assert behavior/output + error shape + side effects — ห้าม assert internals
- test names บอก behavior: `should [expected] when [condition]` + AAA pattern

### 3. Deterministic And Isolated

- ไม่มี shared state, order dependence, real time/random — fake timers, seeded RNG, cleanup ทุก test
- ห้าม `waitForTimeout`/sleep เป็น workaround — ใช้ proper waits/mocks ที่ boundary

### 4. No Code Changes To Pass

- ห้ามแก้ source เพื่อให้ test เขียว — test เผย bug → fix bug แยกหรือ report
- intended behavior change เท่านั้นที่อัปเดต expectations

### 5. File Organization

- ตาม project pattern: colocated หรือ `tests/unit|integration|e2e/` — ไม่ผสม conventions
- test data ใน `tests/fixtures/`, helpers ใน `tests/utils/`, e2e artifacts ไม่ commit

### 6. Security In Tests

- ไม่ hardcode credentials — env vars/test fixtures
- security tests (auth bypass, IDOR, injection) ต้องมีบน handlers ที่เกี่ยวข้อง

## Expected Outcome

- tests ครอบคลุมทุก layer ที่ scope ต้องการพร้อม conventions ของ project
- `/run-test-all` ผ่าน — deterministic, ไม่มี flaky
- coverage ตรง target, specs sync กับ test cases
- report สรุป per-layer พร้อม raw results persisted ใน `.devin/reports/`
