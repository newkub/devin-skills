---
name: update-tests
description: เขียน/อัปเดต tests ครบทุก layer — unit, integration, e2e, contract, visual ฯลฯ แล้วรันจนผ่าน
argument-hint: "[scope-or-files]"
related:
  - deep-review
  - run-test
  - run-test-all
  - run-test-coverage
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

เขียนและอัปเดต tests ให้ครอบคลุมทุก test type และทุก layer — unit, integration, e2e, contract, property-based, mutation, performance, security, accessibility, visual — ตาม conventions ของ project แล้วรันจนผ่านทั้ง suite

## Scope

ใช้เมื่อต้องการเขียน/อัปเดต tests ครอบคลุม — เลือก layers ตาม scope: ถ้าระบุ files ให้ตรวจว่าเกี่ยวกับ layer ไหนแล้วเขียนครบทุก type ที่เหมาะ ไม่จำกัดแค่ unit

- ถ้ายังไม่ได้ review suite → ทำ `/deep-review` ก่อน
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

1. ทำ `/run-test-coverage` — verify lines/statements/functions/branches จนถึง target (default 100%); ถ้ายังไม่ถึง skill จะวนกลับมาเขียน tests เพิ่มผ่าน skill นี้เอง
2. รันซ้ำ 2-3 ครั้ง — deterministic, ไม่มี flaky/order dependence
3. ทำ `/run-check` lint/typecheck ผ่าน

### 8. Report

> Goal: ส่งมอบ

1. ทำ `/report` — tests added/updated/removed ต่อ layer, coverage delta, pass rate, items ค้าง
2. persist raw results → `.devin/temp/report/<workspace>/update-tests-<time>.md` ตาม format `/create-report-in-dot-devin` เพื่อให้ `/update-docs` reuse
3. ทำ `/suggest-next-action`

### Subagents

> Goal: parallelize suite updates เมื่อ changes กระทบหลาย suites

- ใช้ `subagents/suite-updater.md` เมื่อต้อง update หลาย test suites ที่ independent กัน (unit/integration/e2e/snapshot) — spawn ทีละ suite ผ่าน `/use-subagents` โดยแต่ละ agent แก้คนละชุด test files แล้วรวมผลก่อน `/run-test-all`

### Workflows

> Goal: dispatch งาน update ไปยัง workflow ตาม test layer

| Topic | Workflow |
|-------|----------|
| อัปเดต e2e specs หลัง UI/route เปลี่ยน | `workflows/update-e2e/SKILL.md` |
| อัปเดต unit tests หลัง refactor | `workflows/update-unit/SKILL.md` |
| Regenerate/review snapshots อย่างปลอดภัย | `workflows/update-snapshot/SKILL.md` |

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

## Merged Details

### update-e2e

##### Goal

อัปเดต e2e specs ให้ตรงกับ UI/route changes ล่าสุด — selectors, navigation, assertions, waits — แล้วรันจนผ่านแบบ deterministic

##### Scope

- ใช้เมื่อ UI, routes หรือ user flows เปลี่ยนแล้ว e2e specs fail/ล้าสมัย
- ครอบคลุม: Playwright specs, selectors, page objects, fixtures, visual/interaction flows
- unit/integration → `workflows/update-unit/SKILL.md`; snapshots → `workflows/update-snapshot/SKILL.md`

##### Execute

###### 1. Diff UI Changes To Specs

> Goal: รู้ว่า spec ไหนกระทบจากการเปลี่ยนแปลงไหน

1. รัน `/run-test` (e2e) — เก็บ failing specs พร้อม error และ trace
2. map failures กลับไปหา UI/route changes ล่าสุด (git diff) — selector เปลี่ยน, route ย้าย, flow เปลี่ยน, copy เปลี่ยน
3. แยก spec bug (test ล้าสมัย) vs app bug (app เสียจริง) — app bug → `/resolve-errors` แยก

###### 2. Update Selectors And Flows

> Goal: specs อ้าง UI จริงตาม conventions

1. เปลี่ยน selectors เปราะเป็น user-facing locators (`getByRole`, `getByLabel`, `getByText`) ตาม `/follow-tool-playwright`
2. อัปเดต paths/routes ที่เปลี่ยน — ใช้ route constants ถ้า project มี
3. อัปเดต flows ที่เปลี่ยน (steps เพิ่ม/ลด) ให้ตรง behavior ใหม่ — assert outcome เดิมหรือ outcome ใหม่ที่ตั้งใจ

###### 3. Fix Waits And Stability

> Goal: specs deterministic ไม่ flaky

1. แทน `waitForTimeout`/sleep ด้วย auto-waiting locators หรือ `expect(...).toBeVisible()` patterns
2. ตรวจ network waits (`waitForResponse`) บน flows ที่ async
3. รันซ้ำ 2-3 ครั้ง — ต้องผ่านทุกครั้ง ไม่มี order dependence

