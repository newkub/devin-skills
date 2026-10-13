---
name: update-project
description: อัปเดต root project โดยเช็ค git log และ sync project docs/config/rules/tooling
argument-hint: "[scope]"
related:
  - follow-tasks
  - follow-monorepo
  - update-config
  - update-dot-devin
  - update-docs
  - update-astgrep-rules
  - update-gitignore
  - update-readme-md
  - update-agents-md
  - update-tests
  - update-specs
  - update-examples
  - update-project-skills
  - update-github-metadata
  - update-version-to-latest
  - keepup-source-code
  - use-subagents
  - deep-review

---

## Goal

อัปเดต root project โดยเช็ค git log ล่าสุดของทุก workspace และ sync ทุก project docs, config, rules และ tooling

## Scope

ใช้หลัง ship ทุก workspace — เช็ค git log ล่าสุดของแต่ละ workspace, restore ข้อมูลมาอัปเดต root `AGENTS.md`, `README.md`, sync project files, อัปเดต project skills, GitHub metadata ไม่แก้ไข workspace code ถ้าต้อง update dependencies, runtime, tools หรือ versioned config ใดๆ → ใช้ `/update-version-to-latest` ก่อน update config อื่น

Boundary: quick root sync — ถ้าต้อง comprehensive update ก่อน release พร้อม deep analysis baseline → front-load `/deep-analyze` + `/deep-review` ก่อน Step 1

## Execute

### 1. Check Latest Git Log

> Goal: เช็ค git log ล่าสุดของทุก workspace

1. ทำ `/check-monorepo` เพื่อยืนยัน monorepo status และ `/follow-monorepo` เพื่อ sync conventions
2. ทำ `/follow-tasks` เพื่อติดตาม update checklist
3. ทำ `/all-workspace` เพื่อระบุทุก workspace
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
   - `/deep-review` (ถ้ามี CI/CD ต้องตรวจ)
   - `/setup-cicd` (ถ้า CI/CD config drift หรือยังไม่พร้อม)
   - `/update-version-to-latest` (ถ้าต้องการอัปเดต dependencies ทุก workspace เป็น latest)
   - `/update-version-to-latest` (ถ้าต้องการอัปเดต runtime, deps, tools, และ versioned config ทั้งหมดเป็น latest)
   - `/follow-config` เพื่อ validate และ sync config files ตาม conventions
   - `/update-config` เพื่อ sync project config, shared config, และ dependencies catalog
   - `/update-dot-devin`
   - `/cleanup-files-in-project` (ถ้าจำเป็น)
   - package manifest setup (merged `/setup-package`) — ตรวจ required fields + scripts ตาม `### setup-package` ใน `## Merged Details`
   - `/update-readme-md`
   - `/update-agents-md`
   - `/update-usage-md` เพื่อสร้าง/อัปเดต `USAGE.md` ที่ root ของแต่ละ workspace
   - `/update-features-md` เพื่อสร้าง/อัปเดต `FEATURES.md` ที่ root ของทุก workspace
   - `/update-docs` (ถ้ามี `docs/`)
   - `/update-astgrep-rules` (ถ้ามี `sgconfig.yml` และ `rules/`)
   - `/update-examples` (ถ้ามี `examples/` หรือ public APIs เปลี่ยน)
   - `/update-specs` เพื่อสร้าง/อัปเดต `<workspace>/specs/` สำหรับ test specs
   - `/update-tests` เพื่ออัปเดต test setup
   - `/update-todo-md` (ถ้ามี `TODO.md`)
   - `/update-references` เพื่อ sync references
   - `/update-gitignore` เพื่อ sync `.gitignore`
   - `/deep-review` (ถ้ามี `tools/review-codebase/`)
   - `/update-dot-vscode`
   - `/update-contributing`
6. ทำ `/deep-review` เพื่อ sync config ทั้งหมด
7. ทำ `/follow-gitignore` เพื่อ sync `.gitignore`
8. ตรวจสอบว่า scripts ใน `package.json` สอดคล้องกัน

