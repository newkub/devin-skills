---
name: transform
description: Transformation dispatcher — apply scripted/AST conversions across code, data, config by job type
argument-hint: "[target|pattern]"
related:
  - use-scripts
  - use-astgrep
  - edit-relative
  - convert-files-format
  - replace
  - refactor
  - migrate
  - port
  - run-verify
  - report
---

## Goal

Pick the correct transformation path for "change X into Y at many places" jobs — AST-based, script-based, or format conversion — every path enforces dry-run/preview + confirm before real writes

## Scope

- Covers classifying and dispatching transformation work — mechanics live in the routed skills, no duplication
- Does not cover file rename/move (`/rename`, `/move-to`) or refactor semantics (`/refactor`) — use them only as routes

## Execute

### 1. Classify Transformation

> Goal: Pick the route that matches the job type

| Job | Route |
|-----|-------|
| Edit many files via a script — reproducible, audit trail | `/use-scripts` (`### Edit Files Via Scripts`) |
| AST pattern rewrite across many files (`-p`/`-r`, dry-run + confirm) | `/use-astgrep rewrite` |
| rule-YAML transforms (`transform`/`rewriters`/constraints) | `/use-astgrep transform` |
| whole-codebase migration in staged batches | `/migrate` |
| adapt code to another platform, design unchanged | `/port` |
| format conversion (json↔yaml, cjs→esm, svg, scripts) | `/convert-files-format` or the `/convert` domain |
| a single file / few spots, no need for reproducibility | `/edit-only` or `/replace` |
| config values per defaults/overrides | `/edit-manual` + `/follow-default-config` |
| semantic refactor (extract, rename symbols, architecture) | `/refactor` |

1. Determine intent + target scope from the argument
2. If multiple routes fit → choose the AST route for structural code changes, the script route when the logic is not an AST pattern, and manual for a few spots
3. If unclear → run `/ask-me`

### 2. Run Routed Skill

> Goal: Execute the full workflow of the chosen route

1. Read the route's SKILL.md and follow its flow — never do a shortened version from this table
2. Every route must dry-run/preview + get user confirm before real writes — if the route does not enforce it, enforce it yourself
3. Start with a narrow scope before widening — fail fast reduces rework

### 3. Verify And Update References

> Goal: The transformation does not break and references stay consistent

1. Re-run the original pattern/check → 0 leftovers (except intentional)
2. Run `/run-verify` — lint/typecheck/scan pass
3. If files were renamed/moved or the public API changed → run `/edit-relative` + `/update-references`
4. Run `/report` table: `No.`, `Target`, `Route`, `Changes`, `Status`

## Rules

- Never transform with immediate overwrite — every route requires dry-run/preview + confirm first
- Transform = changing content inside files — if the job is moving/renaming files → `/rename`, `/move-to`
- If a transformation must run repeatedly → promote it to a rule (`/update-astgrep-rules`) or a permanent script (`.devin/scripts/`), not manual repetition
- Use `/ask-me` if needed

## Expected Outcome

- The transformation is routed to the right skill and fully executed
- Every write passes preview + confirm; verify passes; references fully updated
- Clear report: route used, files changed, leftovers
