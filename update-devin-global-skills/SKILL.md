---
name: update-devin-global-skills
description: "จัดการ global Devin skills: สร้าง อัปเดต refactor และตรวจสอบมาตรฐาน"
argument-hint: "[@files-or-topic...]"
related:
  - new-skills
  - follow-single-of-source
  - check-all-routes
  - check-release-notes
  - check-content-outdate
  - check-correctness
  - deep-research
  - deep-validate
  - report
  - ship
---

## Goal

สร้าง อัปเดต หรือ refactor global Devin skills ใน `%APPDATA%\devin\skills` ให้ทันสมัย ถูกต้อง และสอดคล้องมาตรฐาน repo

## Scope

ใช้สำหรับ skill ใหม่หรือ skill ที่มีอยู่ รองรับ:

- อัปเดต skill เดียว หลาย skill หรือทั้ง repo
- สร้าง skill ใหม่โดยระบุ idea หรือ topic
- refactor skill ให้ SRP ชัดเจน แยกไฟล์ย่อยเมื่อจำเป็น
- จัด sub-workflows เป็น `subskills/` และ subagent profiles เป็น `subagents/` ตาม [references/subskills-and-subagents.md](references/subskills-and-subagents.md)

ถ้าต้องสร้าง skill เดียวแบบ focused ให้ใช้ `/new-skills` แทน

## Execute

### 1. Prepare Context

> Goal: รู้ environment, conventions, และ scope ก่อนลงมือ

ทำตาม [references/prepare-context.md](references/prepare-context.md) (devin global skills)

### 2. Identify Targets

> Goal: รู้ว่าต้องสร้าง อัปเดต หรือ refactor skill ใด

ทำตาม [references/identify-targets.md](references/identify-targets.md)

### 3. Check Duplicates And Refactor Scope

> Goal: ไม่ซ้ำ และรู้ว่าต้องแยกไฟล์ย่อยเมื่อไหร่

ทำตาม [references/check-duplicates-and-refactor-scope.md](references/check-duplicates-and-refactor-scope.md)

### 4. Select Template And Structure

> Goal: skill มีโครงสร้างเริ่มต้นทีถูกต้อง

ทำตาม [references/select-template-and-structure.md](references/select-template-and-structure.md)

### 5. Deep Research

> Goal: มีข้อมูลล่าสุดก่อนแก้ไข

1. ทำ `/deep-research` โดยระบุ topic หรือ skill ที่จะอัปเดต — ข้ามถ้า topic ไม่ต้อง research
2. ทำ `/check-content-outdate` กับ skill ที่จะแก้ เพื่อหา stale versions/commands/links ก่อนอัปเดต
3. ทำ `/check-release-notes` เพื่อ verify latest version + breaking changes จาก GitHub Releases หรือ official changelog/blog
4. ทำ `/check-all-routes` เพื่อ verify `references/routes.md` ครอบคลุม routes จริงของ official docs site
5. ทำตาม [references/deep-research.md](references/deep-research.md)

### 5b. Prefer Existing CLI Tools Over Custom How-To

> Goal: how-to ใน skill ใช้ tool จริงที่ติดตั้งแล้ว ไม่เขียน script/logic เองถ้า CLI ทำได้

1. ก่อนเขียน how-to ใดๆ (search/replace, JSON/YAML, diff, benchmark, files, git, API calls, screenshots, video) → เช็ค inventory ที่ติดตั้งจริงใน `check-my-global-cli/references/global-cli-commands.md` + `follow-skills-map/references/tool-map.md` ก่อนเสมอ
2. ถ้า tool ตรงปัญหา → เขียน how-to อ้างถึง command จริงของ tool นั้น (เช่น `sd`/`sad` แทน PowerShell replace, `yq`/`jq` แทน parse เอง, `hyperfine` แทน timing เอง, `xh` แทน curl script, `ast-grep` แทน regex refactor, `agent-browser`/`playwright` แทน browser automation เอง)
3. ถ้าไม่รู้ว่ามี tool ไหน → ทำ `/check-my-global-cli` สำรวจเครื่อง หรือ `/deep-research` หา CLI tool ที่แก้ปัญหาได้จริงก่อน — ค่อยเขียนเองเฉพาะเมื่อไม่มี tool เลย
4. ถ้าพบ tool ที่ติดตั้งแต่ไม่มีใน inventory/map → อัปเดต `global-cli-commands.md` และ `tool-map.md` พร้อมกัน
5. ติดตั้งใหม่ผ่าน `mise use -g <tool>` (หรือ scoop/winget ตามที่มี) ถ้า tool จำเป็นและยังไม่มี

