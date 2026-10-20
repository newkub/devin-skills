---
name: use-midscenejs
description: Use Midscene.js — AI vision GUI agent + natural-language E2E testing (Playwright/Puppeteer/YAML/CLI)
argument-hint: "[scope]"
related:
  - follow-tool-playwright
  - use-chrome-devtools
  - use-lightpanda
  - update-tests
  - deep-test

---

## Goal

Use Midscene.js correctly — an open-source "AI-powered vision" GUI Agent + E2E testing-kit (natural-language interaction through a VLM over screenshots) — covering model config, integrations (Playwright/Puppeteer/Vitest), core APIs, caching, reports, YAML/CLI, and other platforms

## Scope

Use when writing/running natural-language tests or automation ("click the login button", "aiQuery the price list") on web (Playwright/Puppeteer), desktop (computer), Android/iOS/HarmonyOS — a good fit for flows with fragile selectors or frequently changing UI

- Boundary (per `/use-chrome-devtools` `## Tool Selection` — canonical): need deterministic selector tests → plain `/follow-tool-playwright`; pixel-free DOM scraping → `/use-lightpanda` (`Midscene needs real screenshots, so it cannot work with Lightpanda`); Midscene fits NL-driven flow/assert + visual locate
- Maintainer: `web-infra-dev` (ByteDance web-infra — the same team behind Rspack), MIT, v1.15.3 (verified 2026-10-13)

## Execute

### 1. Model Config (Required First)

> Goal: get a VLM connected — Midscene always requires a vision model

1. env vars (canonical form):
   ```sh
   export MIDSCENE_MODEL_BASE_URL="https://.../v1"   # OpenAI-compatible endpoint
   export MIDSCENE_MODEL_API_KEY="sk-..."
   export MIDSCENE_MODEL_NAME="qwen3.7-plus"          # doubao-seed-2.1-turbo / gemini-3.5-flash / GPT-5.4+ / GLM-4.6V / UI-TARS
   export MIDSCENE_MODEL_FAMILY="qwen3"               # family flags replace the old MIDSCENE_USE_QWEN_VL
   ```
2. `OPENAI_API_KEY` is still supported (deprecated); optional: `MIDSCENE_MODEL_PROTOCOL=openai-responses`, `MIDSCENE_MODEL_RETRY_COUNT/_TIMEOUT`, roles can be split (`MIDSCENE_PLANNING_MODEL_*`, `MIDSCENE_INSIGHT_MODEL_*`)
3. verify: `npx midscene model verify`

### 2. Web Setup (Playwright Is the Main Path)

> Goal: a project ready for NL tests

1. `npm i -D @midscene/web playwright @playwright/test tsx` (Chromium recommended — it uses CDP features; remote browsers work via `chromium.connectOverCDP`)
2. direct use: `const agent = new PlaywrightAgent(page)` from `@midscene/web/playwright`
3. test fixture (destructurable `ai, aiQuery, aiTap, aiInput, aiScroll, aiWaitFor, recordToReport`):
   ```ts
   import { test as base, expect } from '@playwright/test'
   import { PlaywrightAiFixture, type PlayWrightAiFixtureType } from '@midscene/web/playwright'
   export const test = base.extend<PlayWrightAiFixtureType>(
     PlaywrightAiFixture({ waitForNetworkIdleTimeout: 2000, replanningCycleLimit: 30 }),
   )
   ```
4. reporter in config: `reporter: [['@midscene/web/playwright-reporter', { type: 'merged' }]]`; multiple tabs → `agentForPage(page)`, new-tab interception via `forceSameTabNavigation`

### 3. Core Agent API

> Goal: use the right method for the job

| Group | Methods | Notes |
|-------|---------|----------|
| act | `aiAct(prompt)` (=`ai()`, formerly `aiAction()`) | plan+execute; `deepThink` option trades latency↔stability |
| discrete interact | `aiTap`, `aiInput`, `aiClearInput`, `aiHover`, `aiScroll`, `aiKeyboardPress`, `aiDoubleClick`, `aiRightClick`, `aiLongPress`, `aiPinch` | take `(locate, opts?)` |
| query | `aiQuery<T>(shape)`, `aiAsk`, `aiString`, `aiNumber`, `aiBoolean` | there is no `aiArray` — use `aiQuery` with a `T[]` shape |
| assert/wait | `aiAssert(assertion, errorMsg?)`, `aiWaitFor(cond, {timeoutMs=15000, checkIntervalMs=3000})` | query/assert results are not cached |
| locate/misc | `aiLocate` → `{rect, center, dpr}`, `evaluateJavaScript`, `setAIContext`, `startObserving()` (temporary frame-recording UI), `runYaml`, `runGherkinScenario`, `flushCache()`, `destroy()`, `.reportFile` | common options: `cacheable`, `deepLocate`, `xpath`, `context`, `domIncluded` |

