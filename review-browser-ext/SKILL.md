---
name: review-browser-ext
description: Review browser extension — manifest v3, permissions, content scripts, CSP, store readiness
argument-hint: "[scope]"
related:
  - scan-codebase
  - review-frontend
  - review-security
  - review-performance
  - review-bundle
  - check-source-maps
  - deep-review-then-fix
  - report
  - suggest-next-action
---

## Goal

Review browser extension (Chrome/Edge/Firefox/Safari) — manifest, permissions, content scripts, background service worker, messaging, storage, CSP, store submission readiness — report-only

## Scope

ใช้กับ repo ที่มี `manifest.json` (v2/v3) หรือ extension source — ไม่รวม frontend UI deep review (`/review-frontend`), general web security (`/review-security`), bundle size (`/review-bundle`)

## Execute

### 1. Prepare And Identify

> Goal: รู้ manifest version และ surface ทั้งหมด

1. ทำ `/scan-codebase` — หา `manifest.json`, background/service worker, content scripts, popup/options pages
2. ระบุ target browsers และ manifest version (v2 → migration risk)

### 2. Check Manifest And Permissions

> Goal: least-privilege, v3-compliant

1. `permissions`/`host_permissions` minimal — `<all_urls>` หรือ `*://*/*` กว้างเกิน → High
2. MV3 compliance — `background.service_worker`, `action` (ไม่ใช่ `browser_action`), `host_permissions` แยกจาก `permissions`
3. optional permissions ใช้ `optional_permissions` + runtime request แทน upfront
4. `web_accessible_resources` scoped — ไม่เปิดทุก resource ให้ทุก site

### 3. Check Content Scripts And Messaging

> Goal: injection ปลอดภัย, messaging มี boundary

1. content scripts `run_at`/`matches` scoped — ไม่ inject ทุก page โดยไม่จำเป็น
2. `world: "MAIN"` ใช้เท่าที่จำเป็น, DOM access ผ่าน isolated world ก่อน
3. `chrome.runtime.onMessage` validate sender/origin — ไม่ trust message จาก page context
4. ไม่มี `eval`/`new Function`, ไม่ inject remote code (MV3 ห้าม)

### 4. Check CSP, Storage, And Security

> Goal: extension context ปลอดภัย

1. `content_security_policy.extension_pages` ตั้งค่า — no `unsafe-eval`/`unsafe-inline`
2. `chrome.storage` ใช้แทน localStorage ใน service worker; sensitive data ไม่เก็บ plaintext
3. ทำ `/check-source-maps` กับ packaged build — ห้าม leak `.map`/source ใน dist ที่ publish
4. external resources ผ่าน HTTPS เท่านั้น, SRI ถ้า inject third-party

### 5. Check Performance And Lifecycle

> Goal: extension ไม่หนัก browser

1. service worker ไม่ hold state ใน memory (SW ถูก kill ได้) — persist ผ่าน storage
2. content script size เล็ก, ไม่ block page load
3. alarm/event-driven แทน polling loop
4. popup/options lazy-load, cleanup listeners

### 6. Check Store Readiness

> Goal: พร้อม submit ไม่โดน reject

1. icons ครบขนาด (16/32/48/128), `name`/`description`/`version` ถูก
2. privacy practices — data collection disclosures ตรงกับ permission usage
3. `minimum_chrome_version`/`browser_specific_settings` ตั้งถูก per target

### 7. Report

> Goal: ส่งมอบ findings

1. ทำ `/report` — findings ต่อ dimension พร้อม severity + evidence
2. ทำ `/suggest-next-action`

## Severity

- `Critical`: remote code execution path (eval/remote script inject), plaintext sensitive storage, `<all_urls>` + unvalidated message handlers
- `High`: permissions กว้างเกิน, MV2 ที่ต้อง migrate, missing CSP, world:"MAIN" โดยไม่จำเป็น
- `Medium`: content script หนัก, memory-state ใน SW, store metadata ไม่ครบ
- `Low`: icon sizes, description quality, minor lifecycle issues

## Rules

- Report only — ห้ามแก้ไขใน skill นี้
- ทุก finding มี evidence — file path, manifest field, หรือ code line
- UI/page-level issues → `/review-frontend`; supply-chain/deps → `/review-security`
- ตรวจทุก target browser ที่ declare ไว้

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix → `/deep-review-then-fix`

### Fix Steps

1. permissions: trim เป็น minimal, ย้ายไป `optional_permissions`, scope `host_permissions`
2. MV3 migration: service worker, `action` API, `declarativeNetRequest` แทน webRequest blocking
3. messaging: validate `sender.id`/`sender.url`, token-gated handlers
4. storage: ย้าย sensitive data ออกจาก plaintext, ใช้ `chrome.storage.session` สำหรับ temp secrets
5. perf: persist SW state, lazy-load content scripts, event-driven alarms
6. verify: load unpacked + test บนทุก target browser, store lint (`web-ext lint`)
- ใช้ `/review-performance` ถ้าจำเป็น


## Expected Outcome

- ตาราง findings ต่อ dimension พร้อม severity และ evidence
- รู้ permission surface, messaging security, store readiness
- Next action ชัดเจนผ่าน `/suggest-next-action`
