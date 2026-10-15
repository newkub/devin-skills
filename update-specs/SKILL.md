---
name: update-specs
description: Create or update `<workspace>/specs/` test specs per project type
argument-hint: "[scope]"
related:
  - update-tests
  - update-project
  - update-astgrep-rules
  - run-test
  - deep-review-codebase
  - deep-validate
  - check-reference

---

## Goal

Create or update `<workspace>/specs/` as the workspace's test spec store, covering the test plan, overview, and per-feature spec files

## Scope

Use in any workspace, or invoke from `/update-tests`, `/update-project`, `/update-astgrep-rules` to sync test specs so they stay consistent with the code

## Execute

### 1. Detect Test Context

> Goal: Gather the necessary context before writing specs

1. Read the package manifest (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`) to find the test framework
2. Check test config files (`vitest.config.*`, `jest.config.*`, `pytest.ini`, `nextest.toml`)
3. Scan existing `tests/` or test directories
4. Identify coverage target and test types (unit, integration, e2e, etc.) from config or context

### 2. Initialize Specs Directory

> Goal: Prepare `<workspace>/specs/`

1. Create `<workspace>/specs/` if it doesn't exist
2. Ensure there's no duplicate `spec/` directory; if there is → move it or notify the user before changing
3. Prepare the structure: `specs/overview.md`, `specs/SPEC.md`, and `specs/<feature>.md` per modules

### 3. Write Spec Files

> Goal: Write spec files into `<workspace>/specs/`

1. Create/update `specs/overview.md` specifying framework, coverage threshold, structure, and test strategy
2. Split specs into smaller files by modules/features in `specs/<module>.md`
3. Record all test cases concisely with status tracking (pending/written/covered)
4. Keep each spec file under 250 lines — if it exceeds that, refactor by splitting the file

### 4. Sync Specs With Tests

> Goal: Sync `specs/SPEC.md` with the existing test cases

1. Read all test files in `tests/`
2. Update `specs/SPEC.md` or the test plan document with the existing test cases
3. Identify gaps: test cases in the spec but with no test, or new tests not in the spec
4. If it fails → retry (max 3 → stop/report)

### 5. Validate And Report

> Goal: Verify the completeness of the specs

1. Run `/deep-validate` to confirm `specs/` is complete
2. Verify that `specs/overview.md` and `specs/SPEC.md` exist
3. Verify that spec files stay under 250 lines
4. Run `/report` to summarize the spec files created/updated, gaps, and next actions

## Rules

### 1. Location

- Specs must live at `<workspace>/specs/` (workspace root)
- Don't create a duplicate `spec/` in the workspace; if one exists, convert it to `specs/` or ask the user before moving
- Don't create specs inside `.devin/` or `tests/`

### 2. Idempotency

- `/update-specs` can be re-run without destroying existing specs
- Update only what's necessary; don't overwrite all content

### 3. Single Responsibility

- Each spec file covers a single module/feature
- Don't include implementation details or test code in the spec

### 4. Quality

- Use `/deep-review-codebase` to check content quality
- Use backticks for `commands`, `paths`, `skill names`
- Language: Thai/English per project convention

### 5. Conditionality

- If the workspace has no test framework → create `specs/overview.md` specifying a recommended test strategy
- For check/verify work → focus on syncing `specs/SPEC.md`

- Use /update-tests if needed
- Use /deep-test coverage if needed
- Use /check-reference if needed
- Use /run-test if needed


## Expected Outcome

- `<workspace>/specs/` is created/updated
- `specs/overview.md` covers framework, coverage threshold, structure
- `specs/SPEC.md` or the test plan is synced with test files
- Spec files per module/feature stay under 250 lines
- Passes `/deep-validate`
- Reports the spec files created/updated, gaps, and next actions

## Common Mistakes

- Creating specs in `spec/` instead of `specs/`
- Combining several modules in one file until it exceeds 250 lines
- Forgetting to sync `specs/SPEC.md` with the actual test files

## Anti-Patterns

- Creating specs inside `.devin/`
- Copying test code into the spec
- Not checking for an existing `spec/` directory first