### 4. Update Project Skills

> Goal: project skills ใน `.devin/skills/` เป็นปัจจุบัน

1. ทำ `/update-project-skills` เพื่อสร้างหรืออัปเดต skills ใน `.devin/skills/`
2. ตรวจว่า skills ที่สร้างผ่าน `/deep-validate`
3. ยืนยันว่า project `AGENTS.md` อ้างถึง skills ใหม่ครบถ้วน

### 5. Update GitHub Metadata And Settings

> Goal: GitHub repo metadata และ branch protection สะท้อน project จริง

1. ทำ `/update-github-metadata` เพื่อ sync description, homepage, topics กับ `README.md` และ `package.json`
2. ทำ `/follow-github` เพื่อตั้ง branch protection บน `main` และ integration branch ตาม project conventions และ `.github` templates (optional)
3. ยืนยันว่า metadata และ branch protection ตรงกับ project conventions

### 6. Validate And Report

> Goal: root project ผ่าน validation

1. ทำ `/deep-validate` เพื่อตรวจ root structure และ references
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
- ถ้า workspace docs ต้องแก้ → ใช้ `/ship-to-dev-branch` ใน workspace นั้น

### 3. No Commit

- `update-project` ไม่ commit การเปลี่ยนแปลง
- ถ้าใช้ standalone → ทำ `/git-commit` หลัง `/update-project`
- ถ้าใช้ใน monorepo → เรียก `/ship-to-dev-branch` แต่ละ workspace แล้วทำ `/git-commit` ที่ root หลัง `/update-project`

### 4. Idempotency

- รัน `update-project` ซ้ำได้โดยไม่เกิด side effects
- ไม่ลบหรือ overwrite โดยไม่ dry run

### 5. Conditionality

- รัน steps ที่มี conditions ตามที่กำหนด
- ข้าม steps ที่ไม่จำเป็น

### 6. Validation

- รัน validation หลัง update
- ไม่อ้างว่า check ผ่าน ถ้า command fail

- ใช้ /update-project ถ้าจำเป็น

## Merged Details

### setup-package

