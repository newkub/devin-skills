---
name: review-github-issue
description: ตรวจสอบเนื้อหา, labels และความพร้อมของ GitHub issue
argument-hint: "[issue-number]"
related:
  - open-github-issue
  - list-github-issue
  - create-github-issue
  - implement-github-issue
---

## Goal

ตรวจสอบคุณภาพ, ความชัดเจน และความครบถ้วนของ issue ก่อนเริ่มงาน

## Scope
- สำหรับ skills ที่เกี่ยวข้อง: `open-github-issue`, `list-github-issue`, `create-github-issue`, `implement-github-issue`

ใช้ก่อน implement หรือ assign issue

## Execute

### 1. Read issue

> Goal: อ่าน issue

1. รัน gh issue view <number>
1. อ่าน title, body, comments, linked PRs

### 2. Check metadata

> Goal: ตรวจสอบ metadata

1. ยืนยัน labels, assignee, milestone, project
1. ตรวจ sub-issues หรือ dependencies

### 3. Assess quality

> Goal: ประเมินคุณภาพ

1. ตรวจว่ามี goal และ scope ที่ชัดเจน
1. ระบุข้อมูลที่ขาดหาย
1. แนะนำการปรับปรุง

### 4. Report

> Goal: รายงาน

1. สรุปผลการตรวจสอบ
1. ส่งคืนข้อแนะนำที่นำไปปฏิบัติได้

## Rules

- ห้ามแก้ไข issue เว้นแต่ได้รับการร้องขอ
- เน้นที่ความชัดเจนและความเป็นไปได้
- ระบุ acceptance criteria ที่ขาดหาย

## Expected Outcome

- รายงานการตรวจสอบ issue
- รายการจุดแข็ง, ช่องว่าง และข้อแนะนำ