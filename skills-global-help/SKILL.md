---
name: skills-global-help
description: <help> for the global skill catalog — usage, lookup, and keyword search
argument-hint: "[skill-name | keyword | --all | --json]"
related:
  - search-skills
  - list-dot-agents-global
  - follow-devin-global-skills
  - explain
  - follow-context-engineering
---

## Goal

Render help for the global skill catalog like `<cli> --help` — usage overview, one-skill lookup, and keyword search, read-only

## Scope

Reads only `SKILL.md` frontmatter of packages under `~/.agents/skills/` (Windows: `%APPDATA%\devin\skills\`); catalog layout follows `/follow-devin-global-skills` and output stays bounded per `/follow-context-engineering`

- No argument → usage overview: how to invoke, counts, core entries, prefix families
- Exact skill name → detail card: description, argument hint, related, path, invocation
- Keyword → ranked matches across names and descriptions
- `--all` → every skill grouped by prefix family
- `--json` → machine-readable output for agents

Out of scope: remote marketplace search (`/search-skills`), full harness inventory (`/list-dot-agents-global`), project file search (`/code-search`)

## Execute

### 1. Resolve Catalog

> Goal: point at the real catalog root and its tracked `SKILL.md` list

1. Set `ROOT` to `~/.agents/skills` (follow the symlink; on Windows resolve to `D:/dot-agents/skills` if the link target differs)
2. Confirm `ROOT/AGENTS.md` exists; if not, stop and report the resolved path
3. Enumerate `SKILL.md` on disk and exclude `node_modules` — the git index drifts from what the harness loads (deleted-but-tracked and untracked packages both miscount), so never count from `git ls-files`

```bash
find "$ROOT" -name SKILL.md -not -path '*/node_modules/*' -not -path '*/.git/*'
```

### 2. Build Index

> Goal: an in-memory index of name, description, argument hint, and related

1. Parse frontmatter of each `SKILL.md`: `name`, `description`, `argument-hint`, `related`
2. Index only top-level packages (`<name>/SKILL.md`); label `workflows/` files as variants of their parent
3. Keep the index in memory for the current request; never write an index file

```bash
rg -l '^name:' --glob '*/SKILL.md' --glob '!**/node_modules/**' "$ROOT"
```

### 3. Render Help

> Goal: render the requested view from the index without reading bodies

Branch on the argument; default to the overview.

1. `no argument` — `<cmd> --help` style overview:
   - invocation: `/<skill-name>` or `/<parent> <domain>` for `workflows/`
   - total package count and `SKILL.md` count
   - core entries from root `AGENTS.md`: `follow-agents-md`, `update-agents-skills-global`, `list-dot-agents-global`, `deep-review`, `deep-test`, `git-commit`, `ship`, `report`
   - prefix families with counts (`follow-*`, `check-*`, `deep-*`, `create-*`, `list-*`, `report-*`, `use-*`, …)
   - examples: `/skills-global-help commit`, `/skills-global-help review`, `/skills-global-help --all`
2. `skill-name` — resolve the package and print:
   - `name`, `description`, `argument-hint`, `related`, absolute path, invocation
   - when the package has `workflows/`, list its variants as `/parent variant`
3. `keyword` — rank matches: exact name → name prefix → name substring → description substring; show at most 20 rows (`No.`, skill, description); say when more matches exist and suggest a narrower keyword
4. `--all` — every package grouped by prefix family with counts; allowed to exceed the normal output cap
5. `--json` — emit `{ query, count, skills: [{ name, description, argumentHint, path, workflows }] }`; combine with any other argument

### 4. Bound Output

> Goal: keep every view scannable and deterministic

1. Default to ≤60 lines; only `--all`/`--json` may exceed it
2. Any table starts with a `No.` column; plain lists are numbered
3. When the requested name is missing, suggest the three closest names and stop
4. Do not read full `SKILL.md` bodies unless the user asks to explain a skill — hand off to `/explain`

## Rules

### 1. Read-Only

- Never create, edit, rename, move, or delete skill files
- Never install or update skills; `/skills-global-help` only reports what exists
- If the catalog root is missing or unreadable → stop and report, do not guess

### 2. Single Source Of Truth

- Frontmatter is the authority for name, description, argument hint, and related
- Report drift you observe (name ≠ folder, missing description) but do not fix it here; route to `/check-skills-structure`

### 3. No Duplication

- Remote marketplace search → `/search-skills`
- Harness-wide inventory (skills, agents, MCP, hooks) → `/list-dot-agents-global`
- Concept explanation of one skill → `/explain`
- Convention for authoring skills → `/update-agents-skills-global`

### 4. Determinism

- Same argument and catalog state → same output
- Sort ties alphabetically by name
- Exclude `node_modules` and nested vendored copies from every count

## Expected Outcome

- `/skills-global-help` renders a `<cli> --help`-style overview of the catalog
- `/skills-global-help <skill>` returns the detail card with path and invocation
- `/skills-global-help <keyword>` returns ranked matches; `--all` and `--json` cover bulk and agent use
- No files created, modified, or deleted
