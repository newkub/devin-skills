---
name: idea-merge
description: สร้างไอเดียการ merge branches ตามสถานการณ์
argument-hint: "[branches]"
---

## Goal

เสนอไอเดียและกลยุทธ์การ merge ที่เหมาะสมกับสถานการณ์ของ project

## Scope

ใช้เมื่อ user ต้องการเลือก merge strategy (merge, squash, rebase, fast-forward)

## Execute

### 1. Assess Context

> Goal: Assess Context

1. ตรวจสอบ branch ปัจจุบันและ target
2. ดู commit history (`git log --oneline --graph`)
3. ตรวจสอบว่ามี uncommitted changes หรือไม่
4. ระบุข้อกำหนดของ project/team

### 2. Evaluate Strategies

> Goal: Evaluate Strategies

1. `Fast-forward`: branch ไม่มีคนแตะ, ประวัติตรง
2. `Merge commit`: ต้องการเก็บ branch context
3. `Squash merge`: branch มี commits จำนวนมาก, ต้องการ history สะอาด
4. `Rebase`: ต้องการ history เป็นเส้นตรงและ clean

### 3. Recommend

> Goal: Recommend

1. เลือก strategy ตามความเสี่ยงและ conventions
2. อธิบายข้อดี/ข้อเสีย
3. ระบุ commands ที่ต้องใช้

## Rules

- ไม่ force push ถ้าไม่จำเป็น
- สำรอง branch ก่อน rebase ถ้ามีความเสี่ยง
- เลือก strategy ตาม team conventions
- ระบุคำสั่ง dry run ถ้าเป็นไปได้

## Expected Outcome

- ได้ไอเดีย merge ที่เหมาะสม
- ทราบ commands และขั้นตอน
- ลดความเสี่ยงจาก merge ผิดพลาด