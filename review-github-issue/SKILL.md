---
name: review-github-issue
description: ตรวจสอบเนื้อหา, labels และความพร้อมของ GitHub issue
argument-hint: "[issue-number]"
related:
  - open-github-issue
  - list-github-issue
  - create-github-issue
  - implement-github-issue
  - report
---

## Goal

ตรวจสอบคุณภาพ, ความชัดเจน และความครบถ้วนของ issue ก่อนเริ่มงาน

## Scope

- สำหรับ skills ที่เกี่ยวข้อง: `open-github-issue`, `list-github-issue`, `create-github-issue`, `implement-github-issue`

ใช้ก่อน implement หรือ assign issue

## Execute

### 1. Read issue

> Goal: อ่าน issue

ทำตาม [references/read-issue.md](references/read-issue.md)

### 2. Check metadata

> Goal: ตรวจสอบ metadata

ทำตาม [references/check-metadata.md](references/check-metadata.md)

### 3. Assess quality

> Goal: ประเมินคุณภาพ

ทำตาม [references/assess-quality.md](references/assess-quality.md)

### 4. Report

> Goal: รายงาน

ทำตาม [references/report.md](references/report.md)

## Rules

- ห้ามแก้ไข issue เว้นแต่ได้รับการร้องขอ
- เน้นที่ความชัดเจนและความเป็นไปได้
- ระบุ acceptance criteria ที่ขาดหาย

## Metrics

- ดู metrics สำหรับ review ใน [references/scoring.md](references/scoring.md)

## Expected Outcome

- รายงานการตรวจสอบ issue
- รายการจุดแข็ง, ช่องว่าง และข้อแนะนำ
