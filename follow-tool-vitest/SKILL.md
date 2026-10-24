---
name: follow-tool-vitest
description: Install and set up Vitest 5 for unit testing with Vite
argument-hint: "[scope]"
related:
  - follow-tool-vite
  - follow-tool-playwright
  - update-tests
  - run-test
  - follow-lib-tstyche
  - follow-tool-viteplus
  - migrate

---

## Goal

Set up Vitest as the main testing framework for a TypeScript/JavaScript project

## Scope

Install and set up Vitest 5 for unit testing in single projects and monorepos

- jsdom DOM environment — see `references/apis.md`

- Boundary: use Vitest for unit/integration tests — for E2E/browser flows use `/follow-tool-playwright`; for component DOM queries use the `/follow-tool-vite` workflow `testing-library`; inside a Vite+ project run tests with `vp test` (imports from `vite-plus/test`) → `/follow-tool-viteplus`

## Execute

### Workflows

> Goal: dispatch to the workflow matching the topic

| Topic | Workflow |
|-------|----------|
| setup | `workflows/setup-vitest/SKILL.md` — install, vitest.config, environment, coverage provider |
| migrate | `workflows/migrate-from-jest/SKILL.md` — jest→vitest globals, mock APIs, snapshots, verify; multi-stage rollout with rollback → `/migrate` |
| optimize | `workflows/optimize-tests/SKILL.md` — isolation, pool options, shard, watch excludes |

1. If the argument matches a topic → read and follow `workflows/<name>/SKILL.md` instead of the steps below
2. If not → follow the steps below as normal

### 1. Installation

> Goal: install Vitest and verify requirements

1. Do `/follow-tool-vite` to check the Vite setup
2. Install Vitest with `bun add -D vitest` (latest `5.0.2`, verified 2026-09-29)
3. Install the coverage tool with `bun add -D @vitest/coverage-v8`
4. Confirm Vite >= v6.4.0 and Node >= v22.12.0 (Vitest 5 requirements)
5. Add a test script to `package.json`
6. Use `bun run test` instead of `bun test` to avoid the Bun test runner
7. If the project uses `@effect/vitest` → its peer dep requires `vitest ^3.2.0`; pin `vitest@^3.2` instead (see `/follow-lib-effect-ts`)

### 2. Configuration

> Goal: create `vitest.config.ts` with the necessary options

1. Create `vitest.config.ts` or use the existing `vite.config.ts`
2. Enable `globals` to reduce imports
3. Set the test patterns to `/*.test.ts` or `/*.spec.ts`
4. Set the environment to `node` or `jsdom` as needed
5. Set up coverage with `@vitest/coverage-v8` and an explicit `coverage.include`
6. Set `test.include` and `test.exclude` for glob patterns
7. Enable type-checking with `typecheck.enabled: true`
8. Add `vitest/globals` to `tsconfig.json` types
9. Set `retry` for flaky tests
10. Set `maxWorkers` for pool performance
11. Add the `lcov` reporter for CI/CD

### 3. Monorepo Setup

> Goal: set up multiple projects with `test.projects`

1. Use the `test.projects` array for multiple packages (replaces the deprecated `workspace`, removed since Vitest 3.2)
2. Define glob patterns or inline config for each project
3. Use `defineProject` instead of `defineConfig` in project-level config files
4. Use `extends: true` to inherit options from the root config
5. Set `--project` to run tests on a specific project
6. Give each project a unique `name`

### 4. Writing Tests

> Goal: write tests per conventions

1. Do `/update-tests` to write quality tests
2. Use `test` or `it` from globals instead of importing
3. Use `expect` for assertions
4. Organize test files mirroring the source structure
5. Use `describe` for grouping related tests
6. Use `beforeEach`, `afterEach`, `beforeAll`, `afterAll` for setup/teardown
7. Use `test.for` for parameterized tests
8. Use test tags to categorize tests and apply shared options such as `timeout` or `retry`

### 5. Test Tags

> Goal: categorize and filter tests with tags

1. Define tags in the config via the `test.tags` array — each tag has a `name` and optional test options
2. Tag tests with `test('name', { tags: ['db', 'flaky'] }, fn)`
3. Filter with `--tags-filter`, e.g. `vitest --tags-filter="unit"` or `vitest --tags-filter="frontend && !flaky"`
4. Use tag options such as `timeout`, `retry` that apply automatically to every test carrying that tag

### 6. Type-Checking

> Goal: enable type tests with `typecheck`

1. Enable type-checking with `typecheck.enabled: true`
2. Use `.test-d.ts` files for type tests
3. Set `typecheck.include` and `typecheck.exclude`
4. Set `typecheck.tsconfig` for a custom tsconfig
5. Use `typecheck.only` to run type tests only
6. Set `typecheck.allowJs` for JavaScript files
7. Set `typecheck.ignoreSourceErrors` to ignore errors outside test files
8. Boundary: vitest type tests are inline within a single suite — for a separate type-test layer (public API contracts, run across multiple TypeScript versions via `--target`), use `tstyche` per `/follow-lib-tstyche`; pick one owner per file, never duplicate assertions in both

### 7. Fixtures And Test Context

> Goal: create reusable fixtures with `test.extend`

