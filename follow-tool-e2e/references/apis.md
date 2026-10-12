| key | value |
|---|---|
| install | `bun add -d e2e` (+ `@e2e-dev/web` / `@e2e-dev/mobile` สำหรับ typed fixtures) |
| repo | https://github.com/tester-army (open source — ดู link ใน docs) |
| docs | https://e2e.tester.army/docs (+ `/docs/llms.txt` index) |

| Package | ใช้เมื่อ |
|---|---|
| `e2e` | core — `test`, `expect`, `describe`, `beforeEach`, `unique`, `Secret` |
| `@e2e-dev/web` | typed `browser` fixture + web engine (Playwright) |
| `@e2e-dev/mobile` | typed `device` fixture + mobile engine (agent-device) |
| `@e2e-dev/github` | PR comment reporter บน GitHub Actions |
| `@e2e-dev/kernel` | hosted Chromium targets (Kernel) |
| `@e2e-dev/eas` | hosted iOS/Android targets (EAS Simulators) |

| Fixture/Export | API | Model call |
|---|---|---|
| `app` | `app.open(path)` — portable lifecycle ทุก platform | no |
| `agent` | `agent.act(goal, {params})`, `agent.assert(stmt, {vision})`, `agent.waitFor(cond, {timeout})`, `agent.extract(desc, {schema})` | yes |
| `screen` | `getByRole/getByLabel/getByTestId`, `.filter({hasText})/.first()/.nth()`, `tap/fill/swipe`, `textContent()` | no |
| `expect` | locator matchers (retry) — `toContainText`, `toHaveText`, `toHaveCount`; `expect.poll` | no |

| Concept | รายละเอียด |
|---|---|
| Targets | test รันครั้งละ target — `web` (Chromium), iOS sim, Android emulator; custom engine ผ่าน `e2e/engine` contract |
| Cache | `act` ที่ later check ผ่าน → replay ไม่มี model call; agent takeover เมื่อ app เปลี่ยน |
| Models | AI SDK providers (gateway/openai/anthropic/google/bedrock/...), subscriptions (ChatGPT, Copilot, SuperGrok), local/decision models |
| Structure | `describe`+tags, hooks, `{retries, timeout, serial}`, `test.skip`, `test.extend` fixtures |
| Migration | guides: Playwright, Cypress, Selenium, Detox, Maestro — migrate ทีละไฟล์ รันคู่กันได้ |
