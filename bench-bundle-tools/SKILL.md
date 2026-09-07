---
name: bench-bundle-tools
description: Benchmark เทียบ bundlers บน project เดียวกัน — build time, output size และ features
argument-hint: "[tools-to-compare]"
related:
  - run-build
  - report-before-after
---

## Goal

เทียบ bundlers/build tools (Vite, Rolldown, esbuild, webpack, tsup, tsdown, Bun) บน project เดียวกัน — วัด build time, output size, dev startup และ feature parity เพื่อตัดสินใจย้ายหรืออยู่ต่อ

## Scope

- วัดบน project จริง ไม่ใช่ hello-world benchmark
- ครอบคลุม: cold build, warm/incremental build, dev server startup, HMR speed, output size, correctness
- Evidence-gathering: ผลลัพธ์คือข้อมูลประกอบการตัดสินใจ — migration จริงทำผ่าน `/relocation` หรือ task แยก

## Execute

### 1. Baseline Current Tool

> Goal: วัดตัวเลขของ tool ปัจจุบันก่อน

1. รัน `/run-build` จับเวลา: cold build, warm build, dev startup
2. บันทึก output size และ feature checklist ที่ใช้ (plugins, aliases, code splitting, assets)
3. บันทึก config complexity ปัจจุบัน (จำนวนบรรทัด, plugins)

### 2. Set Up Candidates

> Goal: ติดตั้ง candidate tools ใน isolated setup

1. ใช้ branch หรือ temp copy — ไม่แก้ main config จนกว่าจะตัดสินใจ
2. Port config ขั้นต่ำที่ทำให้ build ได้: entry, aliases, env, essential plugins
3. ระบุ features ที่ candidate ไม่รองรับ — บันทึกเป็น parity gap ไม่ใช่แพ้ทันที

### 3. Run Identical Measurements

> Goal: วัดทุก tool ด้วยเงื่อนไขเดียวกัน

1. Cold build: clean cache → build → จับเวลา (3 runs, median)
2. Warm build: rebuild โดยไม่เปลี่ยน code → จับเวลา
3. Dev startup: เริ่ม dev server → first ready (ถ้าเป็น app)
4. Output: total size, chunk count, เปรียบเทียบ correctness (app ทำงานจริงไหม)

### 4. Report Comparison

> Goal: สรุปตัวเลขและ trade-offs อย่างเป็นธรรม

1. ใช้ `/report-before-after` คอลัมน์: `No.`, `Metric`, `Current`, `Candidate A`, `Candidate B`, `Best`
2. เพิ่ม qualitative notes: plugin ecosystem, config complexity, parity gaps, migration effort
3. Verdict: `migrate`, `stay`, `inconclusive` พร้อมเหตุผล — ไม่ bias ไปที่ตัวเลขเดียว

## Rules

### 1. Fair And Real

- วัดบน project จริงด้วย config ที่ทำงานได้จริง — ไม่ใช่ config ที่ตั้งใจให้ช้า/เร็ว
- ระบุ parity gaps ชัดเจน — tool ที่เร็วกว่าแต่ทำ feature ไม่ครบไม่ใช่ผู้ชนะอัตโนมัติ

### 2. Reproducible

- เก็บ benchmark config และตัวเลขดิบ — ผลต้อง reproduce ได้
- ระบุ versions ของทุก tool และ hardware profile

### 3. Decision Support Only

- ไม่ migrate จริงใน skill นี้ — รายงานแล้วให้ user ตัดสินใจ
- ถ้า verdict = migrate → เสนอ migration plan แยก

## Expected Outcome

- ตารางเทียบ build metrics ข้าม tools บน project จริง
- Feature parity matrix และ migration effort estimate
- Recommendation ที่มี evidence รองรับ
