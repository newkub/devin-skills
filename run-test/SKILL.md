---
name: run-test
description: Thin test dispatcher — route a domain or `all` to /deep-test; unit is the default
argument-hint: "[domain|all] [scope] [target%]"
related:
  - deep-test
  - update-tests
  - resolve-errors
  - run-check
  - run-verify
  - report-review

---

## Goal

Route a test request to the right `/deep-test` domain — by argument first, then by project signals; unit is the default, `all` runs the orchestrator

## Scope

Dispatcher only: every workflow (quick run path + deep steps + signals table) lives in `/deep-test` (`references/<domain>.md`) — never restate a domain workflow here

- Domains: `unit`, `component`, `integration`, `e2e`, `website`, `api`, `cli`, `contract`, `visual`, `a11y`, `property`, `database`, `mobile`, `smoke`, `load`, `coverage`, `mutation`, `usage`, plus `all`
- Write/change specs → `/update-tests`; improve the test strategy (flaky, coverage gaps, suite speed) → `/improve tests`; review test correctness → `/deep-review-codebase` (domain `review-test`)

## Execute

### 1. Dispatch

> Goal: pick one domain from the argument, or from signals

1. Argument is a domain name (`api`, `smoke`, `website`, ...) → run `/deep-test <domain>` and follow its `## Run Quick Path` (deep pass only when the argument asks for analysis)
2. Argument is `all` or several signals match at once → run `/deep-test all` (the orchestrator picks domains from signals in fail-fast order)
3. No argument and a plain unit scope → `/deep-test unit`
4. Detect the framework from the manifest/config as `/deep-test unit` does (Vitest, Jest, Bun test, Node test runner, Mocha, pytest, go test, cargo test/nextest, dotnet test)
5. Run `/run-check` (lint + typecheck) before the suite so failures are real test failures; report in chat via `/report-review` and persist per the domain reference

## Rules

- Dispatcher only — no test execution logic, no domain table in this file (SSOT: `/deep-test`)
- Never `.skip`, `.only`, `xit`, `xtest` to avoid failures (governed by the target domain)
- A failing suite is fixed by `/resolve-errors` (source) or `/update-tests` (spec), never by weakening assertions
- When the run is finished and green, the wider gate is `/run-verify`

## Expected Outcome

- the request lands on exactly one `/deep-test` domain (or the `all` orchestrator)
- the domain report is persisted under `.devin/temp/report/<workspace>/` by that domain
- green suite → `/run-verify`; red → classified fix, not suppression
