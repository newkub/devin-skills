---
name: create-github-issue
description: Create, search, view, edit, close, reopen, delete, and manage GitHub issues via the `gh` CLI
argument-hint: "[action] [repo]"
related:
  - follow-github-issue-templates
  - implement-github-issue
  - create-github-pr
  - update-github-issue
  - update-github-pr
  - ask-me
  - open-github-issue
  - open-github-pr
  - list-github-issue
  - open-github-repo
  - open-github-repo-personal
  - open-github-repo-org
  - open-web
  - report-ansi
  - report-uxui-sketch
---

## Goal

Use `gh issue` to create, search, view, edit, close, reopen, delete, and manage repository issues through the CLI in both interactive and scripted modes.

## Scope

- For skills: `open-github-issue`, `open-github-pr`, `list-github-issue`, `follow-github-issue-templates`, `create-github-pr`, `review-github-issue`, `update-github-issue`
- Supports the current repo or `--repo owner/repo`
- Not a full project management tool

See also: `/implement-github-issue`, `/ask-me`, `/open-github-repo`, `/open-github-repo-personal`, `/open-github-repo-org`

## Execute

### 1. Verify Repository And Auth

> Goal: Confirm the target repo

1. Run `gh auth status`
2. Run `gh repo view` to inspect the current repo
3. If outside the repo, use `--repo owner/repo` for every command
4. Verify permission to create/edit issues

### 2. List And View Issues

> Goal: Search and inspect issues

1. `gh issue list --state all --limit 50` for open/closed
2. `gh issue list --label <label> --assignee <user>` to filter
3. `gh issue view <number>` for details
4. `gh issue view <number> --comments` for comments
5. `gh issue view <number> --web` to open in browser

### 3. Check Duplicates

> Goal: Avoid creating duplicate issues

1. `gh issue list --search "<title>" --limit 10`
2. If duplicate → update the existing issue and note `duplicateOf`
3. If not duplicate → create a new one

### 4. Use Issue Template

> Goal: Format the body according to the issue type

1. If the repo has `.github/ISSUE_TEMPLATE/*.yml` → use repo templates
2. If the repo has no templates → read `create-github-issue/templates/index.md` and pick the matching type:
   - `bug` → `templates/bug.md`
   - `feature` → `templates/feature.md`
   - `idea` → `templates/idea.md`
   - `plan` → `templates/plan.md`
   - `question` → `templates/question.md`
3. If the type is `idea` → draw the ANSI UI sketch yourself by reading the actual project files, not by generating it from a placeholder. Put the real sketch inside the code fence.
4. Read the selected template and replace placeholders with real data.
5. Title must be English Title Case, max 80 characters.
6. Description must be English, except for technical terms, project/skill names, paths, and commands.

### 5. Create Issue

> Goal: Create an issue on GitHub

1. `gh issue create` interactively
2. Or `gh issue create --title "<title>" --body "<body>"`
3. Or `gh issue create -F body.md` to read the body from a file
4. Add `--label`, `--assignee`, `--milestone`, `--project`, `--type`, `--parent` as needed
5. If it is a project item → `gh project item-add <project-id>`
6. Use `--web` to open the create page in a browser

### 5.5 Create Idea-Feature Comments

> Goal: Add one comment per feature idea using the `idea` template

1. Read `create-github-issue/templates/idea.md`
2. Replace placeholders:
   - `{{number}}`, `{{feature}}`, `{{type}}`, `{{why}}`, `{{benefit}}`, `{{impact}}`, `{{phase}}`, `{{effort}}`, `{{mvpScore}}`, `{{risk}}`
   - `{{uxui-sketch}}` with a real ANSI box-drawing sketch drawn from actual project analysis
   - `{{todo-table}}` with rows of `| action | files | dependencies | workspace |`
3. Verify the format:
   - The table must be `| Feature | Type | Why | Benefit | Impact | Phase | Effort | MVP Score | Risk |`
   - The table header, separator, and every row must each be on a single line; do not insert line breaks inside any table cell
   - Count `|` to confirm the summary row has exactly 10 pipes (9 columns) and the Todo row has exactly 5 pipes (4 columns)
   - `Todo` must be a table with columns `Action`, `Files`, `Dependencies`, `Workspace`
   - `UX/UI Sketch` must be real ANSI art, not a text description; the header must not contain `(ANSI)`
4. Post with `gh issue comment <number> --body-file <comment.md>`

### 6. Update And Edit Issues

> Goal: Update metadata and content

1. `gh issue edit <number> --title "<title>" --body "<body>"`
2. `gh issue edit <number> --add-label bug --remove-label duplicate`
3. `gh issue edit <number> --add-assignee <user> --remove-assignee <user>`
4. `gh issue edit <number> --add-project "<title>" --remove-project <id>`
5. `gh issue edit <number> --milestone "v1.0"` or `--remove-milestone`
6. `gh issue edit <number> --type Bug --parent <number>`