1. Use `test.extend()` to create reusable fixtures
2. Use the `test`, `file`, `worker` scopes for lifecycle management
3. Use the builder pattern in Vitest 5: return a value instead of calling `use()` and TypeScript infers the type automatically
4. Use the `onCleanup` callback for teardown logic
5. Use `test.override` to override fixture values in specific suites (Vitest 5)
6. Use `{ injected: true }` for project-specific fixture values

### 8. Hooks

> Goal: use lifecycle hooks to wrap tests/suites

1. Use `aroundEach` to wrap tests in a context such as `AsyncLocalStorage` or a database transaction
2. Use `aroundAll` to wrap the entire suite
3. Use `beforeAll`, `afterAll` receiving file and worker contexts from fixtures (Vitest 4.1)

### 9. Mocking And In-Source Testing

> Goal: mock modules and write in-source tests

1. Enable `includeSource` in the config and write tests inside the source code with an `if (import.meta.vitest)` block — for utilities tested close to their implementation
2. Use `vi.mock` for mocking modules, `vi.fn` for creating mock functions, and `vi.when` for conditional mocking by arguments (Vitest 5)
3. Use `vi.spyOn` for spying on methods and `vi.defineHelper` to wrap utility functions so stack traces point at the call site
4. Use chai-style assertions such as `expect(fn).to.have.been.called` when migrating from Sinon
5. Use `vi.clearAllMocks` for cleanup between tests

### 10. Coverage Watch And CI

> Goal: set up coverage, watch mode, and CI integration

1. Use an explicit `coverage.include` because Vitest 4+ reports only files loaded during the test run
2. Use `coverage.changed` to limit the coverage report to changed files, and `/* v8 ignore start */`/`/* v8 ignore stop */` to ignore specific lines
3. Set `coverage.htmlDir` for custom HTML coverage output, and coverage thresholds for quality gates
4. Use watch mode for development and `vitest run` for CI/CD
5. Install the VS Code extension for IDE integration
6. Use `--detect-async-leaks` to catch leaked timers and async resources, and the GitHub Actions Job Summary reporter for CI

### Use Cases

| Scenario | Use case |
|----------|----------|
| Mocking modules, fake timers, mocked types | `usecases/mock-modules-and-fake-timers.md` |
| Coverage thresholds as a CI gate | `usecases/coverage-gate-in-ci.md` |

## Rules

### 1. Vitest 4 Breaking Changes

- `poolOptions` was removed — use top-level `maxWorkers`, `isolate`, `vmMemoryLimit` instead
- `maxThreads` and `maxForks` were replaced by `maxWorkers`
- `singleThread` and `singleFork` were replaced by `maxWorkers: 1, isolate: false`
- `coverage.all` and `coverage.extensions` were removed — use `coverage.include` instead
- The `workspace` config was deprecated — use `test.projects` instead
- Browser Mode is stable — use `@vitest/browser-playwright` instead of `@vitest/browser`

### 2. Monorepo Configuration

- Use the `test.projects` array for the multi-project setup
- Use `defineProject` in project config files, not `defineConfig`
- `coverage`, `reporters`, `attachmentsDir` are configurable only at the root level
- Each project must have a unique `name`

### 3. Fixture Best Practices

- Use the builder pattern (return value) instead of calling `use()` for automatic type inference
- Use `scope: 'worker'` only when `isolate: false` to get the full benefit
- Use `onCleanup` for teardown instead of manual cleanup in `afterEach`
- Use `test.override` for suite-specific fixture values

### 4. Test Organization

- Organize test files mirroring the source structure
- Use `describe` for grouping related tests
- Use test tags for categorizing and filtering tests
- Use `aroundEach` to wrap tests in a context

### 5. CI/CD

- Use `vitest run` for CI (not watch mode)
- Set `retry` for flaky tests in CI
- Use `--detect-async-leaks` only while debugging because it adds runtime overhead
- Use `coverage.changed` to limit the coverage report in CI
- Artifacts/output moved under the `.vitest/` directory in Vitest 5 — update CI artifact paths

### 6. Vitest 5 Breaking Changes

- `clearMocks` defaults to `true` — `vi.clearAllMocks()` runs before every test (implementations remain; only the call history is cleared)
- `test.sequential`/`describe.sequential` were removed — use `{ concurrent: false }` instead
- `vi.mock`/`vi.unmock`/`vi.hoisted` must be top-level only (Vitest 4 warned → Vitest 5 throws)
- `extends` in inline projects defaults to `true` and shares the Vite server (`sharedViteServer`) by default
- `testNamePattern` (`-t` flag) matches by full name joined with `' > '`
- unawaited `resolves`/`rejects` assertions fail instead of passing silently

- Use /follow-tool-playwright if needed
- Use `/follow-tool-vite testing-library` (workflows/testing-library) if needed
- Use /update-tests if needed
- Use /run-test if needed

## References

- [API & dependencies](references/apis.md)
- [CLI reference](references/cli.md)




- See best-practices/ for recommended patterns and pitfalls
- See usecases/ for end-to-end scenario recipes
- References: [Vitest — Best Practices](best-practices/vitest.md)

## Expected Outcome

- Vitest 5 installed and working
- Config supporting globals, projects, and monorepo
- All tests runnable
- Following best practices from the Vitest 5 official documentation
