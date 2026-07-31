---
name: follow-write-devin-skills
description: เขียน workflow file ที่ deterministic ปลอดภัย อ่านง่าย รองรับหลาย AI tools
---

## Goal

สร้าง workflow file ที่ deterministic, ปลอดภัย, อ่านง่าย และรองรับหลาย AI tools

## Scope

เขียนหรือปรับปรุง workflow file ทั้งใน `global_workflows` และ workspace โดยไม่ทำลาย references เดิม และไม่ duplicate เนื้อหาหรือขั้นตอนที่มีอยู่ใน `global_rules.md` — อ้างอิง global rules แทนและเติมเฉพาะสิ่งที่เกี่ยวกับการเขียน workflow โดยเฉพาะ

## Execute

### 1. Prepare Workflow Context

เตรียม context ก่อนเขียน workflow

> Goal: ทราบ target AI tool, directory, dependencies, template — 1. ทำตาม `/prepare-workflow-context` เพื่อตรวจจับ AI tool, อ่าน `global_rules.md`, related workflows, เลือก template ตาม prefix, และตรวจ references
2. ถ้า context ไม่ชัดหรือ reference ไม่มี → stop และ report (ไม่ฝืนเขียน)

### 2. Write Structure

เขียน frontmatter, Goal, และ Scope เป็นโครงสร้างพื้นฐานของ workflow

> Goal: โครงสร้าง valid ชัดเจน ตอบได้ว่า workflow ทำอะไรและใช้กับอะไร

1. Frontmatter: `title` Title Case ตรง filename, `description` กระชับ ≤100 ตัวอักษร, `auto_execution_mode: 3`, `related` เฉพาะ workflows ที่เรียกโดยตรง, `url` เมื่อมี external docs
2. ถ้าไฟล์มีอยู่แล้ว → confirm ก่อน overwrite และแสดง dry run preview
3. `## Goal` ต้องตอบว่า workflow นี้ทำอะไรและสอดคล้องกับ filename
4. `## Scope` ต้องระบุชัดเจนว่าใช้กับอะไรและไม่ทับซ้อนกับ workflows อื่น
5. ถ้า Goal หรือ Scope กว้าง/กำกวม/ไม่ตรง filename → rewrite — ถ้า frontmatter ไม่ valid → fix แล้ว recheck (max 3 → stop)

### 3. Write Execute

เขียน Execute ตามหลักการ — ทุก step ต้องมี description และ `> Goal:` ก่อน numbered list

> Goal: Execute ทำตามได้ deterministic และ parallel ได้ (reminder: ปลอดภัย, อ่านง่าย, รองรับหลาย AI tools)

1. Execute ใช้ format: heading → description → `> Goal:` → numbered list — ถ้า step ใหญ่เกินไปให้แยกเป็น step ใหม่ชัดเจน — ใช้ `parallel:` และ `∥` ตาม Rule `Flow And Parallelism`
2. ถ้า data processing ซับซ้อน → ใช้ `/use-scripts` ตาม Rules section `Flow And Parallelism`
3. ถ้า Execute ไม่ตรงหลักการ → rewrite — ถ้า structure ไม่ valid → fix แล้ว recheck (max 3 → stop)

### 4. Write Rules

เขียน Rules ตามหลักการ — จัดกลุ่มเป็นหัวข้อ single concern

> Goal: Rules สนับสนุน flow, speed, safety, clarity, deterministic

1. Rules จัดกลุ่มเป็นหัวข้อ single concern และต้อง support flow, speed, safety, clarity, deterministic
2. ทำ Rule `High Impact Content` เพื่อกรองสิ่งที่ไม่สำคัญ
3. ถ้า Rules ไม่ตรงหลักการ → rewrite — ถ้า structure ไม่ valid → fix แล้ว recheck (max 3 → stop)

### 5. Review Workflow Content

Review คุณภาพเนื้อหาหลังเขียน

> Goal: เนื้อหาคุณภาพ ไม่มี noise ไม่ซ้ำซ้อน — ผ่าน `/review-workflow-content`