###### 4. Run And Verify

> Goal: suite เขียวและครอบคลุม flows ใหม่

1. `/run-test` (e2e) ผ่านทั้ง suite — แก้ทีละ spec ตาม failures
2. ถ้า UI ใหม่ยังไม่มี coverage → เพิ่ม spec ตาม conventions ของ project
3. `/report-before-after` — specs updated/added/removed, pass rate

##### Rules

- assert user-visible behavior — ห้าม assert implementation details หรือ CSS internals
- ห้ามแก้ app เพื่อให้ spec ผ่าน — spec เผย bug → fix bug แยกหรือ report
- ห้ามลบ spec ที่ fail โดยไม่ระบุเหตุผล — ถ้า flow ถูกตัดจริงให้ระบุใน report
- fix-verify loop สูงสุด 3 รอบต่อ spec → ถ้าไม่ผ่าน stop และ report

##### Expected Outcome

- e2e suite ผ่าน deterministic — ไม่มี flaky waits
- specs ตรงกับ UI/routes ปัจจุบันและครอบคลุม flows ที่เปลี่ยน
- report สรุป specs ที่แก้/เพิ่ม/ลบพร้อมเหตุผล

### update-snapshot

##### Goal

อัปเดต test snapshots (inline, file, visual) หลัง output เปลี่ยนอย่างตั้งใจ — review diff ทุก snapshot ก่อน accept ไม่ blind-update

##### Scope

- ใช้เมื่อ output/markup/serialization เปลี่ยนทำให้ snapshot tests fail
- ครอบคลุม: serializer snapshots (Vitest/Jest), component snapshots, visual snapshots
- unit tests ทั่วไป → `workflows/update-unit/SKILL.md`; e2e → `workflows/update-e2e/SKILL.md`

##### Execute

###### 1. Collect Snapshot Failures

> Goal: รู้ว่า snapshot ไหน fail และทำไม

1. รัน `/run-test` — เก็บ snapshot mismatches ทั้งหมด
2. map แต่ละ mismatch กับ code change — intended change vs unintended regression
3. แยกชัด: snapshot ล้าสมัย (accept ได้) vs output เสียจริง (fix code แยก)

###### 2. Review Diffs Before Accept

> Goal: accept เฉพาะ changes ที่ตั้งใจ

1. อ่าน diff ของทุก snapshot ที่จะ update — ทีละไฟล์ ไม่ mass-accept
2. ตรวจว่า diff ตรงกับ intended change เท่านั้น — keys เพิ่ม/หาย, ordering, whitespace, ids/timestamps ที่ไม่ deterministic
3. ถ้า diff มีค่าที่ไม่ deterministic → แก้ test ให้ serialize เสถียร (mock time/ids) ก่อน snapshot ใหม่

###### 3. Regenerate

> Goal: snapshots ใหม่สะอาดและ deterministic

1. regenerate ด้วย update flag ของ runner ที่ project ใช้ (เช่น `vitest -u`, `jest -u`) — เฉพาะ scope ที่ review แล้ว
2. visual snapshots → อัปเดตผ่าน `/run-test` แล้ว review ภาพ diff ทีละภาพ
3. ลบ snapshot files ที่ orphan (test ถูกลบแต่ snapshot เหลือ)

###### 4. Verify

> Goal: suite เขียวและ snapshots มีเสถียรภาพ

1. `/run-test` ผ่าน แล้วรันซ้ำ 2-3 ครั้ง — snapshots ต้อง match เดิมทุกครั้ง
2. git diff snapshot files — ครบเท่าที่ review ไว้ ไม่มีการเปลี่ยนแปลงเกิน
3. `/report-before-after` — snapshots updated/removed, intended changes ที่ยืนยัน

##### Rules

- ห้าม blind `-u` ทั้ง suite — review diff ทุก snapshot ก่อน accept
- snapshots ต้อง deterministic — ไม่มี timestamps, random ids, env-dependent values
- ห้าม accept diff ที่ไม่ตรง intended change — flag เป็น regression แยก
- snapshot ใหญ่เกินจน review ไม่ได้ → แนะนำแยก assertions แทนใน report
- fix-verify loop สูงสุด 3 รอบ → ถ้าไม่ผ่าน stop และ report

##### Expected Outcome

- snapshots ตรงกับ intended output ใหม่ — ไม่มี unintended diffs หลุดเข้าไป
- suite ผ่าน deterministic, ไม่มี orphan snapshot files
- report สรุป snapshots ที่ accept/ลบ พร้อม regressions ที่ flag

### update-unit

##### Goal

