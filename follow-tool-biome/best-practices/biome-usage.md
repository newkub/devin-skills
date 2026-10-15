# Biome Best Practices

Guidance for using Biome as the single linter + formatter + assist replacing ESLint/Prettier — config, rules, suppression, and CI

## Recommended Patterns

### Check vs Fix Discipline

- Use `biome ci` in CI only — this mode is read-only, reporter-friendly, and exits non-zero on problems; never use `--write` in CI
- In local dev use `biome check --write` (lint+format+assist in one pass) instead of running `lint` and `format` separately
- Use `--error-on-warnings` in CI when warnings should be a real gate, not noise
- Use `--since=<ref>` or `--changed` with VCS integration to check only files changed in the PR — very fast in large repos

### Config Structure

- Use `biome.jsonc` (comments supported), not `biome.json`, to explain rule overrides
- Always enable `vcs.enabled` + `useIgnoreFile: true` — Biome respects `.gitignore` automatically, no duplicated excludes to maintain
- Monorepo: the root config has `root: true` (default); package configs use `extends: ["//"]` (shorthand that finds the root) or a direct path
- Use `overrides` blocks for per-path rules, e.g. turn off `noExplicitAny` in `**/generated/**` or relax test files — don't disable a rule project-wide for one file

### Rules And Domains

- Start from `recommended`, then add only the domains actually used (React, Vitest, Drizzle) — each domain has its own analysis cost, notably `project` and `types`
- Pick either React or Solid, not both — enabled together their rules clash
- Disable rules that don't fit the codebase in the config rather than mass-suppressing — e.g. `noBarrelFile` if the architecture intentionally uses barrels

### Suppression

- Use `// biome-ignore lint/<group>/<rule>: <reason>` when necessary — always include a reason for reviewers
- Suppress only the needed line/scope — never `biome-ignore` a whole file for one rule
- `biome-ignore-start`/`biome-ignore-end` for generated blocks; if the whole file is generated, exclude it in the config instead

## Common Pitfalls

| Pitfall | Symptom | How to avoid |
|---|---|---|
| Running Prettier + Biome together | formatting flip-flops forever | one tool per file type; Biome handles JS/TS/JSON/CSS |
| Enabling `types`/`project` domains across the whole monorepo | lint slows down heavily | enable only where needed, or in a separate CI job |
| `biome format --write` in CI | CI passes but the code stays dirty | use `biome ci` (read-only) so it fails when unformatted |
| Wrong `extends` path in a workspace | rules aren't inherited | use `extends: ["//"]` pointing at the root config |
| Suppressing without a reason | nobody knows why | `: <reason>` is mandatory for every suppression |
| Schema path into a dead node_modules | IDE autocomplete breaks on version change | use the published schema URL, or accept the path is version-bound |
| Legacy ESLint rules still on | double-reported diagnostics | turn ESLint off for files Biome owns (see the migrate workflow) |

## Do / Don't

| Do | Don't |
|---|---|
| `biome check --write` before committing | commit first and let CI do the formatting |
| enable VCS integration + useIgnoreFile | maintain an excludes list duplicating `.gitignore` |
| pin the version in CI with `biomejs/setup-biome` | `version: latest` in production CI (each release adds rules, silently failing CI) |
| combine lint+format+assist in one script | chaining 3 commands in pre-commit (3x slower) |
| use `--diagnostic-level=error` when warnings overwhelm | disable the linter because output is noisy |
| editor extension + format-on-save | relying on CI alone to catch formatting |

## Performance And CI Notes

- Biome is very fast (Rust) — a full check on a large repo is usually < a minute; incremental CI isn't needed unless the repo is truly huge
- The `project` and `types` domains add significant analysis cost — measure before enabling them across a monorepo
- GitHub Actions: `biomejs/setup-biome` + `biome ci .` is the standard pattern; add `--reporter=github` for PR annotations
- `--max-diagnostics` limits output when migrating a large repo — lower it gradually as issues get fixed
- Caching matters less than with ESLint (no slow JS plugin loading) — caching `node_modules` still speeds the install step
- For pre-commit: run through lefthook/husky with `biome check --write --staged` or `--changed` only

## Config Guidance

- Order the config groups `vcs` → `files` → `formatter` → `linter` → `assist` → `overrides` for readability
- `files.includes` uses negated patterns (`!**/generated`) instead of legacy excludes fields
- Set formatter defaults once at the root: `indentStyle`, `lineWidth`, `quoteStyle` — don't override per package without a reason
- Check `biome explain <rule>` when unsure what a rule does, before adding/removing it in the config
