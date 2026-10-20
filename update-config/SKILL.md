---
name: update-config
description: Update project config to be complete, consistent, duplication-free via a shared config/dep catalog
argument-hint: "[path]"
related:
  - deep-review-codebase
  - report-config-files
  - follow-devin-global-skills
  - follow-tool-mise
  - follow-tool-moonrepo
  - update-project
  - update-dot-devin
  - refactor
  - update-gitignore
  - research-setup-integrations
  - deep-validate
  - follow-default-config
  - report-idea-cleanup-files-in-computer

---

## Goal

Update the project configuration so it is complete and consistent, reduce duplication, and use a shared config / dependencies catalog wherever possible

## Scope

- Applies to the root project or any workspace
- Covers package manifests, tool configs, monorepo setup, CI/CD, editor, env, git
- Run `/deep-review-codebase` first to get findings
- If it is a monorepo → use `/follow-tool-moonrepo`

## Execute

### 1. Review Current Config

> Goal: Understand the current config state

1. Run `/deep-review-codebase` to collect findings
2. Record a priority list from the severities
3. Identify the configs to create, delete, or refactor
4. If the project has no `rules/` + `sgconfig.yml` or `AGENTS.md` yet → run `/update-astgrep-rules` and `/update-agents-md`

### 2. Plan Shared Config Strategy

> Goal: Choose how to consolidate the config

1. Monorepo with moonrepo:
   - Run `/follow-tool-moonrepo` to check `.moon/workspace.yml`, `.moon/toolchains.yml`, `.moon/tasks/*.yml`
   - Create/update `tsconfig.base.json` or `tsconfig.options.json`, then have each workspace `extends` it
   - Use `.moon/tasks/*.yml` for shared tasks (build, lint, test, typecheck, scan)
   - Reference the main tasks from `moon.yml` in each project
2. Monorepo with pnpm workspace:
   - Check whether `pnpm-workspace.yaml` has `catalogs:`
   - Move shared dependencies into `pnpm-workspace.yaml` catalogs or the `catalog:` field
   - Use `catalog:` in `package.json` instead of version numbers
   - Create a root `tsconfig.base.json` that every package `extends`
   - Create a root `eslint.config.js` (flat config — `.eslintrc` was removed in ESLint 10) and `prettier.config.js`
3. Monorepo with bun workspace:
   - Check `bun-workspace.toml` or the `workspaces` field in `package.json`
   - Use `bun.catalogs` (if available) or root `package.json` `overrides`
   - Create `bunfig.toml` for shared install config
   - Create `tsconfig.base.json` for the workspaces to `extends`
4. Single project:
   - Check whether `tsconfig.json`, `eslint.config.*`, `prettier.config.*` use `extends`
   - Consider shared config packages such as `@antfu/eslint-config`, `@tsconfig/*`, `prettier-config-standard`
   - Check `mise.toml` or `.tool-versions` to pin versions

### 3. Update Package Manifest

> Goal: Update package.json or the main manifest

1. Check `package.json`:
   - Does it have `packageManager` (`pnpm@12.6.0`, `bun@1.4.2`)
   - Does it have `engines`
   - Does it have `workspaces` or `package.json#workspaces`
   - Does it have `trustedDependencies` / `onlyBuiltDependencies` (Bun)
   - Does it have `repository`, `homepage`, `bugs`, `license`
   - Does it have `type`, `main`, `module`, `types`
2. If it is a monorepo:
   - Add/update `pnpm-workspace.yaml` or `bun-workspace.toml`
   - Use `catalog:` or `catalogs` for shared dependencies
   - Remove duplicate devDependencies from child packages, moving them to the root or a catalog
3. If the project uses mise:
   - Run `/follow-tool-mise` to check the root `mise.toml`
   - Align tool versions with `package.json engines`

### 4. Update Tool Configs

> Goal: Tool configs that are consistent and free of duplication

1. TypeScript:
   - Create/update `tsconfig.base.json` at the root
   - Have each workspace `tsconfig.json` extend `tsconfig.base.json`
   - Check that `compilerOptions` do not conflict between workspaces
2. ESLint:
   - Consolidate into `eslint.config.js` / `eslint.config.mjs` (flat config — migrate `.eslintrc` with `bunx @eslint/migrate-config`)
   - Use a shared config package when appropriate
   - Remove redundant `.eslintrc.*` files (the legacy format was removed in ESLint 10)
3. Prettier:
   - Consolidate into a root `prettier.config.*` or `.prettierrc`
   - Reference it from `package.json#prettier`
4. Vitest / Jest:
   - Create a shared test config, then have workspaces `extends` it or `defineConfig` from the shared one
