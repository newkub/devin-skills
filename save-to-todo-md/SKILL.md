---
name: save-to-todo-md
description: เก็บงานค้าง/ขั้นตอนที่ยังไม่เสร็จจาก session ลง TODO.md เป็น tracked items
argument-hint: "[title-or-auto]"
related:
  - update-todo-md
  - list-todo-md
  - implement-todo-md
  - report-progress
  - report-table
---

## Goal

บันทึกงานที่ยังไม่เสร็จ — pending items, blocked tasks, follow-ups — จากงานปัจจุบันลง `TODO.md` ของ project เพื่อไม่ให้งานค้างหายไปเมื่อ session จบ

## Scope

- ใช้เมื่อ: task จบแต่เหลืองานค้าง, session ใกล้หมด, งาน blocked รอ input, หรือ user สั่งเก็บงานไว้ทำต่อ
- เขียนลง `TODO.md` ที่ project root — ต่างจาก `/update-todo-md` ที่รับ request เดียว, skill นี้เก็บ remaining work ทั้งชุดจาก context ปัจจุบัน
- ถ้าระบุ `--drive` → เขียนลง `D:\TODO.md` (drive-level inbox) โดยทำ `/enhance-prompt` กับเนื้อหาก่อน และ stop ถ้า title ซ้ำ
- ไม่ implement งาน — เก็บเป็น tracked items เท่านั้น

## Execute

### 1. Report Progress First

> Goal: สรุปสถานะงานปัจจุบันก่อนเก็บ items

1. ทำ `/report-progress` ก่อนเสมอ — สรุปงานที่เสร็จ/ค้าง เพื่อให้เห็นภาพรวมก่อนเขียน TODO
2. ใช้ผล report เป็น input สำหรับ remaining work

### 2. Collect Remaining Work

> Goal: รวบรวมงานค้างจาก context

1. ดู todo list ปัจจุบัน — items ที่ยัง `pending`/`in_progress`
2. ดู blockers และ deferred items ที่เจอระหว่างทำงาน
3. รวม follow-ups ที่ถูกเสนอแต่ยังไม่ทำ (จาก reports/suggestions)
4. ถ้า argument ระบุ title → เก็บภายใต้หัวข้อนั้น; ไม่ระบุ → ใช้ชื่อ task ปัจจุบัน

### 3. Normalize Items

> Goal: แปลงงานค้างเป็น TODO items ที่ทำต่อได้

1. แต่ละ item ต้อง actionable: ระบุ what + why pending (blocked by X / out of scope / deferred)
2. ตัด items ที่เสร็จแล้วหรือไม่ relevant อีกต่อไป
3. ใส่ context พอให้ทำต่อได้โดยไม่ต้องอ่าน session — reference files/decisions ที่เกี่ยว
4. กำหนด priority: `high` (blocker/critical path), `medium`, `low` (nice-to-have)

### 4. Write To TODO.md

> Goal: append items ลง TODO.md โดยไม่ทับของเดิม

1. เลือก target: default = `TODO.md` ที่ project root; ถ้าระบุ `--drive` → `D:\TODO.md`
2. ถ้าโหมด `--drive` → ทำ `/enhance-prompt` กับเนื้อหาให้เป็น numbered list ก่อน และ stop ถ้าพบ title ซ้ำใน `D:\TODO.md`
3. อ่าน `TODO.md` เป้าหมายถ้ามี — เก็บ structure เดิมไว้
4. ถ้ายังไม่มี → สร้างพร้อม header ตาม convention ของ `/update-todo-md`:
   ```
   | Title | Description | Status | Priority | Created |
   |---|---|---|---|---|
   ```
5. Append rows ใหม่ — ห้ามเขียนทับ items เดิม
6. Format: `| <title> | <description + why pending> | pending | <priority> | <YYYYMMDD> |`
7. ถ้ามีหลาย items ที่เกี่ยวกัน → จัดกลุ่มด้วย prefix เดียวกันใน title

### 5. Dedupe And Report

> Goal: ไม่ซ้ำกับ items เดิมและรายงานผล

1. เทียบกับ rows ที่มีอยู่ — skip หรือ merge items ที่ซ้ำ (อัปเดต status/priority แทนการเพิ่มซ้ำ)
2. ใช้ `/report-table` สรุป: `No.`, `Item`, `Priority`, `Why Pending`, `Action`
3. บอก path และจำนวน items ที่เพิ่ม/ข้าม

## Rules

### 1. Append Only

- ห้ามลบหรือเขียนทับ items เดิมใน TODO.md — merge เฉพาะเมื่อเป็น item เดียวกันชัดเจน
- เคารพ format ที่ไฟล์มีอยู่ (table หรือ checkbox style)

### 2. Actionable Items

- ทุก item ต้องทำต่อได้โดยไม่ต้องอ่าน session — มี context/reference ครบ
- ระบุเหตุที่ค้างเสมอ — blocked, deferred, หรือ out of scope

### 3. Session Aware

- เรียกเมื่องานเหลือค้างจริง — ไม่สร้าง TODO items จากงานที่เสร็จสมบูรณ์
- ถ้าไม่มีอะไรค้าง → รายงานว่าไม่มี ไม่บังคับเขียน

## Expected Outcome

- งานค้างทั้งหมดถูกเก็บใน `TODO.md` เป็น tracked items พร้อม priority และเหตุ
- ไม่มี items ซ้ำกับที่มีอยู่
- Session หน้า resume ได้จาก TODO.md ผ่าน `/list-todo-md` และ `/implement-todo-md`

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: save-to-todo-in-root-drive-d)
