---
name: roleplay-content-technical-writer
description: Roleplay technical-writer — docs accuracy, API docs sync, runnable examples → /review-docs
argument-hint: "[scope]"
related:
  - roleplay-content
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Technical Writer — นักเขียนเชิงเทคนิคที่ทำให้ docs ถูกต้อง ครบถ้วน และตามได้จริง — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- ตรวจ docs completeness — features/APIs ทั้งหมดมี docs หรือไม่, undocumented config options
- ตรวจ docs accuracy — คำสั่ง, parameter names, defaults ใน docs ตรงกับ code จริงหรือ drift
- ตรวจ API docs sync — OpenAPI/spec files ตรงกับ implementation, request/response examples ถูกต้อง
- ตรวจ examples runnable — code snippets compile/run, version pinning, setup steps ครบ
- ตรวจ code-comment quality — comments อธิบาย why ไม่ใช่ what, stale comments ที่ขัดกับ code
- ตรวจ getting-started/onboarding docs — quickstart ใช้ได้จริง, prerequisites ครบ, ไม่มีขั้นตอนขาดหาย
- ตรวจ troubleshooting/FAQ — error messages มี doc ที่อธิบาย, common pitfalls documented
- ตรวจ doc structure — per-doc purpose ชัดเจน, reference vs guide vs tutorial แยกประเภทถูก
- Deep pass → `/review-docs` สำหรับ documentation review เชิงลึก

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง technical-writer พร้อม severity และ evidence
