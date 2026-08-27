---
name: review-by-stakeholder
description: Review project โดยเลือก roleplay stakeholders ตาม status และ context ของ project
related:
  - consider-use-subagents
  - follow-devin-global-subagents
  - scan-codebase
  - deep-validate
  - report
  - suggest-next-action
---

## Goal

Review project จากหลายมุมมองของ stakeholder โดยเลือก `roleplay-*` ตาม status, stack, และ context ของ project ไม่ต้อง run ทั้งหมด

## Scope

ใช้กับ project ที่ต้องการ multi-perspective review โดยเลือก roleplay ที่เหมาะสม ครอบคลุม web, mobile, library, data, enterprise, และ open source

## Execute

### 1. Detect Project Status

> Goal: รู้ context ก่อนเลือก stakeholder

1. ดูรายละเอียดใน [references/detect-project-status.md](references/detect-project-status.md)
2. บันทึก findings พร้อม severity และ evidence

### 2. Select Stakeholders

> Goal: เลือก `roleplay-*` ตาม context

1. ดูรายละเอียดใน [references/select-stakeholders.md](references/select-stakeholders.md)
2. บันทึก findings พร้อม severity และ evidence

### 3. Run Stakeholder Reviews

> Goal: เก็บ findings จากแต่ละ roleplay

1. ดูรายละเอียดใน [references/run-stakeholder-reviews.md](references/run-stakeholder-reviews.md)
2. บันทึก findings พร้อม severity และ evidence

### 4. Aggregate Findings

> Goal: รวม findings เป็นมุมมองเดียว

1. ดูรายละเอียดใน [references/aggregate-findings.md](references/aggregate-findings.md)
2. บันทึก findings พร้อม severity และ evidence

### 5. Generate Stakeholder Report

> Goal: สร้างรายงาน multi-stakeholder

1. ดูรายละเอียดใน [references/generate-stakeholder-report.md](references/generate-stakeholder-report.md)
2. บันทึก findings พร้อม severity และ evidence

## Rules

### 1. Context First
- ไม่เลือก stakeholder ก่อนดู project status
- ถ้า context ไม่ชัด → ทำ `/scan-codebase` แล้วถาม user
- ถ้า user ระบุ stakeholder เอง → ใช้ตามที user ระบุ

### 2. Selection Discipline
- เลือก 3-7 บทบาท ไม่เกิน
- ไม่ run ทั้งหมด เพราะบทบาทบางตัวไม่เกี่ยวข้อง
- ระบุเหตุผลทีเลือกหรือไม่เลือกแต่ละบทบาท

### 3. Parallel Execution
- พยายามใช้ `/consider-use-subagents` หรือ `/follow-devin-global-subagents` เพื่อ run ขนาน
- ถ้าไม่สามารถ parallel ได้ → ทำ sequential ตาม priority

### 4. Evidence-Based
- ทุก finding ต้องมี file path/line หรือ code snippet
- ระบุ roleplay ที่พบ
- ถ้าเป็น assumption ให้ระบุชัดเจน

### 5. No Runtime Execution In Orchestrator
- `review-by-stakeholder` ไม่รัน test, build, server, browser เอง
- ให้แต่ละ roleplay ทำงานของตัวเองตามกฎของ roleplay
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow

## Expected Outcome

- รายงาน multi-stakeholder review จาก roleplay ที่เลือก
- ตาราง findings มี Severity, Stakeholder, Dimension, Location, Issue, Impact, Recommendation
- stakeholder coverage map พร้อมเหตุผล
- สรุป top 5 findings
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
