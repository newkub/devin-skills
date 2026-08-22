---
name: improve-correctness
description: ตรวจสอบและปรับปรุงความถูกต้องของ code, config, rules, หรือ skills
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - find_file_by_name
  - exec
  - mcp_call_tool
  - ask_user_question
triggers:
  - user
  - model
related:
---

## Goal

ตรวจสอบและปรับปรุงความถูกต้องของเป้าหมายที่ระบุ โดยใช้ tools หรือ scripts หาปัญหาก่อนแก้ไข

## Scope

ใช้สำหรับ code, configuration, rule files, workflows, หรือ skills ที่ต้องตรวจสอบความถูกต้องตาม criteria, standards, หรือ requirements ทีระบุ

- ตรวจสอบความถูกต้องตาม criteria ที user กำหนด
- หา issues ด้วย tools หรือ `/use-scripts`
- จัดลำดับความสำคัญและแก้ไข issues
- verify ว่าแก้ไขแล้วถูกต้อง

## Execute

### 1. Gather Criteria

> Goal: รวบรวม criteria และ context ทีใช้ตรวจสอบ
> Goal: ทราบสิ่งทีต้องตรวจ และวิธีวัดผล

1. อ่าน requirements, rules, standards ที user ระบุ
2. ถ้าเป็น skill → อ่าน `global_rules.md` และ skill conventions
3. ระบุ criteria ที concrete และ measurable
4. ถ้า criteria ไม่ชัด → stop และ `/ask-me`

### 2. Detect Issues

> Goal: ค้นหาปัญหาด้วย tools หรือ scripts
> Goal: หาปัญหาจริงโดยไม่เดา

1. ใช้ `read`, `grep`, `glob` เพื่อ scan ไฟล์ทีเกี่ยวข้อง
2. ใช้ `exec` รัน commands ทีตรวจสอบได้ (เช่น `git diff --check`, `bun run lint`, `bun run typecheck`)
3. ถ้าต้อง scan ซับซ้อน → ทำ `/use-scripts` เพื่อเขียน temporary script ตรวจ
4. บันทึก issues พร้อม evidence (ไฟล์, บรรทัด, output)

### 3. Prioritize

> Goal: จัดลำดับ issues ก่อนแก้ไข
> Goal: แก้ปัญหาสำคัญก่อน และลด rework

1. แบ่ง severity: Critical, High, Medium, Low
2. เรียง Critical → High → Medium → Low
3. ถ้า issues มาก > 20 → ทำ `/report-table` หรือ `/report-plan`
4. ขอ user confirm ก่อนแก้ถ้ามี high-impact หรือ destructive changes

### 4. Fix Issues

> Goal: แก้ไข issues ตาม priority
> Goal: ปรับปรุงความถูกต้องให้ผ่าน criteria

1. แก้ไขปัญหาแต่ละข้อด้วย `edit` หรือ `write`
2. ทดสอบแก้ไขด้วยคำสั่งหรือ script ทีเหมาะสม
3. ถ้าพบปัญหาใหม่ระหว่างแก้ → บันทึกและจัดลำดับใหม่
4. ไม่แก้ไขนอก scope โดยไม่รายงาน

### 5. Verify

> Goal: ตรวจสอบว่าแก้ไขแล้วถูกต้อง
> Goal: ยืนยันว่าไม่มี issues เหลือ หรือ เหลือเฉพาะทียอมรับได้

1. รัน checks เดิมซ้ำเพื่อ verify
2. ทำ `/check-reference` เพื่อตรวจ references
3. ทำ `/validate` ถ้าเป็น skill หรือ workflow
4. ถ้ายังพบ issues → กลับไป Execute 4 (max 3 รอบ)

### 6. Report

> Goal: สรุปผลการปรับปรุง
> Goal: รายงานสิ่งทีทำ และสถานะปัจจุบัน

1. ใช้ `/report-table` สรุป issues ทีพบและแก้ไข
2. ระบุ issues ทียังเหลือ (ถ้ามี) พร้อมเหตุผล
3. แนะนำ next action ถ้าจำเป็น

## Rules

### 1. Evidence First

- ห้ามเดา issues โดยไม่มี evidence
- ทุก issue ต้องระบุไฟล์ บรรทัด หรือ output
- ใช้ tools หรือ scripts ก่อน manual inspection

### 2. Check- Skills

- ถ้า skill มี prefix `check-` ให้พยายามใช้ tools หรือ `/use-scripts` ใน `## Execute`
- หลีกเลี่ยงการตรวจด้วยตาเปล่า ยกเว้นกรณีทีต้องใช้ judgment
- ผลลัพธ์ต้อง reproducible ด้วยคำสั่งหรือ script

### 3. Scope Control

- แก้ไขเฉพาะ issues ใน scope ทีระบุ
- ถ้าพบ issues นอก scope → รายงาน ไม่แก้โดยไม่ได้รับอนุญาต
- ไม่ลบหรือ overwrite ไฟล์โดยไม่มี dry run

### 4. Safety

- ทำ dry run ก่อน destructive fixes
- ถ้าแก้ไข >10 ไฟล์ หรือ >250 บรรทัด → ใช้ `/use-scripts`
- ไม่แก้ security policies, credentials, หรือ compliance controls

## Expected Outcome

- หา issues ตาม criteria ได้ครบถ้วนด้วย tools หรือ scripts
- แก้ไข issues ตาม priority และ verify ผ่าน
- References และ links ทั้งหมดถูกต้อง
- รายงานผล พร้อม issues ทีเหลือ (ถ้ามี)
