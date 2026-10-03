---
name: create-plan-in-dot-devin
description: Canonical analyze+plan — วิเคราะห์ลึกแล้วเขียนแผน implementation-ready ลง .devin/temp/plan/
argument-hint: "[topic|scope] [chat-only]"
related:
  - idea-features
  - deep-thinking
  - deep-analyze
  - deep-research
  - prioritize
  - deep-validate
  - deep-review
  - deep-review-then-fix
  - report-uxui
  - report-architecture-diagram
  - update-gitignore
  - implement-to-production
  - create-github-issue
  - ask-me
  - suggest-next-action
---

## Goal

วิเคราะห์ปัญหา/context อย่างลึกซึ้งแล้วสร้างแผน implementation-ready ที่อ่านง่าย มี scoring และติดตามผลได้ — canonical สำหรับทุก analyze+plan (merged `/deep-plan` + `/deep-analyze-and-plan`) — เขียนลง `.devin/temp/plan/<workspace>/<title-date>.md` พร้อมเปิดไฟล์แผนใน editor

## Scope

- รับ request หรือ topic — ใช้สำหรับ planning ทุกรูปแบบ: features ใหม่, refactor, migration, multi-item work
- Default: persist ลงไฟล์ — caller ระบุ `chat-only` ชัดเจน → ตอบ plan ในแชทโดยข้าม Steps 6-8 (ไม่สร้างไฟล์)
- ใช้ `/idea-features` เพื่อ generate features ที่เป็นระบบ + score ตาม `references/scoring.md`
- ทุก task ระบุ File/What/How/Deps/Acceptance/Risk ครบ — plan ต้อง implement ได้โดยไม่ต้องถามเพิ่ม

## Execute

### 1. Capture And Prepare

> Goal: รวบรวม context และเตรียม workspace path

1. รับ `<topic>` จาก argument หรือ context ของ session ปัจจุบัน
2. อ่าน context, design, report ที่เกี่ยวข้อง; ถ้า scope คลุมเครือ → ทำ `/ask-me`
3. ยืนยัน target workspace กับ user ถ้าไม่ชัดเจน
4. ระบุ `<workspace>` = ชื่อ directory ของ target workspace
5. ตรวจว่า `.devin/temp/plan/<workspace>/` มีอยู่ — ถ้าไม่มีให้สร้าง
6. ทำ `/update-gitignore` ถ้า `.devin/temp` ยังไม่ถูก ignore — plan artifacts เป็น temp files ไม่ควร commit

### 2. Deep Analyze

> Goal: มี findings จริงจาก code ก่อนเขียนแผน — ห้ามเดา

1. ทำ `/deep-thinking` — objectives, sub-problems, assumptions, และ success criteria
2. ทำ `/deep-analyze` — structure, patterns, conventions, symbols, call sites, duplications พร้อม file:line evidence
3. อ่านไฟล์เป้าหมายจริงด้วย read tool — ห้ามเดา APIs หรือ file paths

### 3. Deep Research (ถ้าจำเป็น)

> Goal: ได้ dependency choice + pattern decision ที่ยืนยันได้

ทำ `/deep-research` เมื่อต้องเลือก deps ใหม่/pattern ใหม่:

- Library choice: official docs ก่อน + ≥2 sources — alternatives ที่ปฏิเสธต้องมีเหตุผลชัดเจน
- Dep ใหม่ต้องมีอายุ publish ≥7 วัน + version pin — ห้าม floating/`latest`
- Pattern choice: official docs / framework docs / production patterns — ไม่ใช่ blog ทั่วไป

### 4. Generate And Score Features

> Goal: มี feature list ที่เป็นระบบพร้อม priority score

1. ทำ `/idea-features <topic>` — แยก `New`/`Extends` ตาม existing codebase
2. คำนวณ Score ตาม `references/scoring.md` — `Score = (Impact + Effect) / (Risk × Phase)`
3. เรียงลำดับ features ตาม Score สูง → ต่ำ
4. ตรวจ dependency ระหว่าง features — feature ที่ถูกพึ่งพาต้องมาก่อน
5. แต่ละ feature ทำ `/report-uxui` (icon + short description) ถ้าต้องการ visual

### 5. Order And Refine

> Goal: ได้ plan ที่เรียงลำดับถูกและผ่าน quality gate

1. ทำ `/prioritize` — Foundation → Dependencies → High impact → Critical path → High risk; จัด phases Foundation → Core → Polish → Test + task graph
2. ทำ `/deep-review-then-fix` กับเนื้อหาแผนที่ร่าง
3. ทำ `/deep-review` เพื่อตรวจคุณภาพ plan — ถ้ามี findings ให้แก้และ review ซ้ำจนสะอาด (max 3 รอบ)
4. ทำ `/deep-validate` เพื่อตรวจ placeholder, missing steps — ห้ามเหลือ TBD ใน tasks
5. ถ้า requirement มีหลายทางเลือกเสี่ยงสูง → เขียน options/risks แล้ว `/ask-me`

### 6. Check For Duplicate

> Goal: หลีกเลี่ยงการเขียนแผนซ้ำ

1. ค้นหาไฟล์ใน `.devin/temp/plan/<workspace>/` ที่มีชื่อคล้ายกับ `<topic>` ปัจจุบัน
2. ถ้ามีแผนเก่าที่ยังไม่เสร็จ → อัปเดตแผนเดิมหรือสร้าง revision ใหม่ตาม context
3. บันทึก title ที่เลือก — ใช้รูปแบบ `<short-kebab-title>-<YYYY-MM-DD>.md`

### 7. Build Plan Body

> Goal: ประกอบเนื้อหาแผนให้ครบ sections — ดู `references/plan-template.md`

