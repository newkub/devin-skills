---
name: loop-until-complete
description: Repeat work until fully complete or good enough, stopping before over-engineering
argument-hint: "[scope]"
related:
  - run-until-pass
  - retry
  - use-subagents
  - report
  - suggest-next-action
  - report-progress
  - simplify
  - deep-validate
  - continue

---

## Goal

Repeat work until the objective is achieved and it is fully complete, or until the "good enough" point where it cannot be made any better, or if it still can be done but the impact is not worth the cost, stopping before over-engineering

## Scope

Use for repeating work that must be verified until it passes the condition, or work that can be improved over multiple rounds such as refactor, optimize, editing content, adjusting UX, designing schema — including designing an agentic loop that runs automatically (scheduled/trigger/long-running) in `### 8`

## Execute

### 1. Define Loop Condition

> Goal: define a measurable condition

1. Identify the objective that must be achieved
2. Define a clear stop condition
3. Set a maximum number of rounds if necessary
4. Identify over-engineering indicators such as files/lines increasing unnecessarily, abstraction added with no consumer, complexity increasing

### 2. Establish Baseline

> Goal: know the starting point before iterating improvements

1. Record the current state of the work such as code, design, content, metrics
2. Identify the key indicators (KPIs) that will be used to measure improvement such as performance, readability, coverage, simplicity
3. If there is test/lint/build, run them to capture the baseline first

### 3. Execute Loop

> Goal: do the work repeatedly per the condition

1. Pick the single thing that can be improved the most this round
2. Use minimal changes to improve
3. Work according to the defined steps
4. Check the stop condition
5. If the result does not pass, do `/retry` to recheck and fix
6. Repeat if the condition is not yet met

### 4. Check Diminishing Returns

> Goal: assess whether it is worth continuing

1. If the result is the same, or improves by less than the threshold, stop
2. If improving further requires more resources/time/complexity than the benefit gained, stop
3. If the next improvement increases abstraction, dependency, or complexity disproportionately, stop
4. If the max iterations are not yet reached and there is still clear improvement, continue

### 5. Decide Continue Or Stop

> Goal: decide rationally whether to stop or continue

1. If all criteria pass and there is no significant improvement, stop
2. If the criteria are not yet met but the improvement has declined enough that it is not worth the cost, stop and report
3. If a better approach with high impact is found, continue in the next round
4. If you cannot think of how to make it better, do `/suggest-next-action` or `/ask-me`

### 6. Verify Completion

> Goal: verify the work is fully complete

1. Check whether the objective is achieved
2. Check the quality of the result
3. Confirm there is no pending work
4. Run `/run-check` or `/deep-validate` one final time

### 7. Finalize And Report

> Goal: summarize the result and deliver

1. Summarize the number of rounds, what changed, metrics before/after, and the reason for stopping
2. Do `/report` or `/report-progress` to show progress in round order
3. If ready, do `/ship` or `/continue` per context

### 8. Design Agentic Loop (Conditional — merged from `/follow-loop-engineering`)

> Goal: design a system that can find work, split work, delegate, verify results, persist state, and stop when reaching a human gate on its own

1. Define the purpose: the main goal of the loop, the trigger (cron, git event, issue, notification, or manual), a clear stop condition, max iterations or a budget to prevent an infinite loop
2. Work discovery: scan the sources of work — git diff, issues, PR comments, logs, metrics; use `/scan-codebase` / `grep` to find patterns that must be fixed; prioritize the work found; if there is no work → the loop stops and reports
3. Triage and isolate: categorize the work (bug, refactor, test, docs, security); isolate each task into an independent context — a branch or worktree; record the task state in `STATE.md`
4. Implement and verify independently: delegate via `/use-subagents` — a separate implementer agent and verifier agent, not sharing the same context/state; run test, lint, typecheck, build as appropriate; if it does not pass → send it back for fixing or skip to the next task
5. Persist state: update `STATE.md` with the work, results, decisions, next round + log, diff, test result, PR link; pending work across sessions → `/save-to-todo-md`; the state must be traceable
6. Human gates: identify risky or irreversible actions (publish, merge, push, delete, deploy) — summarize the result and proposal before asking the user; do not perform remote side effects without permission; if not approved → record the reason then stop or skip
7. Monitor and iterate: track the success rate, cost, review burden, number of human gates; a loop that generates more noise than value → reduce the frequency or remove it; adjust the trigger, triage rule, and max iterations; report every round with `/report`

## Rules

### 1. Safety

- Never loop infinitely
- There must be a stop condition that is actually verifiable
- If the maximum number of rounds is exceeded, stop and report
- Do a dry run before actions that change a lot

### 2. Quality

- Check the quality of the result before stopping
- Use minimal changes in each round
- Every round must have before/after comparison data
- Use numbers, test results, lint scores, or real metrics, not feelings

### 3. Stop Conditions

- Stop when the work is fully complete per the criteria
- Stop when the work is good enough per the defined criteria
- Stop when the work cannot be improved further without increasing cost or risk
- Stop when the next work has less impact than the cost
- If max iterations are reached, stop and report the reason

### 4. Over-Engineering Guardrails

- Never create a new abstraction, layer, or dependency unless truly necessary
- Never optimize a part that is not a bottleneck or has no evidence
- Never add features or config outside the current scope
- If in doubt about over-engineering, do `/simplify guard`

### 5. Agentic Loop Guardrails (merged from `/follow-loop-engineering`)

- Never loop infinitely — there must be a stop condition + max iterations; once exceeded → stop and report
- Never take a destructive action without passing a human gate; do not perform remote side effects without permission
- The implementer and verifier must not share the same context/state; every result has evidence — test output, diff, log
- Track token/execution cost per round; use minimal context; the loop must leave an audit trail (state, log, decision, result)

### 6. Related Skills

- Use `/retry` if necessary
- Use `/run-until-pass` if necessary
- Use `/suggest-next-action` if necessary
- Use `/report-progress` if necessary

## Expected Outcome

- The work is repeated until the objective is achieved or the good-enough point is reached
- The stop condition is clear
- The result is of good quality and complete
- No over-engineering or scope creep occurs
- There is a record of rounds, metrics, and the reason for stopping
- If used as an agentic loop: there is a design document (goal, trigger, stop condition, max iterations, human gates) and a traceable `STATE.md`
- The result is ready to validate and ship
