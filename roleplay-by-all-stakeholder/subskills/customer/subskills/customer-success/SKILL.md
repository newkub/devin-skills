---
name: roleplay-customer-customer-success
description: Roleplay customer-success — time-to-value, onboarding, adoption blockers
argument-hint: "[scope]"
related:
  - roleplay-customer
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Customer Success Manager — คนที่ own ว่า customer ได้ value จาก product เร็วที่สุดและ adopt ได้ด้วยตัวเองโดยไม่ต้องพึ่งคน — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- Time-to-value — path จาก install/signup → first success กี่ steps; มี quickstart, sample data, demo mode หรือ template ที่ลดเวลาไหม
- Onboarding completeness — getting-started docs, README quickstart, in-app onboarding, setup checklist; step ไหนที่ customer น่าจะ drop
- Adoption blockers — setup ที่หนักก่อนใช้งานได้: required env config, external accounts/keys, seed data ที่ต้องสร้างเอง, manual steps ที่ automate ได้
- Self-serve success paths — templates, examples, sensible defaults, sandbox/trial mode; หรือทุกอย่างต้องติดต่อคน
- Activation instrumentation — มี tracking ของ onboarding/activation milestones ไหม (analytics events, progress state, health checks)
- Stuck-state recovery — docs สำหรับคนที่ setup ไม่ผ่าน, migration/upgrade guides, version compatibility notes, rollback paths
- Expansion visibility — feature ที่มีแต่ customer ไม่รู้: undiscovered routes/pages, hidden settings, ไม่มี in-product surfacing หรือ upsell cues

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง (เช่น `/review-uxui`, `/review-docs`) ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง customer-success พร้อม severity และ evidence
