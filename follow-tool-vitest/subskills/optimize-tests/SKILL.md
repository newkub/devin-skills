---
name: follow-tool-vitest-optimize-tests
description: ปรับ Vitest test performance — isolation, pool options, sharding, watch excludes
argument-hint: "[scope]"
related:
  - follow-tool-vitest
  - run-test
  - run-bench
  - deep-optimize
  - check-bottlenecks
---

## Goal

ลดเวลารัน test suite ของ Vitest — วัด baseline ก่อน แก้ทีละจุดตาม impact แล้ววัดซ้ำ

## Scope

- Optimize test execution time: isolation, worker pool, sharding, watch mode, coverage cost
- Preserve behavior — optimize ≠ เปลี่ยน test results
- ไม่ครอบคลุม: setup ครั้งแรก (`subskills/setup-vitest`)

## Execute

### 1. Baseline

> Goal: เก็บตัวเลขเดิมและระบุ bottleneck จริง

1. รัน `vitest run` พร้อมจับเวลา — เก็บ total duration, per-file duration
2. ทำ `/deep-optimize` หรือ `/check-bottlenecks` — ระบุว่าช้าจาก isolation, coverage, heavy setup หรือ test จริง
3. เช็ค `--reporter` ที่ให้ per-file timing แล้วหาไฟล์ที่ช้าสุดก่อน — ห้ามเดา

### 2. Tune Isolation And Pool

> Goal: ลด overhead จาก isolation และ worker pool

1. ตั้ง `test.isolate: false` ถ้า tests ไม่แชร์ state ข้ามกัน — เร็วขึ้นมากแต่ต้องมั่นใจว่า tests independent
2. ตั้ง `test.pool` — `forks` (default, เสถียร) หรือ `threads`; ลอง `vmForks`/`vmThreads` เฉพาะเมื่อต้องการ
3. ตั้ง `maxWorkers`/`minWorkers` ให้สอดคล้อง CPU cores — Vitest 4+ ใช้ top-level options ไม่ใช่ `poolOptions`
4. เช็ค test ที่ rely บน shared module state — ถ้า isolate ปิดแล้วพัง ให้แก้ test ไม่ใช่เปิด isolate กลับทันที

### 3. Shard And Scope Runs

> Goal: แบ่งงานข้าม machines และจำกัด scope ที่รัน

1. CI หลาย machines → `vitest run --shard=<index>/<total>` แบ่ง tests ออกเป็น shards
2. PR checks → `vitest related` หรือ `--changed` รันเฉพาะ tests ที่กระทบจาก changed files
3. ตั้ง `retry` เฉพาะใน CI config — ไม่ใช้แก้ flaky tests ถาวร

### 4. Reduce Watch And Coverage Overhead

> Goal: ลดงานที่ไม่จำเป็นใน watch mode และ coverage

1. ตั้ง `test.watchExclude` (default ครอบ `node_modules`/`dist` อยู่แล้ว) ให้ข้าม generated/build dirs เพิ่ม — ดู official docs สำหรับ option ล่าสุด
2. ปิด coverage ใน watch/dev — รัน `--coverage` เฉพาะ CI หรือเมื่อต้องการ
3. ตั้ง `coverage.include` แคบลงเฉพาะ source dirs — ลดเวลา instrument
4. ปิด `typecheck.enabled` ใน dev run ถ้าไม่จำเป็น — รันแยก script

### 5. Measure And Compare

> Goal: วัดซ้ำและ compare กับ baseline

1. รัน `vitest run` ซ้ำหลังแก้แต่ละจุด — compare duration กับ baseline
2. ทำ `/report-before-after` รายงานตัวเลขก่อน/หลังต่อ optimization
3. ถ้าไม่ดีขึ้นหรือ tests เริ่ม flaky → revert จุดนั้นแล้ว report

## Rules

- Baseline ก่อนเสมอ — ห้าม optimize โดยไม่มีตัวเลขเดิม
- แก้ทีละจุดและวัดแยก — ห้ามแก้หลายจุดพร้อมกันถ้าแยกผลไม่ได้
- `isolate: false` เสี่ยง — ต้อง verify ว่า tests ไม่แชร์ state ก่อน
- Shards ทุกตัวต้องรันด้วย args เดียวกัน — ผลรวมถึงจะถูก
- Optimize ต้องไม่เปลี่ยน test outcomes — suite ต้องเขียวเหมือนเดิม

## Expected Outcome

- Test suite เร็วขึ้นโดยวัดได้จาก baseline
- Config tuned: isolation, pool, sharding, watch excludes ตามความเหมาะสม
- Tests ยัง deterministic และเขียวทั้งหมด
