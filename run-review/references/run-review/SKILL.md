---
name: run-review/references/run-review
description: Define and run the review script in package.json.
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

Run Review\References\Run Review

## Scope

Use `run-review\references\run-review` for the specific tasks and workflows it covers

## Execute

1. /follow-global-workflows
2. /run-lint
3. /run-build
4. /run-test
5. run review ใน package.json
6. /git-commit

## Rules

- Follow the project conventions and global rules
- Use the allowed tools only when needed

## Expected Outcome

Completed `run-review\references\run-review` workflow with correct output
