---
name: collaborate-with-agents
description: Coordinate multiple subagents to work on independent subtasks and merge results
allowed-tools:
  - read
  - write
  - edit
  - exec
  - ask_user_question
  - run_subagent
  - read_subagent
triggers:
  - user
  - model
related:
  - outputs
---

## Goal

ประสานงาน subagents หลายตัวให้ทำงานบน subtasks ทีแยกกันได้ และรวมผลลัพธ์กลับมา

## Scope

ใช้เมื่อ task สามารถแบ่งเป็น independent subtasks ที subagents ทำงานขนานกันได้

## Execute

### 1. Decompose Task

> Goal: แบ่งงานออกเป็น subtasks
> Goal: แต่ละ subtask ชัดเจนและ independent

1. ทำ `/deep-plan` ถ้างานซับซ้อน
2. ระบุ subtasks ทีทำขนานกันได้
3. ระบุ inputs/outputs ของแต่ละ subtask
4. ตรวจสอบว่าไม่มี shared mutable state

### 2. Spawn Subagents

> Goal: สร้าง subagents ตาม subtasks
> Goal: ทุก subtask มี agent ทำงาน

1. ทำ `/run-parallel-via-spawn-subagents` เพื่อสร้าง agent ตาม subtask พร้อม merge, review, validate, verify
2. ส่ง prompt ทีชัดเจนให้แต่ละ agent
3. ระบุ deliverable และ constraints

### 3. Collect Results

> Goal: รอและรวบรวมผลลัพธ์
> Goal: ได้ผลลัพธ์จากทุก agent

1. ใช้ `read_subagent` เพื่อติดตาม progress
2. รวบรวม results จากทุก agent
3. ตรวจสอบความสมบูรณ์

### 4. Merge And Report

> Goal: รวมผลลัพธ์และรายงาน
> Goal: ส่งมอบผลลัพธ์รวม

1. แก้ไข conflicts ถ้ามี
2. ทำ `/report-table` สรุป status แต่ละ agent
3. ทำ `/report-ansi` สำหรับ progress
4. ทำ `/suggest-next-action`

## Rules

### 1. Independence

- แต่ละ subtask ต้องไม่พึ่งพากัน
- ไม่ให้หลาย agent แก้ไขไฟล์เดียวกัน
- ใช้ `follow-parallel` สำหรับ parallelization

### 2. Clear Prompts

- แต่ละ agent ต้องได้รับ context ที่เพียงพอ
- ระบุ deliverable, constraints, success criteria

### 3. Merge Safely

- ตรวจสอบ conflicts ก่อน merge
- รักษา consistency ของ codebase
- ทำ validate หลัง merge

## Expected Outcome

- subtasks ถูกทำขนานกัน
- ผลลัพธ์รวมไม่มี conflicts
- status report ของแต่ละ agent
- next action ชัดเจน
