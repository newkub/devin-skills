---
name: list-github
description: List GitHub resources — branches, issues, PRs, projects, releases via top-level skills
argument-hint: "[domain]"
related:
  - all-github-repo
  - list-github-issue
  - list-github-pr
  - report
  - ask-me

---

## Goal

Dispatch to the top-level skill for the GitHub resource to list — the parent only routes

## Scope

- The argument is the domain; if unspecified → `/ask-me` to pick a domain

## Execute

### List Skills

| Domain | Skill |
|---|---|
| `branch` | /list-github-branch — branches in a repo |
| `issue` | /list-github-issue — issues in one repo, or `--all` for personal + orgs |
| `pr` | /list-github-pr — pull requests in one repo, or `--all` for personal + orgs |
| `project` | /list-github-project — GitHub projects |
| `release` | /list-github-release — releases |
| `repo` | /list-github-repo — repositories |
| `star` | /list-github-star-latest — starred repos |

1. Identify the domain from the argument (e.g. `/list-github-pr`)
2. When the domain is supported → call the skill from the Skill column in the table above and follow its flow
3. `issue` and `pr` accept `--all` for a cross-repo view of personal + orgs; every other domain targets a single repo
4. When the domain is missing or unknown → `/ask-me` to pick a domain

## Rules

- The parent only dispatches — never duplicate the target skill's workflow
- Use the `gh` CLI or GitHub MCP tools as available

- Use /all-github-repo if needed
- Use /report if needed

## Expected Outcome

- The caller is dispatched to the top-level skill matching the domain and listed per that flow
