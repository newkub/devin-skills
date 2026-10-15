---
name: run-scan
description: Run ast-grep scan to check the codebase with AST-based patterns
argument-hint: "[scope]"
related:
  - deep-review-codebase
  - use-astgrep
  - update-astgrep-rules
  - check-code-structure
  - report
  - loop-until-complete
  - resolve-errors

---

## Goal

Run `ast-grep scan` to check the codebase with AST-based patterns and fix the issues found

## Scope

Use for scanning the codebase with `ast-grep` in a project that has `sgconfig.yml` and rules in a `rules/` directory

## Execute

> Pre-Run: Always run `/deep-review-codebase` first — `run-*` must be reviewed/assessed before the main work, never skip; if findings are blockers, fix or report before running (scan)

### 1. Setup And Write Rules

> Goal: Setup And Write Rules

1. Run `/use-astgrep` to install and set up `ast-grep`
2. Check that `sgconfig.yml` has `ruleDirs: rules` and that `package.json` has a `scan` script
3. If there are no rules yet, run `/update-astgrep-rules` to create rules in the `rules/` directory
4. Run `/update-astgrep-rules` to update and check the rules `before` running scan, always — stale rules make the findings inaccurate

### 2. Run Scan

> Goal: Run Scan

1. Run `bun run scan` or `ast-grep scan`
2. Run `/report` to format the output and identify issues
3. Consider whether any rules are inappropriate, correct, and fitting
4. Fix the code according to the suitable suggestions, or use `--interactive` mode for selective apply

### 3. Verify

> Goal: Verify

1. Run `/loop-until-complete` to rerun scan until there are no issues
2. Check that the fixes do not break the code
3. Use `ast-grep test` to verify the rules
4. If there are errors after fixing, run `/resolve-errors`

## Rules

- There must be an `sgconfig.yml` at the root directory and a `scan` script in `package.json`
- Rules must live in the `rules/` directory and use severity according to importance (`error`, `warning`, `info`)
- Review the output every time before applying fixes, and use `--interactive` mode for selective apply
- Rerun scan after applying fixes and check that the code still works
- If the project has CI/CD, add scan to the pipeline and run it before commit
- Update the rules when new patterns appear, and review false positives to tune the rules
- For a structure scan (symbols, exports, members) that needs no rules → use `/check-code-structure` (`sg outline`)

## Expected Outcome

- The `ast-grep` CLI is installed and configured
- Rules are created in the `rules/` directory
- Scan runs and identifies the correct issues
- Issues are fixed and verified
- The codebase passes `ast-grep scan` with no errors