1. parallel: ทำตาม `/review-workflow-content` ∥ ทำตาม `/improve-content-coverage` เพื่อ review คุณภาพ, ลด noise, กรอง high-impact content, และตรวจ parallel/script usage
2. ถ้าไม่ผ่าน → กลับไปแก้ที่ Steps 3-4 แล้ว recheck (max 3 → stop/report)

### 6. Create Skill Directory Contents

สร้างส่วนประกอบเพิ่มเติมใน skill directory ถ้าจำเป็น

> Goal: skill/workflow directory รองรับ `SKILL.md`, references, scripts และ sub-workflows

1. ถ้า skill ต้องการ external references → สร้าง `references/` ด้วย markdown files
2. ถ้า skill ต้องการ helper scripts → สร้าง `scripts/` ด้วย scripts ตาม `/use-scripts`
3. ถ้า skill ต้องการ sub-workflows → สร้าง `workflows/` ด้วย markdown files ที่ถูกเรียกจาก `SKILL.md`
4. ถ้า skill ต้องการ expanded guides → สร้าง `guide/` หรือ `learn/` ด้วย markdown files
5. ตรวจสอบว่าไฟล์ย่อยทุกไฟล์ไม่เกิน 250 บรรทัดและไม่ duplicate เนื้อหาจาก `SKILL.md`

### 7. Validate Workflow

เขียน Expected Outcome และ validate workflow ก่อนใช้จริง

> Goal: workflow ผ่าน criteria ทั้งหมดก่อน finalize — ผ่าน `/validate-workflow`

1. `## Expected Outcome` ต้องตอบว่าเสร็จแล้วได้อะไรและสอดคล้องกับ Goal — ระบุ output format: ตาราง, รายการ, ไฟล์, หรือ state change
2. ทำตาม `/validate-workflow` เพื่อตรวจสอบ: ไม่เกิน 250 บรรทัด, steps ไม่เกิน 10, sections ครบ, `related` ไม่มี missing/unused, ไม่มี TODO/MOCK/placeholder, ไม่ใช้ `∥` นอก Execute numbered list
3. ถ้าพบ issue → กลับไปแก้ที่ Steps 2-6 แล้ว revalidate (max 3 → stop/report)

### 8. Finalize Workflow

อัปเดท references และสรุป workflow เพื่อให้พร้อมใช้งาน

> Goal: Workflow พร้อมใช้งาน references ครบถ้วน

1. parallel: ทำตาม `/update-reference` ∥ ทำตาม `/suggest-next-action` เพื่ออัปเดท references และแนะนำ workflows ถัดไป
2. ถ้า workflow ต้องการ sub-workflows ใหม่ → ทำตาม `/follow-write-devin-skills` สำหรับแต่ละ sub-workflow
3. ถ้าเป็น monorepo → ทำตาม `/follow-monorepo`
4. ถ้า reference update ล้มเหลว → retry (max 3 → stop/report)

## Rules

### 1. Structure And Consistency

- ลำดับ sections: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`, `## Example Template` (optional), `## Report` (optional)
- workflow ที่มี output ต้องระบุ output format ชัดเจนและตรวจสอบก่อนจบว่าตรงกับ Expected Outcome
- workflow ที่เกิน 5 steps ต้องมี goal reminder ใน Execute step กลางๆ เพื่อรักษา goal alignment
- รองรับหลาย AI tools: ใช้ frontmatter `auto_execution_mode`, ไม่ผูกกับ AI tool เฉพาะ, ใช้ `/workflow-name` แทน tool-specific syntax

### 2. Flow And Parallelism

