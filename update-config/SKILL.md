---
name: update-config
description: อัปเดต project config ให้ครบถ้วน สอดคล้อง ลด duplication โดยใช้ shared config/dependencies catalog
argument-hint: "[path]"
related:
  - deep-review
  - report-config-files
  - follow-devin-global-skills
  - follow-tool-mise
  - follow-tool-moonrepo
  - update-project
  - update-dot-devin
  - refactor-to-packages-shared
  - update-gitignore
  - research-setup-integrations
  - deep-validate
  - follow-default-config
  - report-idea-cleanup-files-in-computer

---

## Goal

อัปเดต project configuration ให้ครบถ้วน สอดคล้องกัน ลด duplication และใช้ shared config / dependencies catalog เมื่อเป็นไปได้

## Scope

- ใช้กับ root project หรือ workspace ใดๆ
- ครอบคลุม package manifest, tool configs, monorepo setup, CI/CD, editor, env, git
- เรียก `/deep-review` ก่อนเพื่อดู findings
- ถ้า monorepo → ใช้ `/follow-tool-moonrepo`

## Execute

### 1. Review Current Config

> Goal: รู้สภาพ config ปัจจุบัน

1. ทำ `/deep-review` เพื่อดู findings
2. บันทึก priority list จาก severity
3. ระบุ config ที่ต้องสร้าง ลบ หรือ refactor
4. ถ้า project ยังไม่มี `rules/` + `sgconfig.yml` หรือ `AGENTS.md` → ทำ `/update-astgrep-rules` และ `/update-agents-md`

### 2. Plan Shared Config Strategy

> Goal: เลือกวิธีรวม config

1. ถ้า monorepo ใช้ moonrepo:
   - ทำ `/follow-tool-moonrepo` เพื่อตรวจ `.moon/workspace.yml`, `.moon/toolchains.yml`, `.moon/tasks/*.yml`
   - สร้าง/อัปเดต `tsconfig.base.json` หรือ `tsconfig.options.json` แล้วให้แต่ละ workspace `extends` มัน
   - ใช้ `.moon/tasks/*.yml` สำหรับ shared tasks (build, lint, test, typecheck, scan)
   - ใช้ `moon.yml` ในแต่ละ project อ้างอิง tasks หลัก
2. ถ้า monorepo ใช้ pnpm workspace:
   - ตรวจ `pnpm-workspace.yaml` ว่ามี `catalogs:` หรือไม่
   - ย้าย shared dependencies ไป `pnpm-workspace.yaml` catalogs หรือ `catalog:` field
   - ใช้ `package.json` แบบ `catalog:` แทน version numbers
   - สร้าง root `tsconfig.base.json` ให้ทุก package `extends`
   - สร้าง root `eslint.config.js` (flat config — `.eslintrc` ถูก remove ใน ESLint 10) และ `prettier.config.js`
3. ถ้า monorepo ใช้ bun workspace:
   - ตรวจ `bun-workspace.toml` หรือ `package.json` `workspaces`
   - ใช้ `bun.catalogs` (ถ้ามี) หรือ root `package.json` `overrides`
   - สร้าง `bunfig.toml` สำหรับ shared install config
   - สร้าง `tsconfig.base.json` ให้ workspaces `extends`
4. ถ้า single project:
   - ตรวจว่า `tsconfig.json`, `eslint.config.*`, `prettier.config.*` มี `extends` หรือไม่
   - พิจารณาใช้ shared config packages เช่น `@antfu/eslint-config`, `@tsconfig/*`, `prettier-config-standard`
   - ตรวจ `mise.toml` หรือ `.tool-versions` ให้ pin versions

### 3. Update Package Manifest

> Goal: package.json หรือ manifest หลักอัปเดต

1. ตรวจ `package.json`:
   - มี `packageManager` หรือไม่ (`pnpm@12.6.0`, `bun@1.4.2`)
   - มี `engines` หรือไม่
   - มี `workspaces` หรือ `package.json#workspaces`
   - มี `trustedDependencies` / `onlyBuiltDependencies` (Bun) หรือไม่
   - มี `repository`, `homepage`, `bugs`, `license` หรือไม่
   - มี `type`, `main`, `module`, `types` หรือไม่
2. ถ้า monorepo:
   - เพิ่ม/อัปเดต `pnpm-workspace.yaml` หรือ `bun-workspace.toml`
   - ใช้ `catalog:` หรือ `catalogs` สำหรับ shared dependencies
   - ลบ duplicate devDependencies ออกจาก package ลูก ย้ายไป root หรือ catalog
3. ถ้าใช้ mise:
   - ทำ `/follow-tool-mise` เพื่อตรวจ `mise.toml` ใน root
   - ระบุ tool versions สอดคล้องกับ `package.json engines`

### 4. Update Tool Configs

