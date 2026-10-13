---
name: run-program
description: Run the main program and make it actually work
argument-hint: "[scope]"
related:
  - deep-review
  - run-install
  - run-build
---

## Goal

Run the main program and make it actually work

## Scope

Run the project's main program and make it actually work, fixing any issues found

Use for:

- Running CLI programs
- Running web applications
- Running background services
- Verifying the program works correctly

- See also: /deep-review

## Execute

> Pre-Run: Always run `/deep-review` first — `run-*` must be reviewed/assessed before the main work, never skip; if findings are blockers, fix or report before running (program)

### 1. Prepare

> Goal: Prepare dependencies, build, and environment before running

1. Run `/run-install` to install dependencies
2. Run `/run-build` if a build is needed
3. Verify the entry file exists
4. Set the required environment variables

### 2. Execute

> Goal: Run the main program

1. Choose the command based on project type:
   - Node/Bun: `bun run start` or `bun src/index.ts`
   - Rust: `cargo run`
   - Binary: run the executable directly
2. Pass arguments if any
3. Record the PID if it is a background process

### 3. Monitor

> Goal: Watch the output and verify functionality

1. Watch stdout/stderr and logs
2. Identify errors/warnings
3. Test that the program works correctly
4. Check side effects

### 4. Fix Issues

> Goal: Fix the issues found

1. Read the error messages and identify the root cause
2. Prioritize
3. Fix the problematic code
4. Run `/deep-review` if needed
5. Rebuild and rerun

## Rules

### 1. Program Types

| Type | How to run |
|------|---------|
| Node/Bun | `bun run start` or `bun src/index.ts` |
| Rust | `cargo run` |
| Binary | Run the executable directly |

### 2. Error Handling

| Case | Handling |
|------|-----------|
| Compile error | Fix the code and rebuild |
| Runtime error | Debug and fix |
| Missing deps | Install dependencies |
| Config error | Fix the configuration |

### 3. Safety

- Do not run a program with incomplete dependencies
- Do not embed secrets in command arguments
- Save logs before closing the program

## Expected Outcome

- The program runs successfully
- It works as expected
- There are no blocking errors
