---
name: follow-tool-moonrepo
description: ใช้ moonrepo จัดการ monorepo build, tasks, และ project boundaries สำหรับหลาย stacks
argument-hint: "[scope]"
related:
  - follow-monorepo
  - follow-tool-mise
  - follow-tool-github-actions
  - use-subagents
  - run-build
  - run-lint
  - run-test
  - run-verify
  - deep-validate
  - run-test-all
  - follow-tool-hk
---

## Goal

ตั้งค่าและใช้งาน moonrepo สำหรับ monorepo ด้วย `.moon/` configuration, task graph, และ project boundaries

## Scope

ใช้สำหรับ project ที่เลือกใช้ moonrepo เป็น monorepo orchestrator แทน turborepo รองรับ Bun, Node, Rust

## Execute

### Subskills

| Topic | Subskill |
|-------|----------|
| Install moon, `moon init`, `.moon/` workspace layout | `subskills/setup-moonrepo/SKILL.md` |
| `tasks`, `deps`, `inputs`/`outputs`, `moon.yml` per project | `subskills/config-pipeline/SKILL.md` |
| Cache tuning, `--affected` targets | `subskills/optimize-cache/SKILL.md` |
| `moon ci` — CI pipeline, `runInCI`, sharding, reports | `subskills/run-ci/SKILL.md` |

### Subagents

- ใช้ `subagents/project-configurator.md` เมื่อต้อง configure/verify `moon.yml` หลาย projects พร้อมกัน — spawn ต่อ `project-path` ผ่าน `/use-subagents` พร้อม `mode` = `configure` หรือ `verify`

### 1. Install moon

> Goal: ติดตั้ง moon CLI บน environment

1. ติดตั้งด้วย package manager ที่เหมาะสม:
   - Bun project: `bun add -D @moonrepo/cli`
   - ถ้า project ไม่ใช้ Bun: ใช้ package manager ของ project (npm, pnpm, yarn)
   - PowerShell: `irm https://moonrepo.dev/install/moon.ps1 | iex`
   - macOS/Linux/WSL: `bash <(curl -fsSL https://moonrepo.dev/install/moon.sh)`
   - proto: `proto install moon`
   - mise: `mise use -g moon` (ถ้ามี `mise` ใน `.tool-versions` หรือ `mise.toml`)
2. ตรวจสอบ version ด้วย `moon --version` (latest `2.5.4`, verified 2026-09-12)
3. ถ้าจะให้ project อื่นใช้ moon ใน repo นี้ → ใช้ package manager ของ workspace (default ใช้ `bun add -D @moonrepo/cli`)
4. ดูรายละเอียดเพิ่มเติมใน [references/moonrepo.md](references/moonrepo.md)

### 2. Identify Workspace

> Goal: ระบุว่า project ใช้ moonrepo

1. ตรวจสอบ `.moon/workspace.yml` หรือ `moon.yml`
2. อ่าน root manifest: `package.json` scripts สำหรับ JS/Bun, `Cargo.toml` workspace สำหรับ Rust
3. ระบุ projects ใน monorepo จาก `.moon/workspace.yml` globs
4. บันทึก project list (package = JS/Bun, crate = Rust)

### 3. Configure Workspace

> Goal: ตั้งค่า moonrepo workspace

1. สร้าง/อัปเดต `.moon/workspace.yml` ด้วย project globs
   - JS/Bun: `packages/*` หรือ `apps/*`
   - Rust: `crates/*`
2. สร้าง/อัปเดต `.moon/toolchains.yml` ตาม stack (Bun, Node, Rust)
3. สร้าง `.moon/tasks/all.yml` สำหรับ shared task config
4. ตรวจสอบ `moon.yml` ในแต่ละ project

### 4. Define Tasks

> Goal: กำหนด tasks ใน moonrepo

1. ใช้ชื่อ task เดียวกันระหว่าง workspaces
2. JS/Bun: ใช้ `package.json` scripts (`build`, `dev`, `test`, `lint`, `typecheck`, `scan`)
3. Rust: ใช้ `cargo build`, `cargo test`, `cargo clippy`
4. กำหนด `deps` (`^build`) ให้ถูกต้อง
5. กำหนด `outputs` สำหรับ build tasks
6. กำหนด `inputs` และ `options` ตามจำเป็น

### 5. Migrate From Turborepo

> Goal: ย้ายจาก turborepo ไป moonrepo

