---
name: idea-improve
description: สร้าง improvement ideas จาก context — quick wins, strategic, Extends/New พร้อม impact/effort
argument-hint: "[scope]"
related:
  - idea
  - idea-features
  - idea-merge
  - improve
  - review-gaps
  - scan-codebase
  - think-reframe
  - report
  - report-todo
  - then-apply
  - suggest-next-action
---

## Goal

สร้าง improvement ideas จาก user context — วิเคราะห์ gaps, pain points และ opportunities แล้วเสนอไอเดียที่ solve real problem พร้อม priority

## Scope

ใช้เมื่อ user ถามว่า scope ใดๆ "improve อะไรได้บ้าง" ในเชิงไอเดีย — ต่างจาก `/improve` ที่ review-first (runnable findings → confirm → fix) skill นี้คือ idea-first: brainstorm improvements แบบ `Extends`/`New`/`Remove` ก่อน แล้วค่อยส่งต่อ

- ไม่รวม feature ideation เฉพาะทาง (ใช้ `/idea-features`), merge/consolidation (ใช้ `/idea-merge`), UX/UI ideas (ใช้ `/idea-uxui`)
- ไม่ fix เอง — ideas ที่ confirm ส่งต่อ `/improve` หรือ `## Fix` ของ `review-*` ที่ตรง domain

## Execute

### 1. Analyze Context

> Goal: เข้าใจ scope และ pain points จริง

1. รับ `scope` จาก argument — ถ้าไม่มีใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/scan-codebase` เพื่อดู structure, stack, state ปัจจุบัน
3. ถ้าต้องการ evidence-based gaps → ทำ `/review-gaps` หรืออ่าน findings ล่าสุดใน `.devin/reports/`
4. ระบุ pain points: friction, debt, missing capability, manual steps, inconsistency

### 2. Generate Ideas

> Goal: ได้ improvement ideas ที่หลากหลายและ concrete

1. `Extends` — ปรับสิ่งที่มีอยู่ให้ดีขึ้น (faster, clearer, safer, cheaper)
2. `New` — capability/automation ที่ยังไม่มี
3. `Remove` — สิ่งที่ควรตัดทิ้ง (dead weight, redundancy, over-engineering)
4. ใช้ `/think-reframe` ถ้า ideas จำเจหรือติดกรอบเดิม
5. ทุก idea ต้องมี problem ที่ solve ชัดเจน — ห้าม generic filler

### 3. Prioritize And Report

> Goal: prioritized list พร้อม next action

1. จัดอันดับตาม impact/effort — แยก quick wins กับ strategic
2. ทำ `/report table` columns: `No.`, `Idea`, `Type`, `Problem`, `Impact`, `Effort`, `Fix Skill`
3. Impact: High = เปลี่ยนผลลัพธ์จริง / Medium = ดีขึ้นชัดเจน / Low = nice-to-have
4. map แต่ละ idea ไปยัง skill ที่ทำได้จริง (`improve`, `review-*` `## Fix`, `update-*`, `follow-*`)
5. ทำ `/suggest-next-action` — ถ้า user confirm idea ไหน → `/then-apply` ส่งไป skill นั้น

## Rules

### 1. Context-Based

- ทุก idea ต้องมาจาก context จริง — file path, finding, หรือ observed pain point
- ห้ามเสนอ improvement ที่ไม่มี problem หลังรองรับ

### 2. Actionable And Numbered

- continuous numbering, ระบุ Type (`Extends`/`New`/`Remove`)
- ทุก idea map ไป executable skill — ถ้าไม่มี skill รองรับให้ระบุว่าต้องสร้างใหม่

### 3. No Overlap With Improve

- skill นี้ generate ideas เท่านั้น — ไม่ run review, ไม่ fix
- ถ้า user ต้องการ review-driven fixes โดยตรง → แนะนำ `/improve` แทน
- ใช้ `/report-todo` ถ้าจำเป็น


## Expected Outcome

- Improvement ideas พร้อม Type, Impact, Effort และ Fix Skill ต่อรายการ
- ตาราง `/report` ที่ sort ตาม impact/effort
- Next action ชัดเจน — idea ที่ confirm ไป `/improve` หรือ `review-*` `## Fix`
