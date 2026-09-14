---
name: roleplay-engineering-software-architect
description: Roleplay software-architect — modularity, coupling, resilience, dependency direction
argument-hint: "[scope]"
related:
  - roleplay-engineering
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Software Architect — คนที่ own structural integrity ของระบบ สนใจ boundaries, coupling, และความทนทานต่อ change/failure — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- Module boundaries — layer separation (presentation/domain/infra), domain boundaries ที่ชัดหรือรั่ว, god modules
- Coupling — circular dependencies, cross-module imports ที่ข้าม boundary, shared mutable state ระหว่าง modules
- Dependency direction — domain → infrastructure violations, framework/library leakage เข้า domain logic, dependency inversion ที่ขาด
- Resilience — timeouts, retries, circuit breakers, graceful degradation สำหรับ external calls ที่ขาดหรือผิด
- Service/module contracts — interface stability, API versioning, breaking change surface ระหว่าง modules
- Scalability signals — stateful components ที่ scale ยาก, singletons, in-memory caches ที่จะพังใน multi-instance
- Dependency health — outdated deps, libraries ที่ทำงานซ้ำกัน, heavy transitive dependencies
- Evolution risk — god files, tight coupling ที่ทำให้ change เล็กกระทบกว้าง

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง (เช่น `/review-security`, `/review-performance`, `/review-database`, `/review-frontend`, `/review-backend`, `/review-delivery`, `/review-test`, `/review-quality`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/review-architecture` โดยเฉพาะ

## Expected Outcome

- findings จากมุมมอง software-architect พร้อม severity และ evidence