1. ลบ `turbo.json`
2. ลบ `turbo` ออกจาก `package.json` devDependencies
3. แก้ไข scripts ใน `package.json` จาก `turbo run` ไป `moon run`
4. อัปเดต README, AGENTS, docs ให้ระบุ moonrepo
5. อัปเดต `.devin/rules` และ skills ที่อ้างอิงถึง turborepo

### 6. Integrate CI

> Goal: CI pipeline ใช้ `moon ci` อย่างถูกต้อง

1. ใช้ `moon ci` แทน `moon run` บน CI — รันเฉพาะ affected tasks ที่มี `runInCI`
2. ตั้ง `runInCI: false` สำหรับ long-running tasks (`dev`, `start`, `serve` ปิด default)
3. ต้อง full git history — ห้าม shallow clone (ใช้ `filter: 'blob:none'`)
4. ทำตาม `subskills/run-ci/SKILL.md` สำหรับ provider config, sharding และ reports

### 7. Configure VCS Hooks (Optional)

> Goal: git hooks ด้วย built-in `vcs.hooks` — ไม่ต้องใช้ hook manager ภายนอก

1. เพิ่ม `vcs.hooks` ใน `.moon/workspace.yml` (ต้อง moon v1.9+):
   ```yaml
   vcs:
     hooks:
       pre-commit:
         - 'moon run :lint :format --affected --status=staged'
       pre-push:
         - 'moon run :typecheck :test --affected'
     sync: true
   ```
2. `sync: true` = auto-generate + link hooks ทุกครั้งที่ task รัน; ถ้าไม่ใช้ → contributor opt-in ด้วย `moon sync hooks` เอง
3. Generated scripts อยู่ที่ `.moon/hooks` (หรือ `.config/moon/hooks`) — commit หรือ ignore ก็ได้, audit/test ง่าย เพราะ moon ตั้ง `core.hooksPath` ชี้ไปที่นั่น
4. ใช้ `--affected` + `--status=staged` ให้ hook เร็ว — moon รู้ task graph + cache อยู่แล้ว
5. ไม่จำเป็นต้องใช้ `/follow-tool-hk` — hk เพิ่มมูลค่าเฉพาะเมื่อต้องการ parallel staged-file linting, hook steps ที่ไม่ใช่ moon tasks, หรือ hook config เดียวกันข้าม repos ที่ไม่ใช้ moon

### 8. Verify

> Goal: ตรวจสอบว่า moonrepo ทำงานได้

1. รัน `moon check` หรือ `moon run :check`
2. รัน `moon run :build` เพื่อตรวจ project graph
3. รัน `moon ci` บน test branch เพื่อยืนยัน affected detection
4. ตรวจสอบว่าไม่มี `turbo.json` หรือ `turbo` dependencies
5. ทำ `/deep-validate` เพื่อ verify setup

## Rules

### 1. Prefer moonrepo For This Codebase

- ใช้ `moon` สำหรับ task orchestration
- ไม่เพิ่ม `turbo` dependencies กลับเข้ามา
- ใช้ `moon run :<task>` ใน root scripts

### 2. Task Naming

- ใช้ชื่อ task เดียวกันระหว่าง workspaces
- ใช้ kebab-case สำหรับ task labels
- หลีกเลี่ยง task ทีไม่มี `deps` ทีชัดเจน

### 3. Project Boundaries

- กำหนด project globs ใน `.moon/workspace.yml`
- ใช้ moonrepo implicit project detection
- ไม่ซ้อน project boundaries ซ้ำซ้อน
- JS/Bun project = package, Rust project = crate (Cargo package)

- ใช้ /follow-monorepo ถ้าจำเป็น
- ใช้ /follow-tool-mise ถ้าจำเป็น
- ใช้ /follow-tool-github-actions ถ้าจำเป็น
- ใช้ /use-subagents ถ้าจำเป็น
- ใช้ /run-build ถ้าจำเป็น
- ใช้ /run-lint ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น
- ใช้ /run-verify ถ้าจำเป็น

## References

- [CLI reference](references/cli.md)
- [moon ci — CI guide, providers, sharding](references/ci.md)

- ใช้ /run-test-all ถ้าจำเป็น

## Expected Outcome

- `.moon/` config ถูกต้องและสมบูรณ์
- ไม่มี `turbo.json` หรือ `turbo` dependency
- root scripts ใช้ `moon run`
- project graph สามารถ build ได้
- `moon ci` พร้อมบน CI provider — affected detection + `runInCI` ถูกต้อง
- รองรับ JS/Bun packages และ Rust crates

