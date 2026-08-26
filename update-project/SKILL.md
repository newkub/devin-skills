---
name: update-project
description: อัปเดต root project โดยเช็ค git log และ sync project docs/config/rules/tooling
related:
  - update-dot-devin
  - update-readme-md
  - update-agents-md
  - update-usage-md
  - update-project-rules
  - update-examples
  - update-project-skills
  - update-github-metadata
---

## Goal

อัปเดต root project โดยเช็ค git log ล่าสุดของทุก workspace และ sync ทุก project docs, config, rules และ tooling

## Scope

ใช้หลัง ship ทุก workspace — เช็ค git log ล่าสุดของแต่ละ workspace, restore ข้อมูลมาอัปเดต root `AGENTS.md`, `README.md`, sync project files, อัปเดต project skills, GitHub metadata ไม่แก้ไข workspace code

## Execute

### 1. Check Latest Git Log

> Goal: เช็ค git log ล่าสุดของทุก workspace

1. ทำ `/check-monorepo` เพื่อยืนยัน monorepo status
2. ทำ `/all-workspace` เพื่อระบุทุก workspace
3. สำหรับแต่ละ workspace:
   - รัน `git log --oneline -5` เพื่อดู commit ล่าสุด
   - รัน `git diff HEAD~1 --stat` เพื่อดูไฟล์ที่เปลี่ยน
   - บันทึก commit hash, message และ changed files
4. รวมข้อมูลจากทุก workspace เป็น summary

### 2. Restore Changed Info

> Goal: restore ข้อมูลที่เปลี่ยนแปลงมาอัปเดต root

1. วิเคราะห์ changed files จาก git log ของทุก workspace
2. ระบุข้อมูลที่ต้อง restore มาที่ root:
   - Architecture changes → อัปเดต `### Architecture` ใน `AGENTS.md`
   - Skills changes → อัปเดต `### Skills` ใน `AGENTS.md`
   - Workspaces changes → อัปเดต `### Workspaces` ใน `AGENTS.md`
   - Features changes → อัปเดต `README.md` features table
3. ถ้า workspace เพิ่ม/ลบ dependency → อัปเดต root mapping

### 3. Update Project Files

> Goal: อัปเดต project docs, config, rules และ tooling ให้สอดคล้องกัน

1. อ่าน root `package.json`
2. อ่าน `AGENTS.md` ถ้ามี
3. ตรวจสอบ `docs/`, `rules/`, `.devin/`, `.vscode/`
4. ระบุ orchestration tools (moon, turbo)
5. รัน updates ตามลำดับ:
   - `/review-delivery` (ถ้ามี CI/CD ต้องตรวจ/ตั้งค่า)
   - `/update-dot-devin`
   - `/cleanup-files-in-project` (ถ้าจำเป็น)
   - `/update-readme-md`
   - `/update-agents-md`
   - `/update-usage` เพื่ออัปเดต `usage.kdl` CLI spec ถ้ามี
   - `/update-usage-md` (ถ้ามี `USAGE.md` แบบ manual)
   - `/update-features` เพื่อสร้าง/อัปเดต `FEATURES.md` ที่ root ของทุก workspace
   - `/update-docs` (ถ้ามี `docs/`)
   - `/update-project-rules` (ถ้ามี `sgconfig.yml` และ `rules/`)
   - `/update-examples` (ถ้ามี `examples/` หรือ public APIs เปลี่ยน)
   - `/update-test` เพื่ออัปเดต test setup
   - `/update-todo-md` (ถ้ามี `TODO.md`)
   - `/update-references` เพื่อ sync references
   - `/update-gitignore` เพื่อ sync `.gitignore`
   - `/update-review-codebase-cli-and-run` (ถ้ามี `tools/review-codebase/`)
   - `/update-dot-vscode`
   - `/update-contributing-md`
6. ทำ `/review-delivery` เพื่อ sync config ทั้งหมด
7. ทำ `/follow-gitignore` เพื่อ sync `.gitignore`
8. ตรวจสอบว่า scripts ใน `package.json` สอดคล้องกัน

### 4. Update Project Skills

> Goal: project skills ใน `.devin/skills/` เป็นปัจจุบัน

1. ทำ `/update-project-skills` เพื่อสร้างหรืออัปเดต skills ใน `.devin/skills/`
2. ตรวจว่า skills ที่สร้างผ่าน `/validate`
3. ยืนยันว่า project `AGENTS.md` อ้างถึง skills ใหม่ครบถ้วน

### 5. Update GitHub Metadata

> Goal: GitHub repo metadata สะท้อน project จริง

1. ทำ `/update-github-metadata` เพื่อ sync description, homepage, topics กับ `README.md` และ `package.json`
2. ยืนยันว่า metadata ตรงกับเนื้อหาล่าสุด

### 6. Validate And Report

> Goal: root project ผ่าน validation

1. ทำ `/validate` เพื่อตรวจ root structure และ references
2. รัน `git diff --check`
3. รัน checks ตาม project เช่น `bun run scan`, `bun run lint`
4. ทำ `/report` สรุป:
   - workspace commits ที่ตรวจพบ
   - ข้อมูลที่ restore มา
   - project files ที่อัปเดต
   - project skills ที่สร้างหรืออัปเดต
   - GitHub metadata ที่อัปเดต

## Rules

### 1. Git Log First

- ตรวจ `git log` ของทุก workspace ก่อนเสมอ
- ใช้ `git log --oneline -5` และ `git diff HEAD~1 --stat` เป็นหลัก
- บันทึก commit hash และ changed files ก่อนอัปเดต

### 2. Root Only

- แก้ไขเฉพาะ root docs (`AGENTS.md`, `README.md`) และ project config
- ไม่แก้ไข workspace code หรือ workspace docs
- ถ้า workspace docs ต้องแก้ → ใช้ `/ship` ใน workspace นั้น

### 3. No Commit

- `update-project` ไม่ commit การเปลี่ยนแปลง
- ถ้าใช้ standalone → ทำ `/git-commit` หลัง `/update-project`
- ถ้าใช้ใน monorepo → เรียก `/ship` แต่ละ workspace แล้วทำ `/git-commit` ที่ root หลัง `/update-project`

### 4. Idempotency

- รัน `update-project` ซ้ำได้โดยไม่เกิด side effects
- ไม่ลบหรือ overwrite โดยไม่ dry run

### 5. Conditionality

- รัน steps ที่มี conditions ตามที่กำหนด
- ข้าม steps ที่ไม่จำเป็น

### 6. Validation

- รัน validation หลัง update
- ไม่อ้างว่า check ผ่าน ถ้า command fail

## Expected Outcome

- git log ของทุก workspace ถูกตรวจและบันทึก
- ข้อมูลที่เปลี่ยนแปลงถูก restore มาอัปเดต root docs
- root `AGENTS.md` และ `README.md` อัปเดต
- project docs, config, rules, และ tooling sync กัน
- project skills ใน `.devin/skills/` อัปเดตผ่าน `/update-project-skills`
- GitHub repo metadata อัปเดตผ่าน `/update-github-metadata`
- root project ผ่าน `/validate`
- รายงานสรุป workspace commits, project files, project skills และ GitHub metadata ครบถ้วน
