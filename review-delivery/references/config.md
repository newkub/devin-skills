# Config Health Checks

## Goal

ตรวจสอบ config files ทั้ง root และทุก workspace ให้ครบถ้วน ถูกต้อง และสอดคล้องกับ tech stack

## Scope

ใช้กับ project ที่มี `package.json` และ config files ใน root หรือ monorepo ครอบคลุม scripts, build config, shared config, lint, format, git hooks, CI/CD, env vars และ config consistency

## Checks

### Tasks And Scripts

1. ตรวจสอบ scripts หลัก: `dev`, `build`, `typecheck`, `lint`, `format`, `test`, `scan`, `check`, `verify`, `ci`
2. ระบุ package manager commands: `bun`/`bunx`, `pnpm`, `npm`, `yarn` และความสอดคล้องกัน
3. ประเมินความสอดคล้องของ scripts ข้าม workspaces: ชื่อ, ลำดับ, และ dependencies
4. ตรวจสอบ `prepare`, `preinstall`, `postinstall` scripts ว่าไม่สร้าง side effect ที่ไม่ต้องการ
5. ตรวจสอบ `turbo.json` tasks: `dependsOn`, `outputs`, `inputs`, `globalEnv`, `globalDependencies`
6. ตรวจสอบ `lefthook.yml`: `assert_lefthook_installed`, pre-commit, pre-push, `stage_fixed`, `fail_text`

### Build Configuration

1. ตรวจสอบ `vite.config.ts`: plugins, `manualChunks`, `minify`, `sourcemap`, `optimizeDeps`, `target`, dev server
2. ตรวจสอบ `tsconfig.json`: `target`, `module`, `strict`, `isolatedModules`, path aliases, project references
3. ระบุ `minify`, `sourcemap`, `external`, `tree-shaking`, `target` ใน build config แต่ละ workspace
4. ตรวจสอบ build metrics: build time, output size, chunk distribution

### Shared Configuration

1. ตรวจสอบ root-level shared config: `biome.jsonc`, `tsconfig.json`, `turbo.json`, `lefthook.yml`, `.gitignore`, `.editorconfig`
2. ตรวจสอบ workspace-specific config extends หรือ override root ได้ถูกต้อง
3. ตรวจสอบ consistency ของ path aliases ระหว่าง `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`
4. ตรวจสอบ `biome.jsonc`: enabled domains, format rules, `vcs`, biome-ignore ที่ไม่จำเป็น
5. ตรวจสอบ `uno.config.ts`: presets, theme colors, transformers, shortcuts, safelist
6. ตรวจสอบ `vitest.config.ts`: environment, coverage provider/reporters, aliases, setup file
7. ตรวจสอบ `drizzle.config.ts`: schema path, output directory, dialect, connection ผ่าน env var

### Consistency And Security

1. ตรวจสอบ cross-workspace config consistency
2. ระบุ redundant configs หรือ configs ที่ควรย้ายไป root/shared
3. ตรวจสอบ config security: ไม่มี secrets ใน committed configs, `.gitignore` ครอบคลุม `.env`
4. ตรวจสอบ env vars: validation, parity dev/staging/prod, `.env.example` ครบถ้วน, client vs server prefix
5. ตรวจสอบ config documentation: comments สำหรับ non-obvious options
6. ระบุ config drift ระหว่าง dev/staging/prod ถ้ามีหลาย environments

## Severity

- Critical: broken config, conflicting settings, secret in committed config, hardcoded secret, missing required config, disabled strict mode
- High: inconsistent path alias, missing project reference, missing manualChunks, env parity gap, missing `.env.example`, inconsistent config across workspaces
- Medium: suboptimal compiler option, missing color token, inconsistent shortcuts, missing coverage reporter
- Low: minor config improvement, missing config documentation, naming convention

## Rules

- ถ้า project ไม่มี TypeScript/Vite/Biome/UnoCSS/Drizzle/Vitest/Lefthook → ข้าม checks ที่เกี่ยวข้อง
- ถ้า project ไม่ใช่ monorepo → ข้าม cross-workspace consistency checks
- ทุก finding ต้องมี file path และ line number
- ทำ review เท่านั้น ไม่แก้ไข code หรือ config ระหว่าง review
