---
name: improve-monorepo
description: หา improvements ของ monorepo — workspace boundaries, cross-package deps, tooling — รวม findings แล้วแก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "monorepo improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-architecture + review-config + review-dx` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "monorepo ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-architecture` — package boundaries, dependency direction, layering
- `review-config` — shared configs, catalog drift, task pipeline
- `review-dx` — build times, editor tooling, task orchestration

### Tools And Libraries

| Skill | ใช้เมื่อ |
|---|---|
| `follow-tool-turborepo` | Turborepo — task pipelines, caching |
| `follow-tool-moonrepo` | moon — workspace orchestration, boundaries |


## Execute

### 1. Review

1. รับ `<scope>` จาก argument หรือ conversation context — ไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-architecture + review-config + review-dx` — boundary violations, dep cycles, config drift, uncached tasks

### 2. Present Findings

1. ทำ `/report` แสดง monorepo improvements: No., Finding, Severity, Fix Skill

### 3. Fix All Findings

1. ทำ `/deep-review-then-fix` แก้ทุก finding ตาม Domain Map
2. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains `review-architecture + review-config + review-dx`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized monorepo improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix`