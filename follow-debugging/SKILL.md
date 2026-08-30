---
name: follow-debugging
description: หลักการ debug อย่างเป็นระบบ ตั้งแต่ reproduce ถึง fix และ prevent
related:
  - follow-math-propositional-logic
  - follow-math-boolean-algebra
  - follow-math-probability
  - follow-math-statistics
  - follow-math-numerical-methods
  - use-bun-shell
  - run-test
---

## Goal

ปฏิบัติตามหลักการ debug ที่เป็นระบบ เพื่อหา root cause ได้เร็วและแม่นยำ ลดการเดา และป้องกันปัญหาซ้ำ

## Scope

ใช้สำหรับทุก debugging session — runtime errors, test failures, build errors, deployment issues, performance problems

## Execute

### 1. Reproduce Consistently

> Goal: สร้าง reproduction case ที่ trigger ปัญหาได้สม่ำเสมอก่อนเริ่ม debug

1. สร้าง minimal reproduction case ที่ trigger ปัญหาได้ทุกครั้ง
2. ระบุ exact steps, input, environment ที่ทำให้เกิดปัญหา
3. ถ้า reproduce ไม่ได้ ให้เก็บ logs, screenshots, และ environment info ไว้ก่อน
4. ใช้ `/use-bun-shell` เพื่อรัน reproduction script ซ้ำจนกว่าจะ stable

### 2. Define Problem Clearly

> Goal: กำหนดปัญหาแบบ Expected vs Actual พร้อม scope และ impact ชัดเจน

1. เขียนปัญหาแบบ Expected vs Actual — สิ่งที่ควรเกิด vs สิ่งที่เกิดจริง
2. ระบุ scope: file, function, module, API endpoint, หรือ system level
3. ระบุ frequency: always, intermittent, หรือ under specific conditions
4. ระบุ impact: blocking, degraded, หรือ cosmetic

### 3. Gather Evidence

> Goal: เก็บ error messages, logs, และ context ที่เกี่ยวข้องทั้งหมด

1. เก็บ error messages, stack traces, และ logs ทั้งหมด
2. ใช้ `/run-test` เพื่อดูว่า tests ไหน fail
3. ตรวจสอบ recent changes ด้วย `git log` และ `git diff`
4. ตรวจสอบ environment: runtime version, dependencies, config
5. ถ้ามี monitoring ให้เก็บ metrics และ traces ด้วย

### 4. Form Hypotheses

> Goal: สร้างและจัดลำดับ hypotheses ตาม evidence ไม่ใช่ความรู้สึก

1. สร้าง 3-5 hypotheses ที่เป็นไปได้ — อ้างอิง evidence ไม่ใช่ความรู้สึก
2. จัดลำดับตาม probability และ ease of testing
3. ทำ `/deep-debug` เพื่อใช้ Bayesian approach ในการจัดลำดับ
4. เลือก top 1-2 hypotheses ที่ test ง่ายและมี probability สูงสุด

### 5. Test And Eliminate

> Goal: ทดสอบทีละ hypothesis เปลี่ยนทีละ variable เพื่อตัดที่ไม่ใช่

1. ทดสอบทีละ hypothesis — เปลี่ยนทีละ variable เท่านั้น
2. ใช้ `/use-bun-shell` เพื่อ execute test แต่ละ hypothesis
3. บันทึกผลลัพธ์ทุกครั้ง: pass, fail, หรือ inconclusive
4. ตัด hypothesis ที่ไม่ใช่ แล้วไปถัดไป
5. ถ้าทดสอบหมดแล้วไม่ตรง ให้กลับไปสร้าง hypotheses ใหม่

### 6. Isolate Root Cause

> Goal: ยืนยัน root cause ที่ reproduce ได้ แก้แล้วหาย ถอนแล้วกลับมา

1. ทำ `/analyze-root-cause-analysis` เพื่อวิเคราะห์หาสาเหตุหลัก
2. ใช้ 5 Whys เพื่อ trace จาก symptom ไป root cause
3. ยืนยัน root cause ด้วย 3 เงื่อนไข: reproduce ได้, fix แล้วหาย, กลับมาถ้าถอน fix
4. ตรวจสอบว่าไม่ใช่ symptom ของปัญหาที่ลึกกว่า

