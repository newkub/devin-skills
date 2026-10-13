---
name: follow-config
description: Manage and validate project config files to match conventions
argument-hint: "[config-type-or-file]"
allowed-tools:
  - read
  - write
  - edit
  - grep
  - find_file_by_name
  - exec
  - skill
  - ask_user_question
  - report
  - suggest-next-action
  - resolve-errors
triggers:
  - user
  - model
related:
  - update-config
  - update-dot-devin
  - setup-cicd
  - deep-review
  - follow-agents-md
  - update-references
  - deep-validate
  - resolve-errors

---

## Goal

Inspect, sync, and validate project config files so they stay consistent with project conventions and the tech stack

## Scope

Apply to common project config files such as `.devin/`, `.vscode/`, `.github/`, `package.json`, `turbo.json`, `moon.yml`, `wrangler.toml`, `playwright.config.*`, including CI/CD config and tooling configs

See also: /update-config, /update-dot-devin, /setup-cicd, /deep-review, /follow-agents-md, /deep-validate

## Execute

### 1. Identify Configs

> Goal: Identify the relevant config files

1. Find config files with `/find_file_by_name` in these areas:
   - project root
   - `.devin/`
   - `.vscode/`
   - `.github/`
   - `packages/*/` (monorepo)
2. Read `package.json` and `AGENTS.md` to understand the conventions
3. Identify the tech stack from dependencies

### 2. Check Conventions

> Goal: Check that config files match the conventions

1. Verify the expected config file names and locations
2. Check shared settings: root `package.json`, `tsconfig.json`, `biome.json`, `eslint.config.*`
3. Check workspace overrides: `turbo.json`, `moon.yml`, `pnpm-workspace.yaml`
4. Check CI/CD: `.github/workflows/`, `.gitlab-ci.yml`
5. Check project rules: `rules/` (ast-grep), `sgconfig.yml`, `AGENTS.md`

### 3. Sync Configs

> Goal: Make all configs consistent with each other

1. If root changed → sync down to workspaces
2. If a workspace changed → sync up to root when needed
3. Update `AGENTS.md` if conventions changed
4. Use `/update-references` when config references change

### 4. Validate Configs

> Goal: Confirm the configs work

1. Run `bun run lint`, `bun run typecheck`, or the relevant command
2. Run `bun run build` if needed
3. Check config file schemas where they exist, e.g. `wrangler.toml`, `turbo.json`
4. If it fails → run `/resolve-errors` then retry (max 3)

### 5. Report

> Goal: Summarize results

1. Run `/report` showing the config files checked, status, and changes
2. Run `/report` summarizing findings and next actions
3. Run `/suggest-next-action`

### Workflows

> Goal: dispatch specialized config domains to more detailed workflows

| Topic | Workflow |
|-------|----------|
| `.env` patterns, validation, secrets handling | `workflows/config-env/SKILL.md` |
| `.gitignore` patterns per ecosystem | `workflows/config-gitignore/SKILL.md` |
| `.vscode` settings, extensions, tasks | `workflows/config-vscode/SKILL.md` |

## Rules

### 1. Config Types

- Project root: `package.json`, `tsconfig.json`, `biome.json`, `eslint.config.*`, `.gitignore`
- Devin: `.devin/`, `AGENTS.md`
- IDE: `.vscode/settings.json`, `.vscode/extensions.json`, `.vscode/launch.json`
- CI/CD: `.github/workflows/`, `.gitlab-ci.yml`
- Deployment: `wrangler.toml`, `netlify.toml`, `vercel.json`
- Testing: `playwright.config.*`, `vitest.config.*`, `jest.config.*`

### 2. Sync Rules

- Root config is the source of truth unless stated otherwise
- Workspaces may override, but only with a reason
- Never copy secrets or environment-specific values into committed config
- Use `/update-references` when a config path or name changes

### 3. Safety

- Never delete or overwrite old config without a backup or dry run
- If a config contains sensitive data → stop and ask the user
- Run git diff before committing config changes

## Expected Outcome

- All config files are consistent with each other
- No config drift between root and workspaces
- Project conventions are recorded in `AGENTS.md` or `rules/` (ast-grep)
- Lint, typecheck, and build pass with no config-related errors
