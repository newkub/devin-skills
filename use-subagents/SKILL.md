---
name: use-subagents
description: แบ่งงานซับซ้อนและ spawn subagents ตาม roles พร้อม deep context จาก /follow-deep
argument-hint: "[task]"
related:
  - follow-agents-md
  - follow-devin-global-subagents
  - follow-deep
  - list-devin-global-subagents
  - deep-validate
  - ship
  - report
  - ask-me
---

## Goal

แบ่งงานออกเป็น subtasks แล้ว spawn subagents ตาม roles พร้อมกัน โดยรวบรวม deep context ก่อนส่งงาน

## Scope

ใช้เมื่องานมีหลายไฟล์/หลาย package/หลายด้าน ต้องการมุมมองจากหลาย roles หรือทำงานขนานเพื่อเร็วขึ้น

## Execute

### 1. Deep Context First

> Goal: รวบรวม context ลึกก่อน spawn subagents

1. ทำ `/follow-deep` เพื่อวิเคราะห์ root cause, impact, consumers และ dependencies
2. บันทึก context สำคัญ: paths, conventions, ไฟล์ที่เกี่ยวข้อง, ข้อจำกัด
3. ถ้าไม่แน่ใจ scope → ทำ `/ask-me` ก่อน

### 2. Decompose Task

> Goal: แบ่งงานออกเป็น subtasks ที่ชัดเจน

1. อ่านผลจาก `/follow-deep`
2. แบ่ง subtasks ตาม package, layer, หรือ role
3. แต่ละ subtask ต้องมี: input, expected output, success criteria, files ที่ต้องแก้
4. ระบุ dependencies ระหว่าง subtasks ถ้ามี

### 3. Select Subagents

> Goal: เลือก role ที่ตรงกับแต่ละ subtask

1. ทำ `/list-devin-global-subagents` เพื่อดู roles ทีม
2. เลือก profile เช่น fixer, debugger, refactor, qa, security, architect
3. ถ้าไม่มี role ที่ต้องการ → ใช้ `subagent_general` หรือ `subagent_explore`
4. ระบุ context ให้ครบใน prompt

### 4. Spawn Subagents

> Goal: ส่งงานให้ subagents ทำขนานกัน

1. ใช้ `run_subagent` แบบ `is_background=true` เพื่อรัน parallel
2. ห้ามส่ง subtasks ซ้ำซ้อนหรือทับซ้อนกัน
3. รอผลด้วย `read_subagent` หรือ continue ทำงานอื่นไป
4. ถ้า subagent ติด error → ทำ `resolve-errors` ก่อน spawn ตัวใหม่

### 5. Merge And Fix

> Goal: รวมผลและแก้ conflicts

1. รวบรวม output จากทุก subagent
2. ตรวจ conflicts ระหว่างการแก้ไข
3. ใช้ `/resolve-errors` สูงสุด 3 รอบ
4. ถ้ายังไม่ผ่าน → ทำ `/ask-me`

### 6. Validate And Ship

> Goal: ส่งมอบงานทีผ่าน check

1. รัน `run-check` ตาม ecosystem ทีตรวจพบ
2. ถ้าผ่าน → ทำ `/ship`
3. ถ้าไม่ผ่าน → report สถานะและขั้นตอนถัดไป
4. ทำ `/report` สรุปสิ่งทีแต่ละ subagent ทำ

## Rules

### 1. Discipline

1. `Always /follow-deep first` — ห้าม spawn subagents โดยไม่มี deep context
2. `One role per subtask` — ไม่ผสมหลาย roles ใน subagent เดียว
3. `No overlapping edits` — แต่ละ subagent ต้องทำงานคนละชุดไฟล์ เว้นเสียแต่กำหนดชัดเจน
4. `Merge before ship` — ต้องรวบรวม results, ตรวจ conflicts, และ merge ก่อน push หรือ final report
5. `Run checks after merge` — ไม่ส่งมอบโดยไม่ validate
6. `Stop on 3 failures` — ถ้า resolve errors เกิน 3 รอบ ให้ stop และ report

### 2. Independence

- แต่ละ subtask ต้องไม่พึ่งพากัน
- ไม่ให้หลาย agent แก้ไขไฟล์เดียวกัน
- ใช้ `/follow-parallel` สำหรับ parallelization

### 3. Clear Prompts

- แต่ละ agent ต้องได้รับ context ทีเพียงพอ
- ระบุ deliverable, constraints, success criteria

### 4. Merge Safely

- ตรวจสอบ conflicts ก่อน merge
- รักษา consistency ของ codebase
- ทำ `/deep-validate` หลัง merge

- ใช้ /follow-devin-global-subagents ถ้าจำเป็น

## Expected Outcome

- งานถูกแบ่งและทำขนานกันโดย subagents
- มี deep context ก่อนเริ่มแก้
- ผลลัพธ์ถูก merge ไม่มี conflicts และผ่าน `run-check`
- มีรายงานสรุปสั้นและชัดเจน

