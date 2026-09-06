---
name: cleanup-docker
description: ล้าง Docker images, containers, volumes และ build cache ที่ไม่ใช้เพื่อคืนพื้นที่
argument-hint: "[--images|--volumes|--all]"
related:
  - optimize-docker
  - check-size
  - cleanup-files-in-computer
  - run-clean
  - ask-me
  - report-table
---

## Goal

ล้าง Docker resources ที่ไม่ใช้แล้ว — dangling images, stopped containers, unused volumes, build cache — เพื่อคืนพื้นที่ disk อย่างปลอดภัย

## Scope

- ครอบคลุม: `docker system`, images, containers, volumes, build cache, networks
- Destructive: ต้อง dry-run (แสดง reclaimable) + user confirmation ก่อนลบ
- ข้าม: running containers, volumes ที่ mount อยู่, images ที่ใช้ล่าสุด

## Execute

### 1. Survey Usage

> Goal: วัดพื้นที่และ resources ปัจจุบัน

1. `docker system df` — ดู reclaimable space แยกตามประเภท
2. `docker images`, `docker ps -a`, `docker volume ls`, `docker network ls` — รวบรวมทั้งหมด
3. `docker builder du` — ดู build cache breakdown

### 2. Classify Candidates

> Goal: แยกสิ่งที่ลบได้ออกจากที่ต้องเก็บ

1. **Safe**: dangling images (`<none>`), stopped containers >N วัน, unused networks, build cache
2. **Caution**: tagged images ที่ไม่มี container ใช้, volumes ที่ไม่ attach
3. **Keep**: running containers, volumes ที่ mount, images ของ active projects, base images ล่าสุด
4. เช็ค volumes กับ compose files ใน project — named volumes อาจมี data สำคัญ

### 3. Dry-Run Report

> Goal: แสดงสิ่งที่จะลบและพื้นที่ที่จะคืน

1. ใช้ table: `No.`, `Resource`, `Type`, `Size`, `Last Used`, `Safe`
2. สรุป reclaimable total จาก `docker system df`
3. **รอ user confirmation ผ่าน `/ask-me` ก่อนลบ**

### 4. Clean

> Goal: ลบตาม scope ที่ confirm

1. `docker container prune` — stopped containers
2. `docker image prune` — dangling; `docker image prune -a` เฉพาะถ้า user เลือก
3. `docker volume prune` — เฉพาะหลังยืนยันว่าไม่มี data สำคัญ
4. `docker builder prune` — build cache
5. `docker network prune` — unused networks
6. หรือ `docker system prune` ตาม scope — อย่าใส่ `-a`/`--volumes` ถ้าไม่ได้ confirm ชัดเจน

### 5. Verify

> Goal: ยืนยันพื้นที่คืนและไม่มีอะไรพัง

1. `docker system df` อีกครั้ง — เทียบ reclaimable ก่อน/หลัง
2. ยืนยัน running containers ยังทำงาน — `docker ps`
3. รายงานพื้นที่ที่คืนได้จริง

## Rules

### 1. Confirmation Required

- ห้าม prune โดยไม่แสดง reclaimable ก่อนและได้รับยืนยัน
- `prune -a` และ `--volumes` เป็น destructive มาก — ต้อง explicit approval แยก

### 2. Data Safety

- volumes อาจมี database data — ตรวจก่อนลบเสมอ
- ถ้าไม่แน่ใจว่า volume สำคัญไหม → เก็บไว้และ flag ให้ user ตัดสินใจ

### 3. Evidence-Based

- รายงานขนาดจริงจาก `docker system df` ไม่ใช่คาดเดา
- ระบุ last-used หรือ created date เมื่อช่วยตัดสินใจได้

## Expected Outcome

- พื้นที่ disk คืนตามที่รายงาน พร้อมตัวเลขจริง
- ไม่มี running services หรือ data สำคัญที่ถูกลบ
- รายการ resources ที่เก็บไว้พร้อมเหตุผล
