---
name: watch-terminal
description: Open a browser and watch the terminal every 5 seconds, handling errors automatically
argument-hint: "[scope|report]"
related:
  - capture
  - record-video-terminal-with-asciinema
  - resolve-errors
  - run-watch
---

## Goal

Watch the terminal every 5 seconds and handle any errors that appear automatically.

## Scope

Use when you need to continuously monitor and fix problems in a development server.

## Execute

### 1. Pre-Check

> Goal: Pre-Check

Check the project status:

1. Verify you are in the correct project directory
2. Verify a development script exists in `package.json`
3. Verify all dependencies are installed
4. Verify the development server is running

### 2. Start Watch

> Goal: Start Watch

Start watching the terminal:

1. Read the current terminal output
2. Check for new errors and warnings
3. Check build status and hot reload
4. Wait 5 seconds and read again

### 3. Handle Errors

> Goal: Handle Errors

Handle the errors found:

1. If errors appear, run `/resolve-errors` immediately
2. Fix the root cause, not the symptoms
3. Confirm the errors are fully resolved
4. Resume watching the terminal

### 4. Verify

> Goal: Verify

Verify correctness:

1. Confirm the terminal watch runs every 5 seconds
2. Confirm new errors can be detected and fixed
3. Verify the development server works normally
4. Summarize results per `workflows/report-status/SKILL.md` — command progress, errors, verdict

### Workflows

| Argument | Workflow |
|----------|----------|
| `report`, `status` | `workflows/report-status/SKILL.md` — terminal watch report (progress, errors, verdict) |

1. If the argument is `report`/`status` → read `workflows/report-status/SKILL.md` and follow its flow — reuse the existing session data
2. If no argument is given → run Steps 1-4 normally, with Step 4 reading and executing the `report-status` workflow

## Rules

### 1. Pre-Check Requirements

- Always run the development server first
- Fix any errors found before continuing
- Keep watching the terminal continuously every 5 seconds

### 2. Error Handling

- Use `/resolve-errors` to fix errors automatically
- Check error logs from the terminal
- Fix the root cause, not just the symptoms
- Confirm the errors are fully resolved

### 3. Terminal Monitoring

- Watch the terminal every 5 seconds
- Detect new errors and warnings
- Check build status
- Verify hot reload works

- Use /capture if needed
- Use /record-video-terminal-with-asciinema if needed
- Use /run-watch if needed

## Merged Details

### report-status

##### Goal



Turn the `/watch-terminal` watch session into a status report — command progress, errors, output highlights



##### Scope



- Use when `/watch-terminal` dispatches to `report`/`status` or when invoked after the watch ends

- Chat-only report — creates no permanent files



##### Execute



###### 1. Collect Output



> Goal: Collect output from the watch interval



1. Gather output snapshots per interval (default every 5s)

2. Detect state changes: progress %, new errors, completion signals

3. Cut noise — spinner frames, repeated progress lines



###### 2. Build Status Report



> Goal: Report how the command is progressing or stalling



1. Table: `No.`, `Time`, `Event`, `Detail`

2. Summary: current state, elapsed time, ETA if estimable

3. New errors that appear during the watch — split into a separate section



###### 3. Verdict



> Goal: Decide whether to intervene



1. Verdict: `running-fine` / `stalled` / `erroring` / `done`

2. If stalled/erroring → suggest `/resolve-errors` or kill the command

3. Use `/report-progress` if a progress bar format is wanted



##### Rules



- Report from actual output — never guess from silence

- stalled = no new output beyond the threshold — state the threshold used

- Keep the raw output available for drill-down



##### Expected Outcome



- Status report with a verdict: command normal / stalled / done

## Expected Outcome

- The development server is always running
- Errors are detected and fixed automatically
- The terminal is watched continuously every 5 seconds
