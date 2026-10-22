---
name: deep-test-setup-strategy
description: Set up a test suite — strategy level, scripts, directories, and first specs
argument-hint: "[minimal|standard|complete] [scope]"
related:
  - deep-test
  - update-tests
  - follow-tool-vitest
  - follow-tool-playwright
  - follow-tasks
  - follow-monorepo
  - setup-cicd
  - check-secrets
  - follow-secret-manager
  - update-config
  - resolve-errors
  - ask-me
---

## Goal

Stand up a test suite from zero — or repair an incomplete one — at the strategy level the project actually needs: level chosen, runner configured, scripts in the manifest, `tests/<layer>/` in place, first specs green, test environment wired

## Scope

- dispatched from `/deep-test` (`strategy`, `setup`, `setup-test`) and reached automatically when the project has no test framework or no suite
- knowledge SSOT: `../references/strategy.md` — levels, pyramid, directory layout, scripts, coverage floors, best practices; never restate those tables here
- covers: level choice, runner config, manifest scripts, directory layout, first specs, test environment handoff
- does not cover: running/analyzing an existing suite (→ `/deep-test <domain>`), authoring specs for existing code (→ `/update-tests`), coverage gaps (→ `/deep-test coverage`), CI pipeline creation (→ `/setup-cicd`)

## Execute

### 1. Check Prerequisites

> Goal: know the real runner, workspaces, and what already exists

1. Read the manifest (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`) and the lockfile — never assume a framework the project does not depend on
2. Detect the existing runner per ecosystem (`vitest`, `jest`, `bun test`, `cargo nextest`, `pytest`, `go test`) and any existing config file
3. Several manifests or workspace config → run `/follow-monorepo` first; the level and layout are chosen per workspace, not globally by guess
4. A suite already exists → do not rebuild it: record its level/layout, fix only the missing layer, then hand back to `/deep-test all`

### 2. Select The Strategy Level

> Goal: pick the smallest level that buys the confidence the project needs

1. Apply `references/strategy.md` `## 1. Strategy Levels` to the evidence from `### 1` — size, callers, money/auth flows, CI presence
2. Ambiguous or the user's intent is unclear → run `/ask-me` with the level table instead of guessing
3. Write the chosen level into the project `AGENTS.md` test convention (one line: level + layout + spec naming)

### 3. Configure The Runner

> Goal: a working config with sane defaults, merged into what exists

1. Install the runner for the stack via `/follow-tool-vitest` (Bun/Node) or the stack's own skill — the framework decision lives there, not here
2. e2e layer requested → run `/follow-tool-playwright` (config `testDir: 'tests/e2e'`, `webServer`, `forbidOnly` on CI)
3. Merge with the existing config through `/update-config` — never overwrite a config whole; keep only keys that override defaults per `/follow-default-config`
4. Coverage provider + thresholds per `references/strategy.md` `## 5. Coverage Floors`; output dir added to `.gitignore`

### 4. Apply Test Scripts

> Goal: every layer present in the repo is runnable with one command

1. Apply the script table in `references/strategy.md` `## 4. Test Scripts` through `/follow-tasks`; name per that skill's standard (`test`, `test:watch`, `test:coverage`, `test:integration`, `test:e2e`, `test:component`)
2. Only scripts whose layer really exists — a script pointing at a missing directory is a lie that CI will repeat
3. Verify each script by running it once; a script that cannot run is not done

### 5. Set Up Test Directories

> Goal: the layout is in place and matches the one recorded convention

1. Create `tests/unit`, `tests/integration`, `tests/e2e`, `tests/component` only for the layers the level includes, plus `tests/fixtures` and `tests/helpers` (`references/strategy.md` `## 3. Directory Structure`)
2. A legacy root `e2e/` present → move it to `tests/e2e/` (dry run, then move), update `testDir` + every script, then `/update-references`
3. Seed one factory/helper per layer so the next spec does not copy-paste setup

### 6. Write The First Specs

> Goal: the suite proves itself green before it is trusted

1. Run `/update-tests` to write the unit specs (and integration/e2e when the level includes them) — behavior-first, AAA, no placeholder assertions
2. Run `/deep-test all` to execute every layer that has a signal; red → `/resolve-errors`, never delete the spec to pass
3. Spec quality check: `/deep-test test-correctness` on the new specs — a test that cannot fail is a dead test

### 7. Set Up The Test Environment

> Goal: the suite runs the same locally and in CI

1. Dispatch `workflows/config-test-env/SKILL.md` — env vars, `.env.test`, fixtures, test database, CI secrets
2. Run `/check-secrets env-vars` to prove the vars the tests need exist; secrets → `/follow-secret-manager`, never in files
3. No CI test step yet → `/setup-cicd` before claiming the environment is complete

### 8. Validate

> Goal: the level is met or the gap is reported

1. Run every manifest script once; coverage measured against the level floor (`references/strategy.md` `## 5. Coverage Floors`)
2. Re-read the best-practice list (`references/strategy.md` `## 6. Test Best Practices`) against the new specs — fix what contradicts it
3. Report before/after: level, layout, scripts added, specs written, coverage, remaining gaps with a reason

## Rules

- Evidence over preference — the level and the runner come from the manifest and the real suite, never from habit
- One layout per project: `tests/<layer>/`, e2e always `tests/e2e/`
- Merge, never clobber — existing config, scripts, and directories are amended through `/update-config`, not replaced
- Setup stops where authoring begins: this workflow writes config/scripts/helpers and seeds specs via `/update-tests`, it never restates the domain workflows
- Every added script is run once before it is reported as set up
- Destructive steps (moving a directory, deleting a config) → dry run + user confirm

## Expected Outcome

- the strategy level is chosen from evidence and recorded in `AGENTS.md`
- runner config, manifest scripts, and `tests/<layer>/` exist and every script runs
- first specs are green and pass `/deep-test test-correctness`
- test environment is wired or its gaps are reported with a reason
