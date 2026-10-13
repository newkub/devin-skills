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
| api | [references/api.md](references/api.md) | REST/GraphQL/tRPC/WebSocket endpoints, response contract checks, Bruno/Hurl/Schemathesis, all-routes check (`scripts/check-routes.*` + profile `route-checker` ใน `## Subagents`) |
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

## Subagents

> Goal: งานอิสระที่ spawn ทำขนานได้ — profile อยู่ใน section นี้เลย ไม่ต้องมีไฟล์แยก

### route-checker — ทดสอบ API route group เดียวแล้วคืน pass/fail ต่อ route พร้อม evidence

- **Inputs**: `route-group` (list routes ที่รับผิดชอบ เช่น `GET /api/users`, `GET /api/users/{id}`), `base-url` (target เช่น `http://localhost:3000`), `method-policy` (safe methods only default หรือ `allow-write` เมื่อ user confirm แล้ว), `headers` (optional — auth headers เช่น `Authorization: Bearer <token>`; parent ต้อง mask ก่อน report), `timeout`/`slow-threshold` (optional — default timeout และ threshold ของ `slow`)
- **Tools**: `exec` — รัน `bun <skill-dir>/scripts/check-routes.ts` หรือ `scripts/check-routes.ps1` fallback (อนุญาตเฉพาะ `bun *check-routes.ts *` และ `*check-routes.ps1 *`), `read` — อ่าน manifest/results file
- **Execute**: 1) เขียน route list ของ group ลง temp routes file หรือส่งผ่าน `--routes` 2) รัน `bun scripts/check-routes.ts --base <base-url> --routes-file <file> --out <result-file>` 3) dynamic segments `{id}` ถูกแทนด้วย `1` โดย script 4) classify แต่ละ route: `ok` (2xx/expected), `redirect` (3xx), `protected` (401/403), `slow` (>3000ms), `critical` (4xx/5xx/timeout/DNS/TLS), `skipped` (non-safe method), `missing` (404) 5) ถ้าทุก route fail pattern เดียวกัน → flag เป็น group-level issue (เช่น base path ผิด) ไม่ใช่ per-route
- **Output**: ตารางต่อ route `| No. | Method | Route | Status | Expected | Time (ms) | Severity | Evidence |` ปิดท้ายด้วย group summary (tested, skipped, ok, protected, critical, missing) และระบุ result file path ที่ persist ไว้
- **Constraints**: ยิงเฉพาะ `GET`/`HEAD`/`OPTIONS` เว้นแต่ parent ส่ง `allow-write` ที่ user confirm แล้ว; ห้ามยิง production ถ้า parent ไม่ได้ระบุ confirmation; mask credentials/tokens ทุกครั้ง — ห้ามส่ง secrets จริงกลับ; ทุก route ต้องมีผล tested หรือ skipped พร้อมเหตุผล — ห้ามเดา status; รับผิดชอบเฉพาะ route group ที่ได้รับ ไม่ยิง routes นอก group; read-only — ห้าม `write`/`edit`

## Expected Outcome

- domain ที่เลือกถูกรันตาม workflow ใน reference จนเสร็จ
- failures ถูก classify และ route ไป fix skill ที่เหมาะ
