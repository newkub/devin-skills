---
name: review-desktop-app-setup-auto-update
description: Setup auto-update + packaging — signing, update channel, rollback, release flow
argument-hint: "[platform-or-scope]"
related:
  - review-desktop-app
  - run-build
  - report-before-after
  - ask-me
---

## Goal

สร้าง auto-update + packaging capability จากศูนย์ตาม findings ของ `/review-desktop-app` — เมื่อ app ไม่มี update path เลย

## Scope

- ใช้เมื่อ findings คือ "ไม่มี auto-update/packaging" — fix existing config ทำใน parent `## Fix`
- ครอบคลุม: code signing, update server/channel, delta updates, rollback strategy, installer

## Execute

### 1. Choose Update Strategy

> Goal: strategy ตรง platform + constraints — parent Execute §3 references `../../references/packaging-updates.md`

1. Electron → `electron-updater`/Squirrel/Electron Forge publish; Tauri → built-in updater; native → platform mechanisms
2. update channel — latest/beta channels, staged rollout capability
3. signing — certs ที่จำเป็น (macOS notarization, Windows cert, Linux repo signing)

### 2. Implement

> Goal: update flow ทำงาน end-to-end

1. update manifest/feed — versioned artifacts + signatures, hosted endpoint
2. app-side — update check interval, download verify signature/hash, install UX (prompt vs silent)
3. rollback — previous version retention หรือ rollback package path

### 3. Verify

> Goal: update flow พิสูจน์ได้

1. test update: old version → new version บนทุก target platform (VM/simulator ok)
2. rollback path test — bad update recoverable
3. `/run-build` artifacts signed + verify signatures
4. `/report-before-after` — update capability checklist

## Rules

- signing required ก่อน release — unsigned auto-update = attack vector
- update channel config ใน env/config ไม่ hardcode — `/no-hard-code`
- destructive update flows (replace app) test บน copy/VM ก่อน
- user confirm ก่อน enable auto-download (UX/bandwidth impact)

## Expected Outcome

- Signed update pipeline: manifest → verify → install → rollback
- Update flow tested on all target platforms
