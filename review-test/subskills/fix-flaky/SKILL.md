---
name: review-test-fix-flaky
description: Fix flaky tests — isolation, timing, order dependency, deterministic assertions
argument-hint: "[scope-or-findings]"
related:
  - review-test
  - check-test-isolation
  - run-test-all
  - run-test

  - update-tests
  - deep-debug
  - report-before-after
  - report
  - resolve-errors
---

## Goal

แก้ flaky test findings จาก `/review-test` — tests ที่ pass/fail ไม่ consistent จาก shared state, timing dependency, order dependency หรือ non-deterministic assertions — ให้ suite deterministic

## Scope

- ครอบคลุม: test isolation, shared state/port conflicts, timing-dependent code, order dependence, non-deterministic values, real I/O ใน tests, cleanup ขาด
- ไม่ครอบคลุม coverage gaps → ใช้ `subskills/improve-coverage/SKILL.md` และ suite speed โดยรวม → ดู `references/fix-optimize-tests.md`
- อ้าง isolation criteria: `references/test-isolation.md`

## Execute

### 1. Reproduce And Classify

> Goal: ยืนยัน flaky จริงและระบุ root cause category

1. รวบรวม flaky list จาก `/review-test` report — ถ้าไม่มี → ทำ `/review-test` ก่อน
2. รัน test เป้าหมายซ้ำหลายรอบ (เช่น 10 ครั้ง) และรันแบบ random order ถ้า runner รองรับ
3. จัดหมวด root cause: shared state, timing, order dependency, external I/O, non-deterministic data
4. ถ้า root cause ไม่ชัด → `/deep-debug` ก่อนแก้ ห้ามเดา

### 2. Fix Isolation And Shared State

> Goal: tests รันอิสระไม่แชร์ state

1. เพิ่ม per-test setup/teardown (`beforeEach`/`afterEach` หรือ equivalent) — reset DB, files, mocks, env
2. แยก shared resources: unique ports, temp dirs, test DB ต่อ worker/file
3. แก้ test interdependence — test ต้องรันเดี่ยวหรือสุ่มลำดับแล้วผ่าน
4. ทำ `/check-test-isolation` ยืนยัน isolation หลังแก้

### 3. Fix Timing And Order Dependency

> Goal: ไม่พึ่งเวลาหรือลำดับจริง

1. แทน fixed delays (`sleep`, `setTimeout` รอดิบ) ด้วย condition-based waits (`waitFor`, polling, assertions retry ของ runner)
2. ใช้ fake timers/mocked clock สำหรับ time-dependent logic — seed RNG ที่ใช้ใน tests
3. แก้ timezone/locale-sensitive assertions — pin timezone ใน test setup
4. แทน real network/DB/filesystem ด้วย mocks หรือ in-memory equivalents ถ้าเป็นสาเหตุ flake

### 4. Fix Non-Deterministic Assertions

> Goal: assertions ตรวจ behavior ไม่ใช่ค่าสุ่ม

1. ใช้ matchers ที่ยืดหยุ่นสำหรับ dynamic values (`expect.any(Date)`, `expect.objectContaining`, pattern matching)
2. ห้าม assert ค่า timestamp, random id, ordering ที่ไม่ guarantee — หรือ fix seed/sort ก่อน assert
3. ถ้าแก้ไม่ทันในรอบนี้ → quarantine test พร้อม ticket/note ชัดเจน อย่า mask ด้วย retries

### 5. Verify Stability

> Goal: suite deterministic — ผ่านซ้ำได้

1. รัน `/run-test-all` หรือ suite ที่เกี่ยวข้อง 3 รอบติด — ต้องผ่านทุกรอบ
2. รันแบบ random order/parallel ยืนยันไม่มี shared state/port conflicts
3. ทำ `/run-test` ยืนยัน coverage ไม่ลด — เทียบ flake rate ด้วย `/report-before-after`

## Rules

- ต้องยืนยัน root cause ก่อนแก้ — ห้ามแก้ตาม symptom หรือเพิ่ม retry/timeout เพื่อซ่อน flake
- ห้ามลบหรือ skip tests เพื่อให้ผ่านโดยไม่บอก user — quarantine ต้องมีเหตุผลและติดตามได้
- Preserve coverage — tests ที่แก้ต้องยังตรวจ behavior เดิม
- Parallelization ต้องไม่สร้าง flake ใหม่ — ตรวจ shared state/port conflicts
- ถ้า check ไม่ผ่าน → `/resolve-errors` สูงสุด 3 รอบแล้ว report

## Expected Outcome

- Flaky tests กลายเป็น deterministic — ผ่านซ้ำ 3 รอบติดทุกลำดับ
- Root causes (isolation, timing, order, non-determinism) ถูกแก้ที่ต้นทาง
- Coverage และ test count ไม่ลด — รายงาน flake rate before/after ผ่าน `/report`

