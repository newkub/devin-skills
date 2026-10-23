---
name: update-agents-skills-global-refactor
description: Restructure skill packages — split, merge, workflows, metadata, sync refs
argument-hint: "[skill | family-prefix | all]"
related:
  - update-agents-skills-global
  - refactor
  - simplify
  - new-skills
  - use-subagents
  - use-related-skills
  - check-long-files
  - deep-validate
  - update-references
  - report
  - suggest-next-action

---

## Goal

Refactor skill packages in `%APPDATA%\devin\skills` so that SRP is clear and they pass the repo standard — split, reclassify, merge, fix metadata, sync references

## Scope

Restructure existing skills — a single skill, a family (`follow-lib-*`, `review-*`), or `all` — excluding: creating new → `/new-skills`, updating content → `/update-agents-skills-global` (default argument), project code → `/refactor`

Reached via `/update-agents-skills-global refactor`. This file is a `workflows/` child — it is not registered as a `/command` of its own

## Execute

### 1. Detect Violations

> Goal: Know which skill to refactor and what the violation is

1. `<skill>` → a single target; family prefix or `all` → list every matching skill
2. Collect a baseline per skill:

   | No. | Violation | Detect |
   |-----|-----------|--------|
   | 1 | File exceeds 250 lines | `/check-long-files` |
   | 2 | Multiple responsibilities | Read `## Execute` — count workflows with different goals |
   | 3 | Workflow lives in `references/` | Compare with decision matrix (step 2) |
   | 4 | Content duplicated from another skill | `/use-related-skills` + grep title/description |
   | 5 | `references/` is not flat | list dir |
   | 6 | Wrong frontmatter | `name` ≠ dir, `description` >100 |
   | 7 | Dangling `related` | `/deep-validate` |

### 2. Plan

> Goal: Choose a fix per violation from conventions — not ad hoc

1. Read `update-agents-skills-global` `## Conventions` — `When To Split` (violation → fix) and `Workflows And Subagents` (decision matrix + consolidation)
2. Summarize skill → violation → action → target — report before fixing if scope >3 skills
3. Merge top-level skills → `git mv` into `parent/workflows/<domain>/`, parent becomes a dispatcher, bulk-update callers before deleting the old dir

### 3. Apply

> Goal: Fix per the plan without losing content

| Action | How |
|--------|-----|
| Split | Detailed content → `references/<topic>.md`; SKILL.md keeps workflow + pointer |
| Reclassify | workflow ↔ `workflows/<name>/` (`name: <parent>-<name>`), knowledge ↔ `references/` |
| Merge | Combine duplicated content into one place |
| Metadata | `name` = dir, `description` ≤100, `related` resolvable |
| Simplify | Condense verbose prose → `/simplify` |
| Flatten | `references/` has no nested dirs |

Use `git mv` for every move to preserve history

### 4. Dispatch Bulk Work

> Goal: Family-wide refactor runs in parallel without colliding

Scope >3 independent skills → spawn a `skill-updater` subagent per skill via `/use-subagents` — each edits only its own dir; skills that touch shared files (`AGENTS.md`, `global_rules.md`) are done sequentially, no spawning

### 5. Sync And Validate

> Goal: No stale refs, passes conventions

`/update-references` → sync living docs (`AGENTS.md` count + `related:`) → `/deep-validate`

### 6. Report

> Goal: Summarize the changes and the check results

`/report` (skill → violation → action → result + list of skipped items) → `/suggest-next-action`

## Rules

### 1. Convention Authority

- The standard lives in `/update-agents-skills-global` references — point to it, do not rewrite it
- prefix contract (`check-*`/`review-*`/`deep-*`, lifecycle prefixes) per `new-skills` — do not refactor in a way that breaks it
- Do not create `workflows/fix-*/` or `references/fix-*.md` — fixes live in `### 7. Fix` (`deep-review-codebase-everything/SKILL.md`)

### 2. No Content Loss

- Moving/splitting must preserve content — delete only true duplicates; destructive → dry run + confirm

### 3. Minimal Diff

- Fix only detected violations — do not rewrite what already passes
- Do not change the semantics of a workflow (Two Hats, same as code refactoring)

### 4. Deterministic Output

- Every violation must have evidence before fixing — do not guess
- The report states the actual verify result — do not claim it passed if you have not run it

## Expected Outcome

- Files ≤250 lines, clear SRP; `references/` flat, `workflows/` = invocable workflows, subagent profiles = `SKILL.md ## Subagents` (no `subagents/`)
- No duplicated content, stale refs, or dangling `related`; `AGENTS.md` + living docs in sync
- Passes `/deep-validate` with a before/after report
