---
name: write-skills-md
description: เขียนหรือปรับปรุง SKILL.md หนึ่งไฟล์ตามมาตรฐาน Devin CLI
related:
  - follow-write-devin-skills
  - follow-content-quality
  - validate
  - check-reference
  - update-reference
  - ask-me
---

## Goal

สร้างหรือปรับปรุงไฟล์ `SKILL.md` หนึ่งไฟล์ให้ถูกต้อง สมบูรณ์ และสอดคล้องกับ Devin CLI skill format

## Scope

ใช้สำหรับเขียนหรือแก้ไฟล์ `SKILL.md` ใน `.devin/skills/`, `.windsurf/skills/`, `.agents/skills/`, `~/.config/devin/skills/`, `~/.codeium/<channel>/skills/`, หรือ `%APPDATA%\devin\skills\` โดย focus เฉพาะไฟล์ `SKILL.md` ไม่รวมการสร้าง directory หรือ orchestration

## Execute

### 1. Prepare Skill Context

เตรียม context และตำแหน่งของ `SKILL.md`

> Goal: ทราบ target, conventions, และ template ก่อนเขียน

1. ระบุ target path ของ `SKILL.md` และ skill name
2. ทำ `/follow-write-devin-skills` เพื่อเข้าใจ conventions ของ skill repo ปัจจุบัน
3. ทำ `/learn-from-web` จาก `https://docs.devin.ai/cli/extensibility/skills/overview` และ `https://docs.devin.ai/cli/extensibility/skills/creating-skills` เมื่อต้องการ verify spec
4. เลือก template ตาม prefix จาก `/template-skills-*` ถ้ามี
5. ถ้า context ไม่ชัดหรือ skill ซ้ำ → stop และ `/ask-me`

### 2. Write Frontmatter

เขียน YAML frontmatter ตาม Devin CLI spec

> Goal: frontmatter valid ครบถ้วนและตรง spec

1. `name` ตรงกับ directory name ใช้ lowercase คั่นด้วย `-`
2. `description` กระชับ ≤100 ตัวอักษร
3. `argument-hint` ถ้า skill รับ arguments (เช่น `[file] [options]`)
4. `model` ถ้าต้องการ override model (เช่น `sonnet`, `swe`, `opus`)
5. `subagent: true` ถ้ารันเป็น subagent (experimental)
6. `agent: <profile>` ถ้าใช้ custom subagent profile (เช่น `reviewer`, `subagent_explore`)
7. `allowed-tools` จำกัดเฉพาะ tools ที่จำเป็น (เช่น `read`, `edit`, `grep`, `glob`, `exec`)
8. `permissions` กำหนด `allow`, `deny`, `ask` ตามความเสี่ยง
9. `triggers` เป็น `['user']`, `['model']`, หรือ `['user', 'model']`

### 3. Write Prompt Body

เขียนเนื้อหา prompt หลัง frontmatter

> Goal: prompt ชัดเจน ทำตามได้จริง ไม่เกิน 250 บรรทัด

1. `## Goal` ตอบว่า skill ทำอะไร
2. `## Scope` ระบุขอบเขตและไม่ทับซ้อนกับ skills อื่น
3. `## Execute` แบ่งเป็น steps ไม่เกิน 10 โดยใช้ `### N. Step Name`, description, `> Goal:`, และ numbered list
4. `## Rules` จัดกลุ่มเป็น single concern
5. `## Expected Outcome` ระบุ output format ชัดเจน
6. ใช้ `## Key Concepts`, `## Principles`, `## Guide`, หรือ `## Examples` เมื่อต้องการเน้นรูปแบบหรือตัวอย่าง
7. ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `/skill-name`

### 4. Apply Quality And Safety

ตรวจสอบคุณภาพและความปลอดภัย

> Goal: skill ปลอดภัย กระชับ และ deterministic

1. `allowed-tools` จำกัดตาม minimum required
2. `permissions` ระบุ `deny` สำหรับ paths เสี่ยง (เช่น `/etc/`, system root)
3. ไม่ใส่ secrets, credentials หรือ hardcoded paths ที่ sensitive
4. ทุก step มี fail handling: stop/report/ask เมื่อ context ไม่ชัด
5. ผลลัพธ์ deterministic: input เดียวกัน → output เดียวกัน

### 5. Validate SKILL.md

ตรวจสอบไฟล์ก่อน finalize

> Goal: SKILL.md ผ่านเกณฑ์ทั้งหมด

