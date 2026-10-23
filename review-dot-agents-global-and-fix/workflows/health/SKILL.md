---
name: review-dot-agents-global-and-fix-health
description: Score harness health across validation, refs, git state, and activity
related:
  - review-dot-agents-global-and-fix
  - check-uncommit
  - check-unpush

---

## Goal

Build one health scorecard for `~/.agents` from validation, references, git state, activity, and structure signals

## Scope

- Signals come from real tools only; never score from assumption
- Read-only — report only, no commits and no pushes
- Boundary: layer findings in detail → `/review-dot-agents-global-and-fix` domain `review`

## Execute

### 1. Collect Signals

> Goal: gather every measurable signal

1. Run `/review-dot-agents-global-and-fix` domain `review` and record score, findings, and grade
2. Record the broken reference count from that same pass
3. `/check-uncommit` → modified and untracked files
4. `/check-unpush` → unpushed commits
5. `/check-git-logs` → last commit, frequency, staleness
6. `/check-long-files` → files over 250 lines

### 2. Score Dimensions

> Goal: score each dimension 0-100

| No. | Dimension | Weight | Signal |
|---|---|---|---|
| 1 | Validation | 30% | review score and findings |
| 2 | References | 25% | broken reference count |
| 3 | Git Clean | 20% | uncommitted and unpushed state |
| 4 | Activity | 15% | last commit and staleness |
| 5 | Structure | 10% | line count and naming conventions |

1. Compute each dimension from its signal
2. Weight them into one overall score and grade A-F

### 3. Report Scorecard

> Goal: summarize the result in one table

1. `/report` table columns: No., Dimension, Score, Weight, Status, Notes
2. Status text: `pass`, `warning`, `fail`, `info` — no emoji
3. Show the overall grade and the top issues dragging it down
4. Multiple rounds or repos → `/report-progress`

### 4. Recommend

> Goal: propose the next action

1. Grade below B → fix findings before proceeding
2. Broken refs → `/update-references`
3. Uncommitted changes → `/git-commit`
4. Unpushed commits → `/git-push`
5. Several fixes that must land safely together → `/apply` mode `validate`
6. Close with `/suggest-next-action`

## Rules

- Every score must trace to a tool result
- Never edit files, commit, or push in this workflow
- Skip heavy checks when a cached result is current
- Never use `**` bold

## Expected Outcome

- A numbered scorecard with weights, scores, and status per dimension
- An overall grade with the top issues
- Recommended next actions tied to the weakest dimensions
