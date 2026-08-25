---
name: devin-global-skills
description: รวบรวม skills สำหรับ Devin CLI ทั้ง global และ project-specific
related:
  - update-agents-md
  - follow-agents-md
  - follow-write-devin-skills
  - validate
  - review-rules
  - review-all-skills
  - git-commit
  - ship
  - report
  - use-markdown
---

## Goal

จัดทำและรักษา `AGENTS.md` และ conventions ของ Devin global skills repository ให้ถูกต้อง ครบถ้วน และพร้อมใช้งาน

## Scope

ใช้กับ root workspace `%APPDATA%\devin\skills\` ที่เก็บ skill packages ทั้งหมด ไม่รวมการแก้ไข source code ของแต่ละ skill โดยตรง

## Execute

### 1. Start Every Task

> Goal: ตรวจสอบสถานะ workspace และ references ก่อนลงมือ

1. ทำตาม `/update-agents-md` ก่อนเริ่มงานทุกครั้ง
2. ทำตาม `/follow-agents-md` เพื่ออ่านและทำตาม `AGENTS.md`
3. อ่าน global rules จาก `C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
4. อ่าน `/follow-write-devin-skills` เมื่อแก้ไข skill

### 2. Maintain AGENTS.md

> Goal: ให้ `AGENTS.md` เป็นปัจจุบันและถูกต้อง

1. ทำตาม `/check-monorepo` เพื่อตรวจสอบ monorepo
2. ทำตาม `/analyze-project` เพื่อวิเคราะห์ tech stack และ structure
3. ทำตาม `/all-workspaces` ถ้าเป็น monorepo
4. อัปเดท `### Architecture`, `### Skills`, `### Workspaces` ตาม project จริง
5. เก็บไฟล์ไม่เกิน 250 บรรทัด

### 3. Validate And Ship

> Goal: ตรวจสอบและ commit การเปลี่ยนแปลง

1. ทำตาม `/review-rules` เพื่อตรวจสอบ `AGENTS.md`
2. ทำตาม `/review-all-skills` เมื่อแก้ไข skills
3. ทำตาม `/validate` เพื่อตรวจสอบความถูกต้อง
4. ทำตาม `/git-commit` หรือ `/ship-workspace` เพื่อ commit การเปลี่ยนแปลง
5. ทำตาม `/report` เพื่อสรุปผล

## Rules

### 1. Format

- ใช้ frontmatter `name`, `description`, `related`
- ลำดับ sections: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
- ไฟล์ไม่เกิน 250 บรรทัด
- ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill-name`

### 2. Architecture

- `devin-cli-skills: /follow-write-devin-skills`

### 3. Skills

- `update-agents-md: /update-agents-md`
- `follow-agents-md: /follow-agents-md`
- `follow-write-devin-skills: /follow-write-devin-skills`
- `validate: /validate`
- `review-rules: /review-rules`
- `review-all-skills: /review-all-skills`
- `git-commit: /git-commit`
- `ship-workspace: /ship-workspace`
- `ship-skills: /ship-skills`
- `ship-repo: /ship-repo`
- `update-project: /update-project`
- `report: /report`
- `use-markdown: /use-markdown`
- `review-refactor: /review-refactor`
- `review-update: /review-update`
- `review-implement: /review-implement`
- `review-plan: /review-plan`
- `review-test: /review-test`
- `review-deploy: /review-deploy`
- `review-release: /review-release`
- `review-migration: /review-migration`
- `review-quality: /review-quality`
- `review-frontend: /review-frontend`
- `review-backend: /review-backend`
- `review-platform: /review-platform`
- `review-architecture: /review-architecture`
- `review-stability: /review-stability`
- `review-delivery: /review-delivery`
- `review-techstack: /review-techstack`
- `review-writing: /review-writing`
- `review-codebase: /review-codebase`
- `review-gaps: /review-gaps`
- `review-dot-devin: /review-dot-devin`
- `review-skills: /review-skills`
- `review-devin-subagents: /review-devin-subagents`
- `review-features: /review-features`
- `review-create-analyze-cli: /review-create-analyze-cli`
- `review-create-review-cli: /review-create-review-cli`
- `review-readme: /review-readme`
- `review-docs: /review-docs`
- `review-usage: /review-usage`
- `update-usage: /update-usage`
- `review-agents-md: /review-agents-md`
- `review-references: /review-references`
- `review-dependencies: /review-dependencies`
- `gen-release: /gen-release`
- `update-dependencies: /update-dependencies`

### 4. Workspaces

- ไม่ใช่ monorepo: workspace เดียวคือ root (`%APPDATA%\devin\skills\`)

### 5. Safety

- ไม่แก้ไข `SKILL.md` ของ skill อื่นโดยไม่ได้รับคำสั่ง
- ไม่ลบหรือย้าย skill directories โดยไม่มี dry run
- ทำ dry run ก่อน destructive actions

## Expected Outcome

- `AGENTS.md` ถูกต้องตาม Devin CLI standards
- references ทุก skill มีอยู่จริง
- commit การเปลี่ยนแปลงพร้อม next action
