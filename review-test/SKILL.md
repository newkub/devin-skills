---
name: review-test
description: Review test strategy, quality, และผลลัพธ์หลัง run tests พร้อมสรุป action ถัดไป
argument-hint: "[scope]"
related:
  - run-test
  - update-tests
  - follow-test
  - review-coverage
  - follow-tdd
  - update-config
  - update-devin-global-skills
  - report
  - suggest-next-action
  - deep-validate
  - check-reference
  - check-test-correctness
  - deep-debug
  - resolve-errors
  - run-review
---

## Goal

Review test strategy และ quality ก่อนเริ่ม run หรือ write tests พร้อม review ผลลัพธ์หลัง run (pass/fail, coverage, flaky) เพื่อสรุป action ถัดไป และอัปเดต skill ผ่าน `/update-devin-global-skills` เมื่อพบ gap

## Scope

ใช้ได้ทั้งก่อนและหลังการรัน tests:

- ก่อน: ใช้ก่อน `run-test`, `follow-test`, `follow-tdd`, `update-tests`, `deep-test` — ตรวจ test strategy ครอบคลุม coverage, edge cases, isolation, pyramid balance, regression
- หลัง: ใช้หลัง `run-test`, `deep-test`, `follow-tdd`, `update-tests`, หรือ `follow-test` — วิเคราะห์ผลลัพธ์, coverage delta, flaky, สรุป action

## Execute

### Subskills

| Argument | Subskill |
|----------|----------|
| `flaky` | `## Fix` — fix flaky tests (isolation, timing, deterministic) |
| `coverage`, `improve-coverage`, `coverage-100` | `subskills/improve-coverage/SKILL.md` — raise coverage บน critical paths จนถึงเป้า (default 100%) |
| `flaky`, `report-flaky` — flaky inventory + quarantine list | `subskills/report-flaky/SKILL.md` |

1. ถ้า argument ตรงกับ subskill → อ่าน `subskills/<arg>/SKILL.md` แล้วทำตาม flow (ข้าม review pass ไป fix เลย)
2. ถ้าไม่ระบุ → ทำ Steps 1-6 ตามปกติ

### 1. Prepare

> Goal: เตรียม context ก่อน review
ทำตาม `references/prepare.md` เพื่อเข้าใจ project structure, test framework, test config และ directory structure ก่อน review

### 2. Coverage

> Goal: ตรวจ coverage ครอบคลุม
ทำตาม `references/coverage-gaps.md` เพื่อระบุ source files, functions, branches และ coverage categories ที่ยังไม่ถูก test

### 3. Edge Cases

> Goal: ตรวจ edge cases ครบ
ทำตาม `references/edge-cases.md` เพื่อตรวจ happy path, error path, boundary values, validation และ security tests

### 4. Isolation

> Goal: ตรวจ test isolation
ทำตาม `references/test-isolation.md` เพื่อตรวจ test isolation, cleanup, fixtures/factories, mock strategy และ flakiness

### 5. Pyramid

> Goal: ตรวจ test pyramid balance
ทำตาม `references/test-pyramid.md` เพื่อตรวจ distribution unit/integration/e2e, performance targets, test types และ CI integration

### 6. Regression

> Goal: ตรวจ regression coverage
ทำตาม `references/regression-coverage.md` เพื่อตรวจ regression tests สำหรับ bug fixes, critical paths, mutation testing และ CI pipeline

### 7. Pre-Run Score

> Goal: คำนวณ score ก่อน run
ทำตาม `references/test-quality-score.md` เพื่อคำนวณ test quality score, grade และ go/no-go ก่อน run

### 8. Capture Output

> Goal: อ่าน test output
ทำตาม `references/capture-output.md` เพื่ออ่าน stdout/stderr, บันทึกไฟล์ output, ตรวจ exit code และจัดหมวดหมู่ failure

### 9. Analyze Coverage/Flaky

> Goal: วิเคราะห์ coverage และ flaky
ทำตาม `references/analyze-coverage-flaky.md` เพื่อเปรียบเทียบ coverage target, หา missing branches, รัน test ซ้ำ และตรวจ root cause ของ flaky

1. flaky quarantine policy — process + SLA สำหรับ flaky tests
2. mutation testing / contract tests ตามที่เหมาะ
3. coverage gates ใน CI — threshold enforce ไม่ใช่แค่ measure

### 10. Decide Actions

