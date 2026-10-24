# Update Tests — Test Strategy Reference

The strategy SSOT for building a suite (merged from the deleted `/follow-test`): pick the level, lay out the directories, wire the scripts, and know the coverage floors — `workflows/setup-strategy/` executes it, this file is the knowledge it reads

- Test environment (env vars, fixtures, test db, CI) → `workflows/config-test-env/`
- Writing or restructuring specs → `SKILL.md` `## Execute`; running a domain → `/deep-test <domain>` (`references/<domain>.md` there)
- Coverage loop and thresholds → `/deep-test coverage` (`deep-test/references/coverage.md` — the run-time owner); this file only sets the setup-time floor

## 1. Strategy Levels

> Goal: pick the smallest level that gives the confidence the project needs

| Level | Layers | Suits |
|-------|--------|-------|
| Minimal (default) | unit | small-medium projects |
| Standard | unit + integration + component | projects needing higher confidence across module boundaries |
| Complete | Standard + e2e, performance, visual, contract | production systems with real users and money |

1. Read the project signals before choosing: `package.json`/`Cargo.toml`/`pyproject.toml` scripts, existing test dirs, CI test step
2. No suite at all → Minimal first (a green unit suite beats an unfinished e2e suite); already has e2e without unit → the suite is upside down, fix unit first
3. Level chosen → coverage floor from `## 5. Coverage Floors`; `/deep-test coverage` still closes to its own argument target (default 100%) — the level is the setup-time floor, not a cap

## 2. Test Pyramid

> Goal: keep the suite fast, cheap, and maintainable

- ~70% unit — one function/module in isolation, no real IO, < 10ms per test
- ~20% integration — module boundaries, adapters, database, API handlers against real deps
- ~10% e2e — complete user flows through the browser, critical paths only (auth, main journey, money, checkout)

An inverted suite (mostly e2e) is slow, flaky, and expensive — move assertions down a layer instead of adding another e2e spec

## 3. Directory Structure

> Goal: one layout per project — every layer under `tests/`, no second root

```text
tests/
├── unit/            # pure units, isolated
├── integration/     # module boundaries, adapters, api handlers
├── e2e/             # Playwright specs — always here, never a root e2e/
├── component/       # isolated component render/props/events
├── fixtures/        # reusable data + seed helpers
└── helpers/         # setup/teardown utilities, page objects, factories
```

1. Default layout is `tests/<layer>/`; unit specs may stay colocated as `*.test.ts` next to the source when the project already does that — e2e never is
2. e2e lives in `tests/e2e/` — point the runner at it (`testDir: 'tests/e2e'`, `include: ['tests/e2e/**/*.e2e.ts']`); a root `e2e/` is a legacy layout → move it with `/relocation`, update `testDir` + scripts, then `/update-references`
3. One naming convention for spec files per project (`*.test.ts`, `*.spec.ts`, `*.e2e.ts`) — record it in `AGENTS.md`, never mix two inside one layer
4. `fixtures/` holds data and seed helpers, `helpers/` holds code — assertions stay in the specs
5. Never commit reports/screenshots/coverage output — add the runner's output dirs to `.gitignore`

## 4. Test Scripts

> Goal: every layer runnable with one documented command

| Task | Bun/Node | Rust | Python | Go |
|------|----------|------|--------|----|
| test | `bun run test` (`vitest run`, `bun test` when the project uses it) | `cargo nextest run` | `pytest` | `go test ./...` |
| test:watch | `vitest` | `cargo nextest run --watch` | `pytest-watch` | `go test ./... -count=1` in a loop |
| test:coverage | `vitest run --coverage` | `cargo llvm-cov --html` | `pytest --cov` | `go test -coverprofile=coverage.out ./...` |
| test:integration | `vitest run --config vitest.integration.config.ts` | `cargo nextest run --test-dir integration` | `pytest tests/integration` | `go test ./tests/integration/...` |
| test:e2e | `playwright test` (or `vitest run --config vitest.e2e.config.ts`) | `cargo nextest run --test-dir e2e` | `pytest tests/e2e` | `go test ./tests/e2e/...` |
| test:component | `vitest run --config vitest.component.config.ts` | — | — | — |

