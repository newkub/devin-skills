---
name: review-config
description: Review config files ครอบคลุม tsconfig vite biome drizzle vitest turbo env พร้อม health score
---

## Goal

Review config files ครอบคลุมทุก dimension ของ configuration พร้อม aggregate findings และ health score

## Scope

config review สำหรับ: tsconfig, vite, biome, uno, drizzle, vitest, lefthook, turbo, package.json scripts, env vars, config consistency, config security, config optimization, config drift detection

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ config setup และทุก config files ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ config files
2. ระบุ config files ทั้งหมด: `tsconfig.json`, `vite.config.ts`, `biome.jsonc`, `uno.config.ts`, `drizzle.config.ts`, `vitest.config.ts`, `lefthook.yml`, `turbo.json`, `package.json`, `.env.example`, `knip.json`, `sgconfig.yml`
3. ระบุว่าเป็น monorepo หรือ single project — ถ้า monorepo ให้ระบุ config files ในแต่ละ workspace
4. ถ้าเป็น web project → เพิ่ม `/run-dev` เพื่อ verify dev server ก่อน review
5. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
6. ทำ `/run-health` เพื่อรัน health CLI และดึง metrics ล่าสุด

### 2. Analyze Config Files

วิเคราะห์ทุก config file พร้อมรวบรวม findings

> Goal: พบทุก issue พร้อม evidence และ health score

1. ทำ `/update-codebase-health-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
2. รัน `bun --filter @booking/tools-health health:json` เพื่อดึง health report พร้อม metrics
3. ตรวจสอบ `tsconfig.json`: compiler options (target, module, strict, isolatedModules), path aliases (`~/*` → `./src/*`), project references, `tsc` usage
4. ตรวจสอบ `vite.config.ts`: plugins (tanstackStart, viteSolid, UnoCSS, tsconfigPaths), build options (manualChunks, minify, sourcemap), dev server, optimizeDeps, SPA config ถ้ามี
5. ตรวจสอบ `biome.jsonc`: enabled domains (drizzle, turborepo, types, solid, test), format rules, `vcs` enabled, ไม่มี `biome-ignore` โดยไม่จำเป็น, workspace-specific configs ไม่ขัดแย้ง root
6. ตรวจสอบ `uno.config.ts`: presets (presetWind4, presetIcons), theme colors (HSL variables, color tokens, variants), transformers, shortcuts, safelist
7. ตรวจสอบ `drizzle.config.ts`: schema path, output directory, dialect (`postgresql`), connection (`DATABASE_URL` env var ไม่ hardcode)
8. ตรวจสอบ `vitest.config.ts`: environment (jsdom/node), coverage (v8 provider, reporters), aliases (tsconfigPaths), setup file, `vite-plugin-solid` `hot: false`
9. ตรวจสอบ `lefthook.yml`: `assert_lefthook_installed`, pre-commit (Biome lint/format, `stage_fixed: true`), pre-push (typecheck + test parallel), pre-merge-commit (typecheck), glob patterns, exclude patterns, `fail_text`
10. ตรวจสอบ `turbo.json`: tasks ครบ, `dependsOn` (`^build`), cached tasks มี outputs, non-cached tasks, task inputs, `globalEnv` ครบ, `globalDependencies`
11. ตรวจสอบ `package.json` scripts: dev, build, test, lint, typecheck, format, verify, ci, clean — `bun`/`bunx` usage, `tsc` usage, workspace-specific scripts, `prepare` script
12. ตรวจสอบ env vars: validation, parity (dev/staging/prod), `.env.example` completeness, exposure (client vs server, `VITE_` prefix), type safety, secret management (Infisical, ไม่ hardcode)
13. จับ findings พร้อม evidence (file, line, code snippet) — ตรวจสอบทั้ง positive และ negative aspects

### 3. Review Consistency And Security

ตรวจสอบ consistency ข้าม workspaces และ security ของ configs

> Goal: ครอบคลุม consistency, security, documentation, optimization

1. ตรวจสอบ cross-workspace config consistency: `tsconfig.json`, `vite.config.ts`, `biome.jsonc`, `vitest.config.ts` — ใช้ shared config จาก root, alias consistency, ไม่มี redundant configs
2. ตรวจสอบ config security: secrets ไม่อยู่ใน committed configs, `.gitignore` ครอบคลุม, ไม่มี secret exposure ใน client bundle, Infisical config ไม่ถูก commit
3. ตรวจสอบ config documentation: non-obvious options มี comment, `.env.example` มี description, มี config template สำหรับ new workspace
4. ตรวจสอบ config optimization: `tsconfig.json` target/module เหมาะสม, `vite.config.ts` manualChunks/optimizeDeps, `turbo.json` caching strategy, `biome.jsonc` ไม่มี unnecessary rules, `uno.config.ts` safelist กระชับ
5. ถ้ามีหลาย environments → ทำ `/report-config-drift` เพื่อเปรียบเทียบ config drift

### 4. Validate Findings

ตรวจสอบและ validate issues จากทุก section

> Goal: Issues ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low
4. ระบุ false positives ที่พบ

### 5. Rate Severity And Health Score

ให้คะแนน severity และคำนวณ health score

> Goal: รู้ลำดับความสำคัญและ overall health

1. ให้ severity: Critical, High, Medium, Low, Info
2. คำนวณ health score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
3. จัดลำดับ findings ตาม severity

### 6. Report

รายงานผล review ในรูปแบบตาราง

> Goal: รายงาน aggregate findings พร้อม actionable recommendations

1. ทำ `/report` พร้อม `/report-format-table`
2. สร้างตาราง aggregate findings จากทุก section
3. ทำ `/suggest-next-action`

### 7. Implement All

ตรวจสอบว่า findings ที่พบสามารถ implement ได้จริง

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

1. ทำ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings ใน report

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี TypeScript → ข้าม Step 2 item 3
- ถ้า project ไม่มี Vite → ข้าม Step 2 item 4
- ถ้า project ไม่มี Biome → ข้าม Step 2 item 5
- ถ้า project ไม่มี UnoCSS → ข้าม Step 2 item 6
- ถ้า project ไม่มี Drizzle → ข้าม Step 2 item 7
- ถ้า project ไม่มี Vitest → ข้าม Step 2 item 8
- ถ้า project ไม่มี Lefthook → ข้าม Step 2 item 9
- ถ้า project ไม่ใช่ monorepo → ข้าม Step 2 item 10
- ถ้า project ไม่มี env vars → ข้าม Step 2 item 12

### 2. Severity Classification

- Critical: broken config, conflicting settings, secret in committed config, hardcoded secret, missing required config, disabled strict mode, secret in client bundle, missing `.gitignore` entry
- High: inconsistent path alias, missing project reference, missing domain, missing manualChunks, missing schema path, missing alias, missing stage_fixed, missing required task, missing globalEnv, env parity gap, missing `.env.example`, inconsistent config across workspaces
- Medium: suboptimal compiler option, suboptimal dev server, missing color token, missing transformer, inconsistent shortcuts, missing coverage reporter, missing exclude pattern, inconsistent glob pattern, missing cache output, inconsistent naming, missing config comment
- Low: minor config improvement, missing config documentation, naming convention, minor optimization opportunity

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Health Score

- คำนวณ health score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก config section
- รายงาน recommended actions พร้อม priority
- Health score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
