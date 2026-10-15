---
name: run-dev
description: Run the development server and fix errors
argument-hint: "[scope]"
related:
  - check-open-ports
  - resolve-errors
  - watch-terminal
  - watch-browser
  - run-verify
  - report

---

## Goal

Run the development server and fix any errors that occur, with terminal and browser watching

## Scope

Used to run any project's development server with error checking and fixing

## Execute

> Pre-Run: Always run `/check-open-ports` first — `run-*` requires review/assessment before the main action, never skip; if findings are blockers, fix or report them before running (dev)

### 1. Check Configuration

> Goal: Check Configuration

1. Check the main config and dev script to see if they are defined
2. If the main config has no dev script, define one
3. Verify the required dependencies are installed
4. Verify the required environment variables are set

### 2. Run Dev Server

> Goal: Run Dev Server

1. Run the dev server with the appropriate command (bun dev, npm run dev, cargo run)
2. If there are errors, run `/resolve-errors` to fix them
3. Track and fix errors immediately until they pass
4. Verify the dev server starts successfully

### 3. Watch Terminal

> Goal: Watch Terminal

1. Run `/watch-terminal` to watch the terminal every 5 seconds
2. Automatically detect new errors and warnings
3. If errors are found, run `/resolve-errors` immediately

### 4. Open Web (if it is a web project)

> Goal: Open Web (if it is a web project)

1. For a web project, run `/open-web` to open the browser at the dev server URL
2. Verify the website opens and renders correctly

### 5. Watch Browser (if it is a web project)

> Goal: Watch Browser (if it is a web project)

1. For a web project, run `/watch-browser fix` to inspect the browser
2. Verify the dev server really works through the browser
3. Test that the main features work

### 6. Test Usage

> Goal: Test the key usage flows

1. Run `/deep-test usage` to test the main features
2. If problems are found → run `/watch-browser fix` or `/resolve-errors`
3. Confirm the key user flows work

### 7. Verify

> Goal: Verify

1. Run `/run-verify`
2. Confirm there are no critical errors blocking operation
3. Check that the related services work normally
4. Confirm there are no runtime errors in the console

### 8. Report

> Goal: Report

1. Run `/report` to show the terminal output
2. Summarize the dev server status and remaining issues

## Rules

### 1. Runtime Selection

- Use the command that fits the runtime (bun dev, npm run dev, cargo run)
- Check the ecosystem from the package manifest before choosing a command

### 2. Error Resolution

- Run `/resolve-errors` when an error is found
- Fix the root cause, not the symptoms
- Verify the dev server starts successfully before watching

### 3. Watch Strategy

- Run `/open-web` only for web projects to open the browser at the dev server URL
- Run `/watch-terminal` for every project
- Run `/watch-browser fix` only for web projects
- If errors are found while watching, run `/resolve-errors` immediately

## Expected Outcome

- Development server works
- No critical errors
- Terminal is continuously watched
- Browser renders correctly (if it is a web project)
- Main features work