> Goal: tool configs สอดคล้องและไม่ซ้ำซ้อน

1. TypeScript:
   - สร้าง/อัปเดต `tsconfig.base.json` ใน root
   - ให้ workspace `tsconfig.json` extends `tsconfig.base.json`
   - ตรวจ `compilerOptions` ไม่ conflict ระหว่าง workspaces
2. ESLint:
   - รวมเป็น `eslint.config.js` / `eslint.config.mjs` (flat config — migrate `.eslintrc` ด้วย `bunx @eslint/migrate-config`)
   - ใช้ shared config package ถ้าเหมาะสม
   - ลบ `.eslintrc.*` ที่ซ้ำซ้อน (legacy format ถูก remove ใน ESLint 10)
3. Prettier:
   - รวมเป็น root `prettier.config.*` หรือ `.prettierrc`
   - อ้างอิงใน `package.json#prettier`
4. Vitest / Jest:
   - สร้าง shared test config แล้วให้ workspace `extends` หรือ `defineConfig` จาก shared
5. Build tools:
   - รวม `vite.config.*`, `tsup.config.*` ใช้ shared plugins ถ้าเป็นไปได้
6. Knip / Taze:
   - สร้าง `knip.config.*` หรือ `knip.json` ใน root
   - สร้าง `taze.config.*` ถ้าใช้

### 5. Update Monorepo Orchestration

> Goal: monorepo config ถูกต้อง

1. ถ้าใช้ moonrepo:
   - ทำ `/follow-tool-moonrepo` อัปเดต `.moon/workspace.yml`, `.moon/toolchains.yml`, `.moon/tasks/*.yml`
   - ตรวจ `moon.yml` แต่ละ project มี `id`, `language`, `type`, `dependsOn`
2. ถ้าใช้ turbo:
   - อัปเดต `turbo.json` ด้วย pipeline tasks
   - ใช้ `$schema` เวอร์ชันล่าสุด
   - ตรวจ `globalDependencies`, `globalEnv`, `remoteCache`
3. ถ้าใช้ pnpm/yarn/npm workspaces:
   - อัปเดต `pnpm-workspace.yaml` / `package.json#workspaces`
   - ใช้ `catalogs` หรือ `nohoist` ตามจำเป็น

### 6. Update CI/CD And Automation

> Goal: CI/CD config sync กับ project

1. ตรวจ `.github/workflows/*.yml`:
   - ใช้ package manager ตรงกับ `packageManager` field
   - ใช้ node/bun version ตรงกับ `engines` หรือ `mise.toml`
   - ใช้ moon/turbo run ตรงกับ root scripts
2. ตรวจ `.github/dependabot.yml` หรือ renovate config
3. ตรวจ git hooks:
   - `lefthook.yml` หรือ `husky` config
   - ใช้ `lint-staged` หรือ `nano-staged` ถ้าจำเป็น
4. ทำ `/update-dot-devin` สำหรับ Devin-specific rules

### 7. Update Editor And Environment

> Goal: editor, env, git config สะดวกและปลอดภัย

1. สร้าง/อัปเดต `.vscode/settings.json`, `.vscode/extensions.json`, `.vscode/launch.json`
2. สร้าง/อัปเดต `.editorconfig`
3. ตรวจ `.env.example` หรือ `.env.local.example`
4. ทำ `/update-gitignore` เพื่อ sync `.gitignore`
5. ตรวจ `.gitattributes`

### 8. Apply Changes With Dry Run

> Goal: ไม่ทำลาย config ที่มีอยู่

1. แสดง preview ของทุกการเปลี่ยนแปลงก่อน write
2. ถ้ามี destructive change (ลบ/overwrite) → ทำ dry-run แล้วถาม user
3. ใช้ `edit` ทีละไฟล์
4. บันทึกทุก config ที่ถูกเปลี่ยน

### 9. Validate

> Goal: ตรวจสอบว่า config ถูกต้อง

1. ทำ `/deep-validate` เพื่อตรวจ structure และ references
2. รัน tool validate ตาม ecosystem:
   - `moon check` หรือ `moon run :check` (moonrepo)
   - `tsc --noEmit` หรือ `tsc -b` (TypeScript)
   - `eslint .` (ESLint)
   - `prettier --check .` (Prettier)
   - `knip` (unused)
3. ทำ `/report-config-files` อีกครั้งเพื่อ verify
4. ทำ `/report` สรุป changes

### Workflows

> Goal: dispatch config domain เฉพาะทางไปยัง workflow ที่ละเอียดกว่า

| Topic | Workflow |
|-------|----------|
| อัปเดต env config — diff current vs needed, apply, verify | `workflows/config-env/SKILL.md` |
| รวม duplicate config/dependencies ไป shared config หรือ catalog | `workflows/update-shared-config/SKILL.md` |

