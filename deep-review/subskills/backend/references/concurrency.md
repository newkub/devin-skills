# Concurrency And Transactions Checklist — review-backend

## Race Conditions

- [ ] check-then-act patterns — read-modify-write ที่ไม่ atomic (`if (count > 0) decrement()`)
- [ ] shared mutable state — in-process maps/counters ที่หลาย request แตะพร้อมกัน (จะพังเมื่อ scale >1 instance)
- [ ] async ordering — fire-and-forget ที่ assume order (`send(); write()` ที่ write ต้องก่อน)
- [ ] TOCTOU — file/resource checks ก่อนใช้ที่ state เปลี่ยนระหว่างกัน
- [ ] optimistic vs pessimistic — `version` column compare-and-swap vs `SELECT ... FOR UPDATE` เลือกถูก

## Transactions

- [ ] multi-write operations อยู่ใน transaction เดียว — ไม่มี partial commits
- [ ] isolation level เหมาะ — read-committed default, serializable เมื่อต้องกัน phantom/anomaly
- [ ] transaction scope สั้น — ไม่ครอบ network calls/slow work ค้าง locks
- [ ] lock ordering consistent — deadlock น้อยลงเมื่อทุก path lock ลำดับเดียวกัน
- [ ] transaction boundaries ชัด — service layer เป็นเจ้าของ, ไม่ฝั่งข้าม repository calls แบบหละหลวม

## Idempotency

- [ ] retry-safe endpoints — POST ที่ retry ได้โดยไม่สร้าง duplicates (idempotency keys)
- [ ] dedup mechanism — unique constraints, upserts, processed-message table
- [ ] exactly-once semantics — side effects ครั้งเดียวต่อ logical operation (outbox pattern ถ้าจำเป็น)
- [ ] client-generated ids — safe retries ข้าม network failures

## Async And Parallelism

- [ ] `Promise.all`/`join` error handling — ไม่มี unhandled rejections หลุด
- [ ] parallel work bounded — `p-limit`/semaphore, ไม่ fan-out 1000 tasks พร้อมกัน
- [ ] no shared await state — mutable vars ข้าม `await` ที่ race ได้
- [ ] background tasks — crash-safe (persistent queue) ไม่ใช่ in-memory fire-and-forget สำหรับงานสำคัญ

## Distributed Concerns

- [ ] distributed locks — TTL + fencing tokens ถ้าใช้, ไม่ hold นาน
- [ ] leader election/fencing — split-brain ไม่ทำ dual writes
- [ ] clock assumptions — `Date.now()` comparisons ข้าม machines ไม่ monotonic
- [ ] multi-instance safety — code assume single-writer แต่ deploy หลาย replicas

## Detection

- grep `Promise.all`, `forEach(async`, shared module-level mutable state
- grep `SELECT.*FOR UPDATE`, transaction helpers, `version` fields
- ตรวจ unique constraints vs application-level dedup

Severity: data-corrupting race = Critical, non-atomic multi-write = High, missing idempotency on payment/write endpoints = High, unbounded fan-out = Medium
