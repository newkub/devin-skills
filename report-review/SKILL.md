---
name: report-review
description: Alias for deep-review — merged into the canonical skill (report structure อยู่ใน Step 7)
argument-hint: "[scope]"
related:
  - deep-review
  - report
  - suggest-next-action
---

## Goal

Skill นี้ถูก merge เข้ากับ `/deep-review` แล้ว — ใช้ `/deep-review` เป็น canonical skill (report structure, executive summary, severity/status symbols รวมอยู่ใน `deep-review` Step 7)

## Scope

ใช้เมื่อ caller เรียกชื่อ alias เดิม — forward ทั้งหมดไปยัง canonical skill

## Execute

1. ทำ `/deep-review` ตามขอบเขตและ workflow เดิมทั้งหมด — report spec อยู่ที่ Step 7 (Report To .devin/Reports)

## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias — แก้ที่ canonical skill เท่านั้น
- รักษา backward compatibility ของชื่อ alias
- ใช้ /suggest-next-action ถ้าจำเป็น


## Expected Outcome

- ผลลัพธ์เหมือน `/deep-review` — report มีครบ Executive Summary, per-domain sections, หลักฐาน, `ใน update-review-cli` column, Fix Status, Recommendations
