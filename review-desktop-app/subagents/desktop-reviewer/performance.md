# Performance Checklist — review-desktop-app

## Startup Time

- [ ] cold start ≤3s to interactive — measure on mid-range hardware
- [ ] warm start faster — cached/background process vs full init
- [ ] splash screen — only during real init, not artificial delay
- [ ] lazy init — non-critical services deferred past first paint
- [ ] main process startup — Electron main/Rust init not blocking UI

## Idle Resource Usage

- [ ] idle CPU <1% — minimized app doesn't burn cycles
- [ ] idle memory — <200MB for lightweight apps, justified for heavy ones
- [ ] GPU when idle — no continuous compositing when hidden
- [ ] background timers — `setInterval`/`setTimeout` paused when hidden
- [ ] WebView memory — released tabs/pages, not accumulated

## Memory Management

- [ ] memory leaks — heap growth over time profiled, not monotonic
- [ ] renderer processes — closed windows/pages actually freed
- [ ] cache bounds — disk/memory caches capped, eviction policy
- [ ] large data — virtualized lists, not full DOM/structure dumps
- [ ] IPC payload size — large transfers streamed, not single-shot

## Background Work

- [ ] minimized throttling — reduced activity when hidden/tray
- [ ] background tasks — OS-appropriate scheduling, not constant polling
- [ ] sync/refresh intervals — user-configurable, not aggressive defaults
- [ ] wake locks — only when needed, released promptly
- [ ] disk I/O — batched writes, not constant small flushes

## Rendering Performance

- [ ] frame rate — 60fps scrolling/animations, no jank
- [ ] paint cost — complex shadows/blurs minimized on low-end
- [ ] layout thrashing — read/write DOM patterns avoid forced sync layout
- [ ] canvas/WebGL — context cleanup, not leaked on page switches
- [ ] font rendering — subset fonts, not full CJK/font files loaded

## Binary And Disk

- [ ] binary size — Electron ~150-250MB, Tauri ~10-30MB, native smaller
- [ ] installer size — download reasonable, delta updates preferred
- [ ] disk footprint — installed size vs functionality justified
- [ ] startup I/O — minimize file reads, config parsing on launch
- [ ] bundled resources — only needed assets shipped

## Network Efficiency

- [ ] request batching — API calls combined where possible
- [ ] caching — HTTP cache, disk cache for repeat resources
- [ ] compression — gzip/brotli on API payloads
- [ ] prefetch — predictive loading for likely navigation
- [ ] offline-first — local data as source where applicable

## Power Consumption

- [ ] battery impact — idle app doesn't prevent sleep/drain battery
- [ ] high-power GPU — discrete GPU only when needed, not always-on
- [ ] energy profiler — macOS Activity Monitor / Windows power usage checked
- [ ] background efficiency — energy impact "Low" on macOS App Nap
- [ ] thermal — sustained load doesn't fan-spin unnecessarily

## Detection

- profiling — Activity Monitor, Task Manager, `htop` for CPU/RAM/energy
- Electron — `--trace-warnings`, process explorer, `chrome://tracing`
- Tauri — Rust profiling (`cargo flamegraph`), WebView devtools
- metrics — startup time, idle CPU%, memory growth over 24h

Severity: idle CPU >5% / battery drain = High, memory leak = High, startup >5s = Medium, bloated binary = Low–Medium
