---
name: follow-tanstack-db
description: ตั้งค่า TanStack DB สำหรับ reactive client store และ live queries
---

## Goal

ตั้งค่า TanStack DB สำหรับ reactive client-side data store พร้อม collections และ live queries

## Scope

ใช้สำหรับ TanStack DB (beta) ใน React, Solid, Vue projects ที่ต้องการ normalized data storage

## Execute

### 1. Setup And Collections

1. ติดตั้งด้วย `bun add @tanstack/db`
2. สร้าง collections ด้วย `createCollection` พร้อม typed schemas
3. เลือก data source: TanStack Query, sync engine (ElectricSQL, PowerSync), หรือ localStorage
4. ใช้ `queryCollectionOptions` สำหรับ TanStack Query integration

### 2. Sync Modes

1. Eager mode (default): load ทั้งหมด upfront เหมาะสำหรับ <10k rows static data
2. On-demand mode: load เฉพาะที่ query ขอ เหมาะสำหรับ >50k rows
3. Progressive mode: load subset ก่อน sync เต็มหลังบ้าน เหมาะสำหรับ collaborative apps

### 3. Live Queries

1. ใช้ `useLiveQuery` สำหรับ reactive queries ใน components
2. Query เป็น reactive - auto-update เมื่อ data เปลี่ยน
3. ใช้ derived collections สำหรับ materialised views
4. TanStack DB รวม duplicate requests และทำ delta loading อัตโนมัติ

### 4. Local-Only Collections

1. ใช้ `LocalStorageCollection` สำหรับ state ที่ persist ข้าม sessions
2. รองรับ cross-tab sync
3. ใช้สำหรับ user preferences และ settings

## Rules

### 1. Collection Best Practices

- เลือก sync mode ตาม data size และ access pattern
- ใช้ typed schemas สำหรับ type safety
- ใช้ TanStack Query integration สำหรับ API data
- ใช้ sync engine integration สำหรับ real-time sync
- ใช้ LocalStorageCollection สำหรับ local-only state

### 2. Performance

- ใช้ on-demand mode สำหรับ large datasets
- ใช้ progressive mode สำหรับ instant first paint
- ใช้ delta loading สำหรับ incremental updates
- ใช้ derived collections สำหรับ computed views

## Expected Outcome

- TanStack DB ติดตั้งพร้อม typed collections
- Sync mode เหมาะสมกับ data size และ access pattern
- Live queries reactive ใน components
- LocalStorageCollection สำหรับ persistent state
- TanStack Query integration สำหรับ API data fetching
