---
name: scan-polling-ipc
description: Scan polling, timers, IPC/bridge calls — repeated work that caches or gates
---

# Scan Polling And IPC

## Goal

ลดงานซ้ำ — timers ที่ไม่จำเป็น, IPC/bridge calls ที่ cache ได้, poll ตอนไม่มีใครดู

## Checks

1. `setInterval`/`setTimeout` loops — interval ต่อ item แทน tick เดียว, ไม่มี visibility gate (`document.visibilityState`), ไม่มี cleanup ใน unmount
2. IPC/bridge calls ที่ค่าไม่เปลี่ยน — `invoke("get_port")`/`get_config` ทุก tick ทั้งที่ fix ตั้งแต่ init → cache promise ครั้งเดียว
3. Native polls ที่หนัก — enumerate process/disk/fs ทุกครั้งทั้งที่ต้องแค่ subset (เช่น `refresh_processes` full vs `refresh_processes_specifics`)
4. Webview evals — inject script ต่อ tab ต่อ tick; probe เฉพาะ visible/active
5. Watchers/observers — `ResizeObserver`, `MutationObserver`, fs watchers ที่ fire ต่อ frame ไม่ throttle
6. Clipboard/selection polling — frequent native reads ที่ event-driven แทนได้
7. `setInterval` overlap — recursive `setTimeout` vs interval ที่ทับซ้อนเมื่องานช้ากว่า interval
8. Timer density — หลาย timers ต่าง interval ที่ coalesce เป็น tick เดียวได้

## Severity

- Critical: poll ทำ heavy native/webview work ทุก < 5s โดยไม่มี visibility gate
- High: IPC call ซ้ำค่าเดิมต่อ item ต่อ tick, full process-table scan ต่อ poll
- Medium: missing visibility gate, interval สั้นกว่าที่ UI ต้องการ
- Low: timer coalescing, interval tuning เล็กน้อย
