---
name: create-devin-global-skills
description: สร้าง devin global skill ใหม่ตามมาตรฐาน repo
argument-hint: "[idea or topic]"
related:
  - use-related-skills
  - update-devin-global-skills
  - scan-codebase
  - review-devin-global-skills
  - update-devin-global-rules
  - deep-validate
  - update-references
---

## Goal

สร้าง devin global skill ใหม่หนึ่งตัวจาก idea หรือ topic ที่กำหนด โดยไม่ซ้ำกับ skills ที่มีอยู่

## Scope

ใช้เมื่องานต้องสร้าง skill ใหม่เท่านั้น ไม่รวมการ update หรือ refactor skills เดิม

ถ้าต้องการสร้าง skills จาก dependencies ใน package manifest (`package.json`, `Cargo.toml`) ที่ยังไม่มีใน global → ดู flow ใน [references/create-skills-from-manifest.md](references/create-skills-from-manifest.md) (แก้ path เป็น `%APPDATA%\devin\skills`)

## Execute

### 1. Clarify Idea

> Goal: เข้าใจ skill ที่ต้องสร้าง

1. รับ idea หรือ topic จาก argument หรือ context
2. ถ้าไม่ชัด → ทำ `/ask-me` ก่อน
3. สรุป Goal, Scope, กลุ่มเป้าหมาย และ Expected Outcome คร่าวๆ

### 2. Check Duplicates

> Goal: ตรวจว่าไม่ซ้ำกับ skills ที่มี

1. ทำ `/scan-codebase` เพื่อหา skills ที่คล้ายกัน
2. ทำ `/use-related-skills` เพื่อพิจารณาความเกี่ยวข้อง/extend/rename
3. ถ้าซ้ำมาก → แนะนำ `/update-devin-global-skills` แทน

### 3. Research

> Goal: มีข้อมูลทีถูกต้องและไม่ตก trend

1. ถ้า topic เป้น library/tool → ทำ `/follow-best-practice` หรือ deep research ตาม `/update-devin-global-skills`
2. เก็บ references ไว้ใน `references/`

### 4. Create Skill

> Goal: สร้าง SKILL.md และ directory structure ทีถูกต้อง

1. ใช้ `/update-devin-global-skills` เพื่อเลือก template และเขียน `SKILL.md`
2. กำหนด `name` ให้ตรงกับ directory name และ `description` ไม่เกิน 100 ตัวอักษร
3. ใส่ `related` ครบถ้วน
4. ถ้าไฟล์เกิน 250 บรรทัด → แยกส่วนลง `references/`

### 5. Validate And Ship

> Goal: skill พร้อมใช้งาน

1. ทำ `/review-devin-global-skills` เพื่อตรวจ conventions
2. ทำ `/update-devin-global-rules` เพื่อตรวจ global rules
3. ทำ `/deep-validate` เพื่อตรวจ frontmatter, links, TODO, placeholders
4. ทำ `/update-references` เพื่อ sync references ทั่ว repo
5. ทำ `/ship` เมื่องานเสร็จ

## Rules

### 1. Single Skill

- สร้างทีละ skill ต่อ invocation (ทำซ้ำได้ถ้าต้องสร้างหลายตัว — รองรับ capability จาก new-skills ที่ merge มา)
- ถ้าต้องสร้างหลายตัว → ทำซ้ำ flow นี้ทีละตัว ตามมาตรฐาน `/update-devin-global-skills`

### 2. No Duplicate

- ตรวจซ้ำก่อนสร้าง
- ถ้ามี skill คล้ายกัน → แนะนำ extend หรือ update แทน

### 3. Standard Conventions

- มี `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
- ใช้ backticks สำหรับ commands, skill names, paths
- ภาษาไทยสำหรับเนื้อหา ยกเว้น heading Title Case

### 4. Prefix Naming Contract

เลือก prefix ตาม semantics เดียวเท่านั้น — ห้ามสร้าง skill ใหม่ที่ขัด contract:

| No. | Prefix | หน้าที่ | Output | เขียนไฟล์ |
|-----|--------|--------|--------|----------|
| 1 | `check-*` | Detector — ตรวจจุดเดียว เร็ว deterministic | pass/fail + locations | ไม่ |
| 2 | `review-*` | Assessor — ประเมิน 1 มิติ | findings + severity + evidence | ไม่ |
| 3 | `deep-*` | Orchestrator หลายขั้น/หลายมิติ | dispatch ไป skill ย่อย | ตามย่อย |

- ห้ามสร้าง `improve-*` หรือ `optimize-*` ใหม่ — fixer ถูกยุบรวมเป็น section `## Fix` ใน `review-*` ที่ตรง domain (ทำงานเฉพาะเมื่อ user confirm)
- ทิศทางเดียว: `check` → `review` → `## Fix` — ห้ามย้อนกลับ
- fix ใดๆ ให้เขียนเป็น `references/fix-*.md` แล้วอ้างจาก section `## Fix` ของ review skill
- ถ้า skill ใหม่ทับ scope กับที่มี → merge เข้าตัวเดิมแทนสร้างใหม่ (`/merge`, `/idea-merge-files`)

### 5. References

- บันทึก external docs ลง `references/`
- ตรวจ markdown links ไม่ให้ broken
- อัปเดต `AGENTS.md` ถ้า skill นี้เป้น workflow หลัก

## Expected Outcome

- skill ใหม่อยู่ใน `%APPDATA%\devin\skills\<name>\`
- `SKILL.md` มี frontmatter ครบถ้วนและเนื้อหาสอดคล้อง goal
- references ไม่ broken
- ผ่าน `/deep-validate`
- ใช้ร่วมกับ `/update-devin-global-skills` ในกระบวนการสร้าง

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: new-skills)
