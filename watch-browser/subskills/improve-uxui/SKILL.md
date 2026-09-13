---
name: watch-browser-improve-uxui
description: Watch browser confirm server แล้ว subagents แยก route improve UX/UI ตาม review-uxui + responsive
argument-hint: "[url]"
related:
  - watch-browser
  - improve-uxui-and-features
  - use-agent-browser
  - review-uxui
  - use-subagents
  - deep-analyze
  - resolve-errors
  - run-dev
  - create-report-in-dot-devin
  - update-docs
  - report
  - suggest-next-action
---

## Goal

Watch หน้าเว็บผ่าน `agent-browser` เพื่อ confirm ว่า web server ทำงานได้ จากนั้น dispatch subagents แยกตาม route เพื่อ capture screenshots, deep-analyze ปัญหา UX/UI ตาม `/review-uxui` และแก้ไขให้ responsive ครบทุก viewport

## Scope

ใช้เมื่อต้องการ review และ improve UX/UI ของเว็บที่กำลังรันอยู่แบบ evidence-driven — ทุก finding ต้องมาจาก screenshots จริงของแต่ละ route

- ถ้าต้องการ orchestrate ทั้ง functional + visual UX pass → `/improve-uxui-and-features`
- ถ้าต้องการ test flows/actions → `/watch-browser test`
- ถ้าต้องการแก้ console/page errors → `/watch-browser fix`
- ถ้าต้องการ watch เฉยๆ → `/watch-browser`
- ถ้าไม่มี `agent-browser` MCP server → fallback ไป `/use-agent-browser` (CLI)

## Execute

### 1. Verify Web Server

> Goal: confirm ว่า server ทำงานได้ก่อนลงมือ UX/UI

1. ทำ `/watch-browser` — เปิด URL เป้าหมายผ่าน `agent-browser`, capture screenshot แรก และเช็ค console/errors
2. ถ้า server ไม่ตอบสนอง → ทำ `/run-dev` หรือ `/resolve-errors` ก่อน แล้วกลับมา step นี้
3. เก็บ baseline screenshot ของ `/` route

### 2. Discover Routes

> Goal: รู้ routes ทั้งหมดที่ต้อง cover — ห้ามข้าม route ใด

1. ดึง interactive elements ด้วย `agent-browser snapshot -i` เพื่อหา links/nav
2. cross-check กับ route definitions ใน codebase (`scan-codebase` — router config, pages/, app/ dir)
3. รวมทุก route ที่ reachable — รวม dynamic routes (ใช้ sample params ของแต่ละ pattern), nested routes, และ error routes (404, error boundary)
4. สร้าง checklist ทุก route — route ที่ auth-gated ให้ login ก่อนหรือบันทึกเป็น requires-auth (ยังต้อง cover)

### 3. Dispatch UXUI Subagents Per Route

> Goal: analyze ครบทุก route แบบ parallel — ทุก route ต้องมี agent ดูแล

ทำตาม `/use-subagents` — spawn subagent ครอบคลุมทุก route ใน checklist (แบ่ง batch 3-5 routes ต่อ agent เพื่อ parallelism แต่ห้ามตัด route ทิ้ง) โดยแต่ละ agent ต้อง:

1. `agent-browser open <route>` + capture screenshot ที่ viewport `1280x720` (desktop) และ `390x844` (mobile)
2. ทำ `/review-uxui` บน screenshots — layout, spacing, typography, contrast, hierarchy, empty/loading/error states, responsive breakpoints
3. บันทึก findings พร้อม evidence (screenshot path + element ref)

### 4. Aggregate Findings

> Goal: รวมและจัดลำดับ findings จากทุก agent

