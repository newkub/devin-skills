# Test Layers Reference

เลือก layers ตาม scope — ทุก handler/function มี required categories ก่อน แล้วเติม conditional categories ตาม logic

## Required Categories (ทุก test)

1. Happy path — input ถูกต้อง → expected output
2. Error path — dependency throw → error response ถูกต้อง
3. Edge cases — empty/null/undefined, boundary values (min, max, min-1, max+1)
4. Unauthorized — auth missing/invalid → reject
5. Input validation — invalid input → validation error

## Conditional Categories

- Permission/RBAC — user ไม่มี permission → deny
- IDOR/Ownership — เข้าถึง resource ของ user อื่น → deny
- Sanitization — malicious input → sanitized
- userId injection — userId ต้องมาจาก auth ไม่ใช่ input
- Empty results, optional fields, concurrency, regression, contract, property-based, a11y, performance

ใช้ `it.each`/table-driven สำหรับ boundary values หลายค่า, validation matrix, permission matrix (role × action)

## Unit (70%)

- Scope: pure functions, handlers, utils — isolated
- Framework: `vitest`/`jest`/`bun test` (JS/TS), `pytest`, `go test`, `cargo test`, `xUnit`, `rspec`, `PHPUnit` ตามภาษา
- Mock external deps เท่านั้น; `< 10ms` ต่อ test
- Location: colocated `__tests__/` หรือ `tests/unit/` ตาม project pattern
- Vitest setup/conventions → `/follow-tool-vitest`

## Integration (20%)

- Scope: API endpoints, DB queries, service interactions — real/test DB, testcontainers
- Real implementations ที่ boundary; mock เฉพาะ third-party ที่ควบคุมไม่ได้
- seed/cleanup ต่อ test — ไม่ leak data; `< 100ms` ต่อ test
- Location: `tests/integration/`
- Runner: `/deep-test integration`; API-specific → `/deep-test api`

## E2E (10%)

- Scope: user flows, critical paths, all routes — Playwright เท่านั้น (ไม่ใช้ Cypress)
- Selectors: `data-testid` หรือ role-based (`getByRole`, `getByLabel`) — ห้าม fragile CSS selectors
- Reuse auth via `storageState`; fixtures/page objects ตาม suite conventions
- Auto-waiting locators + `expect` polling — ห้าม `waitForTimeout` มั่ว
- traces/videos/screenshots ไป test-results dir — ไม่ commit artifacts
- Conventions → `/follow-tool-playwright`; runner → `/deep-test e2e`

## Contract

- API schema compatibility ระหว่าง services — `pact` หรือ schema validation
- Breaking changes → versioning/deprecation ไม่ลบทิ้งทันที

## Property-Based

- Invariants ที่ต้องจริงทุก input — `fast-check` (JS/TS), `hypothesis` (Python), `proptest` (Rust)

## Mutation

- ตรวจ test quality — `stryker` หรือ `cargo-mutants` — รันใน CI

## Performance / Security / Accessibility / Visual

- Performance: critical paths ≤ threshold — รันใน CI
- Security: auth bypass, IDOR, injection, rate limiting — รันใน CI
- Accessibility: WCAG/ARIA/keyboard nav บน UI components
- Visual: screenshot regression ผ่าน Playwright/component snapshots — `/deep-test visual`
