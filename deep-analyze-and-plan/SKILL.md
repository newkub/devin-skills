---
name: deep-analyze-and-plan
description: Canonical analyze + plan — วิเคราะห์ลึกแล้ววางแผน implementation-ready ในคำสั่งเดียว
argument-hint: "[scope]"
related:
  - deep-analyze
  - deep-plan
  - deep-thinking
  - deep-research
  - deep-refactor
  - deep-implement-to-production
  - deep-validate
  - prioritize
  - ask-me
  - suggest-next-action
---

## Goal

วิเคราะห์ปัญหา/context อย่างลึกซึ้งแล้ววางแผน implementation-ready ในขั้นตอนเดียว — canonical skill สำหรับทุก analyze+plan (`/plan` เปลี่ยนเป็น skill นี้) — ผลลัพธ์คือ plan ที่ระบุ deps, ไฟล์, APIs, risks และ acceptance ครบจน implement ได้โดยไม่ถามเพิ่ม

## Scope

ใช้กับงานที่ต้องเข้าใจ codebase ก่อนวางแผน — refactors, features, migrations, extractions (component → hook, duplication → shared) — ครอบคลุม analysis findings, dependency decisions, file architecture, task graph, risks และ test strategy

- Output: ตอบ plan ในแชทเท่านั้น — ห้ามสร้างไฟล์ใดๆ (รวมถึง `.devin/tasks/`, `.devin/plan/`)
- Boundary: `/plan` เป็น alias ของ skill นี้; planning-only ที่ไม่ต้อง analyze → `/deep-plan`; ต้องการตัดสินใจร่วมกับ user → `/ask-me`; persist plan จริงๆ user ต้องสั่ง `/create-plan-in-dot-devin` เอง
- อ่านก่อนทำงานเสมอ: `/deep-refactor` (refactor patterns + safety) และ `/deep-implement-to-production` (production-readiness checklist) — plan ต้องออกแบบให้ผ่านทั้งสองมาตรฐาน

## Execute

### 0. Read Playbooks

> Goal: plan ตาม refactor + production standards ที่มีอยู่

1. อ่าน `deep-refactor/SKILL.md` — ใส่ patterns (extract, move, rename-safe) และ safety rules เข้าแผน
2. อ่าน `deep-implement-to-production/SKILL.md` — ใส่ production checklist (error handling, validation, observability, rollback) เข้าแผน
3. บันทึก checklist items ที่แผนต้องผ่านไว้ใช้ตอน Validate

### 1. Deep Analyze

> Goal: มี findings จริงจาก code ก่อนเขียนแผน

1. ทำ `/deep-thinking` — กำหนด objectives, sub-problems, assumptions
2. ทำ `/scan-codebase` — structure, patterns, conventions ของ scope
3. ใช้ `Grep`/`ast-grep` หา symbols, call sites, consumers, duplications ที่เกี่ยวข้อง
4. อ่านไฟล์เป้าหมายจริง — ห้ามเดา APIs/paths
5. ถ้า scope ใหญ่ → dispatch `review-*` เฉพาะ domains ที่เกี่ยว (ดู `deep-analyze` domain table)
6. สรุป findings พร้อม evidence (file:line)

### 2. Deep Research

> Goal: decisions มี external validation เมื่อจำเป็น

1. ทำ `/deep-research` เมื่อต้องเลือก deps ใหม่, pattern ใหม่, หรือ API ที่ไม่แน่ใจ
2. official docs เป็นแหล่งหลัก; cross-check ≥2 sources สำหรับ high-risk choices
3. ทำ `/alternative` สำหรับทุก dep ใหม่ — บันทึกตัวเลือกที่ปฏิเสธพร้อมเหตุผล
4. ระบุ compatibility กับ versions ใน manifest ปัจจุบัน

### 3. Write Plan

> Goal: ระบุ deps + ไฟล์ + API + acceptance + risk ครบทุก task

ทุก task ต้องระบุ:

1. `File`: path เต็ม — action: create / edit / delete / move
2. `What`: public API signatures, exported types, data structures, config keys
3. `How`: pattern/approach — library, convention ใน codebase, code sketch ถ้าจำเป็น
4. `Deps`: dependencies ที่ task ใช้ — existing (`name@version` จาก manifest) หรือ new (`name@version` + เหตุผล + อายุ publish)
5. `Why`: เหตุผล + alternatives ที่ปฏิเสธ
6. `Acceptance`: เงื่อนไขผ่านที่วัดได้ — test case, command, expected output
7. `Risk`: impact ถ้าผิด + rollback/mitigation