> Goal: สรุป action ถัดไป
ทำตาม `references/decide-actions.md` เพื่อสรุป action ถัดไป, อัปเดต skill เมื่อพบ systemic gap และสร้างรายงาน

## Check: Flaky Tests


### Goal

ตรวจหา tests ที่ผ่าน/fail ไม่สม่ำเสมอ — ทั้งจาก *observed* flakiness (re-run variance) และ *masking config* (retries ที่ซ่อนความไม่เสถียร) — เพื่อให้ suite เชื่อถือได้จริง

### Scope

- ครอบคลุม observed flakiness + masking config + timing-dependent patterns
- Boundary: design-time causes (shared state, order deps) อยู่ที่ `## Check: Test Isolation` — skill นี้เน้น observed variance และ retry masking
- Read-only: หา flaky แล้ว report — แก้ผ่าน `/update-tests` หรือ `## Check: Test Isolation`

### Execute

#### 1. Detect Retry Masking

> Goal: หา config ที่ซ่อน flakiness

1. หา retry config — `retry:` ใน playwright/vitest config, `jest.retryTimes`, `--retries`, `mocha --retries`, pytest-rerunfailures
2. retry > 0 ที่ไม่มีเหตุผลบันทึกไว้ → Warning — retry ควรเป็น 0 ใน CI เพื่อเปิดโปง flaky

#### 2. Detect Timing Patterns

> Goal: หา tests ที่พึ่ง wall-clock timing

1. หา `setTimeout`/`sleep`/`waitForTimeout` ใน test bodies — fixed waits = flaky seeds
2. หา `Date.now()`/`new Date()`/random ใน assertions โดยไม่มี seed/fake timers
3. หา network-dependent calls ที่ไม่ mock — external I/O = nondeterministic

#### 3. Verify With Repeat Runs

> Goal: วัด observed variance จริง ไม่ใช่เดา

1. รัน suite หรือ scope ที่ suspect ≥2 ครั้ง — `bunx vitest run --repeat-each=3`, `pytest --repeat`, shuffle flags
2. เปรียบเทียบผล: test ที่ผ่านบ้าง fail บ้าง = confirmed flaky — บันทึกรอบที่ fail
3. รัน ด้วย shuffled order ถ้า runner รองรับ — variance จาก order → `## Check: Test Isolation`

#### 4. Report

> Goal: รายงาน flaky list พร้อม severity

1. ทำ `/report` ตาราง: `No.`, `Test`, `Flaky Signal` (variance/retry-masked/timing), `Severity`, `Fix`
2. Confirmed flaky (observed variance) → Critical; timing patterns ที่ยังไม่ observed → Warning; retry config → Info
3. แนะนำ fix path: แยก state → `## Check: Test Isolation`; assertions → `/update-tests`

### Rules

- Read-only — ไม่แก้ tests/config ใน skill นี้
- ยืนยันด้วย re-run ก่อน mark flaky — ห้ามตีป้ายจาก code pattern อย่างเดียว (pattern = suspect, variance = confirmed)
- ทุก finding ต้องมี evidence (รอบที่ fail หรือ config line)
- ใช้ `## Check: Flaky Tests` ถ้าจำเป็น · ใช้ `## Check: Flaky Tests` ถ้าจำเป็น · ใช้ /suggest-next-action ถ้าจำเป็น

### Expected Outcome

- Confirmed flaky tests ถูกระบุพร้อม evidence (รอบ fail)
- Retry masking + timing patterns ถูก report แยกจาก observed flakiness
- Fix path ชัดเจนต่อ finding

## Check: Test Isolation

### Goal

ตรวจหา tests ที่ไม่ isolated — พึ่งลำดับการรัน, shared mutable state, external resources ร่วมกัน หรือ leak state ข้าม test — สาเหตุหลักของ flaky tests

### Scope

- ตรวจ test files: unit, integration, e2e ตาม runner ที่ใช้ (Vitest, Jest, Playwright, Cargo, go test)
- ครอบคลุม: shared globals, missing cleanup, order dependencies, port/resource conflicts, DB state ร่วม, env mutations ที่ไม่ restore
- Read-only: รายงาน violations — แก้ผ่าน `## Check: Test Isolation` หรือ `/update-tests`

### Execute

#### 1. Scan For Shared State

> Goal: หา state ที่ tests แชร์กัน

