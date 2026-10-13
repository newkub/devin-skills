---
name: use-midscenejs
description: ใช้ Midscene.js — AI vision GUI agent/E2E testing ภาษาธรรมชาติ บน Playwright/Puppeteer/YAML/CLI พร้อม VLM config
argument-hint: "[scope]"
related:
  - test-e2e
  - follow-tool-playwright
  - follow-tool-vitest
  - use-agent-browser
  - use-chrome-devtools
  - use-lightpanda
  - update-tests
  - deep-test

---

## Goal

ใช้งาน Midscene.js — open-source GUI Agent + E2E testing-kit แบบ "AI-powered vision" (natural-language interaction ผ่าน VLM บน screenshot) — ให้ถูกต้องตั้งแต่ model config, integration (Playwright/Puppeteer/Vitest), API หลัก, caching, reports, YAML/CLI, และ platform อื่น

## Scope

ใช้เมื่อต้องเขียน/รัน test หรือ automation แบบภาษาธรรมชาติ ("click the login button", "aiQuery the price list") บน web (Playwright/Puppeteer), desktop (computer), Android/iOS/HarmonyOS — เหมาะกับ flow ที่ selector เปราะบางหรือ UI เปลี่ยนบ่อย

- Boundary (ตาม `/use-chrome-devtools` `## Tool Selection` — canonical): ต้องการ deterministic selector test → `/follow-tool-playwright` ปกติ; pixel-free DOM scrape → `/use-lightpanda` (**Midscene ต้องใช้ screenshot จริง จึงทำงานกับ Lightpanda ไม่ได้**); Midscene เหมาะกับ NL-driven flow/assert + visual locate
- Maintainer: `web-infra-dev` (ByteDance web-infra — ตัวเดียวกับ Rspack), MIT, v1.15.3 (verified 2026-10-13)

## Execute

### 1. Model Config (บังคับก่อนอื่น)

> Goal: ต่อ VLM ให้ได้ — Midscene ต้องการ vision model เสมอ

1. env vars (canonical form):
   ```sh
   export MIDSCENE_MODEL_BASE_URL="https://.../v1"   # OpenAI-compatible endpoint
   export MIDSCENE_MODEL_API_KEY="sk-..."
   export MIDSCENE_MODEL_NAME="qwen3.7-plus"          # doubao-seed-2.1-turbo / gemini-3.5-flash / GPT-5.4+ / GLM-4.6V / UI-TARS
   export MIDSCENE_MODEL_FAMILY="qwen3"               # family flags ทดแทน MIDSCENE_USE_QWEN_VL เดิม
   ```
2. `OPENAI_API_KEY` ยังรองรับ (deprecated); optional: `MIDSCENE_MODEL_PROTOCOL=openai-responses`, `MIDSCENE_MODEL_RETRY_COUNT/_TIMEOUT`, แยก role ได้ (`MIDSCENE_PLANNING_MODEL_*`, `MIDSCENE_INSIGHT_MODEL_*`)
3. verify: `npx midscene model verify`

### 2. Web Setup (Playwright เป็นเส้นหลัก)

> Goal: project พร้อมเขียน NL test

1. `npm i -D @midscene/web playwright @playwright/test tsx` (แนะนำ Chromium — ใช้ CDP features; remote browser ได้ผ่าน `chromium.connectOverCDP`)
2. direct use: `const agent = new PlaywrightAgent(page)` from `@midscene/web/playwright`
3. test fixture (destructurable `ai, aiQuery, aiTap, aiInput, aiScroll, aiWaitFor, recordToReport`):
   ```ts
   import { test as base, expect } from '@playwright/test'
   import { PlaywrightAiFixture, type PlayWrightAiFixtureType } from '@midscene/web/playwright'
   export const test = base.extend<PlayWrightAiFixtureType>(
     PlaywrightAiFixture({ waitForNetworkIdleTimeout: 2000, replanningCycleLimit: 30 }),
   )
   ```
4. reporter ใน config: `reporter: [['@midscene/web/playwright-reporter', { type: 'merged' }]]`; หลาย tab → `agentForPage(page)`, new-tab interception ด้วย `forceSameTabNavigation`

### 3. Core Agent API

> Goal: ใช้ถูก method ถูกตัว

| Group | Methods | หมายเหตุ |
|-------|---------|----------|
| act | `aiAct(prompt)` (=`ai()`, เดิม `aiAction()`) | plan+execute; option `deepThink` trade latency↔stability |
| discrete interact | `aiTap`, `aiInput`, `aiClearInput`, `aiHover`, `aiScroll`, `aiKeyboardPress`, `aiDoubleClick`, `aiRightClick`, `aiLongPress`, `aiPinch` | รับ `(locate, opts?)` |
| query | `aiQuery<T>(shape)`, `aiAsk`, `aiString`, `aiNumber`, `aiBoolean` | ไม่มี `aiArray` — ใช้ `aiQuery` กับ `T[]` shape |
| assert/wait | `aiAssert(assertion, errorMsg?)`, `aiWaitFor(cond, {timeoutMs=15000, checkIntervalMs=3000})` | result ของ query/assert ไม่ถูก cache |
| locate/misc | `aiLocate` → `{rect, center, dpr}`, `evaluateJavaScript`, `setAIContext`, `startObserving()` (frame recording UI ชั่วคราว), `runYaml`, `runGherkinScenario`, `flushCache()`, `destroy()`, `.reportFile` | common options: `cacheable`, `deepLocate`, `xpath`, `context`, `domIncluded` |

Canonical example:

```ts
import { PlaywrightAgent } from '@midscene/web/playwright'
const agent = new PlaywrightAgent(page)
await agent.aiAct('Search for headphones, then filter the results to under $100')
await agent.aiWaitFor('The filtered search results are displayed')
await agent.aiAssert('Every product in the search results has a price below $100')
```

### 4. Other Integrations

> Goal: เลือกเส้นอื่นถูก — ไม่ใช้ทางที่ตายแล้ว

1. Puppeteer: `new PuppeteerAgent(page)` / `PuppeteerPageAgent` from `@midscene/web/puppeteer`; multi-tab → `PuppeteerBrowserAgent`
2. Vitest: **ไม่มี `@midscene/web/vitest` plugin แล้ว** — pattern ทางการ = Playwright+Vitest demo (`vitest.config.ts` set `testTimeout: 1800_000`, ใช้ `PlaywrightAgent` ใน test, custom reporter)
3. YAML + CLI: เขียน `tasks/flow` YAML (`ai:`, `aiAssert:`, `sleep:`) แล้ว `midscene ./flow.yaml` (`@midscene/cli`, Node 20.19+/22.12+/24+, auto-load `.env`) — legacy YAML เป็น maintenance-mode; ทางใหม่คือ **Midscene Test** (`@midscene/test`, Beta): `midscene-test create`, `cases/*.yaml` + `midscene.config.ts` TS nodes, `midscene-test nodes` export Node Spec
4. Bridge mode: ควบคุม Chrome ที่เปิดอยู่ผ่าน extension — `AgentOverChromeBridge` from `@midscene/web/bridge-mode`, CLI `--bridge`
5. Native platforms: `@midscene/android` (`AndroidAgent`+adb), `@midscene/ios` (`IOSAgent`/WebDriverAgent), `@midscene/harmony` (HDC), `@midscene/computer` (`agentForComputer()`, RDP: `agentForRDPComputer()`) + Playgrounds (`npx --yes @midscene/computer-playground`)
6. Agent Skills สำหรับ coding agent: `npx skills add web-infra-dev/midscene-skills` (drive `npx @midscene/{web,android,ios,computer}`)
7. **MCP servers ถูก retire ตั้งแต่ >1.9.8** — ห้าม register Midscene เป็น MCP

### 5. Caching And Reports

> Goal: เร็ว+ถูกใน CI

1. cache = AI planning steps (prompt เป็น key) + web XPath locates; enable `cache: { id }` หรือ `cache: true` (auto id); strategies: `read-write` (default), `read-only` (+`agent.flushCache()` manual), `write-only`; legacy `MIDSCENE_CACHE=1`+`cacheId`
2. cache files อยู่ `./midscene_run/cache/*.cache.yaml` — **commit เข้า CI หรือ cache ต่อเนื่อง** ไม่งั้นทุก run จ่ายค่า plan ใหม่; XPath cache ใช้ไม่ได้กับ canvas/cross-origin iframe/closed Shadow DOM; prune ด้วย `flushCache({ cleanUnused: true })`
3. reports: interactive HTML ที่ `./midscene_run/report/*.html`; แปลง markdown ด้วย `reportFileToMarkdown` หรือ `npx @midscene/web report-tool --action to-markdown`

### 6. Run And Validate

> Goal: ยืนยัน usage ทำงานจริง

1. smoke script: `npx tsx demo.ts` (demo ใช้ snippet §3) → เห็น action เกิดจริง + report HTML ใหม่ใน `./midscene_run/report/`
2. suite: `bunx playwright test` (หรือ `midscene ./flow.yaml`) → green + merged reporter output
3. fail เพราะ model → `npx midscene model verify` ก่อน debug test; fail เพราะ UI → `/update-tests`; flow พังจริง → `/resolve-errors` (pipeline เดียวกับ `/test-e2e`)

## Rules

### 1. Determinism First Where Possible

- deterministic check ใช้ `aiQuery` + JS `expect` ทแน pure `aiAssert` (ถูกกว่าและนิ่งกว่า)
- `aiWaitFor` ทุกครั้งจ่าย token — await app readiness ด้วย API/selector ก่อนถ้าทำได้

### 2. Cost Discipline

- ตั้ง `replanningCycleLimit`, เลี่ยง `deepThink`พร่ำเพรื่อ, เปิด cache ใน dev และ commit cache ใน CI
- one page-agent per page; `fileChooserAllowedDir` บังคับสำหรับ upload จาก prompt (security)

### 3. Vision Needs Pixels

- ห้ามคู่ Midscene+Lightpanda (ไม่มี rendering — ดู `use-lightpanda` Rule 1); screenshot ค้าง font → `PW_TEST_SCREENSHOT_NO_FONTS_READY=1`; native `<select>` ต้อง `forceChromeSelectRendering` (default on)

### 4. Current API Surface Only

- ห้ามตาม tutorial เก่าที่ลง MCP server / Vitest plugin / `flushWait` / `aiAction` เป็นชื่อหลัก — ใช้ชื่อตาม §3-§4 (verified v1.15.3)

## Expected Outcome

- VLM config ผ่าน `npx midscene model verify`
- write/run NL test ได้ทั้ง fixture และ direct agent; report HTML เกิดทุก run
- cache setup ถูก (ไฟล์ใน `./midscene_run/cache`, strategy ตรง use case)
- เลือก integration ถูกตัว (Playwright/Puppeteer/Vitest-pattern/YAML/Midscene Test/Bridge/native) และไม่ใช้ทางที่ retire แล้ว
- ระบุ boundary กับ browser tools อื่นได้ตาม `/use-chrome-devtools` matrix
