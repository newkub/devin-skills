---
name: follow-lib-native-sdk
description: Native SDK (@native-sdk/cli) desktop apps — TS + .native markup, compiled native, no JS runtime
argument-hint: "[feature-or-component]"
related:
  - follow-create-desktop-tauri
  - follow-lib-gpui-kit
  - follow-lang-typescript
  - follow-lang-zig
  - follow-create-mobile
  - follow-my-techstack
  - improve
  - deep-research
  - follow-devin-global-skills

---

## Goal

สร้างและดูแล native desktop application ด้วย Native SDK (Vercel Labs) อย่างถูกวิธี — TypeScript app logic ใน `src/core.ts` + declarative markup ใน `.native` files แล้ว compile เป็น native code ล่วงหน้า (AOT) โดย binary ที่ ship **ไม่มี browser/WebView/JS runtime/interpreter**

## Scope

ใช้เมื่อต้องการ desktop app ที่เป็น native จริง (Metal/Direct2D/software renderer) ไม่ใช่ webview shell — CLI `native`, เทมเพลต `ts-core`/`zig-core`, app model (TEA/Elm), markup, Cmd/Sub effects, persistence/SQLite, automation, testing, packaging, security

- Boundary: Tauri = Rust backend + web frontend (webview shell) → `/follow-create-desktop-tauri`; GPUI Kit = Rust-only components/entity model → `/follow-lib-gpui-kit`; Native SDK = TS+markup AOT, ไม่มี runtime ใน binary
- Mobile (iOS/Android) เป็น **Experimental** — verified บน simulator/emulator เท่านั้น; desktop คือ mature surface
- WebViews ยังใช้ได้เป็น optional path (embed เว็บ/host frontend เดิม) — ไม่ใช่ default path

## Facts (verified 2026-10-13)

- Repo `vercel-labs/native` (Apache-2.0, ~7.8k stars, active); npm `@native-sdk/cli` 0.10.1; docs ที่ native-sdk.dev
- ต้องมี **Zig 0.16.0** (CLI download เข้า `~/.native/toolchains/` พร้อม checksum) + **Node 24+** สำหรับ TS scaffold/checker — Node ใช้ตอน build/dev เท่านั้น ไม่อยู่ใน binary
- Platforms: macOS (primary, Metal), Windows (Direct2D/DirectWrite + software fallback), Linux (software renderer ผ่าน blit); iOS/Android host-tier (experimental, multi-window เฉพาะ desktop)
- ระบบ state เป็น TEA: `Model` readonly record + `Msg` union + `update(model,msg): Model | [Model, Cmd<Msg>]`; view derive จาก model ผ่าน markup
- ทุก app embed automation server (file-based protocol) — snapshot/drive/screenshot ได้เมื่อ build ด้วย `-Dautomation=true`
- `native skills get <core|native-ui|ts-core|ts-services|automation|zig>` คืน deep content จาก CLI ติดตั้งแล้ว (discovery stub ผ่าน `npx skills add vercel-labs/native`)

## Execute

### 1. Setup & Scaffold

> Goal: ได้ project พร้อม `native dev`

1. `npm install -g @native-sdk/cli` แล้ว `native version` (ถ้า npm พังบนเครื่องนี้ — ดู Rules §6)
2. สร้าง app:
   ```sh
   native init my_app                      # ts-core default: app.json + src/app.native + src/core.ts
   native init my_app --template zig-core  # src/main.zig + src/tests.zig (core เป็น Zig)
   native init my_app --frontend vite      # path ทางเลือก: host web frontend (next|vite|react|svelte|vue)
   native init --full                      # เพิ่ม app-owned build files + .github/workflows/ci.yml
   ```
3. ตรวจ toolchain: `native doctor`; validate manifest: `native validate app.json`
4. Build graph อยู่ใต้ `.native/build/` — ห้ามแก้ يدوي; ตรวจ language จาก files (`src/main.zig` = zig-core)

### 2. Core (TypeScript TEA)

> Goal: state + messages + effects ถูกต้องตาม compiled subset

