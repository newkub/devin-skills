---
name: spawn-subagents
description: Spawn one or more background subagents with clear tasks and contexts
allowed-tools:
  - run_subagent
  - read_subagent
  - write
  - edit
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - iteration
  - progress
---

## Goal

สร้าง subagents สำหรับทำ subtasks ด้วย context ทีชัดเจน

## Scope

ใช้เมื่อต้องการทำงานหลายส่วนพร้อมกันใน background

## Execute

### 1. Prepare Tasks

> Goal: เตรียมรายการ subtasks
> Goal: แต่ละ subtask พร้อมส่งให้ agent

1. แบ่งงานออกเป็น subtasks
2. ระบุ inputs และ expected outputs
3. ระบุ tools ทีอนุญาต
4. กำหนด timeout/iteration limits

### 2. Spawn Subagents

> Goal: สร้าง agents ใน background
> Goal: ทุก subtask มี agent ทำงาน

1. ใช้ `run_subagent` ด้วย `is_background=true`
2. บันทึก agent ids
3. ส่ง prompt พร้อม deliverable

### 3. Monitor Progress

> Goal: ติดตาม subagents
> Goal: รู้ status ของทุก agent

1. ใช้ `read_subagent` ตรวจสอบ progress
2. รวบรวม results เมื่องเสร็จ
3. จัดการ errors ถ้ามี

### 4. Report

> Goal: รายงานสถานะ
> Goal: ผู้ใช้ทราบ progress

1. ทำ `/report-table` ของ agent id, status, result
2. ทำ `/report-ansi` สำหรับ progress

## Rules

### 1. Task Isolation

- แต่ละ agent ต้องมี scope ชัดเจน
- ห้าม overlap ในการเขียนไฟล์
- ใช้ `follow-parallel` สำหรับลำดับ

### 2. Deterministic Prompts

- prompt ต้องระบุ output format
- ห้ามสั่งให้ agent ตัดสินใจเรื่องเสี่ยงเอง
- ระบุ constraints ชัดเจน

### 3. Error Handling

- ตรวจจับ errors จาก `read_subagent`
- ถ้า agent ล้มเหลว ให้ retry หรือ escalate
- ไม่ปล่อย agents ค้าง

## Expected Outcome

- subagents ถูก spawn ตาม subtasks
- รายงาน status/progress
- results รวบรวมครบ
- ไม่มี orphan agents