## Rules

### 1. Review First

- ต้องทำ `/deep-review` ก่อน update
- ไม่แก้ไขก่อนมี findings และ priority
- ถ้า project ใหญ่หรือ monorepo ซับซ้อน → ใช้ `/update-devin-global-subagents`

### 2. Prefer Shared And Extends

- ใช้ shared config / `extends` แทน duplicate config ในแต่ละ workspace
- ใช้ dependencies catalog (`pnpm catalogs`, `bun catalogs`) แทน version ซ้ำ
- ย้าย shared devDependencies ไป root หรือ catalog

### 3. Monorepo

- ถ้ามี `.moon` หรือ `moon.yml` → ใช้ `/follow-tool-moonrepo`
- ถ้ามี `turbo.json` → ตรวจ `turbo.json` schema และ pipeline
- ถ้ามี `pnpm-workspace.yaml` → ตรวจ `catalogs` และ `packages`

### 4. Safety

- ทำ dry run สำหรับ destructive changes
- ถาม user ก่อนลบหรือ overwrite config
- ไม่ expose secrets
- สำรองไฟล์สำคัญก่อนแก้ถ้าจำเป็น

### 5. Ecosystem Aware

- ใช้ conventions ของ Bun, pnpm, Node, Rust, Python ตามทีตรวจพบ
- ใช้ `/follow-devin-global-skills` เพื่อหา config skills เฉพาะทาง

### 6. Defaults Minimal

- ใช้ `/follow-default-config` — config files เก็บเฉพาะ overrides; ลบ keys ที่เท่า default (เช็ค defaults ด้วย `/check-types-definition`)

- ใช้ /research-setup-integrations ถ้าจำเป็น (เลือก plugins/extensions/providers ของ tool จาก official sources)
- ใช้ /update-project ถ้าจำเป็น
- ใช้ /report-idea-cleanup-files-in-computer ถ้าจำเป็น

## Merged Details

### config-env

##### Goal

อัปเดต env configuration ของ project — diff ระหว่าง vars ที่มีกับที่ code ต้องการ, apply เฉพาะ keys ที่จำเป็น, verify ว่า app ยังรันได้ — ไม่ clobber values เดิม

##### Scope

- ใช้เมื่อต้องเพิ่ม/แก้/ลบ env vars หรือ sync `.env.example` กับ code
- ครอบคลุม: `.env`, `.env.local`, `.env.<mode>`, `.env.example`, env validation schema
- สำหรับ audit patterns/conventions → `follow-config/workflows/config-env/SKILL.md`

##### Execute

###### 1. Diff Current Vs Needed

> Goal: รู้ว่าขาด/เกิน/เปลี่ยน key ไหน

1. ทำ `/check-secrets env-vars` — vars ที่ code อ่าน (`process.env.*`, `import.meta.env.*` ตาม stack) เทียบกับที่ define
2. อ่าน env files ปัจจุบันและ `.env.example` — list keys ทั้งหมด
3. สร้าง diff: missing keys (code ใช้แต่ไม่มี), stale keys (มีแต่ code ไม่ใช้), keys ที่ต้องเปลี่ยนค่า/format
4. ทำ `/deep-review` domain `review-config` report-drift workflow ถ้าต้องดู drift ข้าม environments/workspaces

###### 2. Apply Changes

> Goal: แก้เฉพาะ keys ที่จำเป็น

1. เพิ่ม missing keys ใน `.env.example` พร้อม placeholder + comment ว่าใช้ทำอะไร
2. อัปเดต validation schema (ถ้ามี) ให้ครอบคลุม keys ใหม่ — required/optional, types, defaults
3. ถาม user ก่อนลบ stale keys — อาจใช้ใน environment อื่นหรือ runtime ภายนอก
4. secrets/ค่าจริง → `/follow-secret-manager` — ห้ามใส่ในไฟล์ที่ commit; local `.env` แก้ได้แต่ห้าม commit

###### 3. Verify

> Goal: app รันได้กับ env ใหม่

1. รัน dev/build — startup validation ผ่าน ไม่มี missing var crash
2. ทดสอบ path ที่ใช้ vars ใหม่ — smoke test เฉพาะจุดที่แก้
3. ทำ `/check-secrets secrets-leak` — ยืนยันไม่มี secrets ใน git-tracked files
4. `git status` ยืนยัน `.env` ไม่ถูก stage — commit เฉพาะ `.env.example`/schema

##### Rules

