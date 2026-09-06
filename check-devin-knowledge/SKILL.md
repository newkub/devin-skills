---
name: check-devin-knowledge
description: Audit Devin knowledge notes — stale, contradicting, unused และ missing references
argument-hint: "[folder-or-topic]"
related:
  - list-devin-global-skills
  - check-dead-link
  - check-reference
  - report-table
---

## Goal

ตรวจ Devin knowledge notes ว่ายังถูกต้องและใช้งานอยู่ — หา notes ที่ stale, ขัดกัน, ไม่มีใครใช้ หรืออ้าง resources ที่ไม่มีแล้ว

## Scope

- ใช้ `devin_knowledge_manage` MCP tools เมื่อมี — หรือ knowledge files ที่เก็บใน repo/workspace
- ครอบคลุม: note freshness (age vs referenced reality), contradictions ระหว่าง notes, dead references, coverage gaps
- Read-only: รายงาน — แก้/ลบผ่าน user confirmation

## Execute

### 1. Inventory Knowledge

> Goal: รวบรวม notes ทั้งหมด

1. ใช้ `devin_knowledge_manage` (list) หรือค้น knowledge files ที่มี
2. เก็บ metadata: title, content summary, created/updated date, folder
3. จัดกลุ่มตาม topic/folder

### 2. Check Freshness

> Goal: หา notes ที่อาจ stale

1. flag notes ที่เก่า (>90 วัน) โดยไม่ถูก update — โดยเฉพาะที่อ้าง tools/versions
2. เทียบ notes ที่อ้าง code/config กับสถานะจริง — facts เปลี่ยนไปไหม
3. flag notes ที่ reference skills/files ที่ถูกลบหรือ rename แล้ว (ทำ `/check-reference` ร่วม)

### 3. Detect Contradictions And Duplicates

> Goal: หา notes ที่ขัดหรือซ้ำกัน

1. เทียบ notes ที่ topic เดียวกัน — คำแนะนำที่ขัดกัน (เช่น config คนละแบบ)
2. หา near-duplicates — notes ที่พูดเรื่องเดียวกันควรรวม
3. flag suggestions ที่ค้างนานไม่ถูก review

### 4. Report

> Goal: สรุป knowledge health

1. ใช้ `/report-table`: `No.`, `Note`, `Issue`, `Age`, `Severity`, `Action`
2. Actions: `update`, `merge`, `dismiss`, `delete`, `keep`
3. สรุป coverage: topics ที่มี notes ครบ vs ที่ขาด

## Rules

### 1. Evidence-Based

- "stale" ต้องมีเหตุ — age alone ไม่พอ, ต้องเทียบกับ reality ปัจจุบัน
- contradiction ต้องอ้างทั้งสอง notes พร้อมจุดที่ขัด

### 2. Read-Only

- ไม่แก้หรือลบ notes — รายงานให้ user ตัดสินใจ
- การแก้ไข knowledge ต้อง user confirm

### 3. Value Preserved

- notes เก่าที่ยังถูกต้อง ≠ stale — flag เฉพาะที่ผิดหรือไม่ใช้แล้ว
- ระมัดระวัง institutional knowledge — เสนอ archive มากกว่า delete

## Expected Outcome

- รายงาน notes ที่ stale/contradicting/duplicate พร้อม evidence
- Action recommendations ต่อ note
- ภาพรวม knowledge coverage
