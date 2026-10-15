# Deep Test — CLI Domain

Test CLI commands by running them through a real shell — checking exit codes, stdout, stderr, help text, flags, subcommands, and error paths — works with CLI tools built with Bun/Node/Rust/Go/Python, run from a built binary or package script

> Pre-Run: always run `/deep-review` (domain `review-cli`) first — never skip; if a finding is a blocker, fix it or report before running

## Run Quick Path

> Goal: run the existing CLI suite only (merged from `/test-cli`) — use steps 1-10 below for the deep pass

1. Detect — `bin` field, commander/clap/cobra defs, `*.cli.test.*`, `bats` files, stdout snapshots; runner = the project runner (spawn via `child_process`/`assert_cmd`) or `bats`; the binary must be built first
2. Run — scope the CLI specs (`bunx vitest run '*.cli.test.*'`, `bats tests/`); capture every case as exit code + stdout + stderr; record per-command status, exit-code mismatches, output diffs
3. Classify — crash / wrong exit code / unexpected stderr → source → `/resolve-errors`; outdated snapshot or expected-output change → test → `/update-tests`; build/env failure → environment; repeats ≥3 → stop+report
4. Report — persist → `.devin/temp/report/<workspace>/cli-test-<time>.md`; all passing → `/run-verify`

## 1. Detect CLI

> Goal: know where the CLI is

1. Check `package.json` `bin` fields, `scripts`, `bin` in `Cargo.toml`, `pyproject.toml`, `go.mod`
2. Check `tsup.config.*`, `bunup.config.*`, `Cargo.toml` for build output
3. Find the executable path or use `bun run src/presentation/cli.ts`
4. If not found → `/ask-me`

## 2. Build CLI

> Goal: get the CLI ready to test

1. Run `bun run build` or `cargo build` or `go build` per the ecosystem
2. Verify the executable was created in `dist/`, `target/`, or `bin/`
3. If the build fails → `/resolve-errors`

## 3. Test Help And Version

> Goal: check basic commands

1. Run `<cli> --help`, verify exit code 0 and usage in stdout
2. Run `<cli> -h` to test the short flag
3. Run `<cli> --version` or `<cli> -V`, verify the version output
4. Record the displayed flags, subcommands, and options

## 4. List Commands And Subcommands

> Goal: know what the CLI can do

1. Read the help output to build a list of subcommands
2. Run `<cli> <subcommand> --help` to see each subcommand's flags
3. Record subcommands, flags, positional args, and default values

## 5. Test Happy Path Commands

> Goal: test correct commands

1. Run each subcommand with valid arguments
2. Verify exit code 0
3. Verify stdout contains the expected output
4. Check side effects if any, e.g. files created, DB written
5. Use fixtures or test data for inputs

## 6. Test Error Paths

> Goal: test failure cases

1. Run a command without required arguments → check the error and exit code ≠ 0
2. Run a command with an invalid flag → check the error message
3. Run a command with an invalid input file → check error handling
4. Run a command without permission → check the error if applicable
5. Run a command with missing env vars → check the error

## 7. Test Flags And Options

> Goal: test every existing flag

1. Test boolean flags: `--flag`, `--no-flag`, `-f`
2. Test value flags: `--output path`, `--format json`, `--limit 10`
3. Test default values when a flag is not passed
4. Test mutually exclusive flags if any
5. Use parameterized tests for the flag matrix

## 8. Test Pipes And Stdin

> Goal: test a CLI that accepts input from stdin

1. Feed data through a pipe: `cat fixture.json | <cli> process`
2. Check the command's stdout
3. Check error handling when stdin is empty or malformed

## 9. Capture And Report

> Goal: summarize the test results

1. Record exit codes, stdout, and stderr of each command
2. Collect failures and inconsistencies
3. Run `/resolve-errors` for failures
4. Use `/report` to present test results

## 10. Re-run Until Pass

> Goal: loop CLI tests until they pass

1. Fix the CLI or the tests after failures
2. Re-run one command at a time
3. Loop at most 3 rounds
4. If still failing → stop and report

## Rules

### 1. Test Isolation

- Each test must run independently
- Clean up side effects after each test (`afterEach`, `teardown`)
- Use temporary directories for output files

### 2. No Hardcoded Secrets

- Never hardcode API keys, tokens, or passwords in tests
- Use environment variables or mocks for external services

### 3. Assert Output, Not Implementation

- Mainly check stdout, stderr, and exit code
- Do not assert on internal CLI function calls
- Use `expect.stringContaining` for flexible output

### 4. Use Parameterized Tests

- Use `it.each` or table-driven tests for the flag matrix
- Use them for many invalid-input cases
- Use them for many subcommands

### 5. Ecosystem Aware

- Bun/Node CLI: use `bunx` or `bun run` to execute
- Rust CLI: use `cargo run` or `target/debug/<binary>`
- Go CLI: use `go run` or the built binary
- Python CLI: use `python -m` or `pytest` for test scripts

### 6. Timeout And Retry

- `perCommandTimeout` = 60 seconds
- `maxRetries` = 3 for flaky commands
- Stop immediately on an infinite loop

### 7. Error Handling

- Fix the root cause, do not suppress
- If the error comes from the build → `/resolve-errors`
- If the error comes from the environment → `/ask-me`

## Expected Outcome

- All CLI commands tested with valid and invalid inputs
- Exit codes, stdout, stderr asserted
- Help, version, flags, subcommands verified
- No regression in command behavior
- A summary report table exists
