---
name: deep-update-project
description: อัปเดต root project ครบวงจรด้วย deep review, cross-workspace sync, validation
argument-hint: "[scope]"
related:
  - update-project
  - update-config
  - update-dot-devin
  - update-readme-md
  - update-agents-md
  - update-usage-md
  - update-features-md
  - update-project-rules
  - update-project-skills
  - update-examples
  - update-test-everything
  - update-todo-md
  - update-references
  - update-gitignore
  - update-dot-vscode
  - update-github-metadata
  - update-version-latest
  - deep-analyze
  - deep-review
  - deep-validate
  - all-workspace
  - check-monorepo
  - rethink
---

## Goal

อัปเดต root project ครบวงจร — เชื่อม git log ทุก workspace, sync project docs/config/rules/tooling, ด้วย deep review, cross-workspace analysis, และ comprehensive validation

## Scope

ใช้หลัง ship ทุก workspace หรือก่อน release เพื่อ sync root project ให้สะท้อนสถานะล่าสุด — ไม่แก้ไข workspace source code

## Execute

Step dependencies: แต่ละ step ขึ้นกับ step ก่อนหน้าตามลำดับ

### 1. Deep Review And Baseline

> Goal: เข้าใจสถานะปัจจุบันของ root project และ workspaces

1. ทำ `/deep-thinking` เพื่อวิเคราะห์เป้าหมาย
2. ทำ `/deep-analyze` และ `/deep-review` เพื่อวิเคราะห์ root project
3. ทำ `/check-monorepo` เพื่อยืนยัน monorepo status
4. ทำ `/all-workspace` เพื่อรายการทุก workspace
5. บันทึก baseline: structure, docs, configs, skills, metadata

### 2. Check Git Log Across Workspaces

> Goal: รวบรวมข้อมูลที่เปลี่ยนแปลงจากทุก workspace

1. สำหรับแต่ละ workspace รัน `git log --oneline -5`
2. รัน `git diff HEAD~1 --stat` เพื่อดู changed files
3. ระบุ architecture changes, skills changes, workspace changes, features changes
4. บันทึก commit hash, message, และ changed files เป็น summary

### 3. Sync Root Documentation

> Goal: อัปเดต root docs ให้สะท้อนงานล่าสุด

1. ทำ `/update-readme-md` เพื่อ sync `README.md`
2. ทำ `/update-agents-md` เพื่อ sync `AGENTS.md`
3. ทำ `/update-usage-md` ถ้ามี `usage.kdl` หรือ `USAGE.md`
4. ทำ `/update-features-md` เพื่อ sync `FEATURES.md`
5. อัปเดต `CHANGELOG.md` หรือ release notes ถ้ามี

### 4. Sync Config And Tooling

> Goal: อัปเดต config, rules, และ tooling

1. ทำ `/update-config` เพื่อ sync shared config และ dependencies catalog
2. ถ้า root มี versioned manifests (`package.json`, `mise.toml`, `Cargo.toml`, `go.mod`, `pyproject.toml`) หรือต้องการ update ทุก version → ทำ `/update-version-latest` เพื่อ sync runtimes/dependencies/tools/config
3. ทำ `/update-dot-devin` เพื่อ sync `.devin` structure
4. ทำ `/update-gitignore` เพื่อ sync `.gitignore`
5. ทำ `/update-dot-vscode` เพื่อ sync `.vscode` settings
6. ทำ `/update-project-rules` ถ้ามี `rules/` หรือ `sgconfig.yml`

### 5. Sync Project Skills And Examples

> Goal: อัปเดต project skills และ examples

1. ทำ `/update-project-skills` เพื่อ sync `.devin/skills/`
2. ทำ `/update-examples` ถ้ามี public APIs หรือ `examples/`
3. ทำ `/update-test-everything` เพื่อ sync test setup
4. ทำ `/update-todo-md` ถ้ามี `TODO.md`
5. ทำ `/update-references` เพื่อ sync ทุก reference

### 6. Update GitHub Metadata

> Goal: อัปเดต GitHub repo metadata ให้ตรงกับ project ล่าสุด

1. ทำ `/update-github-metadata` เพื่อ sync description, homepage, topics, license
2. ยืนยันว่า metadata ตรงกับ `README.md` และ `package.json`

### 7. Validate And Report

> Goal: ตรวจสอบ root project ให้ผ่านเกณฑ์

1. ทำ `/deep-validate` เพื่อ validate structure, references, docs
2. รัน `git diff --check`
3. รัน checks ตาม project เช่น `bun run scan`, `bun run lint`
4. ทำ `/report-table` สรุป workspace commits, docs/config/rules ที่ sync, project skills, examples, GitHub metadata

### 8. Suggest Next Action

> Goal: แนะนำ action ถัดไป

1. ทำ `/suggest-next-action` เพื่อแนะนำ next action
2. ถ้าพบ gaps สำคัญ → ทำ `/ask-me` เพื่อถาม user

## Rules

### 1. Root Only

- แก้ไขเฉพาะ root docs, config, rules, tooling
- ไม่แก้ไข workspace source code หรือ workspace docs
- ถ้า workspace ต้องแก้ → ใช้ `/ship` ใน workspace นั้น

### 2. Idempotency

- รัน `deep-update-project` ซ้ำได้โดยไม่เกิด side effects
- ไม่ลบหรือ overwrite โดยไม่ dry run
- ข้าม steps ที่ไม่จำเป็น

### 3. Conditionality

- รัน steps ตาม conditions ที่กำหนด
- ตรวจสอบว่าไฟล์มีอยู่จริงก่อนอัปเดต
- ไม่สร้างไฟล์ใหม่ถ้าไม่จำเป็น

### 4. Cross-Workspace Consistency

- ทุก workspace ต้องมี references ที่ถูกต้อง
- shared config ต้อง sync กันทุก workspace
- scripts ใน `package.json` ต้องสอดคล้องกัน

### 5. Validation

- ต้องผ่าน `/deep-validate` ก่อนถือว่าเสร็จ
- รัน `git diff --check`
- ไม่อ้างว่า check ผ่านถ้า command fail

## Expected Outcome

- git log ของทุก workspace ถูกตรวจและบันทึก
- root docs, config, rules, tooling sync กับ workspaces
- project skills และ examples อัปเดต
- GitHub metadata อัปเดต
- root project ผ่าน `/deep-validate`
- รายงานสรุปครบถ้วน
