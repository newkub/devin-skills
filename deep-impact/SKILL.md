---
name: deep-impact
description: Analyze the deep impact of a change before refactor, delete, rename, or upgrade
argument-hint: "[scope]"
related:
  - deep-review
  - search
  - report-workspace-graph
  - report-public-api
  - update-references
  - rename
  - run-test
  - deep-validate
---

## Goal

Analyze the deep impact of a code, dependency, API, infrastructure, or architecture change before acting, to reduce regressions and surprises

## Scope

Use before refactor, delete, rename, move, upgrade dependency, change public API, or major architectural change
Not for fixing immediate errors — use `/resolve-errors`
Not for finding the cause of a bug — use `/deep-debug`

## Execute

### 1. Define Change Scope

> Goal: clearly identify what will change

1. Define the target: file, function, class, API endpoint, dependency, config
2. Define the nature of the change: refactor, delete, rename, upgrade, behavior change, signature change
3. Define the motivation: why the change is needed
4. Run `/scan-codebase` to understand the context

### 2. Map Direct Dependencies

> Goal: find consumers that use the target directly

1. Run `/deep-review` to find imports, consumers, references
2. Run `/search-files-patterns` to find call sites, imports, string references
3. Use ast-grep to find patterns that could break if the target changes
4. Check the public API: `/report-public-api` if it is a library/project
5. Record direct consumers as a list with locations

### 3. Map Indirect Dependencies

> Goal: find the chain effects of the change

1. Check the workspace graph: `/report-workspace-graph` if it is a monorepo
2. Find downstream consumers of consumers (2-3 levels)
3. Check transitive dependencies for a package upgrade
4. Identify shared config, types, schemas that could be affected
5. Run `/deep-thinking` if the chain is complex

### 4. Estimate Blast Radius

> Goal: assess the size and severity of the impact

1. Number of files to update
2. Number of consumers, both internal and external
3. Number of tests that may fail
4. Systems or features that may go down
5. Whether data migration or schema changes are required

### 5. Assess Risk

> Goal: assess risks and mitigation

1. Run `/deep-review` to estimate probability and impact
2. Identify risks across dimensions: correctness, performance, security, compatibility, DX
3. Rank risks by severity
4. Design mitigation for each high risk
5. Define a rollback plan if needed

### 6. Plan Migration

> Goal: create a safe change plan

1. Choose a strategy: in-place, backward-compatible, feature flag, staged rollout, blue-green
2. Identify breaking changes and options to reduce their impact
3. Plan reference updates: `/update-references` or `/rename`
4. Plan testing: run `/run-test` or `/run-verify`
5. Define the timeline and checkpoints

### 7. Execute Change Safely

> Goal: carry out the change per the plan

1. Do a dry run for high-impact changes
2. Change one step at a time per the migration plan
3. Run tests after each stage
4. Run `/deep-validate` to check references, types, lint
5. If tests fail → go back to `/deep-debug` to find the root cause

### 8. Verify And Communicate

> Goal: confirm the change is safe and inform the team

1. Run the full test suite
2. Run lint, typecheck, build
3. Run `/report` summarizing impact, risk, mitigation, test results
4. Record migration notes for consumers
5. Notify the team or stakeholders if there is a breaking change

## Rules

### 1. No Guessing

- Use tools to find real references; never guess the consumer count
- Don't create a breaking change unless necessary
- Check consumers both internal and external

### 2. Backward Compatibility

- Always try to preserve backward compatibility
- If you must break, provide a migration path and a deprecation period
- Don't remove a public API without a plan

### 3. Tool-First

- Use `/deep-review`, `/search-files-patterns`, ast-grep, report workspace graph
- Don't make broad changes without evidence
- Record the analysis results before acting

### 4. Risk-Driven

- Don't merge or deploy with high risks that lack mitigation
- Verify the rollback plan before a major change
- Split the change into small batches if the blast radius is wide

## Expected Outcome

1. A clear list of consumers and references
2. A measurable blast radius assessment
3. A risk matrix with mitigation
4. A safe migration plan
5. Test results confirming no regressions
6. Communication / migration notes for the team
