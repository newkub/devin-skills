---
name: follow-tool-rolldown-optimize-bundle
description: ปรับ Rolldown bundle — code splitting, treeshaking, advancedChunks
argument-hint: "[target-area]"
related:
  - follow-tool-rolldown
  - run-bench
  - check-bottlenecks
  - check-bundle-regression
  - report-before-after
---

## Goal

ลดขนาดและปรับ layout ของ Rolldown output — code splitting, tree-shaking และ `output.advancedChunks` — โดยวัดผลก่อนและหลังเสมอ

## Scope

- ใช้กับ Rolldown standalone (`rolldown.config.ts`) — ถ้าอยู่ใน Vite ให้ใช้ `follow-tool-vite` subskills แทน
- ครอบคลุม `output.advancedChunks`, `treeshake`, `external`, minify และ sourcemap options
- optimization นี้เน้น output quality — ไม่ครอบคลุม dev-server speed

## Execute

### 1. Baseline

> Goal: วัดก่อนแก้ ห้ามเดา bottleneck

1. รัน `bunx rolldown -c` เก็บ build time และขนาดไฟล์ต่อ chunk
2. ระบุ chunk ที่ใหญ่ผิดปกติหรือ module ที่ไม่ควร bundle — ทำ `/check-bottlenecks`
3. บันทึก baseline ไว้ compare (ใช้ `/report-before-after` ตอนจบ)

### 2. Tree-shaking

> Goal: dead code ถูกตัดออกจริง

1. `treeshake` เปิดอยู่เป็น default — ตรวจว่าไม่มีใครปิดไว้
2. ตั้ง `sideEffects` ใน `package.json` หรือ `treeshake.moduleSideEffects` ให้ถูก — flag เฉพาะไฟล์ที่มี side effects จริง
3. library ที่ tree-shake ไม่ได้ → mark `external` หรือ import เจาะจง path

### 3. Code Splitting

> Goal: แยก chunks อย่างมีเหตุผล

1. dynamic `import()` ใน source สร้าง chunk boundary — ใช้สำหรับ lazy features
2. multi-entry `input` object แชร์ common modules ผ่าน `output.advancedChunks`
3. ใช้ `advancedChunks` groups เช่น `vendor` group ตาม `test`/`minSize`/`priority` — ดู official docs สำหรับ fields ทั้งหมด
4. หลีกเลี่ยง chunks เล็กเกินหรือ circular imports ระหว่าง chunks

### 4. Output Tuning

> Goal: minify และ output options เหมาะสม

1. `output.minify` — เปิดสำหรับ production, ปรับ `compress`/`mangle` ตาม official docs
2. `output.sourcemap` — เลือก strategy ตาม deployment (external map, hidden)
3. `external` สำหรับ deps ที่ consumer ติดตั้งเอง — library ห้าม bundle `peerDependencies`
4. ปรับ `entryFileNames`/`chunkFileNames` ให้มี content hash ถ้า output เป็น app bundle ที่ต้อง cache

### 5. Verify

> Goal: compare และไม่ regression

1. รัน build ซ้ำ → compare size/chunk count/build time กับ baseline
2. import/require output ทุก entry → ไม่มี missing modules หรือ side-effects loss
3. ถ้า regression → revert จุดนั้นแล้ว report diff

## Rules

### 1. Correctness First

- tree-shake/แยก chunk ผิดพลาด = runtime แตก — verify output ทุกครั้งหลังเปลี่ยน
- ห้ามใส่ไฟล์ที่มี side effects จริงภายใต้ `sideEffects: false`

### 2. Options

- ใช้เฉพาะ options จาก official docs (`rolldown.rs`) — Rolldown API เปลี่ยนเร็ว ห้ามเดา

## Expected Outcome

- bundle เล็กลงหรือ layout ดีขึ้นเทียบ baseline
- output importable ครบทุก entry ไม่มี behavior เปลี่ยน
