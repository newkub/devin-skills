---
name: follow-service-run-on-verify-connection
description: Confirm after setup/config that RunsOn (self-hosted GitHub runners on AWS) really works — stack healthy, runners registered with the repo/org, workflow labels match
related:
  - follow-service-run-on
---

## Goal

Confirm after setup/config that RunsOn (self-hosted GitHub runners on AWS) really works — stack healthy, runners registered with the repo/org, workflow labels match

## Scope

- Used when `/follow-service-run-on` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not change the stack or workflows

## Execute

### 1. Check AWS Stack

> Goal: the RunsOn CloudFormation stack is healthy

1. `aws cloudformation describe-stacks --stack-name runs-on` — status `CREATE_COMPLETE`/`UPDATE_COMPLETE`
2. Flag stacks in `*_FAILED` or `ROLLBACK_*` state

### 2. Check Runner Registration

> Goal: runners register with GitHub

1. `gh api repos/{owner}/{repo}/actions/runners` — runners are online
2. Flag: no runners, all runners offline, runner labels not matching `runs-on.yml`

### 3. Check Workflow Labels

> Goal: workflows use labels the runners support

1. Compare `runs-on:` labels in workflows with runner definitions in `runs-on.yml`
2. Flag labels with no runner definition — the job will hang unrun

### 4. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `stack-unhealthy` / `no-runners` / `label-mismatch`

## Rules

- Use describe/list calls only — never modify the stack
- Label mismatch = common silent failure — always flag
- Stack issues → report for the setup workflow to handle

## Expected Outcome

- Verdict with stack status + runner count + label evidence
