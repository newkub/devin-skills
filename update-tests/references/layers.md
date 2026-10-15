# Layers

## Test Layers Reference

Pick layers by scope — every handler/function has required categories first, then add conditional categories per the logic

### Required Categories (every test)

1. Happy path — correct input → expected output
2. Error path — dependency throws → correct error response
3. Edge cases — empty/null/undefined, boundary values (min, max, min-1, max+1)
4. Unauthorized — auth missing/invalid → reject
5. Input validation — invalid input → validation error

### Conditional Categories

- Permission/RBAC — user without permission → deny
- IDOR/Ownership — accessing another user's resource → deny
- Sanitization — malicious input → sanitized
- userId injection — userId must come from auth, not input
- Empty results, optional fields, concurrency, regression, contract, property-based, a11y, performance
- Type-level — TS libraries/SDKs with a public type contract: add a tstyche layer per `/follow-lib-tstyche`

Use `it.each`/table-driven for multiple boundary values, a validation matrix, a permission matrix (role × action)

### Unit (70%)

- Scope: pure functions, handlers, utils — isolated
- Framework: `vitest`/`jest`/`bun test` (JS/TS), `pytest`, `go test`, `cargo test`, `xUnit`, `rspec`, `PHPUnit` by language
- Mock only external deps; `< 10ms` per test
- Location: colocated `__tests__/` or `tests/unit/` per project pattern
- Vitest setup/conventions → `/follow-tool-vitest`

### Integration (20%)

- Scope: API endpoints, DB queries, service interactions — real/test DB, testcontainers
- Real implementations at the boundary; mock only uncontrollable third parties
- seed/cleanup per test — no data leaks; `< 100ms` per test
- Location: `tests/integration/`
- Runner: `/deep-test integration`; API-specific → `/deep-test api`

### E2E (10%)

- Scope: user flows, critical paths, all routes — Playwright only (don't use Cypress)
- Selectors: `data-testid` or role-based (`getByRole`, `getByLabel`) — never fragile CSS selectors
- Reuse auth via `storageState`; fixtures/page objects per suite conventions
- Auto-waiting locators + `expect` polling — never blind `waitForTimeout`
- Send traces/videos/screenshots to the test-results dir — never commit artifacts
- Conventions → `/follow-tool-playwright`; runner → `/deep-test e2e`

### Contract

- API schema compatibility between services — `pact` or schema validation
- Breaking changes → versioning/deprecation, don't remove immediately

### Type Testing

- TypeScript public-API type contract — `tstyche` files (`*.tst.ts`), asserted via relation/ability matchers; `--target` verifies the declared TypeScript version range — `/follow-lib-tstyche`
- Compile-time layer: never executes code — complements, doesn't replace, unit tests

### Property-Based

- Invariants that must hold for every input — `fast-check` (JS/TS), `hypothesis` (Python), `proptest` (Rust)

### Mutation

- Check test quality — `stryker` or `cargo-mutants` — run in CI

### Performance / Security / Accessibility / Visual

- Performance: critical paths ≤ threshold — run in CI
- Security: auth bypass, IDOR, injection, rate limiting — run in CI
- Accessibility: WCAG/ARIA/keyboard nav on UI components
- Visual: screenshot regression via Playwright/component snapshots — `/deep-test visual`
