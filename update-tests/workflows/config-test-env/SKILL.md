---
name: update-tests-config-test-env
description: Configure the test environment — env vars, fixtures, test db and CI test env
argument-hint: "[scope]"
related:
  - update-tests
  - deep-test
  - update-config
  - check-secrets
  - deep-review
  - follow-secret-manager
  - follow-monorepo
  - setup-cicd
  - resolve-errors
  - ask-me
---

## Goal

Set up the test environment so tests run deterministically — env vars, fixtures dir, test database, and the CI test env complete and merged with the existing config

## Scope

- dispatched from `/update-tests` (`test-env`, `env`, `fixtures`, `test-db`, `config-test-env`) and from `workflows/setup-strategy/` `### 7` — use it after the strategy level and layout exist
- covers: test env vars, fixtures/helpers directories, test database/services, CI test environment
- does not cover writing tests (→ `SKILL.md` `### 4. Write Tests Per Layer`), coverage tooling (→ `/deep-test coverage`), or building the suite from zero (→ `workflows/setup-strategy/`)

## Execute

### 1. Read Current Test Config

> Goal: know the existing config before editing — never clobber

1. check the existing test config: `vitest.config.*`, `pytest.ini`, `Cargo.toml`, CI workflows
2. run `/check-secrets env-vars` — vars the tests need vs those defined
3. if monorepo → run `/follow-monorepo` to identify the test env per workspace
4. if no test config is found at all → go back through `workflows/setup-strategy/` first

### 2. Configure Test Env Vars

> Goal: the test env is clearly separate from dev/prod

1. create/update `.env.test` or the test env file per framework convention — merge with the existing one through `/update-config`
2. test vars must point only at test resources — never at production db/services
3. secrets the tests need → `/follow-secret-manager`; CI secrets go in repo settings, not files
4. add the `.env.test` pattern to `.gitignore` if it holds real values — keep `.env.test.example` as a placeholder

### 3. Setup Fixtures And Test Database

> Goal: test data and db isolation are ready

1. create `tests/fixtures/` and `tests/helpers/` per the layout in [../../references/strategy.md](../../references/strategy.md) `## 3. Directory Structure` — or the convention the project already uses
2. test database: separate db name/schema from dev — use an ephemeral option (container, in-memory, per-run db) per the stack
3. seed/migration strategy for the test db — deterministic and reset between runs
4. run `/deep-review` — tests share no state and do not depend on each other

### 4. Configure CI Test Env

> Goal: CI runs tests the same way as local

1. add the test env vars/secrets to the CI workflow — read from CI secrets, never hardcode
2. add the services the tests need in CI (e.g. a database service container)
3. if there is no CI test step yet → run `/setup-cicd`

### 5. Verify

> Goal: tests run in both local and CI

1. run `/deep-test unit` (and the layers the change touched) — the suite passes with the new test env
2. test a missing var → a clear error, not a silent fallback
3. if it fails → revert the keys just edited and report the diff — or `/resolve-errors` max 3 rounds
4. report the before/after config briefly to the user

## Rules

- merge with the existing config — never overwrite the whole test config/env file unless necessary
- the test env must be separate from dev/prod — tests must never touch production resources
- never commit secrets or real values — placeholders only in example files
- tests must be deterministic — fixed fixtures, db reset between runs
- unclear which resources are test-safe → `/ask-me`, never point tests at a shared or production resource

## Expected Outcome

- test env vars complete and separate from dev/prod
- fixtures/helpers structure per convention, test db isolated
- CI runs the tests passing with the same env
