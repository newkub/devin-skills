---
title: Package Scripts by Tech Stack
description: Script command lookup tables for Minimal, Standard, and Complete templates across stacks
---

# Package Scripts by Tech Stack

For more `package.json` examples see [package-json-examples.md](package-json-examples.md)

## Script Mechanism

`Cargo.toml`, Python, and Go **have no built-in script runner** — use a task runner instead:

| Ecosystem | Mechanism |
|-----------|-----------|
| Rust | `justfile` (`just`), `cargo-make` (`makers`), or `cargo-xtask` — never put scripts in `Cargo.toml` |
| Python | `Makefile`, `justfile`, `poe` (poethepoet), or `nox`/`tox` sessions |
| Go | `Makefile`, `justfile`, or `Taskfile.yml` (go-task) |
| JS/Bun | `package.json` scripts directly |

## Bun-Native Alternatives

Bun 1.4 has built-in commands that can replace external tools — use when the project doesn't want a vitest/biome stack:

| Task | Bun-Native |
|------|-----------|
| test | `bun test` (or `bun test --coverage` for coverage) |
| security | `bun audit` (has `bun audit fix`) |
| CI install | `bun ci` (frozen lockfile, equivalent of `npm ci`) |
| format | `bun fmt` (`--check` to verify without writing, `--no-script` when a `fmt` script shadows the built-in) — formats JS/TS, CSS, HTML/Vue/Svelte, JSON/YAML/TOML, Markdown, GraphQL; never lints |
| Monorepo tasks | `bun run --workspaces <script>` or `bun --filter '<name>' <script>` |

## Required Scripts

The baseline scripts every project must have to guarantee code quality:

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| prepare (Root Only) | `bunx taze -r -w && bunx lefthook install` | `bunx taze -r -w && bunx lefthook install` | `bunx taze -r -w && bunx lefthook install` | `bunx taze -r -w && bunx lefthook install` | `bunx taze -r -w && bunx lefthook install` | `bunx taze -r -w && bunx lefthook install` | `cargo update && bunx lefthook install` | `pip install -U -r requirements.txt && pre-commit install` | `go mod download && go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest` |
| prepare (Workspace) | - | - | - | - | - | - | - | - | - |
| dev | `bun run src/index.ts` | `nuxi dev` | `next dev` | `vite dev` | `vite dev` | `tauri dev` | `cargo run` | `python -m app` | `go run .` |
| build | `bun build` | `nuxi build` | `next build` | `vite build` | `vite build` | `tauri build` | `cargo build` | `python -m build` | `go build .` |
| typecheck | `bun check` | `nuxi typecheck` | `tsc --noEmit` | `tsc --noEmit` | `svelte-check --tsconfig ./tsconfig.json` | `tsc --noEmit` | `cargo check` | `mypy src` | `go vet ./...` |
| lint | `biome lint` | `biome lint` | `biome lint` | `biome lint` | `biome lint` | `biome lint` | `cargo clippy` | `ruff check` | `golangci-lint run` |
| format | `bun fmt` | `biome format --write` | `biome format --write` | `biome format --write` | `biome format --write` | `biome format --write` | `cargo fmt` | `ruff format` | `gofmt -w .` |
| format:check | `bun fmt --check` | `biome ci` | `biome ci` | `biome ci` | `biome ci` | `biome ci` | `cargo fmt --check` | `ruff format --check` | `test -z "$(gofmt -l .)"` |
| test | `vitest run` | `vitest run` | `vitest run` | `vitest run` | `vitest run` | `vitest run` | `cargo nextest run` | `pytest` | `go test ./...` |
| scan | `ast-grep scan` | `ast-grep scan` | `ast-grep scan` | `ast-grep scan` | `ast-grep scan` | `ast-grep scan` | `cargo clippy --all-targets` | `ruff check` | `golangci-lint run` |
| check | `format && lint && typecheck && scan` | `format && lint && typecheck && scan` | `format && lint && typecheck && scan` | `format && lint && typecheck && scan` | `format && lint && typecheck && scan` | `format && lint && typecheck && scan` | `cargo fmt && cargo clippy && cargo check` | `ruff format && ruff check && mypy src` | `gofmt -w . && golangci-lint run && go vet ./...` |
| verify | `check && test && build` | `check && test && build` | `check && test && build` | `check && test && build` | `check && test && build` | `check && test && build` | `cargo fmt && cargo clippy && cargo check && cargo nextest run && cargo build` | `ruff format && ruff check && mypy src && pytest && python -m build` | `gofmt -w . && golangci-lint run && go vet ./... && go test ./... && go build .` |
| ci | `format:check && lint && typecheck && scan && test && build` | `format:check && lint && typecheck && scan && test && build` | `format:check && lint && typecheck && scan && test && build` | `format:check && lint && typecheck && scan && test && build` | `format:check && lint && typecheck && scan && test && build` | `format:check && lint && typecheck && scan && test && build` | `cargo fmt --check && cargo clippy && cargo check && cargo nextest run && cargo build` | `ruff format --check && ruff check && mypy src && pytest && python -m build` | `test -z "$(gofmt -l .)" && golangci-lint run && go vet ./... && go test ./... && go build .` |
| verify:full | `ci && test:integration && test:e2e` | `ci && test:integration && test:e2e` | `ci && test:integration && test:e2e` | `ci && test:integration && test:e2e` | `ci && test:integration && test:e2e` | `ci && test:integration && test:e2e` | `ci && cargo nextest run --test-dir integration && cargo nextest run --test-dir e2e` | `ci && pytest tests/integration && pytest tests/e2e` | `ci && go test ./tests/integration/... && go test ./tests/e2e/...` |

