---
name: follow-config-config-vscode
description: Manage .vscode config — settings, extensions, tasks, launch matching the project stack
argument-hint: "[path]"
related:
  - follow-config
  - update-dot-vscode
  - update-config
---

## Goal

Inspect and manage `.vscode/` config so it matches the project stack — settings, recommended extensions, tasks, launch configs — merging with existing content, never clobbering it

## Scope

- Apply to `.vscode/settings.json`, `.vscode/extensions.json`, `.vscode/tasks.json`, `.vscode/launch.json`
- Covers: formatter/linter settings, extension recommendations, shared tasks, debug configs
- Does not cover user-level VS Code settings — workspace config that can be committed only

## Execute

### 1. Detect Stack And Current Config

> Goal: Know what vscode config the project needs

1. Read `package.json` / manifests — formatter, linter, test runner, framework in use
2. Read the current `.vscode/*` — existing settings, extensions, tasks, launch
3. Identify gaps — e.g. using biome but with no default formatter or extension recommendation

### 2. Sync Settings And Extensions

> Goal: The editor matches the project tools

1. `settings.json`: set `editor.defaultFormatter` to the project's formatter, `editor.formatOnSave`, linter integration, file associations — merge with existing settings, never overwrite unrelated keys
2. `extensions.json`: `recommendations` for the extensions of tools the project actually uses — e.g. biome, eslint, tailwind, playwright per stack
3. Never put user-specific settings (theme, font) in workspace settings

### 3. Sync Tasks And Launch

> Goal: tasks/debug configs match the real scripts

1. `tasks.json`: map from `package.json` scripts or monorepo tasks — build, test, lint, dev
2. `launch.json`: debug configs for app/tests per runtime in use — check the framework's official docs when unsure
3. Use VS Code variables (`${workspaceFolder}`, `${file}`) instead of hardcoded paths

### 4. Verify

> Goal: Config is valid and usable

1. Validate every JSON file — no syntax errors; comments are allowed in jsonc
2. Test that key tasks run — `Terminal → Run Task` equivalents
3. Run `/update-dot-vscode` if syncing with repo templates/standards is needed

## Rules

- Always merge with existing config — never overwrite a whole file unless necessary
- Set only the settings the project tools require — no personal preferences
- Extension recommendations only for tools the project actually uses — not nice-to-haves
- Never commit secrets, tokens, or machine-specific paths in `.vscode/`
- Paths must be relative or use VS Code variables — no absolute paths

## Expected Outcome

- `.vscode/` matches the project stack — formatter, linter, tasks aligned
- Extension recommendations complete for the tools in use
- Config valid; tasks/launch actually work
