---
name: follow-tool-viteplus
description: Use Vite+ (vp) as the unified Vite toolchain for web projects
argument-hint: "[scope]"
related:
  - follow-tool-vite
  - follow-tool-vitest
  - follow-tool-tsdown
  - follow-tool-rolldown
  - follow-tool-formatter
  - follow-tool-linter
  - follow-tool-biome
  - follow-tool-eslint
  - run-check
  - run-dev
  - run-build
  - run-test
  - run-verify
---

## Goal

Run a web project through the single `vp` toolchain — Vite dev/build, Vitest, tsdown packaging, Oxlint, Oxfmt, and Vite Task — configured from one `vite.config.ts`

## Scope

Use when a repository adopts Vite+ (`vite-plus` / `vp`) as its unified web toolchain, or when migrating an existing Vite project onto it

- Boundary: Vite+ orchestrates bundled tools; tool depth stays with the owner skills — raw Vite config/plugins → `/follow-tool-vite`, test authoring → `/follow-tool-vitest`, bundler internals → `/follow-tool-rolldown`, pack options beyond the `pack` block → `/follow-tool-tsdown`, lint rules → `/follow-tool-linter` (`/follow-tool-eslint`, `/follow-tool-biome`), format edge cases → `/follow-tool-formatter`
- Non-Vite projects (Bun-only scripts, Rust, backend services) stay on their own runners — Vite+ only owns the web app toolchain
- Requirements: Vite 7+ and Vitest 4+ before `vp migrate`; Vitest 5 under `vp test` needs Node `^22.18.0 || ^24.11.0 || >=26.0.0`; `vp pack --exe` needs Node 25.7+; `vp staged` needs Node 22.22.1+/24.11+ and Git 2.32+
- Latest: run `vp --version` — no version pin in this skill
- References: [cli](references/cli.md) | [best practices](best-practices/viteplus.md) | [use cases](usecases/)

## Execute

### 1. Detect Vite+

> Goal: confirm the project is (or should become) a Vite+ project

1. Treat the project as Vite+ when any of these hold: `vite-plus` in `devDependencies`, `vp` in `package.json` scripts, `.vite-hooks/`, or `vite.config.ts` with `fmt`/`lint`/`check`/`test`/`pack`/`run`/`staged` blocks
2. Plain Vite project → `/follow-tool-vite`; migrate only when the user wants one toolchain for Vite, tests, packing, lint, and format
3. Check Node with `node -v` against the requirements in `## Scope`
4. Check the package manager: `packageManager`, `devEngines.packageManager`, workspace/lockfiles, then `bunfig.toml` — `vp` detects it automatically

### 2. Install

> Goal: make `vp` available globally or per project

