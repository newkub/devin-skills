---
name: deep-test
description: Deep testing — API, CLI, contract, coverage, e2e, integration, mutation, visual domains
argument-hint: "[domain] [scope]"
related:
  - run-test
  - deep-validate
  - review-test
  - update-tests
  - resolve-errors
  - follow-tool-playwright
  - follow-tool-hurl
  - follow-tool-bruno
  - follow-tool-stryker-mutator
  - use-agent-browser
  - use-chrome-devtools
  - capture
  - report
  - suggest-next-action

---

## Goal

รัน deep/domain-specific testing — เกินกว่า unit tests ของ `/run-test` — ครอบคลุม API, CLI, contract, coverage, E2E, integration, mutation และ visual testing ใน skill เดียว (merged — ไม่มี `deep-test-*` skills แยกแล้ว)

## Scope

ใช้เมื่อต้องการ test ลึกกว่า unit tests — multi-layer, external systems, browsers, contracts หรือ mutation analysis

- `/run-test [domain]` = run-only test runners ใน skill เดียว — unit default + domain args `all`, `api`, `cli`, `contract`, `coverage`, `e2e`, `integration`, `mutation`, `visual` (merged inline ใน `## Merged Details`; `all` = orchestrator รันทุก suite รวมกัน)
- `/deep-test <domain>` = analysis/workflow ลึกของ domain — เลือก domain workflow จากตารางแล้วทำตาม reference นั้น
- แก้ไข/อัปเดต test specs → `/update-tests` (skill นี้ run-only ไม่เขียน tests)
- Out-of-scope pointers: load/perf → `/test-load`, run-only domains อื่น (`smoke`, `component`, `a11y`, `property`, `database`, `mobile`) → `/run-test <domain>` → `/test-<domain>`, interactive browser watch + roleplay → `/watch-browser-and-test`, test isolation/flaky audit → `/review-test`

## Execute

### Domain Workflows

| Domain | Reference | ครอบคลุม |
|--------|-----------|----------|
| api | [references/api.md](references/api.md) | REST/GraphQL/tRPC/WebSocket endpoints, response contract checks, Bruno/Hurl/Schemathesis, all-routes check (`scripts/check-routes.*` + `subagents/route-checker.md`) |
| cli | [references/cli.md](references/cli.md) | CLI commands, exit codes, stdout/stderr, flags, error paths |
| contract | [references/contract.md](references/contract.md) | consumer/provider contract verification, drift detection |
| coverage | [references/coverage.md](references/coverage.md) | coverage analysis, thresholds, gap loop จน 100% |
| e2e | [references/e2e.md](references/e2e.md) | Playwright browser tests, all routes, agent-browser exploratory, chrome-devtools-mcp debug |
| integration | [references/integration.md](references/integration.md) | module interactions, data flow, test DB/services |
| mutation | [references/mutation.md](references/mutation.md) | mutation testing, surviving mutants, weak assertions |
| visual | [references/visual.md](references/visual.md) | visual regression, screenshot diff vs baseline |

### Flow

1. ระบุ domain จาก argument (เช่น `/deep-test api` → ทำตาม `references/api.md`)
2. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain
3. ถ้าต้องการรันทุก domain → `/run-test all`
4. ทำตาม Execute + Rules ใน reference ของ domain นั้น
5. failures แก้ผ่าน `/resolve-errors` — ห้าม suppress

## Rules

- ทุก domain ต้อง pre-check ด้วย review skill ที่ตรง domain ก่อนรัน ตาม global rules (`/review-api` สำหรับ api, `/review-test` สำหรับที่เหลือ)
- ทุก domain ใช้ test isolation, cleanup side effects, และ report ผลตาม reference นั้น
- ใช้ /review-test ถ้าจำเป็น
- ใช้ /run-test all ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น
- ใช้ /deep-validate ถ้าจำเป็น
- ใช้ /follow-tool-playwright ถ้าจำเป็น
- ใช้ /follow-tool-hurl ถ้าจำเป็น
- ใช้ /follow-tool-bruno ถ้าจำเป็น
- ใช้ /follow-tool-stryker-mutator ถ้าจำเป็น
- ใช้ /use-agent-browser ถ้าจำเป็น
- ใช้ /use-chrome-devtools ถ้าจำเป็น
- ใช้ /capture ถ้าจำเป็น


## Expected Outcome

- domain ที่เลือกถูกรันตาม workflow ใน reference จนเสร็จ
- failures ถูก classify และ route ไป fix skill ที่เหมาะ
