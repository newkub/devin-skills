---
name: gen-adr
description: สร้าง Architecture Decision Record จาก decision ใน session เก็บใน .devin/adr
argument-hint: "[decision-topic]"
related:
  - deep-pondering
---

## Goal

บันทึก architectural decisions เป็น ADR (Architecture Decision Record) ที่เป็นรูปธรรม — context, options, decision, consequences — เก็บใน `.devin/adr/` ของ project เพื่อให้ทีมและอนาคตเข้าใจว่าทำไมตัดสินใจแบบนั้น

## Scope

- ใช้เมื่อมีการตัดสินใจเชิงสถาปัตยกรรม: เลือก library, pattern, data store, API design, deployment approach
- Source: decision ใน session ปัจจุบัน, หรือ backfill จาก git history/discussions
- Output: ไฟล์ `NNNN-<kebab-title>.md` ใน `.devin/adr/` ตามมาตรฐาน ADR

## Execute

### 1. Extract Decision Context

> Goal: รวบรวมสิ่งที่ตัดสินใจและเหตุผล

1. ระบุ decision จาก argument หรือ session context — คำถามคืออะไร, ตัดสินใจอะไร
2. เก็บ options ที่พิจารณาและเหตุที่ตัดออก
3. เก็บ constraints และ forces ที่กดดัน (deadline, scale, team skills, cost)
4. ถ้า context ไม่พอ → ใช้ `/deep-pondering` หรือถาม user ก่อนเขียน

### 2. Prepare ADR Storage

> Goal: สร้างโครง `.devin/adr/` ถ้ายังไม่มี

1. สร้าง `.devin/adr/` และ `README.md` index ถ้าเป็น ADR แรก
2. เลข ADR: sequence ต่อจากตัวล่าสุด (`0001-`, `0002-`, ...) — ดูจากไฟล์ที่มี
3. ชื่อไฟล์: `NNNN-<kebab-case-title>.md`

### 3. Write ADR

> Goal: เขียนเอกสารตามมาตรฐาน

ใช้ format มาตรฐาน (Michael Nygard style):

```markdown
# NNNN. <Title>

- Status: accepted | proposed | deprecated | superseded by ADR-XXXX
- Date: YYYY-MM-DD
- Deciders: <who>

## Context

<ปัญหา/สถานการณ์/forces ที่นำไปสู่การตัดสินใจ>

## Options Considered

### Option A: <name>
- ข้อดี / ข้อเสีย

### Option B: <name>
- ข้อดี / ข้อเสีย

## Decision

<ตัวเลือกที่เลือก + เหตุผลหลัก>

## Consequences

### Positive
- <ผลดีที่คาด>

### Negative / Trade-offs
- <ต้นทุน/ความเสี่ยงที่ยอมรับ>
```

### 4. Update Index And References

> Goal: เชื่อม ADR เข้ากับเอกสารอื่น

1. เพิ่มลิงก์ใน `.devin/adr/README.md` index
2. ถ้า ADR supersede ตัวเก่า → อัปเดต status ของตัวเก่าและลิงก์ข้ามกัน
3. อ้างอิงจาก README/docs ที่เกี่ยวข้องถ้าเหมาะ

## Rules

### 1. Real Decisions Only

- เขียนเฉพาะการตัดสินใจจริงที่มี trade-offs — ไม่ใช่ document ทุกทางเลือกเล็กๆ
- Context ต้องมาจากข้อเท็จจริง ไม่ใช่การเดา

### 2. Immutable Record

- ADR ที่ accepted แล้วไม่แก้ — ถ้าเปลี่ยนใจให้สร้าง ADR ใหม่ที่ supersede
- Status transitions: `proposed` → `accepted` → `deprecated`/`superseded`

### 3. Concise

- ADR ควรอ่านจบใน 5 นาที — เน้น why ไม่ใช่ how
- ไม่ copy code/docs มาใส่ — ลิงก์แทน

## Expected Outcome

- ADR ถูกสร้างใน `.devin/adr/` พร้อมเลขและ status ถูกต้อง
- Index อัปเดตและลิงก์ supersession ครบถ้วน
- ทีมเข้าใจ context ของการตัดสินใจโดยไม่ต้องถามซ้ำ
