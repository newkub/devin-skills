---
name: idea-use-skills-relations
description: สร้างไอเดีย skill relations — จุดที่ควรใช้ use-related-skills และ edges ที่ขาด
argument-hint: "[skill-name|family|all]"
related:
  - use-related-skills
  - read-related
  - idea-new-devin-global-skills
  - update-devin-global-skills
  - update-devin-harness
  - list-devin-global-skills
  - create-plan-in-dot-devin
  - report
---

## Goal

สร้างไอเดียและ draft สำหรับปรับปรุง skill relations — วิเคราะห์ `related` graph ทั้งหมด หา edges ที่ขาด จุดที่ควรเรียก `use-related-skills` และโครงสร้าง relation ใหม่ที่ควรมี (ไม่ implement จริงจนกว่า user confirm → `/follow-your-suggestion`)

## Scope

ใช้เมื่อต้องการตรวจและขยาย relations ระหว่าง devin global skills:

- skill ที่เขียน/แก้เสร็จแล้วแต่ยังไม่มี `related` หรือ `related` ตรงไม่ครบ
- skills ที่ workflow ควรจบด้วย `/use-related-skills` แต่ไม่ได้เรียก (เช่น `create-*`, `update-*`, `new-*` skills)
- relation ขาดความสมมาตร — A อ้าง B แต่ B ไม่อ้าง A กลับ
- ไอเดีย skill ใหม่ประเภท relation (`use-*`, `follow-*`) ที่ยังไม่มี

## Execute

### 1. Select Scope

> Goal: ระบุขอบเขต skills ที่จะวิเคราะห์

1. ถ้า argument ระบุ skill/family → ใช้ตรงๆ; ถ้า `all` หรือไม่ระบุ → survey ทั้ง global skills directory
2. ทำ `/list-devin-global-skills` เพื่อได้รายการ skills ทั้งหมดพร้อม `name`, `description`
3. อ่าน `SKILL.md` frontmatter + `Execute` ของแต่ละ skill ใน scope
4. ถ้า scope > 10 skills → ทำ `/create-plan-in-dot-devin` แทนการวิเคราะห์ในรอบเดียว

### 2. Build Relations Graph

> Goal: มี map ของ relations ที่มีอยู่จริงก่อนเสนอไอเดีย

1. รวม `related` ของทุก skill เป็น directed edges `A -> B`
2. รวม explicit invocations ใน body (`ทำ /skill-name`, `ใช้ /skill-name`) เป็น edges อีกชนิด
3. หา edges ที่ชี้ไปยัง skill ที่ไม่มีอยู่จริง → broken references
4. หา asymmetric pairs — `A.related` มี B แต่ `B.related` ไม่มี A — แล้วตัดสินใจว่าควร symmetric หรือตั้งใจ (ไม่ใช่ทุก pair ต้องสองทาง)

### 3. Identify Relation Gaps

> Goal: หาจุดที่ relations ควรมีแต่ขาด

1. skill ที่ `Execute` เรียก `/skill-name` แต่ไม่ได้ list ใน `related` → เพิ่ม edge เข้า `related`
2. skill ประเภท `create-*`, `update-*`, `new-*` ที่แตะ `SKILL.md` หรือ `global_rules.md` แต่ไม่จบด้วย `/use-related-skills` → เสนอเพิ่ม step
3. skills ที่ Goal/Scope ซ้อนทับกันแต่ไม่ link กัน (เช่น `idea-*` กับ `review-*` ใน domain เดียวกัน) → เสนอ complementary edges
4. skill ที่ถูกเรียกบ่อยแต่ไม่มีใคร link กลับ → เสนอ reverse edges
5. เปรียบเทียบกับผล `/search-skills` — skill ที่ search แนะนำร่วมกันแต่ `related` ไม่สะท้อน

### 4. Draft Relation Ideas

> Goal: เขียน draft ต่อ idea ไม่แก้ไฟล์จริง

1. ต่อ idea ระบุ:
   - `type`: `add-related-edge`, `add-invocation-step`, `new-skill`, `remove-broken-ref`
   - `source skill`, `target skill`, เหตุผล และ relation kind (`direct dependency`, `complementary`, `follow-up`, `alternative`)
   - diff draft ของ frontmatter/Execute step ที่จะแก้ (ไม่ apply จนกว่า confirm)
2. สำหรับ `new-skill` ideas → ระบุชื่อ รูป `<verb>-<domain>` และ draft `name`/`description`/`related` — implementation อยู่ที่ `/idea-new-devin-global-skills` + `/update-devin-global-skills`
3. ทำ `/report` table: `No.`, `Type`, `Source`, `Target`, `Kind`, `Rationale`, `Priority` — continuous numbering ไม่ reset ระหว่าง runs

### 5. Validate And Handoff

> Goal: ตรวจ draft และส่งต่อให้ skill ที่ implement จริง

1. ตรวจว่า target skill ทุกตัวมีอยู่จริง ไม่ซ้ำ `related` เดิม และไม่เสนอ self-reference
2. จัดลำดับตาม impact: broken refs > missing invocation steps > missing edges > new-skill ideas
3. ถ้า user confirm → ทำ `/follow-your-suggestion` แล้ว apply ผ่าน `/use-related-skills` (step Update Related Skills) หรือ `/update-devin-global-skills` — skill นี้คือ idea/draft เท่านั้น
4. ถ้า draft แตะ `global_rules.md` → ระบุว่า apply ต้องผ่าน `/update-devin-harness`
5. ถ้าไม่มี gaps → report ว่า graph สมบูรณ์แล้วและทำ `/suggest-next-action`

## Rules

### 1. Draft Only

- ห้ามแก้ `SKILL.md`, `related` หรือ `global_rules.md` ใน skill นี้ — ออก draft เท่านั้น แล้ว handoff ให้ `/use-related-skills`, `/update-devin-global-skills` หรือ `/update-devin-harness`
- ทุก idea ต้องอ้าง evidence จากไฟล์จริง (frontmatter, Execute steps) — ห้ามเดาจากชื่ออย่างเดียว
- `related` edge ที่เสนอต้องสมเหตุสมผลทั้งทาง (`Goal`/`Scope`/`Execute` เกี่ยวข้องจริง) — ไม่ใช่ link ทุกอย่างเข้าด้วยกัน

### 2. Relation Quality

- ไม่บังคับ symmetry — เสนอ reverse edge เฉพาะเมื่อ target ควรรู้ว่ามี source เรียกใช้มัน
- จำกัด `related` ≤ 10 entries ต่อ skill — ถ้าเกินให้เสนอเฉพาะที่เกี่ยวข้องสุดและเหตุผลว่าควรตัดอะไร
- เมื่อเสนอ invocation step ให้เขียนตาม `update-devin-global-skills` (`## Conventions → Invoke Skills`)
- continuous numbering ต่อจาก idea report เดิมถ้ามี — ไม่ลบไอเดียเก่า

## Expected Outcome

- relations graph ของ skills ใน scope พร้อม broken/asymmetric edges ที่พบ
- ตาราง ideas: edges ที่ควรเพิ่ม, จุดที่ควรเรียก `/use-related-skills`, skill ideas ใหม่
- priority + rationale ต่อ idea พร้อม diff draft ที่ apply ได้ทันทีหลัง confirm
- handoff path ชัดเจน (`/follow-your-suggestion` → `/use-related-skills` หรือ `/update-devin-global-skills`)
