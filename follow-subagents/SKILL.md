---
name: follow-subagents
description: ใช้ subagents ตาม job roles สำหรับงานทีแบ่งเป็นส่วนและทำขนานกันได้
argument-hint: "[task]"
auto_execution_mode: 3
related:
  - use-subagents
---

## Goal

แบ่งงานซับซ้อนออกเป็น subtasks แล้วใช้ subagents ตาม job roles เพื่อทำงานขนานกัน รวมผล และส่งมอบครบ

## Scope

ใช้เมื่องานมีหลายด้าน เช่น frontend + backend + QA + DevOps หรือต้องการมุมมองจากหลาย roles พร้อมกัน

## Execute

### 1. Decompose Task

> Goal: แบ่งงานออกเป็น subtasks ทีอิสระจากกัน

1. วิเคราะห์งานหลักและระบุด้านทีต้องทำ
2. แบ่งเป้น subtasks ตาม layers: frontend, backend, qa, devops, security, architecture
3. แต่ละ subtask ต้องมี input, expected output, และ success criteria ชัดเจน
4. ถ้า subtasks dependent กัน → จัดลำดับก่อนหลัง

### 2. Select Subagents By Role

> Goal: เลือก subagents ทีตรงกับ subtasks

1. ดู subagent pool ที่มี (`senior-*`, `staff-*`)
2. เลือก role ตามความเชี่ยวชาญทีต้องการ
3. ถ้าไม่มี่ role ทีต้องการ → ทำ `/consider-use-in-another-skills` หรือสร้าง subagent ใหม่
4. ระบุว่าแต่ละ subagent ต้องทำ subtask ไหน

### 3. Spawn Subagents

> Goal: ส่งงานให้ subagents ทำขนานกัน

1. ใช้ `/run_subagent` หรือ `/use-subagents`
2. ส่ง context ครบ: task, constraints, files, expected output
3. กำหนด timeout หรือรอบการทำงาน
4. ห้ามส่ง subtask ซ้ำซ้อนกัน

### 4. Merge Results

> Goal: รวมผลจาก subagents เป้นงานเดียว

1. รวบรวม output จากทุก subagent
2. แก้ไข conflicts หรือข้อแย้งกันด้วย `/resolve-merge-conflicts`
3. จัดเรียงลำดับผลลัพธ์ตาม impact
4. ยกเว้น recommendation ทีขัดแย้งกันให้ชัดเจน

### 5. Review And Fix

> Goal: ตรวจสอบคุณภาพของผลรวม

1. ทำ `/review-and-fix` กับ output ทีได้
2. ถ้ามี gaps ให้ spawn subagent เพิ่ม
3. ตรวจสอบว่าผลลัพธ์ตอบ scope เดิม

### 6. Validate And Ship

> Goal: ส่งมอบผลลัพธ์ทีผ่าน validation

1. ทำ `/validate`
2. ทำ `/deep-verify` ถ้างานเสี่ยงสูง
3. ทำ `/ship` ถ้ามีการเปลี่ยนแปลง
4. ทำ `/report` สรุปสิ่งที่แต่ละ subagent ทำ

## Rules

### 1. One Role Per Subtask

- แต่ละ subagent รับบทเดียว ไม่ผสมหลาย roles
- ถ้าต้องการหลาย roles ให้ spawn หลาย subagents

### 2. Clear Context

- ทุก subagent ต้องได้รับ context ที่ชัดเจน
- ระบุ input, expected output, constraints

### 3. No Duplication

- ไม่แบ่ง subtasks ซ้ำซ้อนกัน
- ถ้า 2 subagents ทำงานคล้ายกัน ให้ merge หรือเลือกเดียว

### 4. Merge Before Final

- ต้อง merge ผลจากทุก subagent ก่อนส่งมอบ
- ไม่ส่ง output ของ subagent ใด subagent หนึ่ยงานเดียวโดยไม่ merge

### 5. Validate Parallel Work

- ตรวจสอบ references และ circular dependencies
- รัน check/test หลัง merge

## Expected Outcome

- งานถูกแบ่งและทำขนานกันโดย subagents
- ผลลัพธ์ถูก merge และ review แล้ว
- ผ่าน `/validate` และ `/deep-verify`
- มีรายงานสรุปจากแต่ละ role