1. `src/core.ts` declares `Model` (readonly record), `Msg` (discriminated union), `initialModel()`, `update(model, msg)` — subset เต็มใน `best-practices/ts-core-subset.md`
2. Effects ผ่าน `Cmd` vocabulary: `now/delay/fetch/readFile/writeFile/clipboard*/spawn/showNotification/quitApp/persist/store.set/db.query/Cmd.request/Cmd.batch/...`; subscriptions ผ่าน `subscriptions(model): Sub<Msg>` เช่น `Sub.timer("tick",1000,"tick")`
3. งานนอก subset (regex, JSON, Map/Set, Date, classes, child_process) → ย้ายเข้า `src/services/` (full ordinary TS, รันบน supervised carrier `<app>_services`) แล้วเรียกผ่าน `Cmd.request(name,payload,{key,ok,err})` หรือ typed client จาก `@native-sdk/services`
4. Text เป็น bytes — ใช้ `utf8Bytes`/`asciiBytes` จาก `@native-sdk/core`; byte offsets ไม่ใช่ code units
5. Modules: relative imports ภายใต้ `src/` พร้อม filename จริง, ห้าม `../`, ห้าม cycles, ห้าม `export default`

### 3. Markup (`.native`)

> Goal: UI declarative ที่ bind กับ model

1. Elements หลัก: `row column stack panel card scroll list grid tabs table accordion alert dialog drawer sheet text badge button toggle list-item checkbox slider progress text-field search-field combobox markdown image avatar terminal chart status-bar separator` — เต็มรายการใน `best-practices/native-ui-markup.md`
2. Bindings `{expr}` (attribute ละ expression เดียว), events `on-press="increment"` / `on-press="toggle:{t.id}"`, control flow `<for each= key= as=>` `<if test=>/<else>`
3. Expression language จำกัด: `+ - * / == != and or not ++` + function lib 17 ตัว (`upper lower trim min max abs round floor ceil plural pad fixed thousands percent date time datetime`) — ไม่มี method call/ternary
4. Layout: `gap padding grow width height min/max-width main cross columns`; component reuse: `<template name= args=>` + `<use template=>` + `<slot/>` + `<import src="src/components/...">`
5. Theme ผ่าน token names (`background surface text text_muted border accent destructive success warning info focus_ring scrim disabled`) — pack `house`/`geist` ใน `app.json` + `themeState(model)`

### 4. Data & Native Platform

> Goal: persist/state/native features ผ่าน capability declarations ใน `app.json`

1. Capability `persist` → `Cmd.persist()` (debounce 500ms, snapshot.nsd + .bak, `migrate(snapshot, fromVersion)`)
2. Capability `store` → key-value: `Cmd.store.set/get/delete/scan/setMany` (key ≤512B, value ≤1MiB)
3. Capability `sqlite` → `app.db` WAL; migrations ใน `src/schema/NNNN_name.sql` + `native db new-migration|status|reset --yes`; named queries ใน `src/queries.sql` (`-- name: x :live`) → generated `Cmd.qName(params, route)` + `Sub.qName`; bounds 64 params/1MiB
4. Windows: `windows(model): readonly WindowDescriptor[]` (scene model, ≤16, `close_policy quit|hide` — hide บน Windows ต้อง `"tray"` capability); menus ≤16/128 items; shortcuts ≤64; tray = macOS/Windows เท่านั้น (Linux `UnsupportedService`)
5. File paths นอก app roots ต้องมี `filesystem` permission; external links ต้อง allowlist ใน security policy

### 5. Test & Automate

> Goal: ยืนยัน behavior จริงทั้ง human และ agent loop — รายละเอียดใน `best-practices/automation-testing.md`

1. `native check [--strict]` (type-check core subset) → `native test` (TS unit ผ่าน `@native-sdk/core/testing` `NativeApp.start()`: `findWidget/click/setText/menu/frame/snapshot/effects/verifyReplay`)
2. Automation: `native build -Dautomation=true` แล้ว protocol ไฟล์ใต้ `.zig-cache/native-sdk-automation/` (`snapshot.txt`, `accessibility.txt`, `screenshot-<label>.png`, `command-<n>.txt` queue) — CLI: `native automate list|snapshot|screenshot|reload|assert [--timeout-ms]|widget-click|menu-command|shortcut|bridge '<json>'`
3. Record/replay: `NATIVE_SDK_SESSION_RECORD=1` / `REPLAY=1`; assert ใช้ regex subset (no groups/alternation)
4. CI tiers จาก `--full`: tier1 `-Dplatform=null` unit; tier2 Linux Xvfb + `-Dautomation=true`; tier3 macOS GUI — golden screenshots byte-compare ได้เฉพาะ same runner image

