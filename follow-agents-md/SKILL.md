---
name: follow-agents-md
description: ทำตาม AGENTS.md ใน workspace
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
  - read-related-skills
  - update-agents-md
---

## Goal

ทำตาม `AGENTS.md` ใน workspace ให้ครบถ้วน

## Scope

ค้นหาและทำตาม `AGENTS.md` ในทุก workspace

## Execute

### 1. Update AGENTS.md
> Goal: Update AGENTS.md

ทำ `/update-agents-md` ก่อนเสมอ ก่อนทำอย่างอื่นใด

- ทำ `/update-agents-md` เพื่อเขียน/อัพเดต `AGENTS.md`
- ตรวจสอบว่า `AGENTS.md` เขียนถูกต้องและเป็นปัจจุบัน
- ห้ามข้ามขั้นตอนนี้ไม่ว่ากรณีใดๆ

### 2. Read Related Workflows And Skills
> Goal: Read Related Workflows And Skills

อ่าน workflows และ skills ที่เกี่ยวข้องทั้งหมด

1. ทำ `/read-related-skills` เพื่ออ่าน workflows ที่เกี่ยวข้องแบบ recursive
2. ทำ `/read-related-skills` เพื่ออ่าน skills ที่เกี่ยวข้องแบบ recursive
3. ทำตาม workflows และ skills ที่อ่านได้ทั้งหมด

### 3. Parse And Execute AGENTS.md
> Goal: Parse And Execute AGENTS.md

อ่านและ execute workflows/skills ที่ระบุใน `AGENTS.md`

1. อ่าน `AGENTS.md` ใน workspace root และทุก sub-workspace ถ้าเป็น monorepo
2. วิเคราะห์ workflows และ skills ที่ระบุในแต่ละ `AGENTS.md`
3. ทำตาม workflows ที่ระบูใน `AGENTS.md` ตามลำดับ
4. โหลด skills ที่ระบุใน `AGENTS.md`
5. ถ้าเป็น monorepo: ทำซ้ำสำหรับแต่ละ workspace ที่มี `AGENTS.md`

### 4. Verify Execution
> Goal: Verify Execution

ตรวจสอบว่า workflows และ skills ถูก execute ครบถ้วน

1. ตรวจสอบว่าทุก workflow ใน `AGENTS.md` ถูกเรียกแล้ว
2. ตรวจสอบว่าทุก skill ถูกโหลดแล้ว
3. ถ้ามี workflow หรือ skill ที่ไม่มีอยู่ ให้ข้ามและบันทึกไว้

## Rules

- `AGENTS.md` ต้องอยู่ใน workspace root และ sub-workspaces ถ้าเป็น monorepo
- ทำตามลำดับที่ระบุใน `AGENTS.md`
- ตรวจสอบว่า workflows และ skills มีอยู่จริง
- ข้าม workflows หรือ skills ที่ไม่มีอยู่
- ถ้าเป็น monorepo: ทำตาม `AGENTS.md` ของทุก workspace

## Expected Outcome

- Workflows ที่ระบุใน `AGENTS.md` ถูก execute ครบถ้วน
- Skills ที่ระบุใน `AGENTS.md` ถูกโหลด
- ทุก workspace ใน monorepo ถูกประมวลผลครบ
