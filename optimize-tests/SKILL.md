---
name: optimize-tests
description: ลดเวลารัน test suite ด้วย parallelization, sharding และการตัดงานหนักซ้ำซ้อน
argument-hint: "[suite-or-path]"
related:
  - run-test-all
  - follow-tool-vitest
  - follow-tool-nextest
  - run-test-coverage
  - check-bottlenecks
  - improve-test-everything
  - report-before-after
  - check-test-isolation
---

## Goal

วิเคราะห์และลดเวลารัน test suite — parallelization, sharding, shared setup, ตัด I/O ที่ไม่จำเป็น และเลือก test scope ให้เหมาะ

## Scope

- ตรวจ test runners: Vitest, Jest, Playwright, Cargo nextest, go test, pytest
- ครอบคลุม: slow tests, duplicated setup, sequential runs, heavy fixtures, real I/O/network ใน tests, coverage ที่ทำให้ช้า
- Action-oriented: แก้ test config/code จริง — วัดเวลาก่อนหลัง

## Execute

### 1. Measure Baseline

> Goal: จับเวลา test suite แยกตาม file/test

1. รัน `/run-test-all` พร้อม reporter ที่แสดง slowest tests (`vitest --reporter=verbose`, `jest --verbose`, nextest timings)
2. บันทึก: total time, slowest N tests, setup/teardown overhead
3. ดู test count vs time — หา tests ที่ช้าผิดปกติ

### 2. Find Slow Causes

> Goal: วิเคราะห์สาเหตุที่ช้า

1. flag: `sleep`/`setTimeout`/`waitFor` ที่ใช้ fixed delays แทน polling/conditions
2. flag: real network/DB/filesystem ใน tests ที่ mock ได้ (`/implement-mock`, `/follow-tool-msw`)
3. flag: setup ที่สร้างทั้ง app/DB ต่อ test file ทั้งที่ share ได้
4. flag: tests รัน sequential ทั้งที่ parallel ได้ (ไม่มี shared state)
5. flag: coverage instrumentation ที่เปิดตลอดทั้งที่ใช้เฉพาะ CI

### 3. Apply Optimizations

> Goal: แก้ตาม impact

1. **Parallelism**: เพิ่ม workers/threads (`vitest --maxWorkers`, `--test-threads`, nextest default parallel)
2. **Sharding**: แบ่ง suite ใน CI (`--shard=n/m`, matrix ต่อ test group) — ทำ `/optimize-ci` ร่วม
3. **Shared setup**: ใช้ global setup / per-file fixtures แทน per-test rebuild
4. **Mock I/O**: แทน real network/DB ด้วย mocks หรือ in-memory equivalents
5. **Smart scope**: `--changed`, `--related`, affected-only ใน monorepo
6. **Retry/flake**: flag tests ที่ flaky — อย่าเพิ่ม retry เพื่อซ่อนปัญหา

### 4. Verify

> Goal: ยืนยัน tests ยังครอบคลุมและผ่าน

1. รัน suite ซ้ำ — ผล pass/fail ต้องเหมือนเดิม ไม่มี tests หาย
2. เทียบเวลา before/after ด้วย `/report-before-after`
3. `/run-test-coverage` เพื่อยืนยัน coverage ไม่ลด

## Rules

### 1. Measure First

- ต้องมี timing baseline — รายงานตัวเลขจริง ไม่ใช่คาดเดา
- ห้ามลบหรือ skip tests เพื่อให้เร็วขึ้นโดยไม่บอก user

### 2. Preserve Coverage

- Test count และ coverage ต้องไม่ลดลง
- Tests ที่ถูกปรับต้องยังตรวจ behavior เดิม

### 3. Flake Aware

- Parallelization ต้องไม่สร้าง flaky tests — ตรวจ shared state/port conflicts
- ถ้าเจอ flaky ให้ report แยก อย่า mask ด้วย retries

## Expected Outcome

- Test suite เร็วขึ้นพร้อมตัวเลข before/after
- Slow tests และสาเหตุถูกระบุและแก้
- Coverage และ pass rate คงเดิม
