---
name: review-config
description: ตรวจสอบ config files ทั้ง root และทุก workspace พร้อมรายงาน findings และ health score
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - suggest-next-action
  - validate
---

## Goal

ตรวจสอบ config files ทั้ง root และทุก workspace ให้ครบถ้วน ถูกต้อง และสอดคล้องกับ tech stack พร้อม health score

## Scope

ใช้กับ project ที่มี `package.json` และ config files ใน root หรือ monorepo ครอบคลุม scripts, build config, shared config, lint, format, git hooks, CI/CD, env vars และ config consistency

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ project structure, tech stack และ config files ทั้งหมด

1. ตรวจสอบ project structure และ config files ด้วย `/scan-codebase`
2. ระบุ `package.json` ของ root และทุก workspace (ถ้าเป็น monorepo)
3. ระบุ package manager, build tool, framework, monorepo tool ที่ใช้
4. ระบุ config files ที่เกี่ยวข้อง: `tsconfig.json`, `vite.config.ts`, `biome.jsonc`, `uno.config.ts`, `drizzle.config.ts`, `vitest.config.ts`, `lefthook.yml`, `turbo.json`, `.env.example`, `.gitignore`, `knip.json`, `sgconfig.yml`
5. ระบุ config files ที่ขาดหรือล้าสมัยในแต่ละ workspace
6. ถ้าเป็น monorepo ให้ระบุ workspace boundaries, shared packages, และ config overrides
7. จัดลำดับ priority สำหรับ review: foundation (root) → shared packages → apps
8. บันทึก baseline ของ build time, output size, และ config state เพื่อเปรียบเทียบ

### 2. Review Tasks And Scripts

> Goal: ประเมินความถูกต้องและ consistency ของ scripts ใน package manifest

1. ตรวจสอบ scripts หลักใน root และทุก workspace: `dev`, `build`, `typecheck`, `lint`, `format`, `test`, `scan`, `check`, `verify`, `ci`
2. ระบุ package manager commands ที่ใช้: `bun`/`bunx`, `pnpm`, `npm`, `yarn` และความสอดคล้องกัน
3. ประเมินความสอดคล้องของ scripts ข้าม workspaces: ชื่อ, ลำดับ, และ dependencies
4. ตรวจสอบ `prepare`, `preinstall`, `postinstall` scripts ว่าไม่ทำลาย config หรือสร้าง side effect ที่ไม่ต้องการ
5. ตรวจสอบ `turbo.json` tasks: tasks ครบ, `dependsOn`, `outputs`, `inputs`, `globalEnv`, `globalDependencies`
6. ตรวจสอบ `lefthook.yml`: `assert_lefthook_installed`, pre-commit, pre-push, pre-merge-commit, `stage_fixed`, `fail_text`, glob/exclude patterns
7. ประเมิน CI/CD workflow หรือ GitHub Actions ว่ารัน `/run-check` หรือ `/validate` ก่อน merge

### 3. Review Build Configuration

> Goal: ประเมินความเหมาะสมและ optimization ของ build config

1. ตรวจสอบ `vite.config.ts`: plugins, `manualChunks`, `minify`, `sourcemap`, `optimizeDeps`, `target`, dev server, SPA/SSR config
2. ตรวจสอบ `tsconfig.json`: `target`, `module`, `strict`, `isolatedModules`, path aliases, project references, `tsc` usage
3. ระบุค่า `minify`, `sourcemap`, `external`, `tree-shaking`, `target` ใน build config แต่ละ workspace
4. ตรวจสอบ build metrics ที่มี: build time, output size, chunk distribution; เปรียบเทียบกับ baseline
5. ประเมินว่า build config ครอบคลุม optimization ตามเกณฑ์ของ `/improve-efficiency` หรือไม่
6. ระบุปัญหาที่อาจส่งผลต่อ build speed หรือ output size โดยไม่ทำลาย functionality

### 4. Review Shared Configuration

> Goal: ประเมินความถูกต้องและ consistency ของ shared config

1. ตรวจสอบ root-level shared config: `biome.jsonc`, `tsconfig.json`, `turbo.json`, `lefthook.yml`, `.gitignore`, `.editorconfig`
2. ตรวจสอบว่า workspace-specific config extends หรือ override root ได้ถูกต้อง
3. ตรวจสอบ consistency ของ path aliases ระหว่าง `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`
4. ตรวจสอบ `biome.jsonc`: enabled domains, format rules, `vcs`, biome-ignore ที่ไม่จำเป็น, workspace-specific configs ไม่ขัดแย้ง root
5. ตรวจสอบ `uno.config.ts`: presets, theme colors, transformers, shortcuts, safelist
6. ตรวจสอบ `vitest.config.ts`: environment, coverage provider/reporters, aliases, setup file, `hot: false` ถ้าใช้ `vite-plugin-solid`
7. ตรวจสอบ `drizzle.config.ts`: schema path, output directory, dialect, connection ผ่าน env var ไม่ hardcode
8. ประเมินว่า shared config ครอบคลุมตามเกณฑ์ของ `/follow-config` ตาม tech stack หรือไม่
9. ตรวจสอบ `.vscode` และ `.github` config ถ้ามี

