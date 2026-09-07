---
name: review-data-structure
description: ตรวจสอบ data structures ใน project ว่าเหมาะสมกับ access pattern และ complexity หรือไม่
argument-hint: "[component-or-data-pattern]"
related:  - scan-codebase
  - report-table
  - review-algorithm
---

## Goal

ตรวจสอบ data structures ใน project ว่าเหมาะสมกับ access pattern, operation requirements และ complexity หรือไม่ ก่อนส่งต่อไปยัง section `## Fix`

## Scope

ใช้เมื่อสงสัยว่า data structure ใน project เลือกไม่เหมาะสม ทำให้เกิด performance bottleneck หรือ maintainability ยาก

## Execute

### 1. Discover Data Structures

> Goal: รวบรวม data structures ทีใช้

1. ทำ `/scan-codebase` หา custom data structures, collections, trees, graphs, queues, stacks
2. ระบุ built-in types ทีใช้บ่อย (array, map, set, list, record)
3. แยกแยะ global state, in-memory caches, ส่วน processing pipeline

### 2. Review Access Patterns

> Goal: ตรวจสอบวิธีเข้าถึงข้อมูล

1. ระบุ operations หลัก (insert, delete, search, access, traverse, range query)
2. วัด frequency แต่ละ operation จาก call sites
3. ระบุ order ของข้อมูล (sorted, random, LIFO, FIFO)

### 3. Review Complexity And Fit

> Goal: ประเมิน time/space complexity

1. คำนวณ big-O ของ operations หลักบน data structure ปัจจุบัน
2. เปรียบเทียบกับ theoretical best สำหรับ access pattern นั้น
3. ระบุ over-engineered หรือ under-engineered structures

### 4. Rate And Report

> Goal: สรุป findings พร้อม fix direction

1. ทำ `/report-table` ด้วย columns: No., Structure, Operation, Current Complexity, Target, Severity
2. ชี้ไป section `## Fix` สำหรับการแก้ไข
3. ถ้ามี algorithmic ปัญหาซับซ้อน → เชื่อม `/review-algorithm`

## Rules

### 1. Read Only

- ห้ามแก้ไข code หรือ refactor ระหว่าง review
- ใช้ static analysis และ read-only inspection เท่านั้น

### 2. Evidence Required

- ทุก finding ต้องอ้างอิง file/line และ operation frequency
- ไม่เดาได้ว่า data structure ควรเปลี่ยน โดยไม่มี access-pattern evidence

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings หลังรายงาน — ข้ามถ้า scope เป็น review/report-only เช่นถูก dispatch จาก `/deep-review-codebase` หรือ `/review`

Merged from: improve-data-structure

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้
2. เลือก fix guide ที่ตรงกับ finding จากรายการด้านล่าง
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test-unit` ถ้ามี แล้วสรุปผลด้วย `/report-before-after`

- `references/fix-improve-data-structure.md` — เลือกและใช้งาน data structure ทีเหมาะสมกับ access pattern และ operation requirements
## Expected Outcome

- รายงาน findings ครอบคลุม data structures, access patterns, complexity gaps
- ทุก finding มี evidence และ severity
- next action ชัดเจนผ่าน section `## Fix`
