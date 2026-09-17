---
name: deep-plan
description: Canonical planning skill — วางแผนงานและ architecture แบบ chat-only (merged from: plan)
argument-hint: "[scope]"
related:
  - plan
  - deep-analyze-and-plan
  - follow-deep-review
  - deep-review
  - deep-thinking
  - deep-research
  - deep-validate
  - alternative
  - prioritize
  - report
  - suggest-next-action
---

## Goal

วางแผนงานและ architecture อย่างเป็นระบบก่อนเริ่ม implement — canonical skill สำหรับทุก planning (merged from `plan`) — ผลลัพธ์คือ implementation-ready plan ในแชทที่ระบุชัดว่าเขียนอะไร ไฟล์ไหน แบบไหน โดยไม่ต้องตีความเพิ่ม

## Scope

ใช้กับทุกการวางแผน — ตั้งแต่งานทั่วไปจนถึงงานซับซ้อนสูง/เสี่ยงสูง — ครอบคลุม tasks, libraries, implementation path, file architecture, module structure, test strategy และการ validate แผน

- Output: ตอบแผนในแชทเท่านั้น — ห้ามสร้างไฟล์ใดๆ (รวมถึง `.devin/tasks/`, `.devin/plan/`)
- Boundary: `/plan` เป็น alias ของ skill นี้; ต้องการตัดสินใจร่วมกับ user → `/ask-me`; ถ้าต้องการ persist plan จริงๆ user ต้องสั่ง `/create-plan-in-dot-devin` เองโดยตรง

- ดูเพิ่มเติม: /follow-deep-review, /deep-thinking, /deep-research

## Execute

### 1. Gather Evidence

> Goal: มี findings จริงก่อนเขียนแผน

1. ทำ `/follow-deep-review` เพื่อรวบรวม review findings ที่เกี่ยวข้องกับ scope
2. ถ้า project มี `AGENTS.md` → อ่านและทำตาม
3. ทำ `/alternative` เพื่อสำรวจ libraries — บันทึกตัวเลือกพร้อมเหตุผล (modern, type safety, performance, DX, maintenance)
4. ทำ `/deep-thinking` ทบทวน architectural decisions และ `/deep-research` ถ้าต้องใช้ความรู้ใหม่
5. ระบุ constraints, assumptions, dependencies และ unknowns ทั้งหมด

### 2. Write Detailed Plan

> Goal: ระบุว่าจะเขียนอะไร ไฟล์ไหน แบบไหน ครบทุก task

ทุก task ในแผนต้องระบุครบ:

1. File: path เต็มที่จะสร้าง/แก้ไข/ลบ
2. What: สิ่งที่จะเขียน — public API signatures, exported types, data structures, config keys
3. How: pattern/approach ที่ใช้ — เช่น library, convention ใน codebase, code sketch สั้นๆ ถ้าจำเป็น
4. Why: เหตุผลและ alternative ที่ปฏิเสธ
5. Acceptance: เงื่อนไขผ่านที่วัดได้ — test case, command, expected output
6. Risk: impact ถ้าผิด + rollback/mitigation

สำหรับ architecture:

- วาง file architecture จัดกลุ่มตาม responsibility พร้อม tree diagram และ file pattern table (Pattern / Description / Naming / Import)
- กำหนด module boundaries, dependencies (high-level → low-level), public APIs, shared modules, data contracts
- วาง error handling, caching strategy, data validation points

สำหรับ test strategy:

- ออกแบบ test cases ครอบคลุม unit / integration / e2e พร้อม coverage target และ fixtures
- วาง regression test strategy

### 3. Order And Dependencies

> Goal: ลำดับงาน fail fast

1. ทำ `/prioritize` จัดลำดับ tasks ตาม impact และ effort
2. เรียง Foundation → Dependencies → High impact → Critical path → High risk
3. จัดกลุ่มเป็น phases: Foundation → Core → Polish → Test
4. ระบุ task graph: อะไรทำ parallel ได้ อะไร block กัน + milestones
5. ระบุ checkpoint ที่ต้อง verify ก่อนไปต่อ

### 4. Validate And Stress-Test

> Goal: แผน implement ได้จริง ไม่มี gap และรอด worst case

1. ตรวจทุก task: มี file + what + how + acceptance ครบ
2. ทำ `/deep-validate` กับแผน — ห้ามมี placeholder, TBD, หรือ decision ที่ค้าง
3. จำลอง walkthrough: ถ้าทำตามแผนทีละข้อ ผลลัพธ์ครบตาม goal หรือไม่
4. ตรวจ assumptions ทุกข้อ + worst-case scenario + rollback strategy สำหรับ high-risk tasks
5. ถ้า context ไม่ชัดหรือมีหลายทางเลือก → สรุป options/risks/trade-offs แล้ว `/ask-me` ให้ user ตัดสินใจ

### 5. Report

> Goal: รายงานแผนละเอียดในแชทก่อนลงมือ

1. ขึ้นต้นด้วย summary 1-2 บรรทัด
2. แสดง `## TODOs` แบบ numbered list + bullets
3. แสดง `## File Changes` ตารางคอลัมน์: `No.`, `File`, `What`, `How`, `Acceptance`, `Risk`
4. แสดง `## File Structure` + task graph ถ้ามีการเปลี่ยนโครงสร้าง
5. แสดง `## Next Action` ชัดเจนท้าย report
6. ทำ `/suggest-next-action`

## Rules

### 1. No Ambiguity

- ห้ามเขียน task ที่ตีความได้หลายแบบ — ทุก task ต้องระบุ file, what, how, acceptance
- ห้ามใช้ placeholder, TBD, "decide later" — ถ้าตัดสินใจไม่ได้ให้ทำ `/deep-research` หรือ `/ask-me` ก่อน
- ทุก finding จาก deep-review ที่เกี่ยวข้องต้อง map เข้า task หรือระบุว่าตัดออกเพราะอะไร

### 2. Detail Level

- เขียนละเอียดระดับที่คนอื่น (หรือ subagent) เอาไป implement ได้โดยไม่ถามเพิ่ม
- Code sketch ใช้เฉพาะเมื่อช่วยให้ชัด — ไม่เขียน implementation เต็มในแผน
- แสดงแผนในแชทเท่านั้น — ห้ามสร้างไฟล์ plan ใดๆ ไม่ว่า tasks จะกี่ข้อ (ห้ามเรียก `/create-plan-in-dot-devin` หรือเขียน `.devin/tasks/`, `.devin/plan/`)

### 3. Evidence Based

- ทุก architectural choice ต้องมี evidence จาก review findings หรือ research
- ห้ามเดา APIs, file paths, หรือ library behavior — ตรวจจาก codebase/official docs ก่อน

### 4. Trade-Off And Risk

- ทุก architectural decision ต้องมี trade-off analysis พร้อม alternatives ที่ปฏิเสธ
- ทุก high-risk task ต้องมี mitigation plan และ rollback strategy
- จัดลำดับ risks ตาม probability × impact

## Expected Outcome

- Implementation-ready plan ในแชท: ทุก task ระบุ file, what, how, acceptance, risk
- Task graph พร้อม ordering, phases, milestones และ parallelization
- Library choices พร้อมเหตุผล, test strategy, risks + mitigation
- ไม่มี placeholder หรือ decision ค้าง — ผ่าน `/deep-validate`
- แผนอยู่ในแชทเท่านั้น — ไม่มีไฟล์ถูกสร้าง