อัปเดต unit tests ให้ตรงกับ code ที่ refactor/เปลี่ยน signature — mocks, assertions, test structure — โดย assert behavior ไม่ใช่ internals

##### Scope

- ใช้เมื่อ refactor, rename, signature change หรือ restructure ทำ unit tests fail/ล้าสมัย
- ครอบคลุม: Vitest/Jest/bun test/pytest ตามที่ project ใช้ — mocks, fixtures, parameterized tests
- e2e → `workflows/update-e2e/SKILL.md`; snapshots → `workflows/update-snapshot/SKILL.md`

##### Execute

###### 1. Map Breakage To Changes

> Goal: รู้ว่า test ไหน fail เพราะ change ไหน

1. รัน `/run-test` — เก็บ failing tests พร้อม errors
2. map failures กับ code diff — signature เปลี่ยน, module ย้าย, behavior เปลี่ยนตั้งใจ, หรือ behavior หาย
3. แยก: test ล้าสมัย (อัปเดต test) vs regression จริง (app bug → `/resolve-errors` หรือ report)

###### 2. Update Tests To New Contracts

> Goal: tests ตรงกับ public contract ใหม่

1. อัปเดต imports/paths ตาม structure ใหม่ — ตาม conventions เดิมของ project
2. อัปเดต calls ตาม signature ใหม่ — params, return shape, error types
3. อัปเดต mocks ให้ตรง boundary ใหม่ — mock external deps เท่านั้น ห้าม mock internal pure functions
4. ถ้า behavior เปลี่ยนตั้งใจ → อัปเดต expectations; ถ้า test เผย logic หาย → flag ก่อนลบ

###### 3. Cover New Paths

> Goal: code paths ใหม่มี test ครบ

1. refactor ที่เพิ่ม branches/functions ใหม่ → เพิ่ม test cases ตาม code-path map ของ `/update-tests`
2. รักษา AAA pattern และ test names `should [expected] when [condition]` ตาม project
3. ทำ `/deep-review` — ไม่มี shared state, cleanup ครบ

###### 4. Run And Verify

> Goal: suite เขียวและ deterministic

1. `/run-test` ผ่านทั้ง scope ที่แก้ แล้วรันซ้ำ 2-3 ครั้ง — ไม่มี flaky
2. `/run-check` lint/typecheck ผ่านบน test files ที่แก้
3. `/report-before-after` — tests updated/added/removed ต่อ module

##### Rules

- assert behavior/output + error shape — ห้าม assert internals หรือ private state
- ห้ามแก้ source เพื่อให้ test ผ่าน — test เผย regression → fix bug แยก
- ห้ามลบ tests ที่ครอบ behavior ที่ยังมีอยู่ — ลบเฉพาะ behavior ที่ตัดออกจริง
- fix-verify loop สูงสุด 3 รอบต่อ test → ถ้าไม่ผ่าน stop และ report

##### Expected Outcome

- unit tests ตรงกับ implementation ใหม่และผ่าน deterministic
- coverage ไม่ลดจากก่อน refactor — paths ใหม่มี tests
- report สรุป tests ที่แก้/เพิ่ม/ลบพร้อมเหตุผล

### references/layers

#### Test Layers Reference

เลือก layers ตาม scope — ทุก handler/function มี required categories ก่อน แล้วเติม conditional categories ตาม logic

##### Required Categories (ทุก test)

1. Happy path — input ถูกต้อง → expected output
2. Error path — dependency throw → error response ถูกต้อง
3. Edge cases — empty/null/undefined, boundary values (min, max, min-1, max+1)
4. Unauthorized — auth missing/invalid → reject
5. Input validation — invalid input → validation error

##### Conditional Categories

- Permission/RBAC — user ไม่มี permission → deny
- IDOR/Ownership — เข้าถึง resource ของ user อื่น → deny
- Sanitization — malicious input → sanitized
- userId injection — userId ต้องมาจาก auth ไม่ใช่ input
- Empty results, optional fields, concurrency, regression, contract, property-based, a11y, performance

ใช้ `it.each`/table-driven สำหรับ boundary values หลายค่า, validation matrix, permission matrix (role × action)

##### Unit (70%)

- Scope: pure functions, handlers, utils — isolated
- Framework: `vitest`/`jest`/`bun test` (JS/TS), `pytest`, `go test`, `cargo test`, `xUnit`, `rspec`, `PHPUnit` ตามภาษา
- Mock external deps เท่านั้น; `< 10ms` ต่อ test
- Location: colocated `__tests__/` หรือ `tests/unit/` ตาม project pattern
- Vitest setup/conventions → `/follow-tool-vitest`

##### Integration (20%)