For full update workflows, also use `/update-github-issue`.

### 7. Manage Issue Lifecycle

> Goal: Close, reopen, comment, move, delete

1. `gh issue close <number>` or `gh issue reopen <number>`
2. `gh issue comment <number> --body "<comment>"`
3. `gh issue pin <number>` / `gh issue unpin <number>`
4. `gh issue lock <number>` / `gh issue unlock <number>` with care
5. `gh issue transfer <number> <owner/repo>` to move
6. `gh issue delete <number> --yes` must ask the user first; prefer `close` over `delete`

### 8. Verify And Report

> Goal: Confirm success and deliver

1. Verify the issue was created/edited successfully
2. `gh issue view <number>` for final inspection
3. After creating, open in browser with `/open-web` or `gh issue view <number> --web`
4. Report the issue URL back

## Rules

### 1. Repository Target

- `gh issue` uses the repo from the current directory's git remote
- Use `--repo owner/repo` or `-R` for other repos

### 2. Language

- Title and description must be in English
- Exception: technical terms, project/skill names, paths, commands, and repo conventions defined in another language
- If repo conventions do not specify a language, default to English

### 3. Issue Title

- Start with the issue type (`Bug:`, `Feature:`, `Enhancement:`, `Docs:`)
- Use Title Case
- Max 80 characters
- Example: `Bug: Login fails after timeout`

### 4. Issue Description

- Use `create-github-issue/templates/<type>.md` based on the selected type
- Replace placeholders with real data
- If the type is `idea`, use `templates/idea.md` with the `Feature | Type | Why | Benefit | Impact | Phase | Effort | MVP Score | Risk` table, real ANSI sketch, and a `Todo` table with `Action | Files | Dependencies | Workspace`
- The summary and Todo tables must have each row on a single line; do not insert line breaks inside table cells
- If the type does not match any template → use `bug.md` as a base and adjust

### 5. Labels Convention

| Category | Labels |
|----------|--------|
| Type | bug, feature, enhancement, documentation, refactor |
| Priority | critical, high, medium, low |
| Status | triage, in-progress, review, done |
| Component | frontend, backend, database, api, ui |

### 6. Issue Relations

- `blockedBy`: issue that must be resolved first
- `blocks`: issue blocked by this one
- `relatedTo`: related but not blocking
- `duplicateOf`: duplicate issue

### 7. Assignees

- Set one primary assignee
- Avoid multiple assignees unless required
- Use the correct GitHub username

### 8. Update Existing Issues

- Do not overwrite the body without user confirmation if the issue has comments from others
- Use `--add-label` and `--remove-label`
- Use `--add-assignee` and `--remove-assignee`
- Verify the issue after updating

### 9. Safety

- `delete`, `close`, `lock`, and `transfer` are destructive; ask the user first
- Verify the issue number/repo before changing state
- Use `gh issue close` instead of `delete` if you only want to close

### 10. Interactive And Script Mode

- In a TTY, `gh issue create` prompts for title/body if flags are missing
- In scripts/CI, always provide full flags to avoid interactivity
- Use `--json` or `--jq` for JSON output
- Use `--template` to format output

### 11. CLI Reference

| Command | Description | Common Options |
|---------|-------------|----------------|
| `gh issue list` | List issues | `-R`, `--state`, `--label`, `--assignee`, `--limit` |
| `gh issue view <id>` | View issue | `-R`, `--comments`, `--json`, `--web` |
| `gh issue create` | Create issue | `-R`, `--title`, `--body`, `--label`, `--assignee`, `--milestone`, `--project`, `--type`, `--parent`, `--web` |
| `gh issue edit <id>` | Edit issue | `-R`, `--title`, `--body`, `--add-label`, `--remove-label`, `--add-assignee`, `--remove-assignee`, `--add-project`, `--remove-project`, `--milestone`, `--type`, `--parent` |
| `gh issue close <id>` | Close issue | `-R`, `--comment`, `--reason` |
| `gh issue reopen <id>` | Reopen issue | `-R`, `--comment` |
| `gh issue comment <id>` | Comment | `-R`, `--body`, `--edit-last` |
| `gh issue delete <id>` | Delete issue | `-R`, `--yes` |

## Expected Outcome

- Can create, search, view, edit, and manage the lifecycle of issues via `gh issue`
- Works in both interactive and scripted modes
- Issues are linked to projects, labels, assignees, and milestones correctly
- No issue is deleted, moved, or closed without permission
- Team can understand and act on the issue immediately

## Common Mistakes

- Not using a template, causing missing information
- Unclear or overly long title
- Missing environment details
- Not linking related issues
- Using labels that do not match conventions

## Anti-Patterns

- Creating overly broad issues (should be split)
- Creating issues without action items
- Creating issues without steps to reproduce
- Using a description that is too short and lacks context
