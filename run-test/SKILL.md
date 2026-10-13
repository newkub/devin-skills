---
name: run-test
description: Test dispatcher — pick a test-* skill from the domain arg or signals; auto-detect framework
argument-hint: "[scope|domain] [target%]"
related:
  - test-unit
  - test-all
  - test-api
  - test-cli
  - test-contract
  - test-coverage
  - test-e2e
  - test-integration
  - test-mutation
  - test-visual
  - test-load
  - test-smoke
  - test-component
  - test-a11y
  - test-property
  - test-database
  - test-mobile
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-check
  - run-verify
  - run-lint
  - run-typecheck
  - report
---

## Goal

Test dispatcher — pick the matching `test-*` skill from the domain argument or signals, then delegate — unit/fast tests are the default; `all` → `/test-all` orchestrator

## Scope

Use to run every kind of test — this skill is a dispatcher only, it does not run tests itself; the real workflows live in the `test-*` skills

Covers framework detection (delegated): Vitest, Jest, Bun test, Node test runner, Mocha, pytest, go test, cargo test, dotnet test, cargo nextest

- To update/write tests → `/update-tests`
- For deep domain analysis (route coverage, exploratory, subagent fan-out) → `/deep-test <domain>`

| No. | Signal found | Domain → Skill |
|----:|-------------|----------------|
| 1 | `*.test.*`, `*.spec.*`, vitest/jest/pytest/go test | unit (default) → `/test-unit` |
| 2 | shared modules, DB, services integration | `integration` → `/test-integration` |
| 3 | HTTP endpoints, OpenAPI spec, API routes | `api` → `/test-api` |
| 4 | CLI binary, `bin` field, command definitions | `cli` → `/test-cli` |
| 5 | consumer/provider services, Pact, contract files | `contract` → `/test-contract` |
| 6 | web frontend, browser flows | `e2e` → `/test-e2e` |
| 7 | UI components, design system, screenshots | `visual` → `/test-visual` |
| 8 | coverage config or defined target | `coverage` → `/test-coverage` (default 100%) |
| 9 | critical logic, mutation config | `mutation` → `/test-mutation` |
| 10 | perf concern, k6/autocannon config, load scripts | `load` → `/test-load` |
| 11 | post-build/deploy sanity, `smoke` scripts/tags, health checks | `smoke` → `/test-smoke` |
| 12 | `@testing-library/*`, Vitest browser, Playwright CT, Storybook | `component` → `/test-component` |
| 13 | axe/pa11y config, WCAG/a11y specs | `a11y` → `/test-a11y` |
| 14 | fast-check/proptest/hypothesis, fuzz targets | `property` → `/test-property` |
| 15 | migrations dir, ORM config, testcontainers, test DB scripts | `database` → `/test-database` |
| 16 | `.maestro/`, detox, androidTest, XCUITest, mobile apps | `mobile` → `/test-mobile` |
| 17 | multiple domains at once | `all` → `/test-all` (orchestrator) |

## Execute

> Pre-Run: Always run `/deep-review` first — `test-*` must be reviewed/assessed before the main work, never skip; if findings are blockers, fix or report before running (test)

### Domain Dispatch

> Goal: Choose a `test-*` from the argument or signals

- argument is a domain (`a11y`, `api`, `cli`, `component`, `contract`, `coverage`, `database`, `e2e`, `integration`, `load`, `mobile`, `mutation`, `property`, `smoke`, `visual`) → run `/test-<domain>`
- argument is `all` → `/test-all`; argument is `unit` → `/test-unit`
- not specified, or a unit scope → `/test-unit` (default)
- multiple signals at once but `all` not specified → `/test-all` lets the orchestrator choose

## Rules

- this skill is a dispatcher only — never duplicate the `test-*` workflows in this file
- never use `.skip`, `.only`, `xit`, `xtest` to avoid failures (governed by the target `test-*`)
- Use /run-check if needed
- Use /run-watch if needed
- Use /suggest-next-action if needed

## Expected Outcome

- the domain is dispatched to the correct `test-*` — unit default, `all` → orchestrator
- the test report is persisted in `.devin/temp/report/` (by the target `test-*`)
