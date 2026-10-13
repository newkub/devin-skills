---
name: update-config
description: Update project config to be complete, consistent, duplication-free via a shared config/dep catalog
argument-hint: "[path]"
related:
  - deep-review
  - report-config-files
  - follow-devin-global-skills
  - follow-tool-mise
  - follow-tool-moonrepo
  - update-project
  - update-dot-devin
  - refactor-to-packages-shared
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
- Run `/deep-review` first to get findings
- If it is a monorepo → use `/follow-tool-moonrepo`

## Execute

### 1. Review Current Config

> Goal: Understand the current config state

1. Run `/deep-review` to collect findings
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
   - `tsc --noEmit` or `tsc -b` (TypeScript)
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

- Always run `/deep-review` before updating
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

## Merged Details

### config-env

##### Goal

Update the project's env configuration — diff the vars that exist against the ones the code needs, apply only the required keys, verify the app still runs — without clobbering the original values

##### Scope

- Use when adding/changing/removing env vars or syncing `.env.example` with the code
- Covers: `.env`, `.env.local`, `.env.<mode>`, `.env.example`, env validation schemas
- For auditing patterns/conventions → `follow-config/workflows/config-env/SKILL.md`

##### Execute

###### 1. Diff Current Vs Needed

> Goal: See which keys are missing, extra, or changed

1. Run `/check-secrets env-vars` — the vars the code reads (`process.env.*`, `import.meta.env.*` per stack) compared with those defined
2. Read the current env files and `.env.example` — list all keys
3. Build the diff: missing keys (used by code but absent), stale keys (present but unused by code), keys whose value/format must change
4. Run the `/deep-review` domain `review-config` report-drift workflow if you need to see drift across environments/workspaces

###### 2. Apply Changes

> Goal: Change only the keys that are required

1. Add the missing keys to `.env.example` with a placeholder plus a comment on what each is for
2. Update the validation schema (if any) to cover the new keys — required/optional, types, defaults
3. Ask the user before deleting stale keys — they may be used by another environment or an external runtime
4. Secrets/real values → `/follow-secret-manager` — never put them in committed files; a local `.env` may be edited but must never be committed

###### 3. Verify

> Goal: The app runs with the new env

1. Run dev/build — startup validation passes with no missing-var crash
2. Exercise the paths that use the new vars — smoke test only what changed
3. Run `/check-secrets secrets-leak` — confirm no secrets in git-tracked files
4. `git status` confirms `.env` is not staged — commit only `.env.example`/schema

##### Rules

- Merge only the keys that changed — never rewrite the whole env file unless required
- Never commit `.env`/`.env.local` or real values — commit only example/schema/code
- Never delete keys without confirming — stale in this repo may be required in another environment
- Prefix conventions must be right — framework public vars (`NEXT_PUBLIC_*`, `VITE_*`)
- If you find a secret that was already committed → tell the user it must be rotated, not just edited out of the file

##### Expected Outcome

- Env files match the vars the code uses — no unintended missing/stale keys
- `.env.example` and the validation schema are in sync
- Verification passes — the app runs and no secrets leak

### update-shared-config

##### Goal

Consolidate tool config and dependency versions duplicated across workspaces into a single shared config or catalog — one fact, one source — then have each workspace reference it back through `extends`/`catalog:`

##### Scope

- Use when the same config (`tsconfig`, `eslint`, `prettier`, `vitest`, build config) is duplicated in 2+ workspaces
- Use when the same dependency version is spread across several package manifests
- For duplicated shared code (utils, types, components) across packages → use `/refactor-to-packages-shared` instead
- For env vars → use `workflows/config-env/SKILL.md` instead

##### Execute

###### 1. Find Duplicate Config

> Goal: See which config is genuinely duplicated and worth consolidating

1. Run `/deep-review` domain `review-config` — find configs duplicated or drifting across workspaces
2. Compare config per domain: `tsconfig*.json`, `eslint.config.*`, `prettier.config.*`, `vitest.config.*`, build configs
3. Compare dependency versions across package manifests — find version drift and duplicates
4. Keep only candidates genuinely duplicated in 2+ workspaces — never consolidate speculatively

###### 2. Extract To Shared

> Goal: One canonical config that workspaces reference back

1. Create/update the root shared config per ecosystem:
   - `tsconfig.base.json` → workspaces `extends`
   - A root flat `eslint.config.js` → workspaces import/extend
   - A root `prettier.config.*` → referenced through `package.json#prettier`
   - test/build config → `defineConfig` from the shared one
2. Move duplicated dependency versions into a catalog per package manager (`pnpm-workspace.yaml` catalogs, `bun.catalogs`, or root `overrides`)
3. Replace versions in package manifests with a `catalog:` reference
4. If this work also involves shared code duplication → dispatch `/refactor-to-packages-shared` for the code part

###### 3. Rewire And Verify

> Goal: Every workspace really uses the shared config and nothing breaks

1. Run `/update-references` — delete the duplicated child configs, keeping only workspace-specific overrides
2. Run the ecosystem validators: `tsc -b`, `eslint .`, `prettier --check .`, then reinstall to resolve the catalog
3. Run `/deep-review` domain `review-config` again — confirm only one canonical config remains per domain
4. If it fails → revert that batch and fix; up to 3 rounds → stop/report

##### Rules

- Consolidate only genuinely duplicated config — workspace-specific options stay in the workspace
- Shared config must not depend on any workspace — it is only the foundation
- Behavior stays the same — the resolved config after extends must be equivalent (except drift you intentionally unified)
- The lockfile must be regenerated after moving deps into a catalog — commit the lockfile too

##### Expected Outcome

- Each config domain has one canonical version at the root — workspaces merely extend/override
- Dependency versions live in the catalog — manifests use `catalog:` instead of repeated pins
- Validation passes for every workspace — no config drift left

## Expected Outcome

- All config files are complete and consistent
- Duplication reduced via shared config / extends / catalog
- Monorepo orchestration is correct
- CI/CD, editor, env, git config are in sync
- Passes `/deep-validate` and the ecosystem's tool checks
- A report of changes, risks, and next actions
