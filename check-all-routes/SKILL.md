---
name: check-all-routes
description: ตรวจ coverage ทุก routes ของ site/app — discover ด้วย crw map เทียบ expected set
argument-hint: "<domain-or-path> [--expect <file>]"
related:
  - check-routes-status
  - check-dead-link
  - follow-tool-crw
  - update-devin-global-skills
  - report
---

## Goal

Discover ทุก same-origin routes ของ target (docs site, app, deployed domain) แล้วเทียบกับ expected set — รายงาน routes ที่หายไป, เกินมา, หรือยังไม่ถูก document

## Scope

- Target: URL (`https://docs.example.com`), local dev server, หรือ docs site ของ library ที่ skill ครอบ
- Expected set: `references/routes.md` ของ skill, docs sidebar, sitemap, หรือ route files ใน codebase
- Read-only — ไม่แก้ไขไฟล์ (update ทำโดย skill ที่เรียกใช้ เช่น `/update-devin-global-skills`)
- ต่างจาก `/check-routes-status` ที่ตรวจ HTTP status ต่อ route — skill นี้ตรวจ coverage/completeness

## Execute

### 1. Resolve Target And Expected Set

> Goal: รู้ว่าต้อง map อะไรและเทียบกับอะไร

1. รับ target จาก argument — URL หรือ domain; ถ้าไม่มี → หา official site จาก skill ที่กำลังทำงานอยู่ (`references/website.md`)
2. หา expected set: `references/routes.md`, sidebar config (`docs/.vitepress/config.ts`, `mkdocs.yml`), หรือ route files
3. ถ้าไม่มี expected set → mode = discover-only (list routes ทั้งหมด)

### 2. Discover Routes

> Goal: ได้ route list จริงจาก target

ลองตามลำดับ — ใช้วิธีแรกที่สำเร็จ:

1. **`crw map` (preferred)**: `crw map <url>` หรือ MCP `crw_map` ถ้า server `crw` available — ได้ sitemap + crawl discovery
2. **sitemap.xml**: `webfetch <url>/sitemap.xml` — parse `<loc>` entries (รองรับ sitemap index)
3. **Crawl fallback**: `webfetch` หน้าแรก + docs index → ตาม same-origin links 1-2 ระดับ
4. **App routes**: ถ้า target เป็น codebase → `find_file_by_name` หา route files (`app/**/page.*`, `pages/**`, `routes/**`)

Normalize: strip trailing slash, query, fragment; เหลือเฉพาะ same-origin paths

### 3. Compare And Report

> Goal: pass/fail พร้อม missing/extra locations

1. เทียบ discovered vs expected (case-insensitive, normalized)
2. จัดกลุ่มผล: `missing` (มีใน expected ไม่มีใน site), `undocumented` (มีใน site ไม่มีใน expected), `match`
3. Report ตาราง: No. | Route | Status | Note — เรียง missing/undocumented ก่อน
4. Exit criteria: pass เมื่อ undocumented = 0 (missing อาจเป็น intentional เช่น auth-gated)

## Rules

### 1. Deterministic

- normalize URLs ก่อนเทียบเสมอ — trailing slash, case, `index.html`, locale prefix (`/en/`)
- จำกัด depth และจำนวน routes (default cap 500) — report เมื่อถูก cap

### 2. Source Priority

- prefer `crw map` เสมอเมื่อ available — ไม่ใช้ search engine เดา routes
- ถ้า crw ไม่มีและ sitemap ไม่มี → ระบุใน report ว่า discovery อาจไม่ครบ

### 3. No Guessing

- ห้าม generate routes จากชื่อหัวข้อเอง — ต้องมาจาก discovery จริง
- ถ้า docs site มี versioning (`/v1/`, `/v2/`) → map เฉพาะ latest เป็นค่า default ยกเว้น user ระบุ

## Expected Outcome

- รายการ routes ทั้งหมดที่ discover ได้ + diff เทียบ expected set
- Report พร้อมใช้เป็นฐาน update `references/routes.md` โดย `/update-devin-global-skills`
