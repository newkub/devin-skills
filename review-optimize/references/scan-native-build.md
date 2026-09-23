---
name: scan-native-build
description: Scan native/build profiles — release flags, runtime target, dev-only work in prod
---

# Scan Native And Build Profile

## Goal

native binary และ build output ได้ optimization เต็มที่ตามความเสี่ยงที่ยอมรับ

## Checks

1. Release profile — `opt-level`, `lto` (thin vs fat), `codegen-units`, `panic`, `strip` — เช็ค trade-off build time vs runtime
2. Build target — `build.target` ตรง runtime จริง (WebView2 = Chromium evergreen, WKWebView 16+ = es2022+)
3. Native command cost — `invoke` handlers ที่ enumerate/refresh มากกว่าที่ต้อง (full process refresh vs specifics, sync work บน IPC thread)
4. Dev-only work ใน prod path — `debug_assertions`, console taps, log buffers, dev tools init
5. Startup blocking work — sync DB init/migrations ใน setup ก่อน window แสดง, blocking file reads
6. Parallelism — sequential init ที่ independent, single-job limits (`CARGO_BUILD_JOBS=1`) ที่เลือกไว้เพื่อ memory — เข้าใจเหตุผลก่อนแก้
7. Binary size — embedded assets, unused plugins/features, `strip` symbols
8. Hot path allocations — per-event string concat, buffer copies, clone ใน loop

## Severity

- Critical: sync blocking work บน main thread ตอน startup, release profile ปิด optimization
- High: full-refresh native polls, dev-only overhead ใน prod
- Medium: codegen-units/LTO tuning, binary size trimming
- Low: allocation micro-tuning บน cold path
