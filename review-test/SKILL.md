---
name: review-test
description: Review test strategy, test cases, test results, coverage, flaky — thin entry → /deep-review domain review-test
argument-hint: "[scope] [flaky|coverage|report-flaky]"
related:
  - deep-review
  - improve-tests
  - run-test-all
  - deep-test
  - update-tests
  - report
---

## Goal

Review test strategy และ quality (ก่อน run/write) + วิเคราะห์ test results หลัง run (pass/fail, coverage delta, flaky) — canonical domain `review-test` อยู่ที่ `deep-review/SKILL.md` `## Review Domains`

## Scope

- ใช้ก่อน `/run-test-all`, `/update-tests`, `/deep-test` — ตรวจ strategy: coverage, edge cases, isolation, pyramid balance, regression
- ใช้หลัง test run — วิเคราะห์ผลลัพธ์, coverage delta, flaky, สรุป action ถัดไป
- หา improvements ที่ต้องแก้ → `/improve-tests`

## Execute

1. ทำ `/deep-review` domain `review-test` กับ scope — canonical steps (prepare → coverage → edge cases → isolation → pyramid → results) อยู่ที่ `deep-review/SKILL.md` `## Review Domains` + `## Domain Pipeline`
2. ถ้า argument ตรง workflow (`flaky`, `coverage`/`improve-coverage`, `report-flaky`) → forward ไป workflow นั้นของ domain เดิม
3. ทำ `/report` สรุป findings + `/suggest-next-action`

## Rules

- ห้าม duplicate review steps ที่นี่ — canonical อยู่ที่ `deep-review/SKILL.md` domain `review-test` เท่านั้น
- Review เท่านั้น — แก้ผ่าน `/deep-review-then-fix` หรือ `/update-tests` หลัง user confirm

## Expected Outcome

- Test strategy/results ถูก review ผ่าน canonical domain พร้อม findings + next action
