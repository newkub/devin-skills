---
name: all
description: Run one task across every file, folder, workspace, or pattern match
argument-hint: "<files|folders|workspace|patterns> [task] [scope]"
related:
  - deep-analyze
  - deep-validate
  - resolve-errors
  - use-scripts
  - report
  - loop-until-complete
---

## Goal

Run a single task over every unit of a chosen scope — files, folders, monorepo workspaces, or pattern matches — until the scope is fully covered

## Scope

Applies to one task and one unit type; not for a single file or a known small set

Run `/loop-until-complete` when the scope is large enough that partial coverage
is likely. Use `/deep-analyze` for the per-unit analysis, `/use-scripts` when
the scope is too large to run by hand, `/resolve-errors` for failures found per
unit, and `/deep-validate` before declaring the run complete.

| Unit | Workflow |
|------|----------|
| Every file | `workflows/files/SKILL.md` |
| Every folder | `workflows/folders/SKILL.md` |
| Every monorepo workspace | `workflows/workspace/SKILL.md` |
| Every pattern match | `workflows/patterns/SKILL.md` |

## Execute

### 1. Pick The Unit

> Goal: Choose one unit type for the whole run
1. Read the unit from the argument; if unclear → run `/ask-me`
2. Confirm the task is identical for every unit — if it branches per unit, split it first with `/follow-single-responsibility`

### 2. Establish Baseline

> Goal: Know what was already broken
1. Run the project's check (lint/typecheck/test) before changing anything
2. Record the starting failure set so new breakage is attributable

### 3. Run The Workflow

> Goal: Cover every unit in scope
1. Read `workflows/<unit>/SKILL.md` and follow it
2. Invoke it as `/all <unit> <task> [scope]`
3. Keep a per-unit result list as the run progresses

### 4. Verify Coverage

> Goal: Prove the scope is complete
1. Count discovered units versus processed units — they must match
2. Re-run the baseline check and compare against the recorded failure set
3. Stop on the first environment-level blocker and fix it before continuing

## Rules

### 1. Coverage
- Report the exact discovered and processed counts; a partial pass is not done

### 2. Safety
- Never delete or overwrite outside the named scope
- Ask before a run that touches more than 50 units

### 3. Reporting
- Use `/report` with `No.` as the first column when summarizing per-unit results

## Expected Outcome

- Every unit in scope is processed with evidence, and the passed/failed counts are reported
