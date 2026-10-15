---
name: use-subagents
description: Split complex work and spawn subagents by role
argument-hint: "[task]"
allowed-tools:
  - run_subagent
  - read_subagent
  - kill_shell
  - skill
  - read
  - ask_user_question
  - todo_write
  - exec
related:
  - follow-agents-md
  - follow-deep
  - deep-analyze
  - use-scripts
  - use-astgrep
  - follow-math-concepts
  - follow-parallel
  - resolve-errors
  - run-check
  - deep-validate
  - update-devin-global-subagents
  - ship
  - report
  - ask-me
---

## Goal

Split work into subtasks and spawn subagents by role in parallel, gathering deep context before delegating

## Scope

Use when work spans many files/packages/aspects, needs perspectives from multiple roles, or benefits from parallel work for speed

See more: /follow-agents-md

## Execute

### 1. Deep Context First

> Goal: Gather deep context before spawning subagents

1. Run `/follow-deep` + `/deep-analyze` to analyze root cause, impact, consumers, and dependencies
2. Broad scope → use `/use-scripts` to gather context async/in parallel (file lists, import graph, grep counts, git log) instead of sequential reads
3. Record the key context: paths, conventions, relevant files, constraints
4. If unsure about scope → run `/ask-me` first

### 2. Decompose Task

> Goal: Split work into clear subtasks

1. Read the results from `/follow-deep`/`/deep-analyze`
2. Split subtasks by package, layer, or role
3. Each subtask must have: input, expected output, success criteria, files to change
4. Partition with `/follow-math-concepts` (set-theory, graph-theory) so subtasks run in parallel without colliding:
   - every subtask's file sets must be disjoint: `∪Sᵢ = scope` and `Sᵢ ∩ Sⱼ = ∅` (i≠j) — files changed together go in one subtask
   - dependencies between subtasks must form a DAG → topological order into waves: same wave spawns together, the next wave waits for the previous one to finish
   - no dependencies at all → embarrassingly parallel: spawn them all with `is_background=true` at once
   - cycle found in the dep graph → merge the cycle-bound subtasks together

### 3. Select Subagents

> Goal: Pick the role that fits each subtask

1. Choose a profile from the subagent profiles available in the system prompt
2. Pick a profile such as fixer, debugger, refactor, qa, security, architect
3. If there is no role you need → use `subagent_general` or `subagent_explore`
4. If unsure → run `/ask-me` first
5. Give complete context in the prompt

### 4. Spawn Subagents

> Goal: Hand work to subagents to run in parallel

1. Use `run_subagent` with `is_background=true` to run in parallel — spawn one wave at a time following the DAG (step 2)
2. Never send duplicate or overlapping subtasks — file sets must always be disjoint
3. Wait for results with `read_subagent` (non-blocking) or continue other work — check async, do not poll in a loop
4. A subtask that changes many files by pattern → instruct it in the prompt to use `/use-scripts` (edit workflow) or `/use-astgrep rewrite` — always dry-run first for an audit trail
5. If a subagent hits an error → run `/resolve-errors` before spawning a new one

### 5. Merge And Fix

> Goal: Merge results and fix conflicts

1. Collect output from every subagent
2. Check for conflicts between edits
3. Use `/resolve-errors` for up to 3 rounds
4. If it still fails → run `/ask-me`

### 6. Validate And Ship

> Goal: Deliver work that passes the checks

1. Run `/run-check` for the ecosystem(s) detected
2. If it passes → run `/ship`
3. If it fails → report the status and next steps
4. Run `/report` summarizing what each subagent did

## Rules

### 1. Discipline

1. `Always /follow-deep first` — never spawn subagents without deep context
2. `One role per subtask` — do not mix multiple roles in a single subagent
3. `No overlapping edits` — each subagent works on a distinct file set unless explicitly defined
4. `Merge before ship` — collect results, check conflicts, and merge before pushing or the final report
5. `Run checks after merge` — never deliver without validating
6. `Stop on 3 failures` — if resolving errors exceeds 3 rounds, stop and report
7. Use `/update-devin-global-subagents` to sync the subagent catalog if needed

### 2. Independence

- Each subtask must not depend on others — if it does, put it in the next wave per the DAG, not spawn it together
- Do not let multiple agents edit the same file — file sets must be disjoint (`∩ = ∅`) per the partition in step 2
- Use `/follow-parallel` + `/follow-math-concepts` for parallelization — no shared mutable state between agents

### 3. Clear Prompts

- Each agent must receive enough context
- Specify the deliverable, constraints, and success criteria

### 4. Merge Safely

- Check for conflicts before merging
- Keep the codebase consistent
- Run `/deep-validate` after merging

## Subagent Profiles

These skills have subagent profiles for parallel independent work — the profile lives in the parent skill's `SKILL.md` under the `## Subagents` section (there is no longer a `subagents/` folder); read that section and pass it as a prompt to the subagent via `run_subagent`; a profile too detailed to inline keeps its full content at `<skill>/references/subagent-<name>.md` and is linked from that block:

