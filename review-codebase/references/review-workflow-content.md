---
name: review-workflow-content
description: Review คุณภาพเนื้อหา workflow ลด noise ซ้ำซ้อน และกรอง high-impact content
related:
  - follow-content-quality
  - simplify
  - dont-over-engineer
  - review-codebase
  - use-scripts
  - review-context-rot
  - follow-harness-engineering
  - suggest-next-action

---


## Goal

ตรวจสอบคุณภาพเนื้อหา workflow หลังเขียนเพื่อให้ทำตามได้จริง ไม่มี noise, ไม่ซ้ำซ้อน, ลด tool calls

## Scope

ใช้กับ workflow files หลังจากมี draft ครบทุก section — ไม่แก้ไขโครงสร้างหลัก (Goal/Scope/Execute/Rules) แต่ review คุณภาพเนื้อหา, ลด redundancy, และกรอง high-impact content

## Execute

### 1. Simplify And Remove Redundancy

ทำเนื้อหาให้กระชับและลบความซ้ำซ้อน

> Goal: เนื้อหากระชับ ไม่ซ้ำซ้อน เก็บ context ครบ

1. parallel: `/follow-content-quality` ∥ `/simplify`
2. ตรวจสอบเนื้อหาซ้ำซ้อนระหว่าง `Execute` และ `Rules`
3. ถ้าเนื้อหาใน `Rules` ซ้ำกับ workflow อื่น → แทนที่ด้วย reference
4. ทำ `/dont-over-engineer` เพื่อกำหนดขอบเขตการแก้ไขให้ minimal

### 2. Check High Impact Content

กรองสิ่งที่สำคัญและ impact จริง

> Goal: เก็บเฉพาะสิ่งที่ impact จริง ลบ noise

1. ทุก bullet ต้องตอบได้ว่า “ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม” — ถ้าไม่เปลี่ยน → ลบ
2. ห้าม TODO, MOCK, placeholder, generic filler, หรือคำสวยแต่ไม่ actionable
3. การ simplify ต้องเก็บ context ครบ ไม่ลบข้อมูลสำคัญ
4. ถ้าพบ gaps ใน coverage → ทำ `/review-codebase`

### 3. Check Clarity And Determinism

ตรวจสอบว่าเนื้อหาชัดเจนและ deterministic

> Goal: ทุก step ตีความได้ทางเดียว

1. ตรวจสอบ active voice, ระบุ subject/object, หลีกเลี่ยงคำกำกวม
2. ตรวจสอบ validation criteria ว่า measurable: ระบุ threshold, expected format, pass/fail, retry limit
3. ตรวจสอบว่าไม่มี assumptions ที่ไม่ได้ระบุ
4. ถ้าเนื้อหากำกวม → rewrite แล้ว recheck (max 3 → stop/report)

### 4. Check Parallel And Script Usage

ตรวจสอบการใช้ parallel markers และ scripts

> Goal: ลด tool calls โดยรักษา safety

1. ตรวจ `parallel:` และ `∥` ใช้เฉพาะใน `Execute` numbered list
2. ตรวจว่าไม่ใช้ `∥` ใน validation checklist, Rules bullets, หรือ Expected Outcome
3. ถ้า data processing ซับซ้อนหรือ operations > 10 ไฟล์ → ใช้ `/use-scripts`
4. ถ้า workflow มี > 5 steps หรือ high-risk actions → อ่าน `references/review-context-rot.md` เพื่อ review context rot แล้วทำ `/follow-harness-engineering` ∥ `/review-codebase`

### 5. Finalize Review

สรุปผล review

> Goal: เนื้อหาผ่าน review พร้อมไป validate

1. ถ้าไม่ผ่าน → แก้ไขตาม findings แล้ว recheck (max 3 → stop/report)
2. ถ้าผ่าน → ทำ `/suggest-next-action`

## Rules

- ห้ามซ้ำซ้อนระหว่าง `Execute` และ `Rules` — ใช้ references แทนการเขียนซ้ำ
- ทุก bullet ต้องมี impact จริง ห้าม generic filler หรือคำสวยแต่ไม่ actionable
- ทุก step ตีความได้ทางเดียว ใช้ active voice และ validation criteria ที่ measurable
- `parallel:` และ `∥` เฉพาะใน `Execute` numbered list เท่านั้น
- ลด tool calls โดยไม่ทำลาย safety

## Expected Outcome

- เนื้อหากระชับ ไม่ซ้ำซ้อน ไม่มี noise
- ทุก bullet มี impact จริง
- ไม่มี TODO/MOCK/placeholder
- `parallel:` / `∥` ใช้ถูกต้อง
- พร้อมไป `/run-review`
