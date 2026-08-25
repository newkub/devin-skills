---
name: follow-tasks
description: ตั้งค่า scripts ใน package.json หรือ Cargo.toml ตามมาตรฐาน
---

## Goal

ตั้งค่า scripts ใน `package.json` หรือ `Cargo.toml` ตามมาตรฐาน Minimal, Standard, Complete

## Scope

ตั้งค่า scripts สำหรับ packages และ workspaces ใน monorepo ไม่รวมการเขียน config files เอง (ใช้ `/follow-config`)

## Execute

### 1. Check Prerequisites

> Goal: ตรวจสอบ project structure และ tools ก่อนเริ่มตั้งค่า scripts

1. ตรวจสอบ `package.json` หรือ `Cargo.toml` ว่ามีอยู่ — ถ้าไม่มี → stop และ report
2. ตรวจสอบ monorepo (หลาย `package.json`, workspace config, git submodules) — ถ้าเป็น monorepo ทำ `/follow-monorepo` ก่อน
3. ยืนยัน tools ติดตั้งแล้ว: Node.js/Bun (`biome`, `vitest`), Rust (`cargo-nextest`, `cargo-llvm-cov`), Python (`pytest`, `ruff`), Go (`go test`, `golangci-lint`)
4. ถ้า tool จำเป็นไม่มี → stop และ report

### 2. Update Dependencies

> Goal: ตรวจสอบ package manager และ update dependencies ตาม ecosystem

1. ตรวจสอบ package manager (`bun`, `npm`, `pnm`, `yarn`, `cargo`, `pip`, `go`)
2. สำหรับ Node.js/Bun → ทำ `/follow-tool-taze` เพื่อตั้งค่า Taze สำหรับ dependency updates
3. สำหรับ tools ที่จัดการด้วย mise → รัน `mise upgrade` เพื่ออัปเดต dev tools (เช่น `bun`, `gitleaks`, `hk`); ถ้าต้องการ bump version ใน `mise.toml` ด้วย → ใช้ `mise upgrade --bump`
4. Update ตาม ecosystem: Node.js/Bun ใช้ `taze` (Root Only), Rust ใช้ `cargo update`, Python ใช้ `pip install -U`, Go ใช้ `go get -u ./... && go mod tidy`
5. สำหรับ monorepo ที่ใช้ Bun: `taze` และ `lefthook install` ต้องอยู่เฉพาะ root `package.json` — workspace packages ไม่มี `prepare` script — root: `"prepare": "bunx taze -r -w -i && bunx lefthook install"`
6. ถ้า update fail → retry (max 3 → stop/report)

### 3. Select Template Level

> Goal: เลือกระดับ scripts ตามขนาดและความซับซ้อนของโปรเจกต์

1. ประเมินขนาดโปรเจกต์และความต้องการ testing/deployment
2. เลือกระดับตาม Rules section 1: Minimal (ทุกโปรเจกต์), Standard (testing + deps management), Complete (infra/tooling team)
3. ถ้าไม่แน่ใจ → เริ่มด้วย Minimal และขยายภายหลัง

### 4. Apply Scripts

> Goal: ตั้งค่า scripts ในทุก workspace ตาม tech stack และ template level ที่เลือก

1. ทำ `/use-scripts` ตาม tech stack จากตาราง Rules — Single workspace: แก้ไข `package.json` หรือ `Cargo.toml` โดยตรง
2. Multiple workspaces: ทำ `/follow-monorepo` ก่อน แล้วใช้ `/use-bun-scripts` สำหรับ batch update
3. ถ้า operations > 10 ไฟล์ → ใช้ `/use-scripts` เพื่อ batch update
4. ถ้า apply fail → retry (max 3 → stop/report)

### 5. Setup Config And Secrets

> Goal: ตั้งค่า config files, ตั้งค่า secrets management ไปพร้อมกัน

