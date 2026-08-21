---
name: prepare-skills-context
description: ตรวจจับ AI tool อ่าน global rules related skills และเลือก template ก่อนเขียน skill
triggers:
  - user
  - model
allowed-tools:
  - read
  - grep
  - glob
  - find_file_by_name
  - skill
  - ask_user_question
related:
  - ask-me
  - read-related-skills
  - check-reference
  - follow-best-practice
  - follow-write-devin-skills
  - suggest-next-action
---

## Goal

ตรวจจับ AI tool, อ่าน `global_rules.md`, อ่าน related skills, และเลือก template ที่เหมาะสมก่อนเริ่มเขียน skill

## Scope

ใช้เมื่อจะสร้างหรือปรับปรุง skill files ใน `global skills` หรือ workspace — ไม่ซ้ำกับการเขียนเนื้อหา skill (`/follow-devin-skills-md`) หรือการ validate (`/validate`)

## Execute

### 1. Detect AI Tool

ตรวจจับ AI tool และ directory เป้าหมาย

> Goal: รู้ target AI tool และ skills directory ก่อนอ่าน context

1. ตรวจจับ AI tool จาก directory:
   - Windsurf → `~/.codeium/windsurf/skills/` หรือ `%APPDATA%\Codeium\Windsurf\skills\`
   - Codex → `~/.codex/skills/`
   - Claude → `~/.claude/skills/`
   - OpenCode → `~/.opencode/skills/`
   - Devin CLI → `~/.config/devin/skills/` หรือ `%APPDATA%\devin\skills\`
   - ถ้าตรวจจับไม่ได้ → ถามผู้ใช้ด้วย `/ask-me` — ถ้าผู้ใช้ไม่ตอบ → stop
2. ระบุ absolute path ของ skills directory ที่จะเขียน
3. ระบุ parent directory สำหรับ `global_rules.md`

### 2. Read Global Rules

อ่าน global rules ของ AI tool ถ้ามี

> Goal: ไม่ซ้ำซ้อนกับ global rules

1. อ่าน `global_rules.md` ของ AI tool ถ้ามี (อยู่ใน parent directory ของ skills directory ที่ตรวจจับได้)
2. ระบุ rules หรือขั้นตอนที่ global rules ครอบคลุมอยู่แล้ว
3. ถ้า `global_rules.md` ไม่มี → ข้ามไปยัง Step 3

### 3. Read Related Skills And References

อ่าน context ของ skills ที่เกี่ยวข้อง

> Goal: ไม่ duplicate ขั้นตอนที่ skills อื่นทำอยู่แล้ว

1. parallel: `/read-related-skills` ∥ `/check-reference`
2. ถ้า skill เกี่ยวกับ `tools` หรือ `libraries` → เพิ่ม `/follow-best-practice` เข้าไปในชุด parallel
3. สรุป dependencies และ skills ที่จะถูกเรียกโดยตรง

### 4. Select Template By Prefix

เลือก template ตามชนิดของ skill

> Goal: ได้ template หรือ structure เริ่มต้นที่เหมาะสม

1. เลือก template ตาม prefix:
   - `run-*` → `follow-write-devin-skills/references/template-skills/template-skills-run.md`
   - `follow-*` → `follow-write-devin-skills/references/template-skills/template-skills-follow.md` ยกเว้น `follow-*-architecture` → `follow-write-devin-skills/references/template-skills/template-skills-architecture.md`
   - `check-*` → `follow-write-devin-skills/references/template-skills/template-skills-check.md`
   - `analyze-*` → `follow-write-devin-skills/references/template-skills/template-skills-analyze.md`
   - `deep-*` → `follow-write-devin-skills/references/template-skills/template-skills-deep.md`
   - `review-*` → `follow-write-devin-skills/references/template-skills/template-skills-review.md`
   - `idea-*` → `follow-write-devin-skills/references/template-skills/template-skills-idea.md`
   - `report-*` → `follow-write-devin-skills/references/template-skills/template-skills-report.md`
   - ถ้าไม่ตรง → บันทึกว่าไม่มี template ตรง prefix
2. อ่าน template ที่เลือกเพื่อดูโครงสร้าง sections, steps, และ rules ขั้นต่ำ
   - ใช้ relative path `follow-write-devin-skills/references/template-skills/template-skills-<prefix>/SKILL.md`
3. ถ้าไม่มี template ตรง prefix → ระบุใน report และให้ `/suggest-next-action` แนะนำ `/follow-write-devin-skills` หรือ `/follow-devin-skills-md`

### 5. Confirm Context

ตรวจสอบว่าพร้อมเขียนหรือยัง

> Goal: ไม่ฝืนเขียนเมื่อ context ไม่ชัด

1. ตรวจสอบว่ามี: AI tool, directory, template/structure, dependencies
2. ถ้า context ไม่ชัดหรือ reference ไม่มี → stop และ report
3. ทำ `/suggest-next-action` เพื่อแนะนำ step ถัดไป

## Rules

### 1. AI Tool Detection

- ตรวจจับ AI tool จาก path ก่อนอ่าน context
- ถ้าตรวจจับไม่ได้ต้องถามผู้ใช้ — ไม่เดา
- ใช้ `/skill-name` แทน tool-specific syntax

### 2. No Duplication With Global Rules

- อ่าน `global_rules.md` ก่อนเขียน skill เสมอ
- ถ้า global rules ครอบคลุมขั้นตอนใดไว้แล้ว → อ้างอิงแทน
- ไม่เขียนขั้นตอนที่ทำหน้าที่ global rules หรือ skill อื่น

### 3. Template Consistency

- ทุก skill ที่มี prefix เดียวกันต้องมีโครงสร้างใกล้เคียงกัน
- ใช้ templates ใน `follow-write-devin-skills/references/template-skills/` เป็น canonical structure
- ถ้า skill เบี่ยงเบนจาก template → ระบุเหตุผลใน `## Scope`
- Template เองต้องมี `## Example Template`

