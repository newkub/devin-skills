---
name: update-github-pr
description: Update title, body, labels, reviewers, and base branch of an existing GitHub pull request
argument-hint: "[pr-number] [repo]"
related:
  - create-github-pr
  - view-pr
  - list-github-pr
  - open-github-pr
  - ask-me
  - report-table
---

## Goal

Update an existing GitHub pull request using `gh pr edit`, `gh pr comment`, and `gh api`.

## Scope

- Update PR title, body, labels, reviewers, base branch, and draft status
- Add, edit, or reply to comments
- Supports the current repo or `--repo owner/repo`

## Execute

### 1. Verify Target

> Goal: Confirm the PR to update

1. Run `gh auth status`
2. Run `gh pr view <number> --repo <owner/repo> --json number,title,body,state,headRepositoryOwner,headRefName,baseRefName`
3. Verify write permission on the PR
4. If the repo is not specified, use the git remote of the current directory

### 2. Update PR Body

> Goal: Update the main PR content

1. Read the PR template from `.github/PULL_REQUEST_TEMPLATE.md` or `create-github-pr/templates/pr.md` if available
2. Replace placeholders with the new data
3. Save to a temp file
4. Run `gh pr edit <number> --body-file <body.md>`
5. If the title needs to change, run `gh pr edit <number> --title "<title>"`

### 3. Update PR Metadata

> Goal: Update labels, reviewers, base, and draft status

1. Add or remove labels: `gh pr edit <number> --add-label <label> --remove-label <label>`
2. Add reviewers: `gh pr edit <number> --add-reviewer <user>`
3. Change base branch: `gh pr edit <number> --base <branch>`
4. Change draft status:
   - Mark as ready: `gh pr ready <number>`
   - Convert to draft: `gh pr ready <number> --undo`

### 4. Update Comments

> Goal: Edit or add comments in the PR

1. Get comment IDs with `gh pr view <number> --comments --json comments`
2. To edit an old comment, use `gh api -X PATCH /repos/<owner>/<repo>/issues/comments/<comment-id> -f body=@<comment.md>`
3. To add a new comment, run `gh pr comment <number> --body-file <comment.md>`
4. To reply with a review comment, run `gh pr review <number> --comment -b "<body>"`

### 5. Verify And Report

> Goal: Confirm the update succeeded

1. Run `gh pr view <number> --comments --json number,title,body,labels,reviewers`
2. Verify the body and comments
3. Report the PR URL back

## Rules

### 1. Safety

- Do not overwrite the PR body without user confirmation if the PR has comments from others
- Delete, remove comments, or force-push require asking the user first
- Do not change the base branch if it would cause conflicts without notifying the user

### 2. Templates

- When updating the PR body, use the repo's PR template first
- If there is no repo template, use `create-github-pr/templates/pr.md` or create one
- If the PR is about `idea` features, use `create-github-issue/templates/idea.md` for feature comments if needed

### 3. Review Workflow

- To request a review, run `gh pr edit <number> --add-reviewer <user>`
- To resolve a conversation, use `gh pr review <number> --comment` or `gh api`
- To merge the PR, hand off to `/merge-github-pr` or `/resolve-github-pr`

## Expected Outcome

- PR title, body, labels, reviewers, base branch, and draft status are updated as requested
- Comments are added or edited correctly
- The PR URL is reported back
- No important data is lost during the update
