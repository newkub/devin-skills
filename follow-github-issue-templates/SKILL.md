---
name: follow-github-issue-templates
description: Create GitHub issue templates for bug, feature, plan, test, questions, and agents-task
argument-hint: "[scope]"
related:
  - follow-dot-github
  - deep-validate
  - report
  - suggest-next-action
  - create-github
  - plan

---

## Goal

Create or update `.github/ISSUE_TEMPLATE/` completely with 6 template types: `bug-report`, `feature-request`, `plan`, `test`, `questions`, and `agents-task`, plus `config.yml`

## Scope

Use when a project needs standardized issue templates for GitHub. Does not duplicate `/follow-dot-github` — this skill focuses only on issue templates, while `/follow-dot-github` manages the whole `.github` directory

## Execute

### 1. Analyze Existing Templates

> Goal: know the starting point of `.github/ISSUE_TEMPLATE/`

1. Inspect the existing `.github/ISSUE_TEMPLATE/`
2. Read `config.yml` if present
3. Identify templates that are missing or need updating

### 2. Select And Copy Templates

> Goal: have all 6 template types

1. Select templates by project type: `bug-report`, `feature-request`, `plan`, `test`, `questions`, `agents-task`
2. Copy the YAML content from `templates/` to `.github/ISSUE_TEMPLATE/`
3. Verify the file names:
   - `bug_report.yml`
   - `feature_request.yml`
   - `plan.yml`
   - `test.yml`
   - `questions.yml`
   - `agents_task.yml`
4. Create `config.yml` if it does not exist
5. Replace `<owner>` and `<repo>` in `config.yml` with the real values

### 3. Customize Project Labels

> Goal: labels match project conventions

1. Read `package.json` or project docs to see which labels are used
2. Adjust labels in the templates to match project conventions
3. Verify that all labels exist in the repo; if not, specify that they should be created via `labels.yml`

### 4. Validate

> Goal: templates actually work

1. Check the YAML syntax of every file
2. Check the GitHub issue form syntax
3. Check the `required` fields
4. Run `/deep-validate` to verify the templates

### 5. Report

> Goal: the user knows the status

1. Run `/report` with the list of templates
2. Run `/suggest-next-action`

## Rules

### 1. Template Coverage

- Must include the 6 core templates: `bug_report.yml`, `feature_request.yml`, `plan.yml`, `test.yml`, `questions.yml`, `agents_task.yml`
- Must include `config.yml` with `blank_issues_enabled: false` and `contact_links`
- Do not create markdown templates — use GitHub Forms YAML only

### 2. Naming

- Use `snake_case` for file names
- Template names in `name:` use English Title Case
- Example: `name: Bug Report`

### 3. Default Labels

- `bug-report`: `bug`
- `feature-request`: `feature` or `enhancement`
- `plan`: `plan`
- `test`: `test`
- `questions`: `question`
- `agents-task`: `agents-task`

### 4. Integration

- If `/follow-dot-github` is invoked → run `/follow-github-issue-templates` in Step 4
- If `/create-github-issue` is invoked → use the templates to guide the issue to the right type

## Expected Outcome

- `.github/ISSUE_TEMPLATE/` has all 6 template types
- `config.yml` defines blank issues and contact links
- Every template passes YAML syntax
- Labels match project conventions
- Project docs or `AGENTS.md` are updated if new labels were added