- merge เฉพาะ keys ที่เปลี่ยน — ห้าม rewrite ทั้งไฟล์ env ถ้าไม่จำเป็น
- ห้าม commit `.env`/`.env.local` หรือค่าจริง — commit เฉพาะ example/schema/code
- ห้ามลบ keys โดยไม่ confirm — stale ใน repo นี้อาจ required ใน environment อื่น
- prefix conventions ต้องถูก — public vars ตาม framework (`NEXT_PUBLIC_*`, `VITE_*`)
- ถ้าพบ secret ที่ commit ไปแล้ว → แจ้ง user ต้อง rotate ไม่ใช่แค่แก้ไฟล์

##### Expected Outcome

- env files ตรงกับ vars ที่ code ใช้ — ไม่มี missing/stale ที่ไม่ได้ตั้งใจ
- `.env.example` และ validation schema sync กัน
- verify ผ่าน — app รันได้ ไม่มี secrets leak

### update-shared-config

##### Goal

รวม tool config และ dependency versions ที่ซ้ำกันข้าม workspaces ไปไว้ที่ shared config หรือ catalog จุดเดียว — หนึ่ง fact หนึ่ง source — แล้วให้แต่ละ workspace อ้างอิงกลับผ่าน `extends`/`catalog:`

##### Scope

- ใช้เมื่อ config เดียวกัน (`tsconfig`, `eslint`, `prettier`, `vitest`, build config) ถูก duplicate ใน 2+ workspaces
- ใช้เมื่อ dependency version เดียวกันกระจายใน package manifests หลายตัว
- สำหรับ shared code (utils, types, components) ที่ duplicate ข้าม packages → `/refactor-to-packages-shared` แทน
- สำหรับ env vars → `workflows/config-env/SKILL.md` แทน

##### Execute

###### 1. Find Duplicate Config

> Goal: รู้ว่า config ไหนซ้ำจริงและคุ้มรวม

1. ทำ `/deep-review` domain `review-config` — หา config ที่ซ้ำหรือ drift ข้าม workspaces
2. เทียบ config ต่อ domain: `tsconfig*.json`, `eslint.config.*`, `prettier.config.*`, `vitest.config.*`, build configs
3. เทียบ dependency versions ข้าม package manifests — หา version drift และ duplicates
4. เก็บ candidates เฉพาะที่ซ้ำจริงใน 2+ workspaces — ห้ามรวมเผื่อ

###### 2. Extract To Shared

> Goal: config หลักอยู่จุดเดียว workspaces อ้างกลับ

1. สร้าง/อัปเดต root shared config ตาม ecosystem:
   - `tsconfig.base.json` → workspaces `extends`
   - `eslint.config.js` flat config ที่ root → workspaces import/extend
   - `prettier.config.*` ที่ root → อ้างผ่าน `package.json#prettier`
   - test/build config → `defineConfig` จาก shared
2. ย้าย dependency versions ที่ซ้ำไป catalog ตาม package manager (`pnpm-workspace.yaml` catalogs, `bun.catalogs`, หรือ root `overrides`)
3. แทนที่ version ใน package manifests ด้วย `catalog:` reference
4. ถ้างานนี้มี shared code duplication ปน → dispatch `/refactor-to-packages-shared` สำหรับส่วน code

###### 3. Rewire And Verify

> Goal: ทุก workspace ใช้ shared config จริงและไม่พัง

1. ทำ `/update-references` — ลบ config ลูกที่ duplicate, เก็บเฉพาะ workspace-specific overrides
2. รัน validate ตาม ecosystem: `tsc -b`, `eslint .`, `prettier --check .`, install ใหม่เพื่อ resolve catalog
3. ทำ `/deep-review` domain `review-config` อีกครั้ง — ยืนยันว่าเหลือ canonical config เดียวต่อ domain
4. ถ้า fail → revert batch นั้นแล้วแก้ สูงสุด 3 รอบ → stop/report

##### Rules

- รวมเฉพาะ config ที่ซ้ำจริง — workspace-specific options อยู่ที่ workspace เดิม
- shared config ห้ามพึ่ง workspace ใดๆ — เป็น foundation เท่านั้น
- behavior เหมือนเดิม — resolved config หลัง extends ต้องเท่าเดิม (ยกเว้น drift ที่ตั้งใจ unify)
- lockfile ต้อง regenerate หลังย้าย deps ไป catalog — commit lockfile ด้วย

##### Expected Outcome

- config แต่ละ domain มี canonical version เดียวที่ root — workspaces แค่ extends/override
- dependency versions อยู่ใน catalog — manifests ใช้ `catalog:` ไม่ pin ซ้ำ
- validate ผ่านทุก workspace — ไม่มี config drift เหลือ

## Expected Outcome

- config files ทั้งหมดครบถ้วนและสอดคล้องกัน
- ลด duplication ด้วย shared config / extends / catalog
- monorepo orchestration ถูกต้อง
- CI/CD, editor, env, git config sync
- ผ่าน `/deep-validate` และ tool checks ตาม ecosystem
- รายงาน changes, risks, และ next actions
