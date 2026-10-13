---
name: test-contract
description: Run contract tests — consumer/provider compatibility + schema conformance between paired services
argument-hint: "[scope]"
related:
  - run-test
  - test-all
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-verify
  - create-report-in-dot-devin
  - report
---

## Goal

Run contract tests — consumer/provider compatibility + schema conformance across both sides of the services — signals: Pact files, `pacts/` dir, pact-broker config, shared schemas (protobuf/JSON Schema), consumer/provider dirs

## Scope

Use when running contract tests — run-only, does not modify tests (deep analysis → `/deep-test contract`)

## Execute

> Pre-Run: always run `/deep-review` first — `test-*` must be reviewed/assessed before the main work; never skip; if a finding is a blocker, fix or report it before running (test)

### 1. Detect

`pacts/*.json`, pact-broker config, `*.contract.test.*`, `.proto`/JSON Schema; runner = Pact verifier / project runner for schema-conformance / `schemathesis` for OpenAPI-driven; identify consumer vs provider — must run in both directions

### 2. Run

consumer tests → generate/publish pact → provider verification against the pact; schema-only → validate responses against the schema; record per-interaction status, violations, breaking changes

### 3. Classify

provider violates the pact → breaking change in source → `/resolve-errors` or report a versioning decision; stale consumer expectation → pact outdated → `/update-tests`; broker/env not ready → environment; repeats ≥3 times → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/contract-test-<time>.md`; all pass → `/run-verify`

## Rules

- run-only (deep analysis → `/deep-test contract`)
- Never edit pacts/assertions to accommodate a breaking change without a report — a violation is a decision point, not an auto-fix
- Provider verification must be reproducible — fixed fixtures, clear pact version

## Expected Outcome

- Contract tests run in both directions (consumer + provider) with violations and breaking changes
- Failures classified as source/test/environment
- Report persisted in `.devin/temp/report/`
