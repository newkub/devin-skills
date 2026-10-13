---
name: test-usage
description: Test usage examples from README/docs/package.json to confirm they really work before shipping
argument-hint: "[scope]"
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - deep-review
  - run-test
  - resolve-errors
  - check-should-update
  - implement-to-production
  - ship
  - report
  - test-website
  - test-cli
  - test-api
  - test-e2e
  - test-component
  - test-a11y
  - test-all

---

## Goal

Test the usage examples in `README.md`, supporting docs, and `package.json` scripts to confirm they really work before shipping

## Scope

Apply to CLI commands, SDK code examples, package scripts, and instructions that appear in docs before release — invoked by `/implement-to-production` in the Verify step before ship

- If the test scope also covers other domains → pick the matching `test-*` skills from the dispatch table in Step 1 — test-usage covers docs/usage verification; domain tests go to the specialized skills

## Execute

### 1. Select Test Domains

> Goal: Pick the `test-*` skills that match the scope before starting

| Target/Context | Skill |
|----------------|-------|
| website/web app — click-through every route, forms, dead UI, states | `/test-website` (real Chrome via `/use-playwriter`) |
| CLI commands/flags/scripts | `/test-cli` |
| API endpoints, schemas, contracts | `/test-api` (contract drift only → `/test-contract` via `/run-test`) |
| UI components DOM-isolated | `/test-component` |
| user flows, regression suite | `/test-e2e` |
| accessibility (WCAG/axe) | `/test-a11y` |
| docs usage examples (README/SDK/scripts) | follow Step 2-8 of this skill |
| multiple domains at once | `/run-test all` or `/test-all` — other domains (contract, load, coverage, database, mobile, property, visual, mutation, smoke, unit) dispatch via `/run-test <domain>` |

1. Select domain skills from the table based on the target — unclear domain → `/ask-me`
2. Run the selected domain skills first or in parallel, then always do Step 2-8 for docs usage examples when the work involves docs/package

### 2. Discover Usage Examples

> Goal: Find all usage examples

1. Locate every `README.md` in the project (root and workspaces)
2. Extract code blocks from `## Usage` and `### Usage via ...` sections
3. Categorize: `bash` (CLI commands), `typescript`/`javascript` (SDK examples), `json` (scripts)
4. Record the example list with file locations

### 3. Test CLI Commands

> Goal: Test CLI commands that do not destroy data

1. Test safe commands (`--help`, `--version`, `help`, `version`)
2. If a custom directory exists → test with a directory that really contains markdown files
3. If the command must start a server → use `--no-open` and `--port=0`, or kill it after testing
4. Record the result of each command

### 4. Test SDK Examples

> Goal: Test SDK code examples

1. Create a temporary file (`tmp/test-usage-<ts|js>`) from the code example
2. Adjust relative paths to match the test environment
3. Run with `bun` or `node`
4. If a build is required first → run `/resolve-errors` then try `build`
5. Record the result

### 5. Test Package Scripts

> Goal: Test package.json scripts related to usage

1. Identify the scripts present in `package.json` (root and workspaces)
2. Test low-risk scripts: `build`, `typecheck`, `lint`, `test`
3. If `dev` or server scripts need not be tested → skip and record it
4. Record the result

### 6. Test In Temp

> Goal: Experiment/test in the OS temp directory without touching the workspace — merged from `/test-in-temp`

- Use test-in-temp when testing things unrelated to the workspace: experiments, package-manager trials, repro bugs, one-off prototypes — for workspace-related tests, do steps 1-4 above within the project
1. Create a temp dir `%TEMP%	est-in-temp-<random>` — copy only the necessary files into it
2. Run the experiment/command in temp — capture stdout, stderr, exit code; long-running command → timeout
3. Keep temp until the session ends for the user to inspect — delete by default when done, unless the user asks to keep it
4. Never touch the workspace or install deps from temp — copying results back into the workspace requires clear user confirm

### 7. Review Correctness

> Goal: Verify correctness before reporting results

1. Run `/deep-review` to check logic, types, edge cases, contracts, concurrency, and tests of the examples
2. If issues are found, record severity and evidence
3. If `/deep-review` finds things to fix → run `/resolve-errors` or fix the README/code before continuing
4. Record the review results

### 8. Report And Fix

> Goal: Report results and handle issues

1. Collect test results into a table (example, expected, actual, status)
2. Include findings from `/deep-review`
3. If there are failures → list them and ask the user whether to fix or skip
4. If fixing → edit the README or code as appropriate
5. Re-test until passing (max 3 → stop/report)

## Rules

### 1. Safety

- Never run commands that could destroy data (`clean`, `rm -rf`, `push`, `deploy`)
- Never run `bun run dev` or `tauri dev` without `--no-open` and a timeout
- If a command must start a server, set a timeout then kill it
- Ask the user before running commands with side effects

### 2. Scope

- Test only the examples in the docs that will ship
- No need to test examples that are pseudo-code or require external setup
- Skip examples that require network, API keys, or real hardware

### 3. Environment

- Prefer `bun` if the project uses Bun
- If `bun` is unavailable, use `node`
- Check `package.json` to choose the runtime and package manager
- Create temporary files in `temp` and delete them after testing

### 4. Reporting

- Report the status of each example: ✅ pass, ❌ fail, ⏭️ skipped
- Keep error output for debugging
- If there are no examples, report that there is nothing to test

### 5. Correctness Review

- Always run `/deep-review` before reporting/final fix
- Record deep-review findings in the report
- If there are critical/high issues → ask the user before shipping

- Use /run-test if needed
- Use /deep-review if needed
- Use /check-should-update if needed

## Expected Outcome

- Every usage example in the docs is tested
- No broken examples before ship
- A report summarizing test status exists
- `/deep-review` was run to verify correctness before delivery
- The user is informed before ship if any examples still do not work

