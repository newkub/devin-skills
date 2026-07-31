---
name: follow-write-devin-skills
description: เขียนหรือปรับปรุง skill ให้ถูกต้อง กระชับ รองรับหลาย AI tools
related:
  - follow-write-skill-md
  - prepare-workflow-context
  - follow-parallel
  - follow-content-quality
  - validate-workflow
  - validate
  - update-reference
  - suggest-next-action
  - template-skills-run
  - template-skills-follow
  - template-skills-check
---

## Goal

เขียนหรือปรับปรุง skill ในรูปแบบ `SKILL.md` ที่ถูกต้อง กระชับ อ่านง่าย deterministic ปลอดภัย และรองรับหลาย AI tools

## Scope

ใช้สำหรับสร้าง skill ใหม่หรือแก้ไข skill ใน `%APPDATA%\devin\skills\` หรือ workspace `.devin/skills/` โดยไม่ทำลาย references เดิม

## Execute

### 1. Prepare Context

เตรียม context ก่อนเขียน skill

> Goal: ทราบ target AI tool, directory, dependencies, template

1. ทำ `/prepare-workflow-context` เพื่อตรวจจับ AI tool, อ่าน `global_rules.md`, related skills, และเลือก template ตาม prefix
2. ถ้า context ไม่ชัดหรือ reference ไม่มี → stop และ report

### 2. Apply Key Concepts

นำ key concepts มาใช้ก่อนลงมือเขียน

> Goal: skill มี foundation ถูกต้อง

1. ระบุ single responsibility ของ skill
2. กำหนด input/output ที่ชัดเจน
3. จัดลำดับ steps: Foundation → Dependencies → High impact → High risk
4. ระบุเกณฑ์ผ่าน/ไม่ผ่านทีวัดผลได้

### 3. Write SKILL.md

เขียน `SKILL.md` ตามโครงสร้างมาตรฐาน

> Goal: ไฟล์หลักถูกต้องและสมบูรณ์

1. Frontmatter: `name` ตรง directory name, `description` ≤100 ตัวอักษร, `related` เฉพาะ skills ที่เรียกโดยตรง
2. `## Goal` ตอบว่า skill ทำอะไร
3. `## Scope` ระบุขอบเขตและไม่ทับซ้อนกับ skills อื่น
4. `## Execute` แบ่ง steps ไม่เกิน 10 ทีละ step มี description, `> Goal:`, และรายการ 2-10 ข้อ
5. `## Rules` จัดกลุ่มเป็น single concern
6. `## Expected Outcome` ระบุ output format ชัดเจน
7. ใช้ `## Key Concepts`, `## Principles`, `## Guide`, `## Examples` ถ้ามีเนื้อหาเพิ่มเติม

### 4. Add Skill Directory Contents

สร้างส่วนประกอบเพิ่มเติมถ้าจำเป็น

> Goal: skill directory รองรับไฟล์ย่อยโดยไม่ทำให้ `SKILL.md` ยาวเกินไป

1. ถ้าต้องการ external references → สร้าง `references/`
2. ถ้าต้องการ helper scripts → สร้าง `scripts/` ตาม `/use-scripts`
3. ถ้าต้องการ expanded documentation → สร้าง `guide/` หรือ `examples/`
4. ตรวจสอบว่าไฟล์ย่อยทุกไฟล์ไม่เกิน 250 บรรทัด

### 5. Validate Skill

ตรวจสอบคุณภาพก่อน finalize

> Goal: skill ผ่านเกณฑ์ทั้งหมด

1. ทำตาม `/validate` เพื่อตรวจความถูกต้อง
2. ทำตาม `/validate-workflow` เพื่อตรวจ: ไม่เกิน 250 บรรทัด, sections ครบ, `related` ไม่มี missing/unused, ไม่มี TODO/MOCK/placeholder
3. ทำ `/check-circular-dependencies` ถ้ามีการแก้ `related`
4. ถ้าพบ issue → แก้และ revalidate (max 3 → stop/report)

### 6. Update References

อัปเดต references และสรุป

> Goal: skill พร้อมใช้งาน references ครบถ้วน

1. ทำ `/update-reference` เพื่ออัปเดต references ที่เกี่ยวข้อง
2. ทำ `/suggest-next-action` เพื่อแนะนำ skills ถัดไป
3. ถ้า reference update ล้มเหลว → retry (max 3 → stop/report)

## Rules

### 1. Structure And Consistency

- ลำดับ sections: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`, `## Key Concepts` (optional), `## Principles` (optional), `## Guide` (optional), `## Examples` (optional)
- skill ที่มี output ต้องระบุ output format ชัดเจน
- skill ที่เกิน 5 steps ต้องมี `> Goal:` reminder ใน step กลางๆ
- ใช้ frontmatter `related` เฉพาะ skills ที่เรียกโดยตรง

