---
name: cleanup
description: Clean unused resources — branches, worktrees, docker, github issues via top-level skills
argument-hint: "[domain]"
related:
  - cleanup-project
  - cleanup-disk-computer
  - cleanup-artifact
  - ask-me

---

## Goal

Dispatch to the target skill based on the cleanup domain — the parent only routes

## Scope

- The argument is the domain; if not provided → `/ask-me` picks the domain

## Execute

### Skills

| Domain | Skill |
|---|---|
| `artifact` | /cleanup-artifact — build artifacts + dependency caches (Rust CLI, dry-run first) |
| `docker` | /cleanup-docker — unused images, containers, volumes |
| `git-branch` | /delete-git-branch — merged sweep, individual, or abandoned branches |
| `github-issue` | /cleanup-github-issue — old or resolved issues |
| `worktree` | /git-worktree cleanup — unused git worktrees |

1. Identify the domain from the argument (e.g. `/cleanup-artifact`)
2. If the domain is supported → follow the `/cleanup-<domain>` flow end to end
3. If no domain is given or it is unknown → `/ask-me` picks the domain

## Rules

- The parent only dispatches — never duplicate the target skill's workflow
- Every cleanup must dry run + user confirm before actually deleting (per the target skill's rule)

- Use /cleanup-project if needed
- Use /cleanup-disk-computer if needed
- Use /cleanup-artifact if needed

## Expected Outcome

- The caller is dispatched to the target skill matching the domain, then cleans up following that flow
