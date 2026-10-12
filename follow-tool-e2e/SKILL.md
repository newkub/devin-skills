---
name: follow-tool-e2e
description: ใช้ e2e (tester.army) ครบวงจร — agentic E2E testing สำหรับ web/mobile — agent.act goals, agent.assert, screen locators, replay cache, multi-target
argument-hint: "[test-file-or-goal]"
allowed-tools:
  - exec
  - read
  - write
  - edit
  - grep
  - find_file_by_name
related:
  - test-e2e
  - test-mobile
  - run-test
  - follow-my-techstack
  - check-secrets
  - deep-review
---

## Goal

เขียนและรัน e2e tests ด้วย framework `e2e` (e2e.tester.army) — เลือกระดับ agentic ต่อ step: deterministic locators (`screen` + `expect`), agent goals (`agent.act` จาก natural language), หรือผสมใน test เดียว — รันเดียวกันได้ทั้ง web (Playwright engine) และ mobile (iOS/Android ผ่าน agent-device)

## Scope

ใช้เมื่อ project ติดตั้ง `e2e` package หรือต้องการ agentic testing — ตัวเลือก E2E strategy ทั่วไป → `/test-e2e`; mobile-specific → `/test-mobile`; catalog default → `/follow-my-techstack`

- Deterministic test suites ที่ไม่ต้องการ model → `screen`/`expect` steps เท่านั้น (ไม่เสีย token)
- API checks ผสมใน test file เดียวกันได้ด้วย `fetch` + value matchers

## Execute

### 1. Setup

> Goal: ติดตั้งและตั้งค่า runner

1. `bun add -d e2e` ผ่าน `/run-install` (packages แยกตาม platform — ดู `references/apis.md`)
2. ตั้งค่า model สำหรับ agent steps: subscription (ChatGPT/Copilot/SuperGrok), API key ผ่าน AI SDK providers, หรือ local model — ดู `references/cli.md`
3. กำหนด targets: `web` (Chromium ผ่าน Playwright), iOS simulator, Android emulator
4. Import `test` จาก `@e2e-dev/web` หรือ `@e2e-dev/mobile` เพื่อได้ `browser`/`device` fixture typed

### 2. Write Test

> Goal: ผสม 3 step types ให้ถูกจุด

```ts
import { test, expect, unique } from 'e2e';

test('member upgrades to Pro', async ({ app, agent, screen }) => {
  await app.open('/settings/billing');
  await agent.act('upgrade the workspace to Pro');
  await agent.assert('the invoice preview shows a prorated amount');
  await expect(screen.getByRole('status')).toContainText('Pro');
});
```

- **Goal** — `agent.act('one goal per call', { params })` — agent เลือก actions เอง; ใช้ `unique()` กับค่าที่เปลี่ยนทุก run เพื่อให้ replay cache ใช้ได้; password ใช้ `Secret` (model ไม่เห็นค่าจริง)
- **Assertion** — `agent.assert` (screen ตอนนี้), `agent.waitFor` (รอจน condition จริง, model ถูกเรียกเฉพาะตอน screen เปลี่ยน), `agent.extract` → Standard Schema (เช่น Zod); `{ vision: true }` เมื่อต้อง judge pixels (chart/layout)
- **Locator** — `screen.getByRole/getByLabel/getByTestId` (ลำดับ priority ตามนั้น), `.filter()/.first()/.nth()` เมื่อ match หลาย node, actions `tap/fill/swipe`, `expect(locator)` retry จน pass/timeout — ไม่เสีย model call

### 3. Structure And Run

> Goal: จัด suite และรันถูก scope

1. `describe` + `{ tags }`, `beforeEach`, `{ retries, timeout }` ต่อ test, `{ serial: true }` สำหรับ flow ข้าม tests, `test.skip(condition, reason)`, `test.extend` สำหรับ fixtures
2. `bunx e2e run tests/x.e2e.ts:12` / `--grep checkout` / `--target web` — ดู `references/cli.md`
3. Explore โดยไม่มี test file → `e2e explore` ให้ agent ทำ goal แล้ว report สิ่งที่เจอ
4. `e2e mcp` — expose live app session ให้ coding agent inspect/interact ผ่าน MCP

### 4. Cache And Debug

> Goal: ลดต้นทุนและ debug failures

1. `agent.act` ที่มี later check ผ่าน → recorded; run ถัดไป replay จาก cache โดยไม่เรียก model — agent เข้าแทรกเฉพาะตอน app เปลี่ยน
2. `assert`/`waitFor`/`extract` เรียก model เสมอ (ไม่ถูก cache)
3. อ่าน trace page + evidence + model input ใน report — secrets ที่ register ถูก redact
4. Flaky `act` → ทำ instruction specific ขึ้น, ย้ายคำที่ใช้ซ้ำไป agent `context`, หรือเปลี่ยนเป็น locator step

### 5. CI

> Goal: รันบน CI และ report

- GitHub Actions, EAS Workflows, Bitrise, Codemagic — `@e2e-dev/github` reporter post comment ต่อ run บน PR
- Hosted targets: `@e2e-dev/kernel` (Kernel Chromium), `@e2e-dev/eas` (EAS simulators/emulators)
- หลัง suite เขียว → ทำ `/run-test` และ `/check-secrets` ว่าไม่มี secret ใน test files

## Rules

### 1. Await Everything

- await ทุก agent call, screen call, `expect.poll` — test ที่ return ระหว่าง step ยังรัน fail ด้วย `STEP_NOT_AWAITED`
- direct reads (`textContent()`) ไม่ retry — ใช้ `expect` matcher แทนเมื่อต้องรอ

### 2. Secrets

- ส่ง secrets ผ่าน `Secret`/`params` เท่านั้น — ห้าม interpolate ลง goal string ตรงๆ
- sign-in ครั้งเดียวแล้ว reuse session ข้าม tests

### 3. Determinism First

- ใช้ `agent.*` เฉพาะจุดที่ selector เขียนไม่ได้/เปลี่ยนบ่อย — จุดที่รู้ exact action ใช้ `screen` locator (ฟรี, deterministic)
- `expect` locator check หลัง `agent.act` เสมอ — cache record เฉพาะ goal ที่มี later check ผ่าน

- ใช้ /test-e2e ถ้าต้องเลือก framework/กลยุทธ์
- ใช้ /test-mobile สำหรับ device specifics
- ใช้ /deep-review domain `review-test` สำหรับ review suite

## Expected Outcome

- Tests ผสม deterministic + agentic ถูกจุด รันได้บน web + mobile targets
- Replay cache ลด model calls; report/debug อ่านได้; secrets ไม่รั่วเข้า model input
