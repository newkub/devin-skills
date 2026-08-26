---
name: watch-cloudflare-and-fix-in-computer
description: หา Cloudflare project ในเครื่อง แล้ว watch และ fix จน deploy ผ่าน
related:
  - watch-cloudflare
  - list-project-git-in-computer
  - list-cloudflare-project
  - fix
---

## Goal

หา Cloudflare project ในเครื่องด้วย `list-project-git-in-computer` หรือ `list-cloudflare-project` แล้วทำ `/watch-cloudflare` พร้อม `/fix` จน deploy ผ่าน

## Scope

ใช้เมื่อรู้ชื่อ worker หรือ URL แต่ไม่ทราบ project path ใน local ต้องการหา project, watch status, และ fix จนสำเร็จ

## Execute

### 1. Identify Worker Or URL

> Goal: ระบุ worker ทีจะ watch

1. รับ `worker-name` หรือ URL จาก user
2. ถ้าไม่มี → ทำ `/ask-me` เพื่อขอข้อมูล
3. ตรวจ auth ด้วย `wrangler whoami`

### 2. Find Local Project

> Goal: หา project path ในเครื่อง

1. ทำ `/list-cloudflare-project` เพื่อหา local projects ทีมี `wrangler.*`
2. ถ้าไม่เจอ → ทำ `/list-project-git-in-computer` แล้ว filter ด้วย worker name หรือ remote URL
3. ถ้ามีหลาย project → ให้ user เลือกด้วย `/ask-me`
4. ยืนยัน `project-root` ก่อน watch

### 3. Watch And Fix

> Goal: watch จน deploy ผ่าน

1. ทำ `/watch-cloudflare` ด้วย worker name และ project-root ทีหาได้
2. ถ้าพบ error ทีต้องแก้ใน project → ทำ `/fix`
3. ถ้า deploy ใหม่ต้องการ build/deploy → ใช้ `/deploy-to-cloudflare`
4. วนซ้ำจนกว่า watch ผ่านหรือ timeout

### 4. Report

> Goal: สรุปผล

1. รายงาน project path, worker name, final status
2. ถ้ายังไม่ผ่าน → ระบุ error ค้างและ next step

## Rules

- ห้ามเดา project path ถ้าไม่ชัด
- ใช้ absolute path สำหรับ `project-root`
- ไม่แก้ไขนอก `project-root`
- ถ้าเจอหลาย match → ถาม user ก่อน
- รองรับ Cloudflare Workers, Pages และ Nitro

## Expected Outcome

- หา project path ที่ต้องการได้
- Watch deploy status จนผ่านหรือรายงานสาเหตุ
- Fix ใน project สำเร็จ
