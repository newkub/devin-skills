---
name: scan-memory
description: Scan memory — leaks, unbounded growth, retention, allocation churn
---

# Scan Memory

## Goal

heap ไม่โตไม่รู้จบ — caches bounded, listeners removed, retention เหมาะสม

## Checks

1. Unbounded maps/caches — `Map`, `Set`, plain objects ที่ `set`/`push` แต่ไม่เคย evict — history buffers, dedup sets, session stores
2. Listener accumulation — `addEventListener`, `listen()`, `on()`, subscriptions ที่ mount ทุกครั้งแต่ cleanup ไม่ครบ (unmount, route change, reconnect)
3. Closures ที่ถือ references ใหญ่ — timers/observers ที่ capture state ทั้ง tree, callbacks ใน long-lived registries
4. Detached DOM — nodes ที่ remove จาก tree แต่ยังถูก JS ถืออยู่ (tooltip refs, modal pools)
5. Large data retention — full file contents, parsed ASTs, decoded images ที่เก็บต่อ component/tab ที่ hidden
6. Allocation churn ใน hot paths — object/array literals, string concat, spread copies ต่อ frame/tick/event
7. Buffer/stream memory — accumulated chunks, logs ที่โตไม่รู้จบ, ring buffers ที่ไม่ได้ bound
8. Duplicate stores — reactive state ที่ copy ข้อมูลเดียวกันหลายที่ (normalized vs duplicated)
9. Native/webview memory — webview pools, suspended tabs, buffers ใน Rust/Go ที่ไม่ shrink

## Severity

- Critical: unbounded growth ใน long-lived store — heap โตตลอด session จน app ช้า/crash
- High: listener/timer leaks ต่อ mount, large retention ต่อ hidden view
- Medium: allocation churn บน hot path, duplicate state
- Low: cache sizing เล็กน้อย, buffer tuning
