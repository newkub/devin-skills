---
title: Package Scripts by Tech Stack
description: Script command lookup tables for Minimal, Standard, and Complete templates across stacks
---

# Package Scripts by Tech Stack

ดูตัวอย่าง `package.json` ได้ใน [package-json-examples.md](package-json-examples.md)

## Required Scripts

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| prepare (Root Only) | `bunx taze -r -w -i && bunx lefthook install` | `bunx taze -r -w -i && bunx lefthook install` | `bunx taze -r -w -i && bunx lefthook install` | `bunx taze -r -w -i && bunx lefthook install` | `bunx taze -r -w -i && bunx lefthook install` | `bunx taze -r -w -i && bunx lefthook install` | `cargo update && bunx lefthook install` | `pip install -U -r requirements.txt && pre-commit install` | `go mod download && go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest` |
| prepare (Workspace) | - | - | - | - | - | - | - | - | - |
| dev | `bun run src/index.ts` | `nuxt dev` | `next dev` | `vite dev` | `vite dev` | `tauri dev` | `cargo run` | `python -m src` | `go run .` |
| build | `bun build` | `nuxt build` | `next build` | `vite build` | `vite build` | `tauri build` | `cargo build` | `python -m build` | `go build .` |
| typecheck | `tsc --noEmit` | `nuxt typecheck` | `tsc --noEmit` | `tsc --noEmit` | `svelte-check --tsconfig ./tsconfig.json` | `tsc --noEmit` | `cargo check` | `mypy src` | `go vet ./...` |
| lint | `biome lint` | `biome lint` | `biome lint` | `biome lint` | `biome lint` | `biome lint` | `cargo clippy` | `ruff check` | `golangci-lint run` |
| format | `biome format --write` | `biome format --write` | `biome format --write` | `biome format --write` | `biome format --write` | `biome format --write` | `cargo fmt` | `ruff format` | `gofmt -w .` |
| test | `vitest run` | `vitest run` | `vitest run` | `vitest run` | `vitest run` | `vitest run` | `cargo nextest run` | `pytest` | `go test ./...` |
| scan | `ast-grep scan` | `ast-grep scan` | `ast-grep scan` | `ast-grep scan` | `ast-grep scan` | `ast-grep scan` | `cargo clippy --all-targets` | `ruff check` | `golangci-lint run` |
| check | `lint && typecheck && scan` | `lint && typecheck && scan` | `lint && typecheck && scan` | `lint && typecheck && scan` | `lint && typecheck && scan` | `lint && typecheck && scan` | `cargo clippy && cargo check` | `ruff check && mypy` | `golangci-lint run && go vet` |
| verify | `check && test` | `check && test` | `check && test` | `check && test` | `check && test` | `check && test` | `cargo clippy && cargo check && cargo nextest run` | `ruff check && mypy && pytest` | `golangci-lint run && go vet && go test` |
| ci | `verify && build` | `verify && build` | `verify && build` | `verify && build` | `verify && build` | `verify && build` | `cargo clippy && cargo check && cargo nextest run && cargo build` | `ruff check && mypy && pytest && python -m build` | `golangci-lint run && go vet && go test && go build .` |
| verify:full | `ci && test:integration && test:e2e` | `ci && test:integration && test:e2e` | `ci && test:integration && test:e2e` | `ci && test:integration && test:e2e` | `ci && test:integration && test:e2e` | `ci && test:integration && test:e2e` | `cargo clippy && cargo check && cargo nextest run && cargo nextest run --test-dir integration && cargo nextest run --test-dir e2e && cargo build` | `ruff check && mypy && pytest && pytest tests/integration && pytest tests/e2e && python -m build` | `golangci-lint run && go vet && go test ./... && go test ./tests/integration && go test ./tests/e2e && go build .` |

## Watch Mode Scripts

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| test:watch | `vitest` | `vitest` | `vitest` | `vitest` | `vitest` | `vitest` | `cargo nextest run --watch` | `pytest-watch` | `go test ./... -watch` |
| typecheck:watch | `tsc --noEmit --watch` | `nuxt typecheck --watch` | `tsc --noEmit --watch` | `tsc --noEmit --watch` | `svelte-check --watch --tsconfig ./tsconfig.json` | `tsc --noEmit --watch` | `cargo watch -x check` | - | - |
| build:watch | `bunup --watch` | `nuxt build --watch` | `next build --watch` | `vite build --watch` | `vite build --watch` | `tauri build --watch` | `cargo build --watch` | - | - |

## Testing Scripts

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| test:coverage | `vitest run --coverage` | `vitest run --coverage` | `vitest run --coverage` | `vitest run --coverage` | `vitest run --coverage` | `vitest run --coverage` | `cargo llvm-cov --html` | `pytest --cov` | `go test -coverprofile=coverage.out` |
| test:integration | `vitest run --config vitest.integration.config.ts` | `vitest run --config vitest.integration.config.ts` | `vitest run --config vitest.integration.config.ts` | `vitest run --config vitest.integration.config.ts` | `vitest run --config vitest.integration.config.ts` | `vitest run --config vitest.integration.config.ts` | `cargo nextest run --test-dir integration` | `pytest tests/integration` | `go test ./tests/integration` |
| test:e2e | `vitest run --config vitest.e2e.config.ts` | `vitest run --config vitest.e2e.config.ts` | `vitest run --config vitest.e2e.config.ts` | `vitest run --config vitest.e2e.config.ts` | `vitest run --config vitest.e2e.config.ts` | `vitest run --config vitest.e2e.config.ts` | `cargo nextest run --test-dir e2e` | `pytest tests/e2e` | `go test ./tests/e2e` |

