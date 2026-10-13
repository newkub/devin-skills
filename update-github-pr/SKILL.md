---
name: update-github-pr
description: Edit GitHub pull request title, body, labels, reviewers, base branch with `gh pr edit`
argument-hint: "[pr-number] [repo]"
related:
  - create-github
  - merge
  - resolve-github-pr

---

## Goal

Edit an existing GitHub pull request with `gh pr edit`, `gh pr comment`, and `gh api`

## Scope

- Edit PR title, body, labels, reviewers, base branch, draft status
- Add, edit, or reply to comments
- Supports the current repo, or `--repo owner/repo`

## Execute

### 1. Verify Target

> Goal: Confirm the PR to edit

1. Run `gh auth status`
2. Run `gh pr view <number> --repo <owner/repo> --json number,title,body,state,headRepositoryOwner,headRefName,baseRefName`
3. Verify write permission on the PR
4. If no repo is specified, use the current directory's git remote

### 2. Update PR Body

> Goal: Edit the PR's main content

1. Read the PR template from `.github/PULL_REQUEST_TEMPLATE.md` or `create-github-pr/templates/pr.md` if present
2. Replace the placeholders with new data
3. Save to a temp file
4. Run `gh pr edit <number> --body-file <body.md>`
5. If you need to change the title, run `gh pr edit <number> --title "<title>"`

### 3. Update PR Metadata

> Goal: Edit labels, reviewers, base, and draft status

1. Add/remove labels: `gh pr edit <number> --add-label <label> --remove-label <label>`
2. Add reviewers: `gh pr edit <number> --add-reviewer <user>`
3. Change base branch: `gh pr edit <number> --base <branch>`
4. Change draft status:
   - Mark as ready: `gh pr ready <number>`
   - Convert to draft: `gh pr ready <number> --undo`

### 4. Update Comments

> Goal: Edit or add comments in the PR

1. Fetch comment IDs with `gh pr view <number> --comments --json comments`
2. Edit an old comment: `gh api -X PATCH /repos/<owner>/<repo>/issues/comments/<comment-id> -f body=@<comment.md>`
3. Add a new comment: `gh pr comment <number> --body-file <comment.md>`
4. Reply with a review comment: `gh pr review <number> --comment -b "<body>"`

### 5. Verify And Report

> Goal: Confirm the edit succeeded

1. Run `gh pr view <number> --comments --json number,title,body,labels,reviewers`
2. Verify the body and comments
3. Report the PR URL back

## Rules

### 1. Safety

- If the PR has comments from others, do not overwrite the PR body without user confirmation
- Removing comments or force-pushing requires asking the user first
- Changing the base branch can cause conflicts; notify the user first

### 2. Templates

- When editing the PR body, use the repo PR template first
- If there is no template, use `create-github-pr/templates/pr.md` or create a new one
- If the PR is about `idea` features, use `create-github-issue/templates/idea.md` for feature comments if needed

### 3. Review Workflow

- Request review with `gh pr edit <number> --add-reviewer <user>`
- Resolve a conversation with `gh pr review <number> --comment` or `gh api`
- To merge the PR, hand off to `/merge-github-pr` or `/resolve-github-pr`

## Expected Outcome

- PR title, body, labels, reviewers, base branch, and draft status are edited as requested
- Comments are added or edited correctly
- The PR URL is reported back
- No important data is lost during the update