- เรียง Foundation, High impact, Dependencies, High-risk ก่อน เพื่อ fail fast และลด rework
- ใช้คำนำหน้า `parallel:` แล้วคั่น tasks ที่ parallel กันด้วยเครื่องหมาย pipe ใน Execute numbered list เดียว — ทุก workflow ที่เรียกต้องใช้คำว่า `ทำตาม` นำหน้า (เช่น `parallel: ทำตาม `/a` ∥ ทำตาม `/b``) — อ้างอิงตัวอย่างใน `## Example Template` — ห้ามใช้เครื่องหมาย pipe ใน validation checklist, Rules bullets, หรือ Expected Outcome — ใช้ `/follow-parallel` เพื่อเร่งความเร็ว
- แต่ละ step มี 2-10 รายการย่อย — ถ้าใหญ่เกินไปให้แยกเป็น step ใหม่ชัดเจน — ตรงจุด ไม่แตกย่อยจิปาถะ — รวมงานที่ต่อเนื่องกันไว้ใน step เดียว
- ใช้ `/use-scripts` เมื่อ operations > 10 ไฟล์, pattern matching ต้อง parser, หรือ metrics ต้อง aggregation เพื่อจำกัด tool calls — workflow ต้องไม่เกิน 15 tool calls ต่อรอบ
- ใช้ `bunx <tool>` แทน `npx <tool>` สำหรับ npm CLI tools — เร็วกว่า ไม่ต้องติดตั้ง global, ใช้ Bun cache — ตัวอย่าง: `bunx ast-grep`, `bunx knip`, `bunx jscpd`
- ระบุชัดว่า step ไหน required หรือ optional — ใช้ prefix "ถ้า..." สำหรับ optional

### 3. Responsibility And Duplication

- แต่ละ workflow ทำหน้าที่เดียว — ถ้ามีหน้าที่หลายอย่าง → แยกเป็น sub-workflows ผ่าน `related` — ถ้าเกิน 250 บรรทัด → ทำ `/refactor-workflow`
- ห้าม duplicate เนื้อหา — ถ้าซ้ำกับ `/follow-write-devin-skills`, `/write-devin-skills` หรือ `global_rules.md` → อ้างอิงแทน — ห้ามเขียน Execute step ที่ทำหน้าที่ workflow อื่น
- อ่าน `global_rules.md` ของ AI tool ก่อนเขียนหรือแก้ไข workflow เพื่อไม่ซ้ำซ้อนกับ global rules และไม่ duplicate ขั้นตอนที่ global rules ครอบคลุมอยู่แล้ว
- `related` ต้องมีเฉพาะ workflows ที่เรียกโดยตรงใน Execute หรือ Rules — ไม่มี unused related และไม่มี missing related
- พยายามใช้ tools, libraries และ CLI ที่มีอยู่แทน manual implementation — ใช้ `bunx <tool>` สำหรับ npm tools, อ้างอิง official docs ก่อนเขียนเอง — ถ้ามี tool ที่ทำงานนั้นได้แล้ว → ใช้ tool นั้น ไม่ reinvent

### 4. Clarity And Determinism

- หัวข้อภาษาอังกฤษ Title Case, รายการภาษาไทย — ใช้ bullet points (`-`) และ backticks สำหรับ `tools`, `commands`, `/workflow-name`, `parallel:`, `∥`
- ห้ามใช้ `**` (bold markers) ใน workflow — ใช้ backticks สำหรับ emphasis แทน — ใช้ heading levels สำหรับ structure
- เขียน explicit: active voice, ระบุ subject/object, หลีกเลี่ยงคำกำกวม — ทุก step ต้องตีความได้ทางเดียว
- ใน Execute ใช้คำว่า "ทำตาม" นำหน้าการเรียก workflow แทน "ทำ" เพื่อบอกว่าดำเนินการตาม workflow นั้น เช่น "ทำตาม `/workflow-name`" หรือ "parallel: ทำตาม `/a` ∥ ทำตาม `/b`"
- เขียนเป็นหลักการ how-to ไม่ผูกกับ project — อ้างอิง official documentation เมื่อเกี่ยวกับ `tools` หรือ `libraries`
- ผลลัพธ์ต้อง deterministic — input เดียวกัน → output เดียวกันทุกครั้ง — ลำดับ steps ต้อง fixed
- Validation criteria ต้อง measurable: ระบุ threshold, expected format, pass/fail condition, และ retry limit (max 3 → stop)
- ถ้ามีตัวอย่าง → ใส่ใน `## Example Template` และต้อง match format ที่ Rules กำหนด

### 5. Safety And Robustness

- ทุก step ต้องมี fail handling — ถ้า context/reference/requirement ไม่ชัด หรือ validation fail → stop/report/ask user
- Destructive หรือ high-risk actions ต้องมี user confirmation + dry run mode — ไม่มี hardcoded secrets หรือ paths
- ถ้าแก้ไข workflow เดิม → ต้องไม่ทำลาย references เดิม — workflow ต้อง idempotent: รันซ้ำได้โดยไม่เกิด side effects
- workflow ที่มี side effects (สร้างไฟล์, แก้ไข state) ต้องระบุ cleanup หรือ rollback ใน Execute step

