# Use Case — Coverage Gate and Split Test Projects

> Run the suite in CI with a threshold that fails the build, and split unit and DOM tests into separate projects. Source: https://vitest.dev/guide/coverage (accessed 2026-10-20)

## 1. Projects instead of one global environment

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    projects: [
      { test: { name: "unit", include: ["src/**/*.test.ts"], environment: "node" } },
      { test: { name: "dom", include: ["src/**/*.test.tsx"], environment: "jsdom", setupFiles: ["./test/setup.ts"] } },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**"],
      exclude: ["src/**/*.d.ts", "src/**/index.ts"],
      thresholds: { lines: 80, functions: 80, branches: 70 },
    },
  },
})
```

`test.projects` replaces the old `vitest.workspace.ts` file. Run one project with `vitest run --project unit`.

## 2. CI command

```bash
bunx vitest run --coverage --reporter=github-actions --reporter=default
```

Thresholds are enforced by the runner itself — a coverage comment is informational only.

## 3. Keep the gate honest

- Cover what changed: `vitest run --coverage --changed origin/main` in the PR job.
- Exclude generated code and barrels only; excluding business modules silently drops the ratio.
- Ratchet the number in steps instead of jumping to 80% on a 40% codebase.

## Pitfalls

- Running `vitest` without `run` in CI → watch mode hangs the job.
- Leaving `coverage.include` at its default → untested files stay invisible and the percentage lies.
- A threshold far above current coverage → permanently red CI that everyone ignores.
- A global `environment: "jsdom"` → slow suite and browser APIs leaking into pure unit tests.

## Related

- `references/apis.md`
- `usecases/mock-modules-and-fake-timers.md`