1. Scripts live in the manifest (`package.json`, `Cargo.toml`, `Makefile`/`justfile`, `mise` tasks) — `/follow-tasks` owns the standard naming; every layer present in the repo has a script
2. A layer without a script is not a layer — either add the script or drop the directory
3. CI calls the same scripts, never a hand-written command that drifts from local

## 5. Coverage Floors

| Level | Unit | Integration | E2E | Overall |
|-------|------|-------------|-----|---------|
| Minimal | 70% | — | — | 70% |
| Standard | 85% | 60% | — | 80% |
| Complete | 95% | 80% | 50% | 90% |

- Thresholds go in the coverage config so a regression fails the run (`/deep-test coverage` `## 2. Setup Coverage Config`)
- Never lower a threshold to make a red build green — write the test or record the exclusion with a reason
- Coverage is a floor, not a goal: 100% of trivial getters proves nothing — the assertion quality check is `/deep-test test-correctness` + `/deep-test mutation`

## 6. Test Best Practices

1. AAA — arrange, act, assert, in that order, visibly separated
2. Name by scenario + expectation (`rejects expired token`), never `test1` / `it works`
3. One behavior per test — several behaviors in one body → split
4. Independent tests — no shared mutable state, any order, any subset runnable
5. Fast feedback — unit < 10ms, no arbitrary `setTimeout`/sleep in any layer
6. Mock only the boundary (network, clock, fs, payment) — never mock the unit under test
7. Cover edge cases — empty, null/undefined, boundary, duplicate/concurrent, permission denied, upstream failure
8. Fixtures over copy-paste setup; factories over 40-line literal objects
9. CI runs the suite on every push — a test that only runs locally does not exist
10. Tests are documentation — a reader learns the contract from the spec names alone

## 7. Regression Testing

> Goal: prove a change did not break what already worked

1. Identify changed files/modules with `git diff`
2. Trace dependencies and downstream effects — critical paths and integration points first
3. Select the specs that cover the changed code, the critical paths, and the relevant edge cases
4. Run unit for the changed modules, integration for the affected flows, e2e for the critical user journey
5. Analyze failures by error pattern — separate regressions from pre-existing bugs, check flakiness (`/check-flaky-tests`)
6. Run smoke on critical functionality + the specs covering the changed lines first; let CI repeat the full pass near production
7. Fix the regression, add the missing case, re-run until green — never skip regression to save time

## 8. Advanced Testing

| Concern | Owner |
|---------|-------|
| assertion strength (mutation) | `/deep-test mutation` |
| throughput/latency/breaking point | `/deep-test load` |
| UI regression via screenshots | `/deep-test visual` |
| consumer/provider contracts | `/deep-test contract` |
| dependencies and code vulnerabilities | `/scan-security` + `/run-audit` |
| property/fuzz invariants | `/deep-test property` |

Pick these only at the Complete level or when a real signal asks for it — a property suite on a CRUD form is cost without evidence

## Rules

- One level per project, recorded in `AGENTS.md` — changing it is a decision, not a side effect
- One layout per project: `tests/<layer>/`, e2e always `tests/e2e/`
- Setup (`workflows/setup-strategy/`) writes config, scripts, layout, and env — specs are written through `SKILL.md` `### 4. Write Tests Per Layer`
- Never weaken an assertion, skip a test, or lower a threshold to reach green
- Running the suite stays in `/deep-test` — this reference only defines what the suite must look like
- Correctness of the specs themselves → `/deep-test test-correctness`; failures → `/resolve-errors`

## Expected Outcome

- the level is chosen and written down with its coverage floor
- `tests/<layer>/` exists with fixtures/helpers, e2e under `tests/e2e/`
- every layer has a manifest script that CI reuses
- the suite is green, fast, and ordered per the pyramid
