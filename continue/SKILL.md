---
name: continue
description: Continue assigned work to completion, verify thoroughness, and stop when the work is done.
argument-hint: "[session-id]"
related:
  - report-progress
  - follow-best-practice
  - suggest-next-action
  - ship
---

## Goal

Typing `continue` means "keep going" or "go ahead with the suggested action", specifically:
- Resume from where the work left off and carry it through the full assignment
- If a next action was suggested, do that
- If anything is still incomplete, keep going until it is done
- If everything is complete, stop

## Scope

Use for work that is stalled or needs to pick up from where it was paused.

## Execute

### 1. Assess Current State

> Goal: Assess Current State

1. Check the current state of the work in progress
2. Identify whether any work is outstanding and exactly what is pending
3. Review any TODO items or unfinished tasks
4. Check whether a next action was suggested (from `/suggest-next-action` or other suggestions)

### 2. Continue Incomplete Tasks

> Goal: Continue Incomplete Tasks

1. Finish the outstanding work completely
2. Verify that every requirement is implemented correctly
3. Fix any errors or issues found along the way

### 3. Verify Completion

> Goal: Verify Completion

1. Confirm all requested work is fully complete
2. Run verification commands if present (test, build, lint)
3. Make sure nothing was left unfinished or forgotten

### 4. Finalize

> Goal: Finalize

1. Summarize the completed work in a table
2. If the work is complete and the user asked to ship or deploy, suggest the next action based on context:
   - Deploying to staging → `/ship`
   - Releasing a patch → `/ship`
   - Unsure → use `/suggest-next-action` to pick the right ship option
3. Stop when everything is complete or when there is a clear next action

## Rules

### 1. Task Completion Rules

Rules for completing work fully:

1. Do everything you were assigned; never leave work half-done
2. Verify completeness before declaring it done
3. If you find unfinished subtasks, complete them before stopping
4. Don't stop until you are sure everything is complete

### 2. Verification Rules

Rules for verifying correctness:

1. Confirm there are no leftover TODO items
2. Confirm there are no unresolved errors or warnings
3. Confirm the code actually runs
4. Run tests or verification if needed

### 3. Reporting Rules

Rules for reporting results:

1. Always summarize completed work in a table
2. List the files or components that changed
3. State whether the work is ultimately complete
4. Stop once the report is complete

- Use /report-progress if needed
- Use /follow-best-practice if needed

## Expected Outcome

- Outstanding work is fully completed
- No TODO items remain
- Code runs for real and passes verification
- Work is summarized in a table
- Stop once everything is complete
