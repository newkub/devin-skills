---
name: review-github-pr-report-comments
description: Build a PR review comment set — inline comments with file/line + a summary comment
argument-hint: "[pr-number]"
related:
  - report
  - merge
---

## Goal

Turn the findings of `/review-github-pr` into review comments — inline comment format with file/line + suggestion, ready to paste or submit through GitHub

## Scope

- Use when `/review-github-pr` dispatches to `comments`/`report-comments`, or call standalone with existing findings
- Output: a comment set in chat (draft) — never submit to GitHub without user confirmation

## Execute

### 1. Format Inline Comments

> Goal: each finding becomes an actionable comment

1. Per finding: `file:line`, comment body — the problem + rationale + suggestion (code block when the fix is short)
2. tone: a professional reviewer — state the problem and the fix, don't nitpick what has no impact
3. severity tag at the head of the comment: `[critical]`/`[suggestion]`/`[nit]` — nits separated at the end

### 2. Build Summary Comment

> Goal: the overview the author reads first

1. verdict: approve / request-changes / comment-only with reasons
2. findings summary table: `No.`, `File`, `Severity`, `Issue`
3. what was done well — acknowledge correct work, not just complaints

### 3. Order And Output

> Goal: comments ordered by importance

1. Critical/High inline comments first → suggestions → nits
2. Limit nit comments — beyond ~3, consolidate them into a single style note
3. Report the draft in chat — submit only when the user confirms (`/open-web` or gh CLI, per the user's choice)

## Rules

- Every inline comment must have a file path + line that exists in the diff only — a comment on an unchanged line cannot be attached
- Do not create new findings — this report only formats existing findings
- Never submit automatically — draft first, confirm before submitting

## Expected Outcome

- Inline comment drafts with file/line + suggestion
- Summary comment with verdict — ready to submit after confirmation
