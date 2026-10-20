---
name: resolve-github-pr
description: Resolve pull requests via merge, squash, or rebase per project conventions
argument-hint: "[scope]"
related:
  - merge
---

## Goal

Resolve pull requests using the method appropriate for the project conventions and check quality

## Scope

- Inspect the PR before merge (CI checks, reviews, approvals)
- Choose the appropriate merge method (merge, squash, rebase)
- Merge the PR and update the branch
- Close the related issue (if any)
- Delete the merged branch

## Execute

### 1. Verify PR Readiness

> Goal: Check that the PR is ready to merge

1. Check that all CI checks pass
2. Check that there are approvals from the required reviewers
3. Check that review comments are resolved
4. Check that there are no conflicts
5. Check that the current branch is synced with the remote

### 2. Review Changes

> Goal: Inspect the changes in detail before merge

1. Read the PR diff in detail
2. Check that the changes match the description
3. Check that there are no unintended changes
4. Check that the code quality meets the standards
5. Check that the tests cover the changes

### 3. Choose Merge Method

> Goal: Choose the merge method per project conventions

Choose the merge method per project conventions:

- Merge: for PRs with important historical context
- Squash: for PRs with many commits but needing a clean history
- Rebase: for a linear history and avoiding merge commits

### 4. Merge PR With MCP Tool

> Goal: Perform the PR merge with the MCP tool

1. Use `mcp3_merge_pull_request`
2. Specify owner, repo, pullNumber
3. Choose merge_method (merge, squash, rebase)
4. Add commit_title and commit_message if necessary
5. Check that the merge succeeded

### 5. Post-Merge Actions

> Goal: Perform actions after merge such as deleting the branch and closing the issue

1. Check that the issue is closed automatically (if there is `Closes #issue`)
2. Delete the merged branch (both local and remote)
3. Update the changelog if necessary
4. Create release notes if necessary
5. Notify the team that the PR is merged

## Rules

### 1. Merge Method Selection

Use the following criteria:

| Method | When to Use | Pros | Cons |
|--------|-------------|------|------|
| Merge | PRs with important historical context | Preserve history | Many merge commits |
| Squash | PRs with many commits but needing a clean history | Clean linear history | Lose commit details |
| Rebase | Linear history and avoiding merge commits | Clean history | Can cause conflicts |

### 2. Pre-Merge Checklist

Must check before merge:

- [ ] All CI checks pass
- [ ] Required approvals received
- [ ] All review comments resolved
- [ ] No merge conflicts
- [ ] Branch synced with remote
- [ ] Changes match description
- [ ] Code quality meets standards
- [ ] Tests cover changes

### 3. Commit Message

When using squash or merge:

- Use the conventional commit format
- Include details from the PR description
- Add the issue reference if necessary
- Example: `feat(auth): add OAuth2 login support (#123)`

### 4. Branch Cleanup

After merge:

- Delete the local branch: `git branch -d branch-name`
- Delete the remote branch: `git push origin --delete branch-name`
- Avoid leaving unused branches around

### 5. Issue Resolution

Link the PR to the issue:

- Use `Closes #issue-number` in the PR description
- Or use `Fixes #issue-number` for bug fixes
- Or use `Refs #issue-number` for tracking
- GitHub closes the issue automatically when the PR merges

- Use /create-github-pr if necessary
- Use /list-github-pr if necessary
- Use /merge-github-pr if necessary

## Expected Outcome

- The PR is merged with the appropriate method
- All CI checks pass
- Review comments are resolved
- The related issue is closed (if any)
- The merged branch is deleted
- The team is notified

## Common Mistakes

- Merging without checking CI checks
- Choosing an inappropriate merge method
- Not deleting the merged branch
- Not checking review comments before merge
- Merging without approvals

## Anti-Patterns

- Force merge when CI checks fail
- Merge without review
- Merge without resolving conflicts
- Using rebase on shared branches
- Merge without linking to the issue
