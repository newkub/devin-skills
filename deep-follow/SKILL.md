---
name: deep-follow
description: ติดตามและ execute deep workflows ซ้อนลึกแบบ recursive ตาม context จนครบถ้วน
---

## Goal

ติดตามและ execute `deep-*` workflows ที่มี sub-workflows หรือ skills ซ้อนลึก แบบ recursive ให้ครบถ้วนและได้รับการ verify

## Scope

ใช้เมื่องานหลักเลือก `deep-*` workflow แล้วพบว่าภายใน workflow นั้นยังมี sub-workflows/skills ซ้อนลึก ต้องการทำให้ครบถ้วน — ไม่ใช่ workflow หลักที่รันแยกต่างหาก

## Execute

Step dependencies: ทำตามลำดับ แต่แต่ละ group สามารถ parallel ได้

### 1. Identify Parent Workflow

> Goal: ระบุ parent workflow/skill ที่จะติดตาม

1. ระบุ parent workflow/skill จาก context หรือ user argument
2. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Load Parent Skill

> Goal: โหลด instructions เพื่อหา sub-workflows

1. ใช้ `skill` หรือ `read` parent `SKILL.md`
2. บันทึก `## Execute`, `## Rules`, และ `related`

### 3. Discover Sub-Workflows

> Goal: หา sub-workflows/skills ทั้งหมดภายใน parent

1. ใช้ `grep` หา references รูปแบบ `/deep-*`, `/follow-*`, `/deep-validate`, `/follow-parallel`
2. ลบ duplicates และ filter เฉพาะที่ปรากฏใน `## Execute`
3. ระบุ dependencies จาก `Step dependencies:` หรือลำดับ numbered list

### 4. Plan Execution

> Goal: เรียงลำดับและ parallel อย่างปลอดภัย

1. จัดลำดับตาม dependencies: prerequisites ก่อน
2. หา groups ที่ independent สำหรับ parallel execution
3. ถ้ามี independent groups ให้ใช้ `/follow-devin-global-subagents` หรือ `/follow-parallel` ตามความเหมาะสม
4. กำหนด max recursion depth เพื่อป้องกัน infinite loop

### 5. Execute Sub-Workflows

> Goal: ทำงานตามแผน

1. เรียก `skill` สำหรับแต่ละ sub-workflow ตามลำดับหรือ parallel
2. ถ้า sub-workflow มี sub-workflows ซ้อน → เรียก `/deep-follow` แบบ recursive
3. บันทึกผลลัพธ์และ error ของแต่ละ step

### 6. Verify And Report

> Goal: ตรวจสอบว่าทำครบถ้วน

1. ทำ `/deep-validate` เพื่อตรวจสอบผลลัพธ์
2. ตรวจสอบว่าไม่มี sub-workflow ที่ข้าม
3. ทำ `/report` สรุปผล พร้อมรายการ step ที่ทำและ next actions

## Rules

### 1. Recursion Safety

- เก็บ `visited` stack ของ parent skills เพื่อป้องกัน loop
- max recursion depth = 5 (ปรับตาม context ได้)
- ถ้า parent ซ้ำใน `visited` stack → stop และ report

### 2. Reference Filtering

- ติดตามเฉพาะ references ที่อยู่ใน `## Execute` ของ parent
- ไม่ติดตาม skill ที่ mention ใน `## Rules` หรือ `## Expected Outcome` โดยไม่ได้เรียก
- ถ้า reference ไม่มีจริง → stop และ `/report`

### 3. Parallelism

- ใช้ `/follow-parallel` สำหรับ independent sub-workflows
- จำกัด batch ไม่เกิน 10 ต่อ parallel group
- ถ้า sub-workflows มี dependency ต้องทำตามลำดับ

### 4. Deep-Only

- ใช้ `/deep-follow` เฉพาะเมื่องานมี sub-workflows ซับซ้อน
- สำหรับ leaf workflow ที่ไม่มี sub-workflows → ทำตรงโดยไม่ต้อง recursive

## Expected Outcome

- Sub-workflows ถูก execute ครบถ้วนตาม dependencies
- ไม่เกิด infinite recursion
- Parallel execution ทำได้อย่างปลอดภัย
- มี report สรุปผลลัพธ์และ next actions