### 5. Review Consistency And Security

> Goal: ประเมิน consistency ข้าม workspace และ security ของ config

1. ตรวจสอบ cross-workspace config consistency: `tsconfig.json`, `vite.config.ts`, `biome.jsonc`, `vitest.config.ts`, `package.json` scripts
2. ระบุ redundant configs หรือ configs ที่ควรย้ายไป root/shared
3. ตรวจสอบ config security: ไม่มี secrets ใน committed configs, `.gitignore` ครอบคลุม `.env` และ output dirs, ไม่มี secret exposure ใน client bundle
4. ตรวจสอบ env vars: validation, parity dev/staging/prod, `.env.example` ครบถ้วน, client vs server prefix, type safety, secret management
5. ตรวจสอบ config documentation: comments สำหรับ non-obvious options, `.env.example` มี description, config template สำหรับ new workspace
6. ตรวจสอบ config optimization: `tsconfig.json` target/module, `vite.config.ts` manualChunks/optimizeDeps, `turbo.json` caching, `biome.jsonc` unnecessary rules, `uno.config.ts` safelist
7. ถ้ามีหลาย environments ให้ระบุ config drift ระหว่าง dev/staging/prod

### 6. Validate Findings

> Goal: ยืนยันว่า findings ถูกต้อง มี evidence และจัดลำดับตาม severity

1. ตรวจสอบ findings ด้วย `/validate`
2. ตรวจสอบ cross-reference ข้าม config files, type safety, runtime, security, compliance
3. จัดลำดับ findings ตาม severity: Critical → High → Medium → Low → Info
4. ระบุ false positives และข้อจำกัดของข้อมูลที่ใช้
5. รวบรวม evidence เพิ่มเติมด้วย `/run-check` จาก lint, typecheck, scan ถ้าจำเป็น

### 7. Rate And Report

> Goal: ให้คะแนน severity, health score และรายงานผล

1. ให้ severity ตามกฎ Severity Classification
2. คำนวณ health score: (Critical=0, High=25, Medium=50, Low=75, Info=100) weighted average
3. แสดง health score ราย dimension และ overall score
4. สร้างตาราง findings ด้วย `/report-table`
5. รายงาน recommended actions พร้อม priority
6. แนะนำ action ถัดไปผ่าน `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี TypeScript → ข้าม `tsconfig.json` checks
- ถ้า project ไม่มี Vite → ข้าม `vite.config.ts` checks
- ถ้า project ไม่มี Biome → ข้าม `biome.jsonc` checks
- ถ้า project ไม่มี UnoCSS → ข้าม `uno.config.ts` checks
- ถ้า project ไม่มี Drizzle → ข้าม `drizzle.config.ts` checks
- ถ้า project ไม่มี Vitest → ข้าม `vitest.config.ts` checks
- ถ้า project ไม่มี Lefthook → ข้าม `lefthook.yml` checks
- ถ้า project ไม่ใช่ monorepo → ข้าม cross-workspace consistency checks
- ถ้า project ไม่มี env vars → ข้าม env checks

### 2. Severity Classification

- Critical: broken config, conflicting settings, secret in committed config, hardcoded secret, missing required config, disabled strict mode, secret in client bundle, missing `.gitignore` entry
- High: inconsistent path alias, missing project reference, missing domain, missing manualChunks, missing schema path, missing alias, missing stage_fixed, missing required task, missing globalEnv, env parity gap, missing `.env.example`, inconsistent config across workspaces
- Medium: suboptimal compiler option, suboptimal dev server, missing color token, missing transformer, inconsistent shortcuts, missing coverage reporter, missing exclude pattern, inconsistent glob pattern, missing cache output, inconsistent naming, missing config comment
- Low: minor config improvement, missing config documentation, naming convention, minor optimization opportunity

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification
- อ้างอิง code snippet หรือ config value จริง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code หรือ config ระหว่าง review
- ไม่สั่ง edit/apply fixes หรือ commit ในกระบวนการ review
- ถ้าพบปัญหาที่ต้องแก้ ให้รายงานเป็น findings แล้วเสนอผ่าน `/suggest-next-action`

### 5. Health Score

- คำนวณ health score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 6. Formatting

- ห้ามใช้ double-asterisk bold markers สำหรับ emphasis
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `skill references`
- ใช้ heading levels สำหรับ structure
- รายงาน findings เป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก config section
- รายงาน recommended actions พร้อม priority
- Health score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
- ไม่มีการแก้ไข code หรือ config ในกระบวนการ review
