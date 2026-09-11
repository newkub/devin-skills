---
name: improve-uxui
description: Orchestrate UX/UI pass — test flows + visual review ทุก route ผ่าน subagents แล้วแก้จริง
argument-hint: "[url]"
related:
  - watch-browser
  - watch-browser-and-test
  - watch-browser-and-improve-uxui
  - review-uxui
  - deep-thinking
  - use-subagents
  - report
  - suggest-next-action
---

## Goal

ปรับปรุง UX/UI ของเว็บที่รันอยู่แบบ end-to-end — combine functional testing (roleplay user) และ visual analysis (screenshot review) ครบทุก route ผ่าน `agent-browser` + subagents แล้วแก้ issues ทั้งหมดที่ root cause

## Scope

ใช้เมื่อต้องการ UX/UI pass แบบครบวงจร — orchestrator ที่รวม 2 มิติ:

- Functional UX — ทำตาม `/watch-browser-and-test` (flows, actions, error states ที่ user เจอจริง)
- Visual UX — ทำตาม `/watch-browser-and-improve-uxui` (layout, responsive, polish จาก screenshots)

ถ้าต้องการแค่มิติเดียว → เรียก sub-skill นั้นโดยตรง

## Execute

### 1. Confirm Web Server

> Goal: server พร้อมก่อนเริ่มทุกอย่าง

1. ทำ `/watch-browser` — เปิด URL, capture baseline, เช็ค console/errors
2. ถ้า server พัง → `/run-dev` หรือ `/resolve-errors` ก่อน

### 2. Run Functional UX Pass

> Goal: หา UX issues จากการใช้งานจริง

1. ทำ `/watch-browser-and-test` — subagents roleplay user ทุก route
2. เก็บ FAIL findings ที่เป็น UX problems (confusing flows, missing feedback, dead ends, unclear errors) แยกจาก pure bugs

### 3. Run Visual UX Pass

> Goal: หา UX issues จากภาพจริงทุก route

1. ทำ `/watch-browser-and-improve-uxui` — subagents capture + `/review-uxui` ทุก route ทั้ง desktop และ mobile
2. เก็บ findings พร้อม screenshot evidence

### 4. Merge And Prioritize

> Goal: รวม 2 passes เป็น action plan เดียว

1. dedupe findings ที่ root cause เดียวกัน — functional + visual มักชี้จุดเดียวกัน
2. จัด severity รวม: Critical (flow พัง/layout แตก), High (responsive, contrast, missing feedback), Medium (hierarchy, spacing), Low (polish)
3. ใช้ `/deep-thinking` สำหรับ design decisions ที่มี trade-off — เช่น information architecture, flow restructuring, pattern selection ที่กระทบหลาย routes

### 5. Fix Issues

> Goal: แก้ทั้ง functional และ visual ที่ root cause

1. แก้ตาม severity — systemic fixes (tokens, shared components, global patterns) ก่อน per-route fixes
2. dispatch `/use-subagents` แยกแก้ตาม component/route ownership ถ้า scope ใหญ่
3. ทุก fix ต้อง cover responsive และไม่ทำ functional regressions

### 6. Verify

> Goal: ยืนยันด้วย evidence ใหม่

1. re-run เฉพาะ routes ที่แก้: re-capture screenshots + replay failed actions
2. fix-verify loop สูงสุด `3` รอบ

### 7. Report

> Goal: ส่งมอบผลรวม

1. ทำ `/report` — functional findings + visual findings + fixes + before/after evidence ต่อ route
2. ปิด browser session (`agent-browser close`)
3. ทำ `/suggest-next-action`

## Rules

### 1. Two Dimensions Required

- ต้องรันทั้ง functional pass และ visual pass — UX issue ที่เห็นในภาพอาจไม่เห็นใน flow test และกลับกัน
- ห้ามข้าม `/watch-browser` server verification

### 2. Evidence First

- ทุก finding ต้องมี screenshot หรือ repro steps — ห้ามแก้จาก intuition
- before/after screenshots ทุก fix

### 3. All Routes

- checklist ทุก route (รวม dynamic, nested, error, auth-gated) — ห้ามข้าม
- route ที่ untested ต้องระบุใน report

### 4. Deep Thinking For Trade-offs

- ใช้ `/deep-thinking` เมื่อ fix มี design trade-off หรือกระทบหลาย routes — ไม่ตัดสินใจ IA/flow ใหญ่แบบ ad-hoc
- fixes ที่เป็น mechanical (spacing, contrast, missing states) ทำได้เลยไม่ต้อง deep-think

### 5. Loop Limit

- fix-verify สูงสุด `3` รอบ — ถ้ายังไม่ผ่าน stop และ report สิ่งที่ค้าง
- `timeout` = `900` วินาทีต่อ pass

## Expected Outcome

- UX/UI issues ถูกค้นจากทั้ง functional และ visual dimensions ครบทุก route
- fixes applied ที่ root cause พร้อม responsive coverage และ before/after evidence
- report รวม 2 passes พร้อม severity, fixes, และ items ค้าง
