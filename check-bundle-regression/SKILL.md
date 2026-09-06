---
name: check-bundle-regression
description: เทียบ bundle size ก่อน/หลัง build เพื่อหา size regression ต่อ chunk และ dependency
argument-hint: "[baseline]"
related:
  - report-bundle
  - review-bundle
  - optimize-bundle
  - run-build
  - check-size
  - use-pwsh-shell
  - report-table
---

## Goal

ตรวจหา bundle size regression โดยเทียบ build output ปัจจุบันกับ baseline ก่อนหน้า — รายงาน chunks, assets และ dependencies ที่โตเกิน threshold

## Scope

- ใช้เมื่อต้องการเทียบ bundle size ระหว่าง builds (เช่น ก่อน/หลัง refactor, เพิ่ม dependency, หรือ upgrade)
- ครอบคลุม JS/CSS bundles จาก `dist/`, `build/`, `.output/` หรือ output directory ของ bundler ที่ตรวจพบ
- Read-only ต่อ source: ตรวจและรายงานเท่านั้น ไม่แก้ไข code

## Execute

### 1. Establish Baseline

> Goal: มี baseline เพื่อเทียบ

1. รับ `baseline` จาก argument: path ของ build เดิม, git ref, หรือ `bundlesize` config
2. ถ้าเป็น git ref → build ที่ ref นั้นผ่าน `git worktree` หรือ stash (ทำ `/use-git-worktrees` ถ้าจำเป็น)
3. ถ้าไม่มี baseline → เก็บ build ปัจจุบันเป็น baseline ใน `.devin/bundle-baseline.json` แล้ว report
4. baseline file เก็บ: chunk name, size bytes, gzip size (ถ้าวัดได้)

### 2. Build Current Output

> Goal: ได้ build output ปัจจุบัน

1. ทำ `/run-build` เพื่อสร้าง production build
2. ระบุ output directory จาก bundler config (`vite.config.*`, `next.config.*`, `package.json`)
3. เก็บรายการ files พร้อมขนาดด้วย `/check-size` หรือ `Get-ChildItem -Recurse -File`

### 3. Compare Sizes

> Goal: หา deltas ต่อ file และรวม

1. เทียบชื่อไฟล์ที่ normalize แล้ว (ตัด content hash ออกจาก filename)
2. คำนวณ delta: `current - baseline` และเปอร์เซ็นต์
3. Threshold default: flag `regression` ถ้า file โต >5% หรือ >50 KB, flag `critical` ถ้า >20% หรือ >200 KB
4. แยก new chunks (ไม่มีใน baseline) และ removed chunks

### 4. Attribute To Dependencies

> Goal: รู้ว่า regression มาจากอะไร

1. ถ้ามี bundle analyzer output (`stats.json`, `manifest.json`) → map chunk กลับไปหา modules/dependencies
2. เทียบ `package.json` dependencies กับ baseline หา packages ที่เพิ่มเข้า
3. ใช้ `/report-bundle` หรือ `/review-bundle` เพื่อวิเคราะห์ chunks ที่โต

### 5. Report

> Goal: สรุป regression ให้ตัดสินใจได้

1. ทำ `/report-table` คอลัมน์: `No.`, `Chunk`, `Before`, `After`, `Delta`, `Status`, `Suspected Cause`
2. Status: `ok`, `regression`, `critical`, `new`, `removed`
3. สรุป total bundle delta และ top regressions
4. ถ้า `critical` → เสนอ `/optimize-bundle` หรือ `/review-bundle` เป็น next action

## Rules

### 1. Deterministic Compare

- Normalize filenames ตัด content hash ก่อนเทียบ — hash เปลี่ยนทุก build
- เทียบ gzip size ถ้ามี — raw size อย่างเดียวอาจ misleading
- Baseline ต้องมาจาก production build เหมือนกัน ห้ามเทียบ dev build

### 2. Read-Only

- ไม่แก้ไข code หรือ config เพื่อลด size ใน skill นี้ — ส่งต่อ `/optimize-bundle`
- ไม่ลบ build artifacts ของ baseline

### 3. Thresholds

- ใช้ทั้ง percent และ absolute threshold — เลี่ยง false positive จากไฟล์เล็ก
- ระบุ threshold ที่ใช้ใน report เสมอ

- ใช้ /report-bundle ถ้าจำเป็น
- ใช้ /review-bundle ถ้าจำเป็น
- ใช้ /optimize-bundle ถ้าจำเป็น

## Expected Outcome

- รู้ว่า build ใหม่โตหรือเล็กลงเท่าไร ต่อ chunk และรวม
- ระบุ suspected cause ของ regression ได้ (dependency ใหม่, code ใหม่)
- พร้อมตัดสินใจว่าจะ optimize หรือยอมรับ delta
