---
name: improve-uxui
description: Orchestrate UX/UI pass + UXUI features — test, review, fix และเพิ่ม UX features ทุก route
argument-hint: "[url]"
related:
  - watch-browser
  - review-uxui
  - review-accessibility
  - deep-thinking
  - deep-research
  - use-subagents
  - run-dev
  - resolve-errors
  - update-tests
  - implement-to-production
  - run-test
  - create-report-in-dot-devin
  - update-docs
  - report
  - suggest-next-action
---

## Goal

ปรับปรุง UX/UI ของเว็บที่รันอยู่แบบ end-to-end — combine functional testing (roleplay user), visual analysis (screenshot review) และ UXUI features ครบทุก route ผ่าน `agent-browser` + subagents แล้วแก้ issues + เพิ่ม features ที่ root cause

## Scope

ใช้เมื่อต้องการ UX/UI pass แบบครบวงจร — orchestrator ที่รวม 4 มิติ:

- Functional UX — ทำตาม `/watch-browser-test` (flows, actions, error states ที่ user เจอจริง)
- Visual UX — ทำตาม `/watch-browser-improve-uxui` (layout, responsive, polish จาก screenshots)
- Accessibility — อยู่ใน visual pass ตาม `/review-accessibility` (contrast, focus order, aria, keyboard nav — a11y คือส่วนหนึ่งของ UX ไม่แยก skill)
- UXUI Features — features ที่เกี่ยวกับ UX เท่านั้น: missing states (loading/empty/error), feedback (toasts, progress), affordances (shortcuts, tooltips, hints), micro-interactions, navigation aids — ไม่ใช่ business features
- Design System Research — `/deep-research` best practices จาก established design systems (Material Design, Apple HIG, GitHub Primer, Radix/shadcn patterns, Nielsen heuristics, WCAG) เพื่อให้ fixes/features ตามมาตรฐานจริง ไม่ใช่ intuition

ถ้าต้องการแค่มิติเดียว → เรียก sub-skill นั้นโดยตรง

- fix guides เฉพาะ domain อยู่ใน `review-uxui/references/fix-*.md` — อ่านแล้วทำตามเมื่อแก้ findings ของ domain นั้น

## Execute

### 1. Confirm Web Server

> Goal: server พร้อมก่อนเริ่มทุกอย่าง

1. ทำ `/watch-browser` — เปิด URL, capture baseline, เช็ค console/errors
2. ถ้า server พัง → `/run-dev` หรือ `/resolve-errors` ก่อน

### 2. Run Functional UX Pass

> Goal: หา UX issues จากการใช้งานจริง

1. ทำ `/watch-browser-test` — subagents roleplay user ทุก route
2. เก็บ FAIL findings ที่เป็น UX problems (confusing flows, missing feedback, dead ends, unclear errors) แยกจาก pure bugs

### 3. Run Visual UX Pass

> Goal: หา UX issues จากภาพจริงทุก route

1. ทำ `/watch-browser-improve-uxui` — subagents capture + `/review-uxui` ทุก route ทั้ง desktop และ mobile
2. แต่ละ agent รวม a11y checks ตาม `/review-accessibility` ด้วย — contrast, focus order, aria labels, keyboard navigation
3. เก็บ findings พร้อม screenshot evidence

### 4. Research Design System Best Practices

> Goal: ทุก fix/feature ตามมาตรฐานจริงจาก established design systems ไม่ใช่ intuition

1. รวม finding types ที่ซ้ำหรือเป็น systemic (เช่น missing states, contrast, navigation, form patterns, feedback patterns)
2. ทำ `/deep-research` ต่อ finding type — ค้น best practices จาก official sources: Material Design, Apple HIG, GitHub Primer, Radix/shadcn patterns, Nielsen's heuristics, WCAG guidelines
3. เก็บ authoritative guidance พร้อม source per finding type — ใช้เป็นเกณฑ์ตัดสิน fix approach ใน Step 5-6
4. ถ้า best practice หลายแหล่งขัดกัน → ใช้ `/deep-thinking` ตัดสินแบบมีเหตุผล ไม่เลือกมั่ว

### 5. Merge And Prioritize

> Goal: รวม 2 passes เป็น action plan เดียว

1. dedupe findings ที่ root cause เดียวกัน — functional + visual มักชี้จุดเดียวกัน
2. จัด severity รวม: Critical (flow พัง/layout แตก), High (responsive, contrast, missing feedback), Medium (hierarchy, spacing), Low (polish)
3. map แต่ละ finding ไป best practice จาก Step 4 — fix approach ต้องอ้าง source ไม่ใช่เดา
4. ใช้ `/deep-thinking` สำหรับ design decisions ที่มี trade-off — เช่น information architecture, flow restructuring, pattern selection ที่กระทบหลาย routes

### 6. Fix Issues

> Goal: แก้ทั้ง functional และ visual ที่ root cause

1. แก้ตาม severity — systemic fixes (tokens, shared components, global patterns) ก่อน per-route fixes
2. dispatch `/use-subagents` แยกแก้ตาม component/route ownership ถ้า scope ใหญ่
3. ทุก fix ต้อง cover responsive และไม่ทำ functional regressions

