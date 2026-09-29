---
name: refactor-skills
description: Refactor skill packages per update-devin-global-skills — split, merge, subskills, naming
argument-hint: "[skill | family-prefix | all]"
related:
  - update-devin-global-skills
  - refactor
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

Refactor skill packages in `%APPDATA%\devin\skills` to clear SRP and repo standards — split oversized files, classify `subskills/`/`subagents/`/`references/` correctly, merge duplicates, fix naming/frontmatter, sync references.

## Scope

Restructures existing skills only — one skill, a family (`follow-lib-*`, `review-*`), or `all`. Not for: new skills → `/new-skills`, content updates → `/update-devin-global-skills`, project code → `/refactor`.

## Execute

### 1. Detect Violations

> Goal: know which skills to refactor and what the violations are

1. `<skill>` → single target; family prefix or `all` → list every match
2. Collect baseline per skill:

   | No. | Violation | Detect |
   |-----|-----------|--------|
   | 1 | `SKILL.md` or child file >250 lines | `/check-long-files` |
   | 2 | Multiple responsibilities in one SKILL.md | Read `## Execute` — count workflows with different goals |
   | 3 | Invocable workflow living in `references/` | Decision matrix (step 2) |
   | 4 | Content duplicated with another skill | `/use-related-skills` + grep title/description |
   | 5 | `references/` not flat / nested dirs | List dir |
   | 6 | Bad frontmatter (`name` ≠ dir, `description` >100) | Read frontmatter |
   | 7 | `related` dangling or missing a referenced skill | `/deep-validate` |

### 2. Plan

> Goal: pick a fix per violation from conventions — not ad hoc

1. Read `update-devin-global-skills/references/refactor-guidelines.md` (violation → fix) and `subskills-and-subagents.md` (references/subskills/subagents matrix + consolidation pattern)
2. Summarize plan: skill → violation → action → target; report first if scope >3 skills
3. Merging top-level skills → `git mv` into `parent/subskills/<domain>/`, parent becomes dispatcher, bulk-update callers before deleting

### 3. Apply

> Goal: execute the plan without losing content

| Action | How |
|--------|-----|
| Split | Detail → `references/<topic>.md`; SKILL.md keeps high-level workflow + pointer |
| Reclassify | Workflow ↔ `subskills/<name>/` (`name: <parent>-<name>`), knowledge ↔ `references/`, per matrix |
| Merge | Fold duplicates into one place — never leave the same content twice |
| Metadata | `name` = dir, `description` ≤100, `related` complete and resolvable |
| Flatten | `references/` has no nested dirs |

Always `git mv` moves to preserve history.

### 4. Dispatch Bulk Work

> Goal: family-wide refactors run in parallel without collisions

Scope >3 independent skills → spawn `skill-updater` subagent per skill via `/use-subagents`; each touches only its own dir. Skills editing shared files (`AGENTS.md`, `global_rules.md`) run sequentially.

### 5. Sync And Validate

> Goal: no stale refs, all conventions pass

`/update-references` → sync living docs (`AGENTS.md` count + `related:` lists) → `/deep-validate`.

### 6. Report

> Goal: summarize changes and verify results

`/report` (skill → violation → action → result, with skipped items + reasons) → `/suggest-next-action`.

## Rules

| No. | Group | Rule |
|-----|-------|------|
| 1 | Convention authority | All standards live in `/update-devin-global-skills` references — point there, never duplicate rules |
| 2 | Convention authority | Prefix contract (`check-*`/`review-*`/`deep-*`, lifecycle prefixes) per `new-skills` — refactoring must not break it |
| 3 | Convention authority | Never create `subskills/fix-*/` or `references/fix-*.md` — fix workflows live in `## Fix` |
| 4 | No content loss | Moves/splits preserve all content — delete only true duplicates |
| 5 | No content loss | `git mv` for every move; destructive actions → dry run + confirm first |
| 6 | Minimal diff | Fix only detected violations — do not rewrite compliant content |
| 7 | Minimal diff | No semantic changes to workflows (Two Hats, same as code refactor) |
| 8 | Deterministic output | Every violation needs evidence (line count, grep, file list) before fixing |
| 9 | Deterministic output | Report real verify results — never claim a pass without running it |

## Expected Outcome

- Every `SKILL.md` and child file ≤250 lines with clear SRP; `references/` flat, `subskills/` = invocable workflows only, `subagents/` = profiles only
- No duplicated content, stale refs, or dangling `related`; `AGENTS.md` and living documents synced
- Passes `/deep-validate` with a before/after report
