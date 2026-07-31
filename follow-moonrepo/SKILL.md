---
name: follow-moonrepo
description: แนวทางการพัฒนา monorepo ด้วย Moonrepo v2.x
triggers:
  - user
  - model
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
related:
  - follow-monorepo
  - follow-tasks
  - follow-package-manifest
---

## Goal

กำหนดแนวทางการพัฒนา monorepo ด้วย Moonrepo v2.x ให้มีประสิทธิภาพสูงสุด

## Scope

ใช้สำหรับ monorepo ที่ใช้ Moonrepo สำหรับ task orchestration และ build orchestration

## Execute

### 1. Setup

1. ติดตั้ง Moonrepo ด้วย `bun add -d @moonrepo/cli`
2. Initialize monorepo ด้วย `moon init -y`
3. สร้าง `.moon/` directory สำหรับ configuration
4. สร้าง `workspace.yml` สำหรับ workspace configuration
5. สร้าง `.moon/tasks/` directory สำหรับ task definitions
6. สร้าง `toolchains.yml` สำหรับ language versions

### 2. Workspace Configuration

1. กำหนด `projects` ใน `.moon/workspace.yml` ด้วย glob list หรือ sources map
2. ตั้งค่า `defaultProject` สำหรับ default scope
3. ตั้งค่า `pipeline` สำหรับ task execution behavior:
   - `syncWorkspace`, `syncProjects`, `installDependencies`
   - `autoCleanCache`, `cacheLifetime`
4. ตั้งค่า `vcs` สำหรับ version control integration
5. ตั้งค่า `hasher` สำหรับ file hashing configuration
6. ตั้งค่า `remote` สำหรับ remote caching (Bazel RE API)
7. ตั้งค่า `constraints` สำหรับ dependency rules
8. ตั้งค่า `codeowners` สำหรับ code ownership rules
9. ใช้ `experiments` สำหรับ experimental features
10. ใช้ schema จาก local cache ใน configuration files

### 3. Project Configuration

1. ใช้ `moon.yml` สำหรับ project metadata
2. กำหนด `layer` สำหรับ project type (`application`, `library`, `tool`, `automation`, `configuration`, `scaffolding`)
3. กำหนด `stack` สำหรับ technology stack (`backend`, `frontend`, `data`, `infrastructure`, `systems`)
4. ตั้งค่า `project` metadata: `title`, `description`, `channel`, `owner`, `maintainers`
5. กำหนด `tags` สำหรับ categorization และ grouping
6. ตั้งค่า `env` สำหรับ environment variables ของ tasks
7. กำหนด `fileGroups` สำหรับ grouping files ที่ใช้ใน tasks
8. ตั้งค่า project dependencies ใน `dependsOn`
9. ใช้ task inheritance จาก `.moon/tasks/all.yml`

### 4. Tasks

1. กำหนด tasks ใน `.moon/tasks/all.yml` สำหรับ reusability
2. ใช้ `command` สำหรับ simple commands (single binary + args)
3. ใช้ `script` สำหรับ complex commands (pipes, redirects, chaining)
4. ตั้งค่า task dependencies ด้วย `deps` และ `cacheStrategy`:
   - `hash` - ใช้ dependency hash (default)
   - `outputs` - ใช้ dependency outputs เท่านั้น
   - `ignored` - ไม่ใช้ hash (purely sequencing)
5. ใช้ `implicitDeps` และ `implicitInputs` สำหรับ global task dependencies
6. ใช้ `fileGroups` สำหรับ reusable file patterns
7. ใช้ `@group(name)` token สำหรับ reference file groups
8. กำหนด `tags` สำหรับ tasks (v2.3) เพื่อ filtering และ grouping
9. ใช้ `moon run <project>:<task>` สำหรับ execution
10. ใช้ `--affected` flag สำหรับ affected projects
11. กำหนด cache ให้เหมาะสมสำหรับแต่ละ task type

### 5. Task Tags (v2.3)

1. ใช้ `tags` ใน task definition สำหรับ labeling tasks
2. ใช้ `:#tag` syntax ใน targets:
   - `:#tag` - ทุก tasks ที่มี tag
   - `^:#tag` - tasks ใน upstream projects
   - `project:#tag` - tasks ใน project เฉพาะ
   - `#tag1:#tag2` - tasks ที่มี tag2 ใน projects ที่มี tag1
3. ใช้ `options.mergeTags` สำหรับควบคุม tag merging ระหว่าง inheritance
4. ใช้ `taskTag` field ใน MQL สำหรับ querying tasks by tags
5. ใช้ `--tags` filter สำหรับ `moon query tasks`

### 6. Caching