### 7. Add UXUI Features

> Goal: เพิ่ม UX features ที่ findings ชี้ว่าขาด

1. จาก findings ทั้ง 2 passes — ระบุ UXUI features ที่ขาด: missing states (loading/empty/error/skeleton), feedback (toast, progress, confirm), affordances (shortcuts, tooltips, onboarding hints), navigation aids (breadcrumb, back, deep-link)
2. เลือกเฉพาะที่มี evidence จาก findings — ห้ามเพิ่ม feature จาก intuition
3. implement ตาม existing component patterns — ทุก feature ต้องเข้ากับ theme/responsive/keyboard เดิม

### 8. Verify And Sync E2E Suite

> Goal: ยืนยันด้วย evidence ใหม่ + fixes มี e2e regression coverage

1. re-run เฉพาะ routes ที่แก้: re-capture screenshots + replay failed actions — fix-verify loop สูงสุด `3` รอบ
2. หลัง verify ผ่านหมด → ทำ `/update-tests` — เขียน/อัปเดต Playwright tests จาก flows + fixes ที่เพิ่งทำ
3. ทำ `/run-test` (e2e) re-run Playwright suite ยืนยันเขียว — ถ้า FAIL ให้แก้ตาม `/update-tests` flow ก่อน report; Playwright report ที่ได้คือ authoritative test result สำหรับ `/update-docs`

### 9. Production Readiness

> Goal: fixes พร้อม production — ไม่มี mock/placeholder เหลือ

1. ทำ `/implement-to-production` — ตรวจว่าไม่มี mock/TODO/placeholder ใน code path ที่แก้, schema+API+UX layer ครบ, security/resilience/observability ไม่หลุด, มี rollback plan
2. ถ้าพบ gaps → แก้ตาม implement-to-production flow ก่อน report

### 10. Report

> Goal: ส่งมอบผลรวม

1. ทำ `/report` — functional findings + visual findings + fixes + before/after evidence ต่อ route + e2e sync status
2. persist raw findings รวม 2 passes → `.devin/reports/<workspace>/uxui-<time>.md` ตาม format `/create-report-in-dot-devin` — tables: route | dimension | finding | severity | fix | status (findings เท่านั้น — authoritative test result = Playwright report จาก Step 8 ไม่ใช่ exploratory pass)
3. ปิด browser session (`agent-browser close`)
4. ทำ `/suggest-next-action`

### Subskills

> Goal: dispatch งาน fix เฉพาะด้านไปยัง subskill ที่ละเอียดกว่า

| Topic | Subskill |
|-------|----------|
| Color contrast fixes — tokens, WCAG | `subskills/improve-contrast/SKILL.md` |
| Responsive fixes — breakpoints, overflow, touch targets | `subskills/improve-responsive/SKILL.md` |
| Missing states — loading, empty, error, skeleton | `subskills/improve-states/SKILL.md` |

## Rules

### 1. Two Dimensions Required

- ต้องรันทั้ง functional pass และ visual pass — UX issue ที่เห็นในภาพอาจไม่เห็นใน flow test และกลับกัน
- ห้ามข้าม `/watch-browser` server verification

### 2. Evidence First

- ทุก finding ต้องมี screenshot หรือ repro steps — ห้ามแก้จาก intuition
- screenshots save ไป OS temp dir (`$env:TEMP`/`os.tmpdir()`) — ห้าม commit เข้า repo
- before/after screenshots ทุก fix

### 3. All Routes

- checklist ทุก route (รวม dynamic, nested, error, auth-gated) — ห้ามข้าม
- route ที่ untested ต้องระบุใน report

### 4. Deep Thinking For Trade-offs

- ใช้ `/deep-thinking` เมื่อ fix มี design trade-off หรือกระทบหลาย routes — ไม่ตัดสินใจ IA/flow ใหญ่แบบ ad-hoc
- fixes ที่เป็น mechanical (spacing, contrast, missing states) ทำได้เลยไม่ต้อง deep-think

### 5. Design System Grounding

- fix approach และ UXUI feature ใหม่ต้องอ้าง best practice จาก `/deep-research` (Step 4) — Material Design, Apple HIG, GitHub Primer, Radix/shadcn, Nielsen heuristics, WCAG — ห้าม implement pattern ที่คิดเองโดยไม่มี source
- ถ้า sources ขัดกัน → `/deep-thinking` ตัดสิน ไม่เลือกมั่ว
- เก็บ source URL ใน findings report เพื่อ traceability

### 6. Loop Limit

- fix-verify สูงสุด `3` รอบ — ถ้ายังไม่ผ่าน stop และ report สิ่งที่ค้าง
- `timeout` = `900` วินาทีต่อ pass

## Expected Outcome

- UX/UI issues ถูกค้นจากทั้ง functional และ visual dimensions ครบทุก route
- fixes applied ที่ root cause พร้อม responsive coverage และ before/after evidence
- fix approach + UXUI features อ้าง best practice จาก established design systems พร้อม source ทุกรายการ
- report รวม 2 passes พร้อม severity, fixes, และ items ค้าง
- raw findings ถูก persist ใน `.devin/reports/<workspace>/` พร้อม reuse โดย `/update-docs`
