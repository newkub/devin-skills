---
name: update-github-issue
description: Update title, body, comments, labels, assignees, and metadata of an existing GitHub issue
argument-hint: "[issue-number] [repo]"
related:
  - create-github-issue
  - list-github-issue
  - open-github-issue
  - ask-me
  - report-table
---

## Goal

Update an existing GitHub issue using `gh issue edit`, `gh issue comment --edit-last`, and `gh api` for older comments.

## Scope

- Update issue title, body, labels, assignees, milestone, project, type, and parent
- Add or edit comments
- Use `create-github-issue/templates/<type>.md` if reformatting the body or a comment
- Supports the current repo or `--repo owner/repo`

## Execute

### 1. Verify Target

> Goal: Confirm the issue to update

1. Run `gh auth status`
2. Run `gh issue view <number> --repo <owner/repo> --json number,title,body,comments`
3. Verify write permission on the issue
4. If the repo is not specified, use the git remote of the current directory

### 2. Update Issue Body

> Goal: Update the main issue content

1. Pick a template from `create-github-issue/templates/<type>.md`
2. Replace placeholders with the new data
3. Save to a temp file
4. Run `gh issue edit <number> --body-file <body.md>`
5. If the title needs to change, run `gh issue edit <number> --title "<title>"`

### 3. Update Comments

> Goal: Edit or add comments

1. Get comment IDs with `gh issue view <number> --comments --json comments`
2. To edit the last comment, run `gh issue comment <number> --edit-last --body-file <comment.md>`
3. To edit an older comment, use `gh api -X PATCH /repos/<owner>/<repo>/issues/comments/<comment-id> -f body=@<comment.md>`
4. To add a new comment, run `gh issue comment <number> --body-file <comment.md>`
5. To delete a comment, use `gh api -X DELETE /repos/<owner>/<repo>/issues/comments/<comment-id>` (ask the user first)

### 4. Update Metadata

> Goal: Update labels, assignees, milestones

1. Add or remove labels: `gh issue edit <number> --add-label <label> --remove-label <label>`
2. Add or remove assignees: `gh issue edit <number> --add-assignee <user> --remove-assignee <user>`
3. Change milestone: `gh issue edit <number> --milestone "<milestone>"` or `--remove-milestone`
4. Add or remove project: `gh issue edit <number> --add-project "<project>" --remove-project <id>`
5. Change type or parent: `gh issue edit <number> --type <type> --parent <number>`

### 5. Verify And Report

> Goal: Confirm the update succeeded

1. Run `gh issue view <number> --comments --json number,title,body,labels,assignees`
2. Verify the body and comments match the template
3. Report the issue URL back

## Rules

### 1. Safety

- Do not overwrite the body without user confirmation if the issue has comments from others
- Delete, remove labels, or close actions require asking the user first
- To close an issue, use `gh issue close` instead of `delete`

### 2. Templates

- When updating the body or comment of an `idea` issue, use `create-github-issue/templates/idea.md`
- The table must be `| Feature | Type | Why | Benefit | Impact | Phase | Effort | MVP Score | Risk |`
- Todo must be a table with `Action | Files | Dependencies | Workspace`
- UX/UI Sketch must be real ANSI art drawn from project analysis; the header must not contain `(ANSI)`

### 3. Reformat Existing Issues

- If the user asks to update an issue created by an older skill, read the current issue and reformat it with the new template
- If there are many comments, use a script to update them one by one
- If the type is unclear, use `/ask-me`

## Expected Outcome

- Issue body and comments are updated according to the new template
- Metadata (labels, assignees, milestone, project) is correct
- The issue URL is reported back
- No important data is lost during the update
