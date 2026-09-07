---
name: update-devin-global-skills
description: จัดการ global Devin skills: สร้าง อัปเดต refactor และตรวจสอบมาตรฐาน
argument-hint: "[@files-or-topic...]"
related:
  - create-devin-global-skills
  - update-project-skills
  - deep-research
  - learn-from-web
  - follow-skills-map
  - review-devin-global-skills
  - update-devin-global-rules
  - deep-validate
  - check-circular-dependencies
  - check-reference
  - update-references
  - report
  - ship
  - use-related-skills
  - use-in-another-skills
---

## Goal

สร้าง อัปเดต หรือ refactor global Devin skills ใน `%APPDATA%\devin\skills` ให้ทันสมัย ถูกต้อง และสอดคล้องมาตรฐาน repo

## Scope

ใช้สำหรับ skill ใหม่หรือ skill ที่มีอยู่ รองรับ:

- อัปเดต skill เดียว หลาย skill หรือทั้ง repo
- สร้าง skill ใหม่โดยระบุ idea หรือ topic
- refactor skill ให้ SRP ชัดเจน แยกไฟล์ย่อยเมื่อจำเป็น

ถ้าต้องสร้าง skill เดียวแบบ focused ให้ใช้ `/create-devin-global-skills` แทน

ดูเพิ่มเติม: /create-devin-global-skills, /update-project-skills, /review-devin-global-skills

## Execute

### 1. Prepare Context

> Goal: รู้ environment, conventions, และ scope ก่อนลงมือ

1. ตรวจจับ AI tool และ skills directory จาก path:
   - Windsurf → `~/.codeium/windsurf/skills/` หรือ `%APPDATA%\Codeium\Windsurf\skills\`
   - Codex → `~/.codex/skills/`
   - Claude → `~/.claude/skills/`
   - OpenCode → `~/.opencode/skills/`
   - Devin CLI → `~/.config/devin/skills/` หรือ `%APPDATA%\devin\skills\`
   - ถ้าตรวจจับไม่ได้ → ถามผู้ใช้ด้วย `/ask-me`
2. อ่าน `global_rules.md` และ `AGENTS.md` ของ AI tool ที่ตรวจจับได้
3. ทำ `/check-skills-related` และ `/check-reference` เพื่อดู skills ที่เกี่ยวข้อง
4. ถ้า update เป็น long-horizon task หรือ context ใกล้เต็ม → ใช้ `/follow-context-engineering`
5. ถ้า context ไม่พร้อม หรือ reference จำเป็นไม่มี → stop และ report

### 2. Identify Targets

> Goal: รู้ว่าต้องสร้าง อัปเดต หรือ refactor skill ใด

1. รับ `@files...` หรือ `topic` จาก argument หรือ context
2. ถ้าไม่มี `@files` → ทำ bulk orchestration ตาม [references/bulk-update.md](references/bulk-update.md)
3. ถ้ามี `@files` → อัปเดตเฉพาะ skill ที่ระบุ
4. ถ้า `SKILL.md` ยังไม่มี → ส่งต่อ `/create-devin-global-skills`
5. ถ้าชื่อไม่ชัด → ทำ `/ask-me` ก่อนดำเนินการ
6. ทำ `/use-related-skills` และ `/follow-skills-map` เพื่อหากลุ่ม skills ที่เกี่ยวข้อง

### 3. Check Duplicates And Refactor Scope

> Goal: ไม่ซ้ำ และรู้ว่าต้องแยกไฟล์ย่อยเมื่อไหร่

1. ทำ `/scan-codebase` เพื่อหา skills ที่ซ้ำหรือคล้ายกัน
2. ถ้าซ้ำมาก → แนะนำ update/extend/rename แทนการสร้างใหม่
3. อ่าน [references/refactor-guidelines.md](references/refactor-guidelines.md)
4. ถ้า `SKILL.md` เกิน 250 บรรทัด หรือมีหลาย responsibility → วางแผนแยกไฟล์ย่อยก่อน write

### 4. Select Template And Structure

> Goal: skill มีโครงสร้างเริ่มต้นที่ถูกต้อง

1. เลือก template ตาม prefix จาก [templates/](templates/) โดยใช้ longest match ดู index ที่ [templates/index.md](templates/index.md)
2. ถ้า skill ไม่ตรง prefix ใด → ใช้โครงสร้างมาตรฐาน `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
3. สร้าง directory structure ตาม [references/directory-structure.md](references/directory-structure.md)
4. ถ้าสร้าง app หรือ CLI → ทำ `/follow-my-tech-stack` และ `/review-techstack` ก่อน

### 5. Deep Research

> Goal: มีข้อมูลล่าสุดก่อนแก้ไข

1. ทำ `/deep-research` โดยระบุ topic หรือ skill ที่จะอัปเดต
2. ทำ `/learn-from-web` จาก official docs, changelog, repository เป็นแหล่งหลัก
3. บันทึก: latest version, breaking changes, new commands, deprecations, environment variables, URLs
4. หาตัวอย่าง command, config, output จริง — ไม่เดา API หรือ command
5. ถ้า topic ไม่ต้อง research → ข้ามขั้นตอนนี้