1. ใช้ `use-astgrep` หา: module-level mutable variables, shared fixtures ที่ถูก mutate, singleton patterns ใน tests
2. หา `beforeAll` ที่ setup state แต่ไม่มี `afterAll`/`afterEach` cleanup
3. หา `process.env` mutations ที่ไม่ restore, `vi.spyOn`/`jest.spyOn` ที่ไม่ `restore()`

#### 2. Detect Order Dependencies

> Goal: หา tests ที่พึ่งลำดับ

1. หา sequential patterns: test B อ่านค่าที่ test A สร้าง (comment hints, shared ids, `test.serial` chains)
2. หา describe-level state ที่ tests ในกลุ่มพึ่งกัน
3. flag `test.only`, `test.skip` ที่ค้าง — บิดสถิติ isolation

#### 3. Detect Resource Conflicts

> Goal: หา shared resources ที่ชนกันเมื่อ parallel

1. fixed ports, fixed file paths (`tmp/test.db`), fixed DB schemas ที่ tests ใช้ร่วม
2. global mocks ที่ leak ข้าม test files
3. clock/time mocks ที่ไม่ reset

#### 4. Verify With Shuffle/Repeat

> Goal: พิสูจน์ด้วยการรันจริงถ้าเป็นไปได้

1. รัน suite ด้วย random order (`--sequence.shuffle`, `--random`) ถ้า runner รองรับ
2. รัน test file เดียวซ้ำหลายรอบ — ดู deterministic ไหม
3. เก็บ failures ที่เกิดเฉพาะตอน shuffled = order dependency evidence

#### 5. Report

> Goal: สรุป isolation violations

1. ใช้ `/report` คอลัมน์: `No.`, `Test/File`, `Violation Type`, `Shared Resource`, `Severity`, `Fix`
2. Severity: `high` (proven flaky จาก shuffle run), `medium` (shared state pattern), `low` (potential risk)
3. แนะนำ: per-test fixtures, `beforeEach` cleanup, dynamic ports, isolated DB per test

### Rules

#### 1. Evidence-Based

- pattern findings จาก code + ยืนยันด้วย shuffle runs เมื่อทำได้
- ระบุ shared resource ที่ชัดเจน ไม่ใช่เดา

#### 2. Read-Only

- ไม่แก้ tests — รายงานให้ `## Check: Test Isolation`/`/update-tests` แก้
- shuffle run ไม่แก้ผลการทดสอบจริง — แค่เผยปัญหา

#### 3. Runner Aware

- isolation semantics ต่างกัน: Vitest isolate per file by default, Jest sandbox, Playwright workers — ตรวจตาม runner จริง
- บาง shared setup ตั้งใจ (DB container ร่วม) — แยก "intentional shared infra" จาก "accidental shared state"

### Expected Outcome

- รายการ isolation violations พร้อมประเภทและ severity
- Shuffle-run evidence ถ้าทำได้
- คำแนะนำ isolation fixes ต่อ pattern

## Check: Test Quality


### Goal

สแกน test files หา "dishonest tests" — tests ที่ผ่านแต่ไม่ได้ทดสอบ behavior — เช่น ไม่มี assertion, import-only smoke, `.skip`/`.only` ค้าง, tautological assertions — เพื่อป้องกัน coverage ที่สูงแต่ไร้ค่า

### Scope

- ครอบคลุม test files ทุก runner (Vitest, Jest, Bun, pytest, go test, cargo test)
- Read-only: หา violations + report — แก้ผ่าน `/update-tests` หรือ `## Check: Test Quality`

### Execute

#### 1. Scan For Missing Assertions

> Goal: หา tests ที่ไม่ assert อะไรเลย

1. ใช้ `/use-astgrep` หรือ grep หา `it(`/`test(`/`test_`/`func Test` blocks ที่ไม่มี `expect`/`assert`/`require`/snapshot call ข้างใน
2. หา try/catch ใน test ที่ swallow error โดยไม่ assert
3. หา test bodies ว่างเปล่าหรือ comment-only

#### 2. Scan For Disabled Tests

> Goal: หา tests ที่ถูกปิดทิ้ง

1. หา `.skip`, `.only`, `xit`, `xtest`, `test.todo`, `#[ignore]`, `@pytest.mark.skip` ที่ค้างอยู่
2. `.only` ที่ commit ค้าง = suite ถูกลดขนาดเงียบๆ — severity Critical
3. `.skip` ที่มี comment เหตุผล + issue link → Info; ไม่มีเหตุผล → Warning