`check` uses `format` (write) for local dev — `ci` uses `format:check` (read-only) so files aren't mutated in the pipeline

## Watch Mode Scripts

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| test:watch | `vitest` | `vitest` | `vitest` | `vitest` | `vitest` | `vitest` | `cargo watch -x "nextest run"` | `pytest-watch` | `gotestsum --watch` |
| typecheck:watch | `bun run --watch typecheck` | `nuxi typecheck --watch` | `tsc --noEmit --watch` | `tsc --noEmit --watch` | `svelte-check --watch --tsconfig ./tsconfig.json` | `tsc --noEmit --watch` | `cargo watch -x check` | - | - |
| build:watch | `bunup --watch` | `nuxi build --watch` | `next build --watch` | `vite build --watch` | `vite build --watch` | `tauri build --watch` | `cargo watch -x build` | - | - |

## Testing Scripts

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| test:coverage | `vitest run --coverage` | `vitest run --coverage` | `vitest run --coverage` | `vitest run --coverage` | `vitest run --coverage` | `vitest run --coverage` | `cargo llvm-cov --html` | `pytest --cov` | `go test -coverprofile=coverage.out ./...` |
| test:integration | `vitest run --config vitest.integration.config.ts` | `vitest run --config vitest.integration.config.ts` | `vitest run --config vitest.integration.config.ts` | `vitest run --config vitest.integration.config.ts` | `vitest run --config vitest.integration.config.ts` | `vitest run --config vitest.integration.config.ts` | `cargo nextest run --test-dir integration` | `pytest tests/integration` | `go test ./tests/integration/...` |
| test:e2e | `vitest run --config vitest.e2e.config.ts` | `vitest run --config vitest.e2e.config.ts` | `vitest run --config vitest.e2e.config.ts` | `vitest run --config vitest.e2e.config.ts` | `vitest run --config vitest.e2e.config.ts` | `vitest run --config vitest.e2e.config.ts` | `cargo nextest run --test-dir e2e` | `pytest tests/e2e` | `go test ./tests/e2e/...` |

## Dependency Management Scripts

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| clean | `bunx rimraf node_modules` | `bunx rimraf node_modules` | `bunx rimraf node_modules` | `bunx rimraf node_modules` | `bunx rimraf node_modules` | `bunx rimraf node_modules && cargo clean` | `cargo clean` | `rm -rf .venv __pycache__` | `go clean -modcache` |
| deps:analyze | `bunx depcheck` | `bunx depcheck` | `bunx depcheck` | `bunx depcheck` | `bunx depcheck` | `bunx depcheck` | `cargo outdated` | `pip-audit` | `go mod verify` |
| deps:update | `taze -r -w -i` | `taze -r -w -i` | `taze -r -w -i` | `taze -r -w -i` | `taze -r -w -i` | `taze -r -w -i` | `cargo update` | `pip install -U -r requirements.txt` | `go get -u ./... && go mod tidy` |

`deps:update` may use `-i` (interactive) because it's run manually — `prepare` must never use `-i` or it hangs in CI

## Database Scripts

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| db:migrate | `bunx drizzle-kit push` | `bunx drizzle-kit push` | `bunx drizzle-kit push` | `bunx drizzle-kit push` | `bunx drizzle-kit push` | `bunx drizzle-kit push` | `diesel migration run` | `alembic upgrade head` | `go run ./scripts/migrate` |
| db:seed | `bunx tsx scripts/seed.ts` | `bunx tsx scripts/seed.ts` | `bunx tsx scripts/seed.ts` | `bunx tsx scripts/seed.ts` | `bunx tsx scripts/seed.ts` | `bunx tsx scripts/seed.ts` | - | `python scripts/seed.py` | `go run ./scripts/seed` |
| db:studio | `bunx drizzle-kit studio` | `bunx drizzle-kit studio` | `bunx drizzle-kit studio` | `bunx drizzle-kit studio` | `bunx drizzle-kit studio` | `bunx drizzle-kit studio` | - | - | - |
| db:generate | `bunx drizzle-kit generate` | `bunx drizzle-kit generate` | `bunx drizzle-kit generate` | `bunx drizzle-kit generate` | `bunx drizzle-kit generate` | `bunx drizzle-kit generate` | - | - | - |

