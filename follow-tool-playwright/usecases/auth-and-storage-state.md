# Use Case — Logged-In Tests with Storage State

> Authenticate once, reuse the session in every test, and keep credentials out of the specs. Source: https://playwright.dev/docs/auth (accessed 2026-10-20)

## 1. A setup project that saves the session

```ts
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], storageState: "playwright/.auth/user.json" },
      dependencies: ["setup"],
    },
  ],
})
```

```ts
// tests/auth.setup.ts
import { test as setup, expect } from "@playwright/test"

setup("authenticate", async ({ page }) => {
  await page.goto("/login")
  await page.getByLabel("Email").fill(process.env.E2E_EMAIL!)
  await page.getByLabel("Password").fill(process.env.E2E_PASSWORD!)
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible()
  await page.context().storageState({ path: "playwright/.auth/user.json" })
})
```

`storageState` captures cookies + localStorage. Header-token auth needs an API request inside the setup instead.

## 2. One state file per role

Define `admin.setup.ts` and `user.setup.ts`, one project each — never share a single state across roles.

## 3. Keep the state out of git

Add `playwright/.auth/` to `.gitignore`; the file contains live session tokens.

## Pitfalls

- Logging in through the UI in every test → slow suite and flaky login.
- Missing `dependencies: ["setup"]` → the browser project starts before the state file exists.
- Credentials hardcoded in the spec → pass them through env vars backed by CI secrets.
- Saving the state before the session cookie is set → assert a logged-in element first.

## Related

- `references/apis.md`
- `usecases/ci-sharding-and-trace.md`
