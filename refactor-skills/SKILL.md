---
name: refactor-skills
description: Refactor skill packages per update-devin-global-skills — split, merge, subskills, naming
argument-hint: "[skill | family-prefix | all]"
related:
  - update-devin-global-skills
  - update-devin-global-subagents
  - refactor
  - new-skills
  - use-related-skills
  - use-subagents
  - check-long-files
  - check-config-drift
  - deep-validate
  - update-references
  - follow-single-of-source
  - report
  - suggest-next-action

---

## Goal

Refactor skill packages in `%APPDATA%\devin\skills` to clear SRP and repo standards — split files over 250 lines, classify `subskills/`/`subagents/` correctly, merge duplicates, fix naming/frontmatter, and sync references.

## Scope

For restructuring existing skills only — a single skill, a skill family (`follow-lib-*`, `review-*`, etc.), or the whole repo.

Not covered:
- Creating a new skill → `/new-skills`
- Updating skill content/version/docs → `/update-devin-global-skills`
- Refactoring code in a project → `/refactor`

## Execute

### 1. Identify Targets

> Goal: know which skills to refactor and what the violations are

1. If `<skill>` given → single target; if family prefix or `all` → list every matching skill
2. Collect baseline violations per skill:

   | No. | Violation | Detect |
   |-----|-----------|--------|
   | 1 | `SKILL.md` or child file over 250 lines | `/check-long-files` |
   | 2 | Multiple responsibilities in one SKILL.md | Read `## Execute` — count workflows with different goals |
   | 3 | Independently invocable workflow living in `references/` | Compare against decision matrix |
   | 4 | Content duplicated with another skill | `/use-related-skills` + grep title/description |
   | 5 | `references/` not flat or has nested dirs | List dir |
   | 6 | Bad frontmatter (`name` ≠ dir, `description` >100) | Read frontmatter |
   | 7 | `related` points to missing skill or omits a referenced one | `/deep-validate` |

### 2. Plan Refactor

> Goal: pick a refactor type per violation — check conventions first

1. Read `update-devin-global-skills/references/refactor-guidelines.md` — violation → fix mapping
2. Read `update-devin-global-skills/references/subskills-and-subagents.md` — decision matrix (references vs subskills vs subagents vs scripts) + consolidation pattern + lifecycle prefixes
3. Summarize plan: skill → [violation → action → target file]; report before editing if scope is wide (>3 skills)
4. If the plan merges top-level skills → do consolidation: `git mv` into `parent/subskills/<domain>/`, parent becomes dispatcher, bulk-update callers before deleting the old dir

### 3. Execute Refactor

> Goal: apply the plan without losing content

1. Split: move detailed content to `references/<topic>.md` — `SKILL.md` keeps the high-level workflow + pointers
2. Reclassify: move workflows out of `references/` into `subskills/<name>/SKILL.md` (set `name: <parent>-<name>`), or move passive knowledge from `subskills/` back to `references/` per the matrix
3. Merge: fold duplicated content into one place — delete/move the old copy; never leave the same content in two places
4. Fix metadata: `name` = dir name, `description` ≤100 chars, `related` complete and resolvable
5. Flatten `references/` — no nested dirs
6. Use `git mv` for every move to preserve history

### 4. Dispatch Bulk Work

> Goal: family-wide refactors can run in parallel without collisions

1. If scope is >3 independent skills → spawn `update-devin-global-skills/subagents/skill-updater.md` per skill via `/use-subagents`
2. Each agent edits only its own `skills/<skill>/` — the parent always syncs `AGENTS.md` and validates the whole set
3. Skills that touch shared files (`AGENTS.md`, `global_rules.md`, shared references) → run sequentially, never spawn

### 5. Sync And Validate

> Goal: no stale references and all conventions pass

1. Run `/update-references` — every moved/renamed/deleted file must leave no stale ref
2. Sync living documents per `update-devin-global-skills/references/living-documents.md` — `AGENTS.md` (count + index), `related:` lists, tool-map if affected
3. Run `/deep-validate` — frontmatter, broken links, TODO/placeholders
4. Run `/check-config-drift` if a skill's config was touched

### 6. Report

> Goal: summarize changes and verification results

1. Run `/report` — table of skill → violation → action → result
2. List remaining or skipped violations with reasons
3. Run `/suggest-next-action`

## Rules

| No. | Rule | Constraint |
|-----|------|------------|
| 1 | Convention authority | All standards live in `/update-devin-global-skills` references — point there, never duplicate rules; prefix contract (`check-*`/`review-*`/`deep-*`, lifecycle subskill prefixes) per `new-skills` rule 4 — refactoring must not break it; never create `subskills/fix-*/` or `references/fix-*.md` — fix workflows live in `## Fix` sections |
| 2 | No content loss | Moves/splits must preserve all content — delete only true duplicates; use `git mv` to keep history; destructive actions → dry run + confirm first |
| 3 | Minimal diff | Fix only detected violations — do not rewrite content that already passes conventions; no semantic changes to workflows during refactor (SKILL.md refactor = Two Hats, same as code refactor) |
| 4 | Deterministic output | Every violation needs evidence (line count, grep result, file list) before fixing — never guess; report must state real verify results — never claim a pass without running it |

## Expected Outcome

- Every `SKILL.md` and child file ≤250 lines with clear SRP
- `references/` flat, `subskills/` holds only invocable workflows, `subagents/` holds only profiles
- No duplicated content across skills — no stale refs or dangling `related`
- `AGENTS.md` and living documents synced to the new structure
- Passes `/deep-validate` with a before/after report
