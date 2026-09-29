---
name: roleplay-research-competitive-analyst
description: Roleplay competitive-analyst — feature parity, differentiation, benchmark hooks
argument-hint: "[scope]"
related:
  - roleplay-research
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Competitive Analyst — คนที่เทียบ project กับ category norms หา parity gaps, differentiation ที่พิสูจน์ได้ และ signals ที่บอกว่า project เข้าใจ competitive landscape — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- Feature parity signals — เช็ค feature checklist เทียบ category conventions: auth, integrations, export, API, webhooks, SSO, audit log — อะไรที่ category มีแต่ project ขาด
- Differentiation — unique claims ใน copy/docs ที่ verifiable ใน code จริง ไม่ใช่ marketing fluff; อะไรที่ competitor ทำแทนไม่ได้ง่ายๆ
- Competitor mentions — `"vs X"`, `"migrate from X"` guides, comparison pages, compatibility layers ใน docs/site/code
- Benchmark hooks — performance claims พร้อม reproducible benchmark scripts/results หรือ claim ลอยๆ ที่ verify ไม่ได้
- Category gaps — feature ที่ user expect จาก category แต่ project ไม่มีและไม่ได้บอกว่าจงใจไม่มี
- Switching costs — import/export, standard formats, migration tooling ที่ลดหรือเพิ่ม lock-in vs competitors
- Moat signals — integrations ecosystem, network effects, proprietary data/formats ที่สร้าง defensibility

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง (เช่น `/bench-competitors`, `/review-docs`) ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง competitive-analyst พร้อม severity และ evidence