5. Build tools:
   - Consolidate `vite.config.*`, `tsup.config.*` and use shared plugins where possible
6. Knip / Taze:
   - Create `knip.config.*` or `knip.json` at the root
   - Create `taze.config.*` if it is used

### 5. Update Monorepo Orchestration

> Goal: Correct monorepo config

1. If it uses moonrepo:
   - Run `/follow-tool-moonrepo` to update `.moon/workspace.yml`, `.moon/toolchains.yml`, `.moon/tasks/*.yml`
   - Check that each project's `moon.yml` has `id`, `language`, `type`, `dependsOn`
2. If it uses turbo:
   - Update `turbo.json` with the pipeline tasks
   - Use the latest `$schema` version
   - Check `globalDependencies`, `globalEnv`, `remoteCache`
3. If it uses pnpm/yarn/npm workspaces:
   - Update `pnpm-workspace.yaml` / `package.json#workspaces`
   - Use `catalogs` or `nohoist` as needed

### 6. Update CI/CD And Automation

> Goal: Keep CI/CD config in sync with the project

1. Check `.github/workflows/*.yml`:
   - Use the package manager that matches the `packageManager` field
   - Use node/bun versions that match `engines` or `mise.toml`
   - Use moon/turbo run commands that match the root scripts
2. Check `.github/dependabot.yml` or the renovate config
3. Check git hooks:
   - `lefthook.yml` or the `husky` config
   - Use `lint-staged` or `nano-staged` if needed
4. Run `/update-dot-devin` for Devin-specific rules

### 7. Update Editor And Environment

> Goal: Convenient and safe editor, env, git config

1. Create/update `.vscode/settings.json`, `.vscode/extensions.json`, `.vscode/launch.json`
2. Create/update `.editorconfig`
3. Check `.env.example` or `.env.local.example`
4. Run `/update-gitignore` to keep `.gitignore` in sync
5. Check `.gitattributes`

### 8. Apply Changes With Dry Run

> Goal: Do not break the existing config

1. Show a preview of every change before writing
2. For a destructive change (delete/overwrite) → dry run first, then ask the user
3. Use `edit` one file at a time
4. Record every config that was changed

### 9. Validate

> Goal: Verify that the config is correct

1. Run `/deep-validate` to check structure and references
2. Run the ecosystem's validation tools:
   - `moon check` or `moon run :check` (moonrepo)
   - `bun check` (Bun ≥ 1.4), `tsc --noEmit` or `tsc -b` (TypeScript)
   - `eslint .` (ESLint)
   - `prettier --check .` (Prettier)
   - `knip` (unused)
3. Run `/report-config-files` again to verify
4. Run `/report` to summarize the changes

### Workflows

> Goal: Dispatch specialised config domains to a more detailed workflow

| Topic | Workflow |
|-------|----------|
| Update env config — diff current vs needed, apply, verify | `workflows/config-env/SKILL.md` |
| Consolidate duplicate config/dependencies into shared config or a catalog | `workflows/update-shared-config/SKILL.md` |

## Rules

### 1. Review First

- Always run `/deep-review-codebase` before updating
- Do not change anything before there are findings and a priority order
- For a large project or a complex monorepo → use `/update-devin-global-subagents`

### 2. Prefer Shared And Extends

- Use shared config / `extends` instead of duplicating config in each workspace
- Use a dependencies catalog (`pnpm catalogs`, `bun catalogs`) instead of repeated versions
- Move shared devDependencies to the root or a catalog

### 3. Monorepo

- If there is a `.moon` or `moon.yml` → use `/follow-tool-moonrepo`
- If there is a `turbo.json` → check the `turbo.json` schema and pipeline
- If there is a `pnpm-workspace.yaml` → check `catalogs` and `packages`

### 4. Safety

- Dry run destructive changes
- Ask the user before deleting or overwriting config
- Never expose secrets
- Back up important files before editing when necessary

### 5. Ecosystem Aware

- Follow the conventions of Bun, pnpm, Node, Rust, Python as detected
- Use `/follow-devin-global-skills` to find specialised config skills

### 6. Defaults Minimal

- Use `/follow-default-config` — config files keep only overrides; remove keys equal to the default (check defaults with `/check-types-definition`)

- Use /research-setup-integrations if needed (choose a tool's plugins/extensions/providers from official sources)
- Use /update-project if needed
- Use /report-idea-cleanup-files-in-computer if needed


## Expected Outcome

- All config files are complete and consistent
- Duplication reduced via shared config / extends / catalog
- Monorepo orchestration is correct
- CI/CD, editor, env, git config are in sync
- Passes `/deep-validate` and the ecosystem's tool checks
- A report of changes, risks, and next actions
