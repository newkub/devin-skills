---
name: improve-all-skills
description: ปรับปรุง skills ทั้ง global และ project ให้สมบูรณ์และสม่ำเสมอ
---

## Goal

ปรับปรุง skills ทั้งหมดให้สมบูรณ์ สม่ำเสมอ และตรงตามมาตรฐาน ครอบคลุมทุก `.md` ไฟล์ในแต่ละ skill

## Scope

ปรับปรุงทุก `.md` ไฟล์ในแต่ละ skill directory (`SKILL.md`, `guide/`, `key-concepts/`, `principles/`, `references/`, `workflows/`, `templates/`) ทั้งใน `skills/` และ workspace รวมถึง `AGENTS.md`

## Execute

### 1. Analyze Current State

วิเคราะห์สถานะปัจจุบันของทุก `.md` ไฟล์ใน skills

> Goal: รู้ไฟล์ที่ต้องปรับปรุงและจัดลำดับความสำคัญ

1. ทำ `/check-reference`, สแกนทุก `.md` ไฟล์ใน skill directories, ตรวจสอบไฟล์ที่เกิน 250 บรรทัด — broken references, file inventory, long files
2. ทำ `/all-folders` เพื่อประมวลผลทีละ folder ถ้ามีหลาย skill หรือ workspace
3. ระบุไฟล์ที่ต้องปรับปรุง: structure, content, references, description > 100 ตัวอักษร, title prefix
4. หา `AGENTS.md` ทั้งหมดด้วย `glob **/AGENTS.md`
5. จัดลำดับตาม impact (skills ที่ใช้บ่อยก่อน) — ถ้าไม่มี skills directory → stop และ report

### 2. Apply Structure And Content Quality

ปรับปรุง structure และคุณภาพเนื้อหาของทุก `.md` ไฟล์

> Goal: ทุก `.md` ไฟล์มี structure ตรงตาม `/write-devin-skills` และ content คุณภาพสูง

1. ตรวจสอบ `SKILL.md` frontmatter (title, description, auto_execution_mode), ตรวจสอบ sections ครบ (Goal, Scope, Execute, Rules, Expected Outcome), ปรับ heading เป็น English Title Case
2. ทำ `/follow-content-quality`, `/simplify` — content quality และลดความซับซ้อน
3. ลดจำนวนบรรทัดไม่เกิน 250 สำหรับทุกไฟล์ — ใช้ references แทนการ duplicate เนื้อหา
4. ถ้าไฟล์มากกว่า 10 → ใช้ `/use-scripts` สำหรับ batch operations — ถ้า structure ไม่ valid → fix และ recheck (max 3 → stop/report)

### 3. Fix References And Align Best Practices

แก้ไข references และปรับให้สอดคล้องกับ best practices

> Goal: ไม่มี broken references และ skills สอดคล้องกับ best practices

1. ตรวจสอบ skills ที่อ้างถึงมีอยู่จริง, ตรวจสอบ workflows ที่อ้างถึงมีอยู่จริง, ทำ `/follow-best-practice` สำหรับ topics ที่เกี่ยวข้อง
2. ลบ references ที่ไม่มีอยู่จริง — เพิ่ม references ที่ขาดหาย — อ้างอิง official documentation สำหรับ tools/libraries
3. ทำ `/check-reference` หลังแก้ไข — ถ้าพบ broken references ใหม่ → retry (max 3 → stop/report)

### 4. Write Content Coverage

เขียน content ครอบคลุมทุก features และ APIs ของแต่ละ skill

> Goal: ทุก `.md` ไฟล์มี content ครอบคลุมทุก features และ use cases

1. ทำ `/review-coverage` สำหรับแต่ละ skill ครอบคลุมทุกไฟล์ใน `guide/`, `key-concepts/`, `principles/`, `references/`, `workflows/`
2. ตรวจสอบว่าทุกไฟล์มี content ครบถ้วน (guides, examples, references, key-concepts, principles)
3. ถ้าไฟล์มากกว่า 10 → ใช้ `/use-scripts` สำหรับ batch process — ถ้า coverage fail → retry (max 3 → stop/report)

### 5. Batch Update And Validate

อัพเดท skills เป็น batch และ validate ผลลัพธ์

> Goal: ทุก skills อัพเดทอย่างมีประสิทธิภาพ และผ่าน validation

1. จัดกลุ่ม skills ตาม category (improve, follow, use, run, test) — อัพเดทตามลำดับความสำคัญ
2. ทำ `/check-reference`, `/validate` หลังแต่ละ batch — broken references, structure validation
3. ทำ `/update-reference` เพื่ออัปเดท references ทั้งหมด — ถ้า validate fail → retry (max 3 → stop/report)

### 6. Update Devin Specifics

ปรับปรุง `SKILL.md` และ `AGENTS.md` ตาม Devin CLI spec

> Goal: skills และ `AGENTS.md` สอดคล้องกับ Devin CLI

1. ทำ `/follow-devin-skills-md` กับทุก `SKILL.md` เพื่อ verify frontmatter, sections, `name` ตรงกับ directory
2. ทำ `/write-devin-skills` สำหรับ skills ที่ขาดหรือต้อง rewrite
3. ทำ `/update-agents-md` สำหรับทุก `AGENTS.md`
4. ทำ `/check-reference` และ `/validate` เพื่อตรวจสอบ references และ structure

## Rules

### 1. Structure Standards

- `SKILL.md` frontmatter ต้องมี title, description, auto_execution_mode: 3
- Title Case ตรงกับ skill name ไม่มี prefix (Guide/Tool/Lang) — Description ไม่เกิน 100 ตัวอักษร
- `SKILL.md` มี sections ครบ (Goal, Scope, Execute, Rules, Expected Outcome) — ทุก `.md` ไฟล์ไม่เกิน 250 บรรทัด

### 2. Language And Content Quality

- Execute headings: English Title Case — Rules section: ภาษาไทย — Bullet points: ภาษาไทย — File names: kebab-case
- ใช้ references แทนการ duplicate เนื้อหา — ไม่ซ้ำซ้อนระหว่าง Execute และ Rules — เนื้อหา explicit แทน implicit
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `/skill-name` — ทำ `/simplify` เพื่อลดความซับซ้อน

### 3. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ห้าม TODO, MOCK, placeholder, generic filler — รักษา skill intent เดิม

### 4. Devin CLI And AGENTS

- ทุก `SKILL.md` ต้องผ่าน `/follow-devin-skills-md`
- `AGENTS.md` ต้องผ่าน `/update-agents-md`
- ชื่่อ skill ใน frontmatter ต้องตรงกับ directory ไม่มี prefix

## Expected Outcome

- ทุก `.md` ไฟล์มี structure สม่ำเสมอ ผ่าน `/write-devin-skills` และ `/write-workflows` — ไม่เกิน 250 บรรทัด
- Content ครอบคลุมทุก features, APIs, และ use cases — คุณภาพสูง ไม่ซับซ้อนเกินจำเป็น
- ไม่มี broken references — สอดคล้องกับ best practices และ official documentation
- ทุก `SKILL.md` ผ่าน `/follow-devin-skills-md`
- `AGENTS.md` ผ่าน `/update-agents-md`
- ทุก step มี `, ` markers สำหรับ parallel execution