## Dependency Management Scripts

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| clean | `bunx rimraf node_modules` | `bunx rimraf node_modules` | `bunx rimraf node_modules` | `bunx rimraf node_modules` | `bunx rimraf node_modules` | `bunx rimraf node_modules && cargo clean` | `cargo clean` | `rm -rf .venv __pycache__` | `go clean -modcache` |
| deps:analyze | `bunx depcheck` | `bunx depcheck` | `bunx depcheck` | `bunx depcheck` | `bunx depcheck` | `bunx depcheck` | `cargo outdated` | `pip-audit` | `go mod verify` |
| deps:update | `taze -r -w` | `taze -r -w` | `taze -r -w` | `taze -r -w` | `taze -r -w` | `taze -r -w` | `cargo update` | `pip install -U -r requirements.txt` | `go get -u ./... && go mod tidy` |

## Database Scripts

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| db:migrate | `bunx drizzle-kit push` | `bunx drizzle-kit push` | `bunx drizzle-kit push` | `bunx drizzle-kit push` | `bunx drizzle-kit push` | `bunx drizzle-kit push` | `diesel migration run` | `alembic upgrade head` | `go run ./migrate` |
| db:seed | `bunx drizzle-kit seed` | `bunx drizzle-kit seed` | `bunx drizzle-kit seed` | `bunx drizzle-kit seed` | `bunx drizzle-kit seed` | `bunx drizzle-kit seed` | - | `python seed.py` | `go run ./seed` |
| db:studio | `bunx drizzle-kit studio` | `bunx drizzle-kit studio` | `bunx drizzle-kit studio` | `bunx drizzle-kit studio` | `bunx drizzle-kit studio` | `bunx drizzle-kit studio` | - | - | - |
| db:generate | `bunx drizzle-kit generate` | `bunx drizzle-kit generate` | `bunx drizzle-kit generate` | `bunx drizzle-kit generate` | `bunx drizzle-kit generate` | `bunx drizzle-kit generate` | - | - | - |

## Release Scripts

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Rust | Python | Go |
|------|-----|------|---------|------------|----------|------|--------|----|
| prerelease | `bun run build` | `bun run build` | `bun run build` | `bun run build` | `bun run build` | `cargo build` | `python -m build` | `go build .` |
| bench:fn | `bunx mitata` | `bunx mitata` | `bunx mitata` | `bunx mitata` | `bunx mitata` | `cargo bench` | `pytest-benchmark` | `go test -bench=.` |
| bench:server | `bunx autocannon` | `bunx autocannon` | `bunx autocannon` | `bunx autocannon` | `bunx autocannon` | - | - | - |
| bench:memory | `bunx clinic` | `bunx clinic` | `bunx clinic` | `bunx clinic` | `bunx clinic` | - | `memory_profiler` | `pprof` |
| release | `auto-it` | `auto-it` | `auto-it` | `auto-it` | `auto-it` | `cargo release` | `python -m build && twine upload` | `go release` |

## Security Scripts

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Rust | Python | Go |
|------|-----|------|---------|------------|----------|------|--------|----|
| security | `bunx audit` | `bunx audit` | `bunx audit` | `bunx audit` | `bunx audit` | `cargo audit` | `pip-audit` | `go mod verify` |
| license | `bunx license-checker` | `bunx license-checker` | `bunx license-checker` | `bunx license-checker` | `bunx license-checker` | `cargo deny check licenses` | `pip-licenses` | `go-licenses check` |

## Deployment Scripts

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Rust | Python | Go |
|------|-----|------|---------|------------|----------|------|--------|----|
| predeploy | `bun run ci` | `bun run ci` | `bun run ci` | `bun run ci` | `bun run ci` | `cargo clippy && cargo check && cargo build` | `ruff check && mypy && pytest && python -m build` | `golangci-lint run && go vet && go test && go build .` |
| deploy:staging | `bunx wrangler deploy` | `bunx wrangler deploy` | `bunx vercel --prebuilt` | `bunx wrangler deploy` | `bunx wrangler deploy` | `cargo publish --dry-run` | `twine upload --repository testpypi` | `go release --dry-run` |

## Documentation Scripts

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Rust | Python | Go |
|------|-----|------|---------|------------|----------|------|--------|----|
| docs | `vitepress dev` | `vitepress dev` | `vitepress dev` | `vitepress dev` | `vitepress dev` | `mdbook serve` | `mkdocs serve` | `godoc` |

## Review CLI Scripts

ถ้า project ใช้ `tools/review-codebase` ให้เพิ่ม scripts นี้ใน `package.json` เมื่อตั้งค่า scripts ตาม `/follow-tasks`

| Task | Bun |
|------|-----|
| review-codebase | `bun --filter tools-review-codebase review-codebase` |
| review-codebase:json | `bun --filter tools-review-codebase review-codebase:json` |

หลังจากตั้งค่า scripts แล้ว ถ้า `tools/review-codebase` มีอยู่ใน workspace ให้รัน `bun run review-codebase` เพื่อ review codebase ครั้งแรก และใช้ `/update-review-codebase-cli-and-run` ถ้าต้องการสร้างหรืออัปเดต CLI
