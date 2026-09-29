# Optimization Patterns Catalog

> Quick lookup: symptom → recipe — ใช้หลัง scan เพื่อ map findings เข้า fix เร็วๆ

## Render And DOM

| Symptom | Recipe |
|---------|--------|
| DOM nodes โตตาม data | threshold virtualization + top/bottom spacers |
| `Math.max(...arr)` stack overflow | iterative loop |
| density view ต่อ row | bucket ≤ fixed max + index map กลับ |
| layout thrash scroll/animation | `content-visibility`, batch read→write, `transform`/`opacity` animations |

## Streaming And Reactive

| Symptom | Recipe |
|---------|--------|
| setState ต่อ token | shared flusher — buffer + flush ต่อ ~50ms, `done()` ใน `finally` |
| re-parse ทั้ง doc ต่อ delta | parse ต่อ flush, memoize derived trees |
| persist ต่อ mutation | debounce write + flush-on-exit |

## Polling And Startup

| Symptom | Recipe |
|---------|--------|
| `invoke` ค่าเดิมทุก tick | cached promise helper + non-native fallback |
| poll ตอน hidden | `visibilityState` gate + refresh-on-visible |
| sequential `await` init | `Promise.all` + คง dependent chain |
| services ก่อน first paint | `requestIdleCallback` defer + timeout cap |

## Memory And Concurrency

| Symptom | Recipe |
|---------|--------|
| heap โตตลอด session | cap + LRU/TTL eviction, cleanup-on-scope-death |
| listener leak ต่อ mount | symmetric cleanup ทุก exit path |
| CPU work บน main thread | worker/`spawn_blocking` + transferable payloads |
| sequential awaits นอก boot | `Promise.all` + bounded parallelism |
| lock ข้าม await | extract data → drop guard → await |

## Bundle, Assets, Native

| Symptom | Recipe |
|---------|--------|
| full-lib import | `lib/core` + registered subset, shared instance เดียว |
| fonts ทุกตัวตอน boot | UI font eager, feature fonts idle import |
| icon JSON ทั้ง set | per-icon imports / tree-shaken components |
| release build ไม่ optimize | `codegen-units=1` + thin LTO + `strip` |
| legacy build target | `es2022`+ ตาม modern WebView/runtime จริง |

## I/O And Storage

| Symptom | Recipe |
|---------|--------|
| write ต่อ keystroke/token | debounce + flush-on-idle/blur/exit |
| N+1 queries | `IN (...)`/join/batch loader |
| sync I/O ใน handler | async/`spawn_blocking`/worker |
| re-read static files | cache + mtime check |