### 6. Write Or Update SKILL.md

> Goal: `SKILL.md` ถูกต้องตาม spec

1. อ่าน `SKILL.md` เดิมของ skill เป้าหมาย
2. อัปเดต frontmatter ตาม [references/frontmatter.md](references/frontmatter.md)
3. อัปเดต sections: `Goal`, `Scope`, `Execute`, `Rules`, `Expected Outcome`
4. แบ่ง `## Execute` เป็น steps ไม่เกิน 10 โดยใช้ `### N. Step Name`, description, `> Goal:`, numbered list
5. อัปเดต commands, options, examples, environment variables, และ URLs
6. ลบ deprecated commands/options ออก
7. ถ้าไฟล์เกิน 250 บรรทัด → ย้ายเนื้อหาลง `references/` ตาม [references/refactor-guidelines.md](references/refactor-guidelines.md)

### 7. Add References, Examples, And Src

> Goal: skill package ครบถ้วนและไม่ซ้ำซ้อน

1. ถ้า skill มี dependencies → สร้าง `references/` ครบทุก dependency
2. ถ้ามี CLI หรือ web → สร้าง `src/` ตาม [references/src.md](references/src.md)
3. ถ้ามี templates หรือ examples → สร้าง `templates/` หรือ `examples/`
4. อ่านรายละเอียด create workflow ใน [references/create-devin-skills.md](references/create-devin-skills.md)
5. ตรวจ markdown links ชี้ไปไฟล์ที่มีอยู่จริง

### 8. Validate And Update References

> Goal: skill ผ่านเกณฑ์ทั้งหมด

1. ทำ `/review-devin-global-skills` เพื่อตรวจ conventions, naming, structure
2. ทำ `/deep-validate` เพื่อตรวจ frontmatter, sections, ความยาว, `related` missing/unused, TODO/MOCK/placeholder
3. ทำ `/check-circular-dependencies` ถ้ามีการแก้ `related`
4. ทำ `/update-references` เพื่อ sync references ทั่ว repo
5. ทำ `/use-in-another-skills` เพื่อหา skills อื่นที่ควร integrate หรือขยายจาก skill ใหม่/อัปเดต
6. อัปเดต `AGENTS.md` ถ้ามีการ rename หรือย้าย skill
6. ถ้า skill เกี่ยวข้องกับ global rules → อัปเดต `global_rules.md` และ `/update-devin-global-rules`
7. ถ้าไม่ผ่าน → แก้และ recheck (max 3 รอบ → stop และ report)

### 9. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะและ stop
3. ทำ `/report` สรุป topic, old info, new info, files changed และ next actions

## Rules

### 1. Single Responsibility And Refactor

- ทุกไฟล์ใน skill package ไม่เกิน 250 บรรทัด
- `SKILL.md` เป็น entry point หลัก เก็บเฉพาะ high-level workflow และ pointer
- ถ้า skill มี dependencies, CLI, web, templates, หรือ examples จำเป็น → แยกไป `references/`, `templates/`, `examples/`, หรือ `src/` ตาม [references/refactor-guidelines.md](references/refactor-guidelines.md)
- ถ้า skill มีหลาย responsibility → refactor เป็นไฟล์ย่อยหรือ subskills
- ถ้าเนื้อหาซ้ำกับ skill อื่น → merge เข้าตัวเดิมแทนการสร้างใหม่

### 2. Official Sources First

- ใช้ official docs, changelog, repository เป็นแหล่งหลัก
- ไม่ใช้ third-party ถ้า official มี และระบุ source URLs

### 3. Evidence-Based Updates

- ทุกการแก้ skill ต้องมี evidence และบันทึก version ที่ research
- ไม่เดา API, command หรือ version

### 4. Safety

- ทำ dry run ก่อน destructive หรือ high-risk actions
- ถ้ามี overwrite ไฟล์เดิม → user confirmation ก่อน
- ไม่ทำลาย references หรือ existing skills

### 5. Content Standard

- `name` ตรง directory name, `description` ≤100 ตัวอักษร
- ไม่มี TODO/MOCK/placeholder — ถ้าข้อมูลไม่ชัดให้ระบุความไม่แน่นอน
- global skills เขียนภาษาไทยคงคำศัพท์เทคนิคอังกฤษ
- install commands ตาม ecosystem: `bun add`/`bun install` (Bun/Node), `cargo add` (Rust), `go get` (Go), `pip install` (Python), `mise use -g npm:<package>` สำหรับ global npm CLI

## Expected Outcome

- Skill ใหม่/อัปเดตสะท้อน latest version, APIs, commands และ best practices
- `SKILL.md` ผ่าน `/deep-validate`, ไม่เกิน 250 บรรทัด, ไม่มี TODO/MOCK/placeholder
- `related` ครบถ้วน ไม่มี missing/unused
- Deprecated commands/options ถูกลบออก
- References อัปเดตครบทั้ง `AGENTS.md`, `global_rules.md` และ skills อื่นที่เกี่ยวข้อง
- Report table สรุป findings และการเปลี่ยนแปลง
