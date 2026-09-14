---
name: review-desktop-app
description: Review desktop app — window, tray, IPC security, packaging, auto-update, platform conventions
argument-hint: "[scope]"
related:
  - review-mobile
  - review-frontend
  - review-security
  - review-performance
  - check-source-maps
  - follow-create-desktop-tauri
  - deep-review
  - deep-review-then-fix
  - use-subagents
  - report
  - suggest-next-action
---

## Goal

Review desktop app (Tauri/Electron/native) — window management, system tray/menus, IPC security, packaging/installers, auto-update, platform conventions (Windows/macOS/Linux), resource usage — report-only

## Scope

ใช้เมื่อ project เป็น desktop app — ตรวจและรายงาน ไม่แก้ไข; แก้ findings → `/deep-review-then-fix`; mobile ใช้ `/review-mobile`; web frontend ใช้ `/review-frontend`; เบื้องหลัง desktop conventions ดู `deep-review/references/platform-mobile-desktop.md` (Desktop Review section)

## Execute

### 1. Detect Desktop Stack

> Goal: รู้ framework และ targets

1. ตรวจ manifest: Tauri (`tauri.conf.json`, `src-tauri/`), Electron (`electron` dep, `main.js`), native (Qt/.NET/Swift)
2. ระบุ target platforms — Windows/macOS/Linux — และ installer formats (msi/dmg/AppImage/deb)
3. อ่าน desktop conventions — ดู `deep-review/references/platform-mobile-desktop.md`

### 2. Check Window And Shell

> Goal: window behavior ถูกต้องตาม platform

1. window state persistence — size/position restore, multi-monitor
2. native menus, keyboard shortcuts, system tray, notifications, clipboard integration
3. deep links / protocol handlers registration
4. titlebar/theme integration ตาม platform conventions

### 3. Check IPC And Security

> Goal: renderer↔native boundary ปลอดภัย

1. IPC surface minimal — Tauri `allowlist`/`capabilities`, Electron `contextIsolation: true`, `nodeIntegration: false`
2. CSP ตั้งค่า, remote content ไม่ load ใน privileged context
3. secrets/filesystem access ผ่าน scoped APIs — ไม่เปิด full FS/shell
4. auto-update channel ใช้ signed updates เท่านั้น
5. ทำ `/check-source-maps` กับ packaged build — Electron/Tauri dist ห้าม leak `.map` files หรือ source code

### 4. Check Packaging And Updates

> Goal: distribution ปลอดภัยและ rollback ได้

1. code signing ทุก platform (Authenticode/Apple notarization)
2. installer size, silent install, per-user vs system install
3. auto-update — delta updates, rollback path, update failure recovery
4. crash reporting — opt-in, ไม่ leak PII

### 5. Check Lifecycle And Offline

> Goal: app รอด desktop lifecycle จริง

1. minimize-to-tray vs quit semantics ตรง platform convention
2. offline behavior — local data persistence, queued ops
3. single-instance handling, second-instance handoff (argv, deep link)
4. file associations — register/unregister ถูกต้อง

### 6. Check Performance And Resources

> Goal: ไม่กิน resource เกินตัว

1. startup time, idle memory/CPU, binary/installer size budget
2. background work เมื่อ minimized — ไม่ burn CPU/GPU
3. webview/GPU memory pressure สำหรับ WebView-based apps

### 7. Report

> Goal: ส่งมอบ findings

1. ทำ `/report` — findings ต่อ dimension พร้อม severity + evidence
2. ทำ `/suggest-next-action`

## Severity

- `Critical`: IPC เปิด full FS/shell, `nodeIntegration: true`, unsigned auto-update, app crash ตอน launch บน target platform
- `High`: ไม่มี code signing, ไม่มี rollback path, window state หายทุก launch, leak `.map`/source ใน dist
- `Medium`: tray/menu/shortcuts ไม่ตาม platform convention, ไม่มี single-instance, deep links ไม่ register
- `Low`: installer size เกิน budget, idle resource usage, cosmetic shell issues

## Rules

- Report only — ห้ามแก้ไขใน skill นี้
- ทุก finding มี evidence
- ใช้ /use-subagents ถ้า scope ใหญ่
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /review-frontend สำหรับ shared UI code
- ใช้ /review-security สำหรับ IPC/supply-chain deep-dive
- ใช้ /review-performance สำหรับ perf deep-dive
- ใช้ /follow-create-desktop-tauri เป็น platform guide ตอนแก้ Tauri findings

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps

1. window/shell → state persistence, menus, shortcuts, tray fixes ตาม platform
2. IPC security → ลด allowlist, เปิด contextIsolation, เพิ่ม CSP
3. packaging → signing, installer, auto-update + rollback
4. lifecycle → single-instance, tray semantics, file associations
5. verify: run บน target platforms จริง + `/run-test` ผ่าน

## Expected Outcome

- desktop findings ครบทุก dimension พร้อม severity
- platform convention gaps (Windows/macOS/Linux) ระบุชัด
- IPC/security findings มี evidence ระดับ config/code
- report ส่งมอบพร้อม actionable recommendations
