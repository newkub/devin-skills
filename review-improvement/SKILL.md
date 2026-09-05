---
name: review-improvement
description: Review scope แล้วบอกว่า improve อะไรได้บ้าง พร้อม map ไปยัง improve-* skill ที่เหมาะสม
argument-hint: "[scope-or-target]"
related:
  - deep-review
  - scan-codebase
  - review-codebase-everything
  - improve-codebase-everything
  - review-architecture
  - review-security
  - review-performance
  - review-quality
  - review-dependencies
  - review-accessibility
  - report-table
  - suggest-next-action
  - idea
  - ask-me
---

## Goal

Review scope ที่ user ระบุ (project, workspace, file, feature หรือ skill) แล้วตอบคำถามว่า "improve อะไรได้บ้าง" พร้อม map แต่ละ finding ไปยัง `improve-*` หรือ `optimize-*` skill ที่เหมาะสม

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "ควร improve อะไรอีก" โดยไม่ต้องการ review เชิงลึกเฉพาะด้าน — เป็น meta-review ที่สแกนหลายมิติแล้วจัดลำดับ ไม่แก้ไข code โดยตรง ให้ส่งต่อไปยัง `improve-*` skill ที่เหมาะสม

## Execute

### 1. Understand Scope

> Goal: เข้าใจ scope และ context ที่จะ review

1. รับ `scope-or-target` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน
2. ทำ `/scan-codebase` เพื่อเข้าใจ structure, tech stack และ conventions
3. อ่าน `AGENTS.md`, `README.md`, manifests ถ้ามี
4. ถ้า scope ไม่ชัดหรือใหญ่เกิน → `/ask-me` ให้ user จำกัด scope

### 2. Multi-Dimension Scan

> Goal: สแกนครบทุกมิติที่ improve ได้

ตรวจแต่ละ dimension แบบเบา (ไม่ใช่ deep review เต็มรูปแบบ):

| No. | Dimension | ดูอะไร | Fix Skill |
|-----|-----------|--------|-----------|
| 1 | Architecture | boundaries, coupling, SRP, layer violations | `/improve-architecture` |
| 2 | Security | secrets, auth, injection, headers, deps vulns | `/improve-security` |
| 3 | Performance | bundle, rendering, queries, memory, network | `/optimize-codebase-everything` |
| 4 | Quality | naming, duplication, complexity, dead code | `/improve-codebase-everything` |
| 5 | Dependencies | outdated, vulnerable, unused, licenses | `/review-dependencies` |
| 6 | Accessibility | WCAG violations, keyboard, contrast | `/improve-accessibility` |
| 7 | Docs | stale docs, missing guides, broken links | `/improve-docs` |
| 8 | Tests | coverage gaps, missing edge cases | `/improve-test-everything` |
| 9 | Observability | missing logs, metrics, alerts | `/improve-observability` |

### 3. Collect And Deduplicate

> Goal: รวม findings ไม่ซ้ำและมี evidence

1. รวบรวม findings จากทุก dimension พร้อม file/line evidence
2. ลบ findings ที่ซ้ำกันหรือเป็น symptom ของ root cause เดียวกัน
3. ถ้า dimension ใดต้องลงลึก → ทำ `/review-architecture`, `/review-security`, `/review-performance`, `/review-quality`, `/review-codebase-everything`, `/review-accessibility` หรือ `/deep-review` ตามด้านที่พบ

### 4. Prioritize And Map

> Goal: จัดลำดับ findings และ map ไปยัง fix skill

1. จัด severity: Critical → High → Medium → Low
2. ประเมิน impact vs effort ต่อ finding
3. map แต่ละ finding ไปยัง `improve-*` หรือ `optimize-*` skill ที่เหมาะสม
4. ถ้าไม่มี skill ตรง → ทำ `/idea` เพื่อ explore options หรือลงลึกด้วย `/deep-review`

### 5. Report

> Goal: สรุปสิ่งที่ improve ได้พร้อม action plan

1. ทำ `/report-table` พร้อม columns: No., Dimension, Severity, Finding, Evidence, Fix Skill
2. ระบุ top 3-5 improvements ที่คุ้มที่สุด
3. ทำ `/suggest-next-action` แนะนำ skill แรกที่ควรทำ

## Rules

### 1. Breadth Over Depth

- skill นี้สแกนกว้างไม่ลงลึก — ถ้าต้องการ depth ให้ใช้ `review-*` เฉพาะด้านหรือ `/deep-review`
- ทุก finding ต้องมี evidence ไม่เดา

### 2. Actionable Only

- แสดงเฉพาะ findings ที่มี fix path ชัดเจน
- ทุก finding ต้อง map ไปยัง skill ที่ทำได้จริง — ถ้าไม่มี → ระบุว่า "no skill" พร้อมแนวทางแก้

### 3. No Fixes During Review

- ไม่แก้ไข code ระหว่าง review — ส่งต่อ `improve-*` skill เท่านั้น
- ไม่สร้าง findings จาก style preference ที่ไม่มีผลจริง

## Expected Outcome

- ตาราง findings ครบทุก dimension พร้อม severity และ evidence
- ทุก finding map ไปยัง `improve-*`/`optimize-*` skill
- Top improvements เรียงลำดับพร้อม next action ชัดเจน