สำหรับ reuse/refactor work:

- ระบุ shared abstractions ที่จะสร้าง (hook, util, variant map) และทุก consumer ที่จะ migrate
- map duplication → extraction target พร้อม evidence count (เช่น "pattern X ซ้ำ N จุด")
- migration order: shared unit ก่อน → consumers ทีละตัว → delete dead code

สำหรับ architecture: file tree + pattern table (Pattern / Description / Naming / Import), module boundaries, data contracts, error handling + caching strategy

สำหรับ test strategy: unit/integration/e2e coverage + fixtures + regression cases

### 4. Order And Validate

> Goal: fail fast + แผนผ่าน playbooks ทั้งสอง

1. ทำ `/prioritize` — Foundation → Dependencies → High impact → Critical path → High risk
2. จัด phases: Foundation → Core → Polish → Test + task graph (parallel/block/milestones)
3. ทำ `/deep-validate` — ห้าม placeholder/TBD/decision ค้าง
4. walkthrough แผนเทียบ checklist จาก `deep-refactor` + `deep-implement-to-production` ที่อ่านไว้
5. ถ้ามีหลายทางเลือกเสี่ยงสูง → สรุป options/risks แล้ว `/ask-me`

### 5. Report

> Goal: plan report ครบทุกมิติ — ตอบในแชทก่อนลงมือ

Report ต้องมีครบทุก section (ทุก table ขึ้นต้นด้วย `No.` column):

1. `## Summary` — 1-2 บรรทัด: ทำอะไร ทำไม
2. `## Analysis Findings` — table: `No. | Finding | Evidence | Impact` — findings ที่ drive แผน
3. `## Dependencies` — table: `No. | Package | Type (existing/new) | Version | Used By | Why | Risk` — ครบทุก dep ที่แผนสัมผัส (ถ้าไม่มี dep ใหม่ให้ระบุ "none")
4. `## File Changes` — table: `No. | File | Action | What | How | Acceptance | Risk`
5. `## File Structure` — tree diagram เมื่อมีการสร้าง/ย้ายไฟล์
6. `## TODOs` — numbered tasks เรียงตาม phase พร้อม effort คร่าวๆ
7. `## Task Graph` — parallel groups, blockers, milestones, checkpoints
8. `## Risks` — table: `No. | Risk | Probability | Impact | Mitigation | Rollback`
9. `## Test Strategy` — coverage target, test files ที่จะสร้าง, regression cases
10. `## Assumptions And Unknowns` — สิ่งที่ assume + วิธี verify
11. `## Next Action` — ขั้นตอนแรกที่ชัดเจน + `/suggest-next-action`

## Rules

### 1. No Ambiguity

- ห้ามเขียน task ที่ตีความได้หลายแบบ — ทุก task ระบุ file + what + how + deps + acceptance
- ห้าม placeholder/TBD — ตัดสินใจไม่ได้ → `/deep-research` หรือ `/ask-me` ก่อน
- ทุก finding ต้อง map เข้า task หรือระบุเหตุผลที่ตัดออก

### 2. Evidence Based

- ห้ามเดา APIs, file paths, library behavior — ตรวจจาก codebase/docs จริง
- ทุก dep ใหม่ต้องเช็ค version ที่มีอยู่ + publish age (≥7 วัน) + justification
- analysis findings ต้องมี file:line evidence

### 3. Reuse First

- ก่อนเสนอสร้างใหม่ ต้องค้น existing implementations/hooks/utils ใน codebase ก่อนเสมอ
- เสนอ extraction เป็น shared hook/util เมื่อ pattern ซ้ำ ≥3 จุด
- แผนต้อง maximize reusability — composition เหนือ duplication

### 4. Chat Only

- แผนอยู่ในแชทเท่านั้น — ห้ามสร้างไฟล์ plan/tasks ใดๆ
- เขียนละเอียดระดับ subagent เอาไปทำได้โดยไม่ถามเพิ่ม

## Expected Outcome

- Analysis findings พร้อม evidence → implementation-ready plan
- Dependency table ครบ (existing + new + justification)
- File changes ครบ (create/edit/delete + what + how + acceptance)
- Task graph + phases + risks + mitigation + rollback
- Test strategy + assumptions + next action ชัดเจน
- ผ่าน `/deep-validate` — ไม่มี placeholder
