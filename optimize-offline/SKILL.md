---
name: optimize-offline
description: ตั้ง offline-first strategy — service worker caching, fallback และ sync queue
argument-hint: "[strategy-or-route]"
related:
---

## Goal

ทำให้ web app ทำงานได้เมื่อ network ขาด/แย่ — service worker caching ที่ถูก, offline fallbacks และ sync strategy สำหรับ mutations ระหว่าง offline

## Scope

- ครอบคลุม: service worker setup, cache strategies (cache-first, network-first, stale-while-revalidate), offline pages, background sync, local data persistence
- Action-oriented: implement/adjust caching จริง — ทดสอบ offline behavior จริง
- ใช้เฉพาะ app ที่ offline มีคุณค่า — ไม่ใช่ทุก app ต้อง offline-first

## Execute

### 1. Assess Offline Needs

> Goal: ระบุว่าอะไรต้องทำงาน offline

1. จัดประเภท content: static shell, dynamic data, user mutations
2. ถาม user: read-only offline พอ หรือต้อง queue mutations ด้วย
3. ตรวจว่ามี service worker/PWA setup อยู่แล้วไหม (workbox, vite-plugin-pwa, serwist)

### 2. Design Cache Strategies

> Goal: เลือก strategy ต่อ resource type

1. Static assets (JS/CSS/fonts/images): cache-first + content-hash — ไม่ต้อง revalidate
2. HTML/navigation: network-first + offline fallback page
3. API reads: stale-while-revalidate สำหรับ data ที่ stale ได้, network-only สำหรับ critical
4. Mutations: ไม่ cache — background sync queue ถ้าต้อง offline write
5. กำหนด cache limits: max entries, max age, storage quota

### 3. Implement

> Goal: เขียน service worker ตาม design

1. ใช้ tooling ของ stack (`vite-plugin-pwa`, `serwist`, workbox) ไม่เขียน SW ดิบถ้าไม่จำเป็น
2. สร้าง offline fallback page/route
3. Implement strategies ตาม (2) พร้อม cache names ที่ versioned (invalidation ตอน deploy)
4. ถ้า offline writes: queue mutations + sync เมื่อ online กลับมา
5. Update flow: prompt user เมื่อมี SW ใหม่แทน skipWaiting เงียบๆ (หรือตาม UX ที่ต้องการ)

### 4. Test Offline Behavior

> Goal: ทดสอบจริงทุก scenario

1. DevTools offline mode: โหลด app, navigate, ดูว่า shell + cached data ทำงาน
2. Lie-fi (flaky network): ทดสอบ fallback timing
3. Mutations ขณะ offline → กลับมา online → sync สำเร็จ
4. Deploy update → cache invalidation ทำงาน ไม่ serve stale ตลอดกาล

### 5. Report

> Goal: สรุป coverage และ limitations

1. ตาราง: `No.`, `Resource Type`, `Strategy`, `Offline Works`, `Notes`
2. ระบุสิ่งที่ไม่ทำงาน offline โดย design (auth refresh, payment ฯลฯ)
3. คำแนะนำ monitoring: cache hit rates, sync failures

## Rules

### 1. Explicit Strategies

- ทุก resource type ต้องมี strategy ที่เลือกโดยตั้งใจ — ไม่มี default ลอยๆ
- Never cache: auth responses, user-specific mutations, sensitive data ที่ไม่ควร persist

### 2. Staleness Managed

- versioned caches + cleanup ตอน activate — ไม่ serve stale content ไม่รู้จบ
- update flow ชัดเจน — user ไม่ค้างบน version เก่า

### 3. Tested Offline

- ต้องทดสอบจริงใน offline/flaky modes — ไม่ assume จาก config
- sync queue ต้องมี conflict/error handling

## Expected Outcome

- App ใช้งานได้เมื่อ offline ตาม scope ที่ออกแบบ
- Cache strategies ชัดเจนต่อ resource type พร้อม limits
- Update/invalidation flow ถูกต้อง
