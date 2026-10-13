---
name: ship-to-dev-branch
description: Ship work into the dev branch — /ship-verify gate then /git-commit-and-push into dev
argument-hint: "[@issue-number-or-title|dont-ask-me]"
triggers:
  - user
  - model
related:
  - ship-verify
  - follow-agents-md
  - git-commit-and-push
  - git-branch
  - ship-to-main-branch
  - ship-release
  - dont-ask-me
---

## Goal

Ship work into the `dev` branch in two steps — `/ship-verify` always as the gate first, then `/git-commit-and-push` into `dev`

## Scope

- **Target = `dev` branch only** — merging into `main` goes through `/ship-to-main-branch`; releasing goes through `/ship-release`
- All verify workflow lives in `/ship-verify` (canonical) — this skill does not duplicate it
- `dont-ask-me` argument or a session with `/dont-ask-me` active → pass the same mode through to every step

## Execute

### 1. Ship Verify

> Goal: work passes the full verification gate before push

1. Run `/ship-verify` with all the original arguments — verify every gate (AGENTS.md, review, validate, tests, dev run, usage)
2. If `/ship-verify` fails → fix the blockers and verify again — never skip ahead to push

### 2. Ship To Dev

> Goal: changes on `origin/dev`

1. Check/switch to the `dev` branch per `/git-branch` (create it from `main` if missing)
2. Run `/git-commit-and-push` — commit changes + push into `origin/dev` + resolve CI/CD until green
3. When done, suggest `/ship-to-main-branch` as the next action (merge into main), or `/ship-release` if a release is needed

## Rules

- Never duplicate the verify workflow here — the canonical version lives only in `/ship-verify`
- Push into `dev` only — never merge/push into `main` (`/ship-to-main-branch` does that), never release (`/ship-release` does that)
- If `/ship-verify` fails → never push — fix until it passes, or stop + report

## Expected Outcome

- `/ship-verify` passes every gate
- Code pushed successfully to `origin/dev` with green CI/CD — merging into `main` continues via `/ship-to-main-branch`