Package manifest setup (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`) — ใช้ครั้งเดียวตอนเริ่ม project หรือเมื่อ manifest ไม่พร้อม publish — merged จาก `/setup-package`

1. Detect ecosystem จาก manifest file — หลาย ecosystems → ทำทีละตัว; ไม่มีเลย → ข้าม
2. Required fields ตาม ecosystem:
   - Node/Bun `package.json`: `name`, `version`, `description`, `license`, `repository`, `homepage`, `files` (ระบุสิ่งที่ publish เช่น `dist`, `README.md`, `LICENSE`), `exports`/`main` ชี้ build output; ถ้า `private: true` → ถาม user ว่าจะ release public ไหม
   - Rust `Cargo.toml`: `package.name`, `version`, `description`, `license`, `repository`, `categories`, `keywords`, `edition`, `rust-version`; `[[bin]]`/`[lib]` ตาม project type; monorepo → `workspace` + `/follow-monorepo`
   - Python `pyproject.toml`: `project.name`, `version`, `description`, `license`, `readme`, `requires-python`, `classifiers`, `build-system` (setuptools/hatchling/flit), `project.scripts` ถ้ามี CLI
   - Go `go.mod`: `module` path, `go` version; ไม่มี `LICENSE`/`README.md` → แนะนำเพิ่ม
3. Scripts: ต้องมี `build`, `test:all`, `verify` (`verify` = `check && test` หรือ `lint && typecheck && test`) — ห้ามใส่ `release` script (release ผ่าน `/setup-cicd` workflow หรือ `/follow-tool-*`)
4. ขาด field → ให้ user กรอก หรือใช้ค่า default จาก project; ทำ `/follow-tasks` ปรับ scripts ให้สมบูรณ์
5. Validate: `/deep-review` manifest + `/run-verify` — fail → แก้และ retry ≤3
6. Monorepo: `/follow-monorepo` ก่อน; workspace packages ไม่ต้อง `private: false` ถ้า publish ที่ root
7. ไม่ publish เอง — publish ผ่าน `/publish-package-to-registry` หรือ `/run-release`

## Subagents

> Goal: งานอิสระที่ spawn ทำขนานได้ — profile สั้นอยู่ใน section นี้ รายละเอียดเต็มอยู่ใน links
> Delegate ผ่าน `/use-subagents` — parent เก็บ Step 2 (restore changed info ต้องเห็น context รวม) และ Step 6 (validate/report) ไว้เอง; รอ structured reports ครบทุกตัวก่อนเข้า Step 6; subagents ห้าม commit — parent เป็นเจ้าของ Working rules และ final report; report `skipped`/`no-changes`/`blocked` → แสดงใน report แทนที่จะ retry; workspaces/domains แชร์ config/deps → ทำ sequential และส่ง `shared-rules` ให้ทุก `project-updater`

### git-log-collector — เก็บ git log และ diff stat ของ workspace เดียว (Step 1; 1 agent ต่อ workspace)

- **Inputs**: `project-path`, `log-count` (optional, default 5)
- **Tools**: `read`, `exec` (`git log`, `git diff`, `git status`)
- **Execute**: รัน `git log --oneline -<log-count>` บันทึก hash+message ทุก commit → รัน `git diff HEAD~1 --stat` บันทึก changed files → ไม่มี commits ใหม่หรือไม่ใช่ git repo → report `no-changes`
- **Output**: structured summary — `project-path`, commits ล่าสุด (hash+message), changed files list พร้อมสถิติ, `no-changes` flag
- **Constraints**: read-only ห้ามแก้ไข/สร้างไฟล์; ทำงานเฉพาะใน `project-path`; deterministic (input เดิมได้ report เดิม)
- **Full detail**: `references/subagent-git-log-collector.md`

### project-files-updater — อัปเดต project files ตาม domain (Step 3; 1 agent ต่อ `domain`)

- **Inputs**: `domain` (`config`|`docs`|`rules`|`specs`|`examples`|`gitignore`|`vscode`|`todo`|`contributing`), `changed-info` (optional — summary จาก Step 1-2 เพื่อ prioritize), `root-path` (optional, default cwd)
- **Tools**: `read`, `grep`, `find_file_by_name`, `exec`, `edit`
- **Execute**: ระบุ files ใน `domain` (`config`→`package.json`/`tsconfig.json`/`biome.jsonc`/`mise.toml`/`.moon/`; `docs`→`docs/`/`README.md`/`USAGE.md`/`FEATURES.md`/`CHANGELOG.md`; `rules`→`rules/`/`sgconfig.yml`; `specs`→`<workspace>/specs/`; `examples`→`examples/`; `gitignore`→`.gitignore`; `vscode`→`.vscode/`; `todo`→`TODO.md`; `contributing`→`CONTRIBUTING.md`) → รัน `/update-config`/`/update-docs`/`/update-astgrep-rules`/`/update-specs`/`/update-examples`/`/update-gitignore`/`/update-dot-vscode`/`/update-todo-md`/`/update-contributing` → ใช้ `changed-info` ข้ามไฟล์ที่ไม่ drift ไม่เขียนใหม่ถ้าไม่เปลี่ยน
- **Output**: structured summary — `domain` ที่ทำ, files ที่อัปเดต (path+เหตุผล), skills ที่เรียกใช้และผลลัพธ์, blockers/cross-domain conflicts
- **Constraints**: ทำงานเฉพาะใน `domain` ห้ามแตะ domain อื่น; ไม่ commit; deterministic; ไม่มีไฟล์/ไม่จำเป็น → report `skipped`
- **Full detail**: `references/subagent-project-files-updater.md`

### project-updater — อัปเดต sub-project/workspace เดียว (Step 3 per-workspace; 1 agent ต่อ `project-path`)

- **Inputs**: `project-path`, `update-scope` (optional เช่น `deps`/`config`/`docs`), `shared-rules` (optional — reference files จาก root ที่ต้อง sync)
- **Tools**: `read`, `grep`, `find_file_by_name`, `exec`, `edit`
- **Execute**: รัน `git log --oneline -5` + `git diff HEAD~1 --stat` ใน `project-path` → sync config drift เทียบ `shared-rules`/root conventions (tsconfig, lint, format, gitignore) → อัปเดต docs เฉพาะที่ drift → แชร์ config/deps กับ sub-project อื่น → report warning ไม่แก้เอง
- **Output**: structured summary — `project-path`, commits ล่าสุด (hash+message), config/docs ที่เปลี่ยน (file list+เหตุผล), blockers/shared-dependency warnings
- **Constraints**: ทำงานเฉพาะใน `project-path` ห้ามแก้ root หรือ sub-project อื่น; ไม่ commit; deterministic; workspaces แชร์ config/deps → sequential + ส่ง `shared-rules`
- **Full detail**: `references/subagent-project-updater.md`

### project-skills-updater — อัปเดต project skills ใน .devin/skills/ (Step 4; ขนานกับ Step 3 domains)

- **Inputs**: `project-path`, `changed-info` (optional — ระบุ skills ที่ต้อง sync)
- **Tools**: `read`, `grep`, `find_file_by_name`, `exec`, `edit`
- **Execute**: ทำ `/update-project-skills` สร้าง/อัปเดต skills ตาม codebase → ใช้ `changed-info` map features/flows ที่เปลี่ยน → skill ที่ต้อง sync → ตรวจผ่าน `/deep-validate` (frontmatter, references, no broken links) → ยืนยัน root `AGENTS.md` อ้างถึง skills ใหม่ครบ → report gap ถ้าขาด
- **Output**: structured summary — skills ที่สร้าง/อัปเดต/ลบ (path+เหตุผล), validation results, AGENTS.md gaps ที่ให้ parent แก้
- **Constraints**: แก้เฉพาะ `.devin/skills/` ห้ามแตะ root docs/code (ห้ามแก้ `AGENTS.md` เอง — parent จัดการ); ไม่ commit; `.devin/skills/` ไม่มี/ไม่จำเป็น → report `skipped`
- **Full detail**: `references/subagent-project-skills-updater.md`

### github-metadata-updater — sync GitHub repo metadata และ branch protection (Step 5; remote-only ไม่ชน local files)

- **Inputs**: `repo` (optional — owner/repo, default detect จาก git remote), `check-protection` (optional, default true)
- **Tools**: `exec` (`gh repo view`, `gh api`, `gh repo edit`, `git remote -v`), `read`
- **Execute**: ทำ `/update-github-metadata` sync description/homepage/topics กับ `README.md` + `package.json` → ถ้า `check-protection` → ทำ `/follow-github` ตรวจ branch protection บน `main`/integration branch → ยืนยัน metadata ตรงกับ project conventions
- **Output**: structured summary — metadata fields ที่เปลี่ยน (before → after), branch protection status, permissions errors หรือ blockers (gh auth, repo not found)
- **Constraints**: remote mutations เท่านั้น (`gh api`/`gh repo edit`) ห้ามแก้ local files; ไม่ push ไม่ commit (parent จัดการ); ไม่มี remote หรือ gh auth ไม่ผ่าน → report `blocked` ไม่ fail
- **Full detail**: `references/subagent-github-metadata-updater.md`

## Expected Outcome

- git log ของทุก workspace ถูกตรวจและบันทึก
- ข้อมูลที่เปลี่ยนแปลงถูก restore มาอัปเดต root docs
- root `AGENTS.md` และ `README.md` อัปเดต
- project docs, config, rules, และ tooling sync กัน
- project skills ใน `.devin/skills/` อัปเดตผ่าน `/update-project-skills`
- GitHub repo metadata อัปเดตผ่าน `/update-github-metadata`
- root project ผ่าน `/deep-validate`
- dependencies และ versioned items อัปเดตถ้าเลือกใช้ `/update-version-to-latest`
- รายงานสรุป workspace commits, project files, project skills และ GitHub metadata ครบถ้วน