1. Global CLI: Windows `irm https://vite.plus/ps1 | iex`; macOS/Linux `curl -fsSL https://vite.plus | bash`
2. Project-local: add `vite-plus` as a devDependency, then call `vp` from `node_modules/.bin/vp` (or the package manager's exec)
3. CI: use `setup-vp` in the workflow before install/build steps
4. Verify with `vp --version` and `vp toolchain` (shows the bundled Vite, Vitest, Oxlint, Oxfmt, tsdown versions)

### 3. Configure One File

> Goal: consolidate `vite.config.ts`

1. Keep normal Vite blocks (`server`, `build`, `preview`) as-is
2. Add Vite+ blocks as needed: `create`, `run`, `fmt`, `lint`, `check`, `test`, `pack`, `staged`
3. Format options live in `fmt` (Oxfmt keys: `printWidth`, `singleQuote`, `semi`, `ignorePatterns`, `sortPackageJson`, plus `fmt.overrides` for per-package settings)
4. Lint options live in `lint`; enable type-aware checking with `lint: { options: { typeAware: true, typeCheck: true } }`
5. `check: { fmt: false }` / `check: { lint: false }` skips a step for every `vp check` run; standalone `vp fmt` / `vp lint` are unaffected
6. Set `defaultPackage` when the web app lives in a subdirectory — `vp dev`/`build`/`preview`/`pack` at the root then target it
7. Nested format/lint configs are ignored in Vite+ mode — a package cannot override root rules; use `fmt.overrides` instead

### 4. Daily Commands

> Goal: use the right command per task

| Task | Command | Notes |
|---|---|---|
| create a project | `vp create` | scaffolding defaults from the `create` block |
| install dependencies | `vp install` | auto-detects the package manager; `--frozen-lockfile`, `--filter`, `-w` |
| dev server | `vp dev` | built-in Vite dev server |
| production build | `vp build` | built-in Vite build |
| preview build | `vp preview` | built-in preview server |
| static checks | `vp check` | Oxfmt + Oxlint + optional type-aware check |
| format only | `vp fmt` | Oxfmt |
| lint only | `vp lint` | Oxlint |
| tests | `vp test` | Vitest 5; `vp test watch` for watch mode |
| package a library | `vp pack` | tsdown; `--watch`, `--exe` |
| run a task graph | `vp run <task>` | Vite Task; `vpr` is the short alias |
| one-off binary | `vp vpx <pkg>` | like `npx` inside the toolchain |
| staged-file gate | `vp staged` | lint-staged 17 |
| toolchain info | `vp toolchain` | versions of bundled tools |
| update / remove `vp` | `vp upgrade` / `vp implode` | implode removes the global install |

Runner mapping: `/run-dev` → `vp dev`, `/run-build` → `vp build`, `/run-test` → `vp test`, `/run-check` → `vp check`; `/run-verify` keeps the whole gate and `/run-typecheck` stays the `tsc` authority, since `vp check` type-checks only when enabled

### 5. Static Checks

> Goal: one command for format + lint + types

1. Enable `typeAware` and `typeCheck` in `lint.options` so `vp check` includes TypeScript checks
2. Local: `vp check --fix`; CI: `vp check` (add `--deny-warnings` to fail on lint warnings)
3. Narrow a run with `--no-fmt` (lint + type-check) or `--no-fmt --no-lint` (type-check only)
4. Keep `vp check` wired into `/run-check` detection — when `vite-plus` is present, prefer it over separate biome/eslint/prettier/tsc invocations

### 6. Tests

> Goal: run Vitest through Vite+

1. Import test APIs from `vite-plus/test` (`import { describe, it, expect } from 'vite-plus/test'`)
2. Configure Vitest in the `test` block of `vite.config.ts` — do not add a separate `vitest.config.ts`
3. `vp test` runs once by default; `vp test watch` watches
4. `vp test` executes on Node — Bun-only APIs are not available inside these tests

### 7. Library Packing

> Goal: replace a standalone bundler config with the `pack` block

1. Move tsdown options into `pack` (`entry`, `format`, `dts`, `sourcemap`, `clean`)
2. `vp pack` builds; `vp pack --watch` watches
3. `--exe` emits a standalone executable (Node 25.7+)

### 8. Task Graph And Hooks

> Goal: replace turbo/moon task config and git hook tooling

1. Define workspace tasks in the `run` block (Vite Task `dependsOn`, `-r`, `-t`, `--filter`, `-w`, cache)
2. `vp run dev` runs a `package.json` script; `vp dev` runs the built-in Vite server — do not confuse them
3. `package.json` scripts run uncached unless `--cache` is passed
4. Enable hooks with `vp hooks enable`; `vp staged` runs the `staged` block (`staged: { '*': 'vp check --fix' }`)

### 9. Migration

> Goal: move a Vite project onto Vite+ without behavior change

1. Read the recipe in [usecases/migrate-existing-vite-project.md](usecases/migrate-existing-vite-project.md)
2. Prerequisites: Vite 7+ and Vitest 4+, clean working tree, green baseline test run
3. Run `vp migrate` (`--no-interactive` in CI); `--full` also migrates framework shims, tsconfig `baseUrl`, and editor settings
4. Rewrite imports to `vite-plus` / `vite-plus/test`; alias the Vite core package per the migration output
5. Delete the config files the single `vite.config.ts` now owns, then compare `vp check` / `vp test` / `vp build` output against the baseline

### 10. Editor

> Goal: one formatter/linter in the editor

1. Install the Vite Plus Extension Pack (`VoidZero.vite-plus-extension-pack`) — Oxc formatter/linter + Vitest
2. `.vscode/settings.json`: `"editor.defaultFormatter": "oxc.oxc-vscode"`, `"oxc.disableNestedConfig": true`, `"oxc.fmt.disableNestedConfig": true`, `"editor.formatOnSaveMode": "file"`, `"source.fixAll.oxc": "explicit"`
3. Zed: `oxc-zed` with `fmt.configPath: "./vite.config.ts"`
4. JetBrains: Oxc plugin

### Use Cases

| Scenario | Use case |
|----------|----------|
| Migrate an existing Vite project to Vite+ | `usecases/migrate-existing-vite-project.md` |

## Rules

### 1. One Config, One Stack

- `vite.config.ts` is the only config for Vite, Vitest, tsdown, Oxlint, Oxfmt, and tasks in a Vite+ project
- Never keep a second formatter or linter active next to `vp fmt`/`vp lint` — Oxfmt and Oxlint own style and rules
- Root blocks win; per-package overrides only through `fmt.overrides`

### 2. Correct Command Choice

- `vp dev`/`build`/`preview` are built-in Vite commands; `vp run <script>` runs package scripts through Vite Task
- `vp test` is not `vitest` — test imports come from `vite-plus/test`
- `vp pack` is tsdown with the `pack` block; do not also run a separate bundler config

### 3. Accurate Validation Claims

- `vp check` only type-checks when `lint.options.typeAware` and `lint.options.typeCheck` are both true — otherwise it is format + lint
- Tests run on Node, not Bun; keep Node available in CI even for Bun projects
- `vp check --fix` changes files — run it before `/run-check`, not inside a CI check that expects a clean tree

### 4. Migration Safety

- Migrate only from a clean tree with a passing baseline
- Delete legacy tool configs only after `vp check`, `vp test`, and `vp build` match the baseline
- Keep the migration diff mechanical; behavior changes belong in separate commits

### 5. Environment

- Let `vp env`/`vp toolchain` manage the Node choice — do not mix in another version manager for the same project
- Pin nothing globally; run `vp --version` when behavior looks version-dependent
- Use `setup-vp` in CI instead of curling the installer per job

## References

- [CLI reference](references/cli.md)
- [Vite+ — Best Practices](best-practices/viteplus.md)
- [Migrate an existing Vite project](usecases/migrate-existing-vite-project.md)

## Expected Outcome

- `vp` installed and version verified
- One `vite.config.ts` owning Vite, test, pack, lint, format, task, and staged config
- `vp check`, `vp test`, `vp build`, and `vp pack` passing
- Editor using Oxc as the single formatter/linter
- No leftover duplicate tool configs
