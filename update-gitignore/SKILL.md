---
name: update-gitignore
description: Update .gitignore to fully cover the stack and artifacts used
argument-hint: "[scope]"
related:
  - follow-best-practice
  - suggest-next-action
  - update-references
  - deep-validate

---

## Goal

Update `.gitignore` in the root and workspaces to cover dependencies, build outputs, IDE, secrets, and environment artifacts — distributing patterns between root and workspace by responsibility (merged from `/follow-gitignore`)

## Scope

Use for any project that needs its `.gitignore` improved

## Execute

### 1. Inspect Current

> Goal: Inspect the current `.gitignore`

1. Find every `.gitignore` in the project (root + workspaces + subdirectories) and read them all
2. If there is no root `.gitignore` → start fresh
3. Identify missing entries for the stack

### 2. Determine Stack

> Goal: Identify the artifacts to ignore

1. Read `package.json` for the package manager (bun, node)
2. Read configs for build tools (vite, tauri, rust, vitepress)
3. Read tooling (moon, turbo, lefthook, ast-grep)

### 3. Update Root .gitignore

> Goal: put shared patterns in the root `.gitignore`

1. Shared patterns (used by several workspaces) go to the root: `node_modules`, `dist`, `.output`, `coverage`, `target`, `.turbo`, `.moon/cache`
2. Add `.env`, `.env.*` except `.env.example`
3. Add IDE files (`.vscode/` if you do not want to share it, `.idea/`)
4. Add unused lock files (if using bun, ignore `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`)
5. Add OS files (`.DS_Store`, `Thumbs.db`)
6. Add `.devin/temp/` — Devin CLI temp artifacts (`.devin/temp/plan/`, `.devin/temp/report/`, and others); never commit
7. For a monorepo, use recursive patterns at the root (e.g. `apps/*/node_modules/`, `apps/*/bun.lock`)

### 4. Update Workspace .gitignore

> Goal: keep only workspace-specific patterns in each workspace `.gitignore`

1. Check whether the workspace has any special build output (framework outputs, generated files, platform artifacts)
2. Workspace-specific patterns (used by one workspace only) go to its own `.gitignore` — distribute via `/relocation` when files move
3. Avoid duplicating the root — if the root already covers a pattern, do not repeat it in the workspace
4. If a workspace has no specific patterns → do not create a `.gitignore` for it

### 5. Validate

> Goal: Verify correctness

1. Run `git status` to confirm no files that should be ignored are shown
2. Run `git check-ignore` against sample files
3. Verify no duplicate patterns between root and workspaces
4. Run `/deep-validate` to verify

## Rules

### 1. Safety

- Do not delete existing entries unless the user confirms
- Do not ignore config files that must be committed
- Do not ignore source files

### 2. Stack-Aware

- For Bun, ignore `bun.lockb` if present
- For Moonrepo, ignore `.moon/cache`
- For Rust/Tauri, ignore `target/`, `pkg/`, `gen/`
- For VitePress, ignore `.vitepress/dist`, `.vitepress/cache`
- For the Devin CLI, always ignore `.devin/temp/` (plan/report artifacts — created by `/create-plan-in-dot-devin` and `/report`)

### 3. Consistency

- Keep the same pattern between the root and workspaces
- Order the categories: dependencies > build > IDE > secrets > OS

### 4. Common Patterns

Add only patterns for tools the project really uses (check manifests first):

- Dependencies: `node_modules/`, `.pnp`, `.pnp.js`
- Build: `dist/`, `build/`, `.output/`, `*.tsbuildinfo`
- Build Tools: `.turbo/`, `.vite/`, `.swc/`, `.vinxi/`, `.solid/`
- Linter Cache: `.eslintcache`, `.prettiercache`, `.biome/`, `.oxlint/`
- Testing: `coverage/`, `test-results/`, `playwright-report/`
- Environment: `.env*`, `!.env.example`, `.dev.vars`, `*.local`
- Logs: `*.log`, `logs/`
- OS: `.DS_Store`, `Thumbs.db`, `desktop.ini`
- Temporary: `*.tmp`, `*.temp`, `.cache/`
- IDE: `.vscode/`, `.idea/`, `*.sublime-*`, `*.swp`, `*.swo`

- Use /follow-best-practice if needed
- Use /suggest-next-action if needed
- Use /update-references if needed

## Expected Outcome

- `.gitignore` covers the stack in use
- Root holds shared patterns only; each workspace with specific patterns has its own `.gitignore`; no duplication between them
- No more than 250 lines (if longer, split into workspace-specific files)
- `git status` does not show artifacts that should not be committed
- `.devin/temp/` (plan/report artifacts) is always ignored
