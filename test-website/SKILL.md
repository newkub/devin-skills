---
name: test-website
description: ทดสอบ website จริงแบบ click-through ทุก route/interactive element — เลือก browser tool ตาม context (agent-browser default, playwriter เมื่อต้อง login state ของ user)
argument-hint: "[url-or-routes...]"
allowed-tools:
  - read
  - grep
  - glob
  - exec
  - ask_user_question
related:
  - use-agent-browser
  - use-playwriter
  - use-chrome-devtools
  - follow-tool-playwright
  - follow-tool-e2e
  - test-e2e
  - test-a11y
  - watch-browser-and-test
  - run-dev
  - run-test
  - resolve-errors
  - report

---

## Goal

ทดสอบ website แบบ real-browser click-through — ทุก route, nav, forms, dialogs, states พร้อม console/page error evidence ก่อน ship — เลือก browser tool ตาม context แล้ว promote invariants เป็น authored tests

## Scope

ใช้สำหรับ website verification แบบ exploratory/real-browser — dev server, staging, production URLs; เหมาะกับ smoke sweep ทุก route ก่อน release, post-implement verification และเว็บที่ต้องใช้ login state จริง

- Boundary: codified regression suite → `/test-e2e`; a11y เชิงลึก → `/test-a11y`; docs usage examples → `/test-usage`; unit/api → `/run-test <domain>`; งานนี้ = ad-hoc sweep จริง + promote findings
- Skill นี้เลือก tool ให้ — ไม่ใช่ tool manual; tool-specific commands/ห้าม/กฎ อ่านจาก `/use-agent-browser` `/use-playwriter` `/use-chrome-devtools` ตามที่เลือก

## Execute

### 0. Select Tool

> Goal: เลือก browser tool ให้ตรง context — capability ซ้ำกัน ต่างที่ context

| Context | Tool |
|---|---|
| **Default** — dev/staging/public, reproducible, ไม่แตะ browser user | `/use-agent-browser` (`open`/`snapshot -i`/`click @e1`/`console`/`errors`) |
| ต้อง login state / cookies / extensions ของ user | `/use-playwriter` (`session new` + `state.page` + `snapshot`) |
| Target ควรเป็น authored suite ถาวรอยู่แล้ว | `/test-e2e` → `/follow-tool-e2e` หรือ `/follow-tool-playwright` (ไม่ใช่งาน skill นี้ — dispatch แล้วจบ) |
| Sweep เจอ bug ต้อง inspect console/network/CSS/perf ลึก | `/use-chrome-devtools` (handoff investigation แล้วกลับมา) |

1. ถ้า site ต้อง auth แต่ไม่มี login state ที่ใช้ได้ → แจ้ง user เลือก: login ใน Chrome แล้วใช้ playwriter หรือ setup `storageState` ผ่าน `/follow-tool-playwright`
2. ห้าม default ไป playwriter เพราะ "คุ้นกว่า" — playwriter แตะ Chrome จริงของ user มี cost/risk เสมอ

### 1. Discover Routes And Setup

> Goal: รู้ route list และมี browser session พร้อม

1. รับ URLs จาก argument หรือ derive จาก sitemap/routes manifest/nav links — ไม่ชัด → `/ask-me`
2. ถ้า test local dev → ทำ `/run-dev` ให้ server รันก่อน แล้วรอ port พร้อม
3. Setup ตาม tool ที่เลือกจาก Step 0 — `agent-browser`: `agent-browser open <base-url> --session test` ; `playwriter`: ตาม `/use-playwriter` Step 1-2 (`session new --tab-group test` + `state.page = await context.newPage()`)

### 2. Route Sweep

> Goal: visit ทุก route พร้อม evidence

สำหรับแต่ละ route — observe → act → observe ตาม tool ที่เลือก:

```bash
# agent-browser (default)
agent-browser --session test open "<base>/<route>" && agent-browser --session test wait --load networkidle && agent-browser --session test snapshot -i && agent-browser --session test console
```

```js
// playwriter — 1 route ต่อ -e call
await state.page.goto('https://<host>/<route>', { waitUntil: 'domcontentloaded' })
await waitForPageLoad({ page: state.page, timeout: 8000 })
console.log('URL:', state.page.url())
console.log('Logs:', await getLatestLogs({ page: state.page, sinceLastCall: true }))
await snapshot({ page: state.page }).then(console.log)
```

