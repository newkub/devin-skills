# Deep Test — Usage Domain

Test usage examples from `README.md`, docs, and `package.json` scripts to confirm they really work before shipping (merged from `/test-usage`, including `/test-in-temp`)

Signals: `## Usage` / `### Usage via ...` code blocks, README code fences, package.json scripts, USAGE.md

- Real-browser route sweep → `/deep-test website`; CLI command contracts (flags/exit codes) → `/deep-test cli`; API endpoints → `/deep-test api`; writing/fixing the docs themselves → `/improve-usage-md` + `/update-usage-md`

## 1. Discover Usage Examples

> Goal: find every example that will ship

1. Locate every `README.md` (root and workspaces) plus `USAGE.md` and docs pages
2. Extract code blocks from `## Usage` and `### Usage via ...` sections
3. Categorize: `bash` (CLI commands), `typescript`/`javascript` (SDK examples), `json` (scripts)
4. Record the example list with file locations

## 2. Test CLI Commands

> Goal: test commands that do not destroy data

1. Test safe commands first (`--help`, `--version`, `help`, `version`)
2. If a custom directory exists → test with a directory that really contains files
3. If the command must start a server → use `--no-open` and `--port=0`, or kill it after testing
4. Record the result of each command

## 3. Test SDK Examples

> Goal: run the code examples as written

1. Create a temporary file (`tmp/test-usage-<ts|js>`) from the code example
2. Adjust relative paths to match the test environment
3. Run with `bun` or `node`
4. If a build is required first → `/resolve-errors` then try `build`; record the result

## 4. Test Package Scripts

> Goal: verify the scripts the docs promise

1. Identify the scripts in `package.json` (root and workspaces)
2. Test low-risk scripts: `build`, `typecheck`, `lint`, `test`
3. If `dev` or server scripts need not be tested → skip and record why

## 5. Test In Temp

> Goal: experiment outside the workspace

1. Use temp for anything unrelated to the workspace — experiments, package-manager trials, bug repros, one-off prototypes; workspace-related tests stay in steps 2-4
2. Create a temp dir `%TEMP%\test-in-temp-<random>` and copy only the necessary files in
3. Run in temp — capture stdout, stderr, exit code; timeout long-running commands
4. Never touch the workspace or install deps from temp — copying results back requires clear user confirm; delete temp when done unless the user asks to keep it

## 6. Review Correctness

> Goal: verify correctness before reporting

1. Run `/deep-review-codebase` to check logic, types, edge cases, contracts, and tests of the examples
2. Record findings with severity and evidence
3. Findings to fix → `/resolve-errors` or fix the README/code before continuing

## 7. Report And Fix

> Goal: report per-example status and close failures

1. Collect results into a table (example, expected, actual, status) including the `/deep-review-codebase` findings
2. Status per example: pass, fail, skipped (with reason)
3. Failures → list them and ask the user whether to fix or skip; if fixing → edit the README or code
4. Re-test until passing (max 3 rounds → stop + report)

## Rules

### 1. Safety

- Never run commands that could destroy data (`clean`, `rm -rf`, `push`, `deploy`)
- Never run `bun run dev` or `tauri dev` without `--no-open` and a timeout; ask before side-effecting commands

### 2. Scope

- Test only the examples that will ship; skip pseudo-code and examples requiring network, API keys, or real hardware
- If there are no examples, report that there is nothing to test

### 3. Environment

- Prefer `bun` if the project uses Bun, otherwise `node`; check `package.json` for the runtime and package manager
- Create temporary files in temp and delete them after testing

### 4. Gate

- This domain is a required pre-ship gate (`/ship`, `/implement-to-production` Verify, global rules `## 3. Test Usage Always`) — never skip it when docs or scripts changed

## Expected Outcome

- Every usage example in the docs is tested with pass/fail/skip status
- No broken examples before ship
- `/deep-review-codebase` ran to verify correctness, findings in the report
- The user is informed before ship if any example still does not work
