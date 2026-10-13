---
name: update-github-issue
description: Edit GitHub issue title, body, comments, labels, assignees, metadata with `gh issue edit`
argument-hint: "[issue-number] [repo]"
related:
  - create-github
  - ask-me

---

## Goal

Edit an existing GitHub issue with `gh issue edit`, `gh issue comment --edit-last`, and `gh api` for old comments

## Scope

- Edit issue title, body, labels, assignees, milestone, project, type, parent
- Add or edit comments
- Use `create-github-issue/templates/<type>.md` if you need to reformat a body or comment
- Supports the current repo, or `--repo owner/repo`

## Execute

### 1. Verify Target

> Goal: Confirm the issue to edit

1. Run `gh auth status`
2. Run `gh issue view <number> --repo <owner/repo> --json number,title,body,comments`
3. Verify write permission on the issue
4. If no repo is specified, use the current directory's git remote

### 2. Update Issue Body

> Goal: Edit the issue's main content

1. Select a template from `create-github-issue/templates/<type>.md`
2. Replace the placeholders with new data
3. Save to a temp file
4. Run `gh issue edit <number> --body-file <body.md>`
5. If you need to change the title, run `gh issue edit <number> --title "<title>"`

### 3. Update Comments

> Goal: Edit or add comments

1. Fetch comment IDs with `gh issue view <number> --comments --json comments`
2. Edit the latest comment: `gh issue comment <number> --edit-last --body-file <comment.md>`
3. Edit an old comment: `gh api -X PATCH /repos/<owner>/<repo>/issues/comments/<comment-id> -f body=@<comment.md>`
4. Add a new comment: `gh issue comment <number> --body-file <comment.md>`
5. Delete a comment: `gh api -X DELETE /repos/<owner>/<repo>/issues/comments/<comment-id>` (ask the user first)

### 4. Update Metadata

> Goal: Edit labels, assignees, milestones

1. Add/remove labels: `gh issue edit <number> --add-label <label> --remove-label <label>`
2. Add/remove assignees: `gh issue edit <number> --add-assignee <user> --remove-assignee <user>`
3. Change milestone: `gh issue edit <number> --milestone "<milestone>"` or `--remove-milestone`
4. Add/remove project: `gh issue edit <number> --add-project "<project>" --remove-project <id>`
5. Change type or parent: `gh issue edit <number> --type <type> --parent <number>`

### 5. Verify And Report

> Goal: Confirm the edit succeeded

1. Run `gh issue view <number> --comments --json number,title,body,labels,assignees`
2. Verify the body and comments match the template
3. Report the issue URL back

## Rules

### 1. Safety

- If the issue has comments from others, do not overwrite the body without user confirmation
- Removing labels or closing the issue requires asking the user first
- To close an issue, use `gh issue close`, not delete

### 2. Templates

- When editing the body or comment of an `idea` issue, use `create-github-issue/templates/idea.md`
- The table must be `| Feature | Type | Why | Benefit | Impact | Phase | Effort | MVP Score | Risk |`
- Todo must be a table `Action | Files | Dependencies | Workspace`
- UX/UI Sketch must be ANSI art from the real project analysis; headings must not contain `(ANSI)`

### 3. Reformat Existing Issues

- If the user asks to edit an issue created by an old skill, read the current issue and reformat it with the new template
- If there are multiple comments, use a script to update them one at a time
- If the type is unclear, use `/ask-me`

## Expected Outcome

- The issue body and comments are updated per the new template
- Metadata (labels, assignees, milestone, project) is correct
- The issue URL is reported back
- No important data is lost during the update