1. บันทึกต่อ route: HTTP status, final URL (redirects), console errors, `[PAGE ERROR]`, missing/empty content
2. snapshot หา blockers (cookie modal, login wall, error page) ก่อน — dismiss แล้ว re-snapshot
3. broken route (4xx/5xx/redirect ผิด) → บันทึก severity แล้วไปต่อ ไม่หยุดทั้ง sweep

### 3. Interact And States

> Goal: ทุก interactive element ใช้งานได้จริง

1. ทุก route: click nav links, menus, tabs, dialogs ตาม snapshot locators — ห้ามเดา selector ใช้จาก snapshot output
2. forms: submit ทั้ง valid + invalid — verify validation messages, loading/disabled states, success feedback
3. ตรวจ dead UI: `onClick` ที่ไม่ทำอะไร, `href="#"`, 'coming soon' — บันทึกเป็น finding (wire หรือลบ ตาม `/implement-to-production` rules)
4. ตรวจ states: loading, error (retry), empty, success — หลังทุก action อ่าน `getLatestLogs` + re-snapshot
5. click timeout → snapshot หา overlay/modal blocker — ห้าม `{ force: true }`/`dispatchEvent`

### 4. Collect Findings And Report

> Goal: สรุปผลต่อ route พร้อม evidence

1. รวม findings: `[ ]` route table — Route/Status/Console Errors/Dead UI/State Issues/Severity
2. severity: Critical (route broken, form submit ไม่ได้, console errors), High (dead interactive element, missing error state), Medium (missing empty/loading, minor UI), Info
3. ทำ `/report` ตาราง + ข้อเสนอแนะ fixes; failures ที่ต้องแก้ → `/resolve-errors`
4. **Promote invariants** — checks ที่เป็น expectation ถาวร (login works, checkout ไม่ 500, critical route render) → เขียนเป็น authored test จริงใน repo ผ่าน `/follow-tool-playwright` หรือ `/follow-tool-e2e` (มี test infra อยู่ → เขียนเลย; ยังไม่มี → เสนอ user); checks ที่เป็น exploratory ชั่วคราวทิ้งได้ ไม่บังคับเก็บ
5. cleanup ตาม tool — `agent-browser`: `agent-browser close --session test` + ลบ temp profiles/files; `playwriter`: ปิดเฉพาะ pages ที่สร้างเอง, ลบ listeners ตัวเอง — ห้าม `browser.close()`/`context.close()` ตาม `/use-playwriter` rules

## Rules

### 1. Tool Rules Apply

- ทำตาม `## Rules` ของ tool ที่เลือกเสมอ — `agent-browser`: prefer `@ref`, wait before interact, capture on failure; `playwriter`: snapshot before screenshot, observe→act→observe, ไม่ทำลาย browser ของ user, absolute artifact paths

### 1.1 Explore Then Assert

- sweep ad-hoc ก่อน (explore ทิ้งได้) → invariants ที่เจอ promote เป็น authored tests ผ่าน `/follow-tool-playwright`/`/follow-tool-e2e` — ห้ามปล่อย expectation สำคัญหายไปกับ session

### 2. Evidence Required

- ทุก finding ต้องมี evidence: URL + snapshot excerpt/console log + severity — ห้าม report ลอยๆ

### 3. Non-Destructive

- ห้าม submit ข้อมูลจริงที่มีผลข้างเคียง (payment, delete, publish) โดยไม่ confirm; ใช้ test data เสมอ

### 4. Full Coverage Over Depth

- ครบทุก route ก่อนลงลึก — sweep-wide ก่อน แล้วค่อย interact-deep ใน routes สำคัญ

- ใช้ /watch-browser-and-test ถ้าจำเป็น
- ใช้ /test-e2e ถ้าจำเป็น
- ใช้ /test-a11y ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น

## Expected Outcome

- tool ถูกเลือกตาม context (agent-browser default, playwriter เมื่อต้อง login state)
- ทุก route ถูก visit พร้อม URL/status/console evidence
- interactive elements หลักถูก click/submit จริง พร้อม state verification
- findings table ครบ severity + evidence ต่อ route
- invariants ถูก promote เป็น authored tests (`/follow-tool-playwright`/`/follow-tool-e2e`) หรือเสนอ user ถ้ายังไม่มี infra
- session/browser สะอาดหลังจบ ตาม tool ที่ใช้
