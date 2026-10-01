---
name: deep-research-improve
description: Research หา improvement opportunities — best practices, modern alternatives, known issues — feed เข้า improve-*/deep-review
argument-hint: "[area-or-topic]"
related:
  - deep-research
  - follow-improve
  - follow-optimize
  - deep-review
  - deep-review-then-fix
  - improve-devin-global-skills
  - report
---

## Goal

Research เพื่อหา improvement opportunities ของ project/area ที่ระบุ — best practices ปัจจุบัน, modern alternatives, known issues/pitfalls, benchmarks — แล้วส่ง findings เข้า `/follow-improve` convention (review → confirm → fix)

## Scope

ใช้เมื่อต้องการ research-driven improvement — เช่น "stack นี้ยัง current ไหม", "มี pattern ที่ดีกว่าไหม", "tools ใหม่ที่แทนของเดิม" — ไม่ใช่ scan codebase (นั่นคือ `/deep-review`) แต่คือ research ภายนอกเพื่อเทียบกับสิ่งที่มี

## Execute

### 1. Define Improvement Area

> Goal: ระบุว่าจะ improve อะไรและเทียบกับอะไร

1. ระบุ area: dependency, pattern, tool, config, architecture, performance approach
2. บันทึก current state จาก codebase (`/scan-codebase`, manifest, config ที่มี)
3. ถ้า area ตรง `improve-*` domain → จด domain เพื่อ route findings ตอนจบ

### 2. Research Current Best Practices

> Goal: รู้ว่า "ดี" ตอนนี้หน้าตาเป็นอย่างไร

1. รัน general pipeline ของ `/deep-research`: official docs, changelogs, migration guides, benchmarks
2. หา modern alternatives + deprecation notices ของสิ่งที่ใช้อยู่ (`/deep-research dependencies` ถ้าเป็น deps, `/research-setup-integrations` ถ้าเป็น integrations)
3. รวบรวม known issues/pitfalls จาก GitHub issues, RFCs, community comparisons

### 3. Gap Analysis

> Goal: เทียบ current vs best practice เป็นรายการ findings

1. สร้าง findings list: `Gap`, `Current`, `Best Practice`, `Evidence/Source`, `Impact`, `Effort`
2. จัดกลุ่มตาม `improve-*`/`optimize-*` domain หรือ `/deep-review` review domain ที่ตรง
3. แยก quick wins ออกจาก structural changes

### 4. Hand Off To Improve Flow

> Goal: findings เข้าสู่ improvement convention

1. ทำ `/report` table ของ findings พร้อม sources
2. Route ตาม `/follow-improve` — findings ที่ตรง domain → `improve-*` skill นั้น; ไม่ตรง → `/deep-review` domain + `/deep-review-then-fix` หลัง user confirm
3. ถ้าเป็น repo นี้ (devin skills) → `/improve-devin-global-skills`

## Rules

- Findings ต้องมี evidence + source + version/ปี — ห้ามเสนอ improvement ที่ไม่มีฐาน
- Research เท่านั้น — ไม่แก้ไขใน workflow นี้; fix ผ่าน `/follow-improve` convention หลัง user confirm
- Current-state claims ต้องเช็คจาก codebase จริงก่อนเทียบ — ไม่เดา
- ใช้ `/deep-review`, `/follow-optimize` ถ้าจำเป็น

## Expected Outcome

- Findings table: gaps เทียบ best practices พร้อม evidence, impact/effort, routed ไป improve path ที่ถูกต้อง
