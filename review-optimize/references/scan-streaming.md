---
name: scan-streaming
description: Scan streaming/reactive updates — per-token re-render, O(n²) parse-on-grow
---

# Scan Streaming And Reactive Updates

## Goal

token/event streams ไม่ทำให้ UI re-render + re-parse ทุก delta — ลด O(n²) เป็น O(n)

## Checks

1. `for await (const delta of stream)` / `onmessage` / socket handlers ที่ `setState`/`setStore` ต่อ delta — นับ render frequency vs flush interval
2. Re-parse บน content ที่โตขึ้น — markdown render, `DOMPurify.sanitize`, syntax highlight, `JSON.parse` ต่อ token ของข้อความเดิม = O(n²) total work
3. Array/object copy ต่อ delta — `msgs.map(...)`, `{...x}` spread ทั้ง array ต่อ token — เช็คว่า derive เป็น O(items) ต่อ delta
4. Derived computations ที่ re-run ต่อ update — `parseBlocks`, `renderMarkdown`, syntax trees ที่ไม่ memoize ตาม content
5. Persistence per-update — localStorage/DB write ต่อ token ที่ไม่ debounce
6. Scroll-follow per delta — `scrollTo`/`scrollIntoView` ต่อ chunk
7. Multiple consumers ของ stream เดียวกัน — แต่ละจุด re-render แยกกัน
8. Stream teardown — `finally` flush tail, abort controller, listener cleanup ครบไหม

## Severity

- Critical: re-render + full re-parse (markdown/sanitize) ต่อ token — quadratic growth
- High: setState ต่อ delta ไม่มี batching, persist ต่อ delta
- Medium: derived compute ที่ไม่ memoize ต่อ flush, scroll ต่อ delta
- Low: cosmetic throttle gap (< 1 render/frame ส่วนเกิน)
