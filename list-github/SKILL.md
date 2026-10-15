---
name: list-github
description: List GitHub resources — branches, issues, PRs, projects, releases via top-level skills
argument-hint: "[domain]"
related:
  - all-github-repo
  - list-all-github-issue
  - list-all-github-pr
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
| `all-issue` | /list-all-github-issue — issues across all repos of personal + orgs |
| `all-pr` | /list-all-github-pr — pull requests across all repos of personal + orgs |
| `branch` | /list-github-branch — branches in a repo |
| `issue` | /list-github-issue — issues with filters |
| `pr` | /list-github-pr — pull requests with status |
| `project` | /list-github-project — GitHub projects |
| `release` | /list-github-release — releases |
| `repo` | /list-github-repo — repositories |
| `star` | /list-github-star-latest — starred repos |

1. Identify the domain from the argument (e.g. `/list-github-pr`)
2. When the domain is supported → call the skill from the Skill column in the table above and follow its flow
3. The `all-*` domains are a cross-repo view of personal + orgs; other domains target a single repo
4. When the domain is missing or unknown → `/ask-me` to pick a domain

## Rules

- The parent only dispatches — never duplicate the target skill's workflow
- Use the `gh` CLI or GitHub MCP tools as available

- Use /all-github-repo if needed
- Use /report if needed

## Expected Outcome

- The caller is dispatched to the top-level skill matching the domain and listed per that flow