1. ทำ `/validate` ตรวจความถูกต้อง
2. ทำ `/review-devin-global-skills` ตรวจ: ไม่เกิน 250 บรรทัด, sections ครบ, `related` ไม่มี missing/unused, ไม่มี TODO/MOCK/placeholder
3. ทำ `/check-reference` ตรวจ `related` references
4. ถ้ามีปัญหา → แก้และ revalidate (max 3 → stop/report)

### 6. Update References

อัปเดต references หลังเสร็จ

> Goal: references ครบถ้วน

1. ทำ `/update-reference` ถ้ามีการเปลี่ยนชื่อหรือเพิ่ม references
2. ทำ `/suggest-next-action` เพื่อแนะนำ step ถัดไป

## Rules

### 1. File And Location

- `SKILL.md` อยู่ใน `<skill-name>/` ของ skill directory
- ตำแหน่งรองรับ: `.devin/skills/`, `.windsurf/skills/`, `.agents/skills/`, `~/.config/devin/skills/`, `~/.codeium/<channel>/skills/`, `%APPDATA%\devin\skills\`
- directory name ต้องตรงกับ `name` ใน frontmatter

### 2. Frontmatter Fields

- `name` (required): ตรง directory name
- `description` (required): ≤100 ตัวอักษร
- `argument-hint` (optional): ระบุเฉพาะเมื่อ skill รับ arguments
- `model` (optional): `sonnet`, `swe`, `opus`, `codex`
- `subagent` (optional): `true` หรือ `false`
- `agent` (optional): profile name สำหรับ custom subagent
- `allowed-tools` (recommended): `read`, `edit`, `grep`, `glob`, `exec` หรือ MCP tools
- `permissions` (optional): `allow`, `deny`, `ask`
- `triggers` (optional): default `['user', 'model']`

### 3. Content Structure

- ลำดับ sections: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
- ใช้ `## Key Concepts`, `## Principles`, `## Guide`, `## Examples` เป็นส่วนเสริม
- heading ภาษาอังกฤษ Title Case, รายการเนื้อหาภาษาไทย
- ไม่เกิน 250 บรรทัดต่อ `SKILL.md`
- ไม่ใช้ `**` (bold markers) ใช้ backticks สำหรับ emphasis

### 4. Subagent And Model

- ใช้ `subagent: true` สำหรับงาน focused, self-contained
- ใช้ `agent: <profile>` เมื่อต้องการ profile เฉพาะ
- ถ้า `agent` และ `subagent` ตั้งค่าทั้งคู่ `agent` มี precedence
- skill ที่รันเป็น subagent จะไม่ spawn nested subagents

### 5. Safety And Permissions

- `allowed-tools` จำกัดตาม minimum required
- `permissions` ระบุ `deny` สำหรับ system paths ที่เสี่ยง
- `permissions` ระบุ `ask` สำหรับ write ที่สำคัญ
- ไม่ใส่ secrets หรือ credentials ใน prompt

## Expected Outcome

- `SKILL.md` ที่ valid ตาม Devin CLI spec
- frontmatter ครบถ้วนและถูกต้อง
- prompt body มี `Goal`, `Scope`, `Execute`, `Rules`, `Expected Outcome`
- ไม่เกิน 250 บรรทัด
- references อัปเดตครบถ้วน

## Examples

```markdown
---
name: review
description: Review staged changes for issues
allowed-tools:
  - read
  - grep
  - glob
  - exec
permissions:
  allow:
    - Exec(git diff)
    - Exec(git log)
triggers:
  - user
---

## Goal

Review the current git diff and provide feedback

## Scope

ใช้ก่อน commit เพื่อตรวจสอบความถูกต้อง

## Execute

### 1. Get Diff

แสดง diff ที่จะ commit

> Goal: รู้สิ่งที่เปลี่ยนแปลง

1. รัน `git diff --staged` หรือ `git diff` ถ้ายังไม่ได้ stage
2. บันทึก files ที่เปลี่ยน

### 2. Review Changes

ตรวจสอบ changes

> Goal: หาปัญหาที่อาจเกิดขึ้น

1. ตรวจ logic errors หรือ edge cases
2. ตรวจ security issues
3. ตรวจ style inconsistencies
4. สรุป findings พร้อม line references

## Rules

### 1. Review Focus

- ตรวจ correctness, security, performance, style
- ให้ specific line references
- ไม่แก้ source โดยไม่ได้รับอนุญาต

## Expected Outcome

- สรุป findings พร้อม specific line references
- แนะนำ improvements ที่ actionable
```