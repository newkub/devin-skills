---
name: review-devin-global-harness-check-skills
description: Check skills layer — script findings + manual quality pass ที่ script ตรวจไม่ได้
argument-hint: "[skill-name|all]"
related:
  - update-devin-global-skills
  - update-devin-global-skills
  - report
---

## Goal

Run the `skills` layer of `/review-devin-global-harness` แบบ focused — script ครอบ mechanical, subskill นี้ทำ manual interpretation/quality

## Scope

- ใช้เมื่อ `/review-devin-global-harness` dispatch มาที่ `skills` หรือเรียก standalone บน skill เดียว/ทั้งหมด
- script (`bun run review`) ตรวจ mechanical แล้ว — subskill นี้ทำเฉพาะส่วนที่ script ตรวจไม่ได้

## Execute

### 1. Collect Script Findings

> Goal: baseline จาก automated checks

1. รัน `bun run review` ใน skill directory (ถ้ายังไม่ได้รัน)
2. อ่าน `review-skills-report.json` — เป็น input ไม่ใช่ผลลัพธ์สุดท้าย

### 2. Manual Quality Pass

> Goal: ตรวจสิ่งที่ script ทำไม่ได้

ทำตาม `../../SKILL.md` (`## Checklists → Content Quality`)

1. เช็ค evidence แต่ละ script finding — แยก false positives
2. เกณฑ์ที่ script ใช้อยู่ใน `../../SKILL.md` (`## Checklists → Package Checks`)

### 3. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Skill`, `Category`, `Severity`, `Finding`, `Evidence`, `Action`

## Rules

- Review เท่านั้น ไม่แก้ไข SKILL.md — refactor ทำใน parent Step 6 หลัง review ครบ
- ทุก finding มี skill path + evidence
- ไม่ซ้ำ mechanical checks ที่ script ครอบแล้ว — manual เฉพาะ interpretation

## Expected Outcome

- Skills-layer findings แยก script-confirmed vs manual-found
- False positives ถูกกรองออกพร้อมเหตุผล
