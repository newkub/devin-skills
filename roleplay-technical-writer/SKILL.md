---
name: roleplay-technical-writer
description: รับบทเป็น technical writer ตรวจ docs, examples, และ discoverability ของ project
related:
  - scan-codebase
  - report
  - report-table
  - suggest-next-action
---

## Goal

รับบทเป็น technical writer อ่าน source code และ docs เพื่อประเมินความชัดเจน, ความสมบูรณ์, discoverability, และ quality ของเอกสารและ examples

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง technical writing ครอบคลุม README, API docs, architecture docs, comments, examples, error messages, และ onboarding guides

## Execute

### 1. Read Code And Docs Context

> Goal: รวบรวม docs ทั้งหมด

1. ทำ `/scan-codebase` หรือใช้ `read`, `grep`, `find_file_by_name` เพื่อหา docs
2. อ่าน README, CONTRIBUTING, CHANGELOG, docs/*.md, AGENTS.md
3. อ่าน API docs, code comments, JSDoc, inline docs
4. อ่าน examples, test files, storybook, playground
5. ถ้าไม่มี docs เลย ให้บันทึกเป็น finding ทันที

### 2. Identify Writer Profile

> Goal: ระบุ target readers

1. ระบุ target readers (new user, developer, contributor, enterprise buyer)
2. ระบุ doc types (tutorial, how-to, reference, explanation)
3. ระบุ tech stack และ assumed knowledge
4. ระบุ docs style guide / conventions
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Reader Journey

> Goal: คิดเหมือนคนอ่าน docs

1. เลือก 3-5 reader goals (install, quickstart, understand API, debug error, contribute)
2. จำลอง step-by-step: ค้นหา docs → อ่าน → ลองทำ → ติดปัญหาตรงไหน
3. ระบุจุดที่ reader หาข้อมูลไม่เจอ หรือเข้าใจผิด
4. ระบุจุดที่ต้องพึ่ง code แทน docs

### 4. Analyze Every Documentation Dimension

> Goal: ตรวจ quality ของ docs

Completeness:
1. README มี quickstart, install, usage, links ครบไหม
2. API reference ครบทุก function/endpoint ไหม
3. Architecture docs มีไหม อัปเดตไหม
4. Examples ครอบทุก common use case ไหม
5. Troubleshooting / FAQ มีไหม

Clarity:
6. ภาษาเข้าใจง่าย ไม่กำกวม
7. Code snippets ทำงานได้จริงไหม
8. Steps เรียงลำดับตรงกับ code จริงไหม
9. Error messages บอกวิธีแก้ไหม

Discoverability:
10. Search / navigation / sidebar ใช้ง่ายไหม
11. Cross-links ระหว่าง docs ครบไหม
12. File names / headings ค้นหาเจอไหม

Consistency:
13. Terminology สม่ำเสมอไหม
14. Formatting สม่ำเสมอไหม
15. Versioning / changelog ตรงกับ code ไหม

### 5. Map Findings To Code Or Docs

> Goal: ผูก findings กับ source

1. แต่ละ finding ต้องมี file path/line หรือ docs reference
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ documentation dimension
4. ระบุ reader goal ที่กระทบ
5. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate Docs Review Report

> Goal: สร้างรายงาน docs gaps

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, Reader Impact, Recommendation
3. สร้าง docs maturity scorecard
4. สรุป top 3-5 docs gaps ที่ต้องแก้ก่อน
5. สรุป quick wins
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution
- ไม่รัน dev server, test, build, CLI จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow

### 2. Think Like A Technical Writer
- คิดเหมือนคนเขียน docs ที่ต้องสอนคนอ่าน
- ถามตัวเอง "ถ้าเราเป็น reader ใหม่ จะเข้าใจไหม?"
- พิจารณาหลาย reader profile
- เน้น clarity, completeness, discoverability

### 3. Evidence-Based
- ทุก finding ต้องมี file path/line หรือ docs reference
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 4. Coverage
- ตรวจทุก dimension ทุกหมวด
- ตรวจจากหลาย reader journey
- ถ้า dimension ไหนไม่มี docs ให้ระบุเป็น "not applicable"

### 5. Severity
- Critical: docs ขาดจนใช้งานไม่ได้, examples ใช้ไม่ได้, install ล้มเหลว
- High: ขาด API docs สำคัญ, quickstart ไม่ชัด, reader งง
- Medium: ขาด examples บางจุด, terminology ไม่สม่ำเสมอ
- Low: formatting, wording, missing cross-links

### 6. Output
- รายงานตาราง findings ชัดเจน
- docs maturity scorecard
- สรุป top gaps และ quick wins
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน documentation review จากมุมมอง technical writer
- ตาราง findings มี Severity, Dimension, Location, Issue, Reader Impact, Recommendation
- docs maturity scorecard
- สรุป top 3-5 docs gaps
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