| No. | Parent Skill | Profile | Use For |
|-----|--------------|---------|---------|
| 1 | `review-github-pr` | `SKILL.md ## Subagents` → `pr-reviewer`, `pr-checklist-reviewer` (+ full detail in `references/`) | review PR slice per-domain/file-group |
| 2 | `use-agents-capture` | `SKILL.md ## Subagents` → `route-capturer` | capture one route on all devices |
| 3 | `deep-test` | `SKILL.md ## Subagents` → `route-checker` | test one API route group |
| 4 | `deep-review` | `SKILL.md` (inline dispatch contract, no profile file) | review workspace area / docs routes per section |
| 5 | `update-tests` | `SKILL.md ## Subagents` → `suite-updater` | update one test suite (unit/e2e/snapshot) |
| 6 | `update-project-all-drive-d` | `SKILL.md ## Subagents` → `project-updater` | update one project dir in drive D |
| 7 | `update-all-program-in-computer` | `SKILL.md ## Subagents` → `program-updater` | update one program via package manager |
| 8 | `resolve-github-issue-by-me` | `SKILL.md ## Subagents` → `issue-implementer` | implement one issue until PR-ready |
| 9 | `deep-research` | `SKILL.md ## Subagents` → `source-researcher` | deeply research one source/topic |
| 10 | `deep-validate` | `SKILL.md ## Subagents` → `dimension-validator` | validate one dimension pass/fail + evidence |
| 11 | `deep-review-then-fix` | `SKILL.md ## Subagents` → `fix-worker` | apply approved fixes for one module/domain |
| 12 | `sync-drive-d-submodules` | `SKILL.md ## Subagents` → `submodule-syncer` | sync one submodule on drive D |
| 13 | `merge-all-branch-by-me-to-main` | `SKILL.md ## Subagents` → `branch-merger` | merge one branch into main |
| 14 | `update-project` | `SKILL.md ## Subagents` → `project-updater`, `git-log-collector`, `project-files-updater`, `project-skills-updater`, `github-metadata-updater` | update a sub-project and collect inputs per domain |
| 15 | `follow-tool-moonrepo` | `SKILL.md ## Subagents` → `project-configurator` | configure/verify `moon.yml` for one project |
| 16 | `refactor` | `SKILL.md ## Subagents` → `hotspot-scout`, `file-worker` | collect baseline evidence (read-only) and refactor file by file in parallel |
| 17 | `implement-to-production` | `SKILL.md ## Subagents` → `feature-implementer`, `review-sweeper` | implement per item, review per domain (gap inventory → row 20) |
| 18 | `review` | `SKILL.md ## Subagents` → `codebase-reviewer` (+ checklist/scoring/report in `references/`) | codebase-wide review per dimension |
| 19 | `update-devin-global-skills` | `SKILL.md` (`## Conventions → Workflows And Subagents`, profile `skill-updater`) | update one skill per the instructions in a bulk update |
| 20 | `report-not-implement` | `SKILL.md ## Subagents` → `gap-scanner` | inventory not-yet-implemented items in one directory/workspace (read-only) |

## CLI — `subagents` (mission control)

The CLI in `src/` (Bun/TypeScript, entry `src/presentation/cli.ts`) — a ClickUp-style task table for parallel work by subagents/shell jobs:

```sh
bun src/presentation/cli.ts run "fix-lint" --role fixer --pri high -- "bunx biome check --write src"
bun src/presentation/cli.ts add "deploy" --dep build -- "..."           # blocked until dep done
bun src/presentation/cli.ts add "tests" --parent ship-feature -- "..."  # subtask (rollup 2/3)
bun src/presentation/cli.ts pump      # start all queued tasks with deps met
bun src/presentation/cli.ts list [--status failed] [--role fixer] [--q lint]
bun src/presentation/cli.ts watch     # TUI: ↑↓ · / search · f filter · s sort · p pump · r retry · k kill · d del · q
bun src/presentation/cli.ts logs|note|retry|kill|rm <id>
bun src/presentation/cli.ts prune     # remove finished tasks
```

- Columns: `STATUS · PRI · ID · SRC · ROLE · ELAPSED · SUB · NAME` — SUB shows the rollup `2/3` on a parent / `└─` on a child; the detail pane shows cmd + pending deps + last 3 log lines
- Lifecycle: `queued → (blocked if dep pending) → running → done|failed|killed` — reconcile auto-updates blocked↔queued
- State: `~/.config/devin/subagents/tasks.json` + `logs/<id>.log`; reconcile real pids every second

`Devin subagent bridge` — closes the gap that `run_subagent` is in-process: after spawning an agent, register it into the registry:

```sh
bun src/presentation/cli.ts register "<title>" --role fixer --id <agent-id> --note "<task summary>"
bun src/presentation/cli.ts mark <id> done --note "<result>"   # when read_subagent finishes
```

- Use with Step 4 (Spawn Subagents): `run_subagent` → `register` immediately; once `read_subagent` finishes → `mark done|failed` — `watch` shows both shell jobs and Devin agents in one table

## Expected Outcome

- Work is split and done in parallel by subagents
- Deep context gathered before starting edits
- Results merged with no conflicts and passing `/run-check`
- A short, clear summary report

