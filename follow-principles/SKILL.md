---
name: follow-principles
description: ระบุและใช้ principles ของ context นั้นๆ ในการทำงาน
---

## Goal

ระบุ principles, conventions และข้อกำหนดที่มีอยู่จริงของ context แล้วนำมาประยุกต์ใช้ใน task ปัจจุบันอย่างชัดเจน

## Scope

ใช้เมื่อต้องการตรวจสอบหรือปฏิบัติตาม principles ของ project, framework, team, หรือ skill เฉพาะ โดยไม่คิดเองหรือเพิ่มเติมนอกเหนือจากทีมีอยู่

## Execute

### 1. Identify Context

> Goal: ระบุ context ทีต้องการ principles

1. รับ context จาก user, task, หรือ workspace ปัจจุบัน
2. ระบุประเภท: `project`, `framework`, `language`, `team`, `skill`, `domain`
3. ถ้า context ไม่ชัด → ถาม user ก่อน
4. บันทึกชื่อ context และ scope

### 2. Discover Principle Sources

> Goal: หาแหล่ง principles ทีมีอยู่

1. ค้นหาไฟล์มาตรฐาน:
   - `PRINCIPLES.md`, `ARCHITECTURE.md`, `DESIGN.md`
   - `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`
   - `global_rules.md`, `AGENTS.md`
   - `README.md` ส่วน principles/conventions
   - `docs/principles/`, `.github/`, `.devin/`
2. ค้นหาใน `SKILL.md` ของ skill ที่เกี่ยวข้อง โดยเฉพาะ section `Rules` และ `Expected Outcome`
3. ตรวจ `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml` เพื่อดู ecosystem
4. บันทึกแหล่งทีพบพร้อม path

### 3. Extract Principles

> Goal: สกัด principles ทีใช้ได้จริง

1. อ่านไฟล์แหล่ง principles ทั้งหมด
2. แยก principles ออกเป็นกลุ่ม:
   - `design` — architecture, patterns, coupling/cohesion
   - `coding` — style, conventions, safety
   - `process` — workflow, review, commit, release
   - `communication` — naming, docs, reports
3. ระบุ principles ที conflict กัน
4. สรุปเป้น bullet points ทีกระทำได้

### 4. Prioritize For Current Task

> Goal: เลือก principles ทีเกี่ยวข้องกับ task

1. เปรียบเทียบ principles กับ goal และ scope ของ task
2. จัดลำดับตาม impact: `must`, `should`, `may`
3. ถ้า conflict → ระบุลำดับความสำคัญและเหตุผล
4. ถาม user ถ้า priority ไม่ชัด

### 5. Apply Principles

> Goal: ใช้ principles ในการทำงาน

1. อ้างอิง principle ก่อนตัดสินใจ เช่น "ตาม principle X จึงทำ Y"
2. ปรับ code, structure, หรือ content ให้สอดคล้อง
3. ใช้ principles ในการ review หรือ validate ผล
4. ถ้า principle ไม่สามารถทำตามได้ 100% → ระบุเหตุผลและ trade-off

### 6. Report

> Goal: สรุป principles ทีใช้

1. ใช้ `/report-table` แสดง: Principle, Source, Priority, Applied
2. สรุป principles หลักทีมีผลต่อผลงาน
3. ทำ `/suggest-next-action`

## Rules

### 1. Evidence Based

- ไม่สร้าง principles เองถ้าไม่มีแหล่งอ้างอิง
- ระบุ source ของทุก principle ทีใช้
- ถ้าไม่มี principle ทีชัดเจน → report แทนทีจะตีความเอง

### 2. Context Specific

- principles ต้องตรงกับ context ทีระบุ ไม่นำ principles ของ context อื่นมาใช้โดยไม่มีเหตุผล
- ถ้ามีหลาย context → ระบุลำดับและ interaction

### 3. Minimal And Traceable

- ใช้เฉพาะ principles ทีมีผลตับ task ปัจจุบัน
- บันทึก decision ทีอ้างอิง principle
- ไม่ใช้ principles เป้น excuses เพื่อ over-engineer

### 4. Safety

- ถ้า principle ขัดกับ safety หรือ correctness → ถาม user หรือ stop
- ไม่ยึด principle จนทำลายความถูกต้องของงาน

## Expected Outcome

- รายการ principles ทีพบ พร้อมแหล่งอ้างอิง
- principles ทีถูกนำมาใช้กับ task ปัจจุบัน
- รายงานกระทำและ next action
- ไม่มีการตีความหรือเพิ่ม principles นอกแหล่ง