1. ตรวจ checklist — ทุก route ต้องมี agent report กลับมา ถ้า route ไหนไม่มีให้ dispatch เพิ่ม (ห้ามปล่อย route ที่ไม่ถูก review)
2. รวม findings ทั้งหมด dedupe ตาม component/pattern
3. จัด severity: Critical (broken layout/overflow), High (responsive แตก, contrast ต่ำ), Medium (spacing/hierarchy), Low (polish)
4. ทำ `/deep-analyze` สำหรับ findings ที่ไม่ชัดสาเหตุ — map กลับไปหา source component

### 5. Fix UXUI Issues

> Goal: แก้ findings ที่ root cause

1. แก้ตามลำดับ Critical → Low — dispatch subagents แยกแก้ตาม route/component ที่เป็นเจ้าของ
2. ทุก fix ต้อง cover responsive: แก้ทั้ง desktop และ mobile viewport ไม่ใช่แค่จอเดียว
3. ถ้า finding เป็น systemic (theme tokens, global CSS) → แก้ที่ shared layer ครั้งเดียว ไม่ patch ทีละหน้า
4. ถ้า fix เสี่ยง regressions → ทำ `/resolve-errors` ตรวจ typecheck/lint หลังแก้

### 6. Verify And Re-capture

> Goal: ยืนยันว่าแก้จริงด้วย screenshots ใหม่

1. `agent-browser reload` แล้ว capture ทุก route ที่แก้ทั้ง 2 viewports
2. เทียบ before/after — confirm ปัญหาหายและไม่เกิด regression ใหม่
3. ถ้ายังมีปัญหาเดิม → loop กลับ Step 5 (สูงสุด 3 รอบ)

### 7. Report

> Goal: ส่งมอบผล

1. ทำ `/report` — findings per route, fixes applied, before/after screenshots
2. persist raw findings → `.devin/reports/<workspace>/uxui-<time>.md` ตาม format `/create-report-in-dot-devin` — table: route | finding | severity | fix | status พร้อม screenshot paths เพื่อให้ `/update-docs` และ skills อื่น reuse ได้
3. ปิด browser session ด้วย `agent-browser close`
4. ทำ `/suggest-next-action`

## Rules

### 1. Screenshot Evidence First

- ทุก UX/UI finding ต้องมี screenshot — ห้ามตัดสินจาก DOM/code อย่างเดียว
- screenshots ทั้งหมด save ไป OS temp dir (`$env:TEMP`/`os.tmpdir()`) — ห้าม commit เข้า repo
- capture ทั้ง desktop (`1280x720`) และ mobile (`390x844`) viewport เสมอ

### 2. Server Before Review

- ต้อง confirm web server ทำงานผ่าน `/watch-browser` ก่อน dispatch agents — ห้ามข้าม
- ถ้า route ใด 404/error → ส่งต่อ `/watch-browser fix` ก่อน review UX/UI ของ route นั้น

### 3. Systemic Over Patch

- findings ที่ซ้ำหลาย routes (spacing, color, typography) → แก้ที่ design tokens/global styles
- ห้าม inline-style patch ที่ซ้ำกันหลายที่

### 4. Responsive Required

- ทุก fix ต้องผ่านทั้ง 2 viewports — mobile-first เมื่อแก้ layout
- touch targets ≥44px, ไม่มี horizontal overflow บน mobile

### 5. Loop Limit

- fix-verify loop สูงสุด `3` รอบ — ถ้ายังไม่ผ่าน stop และ report สิ่งที่ค้าง
- `timeout` = `900` วินาทีต่อ batch, `maxRetries` = `3` ต่อ agent crash

## Expected Outcome

- ทุก route มี screenshots desktop+mobile และ findings พร้อม evidence
- Critical/High UXUI issues ถูกแก้ที่ root cause และ re-capture ยืนยัน
- เว็บ responsive ครบ — ไม่มี overflow, touch targets ผ่านเกณฑ์
- report สรุป before/after และ issues ที่ค้าง (ถ้ามี)
- raw findings ถูก persist ใน `.devin/reports/<workspace>/` พร้อม reuse โดย `/update-docs`