1. ใช้ smart hashing สำหรับ deterministic builds
2. ตั้งค่า remote caching ด้วย Bazel RE API หรือ moonrepo.dev
3. ใช้ `experiments.casOutputsCache: true` (v2.3) สำหรับ local CAS cache
4. ใช้ `experiments.nativeFileHashing: true` (v2.3) สำหรับ native file hashing (10-50% faster)
5. ตั้งค่า `cacheLifetime` สำหรับ cache staleness (เช่น `1 day`, `3 hr`, `1m`)
6. ใช้ `pipeline.autoCleanCache: true` สำหรับ auto-clean stale cache
7. ตรวจสอบ cache hit/miss ด้วย `moon run <task> --dry-run`

### 7. Toolchain

1. ตั้งค่า Node.js version ใน `.moon/toolchains.yml`
2. ตั้งค่า Bun version สำหรับ runtime
3. กำหนด Rust version สำหรับ polyglot projects
4. ใช้ `proto` สำหรับ multi-language version management
5. ใช้ `MOON_<TOOLCHAIN>_VERSION` env vars สำหรับ CI/CD
6. ตรวจสอบ toolchain versions ด้วย `moon check`

### 8. Constraints And Dependencies

1. ใช้ `constraints.enforceLayerRelationships` สำหรับ layer-based rules
2. ใช้ `constraints.tagRelationships` สำหรับ tag-based dependency rules
3. กำหนด allowed/denied dependencies ระหว่าง layers และ tags
4. ตรวจสอบ constraints ด้วย `moon check`

### 9. VCS Hooks

1. ตั้งค่า `vcs.hooks` ใน `.moon/workspace.yml`
2. ใช้ `vcs.sync: true` สำหรับ automatic hook generation
3. ตั้งค่า `vcs.hookFormat` เป็น `native` หรือ `bash`
4. ใช้เฉพาะ hooks ที่จำเป็น:
   - `pre-commit` - lint, format (use `--affected --status=staged`)
   - `pre-push` - typecheck, test (use `--affected`)

### 10. CI And Integrations

ตั้งค่า CI pipeline และ integrations สำหรับ Moonrepo

1. สร้าง `.github/workflows/ci.yml` สำหรับ CI/CD pipeline
2. ใช้ `moon ci` สำหรับ CI validation
3. ใช้ `moonrepo/run-report-action@v1` สำหรับ reporting
4. ใช้ `MOON_<TOOLCHAIN>_VERSION` env vars สำหรับ matrix strategy
5. ใช้ Moon MCP server สำหรับ AI integration
6. ใช้ `get_templates` และ `get_template` สำหรับ template discovery (v2.3)
7. ใช้ `get_projects` และ `get_tasks` สำหรับ workspace inspection
8. ตั้งค่า MCP ใน `.mcp.json` ของ project

## Rules

### 1. Configuration Files

- ต้องมี `.moon/` directory ที่ root ของ monorepo
- ทุก projects ต้องมี `moon.yml` สำหรับ metadata
- สร้าง `.moon/tasks/all.yml` สำหรับ reusable tasks
- สร้าง `workspace.yml` สำหรับ global settings
- สร้าง `toolchains.yml` สำหรับ language versions
- ทำ `/follow-monorepo` สำหรับ directory structure

### 2. Task Synchronization

- กำหนด tasks ใน `.moon/tasks/all.yml` สำหรับ reusability
- ใช้ task inheritance ในแต่ละ project
- ให้ tasks ตรงกับ scripts ตาม `/follow-package-manifest`
- ใช้ `moon run <project>:<task>` สำหรับ task execution
- ใช้ `command` สำหรับ simple commands, `script` สำหรับ complex commands
- ใช้ `cacheStrategy: outputs` สำหรับ build dependencies (v2.3)

### 3. Caching

- ใช้ `experiments.nativeFileHashing: true` สำหรับ performance (v2.3)
- ใช้ `experiments.casOutputsCache: true` สำหรับ local CAS (v2.3)
- ตั้งค่า `cacheLifetime` สำหรับ cache staleness
- ใช้ `pipeline.autoCleanCache: true` สำหรับ auto-clean
- ตั้งค่า remote caching ด้วย Bazel RE API

### 4. VCS Hooks

- `pre-commit` - lint, format (use `--affected --status=staged`)
- `pre-push` - typecheck, test (use `--affected`)
- ใช้ `vcs.sync: true` สำหรับ automatic hook generation

### 5. Installation

- ใช้ `bun add -d @moonrepo/cli` สำหรับ installation
- Initialize ด้วย `moon init`
- ตรวจสอบ configuration ด้วย `moon check`

## Expected Outcome

- Moonrepo v2.x configuration ที่สมบูรณ์
- Task orchestration ที่ automatic และ efficient
- Caching ที่ทำงานได้อย่างมีประสิทธิภาพด้วย CAS และ native hashing
- Toolchain consistency ทั่วทั้ง team
- Build times ที่ลดลงอย่างมีนัยสำคัญ
- Polyglot support สำหรับ multi-language projects
- Automatic task execution บน affected code only
- AI integration ผ่าน MCP server
