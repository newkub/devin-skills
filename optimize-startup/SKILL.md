---
name: optimize-startup
description: ลดเวลา startup ของ app/CLI ด้วย lazy loading, defer init และลดงานหนักตอน boot
argument-hint: "[entry-point]"
related:
  - run-profiler
  - check-bottlenecks
  - optimize-imports
  - run-dev
  - improve-performance
  - report-before-after
---

## Goal

วิเคราะห์และลด startup time ของ application หรือ CLI — defer งานหนัก, lazy-load modules, ลด synchronous I/O ตอน boot และ parallelize initialization

## Scope

- ครอบคลุม: CLI startup (time-to-first-output), server boot (time-to-ready), web app (time-to-interactive), desktop app launch
- ตรวจ: entry point, imports chain, init/config loading, connection setup, plugin registration
- Action-oriented: แก้ init path จริง — วัด startup ก่อนหลัง

## Execute

### 1. Measure Baseline

> Goal: จับ startup time แยกตาม phase

1. วัด end-to-end: `time <cmd>`, `Measure-Command`, หรือ timestamp logs
2. instrument boot phases: import time, config load, DB/service connect, route registration, ready
3. สำหรับ Node/CLI ใช้ `--cpu-prof`, `--import` timing หรือ tools เช่น `node --trace-event`

### 2. Map Boot Path

> Goal: หางานที่ block startup

1. trace import graph จาก entry — หา modules หนักที่ถูก load ตอน boot (`/optimize-imports` ร่วม)
2. flag: synchronous file/network I/O ตอน init (config read, probe calls)
3. flag: sequential awaits ของ independent init steps
4. flag: work ที่ทำตอน boot แต่ใช้ครั้งแรกช้ากว่านั้น (compile, preload data)

### 3. Apply Optimizations

> Goal: defer/parallelize ตาม impact

1. **Lazy load**: dynamic `import()` สำหรับ modules ที่ไม่จำเป็นตอน boot (routes, commands, plugins)
2. **Parallelize**: `Promise.all` สำหรับ independent init (DB + cache + config)
3. **Defer**: งานหนักเลื่อนไปทำหลัง ready (background warm-up) หรือตอนใช้จริง
4. **Cache**: precomputed artifacts, snapshot/compile cache (`--snapshot`, V8 compile cache)
5. **Trim imports**: ลด eager imports ของ lib หนักใน entry chain
6. สำหรับ CLI: ให้ help/version path ไม่ผ่าน heavy init

### 4. Verify

> Goal: ยืนยัน startup เร็วขึ้นและทำงานครบ

1. วัดซ้ำหลายครั้ง — ใช้ median เพื่อกัน noise
2. ทดสอบ critical paths ทำงานเหมือนเดิม (server ready, CLI commands)
3. ใช้ `/report-before-after` แสดง delta ต่อ phase

## Rules

### 1. Measure First

- ต้องมี baseline ก่อนแก้ — วัดหลายรอบเอา median
- ระบุ phase ที่เร็วขึ้น ไม่ใช่แค่ตัวเลขรวม

### 2. Preserve Behavior

- Readiness semantics ต้องเหมือนเดิม — ห้าม report "ready" ก่อน dependencies พร้อมจริง
- Lazy loading ต้องไม่ทำให้ first-use chậmเกินรับได้ — ระบุ trade-off ถ้ามี

### 3. Context Aware

- CLI ให้ optimize time-to-first-output; server ให้ optimize time-to-ready; UI ให้ optimize time-to-interactive
- Cold start (serverless) กับ warm start วัดต่างกัน — ระบุชัดเจน

## Expected Outcome

- Startup time ลดลงพร้อมตัวเลข per-phase before/after
- Boot path ที่ defer/lazy-load แล้ว
- ไม่มี behavior regression ใน readiness