1. เขียน `## Goal` — สรุปผลลัพธ์ที่ต้องการ 1-3 บรรทัด
2. เขียน `## Architecture` — ANSI diagram หรือ reference สถาปัตยกรรมที่เกี่ยวข้อง; ใช้ `/report-architecture-diagram` ถ้าต้องวาดใหม่
3. เขียน `## Idea Features` — ตาราง features + scoring ตาม `references/plan-template.md` ข้อ Features Table
4. เขียน `## File Changes` — ตาราง `No. | File | Action | What | How | Acceptance | Risk` จาก Step 5
5. เขียน `## TODO` — ตาราง tasks ที่ track ด้วย `Status` column
6. เขียน `## Task Graph` — dependencies ระหว่าง tasks + critical path
7. เขียน `## Risks` — ตาราง risk, impact, mitigation
8. เขียน `## Test Strategy` — coverage, fixtures, regression ที่ต้องมี
9. เขียน `## Assumptions And Unknowns` — สิ่งที่สมมติไว้และ open questions
10. เขียน `## Acceptance Criteria` — checkbox list
11. เขียน `## Execution Order` — numbered list เรียงตาม critical path

### 8. Create And Open Plan File

> Goal: สร้างไฟล์แผนและเปิดให้ user

1. เขียนไฟล์ไปที่ `.devin/temp/plan/<workspace>/<title>-<YYYY-MM-DD>.md`
2. เปิดไฟล์ใน IDE — ถ้าสภาพแวดล้อมรองรับให้ใช้คำสั่ง `code .devin/temp/plan/<workspace>/<file>` หรือ editor ที่มีอยู่
3. แจ้ง user ตำแหน่งไฟล์และสรุป plan
4. แนะนำ `/implement-to-production` เป็นขั้นตอนถัดไป
5. ใช้ `/create-github-issue` ถ้าต้องการส่งแผนไป GitHub issue
6. ใช้ `/suggest-next-action` ถ้าไม่ชัดว่าจะทำอะไรต่อ

## Rules

### 1. Plan Quality

- ทุก task ต้องระบุครบ: `File` (path + action), `What` (API signature/types), `How` (pattern), `Deps` (existing/new + version + publish age), `Why` (+ alternatives ที่ปฏิเสธ), `Acceptance` (วัดได้), `Risk` (impact + rollback)
- ห้ามใช้ placeholder, `TBD`, `TODO`, หรือ step ที่ implement ไม่ได้ — plan ต้องรันต่อได้โดยไม่ต้องถามเพิ่ม
- ทุก claim ต้องมี evidence จาก Step 2 (file:line) — ห้ามเดา APIs หรือ paths
- Reuse first: pattern ที่ซ้ำ ≥3 จุด → ใส่ extraction task; migration ที่มี shared code → เรียง shared → consumers → delete dead
- Dependency ใหม่ต้อง pin version + publish ≥7 วัน + ระบุเหตุผลที่เลือก

### 2. Plan File UX

- ใช้ heading levels ชัดเจน + tables สำหรับเปรียบเทียบ
- ไม่ใช้ bold markers `**` ใน body — ใช้ heading/bullet แทน
- จัด ANSI diagram ให้อยู่ตรงกลางด้วย `<div align="center">`
- ทุกบรรทัดใน ANSI codeblock ต้องยาวเท่ากัน
- ใช้ ` ```text ` codeblock สำหรับ diagram
- ไม่มี section `## Information`, `## Key Concepts` หรือ `## Tech Stack` แยก

### 3. Scoring

- ใช้สูตร `Score = (Impact + Effect) / (Risk × Phase)` เท่านั้น — ดู `references/scoring.md`
- ปัดเศษทศนิยม 1 ตำแหน่ง; score เท่ากัน → Risk ต่ำกว่าก่อน
- ทุก feature ต้องมี `Icon` เป็นคอลัมน์แรก

### 4. File Safety

- เขียนเฉพาะใน `.devin/temp/plan/<workspace>/` — ห้ามแตะ source code
- ต้องมี `.devin/temp` อยู่ใน `.gitignore` ก่อนสร้างไฟล์ — ถ้าไม่มีให้ทำ `/update-gitignore` (plan artifacts ไม่ควร commit)
- Idempotent: รันซ้ำต้องไม่สร้าง duplicate plan โดยไม่ตั้งใจ (ดู Step 6)
- `chat-only` mode: ถ้า caller ระบุชัดเจน → ข้าม Steps 6-8, ไม่สร้างไฟล์, ไม่แตะ `.devin/temp`
- ไม่ลบ plan เก่าโดยไม่ confirm — เก็บเป็น history

### 5. Merged Scope

- merged จาก `/deep-plan` + `/deep-analyze-and-plan` — canonical เดียวสำหรับ analyze+plan ทุกกรณี
- `/deep-plan`, `/deep-analyze-and-plan`, `/plan` เป็น alias stubs ที่ forward มาที่ skill นี้
- งาน planning ที่ต้อง persist ต้องผ่าน skill นี้เท่านั้น — ห้ามสร้าง plan file นอก `.devin/temp/plan/`

## Expected Outcome

- แผน implementation-ready ที่มี features, scoring, File Changes, TODO, Task Graph, Risks, Test Strategy, Acceptance Criteria ครบ
- ไฟล์แผนอยู่ที่ `.devin/temp/plan/<workspace>/<title>-<YYYY-MM-DD>.md` และเปิดใน editor แล้ว
- `.devin/temp` ถูก ignore ใน `.gitignore`
- ไม่มี placeholder — ทุก task มี evidence, dependency, และ acceptance ที่วัดได้
- พร้อมส่งต่อ `/implement-to-production`
