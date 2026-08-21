---
name: review-platform
description: Review platform ครอบคลุม mobile, desktop, CLI/TUI, SSR, state management, routing, PWA
related:
  - scan-codebase
  - deep-analyze
  - update-create-review-cli
  - run-review
  - deep-validate
  - validate
  - report
  - report-table
  - suggest-next-action
  - implement-all
---

## Goal

Review platform ครอบคลุมทุก dimension ของ platform พร้อม aggregate findings และ review score

## Scope

platform review สำหรับ: mobile app, desktop app, CLI/TUI, server-side rendering, state management, routing, PWA

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ platform setup ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ platform setup
2. ระบุ mobile framework, desktop framework, CLI framework, SSR setup, state management library, routing library, PWA setup
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/update-create-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
5. รัน `bun --filter @booking/tools-review review:json` เพื่อดึง review report พร้อม metrics
6. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด

### 2. Mobile Review

Review mobile app ครอบคลุม Capacitor plugins, platform-specific code, offline support, native bridge patterns

> Goal: ครอบคลุมทุก mobile dimension

1. ตรวจสอบ Capacitor plugin usage, platform detection, และ native bridge patterns
2. ตรวจสอบ offline support, push notification handling, และ biometric auth
3. ตรวจสอบ mobile UX: touch targets, safe area, และ responsive layout
4. Critical: native bridge พัง, plugin ที่จำเป็นหายไป, app crash บน platform
5. High: ไม่มี offline support, push notification พัง, ไม่มี platform detection

### 3. Desktop Review

Review desktop app ครอบคลุม Tauri/Electron patterns, native APIs, auto-update, IPC security, platform compatibility

> Goal: ครอบคลุมทุก desktop dimension

1. ตรวจสอบ native API usage, IPC patterns, และ security boundaries ระหว่าง main/renderer processes
2. ตรวจสอบ window management, multi-window patterns, และ window state persistence
3. ตรวจสอบ auto-update mechanism, update signature verification, และ rollback capability
4. ตรวจสอบ file system access, path validation, และ sandbox restrictions
5. ตรวจสอบ platform-specific code, conditional compilation, และ platform feature detection
6. ตรวจสอบ offline support, local data persistence, และ sync conflict resolution
7. ตรวจสอบ desktop UX: system tray, notifications, keyboard shortcuts, clipboard integration
8. Critical: IPC ไม่มี validation, file system access ไม่จำกัด, ไม่มี sandbox, auto-update ไม่ verify
9. High: ไม่มี platform-specific handling, native integration พัง, ไม่มี auto-update rollback, ไม่มี offline fallback

### 4. CLI Review

Review CLI และ TUI tools ครอบคลุม commands, options, help text, terminal UI, user experience

> Goal: ครอบคลุมทุก CLI/TUI dimension

1. ตรวจสอบ command structure, options, flags, และ argument parsing
2. ตรวจสอบ help text completeness, error messages, และ exit codes
3. ตรวจสอบ interactive mode, autocomplete, และ configuration file support
4. ตรวจสอบ TUI layout, component composition, resize handling, และ focus management
5. ตรวจสอบ TUI color support, terminal compatibility, และ rendering performance
6. Critical: command พัง, command ที่จำเป็นหายไป, exit code ผิด, TUI layout พัง, input ไม่ถูกจัดการ, terminal crash
7. High: ไม่มี help text, error message สับสน, ไม่มี required option, rendering glitch, ไม่รองรับ resize, focus พัง

### 5. SSR Review

Review server-side rendering ครอบคลุม SSR implementation, hydration, SSR-compatible code, streaming

> Goal: ครอบคลุมทุก SSR dimension

1. ตรวจสอบ SSR implementation, server entry, และ render-to-string patterns
2. ตรวจสอบ hydration correctness, hydration mismatch, และ client takeover
3. ตรวจสอบ SSR-compatible code, browser API guards, และ server-only imports
4. ตรวจสอบ streaming SSR, suspense boundaries, และ SSR error handling
5. Critical: hydration mismatch, SSR พัง, server-only code ใน client bundle
6. High: ไม่มี hydration, ไม่มี SSR error handling, browser API ไม่มี guard