### 6. High Impact Content

- เขียนเฉพาะสิ่งที่สำคัญและ impact จริง — ไม่เขียน noise — ครอบคลุมทุก impact ที่สำคัญ
- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ห้าม TODO, MOCK, placeholder, generic filler, หรือคำสวยแต่ไม่ actionable
- การ simplify ต้องเก็บ context ครบ ไม่ลบข้อมูลสำคัญ — ลดความซ้ำซ้อนแต่เนื้อหาหลักต้องยังอยู่ครบ
- ครอบคลุมทุก features/APIs/use cases ของ workflow — ทำ `/review-coverage` ถ้าพบ gaps

### 7. Template Consistency

- ทุก workflow ที่มี prefix เดียวกันต้องมีโครงสร้างใกล้เคียงกัน — ใช้ `template-workflows-*` เป็น canonical structure
- ถ้า workflow เบี่ยงเบนจาก template → ระบุเหตุผลใน `## Scope`
- ทำ `/prepare-workflow-context` เพื่อเลือก template และตรวจสอบ consistency

### 8. Prefix Formulas

- ทุก workflow ต้องมี prefix formula ที่สอดคล้องกับ type ของตัวเอง
- ทำ `/prepare-workflow-context` เพื่อดูรายละเอียด prefix formula และ mapping ไปยัง `template-workflows-*`
- ถ้าไม่ตรงกับ formula ที่กำหนด → ระบุเหตุผลใน `## Scope`

### 9. Skill Directory Contents

รองรับ skill/workflow directory ที่มีไฟล์ย่อยนอกเหนือจาก `SKILL.md`

- `SKILL.md` เป็น entry point หลักของ skill หรือ workflow
- สามารถมี `references/` สำหรับ external links และ docs
- สามารถมี `scripts/` สำหรับ helper scripts (ใช้ `/use-scripts` เมื่องเหมาะสม)
- สามารถมี `workflows/` สำหรับ sub-workflows ที่ถูกเรียกจาก `SKILL.md`
- สามารถมี `guide/` หรือ `learn/` สำหรับ expanded documentation
- ไฟล์ทุกไฟล์ใน skill directory ไม่เกิน 250 บรรทัด
- ไม่ duplicate เนื้อหาจาก `SKILL.md` ในส่วนย่อย

## Expected Outcome

- Output format: ไฟล์ workflow `.md` ใหม่ หรือไฟล์เดิมที่ถูกปรับปรุง ตาม Goal และ Scope
- Workflow ที่ deterministic, ปลอดภัย, อ่านง่าย, รองรับหลาย AI tools, ไม่เกิน 250 บรรทัด, single responsibility, references ถูกต้อง, ใช้ได้จริง และไม่ซ้ำซ้อนกับ `global_rules.md`
- ทุก workflow มี prefix formula ที่สอดคล้องกับ type ของ workflow
- ทุก workflow ที่มี prefix ตรงกับ `template-*` ต้องมีโครงสร้างใกล้เคียง template นั้น

## Example Template

```markdown
---
title: Workflow Name
description: กระชับไม่เกิน 100 ตัวอักษร
auto_execution_mode: 3
related:
  - /related-workflow
---

## Goal
วัตถุประสงค์กระชับ ตอบว่า workflow นี้ทำอะไร

## Scope
ขอบเขตงาน ระบุว่าใช้กับอะไรและไม่ทับซ้อนกับ workflows อื่น

## Execute

### 1. Step Name
Description ของ step

> Goal: เป้าหมายเฉพาะของ step นี้

1. parallel: ทำตาม `/workflow-a` ∥ ทำตาม `/workflow-b` — ใช้ `/follow-parallel`
2. ถ้า fail → retry (max 3 → stop/report)

## Rules

### 1. Rule Category
- rule ที่สำคัญและ impact จริง

## Expected Outcome
- Outcome พร้อม output format (ตาราง, รายการ, ไฟล์, หรือ state change)
```