#### 3. Scan For Weak Patterns

> Goal: หา assertions ที่ไม่ได้ทดสอบอะไรจริง

1. Tautological: `expect(true).toBe(true)`, `assertTrue(true)`, `expect(x).toBeDefined()` บน literal
2. Import-only smoke: file ที่แค่ `import` แล้ว assert defined — ไม่นับเป็น logic coverage
3. Snapshot-only tests ที่ snapshot ทั้งหน้าโดยไม่มี targeted assertion
4. Mock ที่ return ค่าที่ test assert — circular, ไม่ได้ทดสอบ source

#### 4. Report

> Goal: รายงาน violations พร้อม severity

1. ทำ `/report` ตาราง: `No.`, `Test/File`, `Violation`, `Severity` (Critical/Warning/Info), `Fix`
2. Critical (`.only` ค้าง, tests ไม่มี assertion เลย) → แนะนำ `/update-tests` หรือ `/resolve-errors`
3. ถ้าไม่พบปัญหา → report "no issues found"

### Rules

- Read-only — ไม่แก้ test files ใน skill นี้
- ทุก finding ต้องมี file + line + recommendation
- กรอง false positives: test helpers, fixture files, `.skip` ที่มีเหตุผลชัดเจน
- ใช้ `## Check: Test Quality` ถ้าจำเป็น · ใช้ /suggest-next-action ถ้าจำเป็น

### Expected Outcome

- Dishonest/disabled tests ถูกระบุพร้อม file:line + severity + fix recommendation
- ไม่มี false positives — ทุก finding audit ได้

## Check: Coverage Config

### Goal

ตรวจ coverage configuration ให้ซื่อสัตย์ — thresholds ตั้งไว้และบังคับจริง, include/exclude ครอบทุก source ที่ตั้งใจ, raw reporter มีครบ — เพราะ coverage illusion เกิดจาก config ไม่ใช่ตัวเลข

### Scope

- ครอบคลุม coverage configs: Vitest (`coverage.v8`/`istanbul`), Jest (`collectCoverage*`), `nyc`/`.nycrc`, `coverage.py`, `cargo-llvm-cov`, codecov/coveralls config
- Read-only: ตรวจ config + report — แก้ผ่าน `/update-tests` หรือ edit config แยก

### Execute

#### 1. Locate Coverage Config

> Goal: หา config จริงที่ coverage ใช้

1. ตรวจ `vitest.config.*` (test.coverage block), `jest.config.*` (collectCoverage*, coverageThreshold), `.nycrc`, `pyproject.toml`/`tox.ini` (coverage), `.cargo/config.toml`, CI workflow coverage steps
2. ถ้าไม่มี coverage config เลย → finding: suite วัดไม่ได้ ต้องตั้งค่าก่อน — report แล้วจบ

#### 2. Verify Thresholds Enforced

> Goal: thresholds บังคับผ่าน/ไม่ผ่านจริง ไม่ใช่แค่แสดงผล

1. ตรวจ `thresholds`/`coverageThreshold` มี statements/functions/branches/lines ครบ
2. ตรวจ CI fails เมื่อต่ำกว่า threshold — มี `--coverage.thresholds` หรือ exit-code enforcement ไม่ใช่แค่ print
3. threshold = 0 หรือไม่มี → Warning: ตัวเลขถูกวัดแต่ไม่บังคับ

#### 3. Verify Include/Exclude Integrity

> Goal: ไม่มี source หลุดจากการวัดเงียบๆ

1. เทียบ `include`/`collectCoverageFrom` กับ source dirs จริง (`git ls-files` src tree) — ไฟล์/dir ที่ไม่อยู่ใน include = blind spot
2. ตรวจ `exclude` ไม่ swallow source จริง — exclude ควรจำกัดเฉพาะ tests, generated, type-only, entrypoints ที่เหตุผลชัด
3. ระวัง `all: false`/`allFiles: false` ที่ทำให้ไฟล์ที่ไม่ถูก import หายจาก report ทั้งไฟล์

#### 4. Verify Raw Reporter Output

> Goal: มี machine-readable output สำหรับ audit

1. ตรวจ reporters มี `json`/`lcov` ไม่ใช่แค่ `text`/`html` — summary table เดียว audit ไม่ได้
2. ตรวจ output path ไม่ collide กับ source และไม่ถูก commit ผิดที่

