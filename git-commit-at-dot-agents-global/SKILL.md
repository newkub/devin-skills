---
name: git-commit-at-dot-agents-global
description: Alias → /git-commit at-dot-agents (commit the global ~/.agents after validation)
argument-hint: "[message]"
related:
  - git-commit
---

## Goal

Alias of `/git-commit at-dot-agents` — commit every changed file in `~/.agents` after `check-agents-lint`, `review-dot-agents-global-and-fix`, and `deep-validate` pass

## Scope

- Use when the user calls `/git-commit-at-dot-agents-global`
- Alias stub only; the real workflow lives in [git-commit/workflows/at-dot-agents](../git-commit/workflows/at-dot-agents/SKILL.md)
- `skills/` is a git submodule, so the workflow commits there first, then the parent pointer

## Execute

1. Read `git-commit/SKILL.md` and follow the `at-dot-agents` workflow end to end
2. Do not restate the workflow here

## Rules

- Never duplicate the `git-commit/workflows/at-dot-agents` workflow in this file
- If this stub lacks a step → always read the workflow file
- To push afterwards → use `/git-commit-and-push` with confirmation

## Expected Outcome

- `/git-commit at-dot-agents` runs through every step until the commit succeeds and the working tree is clean