1. `/follow-config` ตาม tech stack ที่ detect ได้, ตรวจสอบ `.infisical.json` ว่ามีหรือไม่
2. ถ้ามี `.infisical.json` หรือใช้ Infisical → ทำ `/follow-service-infisical` เพื่อตั้งค่า secrets scripts
3. ตรวจสอบว่า scripts ที่ต้องการ secrets (`dev`, `build`, `deploy`) ใช้ `infisical run -- <command>` ครอบ — เพิ่ม root scripts: `secrets:dev`, `secrets:build`, `secrets:export`, `secrets:run`
4. ตรวจสอบว่า `INFISICAL_TOKEN` ตั้งค่าใน CI/CD แล้ว — ถ้าไม่มี → report และขอให้ตั้งค่า
5. รันเฉพาะ workflows ที่จำเป็น ไม่รันทุก workflow — ถ้า config fail → retry (max 3 → stop/report)

### 6. Validate

> Goal: ตรวจสอบ scripts syntax และยืนยัน commands ทำงานได้จริง

1. ตรวจสอบ scripts syntax ใน `package.json` หรือ `Cargo.toml` — ถ้า syntax invalid → fix และ recheck (max 3 → stop)
2. ยืนยัน `check` script = `lint && typecheck && scan` และ `verify` = `check && test`
3. ทดสอบรัน `bun run verify` — ถ้า fail → แก้ไขและ retry (max 3 → stop/report)

## Rules

### 1. Scripts Levels And Root Only

เลือกระดับตามขนาดและความซับซ้อนของโปรเจกต์
- Minimal (Default): dev, build, typecheck, lint, format, test, scan, check, verify, ci - เหมาะสำหรับโปรเจกต์ส่วนใหญ่
- Standard: Minimal + test:watch, test:coverage, deps:analyze, clean, security, db scripts, predeploy, deploy:staging - เหมาะสำหรับโปรเจกต์ที่ต้องการ testing และ dependency management เพิ่มเติม
- Complete: Standard + build:watch, typecheck:watch, test:integration, test:e2e, benchmarks, prerelease, release, db:studio - เหมาะสำหรับ infra/tooling team

สำหรับ monorepo ที่ใช้ Bun:
- `taze` และ `lefthook install` ต้องอยู่เฉพาะ root `package.json` เท่านั้น
- Workspace packages ไม่มี `prepare` script
- Root `package.json`: `"prepare": "bunx taze -r -w -i && bunx lefthook install"`

### 2. Required Scripts

Scripts พื้นฐานที่ทุกโปรเจกต์ต้องมีเพื่อรับประกันคุณภาพโค้ด:

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| prepare (Root Only) | bunx taze -r -w -i && bunx lefthook install | bunx taze -r -w -i && bunx lefthook install | bunx taze -r -w -i && bunx lefthook install | bunx taze -r -w -i && bunx lefthook install | bunx taze -r -w -i && bunx lefthook install | bunx taze -r -w -i && bunx lefthook install | cargo update && bunx lefthook install | pip install -U -r requirements.txt && pre-commit install | go mod download && go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest |
| prepare (Workspace) | - | - | - | - | - | - | - | - | - |
| dev | bun run src/index.ts | nuxt dev | next dev | vite dev | vite dev | tauri dev | cargo run | python -m src | go run . |
| build | bun build | nuxt build | next build | vite build | vite build | tauri build | cargo build | python -m build | go build . |
| typecheck | tsc --noEmit | nuxt typecheck | tsc --noEmit | tsc --noEmit | svelte-check --tsconfig ./tsconfig.json | tsc --noEmit | cargo check | mypy src | go vet ./... |
| lint | biome lint | biome lint | biome lint | biome lint | biome lint | biome lint | cargo clippy | ruff check | golangci-lint run |
| format | biome lint --write | biome lint --write | biome lint --write | biome lint --write | biome lint --write | biome lint --write | cargo fmt | ruff format | gofmt -w . |
| test | vitest run | vitest run | vitest run | vitest run | vitest run | vitest run | cargo nextest run | pytest | go test ./... |
| scan | ast-grep scan | ast-grep scan | ast-grep scan | ast-grep scan | ast-grep scan | ast-grep scan | cargo clippy --all-targets | ruff check | golangci-lint run |
| check | lint && typecheck && scan | lint && typecheck && scan | lint && typecheck && scan | lint && typecheck && scan | lint && typecheck && scan | lint && typecheck && scan | cargo clippy && cargo check | ruff check && mypy | golangci-lint run && go vet |
| verify | check && test | check && test | check && test | check && test | check && test | check && test | cargo clippy && cargo check && cargo nextest run | ruff check && mypy && pytest | golangci-lint run && go vet && go test |
| ci | verify && build | verify && build | verify && build | verify && build | verify && build | verify && build | cargo clippy && cargo check && cargo nextest run && cargo build | ruff check && mypy && pytest && python -m build | golangci-lint run && go vet && go test && go build . |

