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
  - use-subagents
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
ทำตาม `subagents/test-reviewer/prepare.md` เพื่อเข้าใจ project structure, test framework, test config และ directory structure ก่อน review

### 2. Coverage

> Goal: ตรวจ coverage ครอบคลุม
ทำตาม `subagents/test-reviewer/coverage-gaps.md` เพื่อระบุ source files, functions, branches และ coverage categories ที่ยังไม่ถูก test

### 3. Edge Cases

> Goal: ตรวจ edge cases ครบ
ทำตาม `subagents/test-reviewer/edge-cases.md` เพื่อตรวจ happy path, error path, boundary values, validation และ security tests

### 4. Isolation

> Goal: ตรวจ test isolation
ทำตาม `subagents/test-reviewer/test-isolation.md` เพื่อตรวจ test isolation, cleanup, fixtures/factories, mock strategy และ flakiness

### 5. Pyramid

> Goal: ตรวจ test pyramid balance
ทำตาม `subagents/test-reviewer/test-pyramid.md` เพื่อตรวจ distribution unit/integration/e2e, performance targets, test types และ CI integration

### 6. Regression

> Goal: ตรวจ regression coverage
ทำตาม `subagents/test-reviewer/regression-coverage.md` เพื่อตรวจ regression tests สำหรับ bug fixes, critical paths, mutation testing และ CI pipeline

### 7. Pre-Run Score

> Goal: คำนวณ score ก่อน run
ทำตาม `subagents/test-reviewer/test-quality-score.md` เพื่อคำนวณ test quality score, grade และ go/no-go ก่อน run

### 8. Capture Output

> Goal: อ่าน test output
ทำตาม `subagents/test-reviewer/capture-output.md` เพื่ออ่าน stdout/stderr, บันทึกไฟล์ output, ตรวจ exit code และจัดหมวดหมู่ failure

### 9. Analyze Coverage/Flaky

> Goal: วิเคราะห์ coverage และ flaky
ทำตาม `subagents/test-reviewer/analyze-coverage-flaky.md` เพื่อเปรียบเทียบ coverage target, หา missing branches, รัน test ซ้ำ และตรวจ root cause ของ flaky

1. flaky quarantine policy — process + SLA สำหรับ flaky tests
2. mutation testing / contract tests ตามที่เหมาะ
3. coverage gates ใน CI — threshold enforce ไม่ใช่แค่ measure

### 10. Decide Actions

> Goal: สรุป action ถัดไป
ทำตาม `subagents/test-reviewer/decide-actions.md` เพื่อสรุป action ถัดไป, อัปเดต skill เมื่อพบ systemic gap และสร้างรายงาน

## Check: Flaky Tests
ทำตาม [subagents/test-reviewer/check-flaky-tests.md](subagents/test-reviewer/check-flaky-tests.md)

## Check: Test Isolation
ทำตาม [subagents/test-reviewer/check-test-isolation.md](subagents/test-reviewer/check-test-isolation.md)

## Check: Test Quality
ทำตาม [subagents/test-reviewer/check-test-quality.md](subagents/test-reviewer/check-test-quality.md)

## Check: Coverage Config
ทำตาม [subagents/test-reviewer/check-coverage-config.md](subagents/test-reviewer/check-coverage-config.md)

## Check: Types Coverage
ทำตาม [subagents/test-reviewer/check-types-coverage.md](subagents/test-reviewer/check-types-coverage.md)

## Check: Error Coverage
ทำตาม [subagents/test-reviewer/check-error-coverage.md](subagents/test-reviewer/check-error-coverage.md)

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

- [Full-dimension checklist](subagents/test-reviewer/checklist.md)
- [Coverage gaps](subagents/test-reviewer/coverage-gaps.md)
- [Edge cases](subagents/test-reviewer/edge-cases.md)
- [Test isolation](subagents/test-reviewer/test-isolation.md)
- [Test pyramid](subagents/test-reviewer/test-pyramid.md)
- [Regression coverage](subagents/test-reviewer/regression-coverage.md)
- [Analyze coverage and flaky](subagents/test-reviewer/analyze-coverage-flaky.md)
- [Test quality score](subagents/test-reviewer/test-quality-score.md)
- ใช้ /run-review ถ้าจำเป็น
- ใช้ /review-coverage ถ้าจำเป็น
- ใช้ /use-subagents ถ้าจำเป็น

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
