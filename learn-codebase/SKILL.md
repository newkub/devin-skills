---
name: learn-codebase
description: สร้าง learning path ของ codebase — ลำดับไฟล์ที่ควรอ่านและ concept map สำหรับคนใหม่
argument-hint: "[area-or-role]"
related:
  - improve-onboarding
  - report-architecture-diagram
  - scan-codebase
  - analyze-project
  - report-file-structure
  - create-report-in-dot-devin
  - gen-runbook
---

## Goal

สร้าง guided learning path จาก codebase จริง — ลำดับไฟล์/modules ที่ควรอ่าน, concepts ที่ต้องเข้าใจ และ map ของ flow หลัก — เพื่อให้คนใหม่หรือ agent เข้าใจ project เร็ว

## Scope

- ใช้เมื่อต้องเข้าใจ codebase ที่ไม่คุ้น — onboarding, handoff, หรือ agent context building
- ครอบคลุม: entry points, core domain, data flow, key abstractions, จุดที่คนมักสับสน
- Output: learning path document ใน `.devin/` หรือแสดงในแชท — ไม่แก้ code

## Execute

### 1. Map The Territory

> Goal: สร้างภาพรวมโครงสร้าง

1. ใช้ `/scan-codebase` และ `/analyze-project` — entry points, layers, boundaries
2. ทำ `/report-file-structure` หรือ `/report-architecture-diagram` เป็น base map
3. ระบุ core domain vs peripheral (infra, utils, generated)

### 2. Identify Critical Path

> Goal: หาเส้นทาง "เข้าใจได้เร็วสุด"

1. เรียงลำดับการอ่าน: entry → config/boot → domain core → 1-2 feature flows แบบ end-to-end
2. เลือก flows ที่ represent รูปแบบหลักของ codebase (happy path + 1 edge)
3. ตัด: generated code, vendored, legacy ที่ไม่ได้ใช้, tests (อ่านทีหลัง)

### 3. Build Concept Ladder

> Goal: concepts ที่ต้องรู้ก่อนอ่านแต่ละส่วน

1. ระบุ prerequisite knowledge ต่อ section: framework conventions, patterns ที่ใช้, domain terms
2. ลิงก์ไป skills/docs ที่เกี่ยว (`follow-*` ที่ตรง stack)
3. ระบุ "gotchas" — จุดที่ code หลอกหรือ convention แปลก

### 4. Write Learning Path

> Goal: เอกสารที่ตามได้จริง

โครงสร้าง output:

```markdown
# Learning Path: <project>

## Level 0: Big Picture (10 min)
- อ่าน: README, `docs/architecture.*`
- เข้าใจ: <core flow diagram>

## Level 1: Entry Points
- อ่าน: `src/main.ts` → `src/app.ts` — สิ่งที่เกิดตอน boot
- Concept: <framework init pattern>

## Level 2: Core Domain
- อ่าน: `<domain files>` — models และ rules หลัก
- Concept: <domain pattern>

## Level 3: Feature Walkthrough
- ตาม flow: `<route>` → `<handler>` → `<service>` → `<repo>` → DB
- Concept: <request lifecycle>

## Level 4: Depth
- tests, edge cases, config, deployment

## Gotchas
- <สิ่งที่คนมักพลาด>
```

5. บันทึกด้วย `/create-report-in-dot-devin` ถ้า user ต้องการเก็บ

## Rules

### 1. From Real Code

- ทุก step ต้องชี้ไฟล์จริงที่ verify แล้ว — ไม่ใช่ generic "อ่าน src/"
- เส้นทางต้อง trace ได้จริงใน code

### 2. Minimal Path

- เลือกเส้นทางสั้นที่สุดที่ให้ความเข้าใจ 80% — ไม่ใช่ครอบทุกไฟล์
- ระบุสิ่งที่ข้ามและเหตุผล

### 3. Role Aware

- ปรับ path ตามบทบาทถ้าระบุ (frontend vs backend vs fullstack)
- ภาษา/depth ตาม audience — dev ใหม่ต้องการ context มากกว่า senior

## Expected Outcome

- Learning path ที่ตามอ่านได้จริงพร้อมไฟล์และ concepts
- Architecture map และ critical flows ชัดเจน
- Gotchas ที่ช่วยเลี่ยงความเข้าใจผิด
