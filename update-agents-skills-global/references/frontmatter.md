# Frontmatter Spec

> Repo standard for `SKILL.md` frontmatter and body. Cited by other skills as `update-agents-skills-global` `## Conventions → Frontmatter Spec` — keep the section name stable.

- Required: `name` (matches the dir, lowercase separated by `-`), `description` ≤100 characters; recommended: `argument-hint`, `allowed-tools` (only what's needed), `related` ≤15 (real dirs + actually mentioned in the body)
- Optional: `model` (`sonnet`/`swe`/`opus`/`codex`), `subagent: true`, `agent: <profile>` (takes precedence over subagent), `permissions` (`allow`/`deny`/`ask`), `triggers` (default `['user','model']`)
- Body: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome` (plus `## Key Concepts`/`## Principles`/`## Guide`/`## Examples` when needed); backticks for tools/commands/paths/skills; no `**` bold; `## Execute` may open with an unnumbered `### Workflows` dispatch table (measured: 88 skills) while every step stays `### N. Step Name`; one table row per line — a collapsed `| Topic | Workflow |-------|----------| ...` line renders as a single paragraph
- `check-*` skills → `allowed-tools` must include `exec`, `grep`, `glob`, `find_file_by_name` and use commands/scripts/linters instead of eyeballing — reproducible results citable by file/line
