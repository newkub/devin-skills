---
name: scan-io-persistence
description: Scan I/O and persistence — serialization, write batching, query patterns, file access
---

# Scan I/O And Persistence

## Goal

disk/DB/storage work ไม่ทำซ้ำ — serialize ครั้งเดียว, write batch, query เฉพาะที่ต้อง

## Checks

1. Serialize-per-mutation — `JSON.stringify` ทั้ง object ทุก state change (persist middleware, auto-save) — เช็คว่า debounce/diff ก่อน write
2. Write frequency — localStorage/file/DB write ต่อ keystroke, drag, scroll, token — ควร batch ต่อ interval หรือ flush ตอน idle/blur
3. Read patterns — re-read ค่าเดิมทุกครั้ง (config, port, schema) ที่ cache ได้; `readFile` ต่อ call แทน cache+mtime check
4. Query patterns — N+1 (query ต่อ row ใน loop), `SELECT *` ทั้งที่ต้อง subset, missing index บน hot queries, sequential queries ที่ batch/parallel ได้
5. Transaction scope — write ทีละ row แทน transaction เดียว; sync I/O บน main/IPC thread ที่ควร `spawn_blocking`/worker
6. Serialization cost — deep clone (`structuredClone`, spread) ของ state ใหญ่ต่อ mutation; IPC payload ที่ serialize ข้อมูลซ้ำซ้อน
7. File enumeration — recursive scans, `readdir`+`stat` per file ทุก poll ที่ incremental/watch ได้
8. Compression/format — JSON ขนาดใหญ่ที่ binary/delta ได้; pretty-print ใน prod path

## Severity

- Critical: serialize+write ทั้ง store ต่อ keystroke/token บน main thread — jank ตรงๆ
- High: N+1 queries บน hot path, sync file I/O ใน request/IPC handler
- Medium: missing debounce, sequential batchable queries, re-read static files
- Low: format/compression tuning, payload trimming
