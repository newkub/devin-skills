---
name: check-content-outdate
description: ตรวจ content (skills/docs/specs) ว่าล้าสมัย — versions, deprecated APIs, stale commands, dead links
argument-hint: "[target]"
allowed-tools:
  - exec
  - grep
  - glob
  - find_file_by_name
  - read
  - web_search
  - webfetch
  - mcp_call_tool
related:
  - deep-research
  - check-release-notes
  - check-deprecated-apis
  - update-docs
  - update-devin-global-skills
  - check-correctness
  - report
  - resolve-errors
---

## Goal

ตรวจเนื้อหาใน skills, docs, specs, references ว่าล้าสมัยหรือไม่ — version pins เก่า, APIs ที่ deprecated, commands ที่เปลี่ยน, links ตาย, และ claims ที่ outdated โดยเทียบกับ official sources ล่าสุด

## Scope

ใช้สำหรับ audit content freshness ของ file หรือ directory ที่ระบุ — ไม่แก้ไขเอง รายงาน findings พร้อม recommendation (fix ทำผ่าน `update-*`/`fix-*` skills)

## Execute

### 1. Collect Targets

> Goal: รวบรวมไฟล์ที่ต้องตรวจ

1. ถ้าระบุ target → ใช้ค่านั้น; ถ้าไม่ระบุ → scan `SKILL.md`, `references/`, `docs/` ใน workspace ปัจจุบัน
2. ข้าม historical snapshots เช่น `.devin/reports/` และ vendored/`node_modules/`
3. จัดกลุ่มตาม domain เพื่อ batch research

### 2. Extract Freshness Markers

> Goal: ดึงสิ่งที่อาจล้าสมัยออกมา

1. version pins: `package@x.y.z`, `tool v1.2`, `Latest: ...`
2. verified dates: `(verified YYYY-MM-DD)`, `Last checked`, `as of`
3. deprecated-prone claims: command syntax, flag names, API signatures, config keys
4. external links: docs URLs, marketplace actions (`owner/action@vN`)
5. ทำ `/use-scripts` ถ้าต้อง extract จำนวนมาก — เขียน `scripts/check-content-outdate.ts`

### 3. Research Current State

> Goal: เทียบ markers กับความจริงล่าสุด

1. ทำ `/deep-research` กับ topics ที่พบ — official docs, registries, GitHub releases เป็นแหล่งหลัก
2. ทำ `/check-release-notes` สำหรับ packages ที่มี version pin เพื่อดู latest + breaking changes
3. ใช้ `npm view`, `gh release view`, official changelog ยืนยัน version ล่าสุด
4. ตรวจ links สำคัญว่ายังใช้ได้ (fetch headers)

### 4. Classify Findings

> Goal: จัดระดับความล้าสมัย

| Severity | เกณฑ์ |
|----------|-------|
| Critical | command/API ที่เขียนใช้ไม่ได้แล้ว, link ตาย, version ที่ถูก yank |
| Warning | version pin เก่ากว่า latest มาก, deprecated flag ที่ยังทำงาน |
| Info | version pin ต่างเล็กน้อย, docs URL ที่ redirect |

- ระบุ file:line, ค่าเดิม, ค่าปัจจุบัน, source ที่ยืนยัน
- ทำ `/check-correctness` ต่อถ้าต้อง verify ว่าเนื้อหา "ถูก" ไม่ใช่แค่ "ใหม่"

### 5. Report And Route

> Goal: รายงานและส่งต่อไปยัง skill ที่แก้ได้

1. ทำ `/report` ตาราง: No, File, Line, Marker, Current, Latest, Severity, Recommendation
2. Route fixes: docs → `update-docs-*`, skills → `/update-devin-global-skills`, deps → `/update-version-to-latest`, APIs → `/resolve-errors`
3. ถ้าไม่มี findings → report "content is up to date"
4. ทำ `/suggest-next-action`

## Rules

### 1. Evidence First

- ทุก finding ต้องมี source ที่ยืนยัน current state — ห้าม flag จากการเดา
- official docs/releases เท่านั้น — third-party blogs ใช้เป็น context เสริม
- บันทึก version/date ที่ verify ไว้ใน report

### 2. Scope Discipline

- ตรวจเท่านั้น ไม่แก้ — fixes ผ่าน skill ที่ตรง domain
- ข้าม historical reports/snapshots — อ่านอย่างเดียว
- ถ้า marker กำกวม (ไม่แน่ใจว่า pin ตั้งใจหรือไม่) → Warning + note ไม่ใช่ Critical

### 3. Efficiency

- batch research ต่อ domain — ไม่ fetch ทีละ claim
- cache latest version ที่เช็คแล้วภายใน run เดียวกัน

- ใช้ /deep-research ถ้าจำเป็น
- ใช้ /check-release-notes ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- รายการ content ที่ล้าสมัยพร้อม file:line และ current value ที่ยืนยันแล้ว
- Severity ชัดเจน พร้อม recommendation ว่าใช้ skill ใดแก้
- ไม่มี false positive ที่ไม่มี evidence
