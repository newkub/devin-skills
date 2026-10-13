---
name: improve-architecture
description: หา architecture improvements ใน scope — coupling, boundaries, dependency direction — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-monorepo
  - improve-scalability
  - follow-architecture
  - refactor
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "architecture improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-architecture` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "architecture ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-architecture` — pattern conformance, coupling/cohesion, dependency direction, layer/feature boundary violations, circular dependencies, god modules (pattern guides อยู่ที่ `deep-review/SKILL.md` `## Pattern Guides`)
- เลือก/สลับ pattern (clean vs layered) → `/follow-architecture`; apply restructuring จริง → `/refactor`; workspace/task graph → `/improve-monorepo`; load-growth design → `/improve-scalability`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-architecture` — circular imports, dependency ผิดทิศทาง, boundary leaks, modules ผิด pattern, coupling สูง
3. รวบรวม prioritized list พร้อม severity และ evidence — breaking dependency direction เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-architecture`)
2. structural moves (ย้ายไฟล์/แยก layer) ทำผ่าน `/refactor` เป็นขั้นๆ ให้ bisect ได้ — ห้าม big-bang restructure
3. pattern เป้าหมายไม่ชัด → `/follow-architecture` เลือกก่อน แล้วค่อยแก้ตาม pattern นั้น
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-architecture`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ทุก structural change ต้อง preserve behavior — tests เดิมต้องผ่านก่อน-หลังเหมือนเดิม
- ห้ามเปลี่ยน architecture pattern กลางคร่อมหลาย commit ย่อย (ทำทีละ step ด้วย `/refactor`)
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized architecture improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` + `/refactor` — dependency graph ไร้ circular, boundaries ครบ
