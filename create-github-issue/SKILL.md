---
name: create-github-issue
description: Create, search, edit, close, reopen, delete, and manage GitHub issues via the `gh` CLI
argument-hint: "[action] [repo]"
related:
  - follow-dot-github
  - resolve-github-issue-by-me
  - update-github-issue
  - ask-me
  - deep-validate

---

## Goal

Use `gh issue` to create, search, view, edit, close, reopen, delete, and manage repository issues through the CLI, both interactively and scripted

## Scope

- Works with the skills: `/open-github`, `/list-github-issue`, `/follow-dot-github`, `/create-github-pr`, `/deep-review`, `/update-github-issue`
- Supports the current repo or `--repo owner/repo`
- Not a full-featured project management tool

See also: `/resolve-github-issue-by-me`, `/ask-me`, `/open-github`, `/open-web`

## Execute

### 1. Verify Repository And Auth

> Goal: Confirm the target repo

1. Run `gh auth status`
2. Run `gh repo view` to see the current repo
3. If you are outside a repo, use `--repo owner/repo` for every command
4. Check permissions to create/edit issues

### 2. List And View Issues

> Goal: Find and inspect issues

1. `gh issue list --state all --limit 50` for open/closed
2. `gh issue list --label <label> --assignee <user>` to filter
3. `gh issue view <number>` for details
4. `gh issue view <number> --comments` for comments
5. `gh issue view <number> --web` to open in the browser

### 3. Check Duplicates

> Goal: Avoid duplicate issues

1. `gh issue list --search "<title>" --limit 10`
2. If a duplicate → update the existing issue and note `duplicateOf`
3. If not a duplicate → create a new one

### 4. Use Issue Template

> Goal: Format the body according to the issue type

1. If the repo has `.github/ISSUE_TEMPLATE/*.yml` → use the repo templates
2. If the repo should get issue forms for every project type (bug, feature, plan, test, questions, agents-task, merged from `/follow-github-issue-templates`) → read `references/issue-forms.md` and copy the Forms YAML from `templates/forms/` into `.github/ISSUE_TEMPLATE/`
3. If the repo has no templates → read `create-github-issue/templates/index.md` and pick the matching type:
   - `bug` → `templates/bug.md`
   - `feature` → `templates/feature.md`
   - `idea` → `templates/idea.md`
   - `plan` → `templates/plan.md`
   - `question` → `templates/question.md`
4. If the type is `idea` → draw the ANSI UI sketch yourself by reading the real project files; never use placeholders, put the actual sketch inside the code fence
5. Read the chosen template and replace placeholders with real information
6. The title must be English Title Case, at most 80 characters
7. Write the description in English, except technical terms, project/skill names, paths, and commands

### 4.5 Deep Validate Draft

> Goal: Confirm the drafted issue is correct and complete before it is created

1. Run `/deep-validate` on the draft (title + body) against the real project state
2. Verify: every placeholder is replaced, repro steps/commands actually exist, referenced `file:line` evidence and linked issues/PRs are real, no duplicated or contradictory claims, acceptance criteria are measurable
3. Critical/High findings → fix the draft and re-validate, never create an issue that fails validation; Minor/Info → fix inline if quick, otherwise note them in the body

### 5. Create Issue

> Goal: Create the issue on GitHub

1. `gh issue create` interactively
2. Or `gh issue create --title "<title>" --body "<body>"`
3. Or `gh issue create -F body.md` to read the body from a file
4. Add `--label`, `--assignee`, `--milestone`, `--project`, `--type`, `--parent` as needed
5. If it's a project item → `gh project item-add <project-id>`
6. Use `--web` to open the create page in the browser

### 5.5 Create Idea-Feature Comments

> Goal: Add one comment per idea group using the `idea` template

1. Read `create-github-issue/templates/idea.md`
2. Replace placeholders:
   - `{{number}}`, `{{feature}}`, `{{type}}`, `{{why}}`, `{{benefit}}`, `{{impact}}`, `{{phase}}`, `{{effort}}`, `{{mvpScore}}`, `{{risk}}`
   - `{{uxui-sketch}}` with a real ANSI box-drawing sketch from the project analysis
   - `{{todo-table}}` with rows of `| action | files | dependencies | workspace |`
3. Check the format:
   - The table must be `| Feature | Type | Why | Benefit | Impact | Phase | Effort | MVP Score | Risk |`
   - The header, separator, and every row must each be on a single line; never break a line inside a cell
   - Count the `|` to confirm the summary row has 10 pipes (9 columns) and each Todo row has 5 pipes (4 columns)
   - `Todo` must be a table with the columns `Action`, `Files`, `Dependencies`, `Workspace`
   - `UX/UI Sketch` must be real ANSI art, not a text description, and the heading must not contain `(ANSI)`
4. Post with `gh issue comment <number> --body-file <comment.md>`

### 6. Update And Edit Issues

> Goal: Update metadata and content

1. `gh issue edit <number> --title "<title>" --body "<body>"`
2. `gh issue edit <number> --add-label bug --remove-label duplicate`
3. `gh issue edit <number> --add-assignee <user> --remove-assignee <user>`
4. `gh issue edit <number> --add-project "<title>" --remove-project <id>`
5. `gh issue edit <number> --milestone "v1.0"` or `--remove-milestone`
6. `gh issue edit <number> --type Bug --parent <number>`

