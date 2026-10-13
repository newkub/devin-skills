---
name: ship-run
description: Verify first — /ship-verify passes, then /run-dev keeps the dev server up for real use
argument-hint: "[scope] [dont-ask-me]"
triggers:
  - user
  - model
related:
  - ship-verify
  - run-dev
  - ship-to-dev-branch
  - test-usage
  - watch-browser-and-fix
  - resolve-errors
  - report
  - suggest-next-action
  - dont-ask-me
---

## Goal

A ship-quality run in two steps — `/ship-verify` always as the gate first; once everything passes, `/run-dev` starts the dev server and keeps it up for real use with continuous watching

## Scope

- Use when you want work verified first and then the dev server left running for continued use, in a single command — unlike `/ship-verify`, where `/run-dev` is only a health-check gate and then ends (this skill keeps the server up + watches long-running)
- **No push, no ship** — verify + run only; shipping into `dev` goes through `/ship-to-dev-branch`
- All verify workflow lives in `/ship-verify` (canonical) and the run workflow in `/run-dev` (canonical) — this skill does not duplicate them
- `dont-ask-me` argument or a session with `/dont-ask-me` active → pass the same mode through to every step

## Execute

### 1. Ship Verify

> Goal: work passes every verification gate before running

1. Run `/ship-verify` with all the original arguments — verify every gate (AGENTS.md, review, validate, tests, dev run health check, usage)
2. If `/ship-verify` fails → fix the blockers and verify again — never skip ahead to run

### 2. Run Dev

> Goal: dev server left running, usable and watched

1. Run `/run-dev` with the original scope — the dev server must be healthy and stay up, not stopping after the health check
2. web project → open the browser at the dev URL and continue `/watch-browser-and-fix` per the `/run-dev` workflow
3. Errors found during watching → `/resolve-errors` immediately per the `/run-dev` rules

### 3. Report

> Goal: summarize verify + run status

1. Run `/report` — table: `No. | Gate | Result | Evidence` + dev server status (URL, port, watch state)
2. Everything passed → suggest `/ship-to-dev-branch` as the next action when ready to push
3. Run `/suggest-next-action`

## Rules

- `/ship-verify` must always pass first — never run a dev server on work that failed verification
- Never duplicate the verify/run workflow here — the canonical versions live only in `/ship-verify` and `/run-dev`
- No `git commit`, `git push`, merge, or release in this skill — ship goes through `/ship-to-dev-branch`
- Project has no dev server → run `/ship-verify` alone and report with the reason — `/ship-run` does not apply

## Expected Outcome

- `/ship-verify` passes every gate
- The dev server stays running, healthy, with no critical errors, with continuous terminal/browser watching
- A clear report that it is ready-to-use, with the dev URL and next action
