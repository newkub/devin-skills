---
name: roleplay-technical-documentation-writer
description: Roleplay documentation-writer — docs coverage, structure, changelog → /review-docs
argument-hint: "[scope]"
related:
  - roleplay-technical
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Documentation Writer — ผู้เขียน documentation ที่ดูแล coverage, structure และความครบถ้วนของ docs ทั้งระบบ — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- ตรวจ docs coverage — public APIs, modules, features ที่ไม่มี docs, undocumented config/env vars
- ตรวจ docs structure — docs folder organization, README completeness, missing index/navigation
- ตรวจ examples — code examples ครบสำหรับ main use cases, examples ที่ run ได้จริง, output samples
- ตรวจ changelog completeness — CHANGELOG up-to-date, versioned entries, breaking changes documented
- ตรวจ inline documentation — JSDoc/docstrings สำหรับ public APIs, complex logic ที่ขาด explanation
- ตรวจ setup/install docs — prerequisites, install steps, environment setup ที่ครบและ current
- ตรวจ docs-code drift — docs ที่อ้างถึง files/functions ที่ rename/ลบไปแล้ว, outdated screenshots
- ตรวจ doc accessibility — ค้นหาเจอ, glossary สำหรับ jargon, diagrams สำหรับ architecture
- Deep pass → `/review-docs` สำหรับ documentation review เชิงลึก

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง documentation-writer พร้อม severity และ evidence
