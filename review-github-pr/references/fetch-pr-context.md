# Fetch PR Context

## Goal

Gather all PR data

## Checks

1. If there is a PR number → run `gh pr view <pr>` and `gh pr diff <pr>` — if not → run `git diff <base>..<head>` and `git log --oneline <base>..<head>`
2. Record the data: title, description, author, base branch, commits, files changed, additions/deletions, labels, checks
3. Determine the PR domain: frontend, backend, infrastructure, docs, config, test, library
4. If using GitHub → run `gh pr checks <pr>` to see the CI status