### 6. Write Or Update SKILL.md

> Goal: `SKILL.md` ถูกต้องตาม spec

ทำตาม [references/write-update-skill.md](references/write-update-skill.md)

### 7. Add References, Subskills, Examples, And Src

> Goal: skill package ครบถ้วนและไม่ซ้ำซ้อน

ทำตาม [references/add-references-and-src.md](references/add-references-and-src.md)

### 8. Validate And Update References

> Goal: skill ผ่านเกณฑ์ทั้งหมด

ทำตาม [references/validate-and-update-refs.md](references/validate-and-update-refs.md)

### 8b. Sync Living Documents

> Goal: เอกสารที่เก็บข้อมูล (inventory, map, catalog, index) ไม่ stale หลัง skill เปลี่ยน

หลังเพิ่ม/ลบ/merge/rename skill หรือ tool ใดๆ → เช็ค registry ใน [references/living-documents.md](references/living-documents.md) เสมอ แล้ว sync เอกสารที่เกี่ยวข้อง (CLI inventory, tool-map, techstack-catalog, AGENTS.md, subagent registry, `related:` lists) — ไม่ใช่ optional

### 9. Ship

> Goal: ส่งมอบงาน

ทำตาม [references/ship.md](references/ship.md)

## Rules

### 1. Single Responsibility And Refactor

- ทุกไฟล์ใน skill package ไม่เกิน 250 บรรทัด
- `SKILL.md` เป็น entry point หลัก เก็บเฉพาะ high-level workflow และ pointer
- ถ้า skill มี dependencies, CLI, web, templates, หรือ examples จำเป็น → แยกไป `references/`, `templates/`, `examples/`, หรือ `src/` ตาม [references/refactor-guidelines.md](references/refactor-guidelines.md)
- ถ้า skill มีหลาย responsibility → refactor เป็น `references/`, `subskills/` หรือ `subagents/` ตาม decision matrix ใน [references/subskills-and-subagents.md](references/subskills-and-subagents.md)
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

### 4b. Living Documents

- หลัง skill add/remove/merge/rename หรือ tool install → sync living documents ตาม `references/living-documents.md` เสมอ — ห้ามจบงานโดยปล่อยให้ inventory/map/index stale

### 5. Content Standard

- เนื้อหา how-to ต้องอ้างอิง CLI tools ที่ติดตั้งจริง (inventory: `check-my-global-cli/references/global-cli-commands.md`, map: `follow-skills-map/references/tool-map.md`) — ห้ามเขียน script/logic เองถ้ามี CLI ทำได้; ถ้าไม่มี tool ติดตั้ง → หา tool จริงผ่าน `/deep-research` หรือติดตั้งผ่าน `mise use -g` ก่อน

- `name` ตรง directory name, `description` ≤100 ตัวอักษร
- ไม่มี TODO/MOCK/placeholder — ถ้าข้อมูลไม่ชัดให้ระบุความไม่แน่นอน
- global skills เขียนภาษาไทยคงคำศัพท์เทคนิคอังกฤษ
- install commands ตาม ecosystem: `bun add`/`bun install` (Bun/Node), `cargo add` (Rust), `go get` (Go), `pip install` (Python), `mise use -g npm:<package>` สำหรับ global npm CLI
- ใช้ /check-correctness ถ้าจำเป็น


## Expected Outcome

- Skill ใหม่/อัปเดตสะท้อน latest version, APIs, commands และ best practices
- `SKILL.md` ผ่าน `/deep-validate`, ไม่เกิน 250 บรรทัด, ไม่มี TODO/MOCK/placeholder
- `related` ครบถ้วน ไม่มี missing/unused
- Deprecated commands/options ถูกลบออก
- References อัปเดตครบทั้ง `AGENTS.md`, `global_rules.md` และ skills อื่นที่เกี่ยวข้อง
- `/report` สรุป findings และการเปลี่ยนแปลง
