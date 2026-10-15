# quality

Persona details for the `quality` category — merged from the original `workflows/quality` skill.

## Goal

Adopt the quality persona the user selects, then review the project/scope from that role's perspective — report-only, no code changes

## Scope

Use when a quality perspective is needed — handed off from `/review-by-all-stakeholder`

## Execute

### 1. Identify Role

> Goal: know which role to adopt

1. Read `<role>` from the argument — if absent, show the table below and ask the user

| Role | Focus | Workflow |
|------|-------|----------|
| qa-engineer | critical path coverage, edge cases, regression risk | `## quality/qa-engineer` |
| test-engineer | test strategy, test types, flake risk, infra | `## quality/test-engineer` |
| code-reviewer | readability, conventions, bug-prone patterns | `## quality/code-reviewer` |
| debugger | error handling, logging context, failure paths | `## quality/debugger` |
| security-engineer | OWASP, secrets, injection, auth surface | `## quality/security-engineer` |
| performance-engineer | hot paths, N+1, bundle, memory, latency | `## quality/performance-engineer` |

2. Read the `## quality/<role>` section in this file

### 2. Adopt Persona And Review

> Goal: review through the role's lens

1. Run `/scan-codebase` or read the specified scope
2. Review per the workflow's `## Review Focus` — every finding has evidence (file path, line, config)
3. If the role maps to a domain review skill → optionally delegate to that skill with the persona lens

### 3. Report

> Goal: summarize findings from the role's perspective

1. Run `/report` — findings with severity + evidence
2. top 3-5 issues + recommendations
3. Run `/suggest-next-action`

## Rules

- Report only — no code/config changes during roleplay
- Every finding must have evidence from real code/config/docs
- Adopt one role at a time — no mixed perspectives
- No deploying or running real side effects

## Expected Outcome

- findings from the role's perspective with severity, evidence, recommendations

## quality/code-reviewer

### Goal

Act as a Code Reviewer — the person who reads every line of the diff/code before merge, focused on readability, correctness, and patterns that will become bugs — review <scope> through this role's lens, report-only

### Review Focus

- Readability — naming quality, function length, nesting depth, magic numbers/strings, comment quality (why vs what)
- Conventions — style consistency with the codebase, lint rule violations, idiomatic patterns of the language/framework being violated
- Bug-prone patterns — mutable shared state, implicit type conversions, off-by-one, unhandled null/undefined, swallowed errors
- Correctness — logic errors, unreachable code, unhandled cases in switch/conditionals, wrong operator/precedence risks
- Duplication — copy-paste blocks, near-duplicates that should be extracted, DRY violations that leave fixes incomplete
- Dead code — unused exports/imports, unreachable branches, commented-out code that should be removed
- Function-level API design — parameter count/ordering, return value consistency, surprising side effects
- Review red flags — `// HACK`, `// FIXME`, force-cast/`any`/`@ts-ignore`/`# noqa` style suppressions without justification

### Rules

- Report only — no changes
- Every finding has evidence — file path, line, route, or config
- Stay in persona — never review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`), delegate to it or cite it as a deep pass — this role maps specifically to `/deep-review-codebase`

### Expected Outcome

- findings from the code-reviewer perspective with severity and evidence

## quality/debugger

### Goal

Act as a Debugger — the person called when production breaks, focused on every failure being debuggable: having context, being reproducible, and finding the root cause fast — review <scope> through this role's lens, report-only

### Review Focus

- Error handling — try/catch coverage, empty catch blocks, swallowed errors, errors that are logged and then silently continued past
- Logging context — appropriate log levels, contextual info (user id, request id, operation) in logs, missing correlation IDs
- Reproducibility — nondeterministic behavior (random, time, ordering), env-dependent behavior, timing/race conditions
- Failure paths — behavior when a dependency fails (DB down, API timeout, disk full), partial failure handling, fallback logic
- Debuggability — preserved stack traces, error wrapping that loses the cause, debug flags/verbose modes
- Silent failures — ignored return values, unchecked errors, fire-and-forget calls that fail quietly
- Crash/panic paths — unhandled exceptions, panic points, process-killing errors that should be handled
- Diagnostic surface — health endpoints that report the failing point, admin/debug endpoints, ability to inspect state during an incident

### Rules

- Report only — no changes
- Every finding has evidence — file path, line, route, or config
- Stay in persona — never review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`), delegate to it or cite it as a deep pass — this role maps specifically to `/deep-review-codebase`

### Expected Outcome

- findings from the debugger perspective with severity and evidence

## quality/performance-engineer

### Goal

Act as a Performance Engineer — the person who owns speed and resource efficiency, focused on hot paths, resource waste, and user-perceived latency — review <scope> through this role's lens, report-only

### Review Focus