## Prerelease And Benchmark Scripts

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| prerelease | `bun run build` | `bun run build` | `bun run build` | `bun run build` | `bun run build` | `tauri build` | `cargo build` | `python -m build` | `go build .` |
| bench:fn | `bunx mitata` | `bunx mitata` | `bunx mitata` | `bunx mitata` | `bunx mitata` | `bunx mitata` | `cargo bench` | `pytest-benchmark` | `go test -bench=. ./...` |
| bench:server | `bunx autocannon` | `bunx autocannon` | `bunx autocannon` | `bunx autocannon` | `bunx autocannon` | `bunx autocannon` | - | - | - |
| bench:memory | `bunx clinic` | `bunx clinic` | `bunx clinic` | `bunx clinic` | `bunx clinic` | `bunx clinic` | - | `memory_profiler` | `pprof` |

- `release` doesn't belong in the package manifest — release via CI/CD workflow on a tag or `/run-release`

## Security Scripts

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| security | `bun audit` | `bun audit` | `bun audit` | `bun audit` | `bun audit` | `bun audit` | `cargo audit` | `pip-audit` | `go mod verify` |
| license | `bunx license-checker` | `bunx license-checker` | `bunx license-checker` | `bunx license-checker` | `bunx license-checker` | `bunx license-checker` | `cargo deny check licenses` | `pip-licenses` | `go-licenses check` |

## Deployment Scripts

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| predeploy | `bun run ci` | `bun run ci` | `bun run ci` | `bun run ci` | `bun run ci` | `bun run ci` | `cargo clippy && cargo check && cargo build` | `ruff check && mypy src && pytest && python -m build` | `golangci-lint run && go vet ./... && go test ./... && go build .` |
| deploy:staging | `bunx wrangler deploy` | `bunx wrangler deploy` | `bunx vercel --prebuilt` | `bunx wrangler deploy` | `bunx wrangler deploy` | - | `cargo publish --dry-run` | `twine upload --repository testpypi` | `goreleaser release --snapshot` |

## Documentation Scripts

| Task | Bun | Nuxt | Next.js | Solid Start | SvelteKit | Tauri | Rust | Python | Go |
|------|-----|------|---------|------------|----------|-------|------|--------|----|
| docs | `vitepress dev` | `vitepress dev` | `vitepress dev` | `vitepress dev` | `vitepress dev` | `vitepress dev` | `mdbook serve` | `mkdocs serve` | `godoc` |

Use only for projects with a docs site — not required

## Secrets Scripts (Infisical)

Add to the root `package.json` when the project uses `.infisical.json` / a secret manager:

| Task | Command |
|------|---------|
| secrets:dev | `infisical run -- bun run dev` |
| secrets:build | `infisical run -- bun run build` |
| secrets:export | `infisical export > .env` |
| secrets:run | `infisical run -- <command>` |

## Monorepo Scripts (Bun Workspaces)

Add to the root `package.json` to run across every workspace:

| Task | Command |
|------|---------|
| check:all | `bun run --workspaces check` |
| test:all | `bun run --workspaces test` |
| build:all | `bun run --workspaces build` |
| `<script>` scoped | `bun --filter '<workspace-name>' <script>` |

## Review CLI Scripts

If the project uses a root `review/` CLI:

| Task | Bun |
|------|-----|
| review | `bun run review` |
| review:json | `bun run review:json` |

## Other Ecosystems

Coverage for languages that have a `follow-lang-*` skill but no column above — Minimal level only:

| Task | Kotlin (Gradle) | PHP (Composer) | Swift (SPM) | Zig | Lua | C# (.NET) |
|------|-----------------|----------------|-------------|-----|-----|-----------|
| dev | `./gradlew run` | `php -S localhost:8000` | `swift run` | `zig build run` | `lua src/main.lua` | `dotnet run` |
| build | `./gradlew build` | - | `swift build` | `zig build` | - | `dotnet build` |
| typecheck | `./gradlew check` | `php -l` | `swiftc -typecheck` | `zig build --verbose` | `luac -p` | `dotnet build` |
| lint | `./gradlew ktlintCheck` | `phpcs` | `swiftlint` | `zig fmt --check` | `luacheck .` | `dotnet format --verify-no-changes` |
| format | `./gradlew ktlintFormat` | `phpcbf` | `swift-format format -i -r .` | `zig fmt .` | `stylua .` | `dotnet format` |
| test | `./gradlew test` | `phpunit` | `swift test` | `zig build test` | `busted` | `dotnet test` |
| scan | `./gradlew detekt` | `psalm` | - | - | - | - |