### 6. Package & Ship

> Goal: artifact พร้อม distributive — รายละเอียดใน `best-practices/packaging-platform-security.md`

1. `native build` → ReleaseFast ที่ `zig-out/bin/`; `native package --target macos|linux|windows|ios|android`
2. macOS: `.app` + DMG (`--archive`), signing `--signing adhoc|identity --identity --entitlements`, notarize `--notarize --notary-profile` (macOS เท่านั้นที่/sign ได้)
3. Icons: one square `assets/icon.png/.svg` → ทุก format อัตโนมัติ; release-time updates: own signed Ed25519 updater (`native update keygen|sign`, manifest `updates{feed_url,public_key}` HTTPS, macOS เท่านั้น)

## Rules

### 1. No-Runtime Reality

- binary ที่ ship ไม่มี JS runtime/interpreter — `src/core.ts` ถูก compile AOT เท่านั้น ห้ามคาดหวัง dynamic import, eval, npm runtime ใน core
- ถ้าต้องใช้ ordinary TS เต็มรูปแบบ → services (`src/services/`) ไม่ใช่ core

### 2. Subset Discipline

- core.ts ใช้ได้เฉพาะ compiled subset (อ่าน `best-practices/ts-core-subset.md` ก่อนเขียน) — เขียนผิด checker จะไม่ผ่าน ไม่ใช่ runtime error
- memory เป็น per-dispatch arena 1 MiB — ห้ามถือ state ข้าม dispatch นอก Model

### 3. Platform Honesty

- iOS/Android = experimental — ห้ามขายเป็น production mobile; multi-window เฉพาะ desktop; tray ไม่มีบน Linux; Chromium/CEF มีเฉพาะ macOS; registered fonts บน mobile = unverified
- Windows renderer เป็น early development สำหรับ packaging — ทดสอบบนเครื่องจริงก่อน ship

### 4. Automation & Test Gate

- ทุก feature ต้องผ่าน `native check` + `native test` ก่อน claim เสร็จ; agent-driven verification ใช้ `native automate` snapshot/assert ไม่ใช่ตาเปล่า
- ห้ามแก้ `.native/build/` หรือ generated artifacts โดยตรง

### 5. Composition

- webview-shell app (frontend เดิม + Rust backend) → `/follow-create-desktop-tauri`; Rust-native GUI → `/follow-lib-gpui-kit`; skill นี้ครอบคลุม Native SDK เท่านั้น — deep content ปัจจุบันของ SDK อ่านผ่าน `native skills get <name>` (SSOT ฝั่ง vendor)

### 6. Broken-npm Escape (เครื่องนี้)

- `@native-sdk/cli` ติดตั้งผ่าน npm ไม่ได้เมื่อ bundled npm ของ mise node พัง (npm-cli.js หาย) และ `bunx @native-sdk/cli` ก็ fail ("could not find skills/ or skill-data/ near the native-sdk executable") — ใช้ docs dumps ที่ `AppData\Local\Temp\nsd\*.md` (mirror 47 หน้าจาก native-sdk.dev ผ่าน Lightpanda) เป็น reference จนกว่า npm จะแก้ (`mise uninstall node@26.11.1 && mise install node@26.11.1` + trim PATH ให้ <8191 chars)

## Expected Outcome

- app ใหม่จาก `native init` run ได้ด้วย `native dev` และ build ได้ด้วย `native build`
- core.ts markup ถูก subset, effects เป็น Cmd/Sub, services แยกงานเต็ม TS ถูกที่
- test tiers ผ่าน + `native automate snapshot/assert` ยืนยัน behavior จริง
- user เข้าใจ boundary: native AOT ไม่มี runtime, mobile experimental, platform caveats ชัดเจน