### 7. Fix And Verify

> Goal: แก้น้อยที่สุดที่จบ root cause แล้ว verify ว่าไม่ทำลายอย่างอื่น

1. ทำ `/resolve-errors` เพื่อแก้ไข error ที่พบ
2. แก้น้อยที่สุด — minimal change ที่แก้ root cause ไม่ใช่ symptom
3. ทำ `/run-test` เพื่อยืนยันว่า fix ใช้งานได้
4. ทดสอบว่า fix ไม่ทำลาย functionality อื่น
5. ทำ `/run-lint` และ `/run-typecheck` เพื่อตรวจสอบ code quality

### 8. Prevent Recurrence

> Goal: เพิ่ม test case และปรับปรุง debuggability เพื่อป้องกันปัญหาซ้ำ

1. เพิ่ม test case สำหรับป้องกัน regression — ทำ `/follow-tool-vitest` หรือ `/follow-tool-playwright`
2. ทำ `/review-codebase-everything` ถ้าพบว่า debug ยากเพราะ logging ไม่พอ
3. อัปเดท documentation ถ้าปัญหาเกี่ยวกับ config หรือ setup
4. บันทึก root cause และ solution ใน `docs/` หรือ commit message

## Rules

### 1. Core Principles

- ห้ามเดา — ทุก hypothesis ต้องมี evidence สนับสนุน
- ห้ามแก้หลายอย่างพร้อมกัน — เปลี่ยนทีละ variable
- ห้ามแก้ symptom — ต้องถึง root cause
- ห้าม bypass — ไม่ใช้ `@ts-ignore`, `eslint-disable`, หรือ try-catch ซ่อน error
- ต้อง reproduce ได้ก่อนแก้

### 2. Debug Strategy

- ไล่จากบนลงล่าง: UI → API → Database → Infrastructure
- ไล่จาก narrow ไป broad: specific function → module → system
- ใช้ binary search สำหรับ large codebase — ทำ `/follow-tool-git`
- ถ้า intermittent ให้เก็บ log ทุกครั้งจนกว่าจะ pattern ชัด
- ถ้า environment-specific ให้เปรียบเทียบ working vs broken environment

### 3. Logging For Debug

- ใช้ structured logging ไม่ใช่ `console.log`
- ใส่ context: function name, input values, state
- ใช้ log levels: `debug`, `info`, `warn`, `error`
- หลัง fix ให้ลบ debug logging ที่ไม่จำเป็น
- รายละเอียดเพิ่มเติมอยู่ใน `/review-codebase-everything`

### 4. Tool Selection

- Runtime errors → `/deep-debug` + `/resolve-errors`
- Test failures → `/run-test` + `/follow-tool-vitest`
- E2E failures → `/follow-tool-playwright`
- Build errors → `/run-build` + `/resolve-errors`
- Type errors → `/run-typecheck` + `/follow-lang-typescript`
- Performance → `/run-profiler` + `/deep-review`
- Git issues → `/follow-tool-git` + `/follow-tool-git`

### 5. Non-Redundancy

- รายละเอียด Bayesian approach อยู่ใน `/deep-debug` แล้ว
- รายละเอียด causal analysis อยู่ใน `/analyze-root-cause-analysis` แล้ว
- รายละเอียด improving debuggability อยู่ใน `/review-codebase-everything` แล้ว
- รายละเอียด error resolution อยู่ใน `/resolve-errors` แล้ว
- workflow นี้เป็น principles และ orchestrator ไม่ duplicate

- ใช้ /follow-math-propositional-logic ถ้าจำเป็น
- ใช้ /follow-math-boolean-algebra ถ้าจำเป็น
- ใช้ /follow-math-probability ถ้าจำเป็น
- ใช้ /follow-math-statistics ถ้าจำเป็น
- ใช้ /follow-math-numerical-methods ถ้าจำเป็น

## Expected Outcome

- Root cause หาได้เร็วและแม่นยำ
- ไม่มีการเดาหรือแก้หลายอย่างพร้อมกัน
- Fix แก้ที่ root cause ไม่ใช่ symptom
- มี test case ป้องกัน regression
- Debugging experience ดีขึ้นเรื่อยๆ