### 2. Flow And Parallelism

- เรียง Foundation, Dependencies, High impact, High-risk ก่อนเพื่อ fail fast
- ใช้คำนำหน้า `parallel:` และคั่นด้วย `∥` ใน Execute numbered list
- ทุก skill ที่เรียกต้องนำหน้าด้วย `ทำตาม`
- ห้ามใช้ `∥` ใน Rules bullets หรือ Expected Outcome
- ใช้ `/follow-parallel` เพื่อเร่งความเร็ว

### 3. Safety And Determinism

- ทุก step ต้องมี fail handling: stop/report/ask user ถ้า context ไม่ชัด
- ใช้เงื่อนไข `ถ้า...` สำหรับ optional steps
- ผลลัพธ์ deterministic: input เดียวกัน → output เดียวกัน
- ทำ dry run ก่อน destructive หรือ high-risk actions

### 4. High Impact Content

- เขียนเฉพาะสิ่งที่สำคัญและ impact จริง
- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม"
- ห้าม TODO, MOCK, placeholder, generic filler
- ห้ามใช้ `**` (bold markers) ใช้ backticks สำหรับ emphasis

### 5. Examples And Guides

- ใช้ `## Examples` สำหรับตัวอย่างการใช้ skill
- ใช้ `## Guide` สำหรับขั้นตอนละเอียดเฉพาะทีไม่ใช่ core instruction
- ใช้ `## Principles` สำหรับ values หลัก
- ใช้ `## Key Concepts` สำหรับ concepts สำคัญทีต้องเข้าใจก่อนใช้งาน

## Expected Outcome

- `SKILL.md` ใหม่หรือที่ปรับปรุงตามมาตรฐาน
- skill ที่ deterministic, ปลอดภัย, อ่านง่าย, ไม่เกิน 250 บรรทัด
- `related` ถูกต้อง ไม่มี missing/unused
- references อัปเดตครบถ้วน

## Key Concepts

### 1. Single Responsibility

แต่ละ skill ทำหน้าทีเดียวชัดเจน ถ้ามีหลายหน้าทีให้แยกเป็น sub-skills

### 2. Deterministic Execution

input และ state เดียวกันต้องได้ output เดียวกัน ทุกครั้ง

### 3. Fail Fast

จัดลำดับให้ dependencies และ high-risk ตรวจพบก่อนเพื่อลด rework

### 4. High Impact Content

เก็บเฉพาะสิ่งที่ทำให้ผลลัพธ์เปลี่ยน ลด noise และ redundancy

## Principles

### 1. Minimal

เปลี่ยนแปลงน้อยทีสุด แก้เฉพาะสิ่งที่จำเป็น

### 2. Safe

ไม่ทำลาย references หรือ existing skills ต้องมี dry run และ confirmation ก่อนลบ/overwrite

### 3. Explicit

ระบุ subject, object, action, condition ชัดเจน ไม่กำกวม

### 4. Consistent

ภาษาและ format สมำเสมอ หัวข้อภาษาอังกฤษ Title Case รายการภาษาไทย

## Guide

### Writing Frontmatter

- `name` ตรงกับ directory name ใช้ lowercase คั่นด้วย `-`
- `description` กระชับไม่เกิน 100 ตัวอักษร
- `related` เป็น YAML list ของ skill names ที่เรียกโดยตรง

### Writing Execute Steps

- ใช้ `### N. Step Name` ภาษาอังกฤษ Title Case
- ตามด้วย description สั้นๆ ภาษาไทย
- ใส่ `> Goal: ...` ก่อน numbered list
- แต่ละ step มี 2-10 รายการ

### Writing Rules

- ใช้ `### N. Rule Name` ภาษาอังกฤษ Title Case
- แต่ละ rule เป็น single concern
- รายการเป็นภาษาไทย ใช้ backticks สำหรับ code/skill names

## Examples

```markdown
---
name: my-skill
description: ทำสิ่งสำคัญให้สำเร็จ
related:
  - another-skill
---

## Goal

ทำสิ่งสำคัญให้สำเร็จตามที่ผู้ใช้ระบุ

## Scope

ใช้กับ project ที่มี X เท่านั้น ไม่ทับซ้อนกับ `/another-skill`

## Execute

### 1. Prepare

เตรียม context

> Goal: รู้ input ก่อนลงมือ

1. ตรวจสอบ `package.json`
2. ถ้าไม่ชัด → stop และ report

## Rules

### 1. Safety

- ไม่ลบไฟล์โดยไม่มี dry run
- ใช้ `/ask-me` เมื่องไม่แน่ใจ

## Expected Outcome

- ผลลัพธ์ X พร้อม output เป็นรายการ
```
