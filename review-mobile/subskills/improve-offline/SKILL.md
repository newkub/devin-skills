---
name: review-mobile-improve-offline
description: Apply offline findings — cache/queue/retry strategy, connectivity UX, sync conflicts
argument-hint: "[scope-or-findings]"
related:
  - review-mobile
  - run-test
  - report-before-after
---

## Goal

แก้ offline findings จาก `/review-mobile` จริง — offline-first behavior ที่ user ไม่เสียงานตอน network หลุด

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้
- ครอบคลุม: connectivity detection, offline queue, cache strategy, sync conflicts — lifecycle/state persistence fixes อยู่ parent `## Fix`

## Execute

### 1. Baseline

> Goal: รู้ offline behavior ปัจจุบัน

1. list flows ที่พังตอน offline จาก findings — reads vs writes แยกกัน
2. เลือก strategy ต่อ flow: cache-first / network-first / queue-and-sync
3. test setup — airplane-mode หรือ network link conditioner บน device/simulator

### 2. Fix Reads

> Goal: stale data ดีกว่า blank

1. cache layer สำหรับ reads — freshness indicator เมื่อ stale
2. offline indicator global + per-screen state (ไม่ใช่แค่ spinner ค้าง)
3. prefetch critical data ตอน online

### 3. Fix Writes

> Goal: mutations ไม่หายตอน offline

1. mutation queue — persist pending writes, retry เมื่อ reconnect, ordering preserved
2. conflict policy — last-write-wins / merge / manual resolution ตาม data type (documented)
3. UX — pending state visible (สี/label "waiting to sync"), ไม่ fake success

### 4. Verify

> Goal: offline flow ทำงานจริงบน device

1. airplane-mode test ทุก fixed flow — reads show cached, writes queue + sync
2. reconnect → queue drains, conflicts resolve ตาม policy
3. `/run-test` ผ่าน + `/report-before-after` — offline findings หายครบ

## Rules

- ห้าม fake success — mutation ที่ยังไม่ sync ต้องแสดง pending
- conflict policy ต้อง explicit ก่อน implement — ambiguous → `/ask-me`
- queue persistence ทน process death — in-memory queue ไม่นับ
- แยก commit: reads (cache) → writes (queue) → UX states

## Expected Outcome

- Offline flows ทำงานจริง: cached reads + queued writes + visible states
- Conflict policy documented และ tested
