| key | value |
|---|---|
| install | `bun add -d e2e` (+ `@e2e-dev/web` / `@e2e-dev/mobile` for typed fixtures) |
| repo | https://github.com/tester-army (open source — see the link in docs) |
| docs | https://e2e.tester.army/docs (+ `/docs/llms.txt` index) |

| Package | Use when |
|---|---|
| `e2e` | core — `test`, `expect`, `describe`, `beforeEach`, `unique`, `Secret` |
| `@e2e-dev/web` | typed `browser` fixture + web engine (Playwright) |
| `@e2e-dev/mobile` | typed `device` fixture + mobile engine (agent-device) |
| `@e2e-dev/github` | PR comment reporter on GitHub Actions |
| `@e2e-dev/kernel` | hosted Chromium targets (Kernel) |
| `@e2e-dev/eas` | hosted iOS/Android targets (EAS Simulators) |

| Fixture/Export | API | Model call |
|---|---|---|
| `app` | `app.open(path)` — portable lifecycle on every platform | no |
| `agent` | `agent.act(goal, {params})`, `agent.assert(stmt, {vision})`, `agent.waitFor(cond, {timeout})`, `agent.extract(desc, {schema})` | yes |
| `screen` | `getByRole/getByLabel/getByTestId`, `.filter({hasText})/.first()/.nth()`, `tap/fill/swipe`, `textContent()` | no |
| `expect` | locator matchers (retry) — `toContainText`, `toHaveText`, `toHaveCount`; `expect.poll` | no |

| Concept | Details |
|---|---|
| Targets | a test runs one target at a time — `web` (Chromium), iOS sim, Android emulator; custom engine via the `e2e/engine` contract |
| Cache | an `act` whose later check passes → replay with no model call; agent takeover when the app changes |
| Models | AI SDK providers (gateway/openai/anthropic/google/bedrock/...), subscriptions (ChatGPT, Copilot, SuperGrok), local/decision models |
| Structure | `describe`+tags, hooks, `{retries, timeout, serial}`, `test.skip`, `test.extend` fixtures |
| Migration | guides: Playwright, Cypress, Selenium, Detox, Maestro — migrate file by file; both runners can coexist |
