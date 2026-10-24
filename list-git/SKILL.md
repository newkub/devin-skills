---
name: list-git
description: List git resources — branches, commits, releases, submodules, tags, worktrees via top-level skills
argument-hint: "[domain]"
related:
  - follow-tool-git
  - report
  - ask-me

---

## Goal

Dispatch to the top-level skill for the git resource to list — the parent only routes

## Scope

- The argument is the domain; if unspecified → `/ask-me` to pick a domain

## Execute

### List Skills

| Domain | Skill |
|---|---|
| `branch` | /list-git-branch — branches + merge status |
| `commit` | /list-git-commit — commit history |
| `submodules` | /git-submodule list — submodule status |
| `tags` | /list-git-tags — tags and releases |
| `worktree` | /git-worktree list — worktrees |

1. Identify the domain from the argument (e.g. `/list-git-branch`)
2. When the domain is supported → call the `/list-<parent>-<domain>` skill and follow its flow
3. When the domain is missing or unknown → `/ask-me` to pick a domain

## Rules

- The parent only dispatches — never duplicate the target skill's workflow

- Use /follow-tool-git if needed
- Use /report if needed

## Expected Outcome

- The caller is dispatched to the top-level skill matching the domain and listed per that flow