### 6. State Management Review

Review state management ครอบคลุม store organization, reactivity, data flow

> Goal: ครอบคลุมทุก state management dimension

1. ตรวจสอบ store organization, state shape, และ store boundaries
2. ตรวจสอบ reactivity patterns, unnecessary re-renders, และ derived state
3. ตรวจสอบ side effect management, state synchronization, และ persistence
4. Critical: state corruption, race condition, data loss จาก state mutation
5. High: unnecessary re-render บน hot path, ไม่มี store boundary, reactivity พัง

### 7. Routing Review

Review routing ครอบคลุม route definitions, navigation guards, lazy loading, params validation

> Goal: ครอบคลุมทุก routing dimension

1. ตรวจสอบ route definitions, route structure, และ route naming conventions
2. ตรวจสอบ navigation guards, auth checks, และ permission enforcement
3. ตรวจสอบ lazy loading, code splitting, และ route-level loading states
4. ตรวจสอบ route params validation, type safety, และ route middleware patterns
5. Critical: ไม่มี auth guard, route พัง, ไม่มี params validation
6. High: ไม่มี lazy load, guard ไม่สอดคล้อง, ไม่มี loading state

### 8. PWA Review

Review PWA compliance ครอบคลุม service worker, web manifest, offline support, install prompt, background sync

> Goal: ครอบคลุมทุก PWA dimension

1. ตรวจสอบ service worker: registration, lifecycle, update strategy, cache versioning
2. ตรวจสอบ web manifest: manifest fields, icons, theme color, display mode, start URL
3. ตรวจสอบ offline support: offline fallback page, cache strategy, offline data sync
4. ตรวจสอบ install prompt: beforeinstallprompt event, install button UX, install criteria
5. ตรวจสอบ background sync: sync registration, sync event handling, retry logic
6. ตรวจสอบ push notifications: permission flow, notification display, action handling
7. ตรวจสอบ PWA-to-native bridge: Capacitor plugin usage, platform-specific code, native feature access
8. ตรวจสอบ PWA performance: load time on mobile, cache hit ratio, service worker overhead
9. Critical: ไม่มี service worker บน production, offline experience พัง, ไม่มี web manifest
10. High: cache เก่าหลัง update, ไม่มี offline fallback, ไม่จัดการ push notification permission

### 9. Validate Findings

ตรวจสอบและ validate issues จากทุก section

> Goal: Issues ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low

### 10. Report

รายงานผล review ในรูปแบบตาราง

> Goal: รายงาน aggregate findings พร้อม actionable recommendations

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง aggregate findings จากทุก section
3. ทำ `/suggest-next-action`

### 11. Implement All

ตรวจสอบว่า findings ที่พบสามารถ implement ได้จริง

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

1. ทำ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings ใน report

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี mobile app ให้ข้าม Section 2
- ถ้า project ไม่มี desktop app ให้ข้าม Section 3
- ถ้า project ไม่มี CLI หรือ TUI ให้ข้าม Section 4
- ถ้า project ไม่มี SSR ให้ข้าม Section 5
- ถ้า project ไม่มี state management ให้ข้าม Section 6
- ถ้า project ไม่มี routing ให้ข้าม Section 7
- ถ้า project ไม่มี PWA setup ให้ข้าม Section 8

### 2. Severity Classification

- Critical: ระบบพัง, data loss, security hole — ดูรายละเอียดในแต่ละ section
- High: ฟังก์ชันหลักพัง, ขาด feature สำคัญ — ดูรายละเอียดในแต่ละ section
- Medium: inconsistent UX pattern, missing safe area, inconsistent flag naming, suboptimal streaming, inconsistent state pattern, suboptimal code splitting, incomplete manifest fields
- Low: cosmetic improvement, naming convention, minor layout issue, minor routing improvement, minor manifest improvement

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Health Score

- คำนวณ review score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก platform section
- รายงาน recommended actions พร้อม priority
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