### 3. Watch Mode Scripts

Scripts สำหรับ development mode เพื่อเพิ่มประสิทธิภาพการพัฒนา:

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| test:watch | vitest | vitest | vitest | vitest | vitest | vitest | cargo nextest run --watch | pytest-watch | go test ./... -watch |
| typecheck:watch | tsc --noEmit --watch | nuxt typecheck --watch | tsc --noEmit --watch | tsc --noEmit --watch | svelte-check --watch --tsconfig ./tsconfig.json | tsc --noEmit --watch | cargo watch -x check | - | - |
| build:watch | bunup --watch | nuxt build --watch | next build --watch | vite build --watch | vite build --watch | tauri build --watch | cargo build --watch | - | - |

### 4. Testing Scripts

Scripts สำหรับ testing เพิ่มเติมเพื่อครอบคลุมทุกมิติของการทดสอบ:

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| test:coverage | vitest run --coverage | vitest run --coverage | vitest run --coverage | vitest run --coverage | vitest run --coverage | vitest run --coverage | cargo llvm-cov --html | pytest --cov | go test -coverprofile=coverage.out |
| test:integration | vitest run --config vitest.integration.config.ts | vitest run --config vitest.integration.config.ts | vitest run --config vitest.integration.config.ts | vitest run --config vitest.integration.config.ts | vitest run --config vitest.integration.config.ts | vitest run --config vitest.integration.config.ts | cargo nextest run --test-dir integration | pytest tests/integration | go test ./tests/integration |
| test:e2e | vitest run --config vitest.e2e.config.ts | vitest run --config vitest.e2e.config.ts | vitest run --config vitest.e2e.config.ts | vitest run --config vitest.e2e.config.ts | vitest run --config vitest.e2e.config.ts | vitest run --config vitest.e2e.config.ts | cargo nextest run --test-dir e2e | pytest tests/e2e | go test ./tests/e2e |

### 5. Dependency Management Scripts

Scripts สำหรับจัดการ dependencies เพื่อรักษาความปลอดภัยและประสิทธิภาพ:

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| clean | bunx rimraf node_modules | bunx rimraf node_modules | bunx rimraf node_modules | bunx rimraf node_modules | bunx rimraf node_modules | bunx rimraf node_modules && cargo clean | cargo clean | rm -rf .venv __pycache__ | go clean -modcache |
| deps:analyze | bunx depcheck | bunx depcheck | bunx depcheck | bunx depcheck | bunx depcheck | bunx depcheck | cargo outdated | pip-audit | go mod verify |
| deps:update | taze -r -w | taze -r -w | taze -r -w | taze -r -w | taze -r -w | taze -r -w | cargo update | pip install -U -r requirements.txt | go get -u ./... && go mod tidy |

### 6. Database Scripts

