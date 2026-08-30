# Config Review Checklist

## Discover Config Files

### Glob Patterns

- package: `package.json`, `bun.lockb`, `pnpm-workspace.yaml`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `requirements.txt`
- tooling: `tsconfig*.json`, `jsconfig.json`, `vite.config.*`, `vitest.config.*`, `eslint.config.*`, `.eslintrc*`, `prettier.config.*`, `.prettierrc*`, `knip.config.*`, `renovate.json`, `dependabot.yml`
- monorepo: `moon.yml`, `.moon/workspace.yml`, `.moon/toolchains.yml`, `.moon/tasks/*.yml`, `turbo.json`, `pnpm-workspace.yaml`, `bun-workspace.toml`, `bunfig.toml`
- CI/CD: `.github/workflows/*.yml`, `.github/dependabot.yml`, `.gitea/workflows/*`, `.circleci/*`, `.gitlab-ci.yml`
- editor/ide: `.vscode/settings.json`, `.vscode/extensions.json`, `.vimrc`, `.devin/rules`, `.cursor/rules`, `.windsurf/memories/global_rules.md`
- env: `.env*`, `*.env`, `config/.env*`
- git: `.gitignore`, `.gitattributes`, `.github/*`, `lefthook.yml`, `husky/*`, `.pre-commit-config.yaml`
- docs: `README.md`, `AGENTS.md`, `USAGE.md`, `CONTRIBUTING.md`, `LICENSE`

### Categories

จัดกลุ่มไฟล์: build, lint, test, deploy, editor, env, monorepo, docs
บันทึก path, format, purpose

## Analyze Config Coverage

ตรวจว่า project มี config ที่จำเป็นต่อ tech stack:

- TypeScript: `tsconfig.json`, แยก `tsconfig.base.json` ถ้า monorepo
- Bun/Node: `package.json` ครบ scripts, engines, volta/mise
- Lint: `eslint.config.*` หรือ `.eslintrc*`
- Format: `prettier.config.*` หรือ `.prettierrc*`
- Test: `vitest.config.*`, `jest.config.*`, `playwright.config.*`
- Build: `vite.config.*`, `tsup.config.*`, `rollup.config.*`, `webpack.config.*`
- Monorepo: `moon.yml` / `.moon/` หรือ `turbo.json` / `pnpm-workspace.yaml`
- Type check / unused: `knip.config.*`, `taze.config.*`
- Security/quality: `.gitleaks.toml`, `snyk.yml`, `codeql.yml`

ระบุ:

- config ที่ขาด
- config ที่ซ้ำซ้อน (เช่น `.eslintrc` + `eslint.config.js`)
- config ที่ drift ระหว่าง workspaces
- config ที่ out-of-date (version, deprecated keys)

## Check Shared Config Opportunities

### Monorepo

- ถ้าใช้ moonrepo → `/follow-tool-moonrepo`
- ถ้าใช้ pnpm workspace → ตรวจ `pnpm-workspace.yaml` และ `catalog:` ใน `package.json` / `pnpm-workspace.yaml`
- ถ้าใช้ bun workspace → ตรวจ `bun-workspace.toml` และ shared `tsconfig.base.json`
- ถ้าใช้ npm/yarn workspace → ตรวจ `workspaces` field

### Extends Config

- `tsconfig.json` มี `extends`
- `eslint.config.*` มี shared config `import(...)`
- `prettier` มี shared config package
- `vitest`, `vite`, `knip` แยก shared config ได้หรือไม่

### Dependencies Catalog

- `pnpm.catalogs` หรือ `bun.catalogs`
- `mise` global tools กับ project `mise.toml`
- `package.json` `overrides`/`resolutions`

## Review Security And Secrets

1. ค้นหา hardcoded secrets: API keys, tokens, passwords ใน config files
2. ตรวจ `.env` files ว่าอยู่ใน `.gitignore`
3. ตรวจ `package.json` มี `engines` / `trustedDependencies` / `onlyBuiltDependencies` เหมาะสม
4. ตรวจ CI/CD config มี secret scanning, SLSA, signed commits
5. ถ้า CI config ผิดหรือ pipeline ต้อง monitor จนผ่าน → ระบุให้ใช้ `/watch-cicd-and-resolve`

## Check Tool Versions And Consistency

1. ตรวจ versions ใน `package.json` devDependencies/dependencies กับ `mise.toml` / `.tool-versions`
2. ตรวจ node/bun/pnpm versions ระหว่าง `package.json engines`, `mise.toml`, `.nvmrc`, `.node-version`
3. ตรวจ `packageManager` field ใน `package.json`
4. ระบุ inconsistencies เช่น `package.json` ใช้ bun แต่ CI ใช้ pnpm