### 4. Prefix Formulas

- `run-*` → output ไป OS temp directory, ใช้ `/check-configuration` ก่อน, มี error handling และ verification
- `watch-*`/`test-*` → ตรวจสอบต่อเนื่องหรือ run tests, มี loop และ auto-fix
- `deploy-*` → มี rollback strategy, ใช้ `/follow-deploy`
- `follow-*` → รองรับ parallel execution ด้วย `/follow-parallel` และ `∥` markers
- `review-*`/`analyze-*` → ใช้ `/update-review-cli` สำหรับ analysis, มี severity, actionable recommendations, output เป็น `/report-format-table`
- `check-*` → มี pass/fail condition, รายงานเป็นตาราง
- `deep-*` → เป็น orchestrator ที่เรียก sub-skills
- `refactor-*` → ใช้ `/deep-analyze`, มี impact analysis
- `refactor-to-*` → ใช้ `/follow-*` ที่เกี่ยวข้อง, มี identify → plan → refactor → verify → report
- `improve-*`/`write-*` → ใช้ `/follow-write-devin-skills` เป็นมาตรฐาน, มี review ก่อน improve
- `create-*`/`add-*`/`delete-*` → มี dry run ก่อน, อัปเดท references ด้วย `/update-reference`
- `update-*` → ตรวจ git changes ก่อน, ใช้ `/check-should-update`
- `report-*` → ระบุ output format, ใช้ `/report-format-*`
- `list-*`/`search-*` → อ่านและแสดงข้อมูลเป็นตาราง, ไม่แก้ไขไฟล์
- `use-*` → อ้างอิง official documentation, ไม่ reinvent
- `template-*` → เป็น canonical structure สำหรับ prefix นั้น, ต้องมี `## Example Template`

### 5. Fail Fast

- ถ้า context ไม่ชัดหรือ reference ไม่มี → stop และ report
- ถ้า template ไม่ตรง → ให้ `/suggest-next-action` แนะนำ next step เช่น `/follow-write-devin-skills` หรือ `/follow-devin-skills-md`

## Expected Outcome

- รู้ target AI tool, skills directory, และ parent path ของ `global_rules.md`
- ได้ template หรือ general structure ที่เหมาะสมกับ prefix
- รายการ references ที่ต้องใช้ พร้อมสถานะ valid/invalid
- ไม่ duplicate กับ global rules หรือ skills อื่น
