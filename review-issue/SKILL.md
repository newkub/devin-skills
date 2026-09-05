---
name: review-issue
description: ตรวจสอบ issue ใดๆ เพื่อดูความชัดเจน, scope, acceptance criteria และความพร้อม
argument-hint: "[scope]"
related:
  - review-github-issue
  - follow-best-practice
  - suggest-next-action
  - deep-review-codebase
  - resolve-errors
---

## Goal

ตรวจสอบ issue (ไฟล์, chat หรือ external tracker) เพื่อดูคุณภาพ, ความชัดเจน, ความครบถ้วน และความพร้อมก่อน implementation

## Scope

ใช้สำหรับ issue source ใดๆ ไม่ใช่แค่ GitHub ครอบคลุม title, description, acceptance criteria, scope, dependencies, risks และ next steps ที่นำไปปฏิบัติได้ ไม่แก้ไข issue เว้นแต่ได้รับการร้องขอ

ดูเพิ่มเติม: /deep-review-codebase

## Execute

### 1. Collect Issue Content

> Goal: รับข้อความและ context ของ issue แบบเต็ม

ทำตาม [references/collect-issue-content.md](references/collect-issue-content.md)

### 2. Check Completeness

> Goal: ยืนยันว่า issue มีข้อมูลเพียงพอที่จะเริ่มงานได้

ทำตาม [references/issue-completeness.md](references/issue-completeness.md)

### 3. Assess Quality

> Goal: ระบุปัญหาด้านความชัดเจนและความเป็นไปได้

ทำตาม [references/issue-quality.md](references/issue-quality.md)

### 4. Rate Severity And Recommend

> Goal: สร้างรายงานการตรวจสอบที่นำไปปฏิบัติได้

ทำตาม [references/issue-rating.md](references/issue-rating.md)

## Rules

### 1. Neutrality
- ประเมิน issue ไม่ใช่ผู้เขียน
- ทุกผลการตรวจต้องมี quote หรือ reference จากข้อความ issue

### 2. No Hidden Edits
- ห้ามแก้ไข issue ต้นฉบับ เว้นแต่ผู้ใช้ร้องขออย่างชัดเจน
- หากแนะนำการแก้ไข ให้นำเสนอเป็น draft ก่อน

### 3. Scope Boundaries
- หาก issue มีคำขอที่ไม่เกี่ยวข้องกันหลายรายการ ให้แนะนำการแยก
- ห้ามเพิ่มงานนอกเหนือ scope ที่ระบุ

### 4. Actionable Output
- ทุกผลการตรวจต้องมีข้อแนะนำที่เป็นรูปธรรม
- ผลลัพธ์ต้องระบุความพร้อมโดยรวม: Ready, Needs Clarification, Blocked หรือ Not Ready

- ใช้ /review-github-issue ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น

## Metrics

- ดู metrics สำหรับ review ใน [references/scoring.md](references/scoring.md)

## Expected Outcome

- รายงานการตรวจสอบ issue พร้อม severity, evidence และข้อแนะนำ
- ระบุความพร้อมอย่างชัดเจน
- รายการข้อมูลที่ขาดหายหรือ blockers
- next action หรือ skill ที่แนะนำให้ใช้