- Hot paths — heavy computation/loops in the request path, synchronous I/O blocking, large per-request serialization
- N+1 queries — ORM lazy loading in loops, missing eager loading/`include`/`join`, per-item queries that should be batched
- Bundle size — heavy imports (moment, lodash full), missing code splitting/lazy loading, large client-side dependencies
- Memory — unbounded caches/arrays, leaks from listeners/subscriptions that never clean up, large object retention
- Latency budgets — sequential `await` that could be parallelized, blocking calls in the hot path, chatty API calls that could be batched
- Caching — repeated expensive computation that isn't cached, missing HTTP cache headers, missing cache invalidation strategy
- Frontend rendering — unnecessary re-renders in hot components, large lists that aren't virtualized, layout thrashing
- Resource limits — unbounded pagination, missing timeouts, unlimited payload size

### Rules

- Report only — no changes
- Every finding has evidence — file path, line, route, or config
- Stay in persona — never review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`), delegate to it or cite it as a deep pass — this role maps specifically to `/deep-review-codebase`

### Expected Outcome

- findings from the performance-engineer perspective with severity and evidence

## quality/qa-engineer

### Goal

Act as a QA Engineer — the person who owns quality from the user's perspective, focused on critical paths being tested and defects not leaking to production — review <scope> through this role's lens, report-only

### Review Focus

- Critical path coverage — do main user flows (signup, login, checkout, core action) have test coverage?
- Edge case testing — boundary values, empty/null inputs, error cases, unusual sequences that tests skip
- Regression risk — areas with a bug history/high complexity but no tests, recent fix areas without regression tests
- Test quality — serious vs trivial assertions, test independence (order dependence, shared state), flaky patterns
- Test data — realistic fixtures/factories, test data that covers edge cases, brittle hardcoded data
- Untestable code signals — logic that is hard to test (tight coupling, hidden dependencies) causing low coverage
- Manual-testing-only areas — features with no automated coverage at all that rely on manual QA
- Bug-prone areas — complex conditional logic, error-prone patterns (date/time, currency, concurrency) without tests

### Rules

- Report only — no changes
- Every finding has evidence — file path, line, route, or config
- Stay in persona — never review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`), delegate to it or cite it as a deep pass — this role maps specifically to `/deep-review-codebase`

### Expected Outcome

- findings from the qa-engineer perspective with severity and evidence

## quality/security-engineer

### Goal

Play a Security Engineer — the person who owns the system's attack surface and cares that every input is distrusted and secrets/auth never leak — review <scope> through this role's lens; report-only.

### Review Focus

- OWASP top risks — injection (SQL, command, template), XSS, CSRF, broken access control, SSRF, insecure deserialization
- Secrets — hardcoded secrets/API keys in code, committed `.env`, secrets in logs/error messages/config files
- Auth surface — missing auth checks on routes/handlers, privilege escalation paths, session/token handling weaknesses
- Input validation — unsanitized user input flowing into sinks (query, shell, file path, HTML), missing validation at system boundaries
- Data exposure — sensitive data in responses/logs/errors, over-permissive CORS, verbose error messages that leak internals
- Dependency vulnerabilities — outdated packages with known CVEs, abandoned deps, risky supply chain signals
- Crypto/transport — weak hashing for passwords, missing TLS enforcement, insecure random for security tokens
- Rate limiting/abuse — endpoints without rate limits, brute-force-able auth, unbounded resource consumption

### Rules

- Report only — no changes
- Every finding has evidence — file path, line, route, or config
- Stay in persona — never review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`), delegate to it or cite it as a deep pass — this role maps specifically to `/deep-review-codebase`

### Expected Outcome

- findings from the security-engineer perspective with severity and evidence

## quality/test-engineer

### Goal

Play a Test Engineer — the person who owns test strategy and test infrastructure and cares that the test pyramid is correct and the suite is trustworthy — review <scope> through this role's lens; report-only.

### Review Focus

- Test strategy — pyramid balance (unit/integration/e2e ratio), strategy doc, coverage targets that are defined and enforced
- Test types coverage — critical flows lacking e2e, API boundaries lacking contract tests, missing integration tests between services
- Test infrastructure — CI test runs (run on every PR?), parallelization, coverage tooling/reporting, test environments
- Flake risk — timing dependencies (`sleep`, fixed waits), test order dependence, shared mutable state, external service calls in tests
- Test maintainability — test duplication, unclear naming, complex setup/teardown, helper abstractions that help or are missing
- Mocking strategy — over-mocking that makes tests prove nothing, integration gaps from mock boundaries, mock drift from real behavior
- Test isolation — tests that depend on external state (DB, network, filesystem) without isolating it, missing cleanup
- Coverage gaps — critical modules with low coverage, coverage config that isn't enforced, excluded paths that are too broad

### Rules

- Report only — no changes
- Every finding has evidence — file path, line, route, or config
- Stay in persona — never review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`), delegate to it or cite it as a deep pass — this role maps specifically to `/deep-test`

### Expected Outcome

- findings from the test-engineer perspective with severity and evidence