Canonical example:

```ts
import { PlaywrightAgent } from '@midscene/web/playwright'
const agent = new PlaywrightAgent(page)
await agent.aiAct('Search for headphones, then filter the results to under $100')
await agent.aiWaitFor('The filtered search results are displayed')
await agent.aiAssert('Every product in the search results has a price below $100')
```

### 4. Other Integrations

> Goal: pick the right alternative path — don't use a dead route

1. Puppeteer: `new PuppeteerAgent(page)` / `PuppeteerPageAgent` from `@midscene/web/puppeteer`; multi-tab → `PuppeteerBrowserAgent`
2. Vitest: `there is no @midscene/web/vitest plugin anymore` — the official pattern is the Playwright+Vitest demo (`vitest.config.ts` set `testTimeout: 1800_000`, use `PlaywrightAgent` in the test, custom reporter)
3. YAML + CLI: write `tasks/flow` YAML (`ai:`, `aiAssert:`, `sleep:`) then `midscene ./flow.yaml` (`@midscene/cli`, Node 20.19+/22.12+/24+, auto-loads `.env`) — legacy YAML is in maintenance mode; the new path is `Midscene Test` (`@midscene/test`, Beta): `midscene-test create`, `cases/*.yaml` + `midscene.config.ts` TS nodes, `midscene-test nodes` exports a Node Spec
4. Bridge mode: control an already-open Chrome through an extension — `AgentOverChromeBridge` from `@midscene/web/bridge-mode`, CLI `--bridge`
5. Native platforms: `@midscene/android` (`AndroidAgent`+adb), `@midscene/ios` (`IOSAgent`/WebDriverAgent), `@midscene/harmony` (HDC), `@midscene/computer` (`agentForComputer()`, RDP: `agentForRDPComputer()`) + Playgrounds (`npx --yes @midscene/computer-playground`)
6. Agent Skills for coding agents: `npx skills add web-infra-dev/midscene-skills` (drives `npx @midscene/{web,android,ios,computer}`)
7. `MCP servers were retired since >1.9.8` — never register Midscene as an MCP

### 5. Caching And Reports

> Goal: fast and correct in CI

1. cache = AI planning steps (prompt as key) + web XPath locates; enable `cache: { id }` or `cache: true` (auto id); strategies: `read-write` (default), `read-only` (+`agent.flushCache()` manual), `write-only`; legacy `MIDSCENE_CACHE=1`+`cacheId`
2. cache files live in `./midscene_run/cache/*.cache.yaml` — `commit them for CI or persist the cache across runs`, otherwise every run pays for a fresh plan; XPath cache doesn't work on canvas/cross-origin iframe/closed Shadow DOM; prune with `flushCache({ cleanUnused: true })`
3. reports: interactive HTML at `./midscene_run/report/*.html`; convert to markdown with `reportFileToMarkdown` or `npx @midscene/web report-tool --action to-markdown`

### 6. Run And Validate

> Goal: confirm the usage really works

1. smoke script: `npx tsx demo.ts` (the demo uses the §3 snippet) → see the actions actually happen + a new HTML report in `./midscene_run/report/`
2. suite: `bunx playwright test` (or `midscene ./flow.yaml`) → green + merged reporter output
3. failing because of the model → run `npx midscene model verify` before debugging the test; failing because of the UI → `/update-tests`; a genuinely broken flow → `/resolve-errors` (same pipeline as `/deep-test e2e`)

## Rules

### 1. Determinism First Where Possible

- for deterministic checks use `aiQuery` + JS `expect` instead of pure `aiAssert` (cheaper and more stable)
- every `aiWaitFor` costs tokens — await app readiness via API/selector first when possible

### 2. Cost Discipline

- set `replanningCycleLimit`, avoid needless `deepThink`, enable cache in dev and commit the cache in CI
- one page-agent per page; `fileChooserAllowedDir` is mandatory for prompt-driven uploads (security)

### 3. Vision Needs Pixels

- never pair Midscene+Lightpanda (no rendering — see `use-lightpanda` Rule 1); blank-font screenshots → `PW_TEST_SCREENSHOT_NO_FONTS_READY=1`; native `<select>` needs `forceChromeSelectRendering` (default on)

### 4. Current API Surface Only

- don't follow old tutorials that register an MCP server / Vitest plugin / `flushWait` / use `aiAction` as the primary name — use the names in §3-§4 (verified v1.15.3)

## Expected Outcome

- VLM config passes `npx midscene model verify`
- able to write/run NL tests via both the fixture and the direct agent; an HTML report is produced every run
- cache setup is correct (files in `./midscene_run/cache`, strategy matches the use case)
- the right integration is chosen (Playwright/Puppeteer/Vitest-pattern/YAML/Midscene Test/Bridge/native) and no retired path is used
- the boundary with other browser tools is stated per the `/use-chrome-devtools` matrix