- Scope: API endpoints, DB queries, service interactions — real/test DB, testcontainers
- Real implementations ที่ boundary; mock เฉพาะ third-party ที่ควบคุมไม่ได้
- seed/cleanup ต่อ test — ไม่ leak data; `< 100ms` ต่อ test
- Location: `tests/integration/`
- Runner: `/deep-test integration`; API-specific → `/deep-test api`

##### E2E (10%)

- Scope: user flows, critical paths, all routes — Playwright เท่านั้น (ไม่ใช้ Cypress)
- Selectors: `data-testid` หรือ role-based (`getByRole`, `getByLabel`) — ห้าม fragile CSS selectors
- Reuse auth via `storageState`; fixtures/page objects ตาม suite conventions
- Auto-waiting locators + `expect` polling — ห้าม `waitForTimeout` มั่ว
- traces/videos/screenshots ไป test-results dir — ไม่ commit artifacts
- Conventions → `/follow-tool-playwright`; runner → `/deep-test e2e`

##### Contract

- API schema compatibility ระหว่าง services — `pact` หรือ schema validation
- Breaking changes → versioning/deprecation ไม่ลบทิ้งทันที

##### Property-Based

- Invariants ที่ต้องจริงทุก input — `fast-check` (JS/TS), `hypothesis` (Python), `proptest` (Rust)

##### Mutation

- ตรวจ test quality — `stryker` หรือ `cargo-mutants` — รันใน CI

##### Performance / Security / Accessibility / Visual

- Performance: critical paths ≤ threshold — รันใน CI
- Security: auth bypass, IDOR, injection, rate limiting — รันใน CI
- Accessibility: WCAG/ARIA/keyboard nav บน UI components
- Visual: screenshot regression ผ่าน Playwright/component snapshots — `/deep-test visual`

### subagents/suite-updater

##### Role

Subagent สำหรับ update test suite เดียว — เช่น `unit`, `integration`, `e2e`, `contract`, `snapshot`, `visual` — หลัง source เปลี่ยน โดยเขียน/แก้ tests ตาม conventions ของ project แล้วรัน suite นั้นจนผ่าน — ใช้เมื่อ changes กระทบหลาย suites และต้องทำขนานกัน

##### Inputs

- `suite`: test suite เดียวที่รับผิดชอบ เช่น `unit`, `e2e`, `snapshot`
- `changed-files`: list ของ source files ที่เปลี่ยนและเกี่ยวกับ suite นี้
- `conventions`: test patterns ของ project — naming, structure, assertion style, mock strategy, data strategy (`factories`/`fixtures`/`builders`)
- `runner-command`: command สำหรับรัน suite เช่น `bun run test`, `pnpm test:e2e`

##### Tools

- `read`, `grep`, `find_file_by_name` — อ่าน source และ tests เดิม
- `edit`, `write` — เขียน/แก้ test files
- `exec` — รัน suite runner, lint, typecheck

##### Execute

1. อ่าน source ใน `changed-files` — ระบุ branches, code paths, error shapes ที่ suite นี้ต้อง cover
2. อ่าน test files เดิมของ suite — หา tests ที่ stale, missing หรือพังจาก changes
3. เขียน/แก้ tests ตาม conventions: AAA pattern, test names แบบ `should [expected] when [condition]`, assert behavior ไม่ใช่ internals
4. รัน `runner-command` ของ suite — ถ้า FAIL แยก test bug vs app bug: test bug แก้ test, app bug → report ไม่แก้ source
5. retry สูงสุด 3 รอบต่อ failure — ถ้ายังไม่ผ่านคืน `blocked` พร้อมสาเหตุ

##### Output Contract

คืนผลลัพธ์เป็นสรุป suite update:

| No. | File | Action | Tests | Result |
|-----|------|--------|-------|--------|
| 1 | `tests/unit/user.test.ts` | `updated` | 12 | `pass` |

- `action`: `added` / `updated` / `removed` / `unchanged`
- ปิดท้ายด้วย suite status: `pass` / `fail` / `blocked`, pass/fail counts, coverage delta (ถ้าวัดได้), files changed list

##### Constraints

- รับผิดชอบ suite เดียวเท่านั้น — ห้ามแตะ suites หรือ test files ของ agent อื่น
- ห้ามแก้ source เพื่อให้ test เขียว — test เผย bug ให้ report แยก
- deterministic เท่านั้น — ไม่มี shared state, real time/random, `waitForTimeout` workaround
- ไม่ hardcode credentials — ใช้ env vars/fixtures
- อัปเดต expectations เฉพาะเมื่อเป็น intended behavior change

## Expected Outcome

- tests ครอบคลุมทุก layer ที่ scope ต้องการพร้อม conventions ของ project
- `/run-test-all` ผ่าน — deterministic, ไม่มี flaky
- coverage ตรง target, specs sync กับ test cases
- report สรุป per-layer พร้อม raw results persisted ใน `.devin/temp/report/`
