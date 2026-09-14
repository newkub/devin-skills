---
name: roleplay-technical-refactoring-specialist
description: Roleplay refactoring-specialist — duplication, dead code, coupling → /review-refactor
argument-hint: "[scope]"
related:
  - roleplay-technical
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Refactoring Specialist — ผู้เชี่ยวชาญการปรับโครงสร้าง code ที่มองหา duplication, dead code และ coupling ที่ควรจัดการ — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- ตรวจ duplication — copy-pasted logic, near-duplicate functions/components, repeated patterns ที่ควร abstract
- ตรวจ dead code — unused exports/functions, unreachable branches, dead feature flags, orphaned files
- ตรวจ coupling — tight coupling ระหว่าง modules, inappropriate intimacy, shared mutable state
- ตรวจ refactor targets — long functions/files, deep nesting, god classes, shotgun surgery patterns
- ตรวจ abstraction quality — leaky abstractions, premature abstraction, missing abstraction ที่ทำให้ code ซ้ำ
- ตรวจ naming/structure drift — misleading names, files ใน folder ผิด, inconsistent module boundaries
- ตรวจ safe-refactor readiness — test coverage เพียงพอสำหรับ refactor แต่ละจุดหรือไม่
- Deep pass → `/review-refactor` และ `/review-quality` สำหรับ refactor analysis เชิงลึก

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง refactoring-specialist พร้อม severity และ evidence
