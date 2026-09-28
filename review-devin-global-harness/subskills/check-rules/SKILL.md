---
name: review-devin-global-harness-check-rules
description: Check global rules layer — skill refs มีจริง, ไม่ขัดแย้ง, ไม่ stale
argument-hint: "[all]"
related:
  - update-devin
  - check-reference
  - report
---

## Goal

Run the `global rules` layer of `/review-devin-global-harness` แบบ focused — `global_rules.md` อ้างถึงสิ่งที่มีจริงและไม่ขัดแย้งกันเอง

## Scope

- ใช้เมื่อ `/review-devin-global-harness` dispatch มาที่ `rules`/`global-rules` หรือเรียก standalone
- ไม่มี script — manual เท่านั้น

## Execute

### 1. Rules Checks

> Goal: ครอบคลุมทุก rules dimension

ทำตาม `../../references/refs-check-global-rules.md`

1. skills ที่อ้างมีจริง — ทุก `/skill-name` ใน rules มี `*/SKILL.md` ตรงกัน
2. ลำดับ Execute ไม่ขัดแย้ง — rules ไม่สั่ง A ก่อน B ในขณะที่ส่วนอื่นสั่ง B ก่อน A
3. ไม่ stale — skill ที่ถูก rename/ลบยังถูกอ้าง, workflow เก่าที่เลิกใช้แล้ว
4. consistency กับ layers อื่น — rules ไม่สั่งสิ่งที่ skills ปัจจุบันทำต่างออกไป

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Rule/Section`, `Category`, `Severity`, `Finding`, `Evidence`, `Action`

## Rules

- Review เท่านั้น ไม่แก้ไข `global_rules.md` ระหว่าง check
- ทุก finding มี line reference + evidence
- stale refs ไป skill ที่ลบแล้ว = High; wording inconsistency = Low

## Expected Outcome

- Rules findings แยกตาม category (broken ref, contradiction, stale)
- Cross-layer inconsistencies identified พร้อม action