#### 5. Report

> Goal: รายงาน config issues พร้อม severity

1. ทำ `/report` ตาราง: `No.`, `Config`, `Issue`, `Severity` (Critical/Warning/Info), `Fix`
2. Critical: ไม่มี threshold enforcement, source หลุด include; Warning: reporter ไม่ครบ, exclude กว้าง
3. เสร็จ → แนะนำ `/run-test-coverage` วัดจริงบน config ที่ถูกต้อง

### Rules

- Read-only — ไม่แก้ config ใน skill นี้
- ทุก finding ต้องชี้ไฟล์ config + key ที่ผิด
- ไม่ flag exclusions ที่มีเหตุผลชัดเจน (comment/docs บันทึกไว้)
- ใช้ /run-test-coverage ถ้าจำเป็น · ใช้ `## Check: Coverage Config` coverage ถ้าจำเป็น · ใช้ /suggest-next-action ถ้าจำเป็น

### Expected Outcome

- Coverage config ผ่าน audit: thresholds บังคับ, include ครบ, raw reporter มี
- Blind spots (ไฟล์หลุดการวัด) ถูกระบุชัดเจน
- พร้อมให้ `/run-test-coverage` วัดตัวเลขที่เชื่อถือได้

## Check: Types Coverage

### Goal

วัดระดับ type safety ของ TypeScript codebase โดยนับ `any`, `@ts-ignore`, `@ts-expect-error`, `as` casts และ non-null assertions เพื่อหาไฟล์/โมดูลที่ type อ่อน

### Scope

- ตรวจไฟล์ `*.ts`, `*.tsx` (ข้าม `*.d.ts` ของ dependencies และ generated files)
- ตัวชี้วัด: `any`, `unknown` ที่ไม่ narrowing, `@ts-ignore`, `@ts-expect-error`, `as <type>` cast, `!` non-null assertion, `Function`/`object` types
- Read-only: รายงานสถิติและจุดที่ควรแก้ — ไม่แก้ไข code

### Execute

#### 1. Scan Weak Types

> Goal: นับ weak type patterns ทั้ง project

1. ใช้ `use-astgrep` หรือ `search-files-patterns` ค้นหา patterns:
   - `: any`, `<any>`, `as any`, `Array<any>`
   - `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`
   - non-null assertion `foo!.bar`
   - `as <ConcreteType>` casts (ยกเว้น `as const`)
2. นับจำนวนต่อไฟล์และต่อ directory
3. ถ้า project มี `typescript-coverage-report` หรือ `type-coverage` ใน devDeps ให้รันเพื่อได้ % coverage จริง

#### 2. Score Per Module

> Goal: จัดอันดับไฟล์/โมดูลที่ type อ่อนที่สุด

1. คำนวณ weak-type density = weak patterns / lines of code ต่อไฟล์
2. จัดกลุ่มตาม directory/feature
3. flag ไฟล์ที่มี `@ts-nocheck` (ปิด type check ทั้งไฟล์) เป็น critical

#### 3. Check Config Strictness

> Goal: ตรวจ tsconfig ว่าเปิด strict ครบ