For the full update workflow, also use `/update-github-issue`

### 7. Manage Issue Lifecycle

> Goal: Close, reopen, comment, pin, transfer, delete

1. `gh issue close <number>` or `gh issue reopen <number>`
2. `gh issue comment <number> --body "<comment>"`
3. `gh issue pin <number>` / `gh issue unpin <number>`
4. `gh issue lock <number>` / `gh issue unlock <number>` — be careful
5. `gh issue transfer <number> <owner/repo>` to move it
6. `gh issue delete <number> --yes` — must ask the user first; in practice `close` is better than `delete`

### 8. Verify And Report

> Goal: Confirm success and deliver

1. Verify the issue was created/edited successfully
2. `gh issue view <number>` for a final check
3. The draft passed `/deep-validate` before creation — if the body was edited after validation, re-run `/deep-validate` on the live issue
4. After creating, open it in the browser with `/open-web` or `gh issue view <number> --web` and report the issue URL back

## Rules

### 1. Repository Target

- `gh issue` uses the repo from the current directory's git remote
- Use `--repo owner/repo` or `-R` for another repo

### 2. Language

- Titles and descriptions use English
- Except technical terms, project/skill names, paths, commands, and repo conventions that specify another language
- If repo conventions don't specify a language, default to English

### 3. Issue Title

- Start with the issue type (`Bug:`, `Feature:`, `Enhancement:`, `Docs:`)
- Use Title Case
- At most 80 characters
- Example: `Bug: Login fails after timeout`

### 4. Issue Description

- Use `create-github-issue/templates/<type>.md` matching the chosen type
- Replace placeholders with real information
- If the type is `idea`, use `templates/idea.md` with the `Feature | Type | Why | Benefit | Impact | Phase | Effort | MVP Score | Risk` table, a real ANSI sketch, and a `Todo` table with `Action | Files | Dependencies | Workspace`
- Each summary and Todo row must be on a single line; never break a line inside a cell
- If the type matches no template, use `bug.md` as the base and adapt

### 5. Labels Convention

| Category | Labels |
|----------|--------|
| Type | bug, feature, enhancement, documentation, refactor |
| Priority | critical, high, medium, low |
| Status | triage, in-progress, review, done |
| Component | frontend, backend, database, api, ui |

### 6. Issue Relations

- `blockedBy`: issues that must be resolved first
- `blocks`: issues blocked by this one
- `relatedTo`: related but not blocking
- `duplicateOf`: duplicate issue

### 7. Assignees

- Name one primary assignee
- Avoid multiple assignees unless necessary
- Use correct GitHub usernames

### 8. Update Existing Issues

- If the issue has comments from others, do not overwrite the body without user confirmation
- Use `--add-label` and `--remove-label`
- Use `--add-assignee` and `--remove-assignee`
- Review the issue after updating

### 9. Safety

- `delete`, `close`, `lock`, `transfer` are destructive and must be confirmed with the user first
- Verify the issue number/repo before changing state
- To close an issue, `gh issue close` is better than `delete`
- Never create an issue without the `/deep-validate` draft gate (step 4.5)

### 10. Interactive And Script Mode

- In a TTY, `gh issue create` prompts for title/body if flags are missing
- In scripts/CI, pass all flags to avoid interactivity
- Use `--json` or `--jq` for JSON output
- Use `--template` to format output

### 11. CLI Reference

| Command | Description | Common Options |
|---------|-------------|----------------|
| `gh issue list` | List issues | `-R`, `--state`, `--label`, `--assignee`, `--limit` |
| `gh issue view <id>` | View an issue | `-R`, `--comments`, `--json`, `--web` |
| `gh issue create` | Create an issue | `-R`, `--title`, `--body`, `--label`, `--assignee`, `--milestone`, `--project`, `--type`, `--parent`, `--web` |
| `gh issue edit <id>` | Edit an issue | `-R`, `--title`, `--body`, `--add-label`, `--remove-label`, `--add-assignee`, `--remove-assignee`, `--add-project`, `--remove-project`, `--milestone`, `--type`, `--parent` |
| `gh issue close <id>` | Close an issue | `-R`, `--comment`, `--reason` |
| `gh issue reopen <id>` | Reopen an issue | `-R`, `--comment` |
| `gh issue comment <id>` | Comment | `-R`, `--body`, `--edit-last` |
| `gh issue delete <id>` | Delete an issue | `-R`, `--yes` |

## Expected Outcome

- Issues can be created, searched, viewed, edited, and lifecycle-managed through `gh issue`
- Usable in both interactive and scripted modes
- Issues linked to projects, labels, assignees, and milestones correctly
- No issue is deleted, transferred, or closed without permission
- The team can immediately understand and act on the issue

## Common Mistakes

- Not using a template, leaving out key information
- Unclear or overly long title
- Missing environment details
- Not linking related issues
- Using labels that don't match conventions

## Anti-Patterns

- Creating an issue that is too broad (split it instead)
- Creating an issue with no action items
- Creating an issue with no steps to reproduce
- Using a description that is too short and lacks context
