---
name: run-review
description: alias → /update-review-cli-then-run (run the review CLI, analyze results, suggest actions)
argument-hint: "[target]"
related:
  - update-review-cli-then-run
  - deep-review-codebase
  - run-verify
  - suggest-next-action
---

## Goal

Alias of `/update-review-cli-then-run` — run the `tools/review-codebase` CLI, analyze the results, and suggest action items based on findings

## Scope

Use when the user invokes `/run-review` — this skill is just an alias stub; the real workflow lives in `update-review-cli-then-run`

## Execute

Run the full `/update-review-cli-then-run` workflow — the run path is Steps 7-10 (Validate CLI → Run Review And Analyze → Verify And Follow Tasks → Report And Suggest Actions); if the CLI needs updating first, start at Steps 1-6

- If the analyzer logic needs changes → run `/update-create-analyze-cli` first, then come back to this skill
- Known Issues live only in `update-review-cli-then-run/references/known-issues.md` (single source)

## Rules

- Never duplicate the `/update-review-cli-then-run` workflow in this file
- If the alias is missing steps → always read `update-review-cli-then-run/SKILL.md`
- If the review needs to be broader than the CLI → use `/deep-review-codebase`; to drill into `.devin`, use `/deep-review-codebase`
- Verify the results after review with `/run-verify`, then close with `/suggest-next-action`

## Expected Outcome

- `/update-review-cli-then-run` is executed fully along the run path, with action items from the findings