Scripts สำหรับ database operations เพื่อจัดการ schema และข้อมูล:

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| db:migrate | bunx drizzle-kit push | bunx drizzle-kit push | bunx drizzle-kit push | bunx drizzle-kit push | bunx drizzle-kit push | bunx drizzle-kit push | diesel migration run | alembic upgrade head | go run ./migrate |
| db:seed | bunx drizzle-kit seed | bunx drizzle-kit seed | bunx drizzle-kit seed | bunx drizzle-kit seed | bunx drizzle-kit seed | bunx drizzle-kit seed | - | python seed.py | go run ./seed |
| db:studio | bunx drizzle-kit studio | bunx drizzle-kit studio | bunx drizzle-kit studio | bunx drizzle-kit studio | bunx drizzle-kit studio | bunx drizzle-kit studio | - | - | - |
| db:generate | bunx drizzle-kit generate | bunx drizzle-kit generate | bunx drizzle-kit generate | bunx drizzle-kit generate | bunx drizzle-kit generate | bunx drizzle-kit generate | - | - | - |

### 7. Release Scripts

Scripts สำหรับการ release เพื่อจัดการ versioning และ performance:

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Rust | Python | Go |
|------|-----|------|---------|------------|----------|------|--------|----|
| prerelease | bun run build | bun run build | bun run build | bun run build | bun run build | cargo build | python -m build | go build . |
| bench:fn | bunx mitata | bunx mitata | bunx mitata | bunx mitata | bunx mitata | cargo bench | pytest-benchmark | go test -bench=. |
| bench:server | bunx autocannon | bunx autocannon | bunx autocannon | bunx autocannon | bunx autocannon | - | - | - |
| bench:memory | bunx clinic | bunx clinic | bunx clinic | bunx clinic | bunx clinic | - | memory_profiler | pprof |
| release | auto-it | auto-it | auto-it | auto-it | auto-it | cargo release | python -m build && twine upload | go release |

### 8. Security Scripts

Scripts สำหรับ security เพื่อตรวจสอบ vulnerabilities และ licenses:

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Rust | Python | Go |
|------|-----|------|---------|------------|----------|------|--------|----|
| security | bunx audit | bunx audit | bunx audit | bunx audit | bunx audit | cargo audit | pip-audit | go mod verify |
| license | bunx license-checker | bunx license-checker | bunx license-checker | bunx license-checker | bunx license-checker | cargo deny check licenses | pip-licenses | go-licenses check |

### 9. Deployment Scripts

Scripts สำหรับ deployment เพื่อรับประกันคุณภาพก่อน deploy:

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Rust | Python | Go |
|------|-----|------|---------|------------|----------|------|--------|----|
| predeploy | bun run ci | bun run ci | bun run ci | bun run ci | bun run ci | cargo clippy && cargo check && cargo build | ruff check && mypy && pytest && python -m build | golangci-lint run && go vet && go test && go build . |
| deploy:staging | bunx wrangler deploy | bunx wrangler deploy | bunx vercel --prebuilt | bunx wrangler deploy | bunx wrangler deploy | cargo publish --dry-run | twine upload --repository testpypi | go release --dry-run |

### 10. Documentation Scripts

Scripts สำหรับ documentation เพื่อจัดการ docs site:

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Rust | Python | Go |
|------|-----|------|---------|------------|----------|------|--------|----|
| docs | vitepress dev | vitepress dev | vitepress dev | vitepress dev | vitepress dev | mdbook serve | mkdocs serve | godoc |

### 11. Review CLI Scripts

Scripts สำหรับรัน review CLI เพื่อ review codebase ผ่าน 	ools/review:

|| Task | Bun |
||------|-----|
|| review | un --filter tools-review review |
|| review:json | un --filter tools-review review:json |

ถ้า project ใช้ 	ools/review ให้เพิ่ม scripts นี้ใน package.json เมื่อตั้งค่า scripts ตาม /follow-tasks

## Expected Outcome

- `package.json` มี scripts ตาม template ที่เลือก (state change)
- Scripts สอดคล้องกับ tech stack (ตาราง Rules)
- `verify` และ `ci` pipeline ทำงานได้ถูกต้อง — `bun run verify` ผ่าน
- ถ้ามี Infisical: root `package.json` มี `secrets:*` scripts และ `INFISICAL_TOKEN` ตั้งค่าใน CI/CD
