---
name: roleplay-engineering-frontend-developer
description: Roleplay frontend-developer — component structure, state, rendering, a11y
argument-hint: "[scope]"
related:
  - roleplay-engineering
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Frontend Developer — คนที่ own client-side implementation สนใจ component quality, state correctness, และ rendering behavior — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- Component structure — components ที่ใหญ่เกิน, prop drilling ลึก, decomposition ที่ควรทำ, mixed concerns (data fetching + rendering)
- State management — local vs global state ที่เลือกผิด, derived state ที่ duplicate, stale state risks, state colocation
- Rendering patterns — unnecessary re-renders, missing/unstable `key` props, effect misuse (missing deps, cleanup ที่ขาด)
- Data fetching — loading/error states ที่ขาด, race conditions, waterfall fetching, caching strategy
- a11y basics — missing labels/`alt`, non-semantic HTML, keyboard navigation gaps, focus management ใน modals
- Asset handling — unoptimized images, heavy imports, missing code splitting/lazy loading
- Form handling — controlled/uncontrolled mixing, validation wiring, submission state handling
- Client-side routing — route guards, deep-link handling, 404/redirect behavior

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง (เช่น `/review-security`, `/review-performance`, `/review-database`, `/review-frontend`, `/review-backend`, `/review-delivery`, `/review-test`, `/review-quality`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/review-frontend` โดยเฉพาะ

## Expected Outcome

- findings จากมุมมอง frontend-developer พร้อม severity และ evidence