1. อ่าน `tsconfig.json` ทุกไฟล์ใน project
2. ตรวจ `strict`, `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
3. flag flag ที่ปิดหรือ override ใน sub-config

#### 4. Report

> Goal: รายงาน coverage และ priority fixes

1. ใช้ `/report` คอลัมน์: `No.`, `File/Module`, `Weak Patterns`, `Density`, `Severity`, `Suggestion`
2. สรุป overall type coverage % และ weak pattern totals
3. แนะนำ quick wins (ไฟล์ที่แก้น้อยแต่ได้ coverage เยอะ)

### Rules

#### 1. Evidence-Based

- ทุก finding ต้องมี file path + line number
- แยก `any` ที่จำเป็น (เช่น third-party boundary) ออกจาก `any` ที่แก้ได้

#### 2. Context Aware

- ข้าม test files, generated code, และ declaration files จากการนับ density
- `@ts-expect-error` ที่มี comment อธิบาย = severity ต่ำกว่าที่ไม่มี

#### 3. Read-Only

- ไม่แก้ code — ถ้าต้องการแก้ให้ทำ `/deep-review-then-fix` หรือ `/refactor`
- ใช้ /deep-test coverage ถ้าจำเป็น
- ใช้ /run-typecheck ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น


### Expected Outcome

- Type coverage % และจำนวน weak patterns แยกตามชนิด
- ตารางไฟล์/โมดูลที่ type อ่อนที่สุดพร้อม severity
- tsconfig strictness gaps พร้อมคำแนะนำ

## Check: Error Coverage

### Goal

ตรวจ error handling coverage — หา errors ที่ถูก throw/reject แต่ไม่มี catch ที่จับ, catch blocks ที่ swallow errors เงียบๆ, และ error paths ที่ไม่มี test

### Scope

- ตรวจ `throw`, `Promise.reject`, `Result.err` และ call sites ของ fallible functions
- ตรวจ `catch` blocks: empty catch, catch ที่ไม่ rethrow/log, catch ที่ return default เงียบๆ
- ตรวจ async error paths: unhandled rejection, missing `.catch()`, `await` ที่ไม่อยู่ใน try
- Read-only: รายงาน gaps — แก้ไขผ่าน `/review-stability`

### Execute

#### 1. Map Error Sources

> Goal: หาจุดที่ errors เกิดทั้งหมด

1. ใช้ `use-astgrep` ค้นหา `throw`, `Promise.reject`, `new Error`, custom error classes
2. หา fallible boundaries: API calls, file I/O, parsing, DB queries, external services
3. จัดกลุ่มตาม module/layer

#### 2. Trace Error Paths

> Goal: ตรวจว่าแต่ละ error ถูกจัดการหรือไม่

1. ตรวจ call sites ของ fallible functions — มี try/catch หรือ `.catch()` ครอบไหม
2. สำหรับ async: ตรวจ floating promises และ missing `await` (ทำ `/review-backend` ร่วม)
3. ตรวจ top-level handlers: Express error middleware, Elysia `onError`, global `unhandledRejection`
4. flag errors ที่ propagate ขึ้นไปแต่ไม่มี handler ปลายทาง

#### 3. Detect Swallowed Errors

> Goal: หา catch ที่กลืน error เงียบๆ

1. flag empty catch blocks `catch {}` หรือ `catch (e) {}`
2. flag catch ที่ comment `// ignore` โดยไม่ log หรือ metric
3. flag catch ที่ return `null`/`[]`/`false` เงียบๆ ทำให้ caller ไม่รู้ว่า fail
4. ข้าม intentional swallow ที่มี comment อธิบายเหตุผล

#### 4. Check Test Coverage Of Error Paths

> Goal: ตรวจว่า error paths มี test ครอบคลุม

1. เทียบ error branches กับ test files — มี test ที่ trigger error นั้นไหม
2. flag critical error paths (auth, payment, data loss) ที่ไม่มี test
3. ทำ `/run-test` หรือ `/deep-test coverage` ถ้าต้องการตัวเลขจริง

#### 5. Report

> Goal: สรุป coverage gaps พร้อม severity

1. ใช้ `/report` คอลัมน์: `No.`, `Location`, `Issue Type`, `Error`, `Severity`, `Fix`
2. Issue types: `unhandled`, `swallowed`, `untested`, `no-top-level-handler`
3. แนะนำ `/review-stability` สำหรับ remediation

### Rules

#### 1. Evidence-Based

- ทุก finding ต้องมี file:line และ error path ที่ trace ได้
- ไม่ flag theoretical paths — เฉพาะที่ reachable จริง

#### 2. Read-Only

- ไม่แก้ error handling — รายงานแล้วทำ `/review-stability`

#### 3. Context Aware

- Background jobs/event handlers อาจตั้งใจให้ fail silently + retry — ตรวจ context ก่อน flag
- Library code อาจ throw ให้ consumer จัดการ — ตรวจว่าเป็น intentional API design

### Expected Outcome

- รายการ unhandled/swallowed errors พร้อมตำแหน่งและ severity
- Error paths ที่ไม่มี test coverage
- สรุป % coverage และ prioritized fix list

## Domain Checks

> Goal: เลือกทำเฉพาะ dimension ที่ตรง scope arg

| Scope | Section |
|-------|---------|
| `flaky-tests` | `## Check: Flaky Tests` |
| `test-isolation` | `## Check: Test Isolation` |
| `test-quality` | `## Check: Test Quality` |
| `coverage-config` | `## Check: Coverage Config` |
| `types-coverage` | `## Check: Types Coverage` |
| `error-coverage` | `## Check: Error Coverage` |
| `test-correctness`, `correctness` | `/check-test-correctness` — verify assertions ตรง spec, mocks ตรง API จริง, ไม่มี vacuous tests |

