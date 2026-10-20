# Use Case — CI Sharding, Retries and Trace Debugging

> Split a long suite across CI jobs, retry only what flaked, and download a trace that explains the failure. Source: https://playwright.dev/docs/test-sharding (accessed 2026-10-20)

## 1. CI config

```ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["github"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
```

## 2. Shard the matrix

```bash
bunx playwright test --shard=${{ matrix.shard }}/4
```

Sharding splits by test file; do not rely on cross-file ordering.

## 3. Debug a failure

```bash
bunx playwright show-trace test-results/<test>/trace.zip
```

The trace contains per-action DOM snapshots, the network log and console output — enough to separate a product bug from a locator problem. Reproduce locally with `--repeat-each=10 --grep "<title>"`.

## Pitfalls

- `trace: "off"` in CI → no evidence when only CI fails.
- Retries hiding a real bug → a test that passes on retry still needs a fix; track the flaky report.
- `reuseExistingServer: true` in CI → the job talks to a stale dev server.
- CSS locators from generated markup (`#root > div:nth-child(3)`) → break on any UI change; use role/label locators.

## Related

- `references/apis.md`
- `usecases/auth-and-storage-state.md`
