---
name: deep-test
description: Deep testing — API, CLI, contract, coverage, e2e, integration, mutation, visual domains
argument-hint: "[domain] [scope]"
related:
  - run-test
  - run-test-all
  - deep-validate
  - review-test
  - update-tests
  - resolve-errors
  - report
  - suggest-next-action
---

## Goal

รัน deep/domain-specific testing — เกินกว่า unit tests ของ `/run-test` — ครอบคลุม API, CLI, contract, coverage, E2E, integration, mutation และ visual testing ผ่าน top-level domain skills

## Scope

ใช้เมื่อต้องการ test ลึกกว่า unit tests — multi-layer, external systems, browsers, contracts หรือ mutation analysis

- `/run-test` = unit/fast tests เท่านั้น
- `/deep-test` = dispatcher ไป domain skills; ถ้าไม่ระบุ domain → `/ask-me` เลือก
- `/run-test-all` = รันทุก suite รวมกัน (orchestrator)
- แก้ไข/อัปเดต test specs → `/update-tests` (skills กลุ่มนี้ run-only ไม่เขียน tests)

## Execute

### Domain Skills

| Domain | Skill |
|--------|-------|
| api | `/deep-test-api` — REST/GraphQL/tRPC/WebSocket endpoints, response contract checks |
| cli | `/deep-test-cli` — CLI commands, exit codes, stdout/stderr, flags, error paths |
| contract | `/deep-test-contract` — consumer/provider contract verification, drift detection |
| coverage | `/deep-test-coverage` — coverage analysis, thresholds, gap loop |
| e2e | `/deep-test-e2e` — Playwright browser tests, all routes, agent-browser exploratory |
| integration | `/deep-test-integration` — module interactions, data flow, test DB/services |
| mutation | `/deep-test-mutation` — mutation testing, surviving mutants, weak assertions |
| visual | `/deep-test-visual` — visual regression, screenshot diff vs baseline |

1. ระบุ domain จาก argument (เช่น `/deep-test api` → `/deep-test-api`)
2. ถ้า domain รองรับ → เรียก `/deep-test-<domain>` skill แล้วทำตาม flow นั้น
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain
4. ถ้าต้องการรันทุก domain → `/run-test-all`

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ skill ปลายทาง
- ทุก domain skill ต้อง pre-check ด้วย `/review-test` ก่อนรัน (ตาม global rules)
- failures แก้ผ่าน `/resolve-errors` — ห้าม suppress

- ใช้ /review-test ถ้าจำเป็น
- ใช้ /run-test-all ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป `/deep-test-<domain>` ที่ตรง domain แล้วรันตาม flow นั้น
- failures ถูก classify และ route ไป fix skill ที่เหมาะ
