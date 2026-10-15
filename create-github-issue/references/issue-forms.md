# Issue Forms Setup

> Install GitHub issue forms (YAML templates) into `.github/ISSUE_TEMPLATE/` (merged from `/follow-github-issue-templates`)

Use when a project needs standardized issue templates. `/follow-dot-github` manages the whole `.github` directory and dispatches here for issue forms. Forms live in `create-github-issue/templates/forms/`.

## 1. Analyze Existing Templates

1. Inspect the existing `.github/ISSUE_TEMPLATE/`
2. Read `config.yml` if present
3. Identify templates that are missing or need updating

## 2. Select And Copy Templates

1. Select templates by project type: `bug-report`, `feature-request`, `plan`, `test`, `questions`, `agents-task`
2. Copy the YAML content from `create-github-issue/templates/forms/` to `.github/ISSUE_TEMPLATE/`
3. Verify the file names:
   - `bug_report.yml`
   - `feature_request.yml`
   - `plan.yml`
   - `test.yml`
   - `questions.yml`
   - `agents_task.yml`
4. Create `config.yml` if it does not exist
5. Replace `<owner>` and `<repo>` in `config.yml` with the real values

## 3. Customize Project Labels

1. Read `package.json` or project docs to see which labels are used
2. Adjust labels in the templates to match project conventions
3. Verify every label exists in the repo; if not, specify that it should be created via `labels.yml`

## 4. Validate

1. Check the YAML syntax of every file
2. Check the GitHub issue form syntax and the `required` fields
3. Run `/deep-validate` to verify the templates

## 5. Report

1. Run `/report` with the list of templates
2. Run `/suggest-next-action`

## Rules

- Coverage: the 6 core templates `bug_report.yml`, `feature_request.yml`, `plan.yml`, `test.yml`, `questions.yml`, `agents_task.yml` plus `config.yml` with `blank_issues_enabled: false` and `contact_links`
- Use GitHub Forms YAML only — do not create markdown body templates here (those are `create-github-issue/templates/*.md`)
- File names use `snake_case`; the `name:` field uses English Title Case (e.g. `name: Bug Report`)
- Default labels: `bug-report` → `bug`; `feature-request` → `feature` or `enhancement`; `plan` → `plan`; `test` → `test`; `questions` → `question`; `agents-task` → `agents-task`
- Before deploying forms, confirm the repo has the labels: `bug`, `feature`, `plan`, `test`, `question`, `agents-task`
- If `/create-github-issue` is invoked → use the forms to guide the issue to the right type
