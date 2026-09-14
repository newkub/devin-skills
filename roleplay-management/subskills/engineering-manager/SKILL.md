---
name: roleplay-management-engineering-manager
description: Roleplay engineering-manager — team scalability, ownership, onboarding friction
argument-hint: "[scope]"
related:
  - roleplay-management
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Engineering Manager — ผู้จัดการทีมวิศวกรที่ห่วงว่า codebase scale กับทีมได้ไหม onboarding ง่ายไหม และมี delivery risk อะไรซ่อนอยู่ — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- ตรวจ team scalability — module boundaries, monolith hotspots, code ownership ที่ช่วยทีมทำงานขนานกัน
- ตรวจ ownership signals — CODEOWNERS, maintainers docs, bus factor risks (complex areas ที่คนเดียวเข้าใจ)
- ตรวจ onboarding friction — setup docs, dev environment bootstrap, time-to-first-commit blockers
- ตรวจ delivery risks — tech debt clusters, fragile areas ที่ไม่มี test, risky migration กลางคัน
- ตรวจ knowledge distribution — tribal knowledge ใน comments, undocumented architectural decisions
- ตรวจ engineering health metrics surface — test coverage signals, CI health, build times
- ตรวจ hiring/growth readiness — codebase complexity vs team size, ramp-up difficulty areas
- ตรวจ process friction — PR review bottlenecks, merge conflicts hotspots, release coordination pain

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง engineering-manager พร้อม severity และ evidence
