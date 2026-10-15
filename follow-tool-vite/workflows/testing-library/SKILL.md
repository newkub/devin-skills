---
name: follow-tool-vite-testing-library
description: Testing Library in Vite projects — Vitest setup, queries by role, user-event, jest-dom matchers
argument-hint: "[framework]"
related:
  - follow-tool-vite
  - follow-tool-vitest
  - follow-tool-playwright
  - run-test
  - run-verify
  - resolve-errors
---

## Goal

Use Testing Library in a Vite project — setup with Vitest, queries by role/text, `user-event`, jest-dom matchers

## Scope

Use when the task involves component/unit testing in a Vite project — React (`@testing-library/react`), Vue (`@testing-library/vue`), Solid (`@solidjs/testing-library`), or DOM-only (`@testing-library/dom`)

- Test runner config (Vitest options, coverage, CI) → `/follow-tool-vitest`
- Browser e2e tests → `/follow-tool-playwright` — Testing Library is not an e2e tool
- Latest: `@testing-library/dom@10.4.2` / `react@16.3.3` / `jest-dom@7.0.1` / `user-event@14.6.7` / `vue@8.1.0` (verified 2026-09-16)
- API reference: [apis](references/apis.md)

## Execute

### 1. Setup

> Goal: install + config ready to use with Vitest

1. Check `package.json` for `vitest` — if absent → do `/follow-tool-vitest` first; if a setup already exists → verify only (idempotent)
2. Install core + framework wrapper + DOM env:
   `bun add -D vitest @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event jsdom`
   - `@testing-library/react@16` requires installing `@testing-library/dom` as a peer dependency and works with React 18+
   - DOM environment: `jsdom` or `happy-dom` — pick what the project already uses, never add both
3. Set `test.environment: 'jsdom'` in `vite.config.ts`/`vitest.config.ts` + `test.setupFiles: ['./test/setup.ts']`
4. Create `test/setup.ts`:

   ```ts
   import '@testing-library/jest-dom/vitest'
   ```

5. Enable `globals: true` (automatic cleanup) or `afterEach(cleanup)` in the setup file

### 2. Usage

> Goal: use it correctly per the official docs

1. Query by priority: `getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByText` > `getByTestId` (last resort)
2. Pick the right query variant: `getBy*` throws when not found, `queryBy*` returns null (assert absence), `findBy*` is async
3. Always use the `screen` object — never destructure from the `render()` result
4. Use `within(el)` for scoped queries (dialog, row)
5. Use `userEvent` instead of `fireEvent` — `const user = userEvent.setup()` per test, `await user.click(...)`/`await user.type(...)` since every method is async
6. Use `findBy*`, `waitFor`, or `waitForElementToBeRemoved` for async updates
7. Assert with `@testing-library/jest-dom` matchers (`toBeInTheDocument`, `toHaveAttribute`)

### 3. Common Mistakes

> Goal: avoid the common pitfalls

1. Test behavior, not implementation — never query by internal class/id or `container.firstChild`
2. Don't assert absence with `getBy*` — use `queryBy*` then expect `toBeNull()` / `not.toBeInTheDocument()`
3. Don't forget `await` with `userEvent` and `findBy*` — the assertion would run before the update finishes
4. Don't assert immediately after an action that triggers an async update — use `findBy*`/`waitFor` instead

### 4. Verify

> Goal: the smoke test passes

1. Write an example test: `render(<Comp />)` → `screen.getByRole(...)` → `await user.click(...)` → `toBeInTheDocument()`
2. Do `/run-test` + `/run-verify`
3. If it breaks → do `/resolve-errors` max 3 rounds, then stop and report

## Rules

- Test behavior, not implementation — no querying by internal class/id
- `userEvent` methods are async — always `await`, with `userEvent.setup()` per test
- Import jest-dom matchers through the setup file only
- Check the official docs (`https://testing-library.com`) before using an uncertain API

- Use `/follow-tool-vitest` if needed
- Use `/run-test`, `/run-verify`, `/follow-tool-playwright` if needed

## Expected Outcome

- Testing Library + Vitest + the DOM environment ready to use
- jest-dom matchers and `user-event` usable in tests
- Smoke test, lint, typecheck pass
