# Concurrency Hazards Checklist — review-algorithm

## Shared Mutable State

- [ ] module-level mutable vars — counters, maps, caches ที่หลาย async paths แตะพร้อมกัน
- [ ] mutation ข้าม `await` — `let x = await f(); mutate(x); await g()` — x เปลี่ยนระหว่างกันได้
- [ ] shared arrays/objects — parallel loops ที่ write เข้า structure เดียวกัน
- [ ] singletons with state — class instances ที่ไม่ thread-safe แต่ใช้ข้าม requests

## Async Iteration Semantics

- [ ] `forEach(async …)` — ไม่รอ completes, ordering ไม่ guarantee, errors หลุด
- [ ] `for await` — sequential iteration, backpressure correct
- [ ] `map` + `Promise.all` — parallel, order preserved in results, all-or-nothing on first error
- [ ] `Promise.allSettled` — independent results, partial failures collected
- [ ] `reduce` with async — sequential accumulation, ordering matters

## Race Conditions

- [ ] check-then-act — `if (!cache.has(k)) cache.set(k, await f())` — duplicate f() calls
- [ ] read-modify-write — `counter++` ข้าม async boundary
- [ ] last-write-wins — concurrent updates ที่ silent overwrite
- [ ] initialization races — lazy init ที่ double-initialize บน concurrent first-use
- [ ] event ordering — handlers ที่ assume order แต่ events interleave

## Locks And Coordination

- [ ] mutex/semaphore สำหรับ critical sections — `Mutex`/`Semaphore`/`p-limit`
- [ ] request coalescing — duplicate in-flight requests dedup (single-flight)
- [ ] queue serialization — ops ที่ต้อง sequential ผ่าน queue ไม่ใช่ concurrent calls
- [ ] optimistic concurrency — version checks ก่อน write

## Cancellation And Timeouts

- [ ] `AbortController` — long ops cancellable, cleanup on abort
- [ ] timeout races — `Promise.race` vs proper timeout handling
- [ ] zombie work — cancelled ops ที่ยังทำต่อ (check aborted flag)
- [ ] cleanup on cancel — resources released เมื่อ task abort

## Worker And Parallelism

- [ ] worker message ordering — postMessage order preserved แต่ completion interleaved
- [ ] transferable objects — large data ไม่ serialize ซ้ำ
- [ ] worker pool bounds — max workers, queue overflow
- [ ] shared memory — `SharedArrayBuffer` + `Atomics` ถ้าใช้, fencing ถูก

## Detection

- grep `forEach(async`, `await` inside loops, module-level `let`/`var` mutable state
- grep `Promise.all`, `Promise.race`, `AbortController` usage patterns
- ตรวจ caches/counters ที่ access ข้าม async calls

Severity: data-corrupting race = Critical, lost updates = High, duplicate side effects = High, unbounded parallelism = Medium
