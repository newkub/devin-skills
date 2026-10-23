---
name: review-github-issue
description: Review GitHub issue — metadata, clarity, completeness, readiness before implementation
argument-hint: "[issue-number-or-url]"
related:
  - deep-review
  - list-github-issue
  - create-github-issue
  - update-github-issue
  - cleanup-github-issue
  - resolve-github-issue-by-me
  - implement-to-production
  - use-subagents
  - report-review
  - suggest-next-action
  - deep-thinking
  - deep-analyze
  - deep-validate
---

## Goal

Review a GitHub issue before implement — check metadata (title, labels, assignee, milestone, linked PRs) and content quality (clarity, completeness, acceptance criteria, scope), then give a readiness verdict — report-only, do not edit the issue unless the user confirms

## Scope

Use for reviewing one or many GitHub issues — the issue lives on a GitHub repo (use the `gh` CLI or github-mcp tools) — for a generic issue (files, chat, other tracker) → use `/deep-review`

- quality dimensions (`completeness`, `quality`, `rating`) reuse the checklists of `/deep-review` — never duplicate them in this skill

## Execute

Every round starts with the deep pre-pass — run `/deep-thinking` → `/deep-analyze` → `/deep-validate` before any fetch/review (convention: `update-agents-skills-global` `## Conventions → Templates` row `review-*`)

### 1. Fetch Issue Context

> Goal: pull the issue with full context

1. Take the issue number or URL from the argument — not given → `/list-github-issue` lets the user choose
2. Fetch the issue with `gh issue view <n> --json title,body,state,labels,assignees,milestone,comments,projectItems` or github-mcp `get_issue`
3. Fetch linked PRs/branches: `gh issue view <n> --json closedByPullRequestsReferences` (or `gh issue develop --list`)
4. If the repo has issue templates → compare required fields against the Forms YAML in `create-github-issue/templates/forms/`

### 2. Review Issue Metadata

> Goal: metadata correct and manageable

1. title — clearly conveys scope/type (bug/feat/chore prefix per conventions)
2. labels — has type + area + priority per repo conventions; missing → finding
3. assignee/milestone — assigned or triaged yet
4. state — open/closed consistency (closed but work remains → finding)
5. linked PRs — an issue with a PR already: check the link is correct

### 3. Review Content Quality

> Goal: the issue is clear enough to implement — follow the checklists of `/deep-review`

1. dispatch a `/deep-review` reviewer via `/use-subagents`, passing `scope`, `dimensions` (`completeness`, `quality`, `rating`), `findings-file` = the issue content from Step 1
2. Check additionally GitHub-specific: reproduction steps/expected vs actual (bug), acceptance criteria checklist, linked context (discussions/PRs), referenced screenshots/logs still accessible
3. findings ≤ 2 → the parent analyzes itself, no spawn needed

### 4. Rate Readiness

> Goal: an actionable readiness verdict

1. classify: `ready` (implement immediately), `needs-clarification` (list missing fields), `blocked` (dependency/conflict), `not-ready` (unclear scope)
2. scoring — follow `deep-review`
3. List the missing info that must be asked (via a comment on the issue when the user confirms)

### 5. Score And Report

> Goal: report with next actions

1. Run `/report-review` (table in chat, no files) — table `No.`, `Action`, `Dimension`, `Severity`, `Evidence`, `Owner skill` + score/readiness verdict
2. State recommended actions: update issue (`/update-github-issue`), implement (`/resolve-github-issue-by-me` → `/implement-to-production`), or cleanup (`/cleanup-github-issue`)
3. Run `/suggest-next-action`

## Rules

- Review only — never edit issue title/body/labels or comment without user confirm
- Focus only on the specified issue — no sweeping the whole tracker
- Every finding must have evidence: a quote from the body/comments or the missing field
- An already-closed issue → review closure quality only (close reason, resolution reference)
- Hunt sibling issues per repo with `/list-github-issue`; scaffold a missing form with `/create-github-issue`; a non-GitHub target → `/deep-review`

## Fix

> When the user confirms fixing the findings on the real issue

1. Fix metadata (title, labels, milestone) → run `/update-github-issue`
2. Add missing context → comment via `gh issue comment` once confirmed
3. The issue is ready → `/resolve-github-issue-by-me` or `/implement-to-production`
4. Duplicate/unused issue → `/cleanup-github-issue`

## Expected Outcome

- Issue metadata review: title, labels, assignee, milestone, linked PRs
- Content quality findings per completeness/quality/rating dimensions with evidence, under one score and grade
- Readiness verdict (`ready`/`needs-clarification`/`blocked`/`not-ready`) with missing info
- Clear recommended next actions
