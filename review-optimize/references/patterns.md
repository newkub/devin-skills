# Optimization Patterns Catalog

> Quick lookup: symptom → recipe → fix guide — ใช้หลัง scan เพื่อ map findings เข้า fix เร็วๆ

## Render And DOM

| Symptom | Recipe | Guide |
|---------|--------|-------|
| DOM nodes โตตาม data | threshold virtualization + top/bottom spacers | `fix-optimize-render.md` |
| `Math.max(...arr)` stack overflow | iterative loop | `fix-optimize-render.md` |
| density view ต่อ row | bucket ≤ fixed max + index map กลับ | `fix-optimize-render.md` |
| layout thrash scroll/animation | `content-visibility`, batch read→write, `transform`/`opacity` animations | `scan-css-layout.md` |

## Streaming And Reactive

| Symptom | Recipe | Guide |
|---------|--------|-------|
| setState ต่อ token | shared flusher — buffer + flush ต่อ ~50ms, `done()` ใน `finally` | `fix-optimize-streaming.md` |
| re-parse ทั้ง doc ต่อ delta | parse ต่อ flush, memoize derived trees | `fix-optimize-streaming.md` |
| persist ต่อ mutation | debounce write + flush-on-exit | `fix-optimize-io.md` |

## Polling And Startup

| Symptom | Recipe | Guide |
|---------|--------|-------|
| `invoke` ค่าเดิมทุก tick | cached promise helper + non-native fallback | `fix-optimize-polling.md` |
| poll ตอน hidden | `visibilityState` gate + refresh-on-visible | `fix-optimize-polling.md` |
| sequential `await` init | `Promise.all` + คง dependent chain | `fix-optimize-polling.md` |
| services ก่อน first paint | `requestIdleCallback` defer + timeout cap | `fix-optimize-polling.md` |

## Memory And Concurrency

| Symptom | Recipe | Guide |
|---------|--------|-------|
| heap โตตลอด session | cap + LRU/TTL eviction, cleanup-on-scope-death | `fix-optimize-memory.md` |
| listener leak ต่อ mount | symmetric cleanup ทุก exit path | `fix-optimize-memory.md` |
| CPU work บน main thread | worker/`spawn_blocking` + transferable payloads | `fix-optimize-concurrency.md` |
| sequential awaits นอก boot | `Promise.all` + bounded parallelism | `fix-optimize-concurrency.md` |
| lock ข้าม await | extract data → drop guard → await | `fix-optimize-concurrency.md` |

## Bundle, Assets, Native

| Symptom | Recipe | Guide |
|---------|--------|-------|
| full-lib import | `lib/core` + registered subset, shared instance เดียว | `fix-optimize-bundle-native.md` |
| fonts ทุกตัวตอน boot | UI font eager, feature fonts idle import | `fix-optimize-assets.md` |
| icon JSON ทั้ง set | per-icon imports / tree-shaken components | `fix-optimize-assets.md` |
| release build ไม่ optimize | `codegen-units=1` + thin LTO + `strip` | `fix-optimize-bundle-native.md` |
| legacy build target | `es2022`+ ตาม modern WebView/runtime จริง | `fix-optimize-bundle-native.md` |

## I/O And Storage

| Symptom | Recipe | Guide |
|---------|--------|-------|
| write ต่อ keystroke/token | debounce + flush-on-idle/blur/exit | `fix-optimize-io.md` |
| N+1 queries | `IN (...)`/join/batch loader | `fix-optimize-io.md` |
| sync I/O ใน handler | async/`spawn_blocking`/worker | `fix-optimize-io.md` |
| re-read static files | cache + mtime check | `fix-optimize-io.md` |
