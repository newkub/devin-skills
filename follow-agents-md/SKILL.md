---
name: follow-agents-md
description: ทำตาม AGENTS.md ใน workspace
argument-hint: "[target]"
related:
  - update-agents-md
  - check-skills-related
  - consider-use-subagents
---

## Goal

ทำตาม `AGENTS.md` ใน workspace ให้ครบถ้วน

## Scope

ค้นหาและทำตาม `AGENTS.md` ในทุก workspace

## Execute

### 1. Update AGENTS.md

> Goal: อัปเดต `AGENTS.md` ให้เป็นปัจจุบันก่อนทำงานอื่น

1. ทำ `/update-agents-md` เพื่อเขียน/อัพเดต `AGENTS.md` ก่อนเสมอ ก่อนทำอย่างอื่นใด
2. ตรวจสอบว่า `AGENTS.md` เขียนถูกต้องและเป็นปัจจุบัน
3. ห้ามข้ามขั้นตอนนี้ไม่ว่ากรณีใดๆ

### 2. Read And Summarize Related

> Goal: รู้ว่าจะทำอะไรบ้าง

1. ทำ `/check-skills-related` เพื่ออ่าน workflows/skills ที่เกี่ยวข้อง
2. สรุปรายการสิ่งที่จะทำ: workflows, skills, ลำดับ, dependencies
3. ถ้ามีหลาย workflows ที่ independent → บันทึกไว้สำหรับ `/consider-use-subagents`

### 3. Execute AGENTS.md

> Goal: ดำเนินการตาม `AGENTS.md` ครบทุกขั้นตอน

1. อ่าน `AGENTS.md` ใน workspace root และทุก sub-workspace ถ้าเป็น monorepo
2. วิเคราะห์ workflows และ skills ที่ระบุ
3. ถ้ามี workflow เดียว ทำตามโดยตรง
4. ถ้ามีหลาย workflows/skills ที่ independent ให้ทำ `/consider-use-subagents`
5. ถ้าเป็น monorepo: ทำซ้ำสำหรับแต่ละ workspace

### 4. Verify Execution

> Goal: ตรวจสอบว่า workflows และ skills ถูก execute ครบถ้วน

1. ตรวจสอบว่าทุก workflow ใน `AGENTS.md` ถูกเรียกแล้ว
2. ตรวจสอบว่าทุก skill ถูกโหลดแล้ว
3. ถ้ามี workflow หรือ skill ที่ไม่มีอยู่ ให้ข้ามและบันทึกไว้

## Rules

### 1. File Location

- `AGENTS.md` ต้องอยู่ใน workspace root และ sub-workspaces ถ้าเป็น monorepo
- ถ้าเป็น monorepo: ทำตาม `AGENTS.md` ของทุก workspace

### 2. Execution Order

- ทำตามลำดับที่ระบุใน `AGENTS.md`
- ตรวจสอบว่า workflows และ skills มีอยู่จริง
- ข้าม workflows หรือ skills ที่ไม่มีอยู่

## Expected Outcome

- Workflows ที่ระบุใน `AGENTS.md` ถูก execute ครบถ้วน
- Skills ที่ระบุใน `AGENTS.md` ถูกโหลด
- ทุก workspace ใน monorepo ถูกประมวลผลครบ