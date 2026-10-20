---
name: migration-with-astgrep
description: Run codebase migrations with ast-grep rules
argument-hint: "[rule-file-or-pattern]"
related:
  - scan-codebase
  - report
  - suggest-next-action
  - run-drizzle-studio
---

## Goal

Use ast-grep to run codebase migrations that are pattern-based, safe, verifiable, and revertible

## Scope

Use for refactoring patterns such as API rename, function signature change, deprecation cleanup, import migration, framework upgrade by running ast-grep scan and applying one batch at a time

## Execute

### 1. Detect Migration Scope

> Goal: know what needs to be migrated

1. Do `/scan-codebase` to find old patterns
2. Check `package.json` versions and breaking changes
3. Identify the patterns that must change: function names, imports, APIs, decorators
4. Build a list of target files and patterns

### 2. Install Or Verify Ast-Grep

> Goal: have a usable ast-grep CLI

Latest: `@ast-grep/cli@0.45.3` (verified 2026-09-12) — `mise use -g ast-grep` or `bunx @ast-grep/cli`

1. Check `ast-grep` with `ast-grep --version`
2. If not present → install with `mise use -g ast-grep` or the appropriate package manager
3. Use `bunx @ast-grep/cli --version` if you do not want a global install

### 3. Write Ast-Grep Rules

> Goal: have rules for the migration

1. Create `ast-grep-rules/<migration-name>.yml`
2. Specify `language`, `rule.id`, `pattern` or `regex`
3. Specify `fix` or `rewrite` for auto-fix
4. Test the rule with `ast-grep scan --rule ast-grep-rules/<rule>.yml`
5. Use `utils.isDefinition`, `utils.isExpression`, `utils.isStatement` when necessary

### 4. Dry Run Scan

> Goal: see the matches before editing

1. Run `ast-grep scan --rule ast-grep-rules/<rule>.yml` without `--apply`
2. Record the number of matches, files, severity
3. Check for false positives
4. Adjust the rule if it catches too many or too few patterns

### 5. Apply Fixes

> Goal: edit the code per the rules

1. Back up with `git diff` or commit before applying
2. Run `ast-grep scan --rule ast-grep-rules/<rule>.yml --apply`
3. Check the resulting diff
4. If there is a false positive that was already applied → revert with `git checkout -- <file>` then adjust the rule

### 6. Validate

> Goal: confirm the migration did not break anything

1. Run `git diff --stat`
2. Run `bun run typecheck` or the project's typecheck
3. Run `bun run lint` or the project's lint
4. Run `bun run test` or `bun run test:unit`
5. If there is a failure → fix or revert then refine the rule

### 7. Repeat And Report

> Goal: complete the migration for all patterns

1. Repeat for each migration rule
2. Use `/report` to summarize the number of matches, files changed, tests status
3. Do `/suggest-next-action`

## Rules

### 1. Start With Dry Run

- Do not apply without a dry run
- Do not apply everything at once
- Do small batches first

### 2. Backup

- You must commit or diff before applying
- Use `git diff` to check every time
- It must be revertible

### 3. Rule Quality

- The rule must have a clearly limited scope
- Specify `language` correctly
- Use `pattern` more than `regex` when possible
- Test the rule against 1-2 files first

### 4. Validation Gate

- Every apply must pass typecheck
- Every apply must pass lint
- Every apply must pass tests or have a test plan

### 5. No Unintended Changes

- Do not edit files outside the scope
- Do not apply to generated files unless there is a reason
- Do not apply to third-party code
- Use /run-drizzle-studio if necessary

## Expected Outcome

- ast-grep rules are created and tested
- Old patterns are replaced per the rule
- Typecheck, lint, tests pass
- The diff is clear and reviewable
- A report table summarizing each migration rule