## Rules

1. Review Only: ทำ review strategy และผลลัพธ์เท่านั้น ไม่แก้ไข source/test code ระหว่าง review — ถ้าต้องเขียน/แก้ tests ใช้ `update-tests`, ถ้าต้องแก้ source ใช้ `deep-debug` หรือ `resolve-errors`, ถ้าต้องแก้ config ใช้ `update-config`
2. Evidence-Based Findings: ทุก finding ต้องมี evidence จาก test output หรือ coverage report — ระบุ file path, test name, line number (ถ้ามี), ใช้ `Grep`, `scan-codebase`, `jq` หรือ `grep` ดึงข้อมูลจาก output ไฟล์, จัดลำดับตาม severity: Critical → High → Medium → Low
3. Scoring: คะแนนต่อ category ผ่าน = 1, เตือน = 0.5, ไม่ผ่าน = 0 — test quality score = (total score / total categories) × 100% — Grade A (90+), B (80+), C (70+), D (60+), F (<60) — Score < 70 → แนะนำให้เขียน tests เพิ่มก่อน run
4. Skill Update Discipline: ใช้ `/update-devin-global-skills` เฉพาะเมื่อ test result พบ gap ใน skill ที่มีอยู่จริง — ไม่อัปเดต skill เพียงเพราะ project test fail ปกติ — บันทึกหมายเหตุ/เหตุผลก่อน update skill
5. Safety: ไม่ expose secrets จาก test output หรือ coverage report — ไม่รัน destructive commands ระหว่าง review — ทำ dry run ถ้าต้อง re-run tests เพื่อ verify flakiness
6. Formatting: ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis — ใช้ heading levels สำหรับ structure — รายงานเป็นตารางด้วย `/report`

- ใช้ /deep-validate ถ้าจำเป็น
- ใช้ /check-reference ถ้าจำเป็น

- ใช้ /review-code-quality ถ้าจำเป็น
- ใช้ /review-stability ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps

1. baseline: coverage, suite duration, flaky list (รันเป้าหมายซ้ำ ~10 รอบ + random order), ทำ `## Check: Test Isolation` — root cause ไม่ชัด → `/deep-debug` ห้ามแก้ตาม symptom
2. flaky/isolation: per-test setup/teardown reset state, unique ports/temp dirs/test DB ต่อ worker — timing: condition-based waits แทน sleep, fake timers/seeded RNG, pin timezone — assertions: matchers ยืดหยุ่นสำหรับ dynamic values, ห้าม assert timestamps/random ids — แก้ไม่ทัน → quarantine พร้อม ticket ห้าม mask ด้วย retries
3. coverage gaps: critical paths ก่อน — `/update-tests` เขียน test ใหม่
4. quality: specific assertions, minimal mocks, merge duplicates
5. verify: `/run-test-all` ผ่าน 3 รอบติดทุกลำดับ + parallel, coverage delta — preserve coverage tests ที่แก้ต้องตรวจ behavior เดิม
## References

- [Full-dimension checklist](references/checklist.md)
- [Coverage gaps](references/coverage-gaps.md)
- [Edge cases](references/edge-cases.md)
- [Test isolation](references/test-isolation.md)
- [Test pyramid](references/test-pyramid.md)
- [Regression coverage](references/regression-coverage.md)
- [Analyze coverage and flaky](references/analyze-coverage-flaky.md)
- [Test quality score](references/test-quality-score.md)
- ใช้ /run-review ถ้าจำเป็น
- ใช้ /review-coverage ถ้าจำเป็น

## Expected Outcome

- รายงาน Test Quality Summary พร้อม score, grade และ progress bar
- รายงาน Coverage Gap Report พร้อม priority
- รายงาน Edge Case Gaps พร้อม action required
- หลัง run tests ได้ผลลัพธ์ทีสมบูรณ์: failures, coverage, flaky
- รายการ action ถัดไปเรียงตาม priority
- Coverage delta report เปรียบเทียบกับ target
- Flaky test report ถ้ามี
- Skill ทีเกี่ยวข้องถูกอัปเดตผ่าน `/update-devin-global-skills` เมื่อจำเป็น
- `/suggest-next-action` แนะนำขั้นตอนถัดไปชัดเจน
