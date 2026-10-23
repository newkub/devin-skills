---
name: run-format
description: Format code and resolve formatter issues
argument-hint: "[scope]"
related:
  - deep-review
  - follow-best-practice
  - follow-tool-viteplus
  - suggest-next-action
  - run-check
  - run-verify
  - resolve-errors
  - run-lint
  - run-drizzle-studio
---

## Goal

Format code and resolve formatter issues until everything passes

## Scope

Run format for all project types and handle errors/warnings from the formatter

## Execute

> Pre-Run: Always run `/deep-review` first — `run-*` must be reviewed/assessed before the main work, never skip; if findings are blockers, fix or report before running (format)

### 1. Check Formatter Config

> Goal: Check Formatter Config

Check the formatter used in the project

1. Check for Vite+ first: a `vite-plus` dependency or a `fmt` block in the root `vite.config.ts` → `vp fmt` (Oxfmt)
2. Check `biome.jsonc` for Biome
3. Check `dprint.jsonc` for dprint
4. Check `bunfig.toml` `[fmt]` for the built-in `bun fmt` (Bun runtime — no install needed)
5. Check the scripts in `package.json`
6. `.prettierrc` / `.prettierignore` → not a supported choice; plan the migration to `vp fmt` or `bun fmt`

### 2. Run Format Command

> Goal: Run Format Command

Run the formatter command as configured

1. If using Vite+: run `vp fmt`, or `vp check` when format, lint, and type-aware checks should run together
2. If using Biome: run `biome format --write` (never use the `--unsafe` flag)
3. If using dprint: run `dprint fmt`
4. If using the built-in Bun formatter: run `bun fmt` (invoke as `bun fmt --no-script` when a `fmt` script in `package.json` would shadow it) — it formats JS/TS/JSX, CSS/SCSS/Less, HTML/Vue/Svelte/Angular, JSON/YAML/TOML, Markdown/MDX, GraphQL, Handlebars; Python, Go, PHP, and Rust keep their own formatter
5. Use the script from `package.json` if one exists
6. Wait for formatting to finish before continuing

### 3. Analyze Format Issues

> Goal: Analyze Format Issues

Analyze the problems caused by the formatter

1. Check the output from the formatter
2. Check the types of issues:
   - syntax errors
   - config-related errors
   - unsupported files
   - format violations
3. Identify the problematic files

### 4. Fix Config Issues

> Goal: Fix Config Issues

Resolve problems related to the config

1. If there are config-related errors, use `formatter` to fix the config
2. Adjust the formatter config to suit the codebase
3. Adjust the rules to suit the project
4. Run format again to test

### 5. Fix Code Issues

> Goal: Fix Code Issues

Resolve problems occurring in the code

1. Fix syntax errors before formatting
2. Fix format violations in priority order
3. Handle unsupported files
4. Run format again until there are no errors

### 6. Verify

> Goal: Verify

Check the result

1. Run format again to confirm
2. Check that no format errors remain
3. Check that every file has been formatted
4. Vite+ projects: run `vp fmt --check` (or `vp check`) to verify read-only
5. Bun projects: run `bun fmt --check` to verify read-only
6. Run lint afterward to confirm

## Rules

### 1. Config Adjustments

Always try to fix the config before fixing the code

- Adjust the formatter config to suit the codebase
- Adjust the rules to suit the project
- Use `formatter` to fix the config correctly
- Avoid disabling rules unnecessarily

### 2. Syntax Errors

Always fix syntax errors before formatting

- Check for syntax errors before running format
- Fix all syntax errors completely
- Use a linter to help verify syntax
- Run format after the syntax is correct

### 3. Format Scope

Define the scope for formatting

- Format the whole project by default
- Use glob patterns for specific files
- Use the `--write` flag for auto-fix
- Use the `--check` flag for CI, or `vp check` on Vite+ projects
- Use `vp staged` (Vite+), `bun fmt --staged` / `--changed`, or `dprint fmt --staged` for pre-commit runs so untouched files are never rewritten

### 4. Verification

Check that the code still works normally

- Run format again to confirm
- Run lint afterward
- Check that there are no regressions
- Never use the `--unsafe` flag with biome commands

- Use /convert-files-format if needed
- Use /follow-best-practice if needed
- Use /follow-tool-viteplus if needed
- Use /suggest-next-action if needed
- Use /run-check if needed
- Use /run-verify if needed
- Use /resolve-errors if needed
- Use /run-lint if needed
- Use /run-drizzle-studio if needed

## Expected Outcome

Code that passes format with no format errors, plus a report of the format run
