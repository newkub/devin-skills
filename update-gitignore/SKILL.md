---
name: update-gitignore
description: Update .gitignore to fully cover the stack and artifacts used
argument-hint: "[scope]"
related:
  - follow-gitignore
  - follow-best-practice
  - suggest-next-action
  - update-references
  - deep-validate

---

## Goal

Update `.gitignore` in the root and workspaces to cover dependencies, build outputs, IDE, secrets, and environment artifacts

## Scope

Use for any project that needs its `.gitignore` improved

## Execute

### 1. Inspect Current

> Goal: Inspect the current `.gitignore`

1. Read the root `.gitignore`
2. Find `.gitignore` files in workspaces
3. Identify missing entries for the stack

### 2. Determine Stack

> Goal: Identify the artifacts to ignore

1. Read `package.json` for the package manager (bun, node)
2. Read configs for build tools (vite, tauri, rust, vitepress)
3. Read tooling (moon, turbo, lefthook, ast-grep)

### 3. Update Root .gitignore

> Goal: Update the root `.gitignore`

1. Add `node_modules`, `dist`, `.output`, `coverage`, `target`, `.turbo`, `.moon/cache`
2. Add `.env`, `.env.*` except `.env.example`
3. Add IDE files (`.vscode/` if you do not want to share it, `.idea/`)
4. Add unused lock files (if using bun, ignore `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`)
5. Add OS files (`.DS_Store`, `Thumbs.db`)
6. Add `.devin/temp/` — Devin CLI temp artifacts (`.devin/temp/plan/`, `.devin/temp/report/`, and others); never commit

### 4. Update Workspace .gitignore

> Goal: Update the workspace-specific `.gitignore`

1. Check whether the workspace has any special build output
2. Add entries for the workspace's stack
3. Avoid duplicating the root

### 5. Validate

> Goal: Verify correctness

1. Run `git status` to confirm no files that should be ignored are shown
2. Run `git check-ignore` against sample files
3. Run `/deep-validate` to verify

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

- Use /follow-gitignore if needed
- Use /follow-best-practice if needed
- Use /suggest-next-action if needed
- Use /update-references if needed

## Expected Outcome

- `.gitignore` covers the stack in use
- No more than 250 lines (if longer, split into workspace-specific files)
- `git status` does not show artifacts that should not be committed
- `.devin/temp/` (plan/report artifacts) is always ignored
