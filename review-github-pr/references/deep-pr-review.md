# Deep PR Review

Use when a PR needs a detailed review — reply to comments, resolve conversations, and ask the user before merge

## Execute

### 1. Reply To Comments

> Goal: reply to comments in the PR

1. Read every comment that is not yet resolved
2. Answer according to context:
   - If the comment is correct, fix the code → leave a short comment with the commit SHA
   - If the comment needs an explanation → reply with evidence
   - If the comment is a false positive → clarify
3. Use `gh pr review <pr-number> --comment` to reply
4. Use `gh api repos/{owner}/{repo}/pulls/comments/{id}/replies` if needed

### 2. Resolve Findings

> Goal: fix the issues found

1. If changes are required → implement according to severity
2. Run `/run-check`, `/run-test` after fixing
3. Run `/git-push`, never force
4. If the commits on the PR branch are messy → run `/refactor-commit` before push or merge
5. Open the web for the user to see the diff or PR

### 3. Ask To Merge

> Goal: let the user decide whether to merge

1. Summarize findings + resolved comments
2. Run `/open-web` to open the PR
3. Ask the user whether to merge
4. If yes → run `/merge-github-pr` or `gh pr merge`
5. If no → report next actions

## Rules

- Never merge on your own unless the user tells you to
- Every conversation must be resolved before merge
- CI must pass before merge
- If there is a change, push it back to the PR branch
- Use evidence when replying to comments
